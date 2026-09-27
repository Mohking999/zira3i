package com.example.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Agriculture
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.model.ChatMessage
import com.example.model.MessageSender
import com.example.ui.theme.*

@Composable
fun ChatMessageBubble(
    message: ChatMessage,
    modifier: Modifier = Modifier
) {
    val isUser = message.sender == MessageSender.USER

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .testTag("chat_bubble_${if (isUser) "user" else "doctor"}"),
        horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start,
            verticalAlignment = Alignment.Top
        ) {
            if (!isUser) {
                // Doctor Avatar
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(ForestGreenLight),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Agriculture,
                        contentDescription = "زرعي AI",
                        tint = MutedForestGreen,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
            }

            Column(
                modifier = Modifier.weight(1f, fill = false),
                horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
            ) {
                // Sender label
                Text(
                    text = if (isUser) "المزارع" else "زرعي AI — الطبيب الزراعي",
                    fontSize = 11.5.sp,
                    color = CharcoalSecondary,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(bottom = 3.dp, start = 4.dp, end = 4.dp)
                )

                // Message Bubble
                Surface(
                    shape = RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart = if (isUser) 16.dp else 4.dp,
                        bottomEnd = if (isUser) 4.dp else 16.dp
                    ),
                    color = if (isUser) ForestGreenLight else CardSurface,
                    border = BorderStroke(1.dp, if (isUser) MutedForestGreen.copy(alpha = 0.3f) else SoftBorder),
                    shadowElevation = 0.5.dp
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp)
                    ) {
                        // User attached image
                        if (message.imageUri != null) {
                            AsyncImage(
                                model = message.imageUri,
                                contentDescription = "صورة النبتة المفحوصة",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .heightIn(max = 200.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .padding(bottom = 8.dp)
                            )
                        }

                        // Message Text with clean line height
                        Text(
                            text = message.text,
                            fontSize = 14.sp,
                            color = DeepCharcoalText,
                            lineHeight = 22.sp
                        )
                    }
                }

                // If message has DiagnosticReport, render DiagnosticReportCard
                if (message.diagnosticReport != null) {
                    Spacer(modifier = Modifier.height(10.dp))
                    DiagnosticReportCard(report = message.diagnosticReport)
                }
            }

            if (isUser) {
                Spacer(modifier = Modifier.width(8.dp))
                // User Avatar
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(SurfaceVariantWarm),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "المزارع",
                        tint = DeepCharcoalText,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}
