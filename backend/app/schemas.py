"""API contract. Field names are camelCase to map 1:1 onto the Kotlin models in
app/src/main/java/com/example/model/DiagnosticReport.kt."""

from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class Severity(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"


class AlternativeDiagnosis(BaseModel):
    conditionName: str
    probability: int = Field(ge=0, le=100)
    distinguishingFactor: str = ""

    @field_validator("probability", mode="before")
    @classmethod
    def _clamp(cls, v):
        return _clamp_percent(v)


class WaterAdvisor(BaseModel):
    dailyRequirement: str
    irrigationSchedule: str
    soilMoistureTarget: str
    droughtMitigationTip: str


class QuantumOptimization(BaseModel):
    efficiencyGainPercent: int = Field(ge=0, le=100)
    statusText: str
    rootZoneTargeting: str
    stressIndex: str

    @field_validator("efficiencyGainPercent", mode="before")
    @classmethod
    def _clamp(cls, v):
        return _clamp_percent(v)


class TreatmentPlan(BaseModel):
    organicRemedy: str
    chemicalTreatment: str
    culturalPractices: list[str] = Field(default_factory=list)


class DiagnosticReport(BaseModel):
    id: str
    cropName: str
    diseaseName: str
    scientificName: str = ""
    confidenceScore: int = Field(ge=0, le=100)
    severity: Severity
    summary: str
    symptoms: list[str] = Field(default_factory=list)
    alternativeHypotheses: list[AlternativeDiagnosis] = Field(default_factory=list)
    waterAdvisor: WaterAdvisor
    quantumOptimization: QuantumOptimization
    treatments: TreatmentPlan
    safetyDisclaimer: str

    @field_validator("confidenceScore", mode="before")
    @classmethod
    def _clamp(cls, v):
        return _clamp_percent(v)

    @field_validator("severity", mode="before")
    @classmethod
    def _severity(cls, v):
        s = str(v).strip().upper()
        if s in {"LOW", "MODERATE", "HIGH"}:
            return s
        if s in {"MEDIUM", "MED"}:
            return "MODERATE"
        if s in {"CRITICAL", "SEVERE"}:
            return "HIGH"
        return "MODERATE"


class DiagnoseRequest(BaseModel):
    prompt: str = Field(default="", max_length=4000)
    # Base64-encoded JPEG/PNG, without the data: prefix.
    imageBase64: str | None = None
    imageMimeType: Literal["image/jpeg", "image/png"] = "image/jpeg"
    language: Literal["ar", "fr", "en"] = "ar"


class DiagnoseResponse(BaseModel):
    reply: str
    report: DiagnosticReport
    model: str


class ErrorResponse(BaseModel):
    error: str
    detail: str = ""


def _clamp_percent(v) -> int:
    try:
        n = int(round(float(str(v).strip().rstrip("%"))))
    except (TypeError, ValueError):
        return 0
    return max(0, min(100, n))
