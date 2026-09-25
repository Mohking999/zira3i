export type QualitativeCertainty = 'high' | 'medium' | 'low';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';

export interface AgriculturalContext {
  crop: string;
  wilaya: string;
  growthStage: string;
  symptomsBrief: string;
}

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

  engineUsed?: 'gemini-3.8-flash' | 'zira3i-agri-engine';
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
