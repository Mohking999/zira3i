"""Agronomy-doctor pipeline: prompt -> NIM (vision or text model) -> strict JSON -> validated report."""

import json
import logging
import re
import uuid

from pydantic import ValidationError

from .config import Settings
from .nim_client import NimClient, NimError
from .schemas import DiagnoseRequest, DiagnoseResponse, DiagnosticReport

log = logging.getLogger("zira3i.diagnosis")

LANGUAGE_NAMES = {"ar": "Modern Standard Arabic", "fr": "French", "en": "English"}

SAFETY_DISCLAIMERS = {
    "ar": "تنبيه أمان زراعي: تجنب الاستخدام العشوائي للمبيدات الفطرية أو الكيميائية. يجب الالتزام الصارم بالجرعات الموصى بها وفترة الأمان قبل الجني (PHI)، واستشارة مهندس وقاية النباتات المعتمد في منطقتك الزراعية.",
    "fr": "Avertissement de sécurité : évitez l'usage aléatoire de fongicides ou de produits chimiques. Respectez strictement les doses homologuées et le délai avant récolte (DAR), et consultez un ingénieur agronome agréé de votre région.",
    "en": "Agricultural safety notice: avoid indiscriminate use of fungicides or chemicals. Strictly follow label doses and the pre-harvest interval (PHI), and consult a certified plant-protection engineer in your region.",
}

REPORT_SCHEMA_HINT = """{
  "reply": "2-5 sentence conversational answer to the farmer, markdown allowed",
  "report": {
    "cropName": "common name (Latin binomial)",
    "diseaseName": "most likely condition, or 'healthy' / 'unclear'",
    "scientificName": "pathogen / disorder scientific name, or empty string",
    "confidenceScore": 0-100 integer,
    "severity": "LOW" | "MODERATE" | "HIGH",
    "summary": "2-3 sentences, include Algerian/North African context where relevant",
    "symptoms": ["3-5 observed or expected symptoms"],
    "alternativeHypotheses": [{"conditionName": "", "probability": 0-100, "distinguishingFactor": "how to tell it apart"}],
    "waterAdvisor": {"dailyRequirement": "", "irrigationSchedule": "", "soilMoistureTarget": "", "droughtMitigationTip": ""},
    "quantumOptimization": {"efficiencyGainPercent": 10-45 integer, "statusText": "", "rootZoneTargeting": "", "stressIndex": ""},
    "treatments": {"organicRemedy": "", "chemicalTreatment": "", "culturalPractices": ["3-4 items"]}
  }
}"""


def build_system_prompt(language: str) -> str:
    lang = LANGUAGE_NAMES[language]
    return f"""You are Zira3i AI (زرعي), an expert agronomist and plant pathologist specialised in Algerian and North African agriculture (olives, date palms, wheat/barley, potatoes, tomatoes, citrus, peppers, grapes) under semi-arid, water-scarce conditions.

Task: diagnose the farmer's crop problem from their description and/or photo, and give practical, water-efficient advice.

Rules:
- Be honest about uncertainty. If the photo is unclear, not a plant, or information is insufficient, say so, lower confidenceScore (below 50) and ask for a clearer close-up photo of the affected leaves/fruit in "reply".
- confidenceScore must reflect real certainty; never exceed 95. alternativeHypotheses: 1-3 items.
- Irrigation advice must be concrete (litres/tree, mm/day or m³/ha, time of day, soil moisture target) and adapted to drought and saline water.
- "quantumOptimization" describes an optimised irrigation schedule (pulse drip, root-zone targeting, deficit irrigation) with a realistic estimated water saving.
- Chemical treatment: name active ingredients only (no brand names), never give doses beyond the product label, prefer integrated pest management, and say when no chemical cure exists (e.g. viruses).
- Never recommend banned or highly hazardous pesticides.
- Write every human-readable string value in {lang}. Keep JSON keys and severity values exactly as specified in English.

Respond with ONLY a single JSON object, no markdown fences, no text before or after, following this shape:
{REPORT_SCHEMA_HINT}"""


def build_messages(req: DiagnoseRequest) -> list[dict]:
    system = build_system_prompt(req.language)
    question = req.prompt.strip() or "Please examine the attached crop photo and diagnose any problem."
    user_text = f"Farmer's question: {question}"

    if req.imageBase64:
        # NIM's vision models take the image inline as an <img> tag, and the Llama 3.2
        # vision endpoints don't accept a system message alongside an image, so the
        # instructions go in the user turn.
        img = f'<img src="data:{req.imageMimeType};base64,{req.imageBase64}" />'
        return [{"role": "user", "content": f"{system}\n\n{user_text}\n{img}"}]

    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user_text},
    ]


_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.IGNORECASE)


def extract_json(text: str) -> dict:
    """Parse the first balanced top-level JSON object in model output."""
    text = _FENCE.sub("", text.strip())
    start = text.find("{")
    if start < 0:
        raise ValueError("no JSON object in model output")
    depth, in_str, escape = 0, False, False
    for i in range(start, len(text)):
        ch = text[i]
        if in_str:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_str = False
        elif ch == '"':
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return json.loads(text[start : i + 1])
    raise ValueError("unterminated JSON object in model output")


def to_response(payload: dict, language: str, model: str) -> DiagnoseResponse:
    # Accept both {"reply", "report"} and a bare report object.
    report_data = payload.get("report", payload) if isinstance(payload, dict) else {}
    if not isinstance(report_data, dict):
        raise ValueError("report is not an object")
    report_data = {**report_data, "id": str(uuid.uuid4()), "safetyDisclaimer": SAFETY_DISCLAIMERS[language]}
    report = DiagnosticReport.model_validate(report_data)
    reply = str(payload.get("reply") or report.summary).strip()
    return DiagnoseResponse(reply=reply, report=report, model=model)


class DiagnosisService:
    def __init__(self, settings: Settings, nim: NimClient):
        self._settings = settings
        self._nim = nim

    async def diagnose(self, req: DiagnoseRequest) -> DiagnoseResponse:
        models = self._settings.vision_models if req.imageBase64 else self._settings.text_models
        raw, model = await self._nim.chat(models, build_messages(req))
        try:
            return to_response(extract_json(raw), req.language, model)
        except (ValueError, ValidationError) as first_error:
            log.warning("model %s returned unparseable output (%s); attempting repair", model, first_error)

        # One repair pass with a text model: cheaper and more reliable than re-running vision.
        repair = [
            {"role": "system", "content": "You convert text into strictly valid JSON. Output only JSON."},
            {
                "role": "user",
                "content": f"Rewrite the following as one valid JSON object with exactly this shape:\n"
                f"{REPORT_SCHEMA_HINT}\n\nKeep the language of the values unchanged.\n\nTEXT:\n{raw}",
            },
        ]
        fixed, repair_model = await self._nim.chat(self._settings.text_models, repair, temperature=0.0)
        try:
            return to_response(extract_json(fixed), req.language, f"{model}+{repair_model}")
        except (ValueError, ValidationError) as e:
            raise NimError(f"model output could not be parsed: {e}") from e
