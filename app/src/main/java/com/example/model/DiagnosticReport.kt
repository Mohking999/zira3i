package com.example.model

data class DiagnosticReport(
    val id: String,
    val cropName: String,
    val diseaseName: String,
    val scientificName: String,
    val confidenceScore: Int, // e.g. 94
    val severity: SeverityLevel,
    val summary: String,
    val symptoms: List<String>,
    val alternativeHypotheses: List<AlternativeDiagnosis>,
    val waterAdvisor: WaterAdvisorData,
    val quantumOptimization: QuantumWaterOptimization,
    val treatments: TreatmentPlan,
    val safetyDisclaimer: String = DEFAULT_SAFETY_DISCLAIMER
) {
    companion object {
        const val DEFAULT_SAFETY_DISCLAIMER = "تنبيه أمان زراعي: تجنب الاستخدام العشوائي للمبيدات الفطرية أو الكيميائية. يجب الالتزام الصارم بالجرعات الموصى بها وفترة الأمان قبل الجني (PHI)، واستشارة مهندس وقاية النباتات المعتمد في منطقتك الزراعية."
    }
}

enum class SeverityLevel(val labelArabic: String) {
    LOW("منخفضة الخطورة"),
    MODERATE("متوسطة الخطورة"),
    HIGH("عالية الخطورة - تتطلب تدخلاً عاجلاً")
}

data class AlternativeDiagnosis(
    val conditionName: String,
    val probability: Int, // percentage
    val distinguishingFactor: String
)

data class WaterAdvisorData(
    val dailyRequirement: String, // e.g. "4.5 - 6 لتر / شجرة يومياً"
    val irrigationSchedule: String, // e.g. "الري بالتنقيط في الصباح الباكر (5:30 - 7:00 ص)"
    val soilMoistureTarget: String, // e.g. "65% - 75% سعة حقلية"
    val droughtMitigationTip: String
)

data class QuantumWaterOptimization(
    val efficiencyGainPercent: Int, // e.g. 34%
    val statusText: String, // e.g. "توزيع هيدروديناميكي محسن لندرة المياه والمناخ الجاف"
    val rootZoneTargeting: String, // e.g. "تركيز الري على عمق 25-40 سم لتقليل التبخر السطحي"
    val stressIndex: String // e.g. "مستوى إجهاد مائي منخفض"
)

data class TreatmentPlan(
    val organicRemedy: String,
    val chemicalTreatment: String,
    val culturalPractices: List<String>
)
