export type QualitativeCertainty = 'high' | 'medium' | 'low';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';

export interface AgriculturalContext {
  crop: string;
  wilaya: string;
  growthStage: string;
  symptomsBrief: string;
}

// ─── Weather & GPS ───────────────────────────────────────────────────────────

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

export interface LocationData {
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;  // ISO 3166-1 alpha-2
  region: string;
  city: string;
  displayName: string;
}

// ─── Diagnosis ───────────────────────────────────────────────────────────────

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

  // Qualitative Certainty & Evidence (PRD F3 - no fake numerical %)
  qualitativeCertainty: QualitativeCertainty;
  supportingEvidence: string[];

  // Severity & Catalysts
  severity: SeverityLevel;
  favorableConditions: string;
  summary: string;
  symptoms?: string[];

  // Decision & Action (Core PRD update: Action Now + Do Not Do + Follow-up)
  actionNow: {
    headline: string;
    urgentSteps: string[];
  };
  warningDoNotDo: string; // e.g. "لا ترش مبيداً حشرياً قبل التأكد..."
  followUpSchedule: string; // e.g. "أعد فحص الأوراق بعد 4 أيام..."

  // Technical Treatments & Schedule
  treatmentOrganic: string[];
  treatmentChemical: string[];
  prevention: string[];
  irrigationSchedule: string;
  fertilizationAdvice: string;
  algerianContextNote: string;

  engineUsed?: 'openrouter-gemma-4-26b-a4b-it' | 'gemini-3.8-flash' | 'zira3i-agri-engine';
}

export interface BatchItem {
  id: string;
  file?: File;
  previewUrl: string;
  name: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: DiagnosisData;
  error?: string;
}

export type SupportedLanguage = 'ar' | 'fr' | 'en';
