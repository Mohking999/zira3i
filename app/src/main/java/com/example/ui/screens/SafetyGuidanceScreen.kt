package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

data class PhiCropGuide(
    val crop: String,
    val chemicalFamily: String,
    val typicalPhiDays: String,
    val note: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SafetyGuidanceScreen(
    modifier: Modifier = Modifier
) {
    val phiGuides = listOf(
        PhiCropGuide("طماطم (استهلاك طازج)", "مبيدات فطرية جهازية (ديفينوكونازول)", "3 - 7 أيام", "يمنع الجني قبل انقضاء المدة لمنع متبقيات المبيد في الثمار"),
        PhiCropGuide("بطاطا (درنات استهلاك)", "مبيدات نحاسية / سيموكسانيل", "7 - 14 يوماً", "الالتزام التام بفترة الأمان قبل قلع المحصول"),
        PhiCropGuide("زيتون (مائدة / عصر)", "مبيدات ذبابة الزيتون الفوسفورية", "21 - 28 يوماً", "تفادي تلوث زيت الزيتون بالمتبقيات الكيميائية"),
        PhiCropGuide("حمضيات وبرتقال", "مبيدات الحشرات القشرية والتربس", "14 - 21 يوماً", "مراعاة فترات سقوط الأمطار وتكرار الرش")
    )

    Scaffold(
        modifier = modifier
            .fillMaxSize()
            .testTag("safety_guidance_scaffold"),
        containerColor = WarmNeutralBackground,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(WarningAmberLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Shield,
                                contentDescription = null,
                                tint = WarningAmber,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "دليل الأمان والوقاية الزراعية",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = DeepCharcoalText
                            )
                            Text(
                                text = "الاستخدام المسؤول للمبيدات وفترات الأمان (PHI)",
                                fontSize = 11.sp,
                                color = CharcoalSecondary
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = WarmNeutralBackground
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // High Alert Banner: Pesticide Misuse
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    color = WarningAmberLight.copy(alpha = 0.6f),
                    border = BorderStroke(1.5.dp, WarningAmber.copy(alpha = 0.4f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.WarningAmber, contentDescription = null, tint = WarningAmber, modifier = Modifier.size(24.dp))
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "تحذير أمان: تجنب الخلط والجرعات العشوائية",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = WarningAmber
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "إن الاستعمال المفرط أو خلط المبيدات الفطرية والحشرية دون استشارة مهندس وقاية النباتات يؤدي إلى إكساب الآفات مناعة مكتسبة، تدمير الحشرات النافعة كالنحل والدعسوقة، وتسميم التربة والمياه الجوفية.",
                            fontSize = 12.5.sp,
                            color = DeepCharcoalText,
                            lineHeight = 18.sp
                        )
                    }
                }
            }

            // Golden Rules for Safe Spraying
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = CardSurface,
                    border = BorderStroke(1.dp, SoftBorder)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "القواعد الذهبية الخمس للرش الزراعي الآمن:",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = DeepCharcoalText
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        val rules = listOf(
                            "1. ارتداء معدات الوقاية الشخصية (قناع التنفس، القفازات المطاطية، النظارات الواقية، وحذاء الرش المخصص).",
                            "2. الرش في الساعات المبكرة أو المسائية وتجنب الرش نهائياً أثناء هبوب الرياح وساعات الظهيرة الحارة.",
                            "3. ضبط ومعايرة فوهات مرشات الجرار وظهور الرشاشات لمنع الإهدار والتنقيط الزائد.",
                            "4. غسل آلات الرش في أماكن معزولة بعيدة عن مجاري مياه الشرب وسواقي السقي.",
                            "5. التخلص الآمن من العبوات الفارغة عبر التثقيب الثلاثي والغسل وتسليمها لنقاط الجمع المعتمدة."
                        )
                        rules.forEach { rule ->
                            Text(
                                text = rule,
                                fontSize = 12.sp,
                                color = DeepCharcoalText,
                                lineHeight = 18.sp,
                                modifier = Modifier.padding(vertical = 3.dp)
                            )
                        }
                    }
                }
            }

            // Pre-Harvest Interval (PHI) Guide Table
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = CardSurface,
                    border = BorderStroke(1.dp, SoftBorder)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.Timer, contentDescription = null, tint = QuantumBlue)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "دليل فترات الأمان قبل الجني (Délai Avant Récolte - PHI)",
                                fontSize = 13.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = DeepCharcoalText
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        phiGuides.forEach { guide ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = SurfaceVariantWarm.copy(alpha = 0.5f),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(10.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(guide.crop, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = DeepCharcoalText)
                                        Text(guide.chemicalFamily, fontSize = 11.sp, color = CharcoalSecondary)
                                        Text(guide.note, fontSize = 11.sp, color = ForestGreenDark)
                                    }
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = WarningAmberLight
                                    ) {
                                        Text(
                                            guide.typicalPhiDays,
                                            fontSize = 11.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = WarningAmber,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Specialist & Institutional Contacts in Algeria
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = CardSurface,
                    border = BorderStroke(1.dp, SoftBorder)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.ContactSupport, contentDescription = null, tint = ForestGreenDark)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "جهات الاتصال الرسمية للمساعدة الزراعية:",
                                fontSize = 13.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = DeepCharcoalText
                            )
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        val contacts = listOf(
                            "المعهد الوطني لحماية النباتات (INPV) — محطات الحراش، قسنطينة، سيدي بلعباس، غرداية",
                            "مديريات المصالح الفلاحية (DSA) والغرف الفلاحية الولائية عبر 58 ولاية",
                            "الديوان الوطني للأراضي الفلاحية والمخابر الولائية لتحليل التربة والمياه"
                        )
                        contacts.forEach { contact ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Icon(Icons.Default.Call, contentDescription = null, tint = MutedForestGreen, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(contact, fontSize = 12.sp, color = DeepCharcoalText, lineHeight = 17.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
