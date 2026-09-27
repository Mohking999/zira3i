package com.example.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.localization.LocalAppLanguage
import com.example.localization.LocalAppStrings
import com.example.ui.components.CyberBioBackground
import com.example.ui.theme.*

data class CropTelemetryRadar(
    val emoji: String,
    val name: String,
    val region: String,
    val healthIndex: String,
    val healthPercent: Float,
    val riskFactor: String,
    val query: String
)

@Composable
fun DashboardScreen(
    onNavigateToDiagnosis: (cropPrompt: String?) -> Unit,
    onNavigateToWaterAdvisor: () -> Unit,
    onNavigateToQuantum: () -> Unit,
    onNavigateToSafety: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val strings = LocalAppStrings.current
    val lang = LocalAppLanguage.current

    val infiniteTransition = rememberInfiniteTransition(label = "pulse_glow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 0.95f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    val cropsRadar = when (lang.code) {
        "fr" -> listOf(
            CropTelemetryRadar("🥔", "Pomme de Terre Ain Defla", "Hauts Plateaux et Centre", "Santé Culture 92%", 0.92f, "Mildiou : Risque modéré", "Pomme de terre : diagnostic du mildiou et pourriture des tubercules"),
            CropTelemetryRadar("🍅", "Tomate sous Serres", "Mitidja, Mostaganem, Biskra", "Santé Culture 95%", 0.95f, "Mouche blanche : Contrôlée", "Tomate : diagnostic de l'enroulement jaune des feuilles TYLCV"),
            CropTelemetryRadar("🫒", "Olivier Tizi Ouzou & Mascara", "Kabylie et Plaines de l'Ouest", "Santé Culture 89%", 0.89f, "Oeil de Paon : Surveillance requise", "Olivier : diagnostic de l'oeil de paon et irrigation complémentaire")
        )
        "en" -> listOf(
            CropTelemetryRadar("🥔", "Potatoes (Ain Defla)", "High Plateaus & Central Plain", "Crop Health 92%", 0.92f, "Late Blight: Moderate risk", "Potatoes: diagnose late blight and tuber rot prevention"),
            CropTelemetryRadar("🍅", "Greenhouse Tomatoes", "Mitidja, Mostaganem, Biskra", "Crop Health 95%", 0.95f, "Whitefly: Under control", "Tomatoes: diagnose leaf curl virus (TYLCV) and drip schedule"),
            CropTelemetryRadar("🫒", "Olive Orchards (Tizi & Mascara)", "Kabylie & Western Valleys", "Crop Health 89%", 0.89f, "Peacock Spot: Monitoring required", "Olives: diagnose peacock spot and pit hardening irrigation")
        )
        else -> listOf(
            CropTelemetryRadar("🥔", "بطاطا عين الدفلى", "الهضاب العليا والوسطى", "صحة المحصول 92%", 0.92f, "مخاطر الميلديو: متوسطة", "بطاطا: فحص بقع أوراق البطاطا والوقاية من الميلديو وعفن الدرنات"),
            CropTelemetryRadar("🍅", "طماطم البيوت المحمية", "متيجة، مستغانم، بسكرة", "صحة المحصول 95%", 0.95f, "حشرة الذبابة البيضاء: تحت السيطرة", "طماطم: فحص اصفرار وتجعد الأوراق (TYLCV) وضبط ري الشتلات"),
            CropTelemetryRadar("🫒", "زيتون تيزي وزو ومعسكر", "منطقة القبائل والسهول الغربية", "صحة المحصول 89%", 0.89f, "مرض عين الطاووس: يستلزم رصد دوري", "زيتون: فحص مرض عين الطاووس والري التكميلي لتصلب النواة")
        )
    }

    CyberBioBackground(modifier = modifier) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .testTag("dashboard_screen_content"),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 14.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Transparent Glassmorphic Header with Neon-Emerald Gradient Border
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .border(
                            BorderStroke(
                                1.8.dp,
                                Brush.horizontalGradient(
                                    listOf(
                                        NeonEmerald.copy(alpha = glowAlpha),
                                        ElectricMint.copy(alpha = glowAlpha),
                                        QuantumCyan.copy(alpha = 0.8f)
                                    )
                                )
                            ),
                            RoundedCornerShape(22.dp)
                        )
                        .shadow(elevation = 8.dp, shape = RoundedCornerShape(22.dp), spotColor = NeonEmerald),
                    color = colors.surfaceGlass
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(
                                        Brush.radialGradient(
                                            listOf(ForestGreenContainer, ForestGreenLight)
                                        )
                                    )
                                    .border(1.2.dp, ElectricMint.copy(alpha = 0.5f), RoundedCornerShape(14.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.EnergySavingsLeaf,
                                    contentDescription = strings.appTitle,
                                    tint = MutedForestGreen,
                                    modifier = Modifier.size(28.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = strings.appTitle,
                                        fontSize = 20.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = colors.textPrimary
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = ForestGreenContainer
                                    ) {
                                        Text(
                                            text = strings.agentBadge,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = ForestGreenDark,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                                Text(
                                    text = strings.appSubtitle,
                                    fontSize = 11.sp,
                                    color = colors.textSecondary
                                )
                            }
                        }

                        // Live Satellite Telemetry Chip
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = ForestGreenLight,
                            border = BorderStroke(1.dp, ElectricMint.copy(alpha = 0.4f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .background(ElectricMint)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = strings.sentinelConnected,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = ForestGreenDark
                                )
                            }
                        }
                    }
                }
            }

            // 2. Live Agritech Micro-Widget (Field Telemetry)
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp)),
                    shape = RoundedCornerShape(18.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border),
                    shadowElevation = 2.dp
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Outlined.Sensors,
                                    contentDescription = null,
                                    tint = QuantumBlue,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = strings.telemetryTitle,
                                    fontSize = 13.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = colors.textPrimary
                                )
                            }
                            Text(
                                text = strings.telemetrySubtitle,
                                fontSize = 11.sp,
                                color = colors.textMuted
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            TelemetryMetricBox(strings.soilMoisture, "68.4%", strings.soilMoistureSub, QuantumBlue)
                            TelemetryMetricBox(strings.evapotranspiration, "4.6 mm", strings.evapotranspirationSub, MutedForestGreen)
                            TelemetryMetricBox(strings.soilTemp, "21.8°C", strings.soilTempSub, WarningAmber)
                            TelemetryMetricBox(strings.waterSavings, "+36.8%", strings.waterSavingsSub, ForestGreenDark)
                        }
                    }
                }
            }

            // 3. Grid of Holographic Service Cards
            item {
                Text(
                    text = strings.servicesTitle,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary
                )
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        AnimatedHoloCard(
                            title = strings.cardDiagnosisTitle,
                            subtitle = strings.cardDiagnosisDesc,
                            icon = Icons.Outlined.MedicalServices,
                            badge = "AI VISION",
                            accentColor = MutedForestGreen,
                            containerColor = ForestGreenLight,
                            onClick = { onNavigateToDiagnosis(null) },
                            modifier = Modifier.weight(1f)
                        )
                        AnimatedHoloCard(
                            title = strings.cardWaterTitle,
                            subtitle = strings.cardWaterDesc,
                            icon = Icons.Outlined.WaterDrop,
                            badge = "HYDRO-PLAN",
                            accentColor = QuantumBlue,
                            containerColor = QuantumBlueLight,
                            onClick = onNavigateToWaterAdvisor,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        AnimatedHoloCard(
                            title = strings.cardQuantumTitle,
                            subtitle = strings.cardQuantumDesc,
                            icon = Icons.Outlined.AutoAwesome,
                            badge = "QUANTUM",
                            accentColor = ForestGreenDark,
                            containerColor = ForestGreenContainer,
                            onClick = onNavigateToQuantum,
                            modifier = Modifier.weight(1f)
                        )
                        AnimatedHoloCard(
                            title = strings.cardSafetyTitle,
                            subtitle = strings.cardSafetyDesc,
                            icon = Icons.Outlined.Shield,
                            badge = "INPV SAFETY",
                            accentColor = WarningAmber,
                            containerColor = WarningAmberLight,
                            onClick = onNavigateToSafety,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // 4. Strategic Crops Radar (Tomatoes, Potatoes, Olives)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = strings.strategicCropsTitle,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.textPrimary
                    )
                    Text(
                        text = strings.strategicCropsSubtitle,
                        fontSize = 11.5.sp,
                        color = MutedForestGreen,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(cropsRadar) { crop ->
                        Surface(
                            modifier = Modifier
                                .width(260.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .clickable { onNavigateToDiagnosis(crop.query) },
                            shape = RoundedCornerShape(16.dp),
                            color = colors.surface,
                            border = BorderStroke(1.dp, colors.border),
                            shadowElevation = 1.dp
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(crop.emoji, fontSize = 24.sp)
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = crop.name,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = colors.textPrimary
                                        )
                                    }
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = ForestGreenLight
                                    ) {
                                        Text(
                                            text = strings.quickScan,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = ForestGreenDark,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = crop.region,
                                    fontSize = 11.sp,
                                    color = colors.textSecondary
                                )
                                Spacer(modifier = Modifier.height(6.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = crop.healthIndex,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = ForestGreenDark
                                    )
                                    LinearProgressIndicator(
                                        progress = { crop.healthPercent },
                                        modifier = Modifier
                                            .width(70.dp)
                                            .height(5.dp)
                                            .clip(RoundedCornerShape(3.dp)),
                                        color = NeonEmerald,
                                        trackColor = colors.border
                                    )
                                }
                                Spacer(modifier = Modifier.height(3.dp))
                                Text(
                                    text = crop.riskFactor,
                                    fontSize = 10.5.sp,
                                    color = WarningAmber
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
fun TelemetryMetricBox(label: String, value: String, sublabel: String, color: Color) {
    val colors = LocalAppColors.current
    Column {
        Text(text = label, fontSize = 11.sp, color = colors.textSecondary)
        Spacer(modifier = Modifier.height(2.dp))
        Text(text = value, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = color)
        Text(text = sublabel, fontSize = 9.5.sp, color = colors.textMuted)
    }
}

@Composable
fun AnimatedHoloCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    badge: String,
    accentColor: Color,
    containerColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    var isPressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(targetValue = if (isPressed) 0.96f else 1f, label = "card_scale")

    Surface(
        modifier = modifier
            .height(130.dp)
            .scale(scale)
            .clip(RoundedCornerShape(18.dp))
            .clickable {
                onClick()
            },
        shape = RoundedCornerShape(18.dp),
        color = colors.surface,
        border = BorderStroke(1.dp, colors.border),
        shadowElevation = 2.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(containerColor),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = icon, contentDescription = title, tint = accentColor, modifier = Modifier.size(20.dp))
                }
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = containerColor
                ) {
                    Text(
                        text = badge,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = accentColor,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Column {
                Text(text = title, fontSize = 13.5.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)
                Spacer(modifier = Modifier.height(2.dp))
                Text(text = subtitle, fontSize = 10.5.sp, color = colors.textSecondary, maxLines = 2, lineHeight = 14.sp)
            }
        }
    }
}
