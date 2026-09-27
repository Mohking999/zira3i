# Zira3i AI — Backend

FastAPI service between the Android app and **NVIDIA NIM**. It keeps the AI key off the phone, picks a vision model when a photo is attached and a text model otherwise, and returns a validated `DiagnosticReport` that maps 1:1 onto the Kotlin model.

```
Android app ──POST /api/v1/diagnose──▶ FastAPI ──▶ NVIDIA NIM (integrate.api.nvidia.com)
     │                                    │  model fallback on 404/410/429/5xx
     │                                    │  lenient JSON extraction + 1 repair pass
     │                                    │  pydantic validation / clamping
     └── on any failure: on-device knowledge base (offline mode)
```

## Run

```bash
cd backend
pip install -r requirements-dev.txt
cp .env.example .env          # put your nvapi-... key in NVIDIA_API_KEY
uvicorn app.main:app --host 0.0.0.0 --port 8000
python -m pytest -q           # 9 tests, NVIDIA is mocked
```

Docker: `docker build -t zira3i-backend . && docker run -p 8000:8000 --env-file .env zira3i-backend`

## API

`GET /health` → `{"status":"ok","aiConfigured":true,"textModels":[...],"visionModels":[...]}`

`POST /api/v1/diagnose`

```json
{ "prompt": "أوراق الزيتون فيها بقع دائرية", "language": "ar", "imageBase64": "<optional jpeg base64>" }
```

→ `200 {"reply": "...", "report": {DiagnosticReport}, "model": "mistralai/mistral-large-2-instruct"}`

| Status | Meaning | App behaviour |
|---|---|---|
| 400 / 413 / 422 | bad input (empty, bad base64, image > 180k chars, unknown language) | offline KB |
| 502 `ai_error` | every model failed or output unparseable | offline KB |
| 503 `ai_unavailable` | key missing or rejected by NVIDIA | offline KB |

## Configuration

| Env var | Default |
|---|---|
| `NVIDIA_API_KEY` (alias `ZIRA3I_API_KEY`) | — |
| `ZIRA3I_TEXT_MODELS` | `mistralai/mistral-large-2-instruct,nvidia/llama-3.1-nemotron-70b-instruct,google/gemma-3-12b-it` |
| `ZIRA3I_VISION_MODELS` | `meta/llama-3.2-90b-vision-instruct,meta/llama-3.2-11b-vision-instruct` |
| `ZIRA3I_TIMEOUT_S` / `ZIRA3I_MAX_TOKENS` | `60` / `2048` |

NVIDIA retires models often (e.g. `meta/llama-3.1-8b-instruct` returns 410 since 2026-08-26). List what's live with
`curl https://integrate.api.nvidia.com/v1/models`.
