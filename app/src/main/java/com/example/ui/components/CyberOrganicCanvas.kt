package com.example.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.example.ui.theme.*
import kotlin.math.sin

/**
 * Animated Ambient Bio-Grid and Floating Spores Background
 */
@Composable
fun CyberBioBackground(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "ambient_bio")
    val waveOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 6.28318f,
        animationSpec = infiniteRepeatable(
            animation = tween(10000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "waveOffset"
    )

    Box(modifier = modifier.fillMaxSize()) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val width = size.width
            val height = size.height

            // Soft radial ambient bio glow at top-center
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        ForestGreenContainer.copy(alpha = 0.35f),
                        WarmNeutralBackground.copy(alpha = 0.1f),
                        Color.Transparent
                    ),
                    center = Offset(width / 2f, 120f),
                    radius = width * 0.8f
                ),
                radius = width * 0.8f,
                center = Offset(width / 2f, 120f)
            )

            // Animated subtle floating particle spores
            val particleCount = 18
            for (i in 0 until particleCount) {
                val seed = i * 137.5f
                val px = (seed * 7.1f) % width
                val speed = ((i % 3) + 1) * 0.35f
                val py = (height - ((waveOffset * 80f * speed + i * 90f) % height))
                val radius = if (i % 3 == 0) 3.5f else 2f
                val alpha = (0.25f + sin(waveOffset + i) * 0.15f).coerceIn(0.1f, 0.5f)

                drawCircle(
                    color = if (i % 2 == 0) ElectricMint.copy(alpha = alpha) else QuantumCyan.copy(alpha = alpha),
                    radius = radius,
                    center = Offset(px, py)
                )
            }
        }
        content()
    }
}

/**
 * Animated Hydrodynamic Water Wave Gauge
 */
@Composable
fun AnimatedWaterWaveGauge(
    moisturePercent: Int,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "water_wave")
    val phase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 6.28318f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "phase"
    )

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val width = size.width
            val height = size.height

            // Background tank
            drawRect(color = QuantumBlueLight.copy(alpha = 0.35f))

            // Wave calculation based on moisture percentage
            val waterLevelY = height * (1f - (moisturePercent / 100f).coerceIn(0.1f, 0.95f))

            val path = Path().apply {
                moveTo(0f, height)
                lineTo(0f, waterLevelY)

                val waveHeight = 7.dp.toPx()
                val waveLength = width / 1.5f

                var x = 0f
                while (x <= width) {
                    val y = waterLevelY + sin((x / waveLength) * 6.28318f + phase) * waveHeight
                    lineTo(x, y)
                    x += 10f
                }
                lineTo(width, height)
                close()
            }

            // Draw fluid gradient
            drawPath(
                path = path,
                brush = Brush.verticalGradient(
                    colors = listOf(
                        QuantumCyan.copy(alpha = 0.6f),
                        QuantumBlue.copy(alpha = 0.8f)
                    ),
                    startY = waterLevelY - 10f,
                    endY = height
                )
            )

            // Outline stroke
            drawRoundRect(
                color = QuantumBlue.copy(alpha = 0.25f),
                style = Stroke(width = 1.5.dp.toPx()),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(16.dp.toPx())
            )
        }
    }
}

/**
 * Animated Laser Scan Wave for AI Camera Diagnosis
 */
@Composable
fun AnimatedLaserScanner(
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "scanner_laser")
    val scanY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scanY"
    )

    Canvas(modifier = modifier) {
        val width = size.width
        val height = size.height
        val currentY = height * scanY

        // Laser scan line with glowing neon halo
        drawLine(
            brush = Brush.horizontalGradient(
                colors = listOf(
                    Color.Transparent,
                    ElectricMint.copy(alpha = 0.8f),
                    Color.White,
                    ElectricMint.copy(alpha = 0.8f),
                    Color.Transparent
                )
            ),
            start = Offset(0f, currentY),
            end = Offset(width, currentY),
            strokeWidth = 3.dp.toPx()
        )

        // Trailing glow
        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(
                    Color.Transparent,
                    ElectricMint.copy(alpha = 0.15f),
                    Color.Transparent
                ),
                startY = currentY - 24.dp.toPx(),
                endY = currentY + 24.dp.toPx()
            ),
            topLeft = Offset(0f, currentY - 24.dp.toPx()),
            size = androidx.compose.ui.geometry.Size(width, 48.dp.toPx())
        )
    }
}
