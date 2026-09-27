import asyncio
import base64
import json

import httpx
import pytest

from app.config import Settings
from app.diagnosis import extract_json
from app.main import create_app
from app.nim_client import NimClient

VALID_REPORT = {
    "cropName": "Olive (Olea europaea)",
    "diseaseName": "Olive peacock spot",
    "scientificName": "Venturia oleaginea",
    "confidenceScore": 87,
    "severity": "medium",
    "summary": "Fungal leaf spot common in humid Algerian orchards.",
    "symptoms": ["Circular dark spots", "Yellow halo", "Leaf drop"],
    "alternativeHypotheses": [
        {"conditionName": "Boron deficiency", "probability": "12%", "distinguishingFactor": "No rings"}
    ],
    "waterAdvisor": {
        "dailyRequirement": "25-35 L/tree twice weekly",
        "irrigationSchedule": "Dawn drip",
        "soilMoistureTarget": "55-65%",
        "droughtMitigationTip": "Mulch the basin",
    },
    "quantumOptimization": {
        "efficiencyGainPercent": 150,
        "statusText": "Pulse drip",
        "rootZoneTargeting": "40-60 cm",
        "stressIndex": "Low",
    },
    "treatments": {
        "organicRemedy": "Bordeaux mixture after pruning",
        "chemicalTreatment": "Copper-based fungicide per label",
        "culturalPractices": ["Prune for airflow", "Remove fallen leaves"],
    },
}


def completion(content: str) -> dict:
    return {"choices": [{"message": {"role": "assistant", "content": content}}]}


def make_client(handler, api_key="nvapi-test"):
    settings = Settings(
        nvidia_api_key=api_key,
        nvidia_base_url="https://nim.test/v1",
        text_models=["text-a", "text-b"],
        vision_models=["vision-a"],
    )
    nim = NimClient(settings, transport=httpx.MockTransport(handler))
    app = create_app(settings, nim)
    return httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://backend")


def call(handler, method, path, api_key="nvapi-test", **kwargs):
    async def run():
        async with make_client(handler, api_key) as client:
            return await client.request(method, path, **kwargs)

    return asyncio.run(run())


def test_health_reports_configuration():
    r = call(lambda req: httpx.Response(500), "GET", "/health")
    assert r.status_code == 200
    assert r.json()["aiConfigured"] is True


def test_text_diagnosis_normalises_model_output():
    seen = []

    def handler(req: httpx.Request):
        body = json.loads(req.content)
        seen.append(body)
        assert req.headers["authorization"] == "Bearer nvapi-test"
        payload = {"reply": "Your olive tree has peacock spot.", "report": VALID_REPORT}
        # Models often wrap JSON in fences and chatter; the parser must cope.
        return httpx.Response(200, json=completion(f"Sure!\n```json\n{json.dumps(payload)}\n```"))

    r = call(handler, "POST", "/api/v1/diagnose", json={"prompt": "olive leaves have spots", "language": "en"})
    assert r.status_code == 200, r.text
    data = r.json()
    report = data["report"]
    assert data["model"] == "text-a"
    assert data["reply"] == "Your olive tree has peacock spot."
    assert report["severity"] == "MODERATE"
    assert report["alternativeHypotheses"][0]["probability"] == 12
    assert report["quantumOptimization"]["efficiencyGainPercent"] == 100
    assert report["id"] and report["safetyDisclaimer"].startswith("Agricultural safety notice")
    assert seen[0]["model"] == "text-a"
    assert seen[0]["messages"][0]["role"] == "system"
    assert "English" in seen[0]["messages"][0]["content"]


def test_retired_model_falls_back_to_next():
    def handler(req: httpx.Request):
        if json.loads(req.content)["model"] == "text-a":
            return httpx.Response(410, json={"detail": "end of life"})
        return httpx.Response(200, json=completion(json.dumps({"reply": "ok", "report": VALID_REPORT})))

    r = call(handler, "POST", "/api/v1/diagnose", json={"prompt": "tomato"})
    assert r.status_code == 200, r.text
    assert r.json()["model"] == "text-b"


def test_image_uses_vision_model_with_inline_image():
    image_b64 = base64.b64encode(b"\xff\xd8\xff fake jpeg").decode()

    def handler(req: httpx.Request):
        body = json.loads(req.content)
        assert body["model"] == "vision-a"
        assert len(body["messages"]) == 1
        assert f"data:image/jpeg;base64,{image_b64}" in body["messages"][0]["content"]
        return httpx.Response(200, json=completion(json.dumps({"reply": "ok", "report": VALID_REPORT})))

    r = call(handler, "POST", "/api/v1/diagnose", json={"prompt": "", "imageBase64": image_b64})
    assert r.status_code == 200, r.text


def test_unparseable_output_is_repaired_once():
    calls = []

    def handler(req: httpx.Request):
        calls.append(json.loads(req.content))
        if len(calls) == 1:
            return httpx.Response(200, json=completion("The plant has blight, water less."))
        return httpx.Response(200, json=completion(json.dumps({"reply": "fixed", "report": VALID_REPORT})))

    r = call(handler, "POST", "/api/v1/diagnose", json={"prompt": "potato"})
    assert r.status_code == 200, r.text
    assert r.json()["model"] == "text-a+text-a"
    assert "The plant has blight" in calls[1]["messages"][1]["content"]


def test_bad_key_returns_503_so_app_uses_offline_mode():
    r = call(lambda req: httpx.Response(401, json={"detail": "Authentication failed"}), "POST", "/api/v1/diagnose", json={"prompt": "x"})
    assert r.status_code == 503
    assert r.json()["error"] == "ai_unavailable"


def test_missing_key_returns_503():
    r = call(lambda req: pytest.fail("should not call NIM"), "POST", "/api/v1/diagnose", api_key="", json={"prompt": "x"})
    assert r.status_code == 503


def test_request_validation():
    never = lambda req: pytest.fail("should not call NIM")
    assert call(never, "POST", "/api/v1/diagnose", json={"prompt": "  "}).status_code == 400
    assert call(never, "POST", "/api/v1/diagnose", json={"imageBase64": "not base64!!"}).status_code == 400
    assert call(never, "POST", "/api/v1/diagnose", json={"imageBase64": "A" * 200_000}).status_code == 413
    assert call(never, "POST", "/api/v1/diagnose", json={"prompt": "x", "language": "de"}).status_code == 422


def test_extract_json_handles_braces_inside_strings():
    assert extract_json('noise {"a": "x } y", "b": {"c": 1}} trailing') == {"a": "x } y", "b": {"c": 1}}
    with pytest.raises(ValueError):
        extract_json("no json here")
