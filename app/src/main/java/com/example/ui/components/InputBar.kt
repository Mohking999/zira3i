package com.example.ui.components

import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.AddPhotoAlternate
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.outlined.PhotoCamera
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.theme.*

@Composable
fun InputBar(
    text: String,
    onTextChange: (String) -> Unit,
    attachedImageUri: Uri?,
    onRemoveImage: () -> Unit,
    onAttachPhotoClick: () -> Unit,
    onSendClick: () -> Unit,
    isLoading: Boolean,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .imePadding()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        color = Color.Transparent
    ) {
        Column(
            modifier = Modifier.fillMaxWidth()
        ) {
            // Attached image preview chip if an image is chosen
            if (attachedImageUri != null) {
                Surface(
                    modifier = Modifier
                        .padding(bottom = 8.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    shape = RoundedCornerShape(12.dp),
                    color = CardSurface,
                    border = BorderStroke(1.dp, SoftBorder)
                ) {
                    Row(
                        modifier = Modifier.padding(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = attachedImageUri,
                            contentDescription = "الصورة المرفقة للمحصول",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(8.dp))
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "تم إرفاق صورة العينة الزراعية",
                            fontSize = 12.sp,
                            color = DeepCharcoalText
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        IconButton(
                            onClick = onRemoveImage,
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(SurfaceVariantWarm)
                                .testTag("remove_image_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "حذف الصورة",
                                tint = DeepCharcoalText,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }

            // Pill-shaped container
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(28.dp))
                    .testTag("input_bar_surface"),
                shape = RoundedCornerShape(28.dp),
                color = CardSurface,
                border = BorderStroke(1.dp, SoftBorder),
                shadowElevation = 2.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Image picker button
                    IconButton(
                        onClick = onAttachPhotoClick,
                        modifier = Modifier
                            .size(40.dp)
                            .testTag("attach_image_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddPhotoAlternate,
                            contentDescription = "إرفاق صورة نبتة",
                            tint = if (attachedImageUri != null) MutedForestGreen else CharcoalSecondary,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    // Input Text Field
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 8.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        if (text.isEmpty()) {
                            Text(
                                text = "صف أعراض المحصول أو ارفع صورة...",
                                fontSize = 14.sp,
                                color = CharcoalMuted
                            )
                        }
                        BasicTextField(
                            value = text,
                            onValueChange = onTextChange,
                            textStyle = TextStyle(
                                fontSize = 14.sp,
                                color = DeepCharcoalText
                            ),
                            cursorBrush = SolidColor(MutedForestGreen),
                            maxLines = 4,
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("input_text_field")
                        )
                    }

                    // Send Button
                    val canSend = (text.isNotBlank() || attachedImageUri != null) && !isLoading
                    IconButton(
                        onClick = {
                            if (canSend) onSendClick()
                        },
                        enabled = canSend,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(if (canSend) MutedForestGreen else ForestGreenLight)
                            .testTag("send_button")
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(18.dp),
                                color = MutedForestGreen,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.Send,
                                contentDescription = "إرسال الاستشارة الزراعية",
                                tint = if (canSend) Color.White else CharcoalMuted,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
