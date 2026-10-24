 The backend branch, feature/backend-mobile, is a mobile app + AI backend integration branch for Zira3i
 In plain terms, it adds a Python FastAPI service that sits between the Android app and NVIDIA NIM, so the phone does not store the API key and the AI processing happens server-side. The backend exposes:

  GET /health for service status
  POST /api/v1/diagnose for crop/plant diagnosis requests
  model selection for text vs. image requests
  fallback to an offline Algerian-crop knowledge base if the AI service fails or the key is missing
  From the branch structure, it includes:

backend/ — FastAPI app, requirements, Dockerfile, .env example, tests
backend/app/ — config, diagnosis logic, main server, NVIDIA client, schemas
app/ — Android app code and build setup for integrating with the backend
root README — instructions for running the app locally and connecting the mobile app to the backend via ZIRA3I_BACKEND_URL
So the branch is mainly about:

backend AI diagnosis service
Android app connectivity to that backend
safe API-key handling
local/dev setup and Docker deployment
graceful offline fallback when AI is unavailable
Core idea: This branch turns the project into a mobile + backend architecture:

Android app sends diagnosis requests
FastAPI backend handles them
backend calls NVIDIA NIM for AI inference
if AI fails, it falls back to an offline local knowledge base
Architecture map 1: request flow
Android App
   │
   │ HTTP POST /api/v1/diagnose
   ▼
FastAPI Backend (Python)
   │
   ├─ validates request
   ├─ picks text model or vision model
   ├─ calls NVIDIA NIM
   │     ├─ success: parse + validate output
   │     └─ failure: retry/fallback
   │
   └─ if AI unavailable or fails:
         fallback to offline Algerian crop knowledge base
    Architecture map 2: backend structure
    feature/backend-mobile
├─ app/                         # Android app module
│  └─ src/                     # Kotlin/Android code
│
├─ backend/
│  ├─ app/
│  │  ├─ main.py               # FastAPI app entry
│  │  ├─ config.py             # env config
│  │  ├─ diagnosis.py          # diagnosis pipeline logic
│  │  ├─ nim_client.py         # NVIDIA NIM API client
│  │  ├─ schemas.py            # request/response models
│  │  └─ __init__.py
│  │
│  ├─ tests/                   # pytest tests
│  ├─ requirements.txt
│  ├─ requirements-dev.txt
│  ├─ Dockerfile
│  ├─ .env.example
│  └─ README.md
│
├─ README.md
├─ build.gradle.kts
├─ settings.gradle.kts
└─ gradlew
Architecture map 3: AI decision flow
User uploads photo?
   ├─ Yes → Vision model
   │        └─ NVIDIA Llama vision model
   │
   └─ No → Text model
            └─ NVIDIA text model (e.g. Mistral / Llama)
  Then:

output is parsed
Pydantic validates the structure
if validation fails or model returns error:
backend responds with fallback diagnosis
app still works offline
Tech stack and components

Mobile client:

Android app
Gradle build system
Kotlin-based Android project structure
Backend:

Python
FastAPI
Uvicorn (ASGI server)
Pydantic for validation
AI provider:

NVIDIA NIM via integrate.api.nvidia.com
configurable model lists:
text models
vision models
support for model fallback on common errors:
404
410
429
5xx
Dev/testing:

pytest
requirements-dev.txt
Docker for containerized backend deployment
Configuration:

env vars such as:
NVIDIA_API_KEY
ZIRA3I_API_KEY
ZIRA3I_TEXT_MODELS
ZIRA3I_VISION_MODELS
ZIRA3I_TIMEOUT_S
ZIRA3I_MAX_TOKENS
Deployment:

Docker image
uvicorn app.main:app --host 0.0.0.0 --port 8000
optional PM2/Node style script exists in the older branch structure, but the backend branch itself is clearly Python/FastAPI centered
Key design qualities of this branch

Security:
API key kept on server, not in mobile app
Resilience:
AI failures do not completely break the app
Modularity:
separate app, backend, tests, and configuration
Production-minded:
Docker, env config, validation, model fallback          
