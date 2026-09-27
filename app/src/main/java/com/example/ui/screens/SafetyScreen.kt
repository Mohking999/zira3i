package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.outlined.Timer
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
import com.example.ui.components.SafetyDisclaimerNoticeBanner
import com.example.ui.theme.*

data class PreHarvestIntervalItem(
    val crop: String,
    val chemicalFamily: String,
    val phiDays: String,
    val guideline: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SafetyScreen(
    modifier: Modifier = Modifier
) {
    val colors = LocalAppColors.current
    val strings = LocalAppStrings.current
    val lang = LocalAppLanguage.current

    val phiItems = when (lang.code) {
        "fr" -> listOf(
            PreHarvestIntervalItem("Tomate (consommation fraîche)", "Fongicides systémiques (Difénoconazole)", "3 - 7 jours", "Ne pas récolter avant le délai prescrit pour éviter les résidus"),
            PreHarvestIntervalItem("Pomme de terre (consommation)", "Composés cuivriques & cymoxanil", "7 - 14 jours", "Respect impératif du DAR avant déterrage et commercialisation"),
            PreHarvestIntervalItem("Olivier (production d'huile)", "Traitements mouche de l'olive", "21 - 28 jours", "Éviter la contamination de l'huile d'olive vierge"),
            PreHarvestIntervalItem("Agrumes & Oranges", "Traitement cochenilles et thrips", "14 - 21 jours", "Tenir compte des pluies de lessivage avant récolte")
        )
        "en" -> listOf(
            PreHarvestIntervalItem("Tomato (fresh market)", "Systemic fungicides (Difenoconazole)", "3 - 7 days", "Do not harvest before interval ends to avoid toxic residues"),
            PreHarvestIntervalItem("Potato (consumption tubers)", "Copper compounds & cymoxanil", "7 - 14 days", "Strictly respect PHI before lifting and marketing tubers"),
            PreHarvestIntervalItem("Olive (oil production)", "Olive fruit fly treatments", "21 - 28 days", "Prevents pesticide migration into virgin olive oil"),
            PreHarvestIntervalItem("Citrus & Oranges", "Scale insect and thrips sprays", "14 - 21 days", "Account for rainfall wash-off before re-spraying")
        )
        else -> listOf(
            PreHarvestIntervalItem("طماطم (استهلاك طازج)", "مبيدات فطرية جهازية (ديفينوكونازول)", "3 - 7 أيام", "يمنع الجني قبل انقضاء المدة لمنع المتبقيات في الثمار"),
            PreHarvestIntervalItem("بطاطا (درنات استهلاك)", "مبيدات نحاسية وسيموكسانيل", "7 - 14 يوماً", "الالتزام التام بفترة الأمان قبل قلع المحصول وتسويقه"),
            PreHarvestIntervalItem("زيتون (عصر وإنتاج زيت)", "مبيدات ذبابة ثمار الزيتون الفوسفورية", "21 - 28 يوماً", "تفادي تلوث زيت الزيتون البكر بالمتبقيات السامة"),
            PreHarvestIntervalItem("حمضيات وبرتقال", "مبيدات الحشرات القشرية والتربس", "14 - 21 يوماً", "مراعاة فترات سقوط الأمطار وتكرار الرش")
        )
    }

    val rules = when (lang.code) {
        "fr" -> listOf(
            "1. Port d'équipements de protection individuelle (masque FFP3, gants nitrile, lunettes et combinaison).",
            "2. Traiter tôt le matin ou le soir ; éviter absolument par vent > 15 km/h ou forte canicule.",
            "3. Calibrer les buses du pulvérisateur pour éliminer les dérives et surdosages au sol.",
            "4. Rincer le matériel dans une zone isolée éloignée des cours d'eau et puits d'irrigation.",
            "5. Triple rinçage et perforation des bidons vides avant remise aux centres de collecte agréés."
        )
        "en" -> listOf(
            "1. Wear complete PPE (respirator mask, nitrile gloves, safety goggles, chemical suit).",
            "2. Spray in early morning or dusk; never spray during midday heat or winds > 15 km/h.",
            "3. Calibrate tractor spray nozzles to eliminate uneven drifting and ground waste.",
            "4. Wash sprayers in dedicated areas well away from drinking canals and irrigation wells.",
            "5. Triple-rinse and puncture empty pesticide containers before recycling disposal."
        )
        else -> listOf(
            "1. ارتداء معدات الوقاية الشخصية الكاملة (قناع التنفس، القفازات، النظارات، وحذاء الرش المخصص).",
            "2. الرش في الساعات المبكرة أو المسائية وتجنب الرش نهائياً أثناء هبوب الرياح وظهيرة الصيف.",
            "3. ضبط ومعايرة فوهات مرشات الجرار لمنع الإهدار والتنقيط العشوائي على التربة.",
            "4. غسل آلات الرش في أماكن معزولة بعيدة عن مجاري مياه الشرب وسواقي السقي.",
            "5. التخلص الآمن من العبوات الفارغة عبر التثقيب الثلاثي والغسل وتسليمها لنقاط الجمع المعتمدة."
        )
    }

    val contacts = when (lang.code) {
        "fr" -> listOf(
            "Institut National de Protection des Végétaux (INPV) — Stations El Harrach, Constantine, Sidi Bel Abbès, Ghardaïa",
            "Directions des Services Agricoles (DSA) et Chambres d'Agriculture à travers 58 wilayas",
            "Office National des Terres Agricoles et laboratoires de dosage des résidus phytosanitaires"
        )
        "en" -> listOf(
            "National Plant Protection Institute (INPV) — El Harrach, Constantine, Sidi Bel Abbes, Ghardaia",
            "Agricultural Services Directorates (DSA) & Chambers of Agriculture across 58 provinces",
            "National Office of Agricultural Lands & accredited pesticide residue laboratories"
        )
        else -> listOf(
            "المعهد الوطني لحماية النباتات (INPV) — محطات الحراش، قسنطينة، سيدي بلعباس، غرداية",
            "مديريات المصالح الفلاحية (DSA) والغرف الفلاحية الولائية عبر 58 ولاية",
            "الديوان الوطني للأراضي الفلاحية ومخابر تحليل متبقيات المبيدات"
        )
    }

    CyberBioBackground(modifier = modifier) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 14.dp)
                .testTag("safety_screen_content"),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(WarningAmberLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = strings.safetyHeaderTitle,
                            tint = WarningAmber,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = strings.safetyHeaderTitle,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Text(
                            text = strings.safetyHeaderSubtitle,
                            fontSize = 11.5.sp,
                            color = colors.textSecondary
                        )
                    }
                }
            }

            // Primary Safety Disclaimer Notice Banner
            item {
                SafetyDisclaimerNoticeBanner(
                    notice = strings.safetyWarningNotice
                )
            }

            // Golden Rules for Safe Spraying
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = strings.safetyGoldenRulesTitle,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        rules.forEach { rule ->
                            Text(
                                text = rule,
                                fontSize = 12.sp,
                                color = colors.textPrimary,
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
                    shape = RoundedCornerShape(18.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.Timer, contentDescription = null, tint = QuantumBlue)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = strings.safetyPhiTableTitle,
                                fontSize = 13.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.textPrimary
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        phiItems.forEach { item ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = colors.surfaceVariant.copy(alpha = 0.5f),
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
                                        Text(item.crop, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = colors.textPrimary)
                                        Text(item.chemicalFamily, fontSize = 11.sp, color = colors.textSecondary)
                                        Text(item.guideline, fontSize = 11.sp, color = ForestGreenDark)
                                    }
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = WarningAmberLight
                                    ) {
                                        Text(
                                            item.phiDays,
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

            // Official Contacts
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    color = colors.surface,
                    border = BorderStroke(1.dp, colors.border),
                    shadowElevation = 2.dp
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = strings.safetyContactsTitle,
                            fontSize = 13.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.textPrimary
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        contacts.forEach { contact ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Icon(Icons.Default.Call, contentDescription = null, tint = MutedForestGreen, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(contact, fontSize = 12.sp, color = colors.textPrimary, lineHeight = 17.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
