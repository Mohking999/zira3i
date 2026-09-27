import { DiagnosisData } from '../types/diagnosis';

const HISTORY_KEY = 'zira3i:diagnosis-history:v1';
const HISTORY_PREFERENCE_KEY = 'zira3i:remember-diagnosis-history';
const HISTORY_LIMIT = 10;

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function isDiagnosisData(value: unknown): value is DiagnosisData {
  if (!value || typeof value !== 'object') return false;

  const item = value as Partial<DiagnosisData>;
  return (
    typeof item.id === 'string' &&
    typeof item.timestamp === 'number' &&
    typeof item.diseaseName === 'string' &&
    typeof item.scientificName === 'string' &&
    typeof item.cropDetected === 'string' &&
    ['high', 'medium', 'low'].includes(item.qualitativeCertainty || '') &&
    Array.isArray(item.supportingEvidence) &&
    ['critical', 'high', 'medium', 'low'].includes(item.severity || '') &&
    typeof item.favorableConditions === 'string' &&
    typeof item.summary === 'string' &&
    typeof item.actionNow?.headline === 'string' &&
    Array.isArray(item.actionNow.urgentSteps) &&
    typeof item.warningDoNotDo === 'string' &&
    typeof item.followUpSchedule === 'string' &&
    Array.isArray(item.treatmentOrganic) &&
    Array.isArray(item.treatmentChemical) &&
    Array.isArray(item.prevention) &&
    typeof item.irrigationSchedule === 'string' &&
    typeof item.fertilizationAdvice === 'string' &&
    typeof item.algerianContextNote === 'string'
  );
}

export function loadHistoryPreference(): boolean {
  try {
    return getStorage()?.getItem(HISTORY_PREFERENCE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function loadDiagnosisHistory(): DiagnosisData[] {
  const storage = getStorage();
  if (!storage || !loadHistoryPreference()) return [];

  try {
    const parsed: unknown = JSON.parse(storage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isDiagnosisData)
      .slice(0, HISTORY_LIMIT)
      .map(({ imagePreview, ...item }) => item);
  } catch {
    return [];
  }
}

export function syncDiagnosisHistory(remember: boolean, history: DiagnosisData[]): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    if (!remember) {
      storage.removeItem(HISTORY_PREFERENCE_KEY);
      storage.removeItem(HISTORY_KEY);
      return;
    }

    const summaries = history
      .slice(0, HISTORY_LIMIT)
      .map(({ imagePreview, ...item }) => item);

    storage.setItem(HISTORY_PREFERENCE_KEY, 'true');
    storage.setItem(HISTORY_KEY, JSON.stringify(summaries));
  } catch {}
}