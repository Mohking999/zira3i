package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material.icons.outlined.Layers
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material.icons.outlined.Speed
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.localization.LocalAppLanguage
import com.example.localization.LocalAppStrings
import com.example.ui.components.CyberBioBackground
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuantumOptimizationScreen(
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val strings = LocalAppStrings.current
    val lang = LocalAppLanguage.current

    val strat1Title = when (lang.code) {
        "fr" -> "1. Système d'Irrigation Pulsée (Pulse Drip)"
        "en" -> "1. Smart Pulse Drip Irrigation System"
        else -> "1. نظام الري النبضي الذكي (Pulse Drip)"
    }
    val strat1Sub = when (lang.code) {
        "fr" -> "Fractionnement du cycle d'arrosage en micro-impulsions"
        "en" -> "Dividing single watering cycle into calibrated pulses"
        else -> "تجزئة دورة السقي الواحدة إلى نبضات متقطعة"
    }
    val strat1Desc = when (lang.code) {
        "fr" -> "Au lieu d'arroser 2 heures en continu, le système fractionne l'irrigation en 4 pulsations de 25 minutes entrecoupées de 20 minutes de pause. Les forces capillaires du sol étalent l'humidité horizontalement aux racines."
        "en" -> "Instead of watering 2 continuous hours, the system splits irrigation into 4 cycles of 25 minutes with 20-minute pauses. Soil capillary action spreads moisture horizontally to active root hairs."
        else -> "بدلاً من السقي المستمر لمدة ساعتين متواصلتين، يقسم النظام الري إلى 4 نبضات كل منها 25 دقيقة تفصل بينها فترات راحة 20 دقيقة. هذا يتيح للقوى الشعرية في التربة سحب الرطوبة أفقياً عند الجذور."
    }
    val strat1Badge = when (lang.code) {
        "fr" -> "Économie d'eau : 24% | Pomme de terre, Tomate, Maraîchage"
        "en" -> "Water Savings: 24% | Suitable for Potatoes, Tomatoes, Vegetables"
        else -> "معدل توفير المياه: 24% | مناسب لمحاصيل: البطاطا، الطماطم، الخضروات"
    }

    val strat2Title = when (lang.code) {
        "fr" -> "2. Infiltration Sous-Superficielle Ciblée"
        "en" -> "2. Targeted Subsurface Root-Zone Infiltration"
        else -> "2. استهداف النطاق الجذري تحت السطحي"
    }
    val strat2Sub = when (lang.code) {
        "fr" -> "Profondeur 25 - 50 cm pour oliviers, palmiers et vergers"
        "en" -> "Depth 25 - 50 cm for olives, dates, and citrus orchards"
        else -> "عمق 25 - 50 سم لأشجار الزيتون والنخيل والحمضيات"
    }
    val strat2Desc = when (lang.code) {
        "fr" -> "Concentration de l'humidité là où les racines absorbent 80% de l'eau, tout en gardant les 10 premiers centimètres secs pour stopper l'évaporation et empêcher la levée des mauvaises herbes."
        "en" -> "Delivering moisture where root hair absorption is maximum, keeping top 10 cm dry to eliminate weed germination and prevent direct sun evaporation."
        else -> "تركيز الرطوبة عند المنطقة التي تمتص منها الشعيرات الجذرية معظم الماء، مع الحفاظ على الطبقة السطحية (0-10 سم) جافة، مما يحرم بذور الأعشاب الضارة من الإنبات ويوقف التبخر المباشر."
    }
    val strat2Badge = when (lang.code) {
        "fr" -> "Économie d'eau : 40% | Mauvaises herbes réduites de 65%"
        "en" -> "Water Savings: 40% | Weeds reduced by 65%"
        else -> "معدل توفير المياه: 40% | تقليل نمو الأعشاب الضارة بنسبة 65%"
    }

    val strat3Title = when (lang.code) {
        "fr" -> "3. Bouclier Salinité & Pression Hydrostatique"
        "en" -> "3. Hydrostatic Aquifer & Salinity Shield"
        else -> "3. درع إدارة الملوحة والضغط الهيدروليكي"
    }
    val strat3Sub = when (lang.code) {
        "fr" -> "Protection des forages profonds contre la remontée saline"
        "en" -> "Protecting deep boreholes from saltwater upconing"
        else -> "حماية الآبار الجوفية من السحب الجائر وتملح المياه"
    }
    val strat3Desc = when (lang.code) {
        "fr" -> "Dans des zones comme Oued Souf, Biskra et Mascara, le pompage excessif entraîne une remontée d'eau saumâtre. Le modèle régule les horaires d'extraction pour maintenir la pression hydrostatique et préserver les sols."
        "en" -> "In areas like El Oued, Biskra, and Mascara, over-pumping causes saline water upconing. The algorithm schedules borehole cycles to preserve hydrostatic balance and root health."
        else -> "في مناطق مثل وادي سوف، بسكرة، ومعسكر، يؤدي السحب المستمر إلى صعود مياه مالحة. ينظم الموديل فترات تشغيل الآبار لضمان توازن الضغط الهيدروستاتيكي وتفادي ترسب الأملاح حول الجذور."
    }

    CyberBioBackground(modifier = modifier) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 14.dp)
                .testTag("quantum_optimization_scaffold"),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(ForestGreenLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.AutoAwesome,
                            contentDescription = strings.quantumHeaderTitle,
                            tint = MutedForestGreen,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = strings.quantumHeaderTitle,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Text(
                            text = strings.quantumHeaderSubtitle,
                            fontSize = 11.5.sp,
                            color = colors.textSecondary
                        )
                    }
                }
            }

            // Efficiency Hero Badge
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, MutedForestGreen.copy(alpha = 0.35f)),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = strings.quantumEfficiencyTitle,
                                    fontSize = 13.sp,
                                    color = colors.textSecondary
                                )
                                Text(
                                    text = "+36.8%",
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = ForestGreenDark
                                )
                            }
                            Surface(
                                shape = CircleShape,
                                color = ForestGreenContainer,
                                modifier = Modifier.size(54.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.WaterDrop,
                                        contentDescription = null,
                                        tint = ForestGreenDark,
                                        modifier = Modifier.size(28.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        HorizontalDivider(color = colors.border, thickness = 0.8.dp)
                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = strings.quantumEfficiencyDesc,
                            fontSize = 12.5.sp,
                            color = colors.textPrimary,
                            lineHeight = 19.sp
                        )
                    }
                }
            }

            // Strategy 1
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = QuantumBlueLight
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.Speed,
                                    contentDescription = null,
                                    tint = QuantumBlue,
                                    modifier = Modifier
                                        .padding(8.dp)
                                        .size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = strat1Title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = strat1Sub,
                                    fontSize = 11.5.sp,
                                    color = colors.textSecondary
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = strat1Desc,
                            fontSize = 12.sp,
                            color = colors.textPrimary,
                            lineHeight = 18.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = colors.surfaceVariant
                        ) {
                            Text(
                                text = strat1Badge,
                                fontSize = 11.sp,
                                color = colors.textPrimary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }

            // Strategy 2
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = ForestGreenLight
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.Layers,
                                    contentDescription = null,
                                    tint = MutedForestGreen,
                                    modifier = Modifier
                                        .padding(8.dp)
                                        .size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = strat2Title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = strat2Sub,
                                    fontSize = 11.5.sp,
                                    color = colors.textSecondary
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = strat2Desc,
                            fontSize = 12.sp,
                            color = colors.textPrimary,
                            lineHeight = 18.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = colors.surfaceVariant
                        ) {
                            Text(
                                text = strat2Badge,
                                fontSize = 11.sp,
                                color = colors.textPrimary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }

            // Strategy 3
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = WarningAmberLight
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.Shield,
                                    contentDescription = null,
                                    tint = WarningAmber,
                                    modifier = Modifier
                                        .padding(8.dp)
                                        .size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = strat3Title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                                Text(
                                    text = strat3Sub,
                                    fontSize = 11.5.sp,
                                    color = colors.textSecondary
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = strat3Desc,
                            fontSize = 12.sp,
                            color = colors.textPrimary,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }
    }
}
