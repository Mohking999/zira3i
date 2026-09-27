package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.localization.LocalAppLanguage
import com.example.localization.LocalAppStrings
import com.example.model.*
import com.example.ui.theme.*

@Composable
fun DiagnosticReportCard(
    report: DiagnosticReport,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val strings = LocalAppStrings.current
    val lang = LocalAppLanguage.current
    var expandedHypotheses by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .testTag("diagnostic_report_card"),
        shape = RoundedCornerShape(18.dp),
        color = colors.surface,
        border = BorderStroke(1.dp, colors.border),
        shadowElevation = 1.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp)
        ) {
            // Header: Crop & Confidence Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Crop & Disease Tag
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(ForestGreenLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.MedicalServices,
                            contentDescription = "Medical report",
                            tint = MutedForestGreen,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = report.cropName,
                            fontSize = 13.sp,
                            color = colors.textSecondary,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = report.diseaseName,
                            fontSize = 17.sp,
                            color = colors.textPrimary,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Confidence Score Badge Component
                ConfidenceScoreBadge(score = report.confidenceScore)
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Scientific Name
            Text(
                text = report.scientificName,
                fontSize = 12.sp,
                fontStyle = FontStyle.Italic,
                color = colors.textMuted
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Severity Level indicator
            val (severityBg, severityFg) = when (report.severity) {
                SeverityLevel.LOW -> Pair(ForestGreenLight, ForestGreenDark)
                SeverityLevel.MODERATE -> Pair(WarningAmberLight, WarningAmber)
                SeverityLevel.HIGH -> Pair(ErrorRedLight, ErrorRed)
            }
            val severityLabel = when (lang.code) {
                "fr" -> when (report.severity) {
                    SeverityLevel.LOW -> "Niveau de risque : Faible"
                    SeverityLevel.MODERATE -> "Niveau de risque : Modéré"
                    SeverityLevel.HIGH -> "Niveau de risque : Élevé"
                }
                "en" -> when (report.severity) {
                    SeverityLevel.LOW -> "Severity: Low"
                    SeverityLevel.MODERATE -> "Severity: Moderate"
                    SeverityLevel.HIGH -> "Severity: High"
                }
                else -> "مستوى الخطورة: ${report.severity.labelArabic}"
            }

            Surface(
                shape = RoundedCornerShape(8.dp),
                color = severityBg,
                border = BorderStroke(0.5.dp, severityFg.copy(alpha = 0.3f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Outlined.WarningAmber,
                        contentDescription = null,
                        tint = severityFg,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = severityLabel,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = severityFg
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Summary
            Text(
                text = report.summary,
                fontSize = 13.5.sp,
                color = colors.textPrimary,
                lineHeight = 21.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Observed Symptoms List
            val symptomsTitle = when (lang.code) {
                "fr" -> "Symptômes cliniques observés :"
                "en" -> "Observed Clinical Symptoms:"
                else -> "الأعراض السريرية الملاحظة:"
            }
            Text(
                text = symptomsTitle,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = colors.textPrimary
            )
            Spacer(modifier = Modifier.height(6.dp))
            report.symptoms.forEach { symptom ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 3.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Text(
                        text = "• ",
                        color = MutedForestGreen,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Text(
                        text = symptom,
                        fontSize = 13.sp,
                        color = colors.textPrimary,
                        lineHeight = 19.sp,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider(color = colors.border, thickness = 0.8.dp)
            Spacer(modifier = Modifier.height(16.dp))

            // Water Advisor Card Component
            WaterAdvisorCard(waterAdvisor = report.waterAdvisor)

            Spacer(modifier = Modifier.height(14.dp))

            // Quantum-Inspired Water Optimization Badge Component
            QuantumWaterOptimizationBadge(quantum = report.quantumOptimization)

            Spacer(modifier = Modifier.height(16.dp))

            // Alternative Hypotheses Section
            AlternativeHypothesesSection(
                hypotheses = report.alternativeHypotheses,
                expanded = expandedHypotheses,
                onToggle = { expandedHypotheses = !expandedHypotheses }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Treatment Protocol
            TreatmentProtocolSection(treatments = report.treatments)

            Spacer(modifier = Modifier.height(16.dp))

            // Safety Disclaimer Notice Banner Component
            SafetyDisclaimerNoticeBanner(notice = report.safetyDisclaimer)
        }
    }
}

@Composable
fun ConfidenceScoreBadge(
    score: Int,
    modifier: Modifier = Modifier
) {
    val lang = LocalAppLanguage.current
    val label = when (lang.code) {
        "fr" -> "Confiance : $score%"
        "en" -> "Confidence: $score%"
        else -> "نسبة الثقة: $score%"
    }

    Surface(
        modifier = modifier.testTag("confidence_badge"),
        shape = RoundedCornerShape(12.dp),
        color = ForestGreenLight,
        border = BorderStroke(1.dp, MutedForestGreen.copy(alpha = 0.3f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(MutedForestGreen)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = ForestGreenDark
            )
        }
    }
}

@Composable
fun WaterAdvisorCard(
    waterAdvisor: WaterAdvisorData,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val lang = LocalAppLanguage.current

    val title = when (lang.code) {
        "fr" -> "Conseiller en Irrigation Précise"
        "en" -> "Smart Water Advisor"
        else -> "مستشار الري الذكي (Water Advisor)"
    }
    val reqLabel = when (lang.code) {
        "fr" -> "Besoin journalier :"
        "en" -> "Daily requirement:"
        else -> "المقنن المائي اليومي:"
    }
    val moistLabel = when (lang.code) {
        "fr" -> "Humidité cible :"
        "en" -> "Target moisture:"
        else -> "الرطوبة المستهدفة:"
    }
    val schedLabel = when (lang.code) {
        "fr" -> "Planning d'arrosage : "
        "en" -> "Irrigation schedule: "
        else -> "جدول السقي: "
    }
    val tipLabel = when (lang.code) {
        "fr" -> "Conseil sécheresse : "
        "en" -> "Drought mitigation tip: "
        else -> "نصيحة الإجهاد المائي: "
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .testTag("water_advisor_card"),
        shape = RoundedCornerShape(14.dp),
        color = QuantumBlueLight.copy(alpha = 0.5f),
        border = BorderStroke(1.dp, QuantumBlue.copy(alpha = 0.2f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Filled.WaterDrop,
                    contentDescription = title,
                    tint = QuantumBlue,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = QuantumBlue
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = reqLabel,
                        fontSize = 11.5.sp,
                        color = colors.textSecondary
                    )
                    Text(
                        text = waterAdvisor.dailyRequirement,
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textPrimary
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = moistLabel,
                        fontSize = 11.5.sp,
                        color = colors.textSecondary
                    )
                    Text(
                        text = waterAdvisor.soilMoistureTarget,
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "$schedLabel${waterAdvisor.irrigationSchedule}",
                fontSize = 12.sp,
                color = colors.textPrimary,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "$tipLabel${waterAdvisor.droughtMitigationTip}",
                fontSize = 11.5.sp,
                color = colors.textSecondary,
                lineHeight = 17.sp
            )
        }
    }
}

@Composable
fun QuantumWaterOptimizationBadge(
    quantum: QuantumWaterOptimization,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val lang = LocalAppLanguage.current

    val title = when (lang.code) {
        "fr" -> "Optimisation Hydrique Face à la Sécheresse"
        "en" -> "Water Optimization Scarcity Model"
        else -> "مؤشر تحسين توزيع المياه لندرة الموارد"
    }
    val badge = when (lang.code) {
        "fr" -> "+${quantum.efficiencyGainPercent}% Efficacité"
        "en" -> "+${quantum.efficiencyGainPercent}% Efficiency"
        else -> "+${quantum.efficiencyGainPercent}% كفاءة"
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .testTag("quantum_optimization_badge"),
        shape = RoundedCornerShape(12.dp),
        color = colors.surfaceVariant,
        border = BorderStroke(1.dp, colors.border)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.AutoAwesome,
                        contentDescription = "Quantum Water Optimization",
                        tint = MutedForestGreen,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = title,
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                }

                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = ForestGreenContainer
                ) {
                    Text(
                        text = badge,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = ForestGreenDark,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = quantum.statusText,
                fontSize = 11.5.sp,
                color = colors.textSecondary
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "• ${quantum.rootZoneTargeting}",
                fontSize = 11.5.sp,
                color = ForestGreenDark
            )
        }
    }
}

@Composable
fun AlternativeHypothesesSection(
    hypotheses: List<AlternativeDiagnosis>,
    expanded: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val lang = LocalAppLanguage.current

    val header = when (lang.code) {
        "fr" -> "Diagnostics & Hypothèses Alternatifs (${hypotheses.size})"
        "en" -> "Alternative Hypotheses & Differential Diagnoses (${hypotheses.size})"
        else -> "الفرضيات والتشخيصات البديلة (${hypotheses.size})"
    }
    val diffPrefix = when (lang.code) {
        "fr" -> "Facteur différentiel : "
        "en" -> "Differential factor: "
        else -> "الفارق التشخيصي: "
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable { onToggle() },
        shape = RoundedCornerShape(12.dp),
        color = colors.surfaceVariant.copy(alpha = 0.5f),
        border = BorderStroke(0.8.dp, colors.border)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Outlined.HelpOutline,
                        contentDescription = null,
                        tint = colors.textSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = header,
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textPrimary
                    )
                }
                Icon(
                    imageVector = if (expanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                    contentDescription = null,
                    tint = colors.textSecondary,
                    modifier = Modifier.size(20.dp)
                )
            }

            AnimatedVisibility(visible = expanded) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    hypotheses.forEach { hyp ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(colors.surface, RoundedCornerShape(8.dp))
                                .padding(10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = hyp.conditionName,
                                    fontSize = 12.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "$diffPrefix${hyp.distinguishingFactor}",
                                    fontSize = 11.5.sp,
                                    color = colors.textSecondary,
                                    lineHeight = 16.sp
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = colors.surfaceVariant
                            ) {
                                Text(
                                    text = "${hyp.probability}%",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textSecondary,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TreatmentProtocolSection(
    treatments: TreatmentPlan,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val lang = LocalAppLanguage.current

    val mainTitle = when (lang.code) {
        "fr" -> "Protocole de traitement recommandé :"
        "en" -> "Recommended Treatment Protocol:"
        else -> "بروتوكول العلاج الموصى به:"
    }
    val bioTitle = when (lang.code) {
        "fr" -> "🌱 Lutte biologique & bio-contrôle :"
        "en" -> "🌱 Organic & Biological Control:"
        else -> "🌱 المكافحة العضوية والبيولوجية:"
    }
    val chemTitle = when (lang.code) {
        "fr" -> "🔬 Traitement chimique ciblé & homologué :"
        "en" -> "🔬 Targeted & Approved Chemical Treatment:"
        else -> "🔬 العلاج الكيميائي المستهدف:"
    }

    Column(
        modifier = modifier.fillMaxWidth()
    ) {
        Text(
            text = mainTitle,
            fontSize = 13.5.sp,
            fontWeight = FontWeight.Bold,
            color = colors.textPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Organic remedy
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp),
            color = ForestGreenLight.copy(alpha = 0.6f),
            border = BorderStroke(0.6.dp, MutedForestGreen.copy(alpha = 0.2f))
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                Text(
                    text = bioTitle,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = ForestGreenDark
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = treatments.organicRemedy,
                    fontSize = 12.sp,
                    color = colors.textPrimary,
                    lineHeight = 18.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Chemical treatment
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp),
            color = colors.surfaceVariant,
            border = BorderStroke(0.6.dp, colors.border)
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                Text(
                    text = chemTitle,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = treatments.chemicalTreatment,
                    fontSize = 12.sp,
                    color = colors.textPrimary,
                    lineHeight = 18.sp
                )
            }
        }
    }
}

@Composable
fun SafetyDisclaimerNoticeBanner(
    notice: String,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val lang = LocalAppLanguage.current

    val bannerTitle = when (lang.code) {
        "fr" -> "Avertissement Sécurité Agricole (DAR / PHI)"
        "en" -> "Farmer Safety Disclaimer & PHI Warning"
        else -> "تنبيه أمان للمزارع (Safety Disclaimer)"
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .testTag("safety_disclaimer_banner"),
        shape = RoundedCornerShape(12.dp),
        color = WarningAmberLight.copy(alpha = 0.6f),
        border = BorderStroke(1.dp, WarningAmber.copy(alpha = 0.3f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(
                imageVector = Icons.Default.Shield,
                contentDescription = bannerTitle,
                tint = WarningAmber,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = bannerTitle,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = WarningAmber
                )
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = notice,
                    fontSize = 11.5.sp,
                    color = colors.textPrimary,
                    lineHeight = 17.sp
                )
            }
        }
    }
}
