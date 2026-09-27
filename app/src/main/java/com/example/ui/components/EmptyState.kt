package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Eco
import androidx.compose.material.icons.filled.LocalDrink
import androidx.compose.material.icons.filled.Park
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.outlined.Agriculture
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.WaterDrop
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

data class CropSuggestion(
    val title: String,
    val cropEmoji: String,
    val description: String,
    val query: String,
    val icon: ImageVector
)

@Composable
fun EmptyState(
    onSuggestionClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val suggestions = listOf(
        CropSuggestion(
            title = "طماطم",
            cropEmoji = "🍅",
            description = "فحص التفاف الأوراق، اللفحة المتأخرة، أو اصفرار الشتلات",
            query = "لدي مشكلة في محصول الطماطم: الأوراق ملتفة لأعلى وبها اصفرار، كيف أشخص الحالة وأعالجها؟",
            icon = Icons.Filled.Eco
        ),
        CropSuggestion(
            title = "بطاطا",
            cropEmoji = "🥔",
            description = "تشخيص بقع الأوراق، العفن الفطري، وترشيد سقي الدرنات",
            query = "ألاحظ بقعاً بنية داكنة مع زغب أبيض على أوراق البطاطا في الحقل، ما التشخيص وكيف أسقيها؟",
            icon = Icons.Filled.Spa
        ),
        CropSuggestion(
            title = "زيتون",
            cropEmoji = "🫒",
            description = "كشف مرض عين الطاووس، تساقط الأوراق، وحساب الري التكميلي",
            query = "أشجار الزيتون تعاني من بقع دائرية رمادية على الأوراق مع تساقط، ما هو العلاج وجدول الري؟",
            icon = Icons.Filled.Park
        ),
        CropSuggestion(
            title = "مستشار الري",
            cropEmoji = "💧",
            description = "تحسين توزيع مياه السقي الذكي لندرة المياه وموجات الجفاف",
            query = "أريد خطة ري ذكية ومؤشر تحسين توزيع المياه لمحصولي لمواجهة الجفاف وشح الأمطار",
            icon = Icons.Outlined.WaterDrop
        )
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // App Minimalist Emblem
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(ForestGreenLight),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Outlined.Agriculture,
                contentDescription = "زرعي AI",
                tint = MutedForestGreen,
                modifier = Modifier.size(38.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Title
        Text(
            text = "زرعي AI | Zira3i AI",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = DeepCharcoalText,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(6.dp))

        // Subtitle / Claude-like clean description
        Text(
            text = "طبيبك الزراعي الذكي لمرافقة محاصيلك وحمايتها من الآفات وترشيد مياه الري بأحدث تقنيات الذكاء الاصطناعي.",
            fontSize = 14.sp,
            color = CharcoalSecondary,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(28.dp))

        // Section header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "المحاصيل الاستراتيجية والأسئلة الشائعة",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = DeepCharcoalText
            )
            Text(
                text = "الجزائر والمغرب العربي",
                fontSize = 12.sp,
                color = MutedForestGreen,
                fontWeight = FontWeight.Medium
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Suggestion Cards Column
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            suggestions.forEach { item ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .clickable { onSuggestionClick(item.query) }
                        .testTag("suggestion_card_${item.title}"),
                    shape = RoundedCornerShape(14.dp),
                    color = CardSurface,
                    border = BorderStroke(1.dp, SoftBorder),
                    shadowElevation = 0.5.dp
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(ForestGreenLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = item.cropEmoji,
                                fontSize = 22.sp
                            )
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column(
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = item.title,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = DeepCharcoalText
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = item.description,
                                fontSize = 12.5.sp,
                                color = CharcoalSecondary,
                                lineHeight = 18.sp
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Feature Highlight Pills
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            AssistChip(
                onClick = {},
                label = { Text("فحص فوتوغرافي بالكاميرا", fontSize = 11.sp, color = DeepCharcoalText) },
                leadingIcon = {
                    Icon(Icons.Outlined.CheckCircle, contentDescription = null, tint = MutedForestGreen, modifier = Modifier.size(14.dp))
                },
                colors = AssistChipDefaults.assistChipColors(
                    containerColor = Color.Transparent
                ),
                border = BorderStroke(1.dp, SoftBorder)
            )
            Spacer(modifier = Modifier.width(8.dp))
            AssistChip(
                onClick = {},
                label = { Text("مستشار ترشيد الري", fontSize = 11.sp, color = DeepCharcoalText) },
                leadingIcon = {
                    Icon(Icons.Filled.LocalDrink, contentDescription = null, tint = QuantumBlue, modifier = Modifier.size(14.dp))
                },
                colors = AssistChipDefaults.assistChipColors(
                    containerColor = Color.Transparent
                ),
                border = BorderStroke(1.dp, SoftBorder)
            )
        }
    }
}
