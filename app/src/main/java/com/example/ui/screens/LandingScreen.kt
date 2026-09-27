package com.example.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

data class StrategicCropInfo(
    val title: String,
    val arabicName: String,
    val regions: String,
    val emoji: String,
    val currentSeasonStage: String,
    val criticalThreat: String,
    val waterGuidance: String,
    val defaultPrompt: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LandingScreen(
    onOpenAgentChat: (prefilledPrompt: String?) -> Unit,
    modifier: Modifier = Modifier
) {
    val strategicCrops = listOf(
        StrategicCropInfo(
            title = "طماطم",
            arabicName = "محصول الطماطم (حقول مكشوفة وبيوت محمية)",
            regions = "متيجة، مستغانم، بسكرة، معسكر",
            emoji = "🍅",
            currentSeasonStage = "مرحلة التزهير والعقد والنمو الخضري السريع",
            criticalThreat = "فيروس تجعد الأوراق (TYLCV) واللفحة المتأخرة والذبابة البيضاء",
            waterGuidance = "ري تنقيط صباحي منتظم: 2.5 - 4.0 لتر/شتلة مع مراعاة الرطوبة",
            defaultPrompt = "أريد فحص محصول الطماطم: الأوراق ملتفة لأعلى وبها اصفرار، كيف أعالجها وأضبط الري؟"
        ),
        StrategicCropInfo(
            title = "بطاطا",
            arabicName = "محصول البطاطا الموسمية وما بعد الفصلية",
            regions = "عين الدفلى، وادي سوف، معسكر، البويرة",
            emoji = "🥔",
            currentSeasonStage = "مرحلة تضخم وتكوين الدرنات الأرضية",
            criticalThreat = "اللفحة المتأخرة (الميلديو) وعفن الدرنات وخنفساء كولورادو",
            waterGuidance = "سقي نبضي متكرر 35-45 م³/هكتار لتفادي تشقق الدرنات",
            defaultPrompt = "ألاحظ بقعاً بنية داكنة مع زغب أبيض على أوراق البطاطا في الحقل، ما التشخيص وجدول السقي؟"
        ),
        StrategicCropInfo(
            title = "زيتون",
            arabicName = "بساتين الزيتون والإنتاج الزيتي",
            regions = "تيزي وزو، بجاية، البويرة، معسكر، جيجل",
            emoji = "🫒",
            currentSeasonStage = "مرحلة امتلاء الثمار وتصلب النواة",
            criticalThreat = "مرض عين الطاووس وذبابة ثمار الزيتون والإجهاد المائي الصيفي",
            waterGuidance = "ري تكميلي 25-35 لتر/شجرة لرفع نسبة الزيت وتخفيف صدمة الحرارة",
            defaultPrompt = "أشجار الزيتون تعاني من بقع دائرية رمادية على الأوراق مع تساقط، ما هو العلاج وجدول الري؟"
        )
    )

    // Gentle pulse animation for the Agent hero badge
    val infiniteTransition = rememberInfiniteTransition(label = "agent_pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Scaffold(
        modifier = modifier
            .fillMaxSize()
            .testTag("landing_screen_scaffold"),
        containerColor = WarmNeutralBackground,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(ForestGreenLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.EnergySavingsLeaf,
                                contentDescription = null,
                                tint = MutedForestGreen,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "زرعي AI | Zira3i AI",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = DeepCharcoalText
                            )
                            Text(
                                text = "المنصة الجزائرية للوقاية الزراعية وترشيد السقي",
                                fontSize = 11.sp,
                                color = CharcoalSecondary
                            )
                        }
                    }
                },
                actions = {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = ForestGreenContainer,
                        modifier = Modifier.padding(end = 12.dp)
                    ) {
                        Text(
                            text = "موسم 2026/2027",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = ForestGreenDark,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = WarmNeutralBackground
                )
            )
        },
        floatingActionButton = {
            // Prominent modern circular button for the Agent
            FloatingActionButton(
                onClick = { onOpenAgentChat(null) },
                containerColor = MutedForestGreen,
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier
                    .size(68.dp)
                    .scale(pulseScale)
                    .testTag("floating_agent_button"),
                elevation = FloatingActionButtonDefaults.elevation(6.dp)
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.SmartToy,
                        contentDescription = "الوكيل الذكي",
                        modifier = Modifier.size(28.dp)
                    )
                    Text(
                        text = "Agent",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. PROMINENT MODERN HERO CARD: "الوكيل الذكي" (Agent)
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .clickable { onOpenAgentChat(null) }
                        .testTag("hero_agent_card"),
                    shape = RoundedCornerShape(22.dp),
                    color = CardSurface,
                    border = BorderStroke(1.5.dp, MutedForestGreen.copy(alpha = 0.4f)),
                    shadowElevation = 3.dp
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Large Circular Agent Icon with badge
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(60.dp)
                                        .clip(CircleShape)
                                        .background(
                                            Brush.radialGradient(
                                                listOf(ForestGreenContainer, ForestGreenLight)
                                            )
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.MedicalServices,
                                        contentDescription = "الوكيل الذكي",
                                        tint = MutedForestGreen,
                                        modifier = Modifier.size(32.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(14.dp))

                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = "الوكيل الذكي",
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = DeepCharcoalText
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Surface(
                                            shape = RoundedCornerShape(12.dp),
                                            color = ForestGreenContainer
                                        ) {
                                            Text(
                                                text = "Agent AI",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = ForestGreenDark,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(3.dp))
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .clip(CircleShape)
                                                .background(MutedForestGreen)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = "متصل الآن • طبيب زراعي استشاري",
                                            fontSize = 12.sp,
                                            color = CharcoalSecondary
                                        )
                                    }
                                }
                            }

                            // Open Chat Arrow Icon
                            FilledIconButton(
                                onClick = { onOpenAgentChat(null) },
                                colors = IconButtonDefaults.filledIconButtonColors(
                                    containerColor = ForestGreenLight,
                                    contentColor = MutedForestGreen
                                ),
                                modifier = Modifier.size(44.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                    contentDescription = "فتح المحادثة"
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "اضغط لبدء جلسة تشخيص فورية: ارفع صورة لأوراق أو ثمار محصولك، احصل على نسبة الثقة، الفرضيات البديلة، ومؤشر ترشيد مياه الري لندرة المياه.",
                            fontSize = 13.5.sp,
                            color = DeepCharcoalText,
                            lineHeight = 20.sp
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Quick action chips inside the Agent Card
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = ForestGreenLight,
                                modifier = Modifier.weight(1f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Outlined.PhotoCamera,
                                        contentDescription = null,
                                        tint = MutedForestGreen,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "فحص صورة بالكاميرا",
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = ForestGreenDark
                                    )
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = QuantumBlueLight,
                                modifier = Modifier.weight(1f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.WaterDrop,
                                        contentDescription = null,
                                        tint = QuantumBlue,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "مستشار الري الذكي",
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = QuantumBlue
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // 2. Weather & Drought Regional Advisory Card
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = QuantumBlueLight.copy(alpha = 0.5f),
                    border = BorderStroke(1.dp, QuantumBlue.copy(alpha = 0.2f))
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.WbSunny,
                            contentDescription = null,
                            tint = QuantumBlue,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "حالة الطقس وترشيد مياه السقي (المناخ المغاربي)",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = QuantumBlue
                            )
                            Spacer(modifier = Modifier.height(3.dp))
                            Text(
                                text = "موجة جفاف معتدلة وارتفاع درجات الحرارة نهاراً. يُوصى بالاعتماد على الري بالتنقيط في الفجر، وخفض التبخر السطحي بتطبيق العزل العضوي (Mulching). توفير مياه متوقع: +35%.",
                                fontSize = 12.sp,
                                color = DeepCharcoalText,
                                lineHeight = 18.sp
                            )
                        }
                    }
                }
            }

            // 3. Strategic Crops Section Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "المحاصيل الاستراتيجية الوطنية",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = DeepCharcoalText
                        )
                        Text(
                            text = "دليل الوقاية والاحتياج المائي لأهم حقول الجزائر",
                            fontSize = 12.sp,
                            color = CharcoalSecondary
                        )
                    }
                }
            }

            // 4. Strategic Crops Cards: طماطم، بطاطا، زيتون
            items(strategicCrops.size) { index ->
                val crop = strategicCrops[index]
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .testTag("crop_card_${crop.title}"),
                    shape = RoundedCornerShape(16.dp),
                    color = CardSurface,
                    border = BorderStroke(1.dp, SoftBorder),
                    shadowElevation = 0.5.dp
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
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(ForestGreenLight),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = crop.emoji,
                                        fontSize = 24.sp
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = crop.title,
                                        fontSize = 17.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = DeepCharcoalText
                                    )
                                    Text(
                                        text = "المناطق: ${crop.regions}",
                                        fontSize = 11.5.sp,
                                        color = CharcoalSecondary
                                    )
                                }
                            }

                            // Consult with Agent button for this crop
                            FilledTonalButton(
                                onClick = { onOpenAgentChat(crop.defaultPrompt) },
                                shape = RoundedCornerShape(10.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                colors = ButtonDefaults.filledTonalButtonColors(
                                    containerColor = ForestGreenLight,
                                    contentColor = ForestGreenDark
                                )
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.Chat,
                                    contentDescription = null,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("استشر الوكيل", fontSize = 11.5.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Stage & Threats
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = SurfaceVariantWarm.copy(alpha = 0.6f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text(
                                    text = "📌 طور المحصول: ${crop.currentSeasonStage}",
                                    fontSize = 12.sp,
                                    color = DeepCharcoalText
                                )
                                Spacer(modifier = Modifier.height(3.dp))
                                Text(
                                    text = "⚠️ الآفات الحرجة: ${crop.criticalThreat}",
                                    fontSize = 12.sp,
                                    color = WarningAmber,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Water Guidance
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(
                                imageVector = Icons.Filled.WaterDrop,
                                contentDescription = null,
                                tint = QuantumBlue,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "توصية السقي: ${crop.waterGuidance}",
                                fontSize = 11.5.sp,
                                color = DeepCharcoalText
                            )
                        }
                    }
                }
            }

            // Bottom space for floating action button
            item {
                Spacer(modifier = Modifier.height(50.dp))
            }
        }
    }
}
