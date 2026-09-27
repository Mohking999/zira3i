package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.localization.LocalAppLanguage
import com.example.localization.LocalAppStrings
import com.example.ui.components.AnimatedWaterWaveGauge
import com.example.ui.components.CyberBioBackground
import com.example.ui.theme.*

data class CropWaterProfile(
    val name: String,
    val emoji: String,
    val currentStage: String,
    val dailyRequirement: String,
    val targetMoisture: String,
    val moisturePercent: Int,
    val bestTiming: String,
    val droughtTip: String,
    val etcValue: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WaterAdvisorScreen(
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val strings = LocalAppStrings.current
    val lang = LocalAppLanguage.current

    val cropProfiles = when (lang.code) {
        "fr" -> listOf(
            CropWaterProfile(
                name = "Tomate",
                emoji = "🍅",
                currentStage = "Floraison & Nouaison",
                dailyRequirement = "3.2 - 4.5 L / plant / jour",
                targetMoisture = "70% - 75% capacité au champ",
                moisturePercent = 72,
                bestTiming = "Aube (5h00 - 7h00)",
                droughtTip = "L'irrigation goutte-à-goutte fractionnée prévient la nécrose apicale (cul noir) et le stress thermique.",
                etcValue = "4.8 mm/jour"
            ),
            CropWaterProfile(
                name = "Pomme de Terre",
                emoji = "🥔",
                currentStage = "Grossissement des tubercules",
                dailyRequirement = "38 - 45 m³ / ha / tour",
                targetMoisture = "75% - 80% capacité au champ",
                moisturePercent = 78,
                bestTiming = "Matinée pour sécher le feuillage",
                droughtTip = "Éviter les à-coups d'irrigation pour empêcher le craquellement des tubercules et le mildiou.",
                etcValue = "5.2 mm/jour"
            ),
            CropWaterProfile(
                name = "Olivier",
                emoji = "🫒",
                currentStage = "Durcissement du noyau & pulpe",
                dailyRequirement = "25 - 35 L / arbre",
                targetMoisture = "55% - 65% zone racinaire",
                moisturePercent = 60,
                bestTiming = "Arrosage nocturne ou à l'aube",
                droughtTip = "L'irrigation d'appoint en août-septembre augmente le rendement en huile d'olive de plus de 25%.",
                etcValue = "3.8 mm/jour"
            ),
            CropWaterProfile(
                name = "Palmier Dattier",
                emoji = "🌴",
                currentStage = "Maturation des dattes (Deglet Nour)",
                dailyRequirement = "70 - 90 L / palmier",
                targetMoisture = "60% - 70% cuvette d'arrosage",
                moisturePercent = 65,
                bestTiming = "Fin d'après-midi après la chaleur",
                droughtTip = "Le paillage des cuvettes avec des palmes sèches réduit l'évaporation des oasis de 35%.",
                etcValue = "6.5 mm/jour"
            ),
            CropWaterProfile(
                name = "Agrumes",
                emoji = "🍊",
                currentStage = "Grossissement des fruits & sucres",
                dailyRequirement = "40 - 55 L / arbre",
                targetMoisture = "65% - 75% capacité au champ",
                moisturePercent = 70,
                bestTiming = "Tôt le matin via goutteurs régulés",
                droughtTip = "Surveiller la salinité de l'eau de forage (EC) pour éviter la brûlure des pointes foliaires.",
                etcValue = "4.2 mm/jour"
            )
        )
        "en" -> listOf(
            CropWaterProfile(
                name = "Tomato",
                emoji = "🍅",
                currentStage = "Flowering & Fruit Setting",
                dailyRequirement = "3.2 - 4.5 L / plant / day",
                targetMoisture = "70% - 75% field capacity",
                moisturePercent = 72,
                bestTiming = "Dawn (5:00 - 7:00 AM)",
                droughtTip = "Pulsed drip irrigation prevents blossom-end rot and buffers against high midday heat shock.",
                etcValue = "4.8 mm/day"
            ),
            CropWaterProfile(
                name = "Potato",
                emoji = "🥔",
                currentStage = "Tuber Bulking & Sizing",
                dailyRequirement = "38 - 45 m³ / ha / cycle",
                targetMoisture = "75% - 80% field capacity",
                moisturePercent = 78,
                bestTiming = "Early morning to dry canopy fast",
                droughtTip = "Avoid sharp moisture swings to prevent internal tuber cracking and secondary fungal blight.",
                etcValue = "5.2 mm/day"
            ),
            CropWaterProfile(
                name = "Olive",
                emoji = "🫒",
                currentStage = "Pit hardening & oil accumulation",
                dailyRequirement = "25 - 35 L / tree",
                targetMoisture = "55% - 65% in root zone",
                moisturePercent = 60,
                bestTiming = "Calm dawn or night watering",
                droughtTip = "Supplemental irrigation in late summer increases virgin olive oil yield by over 25%.",
                etcValue = "3.8 mm/day"
            ),
            CropWaterProfile(
                name = "Date Palm",
                emoji = "🌴",
                currentStage = "Fruit ripening (Deglet Nour)",
                dailyRequirement = "70 - 90 L / palm tree",
                targetMoisture = "60% - 70% in basin",
                moisturePercent = 65,
                bestTiming = "Late afternoon after sun peak",
                droughtTip = "Mulching palm basins with dry fronds reduces Saharan oasis evaporation by up to 35%.",
                etcValue = "6.5 mm/day"
            ),
            CropWaterProfile(
                name = "Citrus",
                emoji = "🍊",
                currentStage = "Fruit sizing & brix development",
                dailyRequirement = "40 - 55 L / tree",
                targetMoisture = "65% - 75% field capacity",
                moisturePercent = 70,
                bestTiming = "Early morning through emitters",
                droughtTip = "Monitor borehole water salinity (EC) to prevent marginal leaf burn on orange varieties.",
                etcValue = "4.2 mm/day"
            )
        )
        else -> listOf(
            CropWaterProfile(
                name = "طماطم",
                emoji = "🍅",
                currentStage = "تزهير وعقد الثمار",
                dailyRequirement = "3.2 - 4.5 لتر / شتلة",
                targetMoisture = "70% - 75% سعة حقلية",
                moisturePercent = 72,
                bestTiming = "الفجر (5:00 - 7:00 ص)",
                droughtTip = "تطبيق الري بالتنقيط المتكرر يخفف صدمة الحرارة ويحمي من تعفن الطرف الزهري.",
                etcValue = "4.8 ملم/يوم"
            ),
            CropWaterProfile(
                name = "بطاطا",
                emoji = "🥔",
                currentStage = "تضخم الدرنات الأرضية",
                dailyRequirement = "38 - 45 م³ / هكتار",
                targetMoisture = "75% - 80% سعة حقلية",
                moisturePercent = 78,
                bestTiming = "الصباح الباكر لتجفيف العرش",
                droughtTip = "تجنب التذبذب الحاد في رطوبة التربة لمنع تشقق الدرنات وانتشار الميلديو.",
                etcValue = "5.2 ملم/يوم"
            ),
            CropWaterProfile(
                name = "زيتون",
                emoji = "🫒",
                currentStage = "تصلب النواة وامتلاء اللب",
                dailyRequirement = "25 - 35 لتر / شجرة",
                targetMoisture = "55% - 65% في منطقة الجذور",
                moisturePercent = 60,
                bestTiming = "سقي ليلي أو فجري هادئ",
                droughtTip = "الري التكميلي في أغسطس وسبتمبر يرفع نسبة الزيت بنسبة تفوق 25%.",
                etcValue = "3.8 ملم/يوم"
            ),
            CropWaterProfile(
                name = "نخيل التمر",
                emoji = "🌴",
                currentStage = "نضج الرطب والتمور",
                dailyRequirement = "70 - 90 لتر / نخلة",
                targetMoisture = "60% - 70% في حوض السقي",
                moisturePercent = 65,
                bestTiming = "المساء بعد انكسار أشعة الشمس",
                droughtTip = "تغطية أحواض النخيل بسعف النخيل الجاف يقلل تبخر الواحات بنسبة 35%.",
                etcValue = "6.5 ملم/يوم"
            ),
            CropWaterProfile(
                name = "حمضيات",
                emoji = "🍊",
                currentStage = "نمو الثمار والتكوين السكري",
                dailyRequirement = "40 - 55 لتر / شجرة",
                targetMoisture = "65% - 75% سعة حقلية",
                moisturePercent = 70,
                bestTiming = "الصباح الباكر عبر بواعث التنقيط",
                droughtTip = "مراقبة ملوحة مياه الآبار (EC) لمنع اصفرار واحتراق حواف أوراق البرتقال.",
                etcValue = "4.2 ملم/يوم"
            )
        )
    }

    var selectedCrop by remember(lang) { mutableStateOf(cropProfiles[0]) }

    val calcTitle = when (lang.code) {
        "fr" -> "Calculateur de Volume Hydrique Global"
        "en" -> "Total Field Water Volume Calculator"
        else -> "حاسبة الحجم المائي الإجمالي للحقل"
    }
    val calcText = when (lang.code) {
        "fr" -> "Pour 1 hectare de ${selectedCrop.name}, le besoin est estimé à 42 m³ par tour d'eau régulier via un réseau goutte-à-goutte de 4 L/h."
        "en" -> "Based on 1 hectare of ${selectedCrop.name}, total volume is estimated at 42 m³ per balanced cycle with a 4 L/h drip irrigation line."
        else -> "بناءً على مساحة 1 هكتار لمحصول ${selectedCrop.name}، يُقدر الاحتياج بـ 42 م³ لكل دورة سقي متوازنة مع شبكة أنابيب تنقيط ذات تصريف 4 لتر/ساعة."
    }

    CyberBioBackground(modifier = modifier) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 14.dp)
                .testTag("water_advisor_scaffold"),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(QuantumBlueLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.WaterDrop,
                            contentDescription = strings.waterHeaderTitle,
                            tint = QuantumBlue,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = strings.waterHeaderTitle,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Text(
                            text = strings.waterHeaderSubtitle,
                            fontSize = 11.5.sp,
                            color = colors.textSecondary
                        )
                    }
                }
            }

            // ET0 Evapotranspiration Banner
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = QuantumBlueLight.copy(alpha = 0.5f),
                    border = BorderStroke(1.dp, QuantumBlue.copy(alpha = 0.2f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Outlined.CloudSync, contentDescription = null, tint = QuantumBlue)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = strings.waterEvapoBanner,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = QuantumBlue
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = colors.surface
                            ) {
                                Text(
                                    text = "4.6 mm",
                                    fontSize = 11.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = QuantumBlue,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = strings.waterEvapoTip,
                            fontSize = 12.sp,
                            color = colors.textPrimary,
                            lineHeight = 18.sp
                        )
                    }
                }
            }

            // Crop Selector Chips
            item {
                Text(
                    text = strings.waterChooseCrop,
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(cropProfiles) { crop ->
                        val isSelected = crop.name == selectedCrop.name
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .clickable { selectedCrop = crop }
                                .testTag("crop_tab_${crop.name}"),
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSelected) QuantumBlue else colors.surface,
                            border = BorderStroke(1.dp, if (isSelected) QuantumBlue else colors.border)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(crop.emoji, fontSize = 16.sp)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    crop.name,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) Color.White else colors.textPrimary
                                )
                            }
                        }
                    }
                }
            }

            // Detailed Irrigation Profile Card with Animated Wave Reservoir Gauge
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(selectedCrop.emoji, fontSize = 30.sp)
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = selectedCrop.name,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = colors.textPrimary
                                    )
                                    Text(
                                        text = selectedCrop.currentStage,
                                        fontSize = 12.sp,
                                        color = colors.textSecondary
                                    )
                                }
                            }
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = ForestGreenContainer
                            ) {
                                Text(
                                    text = "ETc: ${selectedCrop.etcValue}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = ForestGreenDark,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Wave animation showing fluid reservoir level
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp),
                            horizontalArrangement = Arrangement.spacedBy(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AnimatedWaterWaveGauge(
                                moisturePercent = selectedCrop.moisturePercent,
                                modifier = Modifier
                                    .width(85.dp)
                                    .fillMaxHeight()
                            )

                            Column(modifier = Modifier.weight(1f)) {
                                Text(strings.waterMoistureLevel, fontSize = 11.5.sp, color = colors.textSecondary)
                                Text("${selectedCrop.moisturePercent}%", fontSize = 17.sp, fontWeight = FontWeight.ExtraBold, color = QuantumBlue)
                                Text(selectedCrop.targetMoisture, fontSize = 11.5.sp, color = ForestGreenDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        HorizontalDivider(color = colors.border, thickness = 0.8.dp)
                        Spacer(modifier = Modifier.height(14.dp))

                        Row(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(strings.waterDailyReq, fontSize = 11.5.sp, color = colors.textSecondary)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    selectedCrop.dailyRequirement,
                                    fontSize = 13.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = QuantumBlue
                                )
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(strings.waterBestTiming, fontSize = 11.5.sp, color = colors.textSecondary)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    selectedCrop.bestTiming,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = ForestGreenLight.copy(alpha = 0.5f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Icon(Icons.Outlined.Lightbulb, contentDescription = null, tint = MutedForestGreen, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text(strings.waterDoctorTip, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = ForestGreenDark)
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(selectedCrop.droughtTip, fontSize = 12.sp, color = colors.textPrimary, lineHeight = 17.sp)
                                }
                            }
                        }
                    }
                }
            }

            // Interactive Calculator Card
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.Calculate, contentDescription = null, tint = colors.textPrimary)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = calcTitle,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = calcText,
                            fontSize = 12.5.sp,
                            color = colors.textSecondary,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }
    }
}
