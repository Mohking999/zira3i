# Zira3i AI — "الطبيب الزراعي الذكي" ("From Image to Decision")

A full-stack, AI-powered plant disease diagnosis and decision-support system built for Algerian and Maghreb farmers. It takes a photo of a sick plant leaf, enriches it with field context (crop type, wilaya/region, growth stage, GPS, local weather), and returns an actionable diagnosis: **what to do right now, what to avoid, and when to follow up.**

---

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [API Reference](#api-reference)
- [Diagnosis Data Model](#diagnosis-data-model)
- [Local Decision Engine](#local-decision-engine)
- [Gemini API](#gemini-api)
- [Features](#features)
- [Supported Crop Cases](#supported-crop-cases)
- [Disclaimer](#disclaimer)

---

## Overview

Zira3i AI bridges the gap between plant pathology expertise and the smallholder farmer. The application supports **Arabic, French, and English** interfaces and is designed for farmers with zero technical experience:

1. **Capture** — snap a photo of the affected leaf or plant part.
2. **Context** — select the crop, enter location (GPS or free-text), growth stage, and observed symptoms.
3. **Decide** — receive a structured diagnosis with immediate actions, warnings, organic/chemical treatments, irrigation/fertilization advice, and a follow-up schedule.

The system uses a **dual-engine approach**:
- A **cloud LLM** (Google Gemma 4 via OpenRouter by default, or Gemini via Google's API) for image-aware, context-rich analysis when an API key is configured.
- A **local rule-based engine** (`generateLocalDecision`) that provides reliable, crop-specific guidance offline at all times.

---

## Demo

The app includes 5 pre-built sample cases that can be triggered with one click from the SampleCarousel:

| Sample ID | Crop | Disease | Wilaya |
|---|---|---|---|
| `potato-blight` | بطاطس / Potato | Mildiou (Phytophthora infestans) | عين الدفلى / Ain Defla |
| `tomato-powdery-mildew` | طماطم / Tomato | Oïdium (Leveillula taurica) | بسكرة / Biskra |
| `wheat-rust` | قمح / Wheat | Rouille jaune (Puccinia spp.) | سطيف / Sétif |
| `olive-peacock` | زيتون / Olive | Œil de paon (Spilocaea oleagina) | تيزي وزو / Tizi Ouzou |
| `citrus-chlorosis` | حمضيات / Citrus | Chlorose ferrique | البليدة / Blida |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                          │
│  React 19 SPA (Vite + TS + TailwindCSS)                 │
│  ─ Reads /api/status                                    │
│  ─ Calls /api/diagnose (POST, JSON)                     │
│  ─ GPS via navigator.geolocation                         │
│  ─ Weather via Open-Meteo API                            │
│  ─ Reverse geocode via Nominatim                         │
│  ─ SpeechSynthesis for voice readout                    │
│  ─ localStorage for session history                      │
│  ─ window.print() for PDF export                         │
└──────────────┬──────────────────────────────────────────┘
               │ HTTP
┌──────────────▼──────────────────────────────────────────┐
│                Express + Vite Server (server.ts)        │
│                                                          │
│  ┌─────────────┐       ┌────────────────────────────┐  │
│  │ /api/status  │       │ /api/diagnose (POST)        │  │
│  │             │       │   1. Parse req body          │  │
│  │  Returns:   │       │   2. OpenRouter if configured │  │
│  │  - aiConfigured│    │      or Gemini API            │  │
│  │  - model     │       │      → parse JSON response   │  │
│  │  - version   │       │      → parse JSON response   │  │
│  │  - caps      │       │   3. Fallback to             │  │
│  └─────────────┘       │      generateLocalDecision   │  │
│                         └────────────────────────────┘  │
│                                                          │
│  Dev:    Vite middleware mode (HMR enabled)              │
│  Prod:   express.static(dist/) + SPA fallback            │
└─────────────────────────────────────────────────────────┘
               │
               │ HTTPS (Bearer token or X-API-Key)
               │
┌──────────────▼──────────────────────────────────────────┐
│  OpenRouter Chat Completions / Google Gemini API          │
│  Models: Gemma 4 (default) / gemini-3.8-flash             │
│  Endpoints: chat/completions / models:generateContent      │
└─────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Frontend** (`src/utils/api.ts`) sends a POST to `/api/diagnose` with JSON containing image base64, crop type, location (text or GPS), growth stage, description, weather data, and language.
2. **Server** (`server.ts`) reads provider keys and model settings from the environment.
3. If `OPENROUTER_API_KEY` is configured, the server sends the prompt and optional image to OpenRouter's Chat Completions API with Bearer authentication. Otherwise, `GEMINI_API_KEY` routes the request to Google's Gemini `generateContent` API.
4. The response JSON is parsed via `parseDiagnosisResponse()`, which robustly handles various envelope structures (`result`, `diagnosis`, `data`, etc.) and strips markdown code fences.
5. If the cloud model call fails or no key is configured, the server falls back to `generateLocalDecision()` — a deterministic, offline rule-based engine.
6. The result flows back through the client's `requestDiagnosis()` which merges with a client-side fallback and caches by context hash.

---

## Project Structure

```
D:\zira3i\
├── .env                    # Runtime secrets (gitignored)
├── .env.example            # Template for AI Studio (uses Gemini API keys)
├── .gitignore
├── .kilo\                  # Kilo Agent Manager worktrees
│
├── index.html             # SPA entry point (RTL, Arabic default)
├── metadata.json          # App manifest for AI Studio
├── package.json
├── tsconfig.json
├── vite.config.ts         # Vite + React + Tailwind config
├── ecosystem.config.cjs   # PM2 process manager config
│
├── server.ts              # Express server + diagnosis API + local engine
│
├── src\
│   ├── main.tsx           # React 19 entry point
│   ├── App.tsx            # Root component (context form, tabs, workflow)
│   ├── index.css          # Tailwind imports + print styles
│   │
│   ├── components\        # UI components
│   │   ├── Header.tsx              # Top bar: lang switch, sound, guide, status
│   │   ├── DiagnosisView.tsx       # Full result display + actions
│   │   ├── BatchUploader.tsx       # Multi-image batch processing
│   │   ├── SessionHistory.tsx      # Local history in localStorage
│   │   ├── SampleCarousel.tsx      # One-click demo cases
│   │   ├── WeatherWidget.tsx       # Weather + disease risk banner
│   │   ├── FarmerGuideModal.tsx    # Step-by-step user guide
│   │   └── PdfExportModal.tsx      # A4 PDF report generator
│   │
│   ├── data\
│   │   └── samples.ts              # 5 sample cases with SVG thumbnails
│   │
│   ├── types\
│   │   └── diagnosis.ts            # TypeScript interfaces
│   │
│   └── utils\
│       ├── api.ts                  # Diagnosis API client + client fallback engine
│       ├── geo.ts                  # GPS, Nominatim geocoding, Open-Meteo weather
│       └── history.ts              # localStorage history persistence
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| **Backend** | Node.js, Express 4, tsx (TypeScript runtime) |
| **Icons** | Lucide React |
| **AI Model** | Google Gemma 4 via OpenRouter or Gemini via Google AI |
| **Local Engine** | Rule-based decision engine (no external deps) |
| **Weather** | Open-Meteo API (free, no key) |
| **Geocoding** | Nominatim (free, no key) |
| **Deployment** | PM2 process manager |
| **Build** | Vite static build (`npm run build`) |

---

## Environment Variables

Defined in `.env` (gitignored — not committed):

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENROUTER_API_KEY` | Optional | — | OpenRouter API key; takes precedence over Gemini when configured |
| `OPENROUTER_MODEL` | Optional | `google/gemma-4-26b-a4b-it:free` | OpenRouter model identifier |
| `GEMINI_API_KEY` | Optional | — | Google AI Studio API key; used when no OpenRouter key is set |
| `GEMINI_MODEL` | Optional | `gemini-3.8-flash` | Gemini model identifier |
| `PORT` | Optional | `3000` | Server listen port |
| `NODE_ENV` | Optional | — | `production` enables static file serving |

### How the API key is resolved

```typescript
// server.ts
const openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const isModelConfigured = Boolean(openRouterApiKey.trim() || geminiApiKey.trim());
```

When no provider key is set, the server automatically falls back to the local decision engine. Keep API keys in the local, gitignored `.env` file and never commit them.
The previous `BREV_API_KEY`, `BREV_API_URL`, `ZIRA3I_API_KEY`, and `AGRI_MODEL` settings are no longer used. Set `GEMINI_API_KEY` to enable Gemini.

---

## Development

### Prerequisites

- Node.js 20+
- npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

This starts `tsx server.ts`, which launches Express with Vite in middleware mode (SPA). The server listens on `http://0.0.0.0:3000`.

> **Note:** File watching/HMR can be disabled with `DISABLE_HMR=true` to reduce CPU usage during agent edits.

### Typecheck

```bash
npm run lint
```

Runs `tsc --noEmit` for type checking.

### Build for Production

```bash
npm run build
```

Produces static files in `dist/`. The production server (`NODE_ENV=production`) serves these files directly.

---

## Production Deployment

### Using PM2 (Process Manager)

The project includes an `ecosystem.config.cjs` for PM2:

```bash
pm2 start ecosystem.config.cjs      # Start
pm2 restart zira3i --update-env     # Restart (picks up .env changes)
pm2 stop zira3i                     # Stop
pm2 logs zira3i                     # Tail logs
pm2 status                          # Check status
pm2 save                            # Save process list (for system startup)
```

### PM2 Configuration Details

- **App name**: `zira3i`
- **Script**: `tsx server.ts`
- **Auto-restart**: Yes (on crash, max 10 restarts)
- **Memory limit**: 1GB (auto-restart if exceeded)
- **Log files**: `./logs/zira3i-out.log` and `./logs/zira3i-error.log`
- **Production env**: `NODE_ENV=production`, `PORT=3000`
- **Restart delay**: 3 seconds between restarts
- **Min uptime**: 10 seconds (prevents crash loops)

---

## API Reference

### `GET /api/status`

Returns server and model status.

**Response:**

```json
{
  "status": "ok",
  "aiConfigured": true,
  "model": "gemini-3.8-flash",
  "version": "3.0.0",
  "framework": "Decision-Support-System (من الصورة إلى القرار)",
  "capabilities": {
    "contextAware": true,
    "qualitativeCertainty": true,
    "decisionActionNow": true,
    "warningsDoNotDo": true,
    "followUpSchedule": true,
    "batchAnalysis": true,
    "offlineEngineAvailable": true
  }
}
```

### `POST /api/diagnose`

Accepts a plant image (or text description) with contextual metadata and returns a structured diagnosis.

**Request Body:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `imageBase64` | string | No* | — | Base64-encoded image (data URL or raw) |
| `mimeType` | string | No | `image/jpeg` | MIME type of the image |
| `description` | string | No* | — | Free-text symptom description |
| `cropType` | string | No | — | Crop name in the selected language |
| `wilaya` | string | No | — | Algerian wilaya or region name |
| `locationName` | string | No | — | Free-text location or GPS-resolved name |
| `countryCode` | string | No | — | ISO 3166-1 alpha-2 country code |
| `latitude` | number | No | — | GPS latitude in decimal degrees |
| `longitude` | number | No | — | GPS longitude in decimal degrees |
| `weatherData` | object | No | — | Weather snapshot from Open-Meteo |
| `growthStage` | string | No | — | Current growth stage label |
| `imageName` | string | No | — | Original filename for reference |
| `language` | string | No | `ar` | `ar`, `fr`, or `en` |

\* At least one of `imageBase64` or `description` must be provided.

**Response:** See [Diagnosis Data Model](#diagnosis-data-model).

---

## Diagnosis Data Model

Defined in `src/types/diagnosis.ts`:

```typescript
export interface DiagnosisData {
  id?: string;
  timestamp?: number;
  imagePreview?: string;

  // Identification & Assessment
  diseaseName: string;
  scientificName: string;
  cropDetected: string;
  wilayaContext?: string;
  growthStageContext?: string;

  // GPS & Weather context (global)
  locationName?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  weatherSnapshot?: WeatherData;

  // Qualitative Certainty & Evidence (PRD F3)
  qualitativeCertainty: 'high' | 'medium' | 'low';
  supportingEvidence: string[];

  // Severity & Catalysts
  severity: 'critical' | 'high' | 'medium' | 'low';
  favorableConditions: string;
  summary: string;
  symptoms?: string[];

  // Decision & Action
  actionNow: {
    headline: string;
    urgentSteps: string[];
  };
  warningDoNotDo: string;
  followUpSchedule: string;

  // Technical Treatments & Schedule
  treatmentOrganic: string[];
  treatmentChemical: string[];
  prevention: string[];
  irrigationSchedule: string;
  fertilizationAdvice: string;
  algerianContextNote: string;

  engineUsed?: 'openrouter-gemma-4-26b-a4b-it' | 'gemini-3.8-flash' | 'zira3i-agri-engine';
}
```

### Weather Data

```typescript
export interface WeatherData {
  temperature: number;       // °C
  humidity: number;          // %
  precipitation: number;     // mm (last hour)
  windSpeed: number;         // km/h
  weatherCode: number;       // WMO weather code
  weatherDescription: string;
  diseaseRiskLevel: 'high' | 'medium' | 'low';
  diseaseRiskReason: string;
}
```

---

## Local Decision Engine

The system has a built-in rule-based engine (`generateLocalDecision` in `server.ts:185` and `generateClientDecisionFallback` in `src/utils/api.ts:136`) that activates when:
- No OpenRouter or Gemini API key is configured
- The configured cloud model API is unreachable or returns an error
- The frontend loses server connectivity (client-side fallback)

### Supported Cases

| Case | Trigger Keywords (Arabic / French / English) | Disease |
|---|---|---|
| 1 | بطاطس / بطاطا / potato / blight / mildiou / دفلى / معسكر | **Potato Late Blight** — *Phytophthora infestans* |
| 2 | طماطم / tomato / tomate / بياض / oidium / بسكرة / دقيقي | **Tomato Powdery Mildew** — *Leveillula taurica* |
| 3 | قمح / wheat / blé / صدأ / rouille / سطيف / تيارت | **Wheat Rust** — *Puccinia striiformis* / *P. triticina* |
| 4 | زيتون / olive / تيزي / بجاية / طاووس | **Olive Peacock Spot** — *Spilocaea oleagina* |
| 5 (default) | — | **Chlorosis & Nutrient Deficiency** — *Chlorosis physiologica* |

Each case returns a full `DiagnosisData` object with:
- Crop-specific disease identification
- Wilaya/region context (Algerian-specific)
- Growth stage context
- Visual symptoms and evidence
- Severity classification
- Favorable conditions explanation
- Immediate action plan with urgent steps
- Explicit "Do Not Do" warnings
- Follow-up schedule
- Organic and chemical treatment options (with DAR — Delai d'Arrossage Raisonnable)
- Irrigation and fertilization advice
- Prevention measures
- Algerian agricultural context notes

---

## Gemini API

When `GEMINI_API_KEY` is configured and no OpenRouter key is present, the server calls Google's `generateContent` endpoint with the prompt and optional inline image. Create a key in [Google AI Studio](https://aistudio.google.com/apikey). The key stays on the server and is sent in the `x-goog-api-key` header.

---

## Features

### PRD Feature Matrix

| Code | Feature | Description |
|---|---|---|
| F1 | Context form (نموذج السياق) | 4-parameter form: crop, location (GPS/free-text), growth stage, symptoms |
| F2 | Image upload + compression | Client-side compression to ≤1200×1200px, 82% quality before upload |
| F3 | Qualitative certainty | Three-tier confidence: High / Medium / Low (no fake percentages) |
| F4 | Multi-language | Full UI + diagnosis in Arabic, French, and English |
| F5 | Sample carousel | 1-click demo with pre-filled context for 5 real disease cases |
| F6 | Weather integration | Real-time weather from Open-Meteo with disease risk assessment |
| F7 | GPS auto-detect | Browser geolocation API with reverse geocoding to city/wilaya |
| F8 | Session history | Up to 10 prior diagnoses cached in localStorage |
| F9 | Text-to-speech | Browser SpeechSynthesis API for voice readout of diagnoses |
| F10 | PDF export | A4 report via `window.print()` with professional formatting |
| F11 | Automatic retry | Two-attempt retry mechanism with 600ms backoff for failed requests |
| F12 | Permanent disclaimer | Legal/ethical AI disclaimer shown on all diagnosis views |

### Key UX Decisions

- **No numerical confidence scores** — uses qualitative certainty tiers to avoid false precision
- **Explicit "Do Not Do" warnings** — a dedicated section for actions that could worsen the problem
- **Action-first output** — the "Action Now" section is visually dominant (green gradient) to prioritize immediate steps
- **Offline-first** — the local engine ensures the app works even without API keys or internet
- **Farmer-friendly language** — avoids technical jargon; the guide modal walks users through 3 simple steps

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (`tsx server.ts` with Vite HMR middleware) |
| `npm run build` | Build static files to `dist/` |
| `npm run start` | Start production server (`tsx server.ts`) |
| `npm run preview` | Start Vite preview server |
| `npm run clean` | Remove `dist/` and `server.js` |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run pm2:start` | Start via PM2 process manager |
| `npm run pm2:stop` | Stop PM2 process |
| `npm run pm2:restart` | Restart PM2 process |
| `npm run pm2:logs` | Tail PM2 logs |
| `npm run pm2:status` | Check PM2 process status |

---

## Disclaimer

Zira3i AI is an experimental, AI-powered decision-support tool. It does **not** replace professional agronomic advice. Always corroborate critical decisions with agricultural engineers from your local DSA (Direction des Services Agricoles) and the National Plant Protection Institute (INPV). The app includes a permanent disclaimer on every diagnosis view and PDF export.
