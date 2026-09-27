package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = ElectricMint,
    onPrimary = Color.Black,
    primaryContainer = ForestGreenDark,
    onPrimaryContainer = Color.White,
    secondary = QuantumCyan,
    background = DarkBioBackground,
    surface = DarkBioSurface,
    onBackground = DarkTextPrimary,
    onSurface = DarkTextPrimary,
    outline = DarkBioBorder,
    surfaceVariant = DarkBioSurfaceGlass,
    onSurfaceVariant = DarkTextSecondary
)

private val LightColorScheme = lightColorScheme(
    primary = MutedForestGreen,
    onPrimary = Color.White,
    primaryContainer = ForestGreenLight,
    onPrimaryContainer = ForestGreenDark,
    secondary = QuantumBlue,
    background = WarmNeutralBackground,
    surface = CardSurface,
    onBackground = DeepCharcoalText,
    onSurface = DeepCharcoalText,
    outline = SoftBorder,
    surfaceVariant = SurfaceVariantWarm,
    onSurfaceVariant = DeepCharcoalText
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val appColors = if (darkTheme) {
        AppColors(
            background = DarkBioBackground,
            surface = DarkBioSurface,
            surfaceGlass = DarkBioSurfaceGlass,
            border = DarkBioBorder,
            textPrimary = DarkTextPrimary,
            textSecondary = DarkTextSecondary,
            textMuted = DarkTextMuted,
            surfaceVariant = Color(0xFF1B2E29),
            primary = ElectricMint,
            accentMint = ElectricMint,
            accentCyan = QuantumCyan,
            accentEmerald = NeonEmerald
        )
    } else {
        AppColors(
            background = WarmNeutralBackground,
            surface = CardSurface,
            surfaceGlass = CardSurfaceGlass,
            border = SoftBorder,
            textPrimary = DeepCharcoalText,
            textSecondary = CharcoalSecondary,
            textMuted = CharcoalMuted,
            surfaceVariant = SurfaceVariantWarm,
            primary = MutedForestGreen,
            accentMint = ElectricMint,
            accentCyan = QuantumBlue,
            accentEmerald = NeonEmerald
        )
    }

    CompositionLocalProvider(LocalAppColors provides appColors) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = Typography,
            content = content
        )
    }
}
