package com.example.ui.theme

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// Light Mode (Warm Neutral Fusion)
val WarmNeutralBackground = Color(0xFFF6F8F6)
val DeepCharcoalText = Color(0xFF1F2923)
val CharcoalSecondary = Color(0xFF5A6E63)
val CharcoalMuted = Color(0xFF8FA197)

// Dark Mode (Cyber-Organic Bio Dark)
val DarkBioBackground = Color(0xFF0C1412)
val DarkBioSurface = Color(0xFF142420)
val DarkBioSurfaceGlass = Color(0xE6142420)
val DarkBioBorder = Color(0xFF223832)
val DarkTextPrimary = Color(0xFFF3F7F5)
val DarkTextSecondary = Color(0xFF9FB2A8)
val DarkTextMuted = Color(0xFF6B8075)

// Dynamic Botanical Emerald & Mint Accents
val MutedForestGreen = Color(0xFF2E8B57)
val ForestGreenDark = Color(0xFF1B5E39)
val ForestGreenLight = Color(0xFFE8F5E9)
val ForestGreenContainer = Color(0xFFC8E6C9)

// Cybernetic Glow Colors
val ElectricMint = Color(0xFF00E676)
val NeonEmerald = Color(0xFF10B981)
val QuantumCyan = Color(0xFF00E5FF)
val QuantumBlue = Color(0xFF1E88E5)
val QuantumBlueLight = Color(0xFFE3F2FD)

// Surfaces & Subtle Glassmorphic Borders
val CardSurface = Color(0xFFFFFFFF)
val CardSurfaceGlass = Color(0xF2FFFFFF)
val SoftBorder = Color(0xFFE0E7E2)
val SoftBorderGlow = Color(0x4000E676)
val SurfaceVariantWarm = Color(0xFFEDF2EE)

// Status & Warnings
val WarningAmber = Color(0xFFD97706)
val WarningAmberLight = Color(0xFFFEF3C7)
val ErrorRed = Color(0xFFDC2626)
val ErrorRedLight = Color(0xFFFEE2E2)

data class AppColors(
    val background: Color,
    val surface: Color,
    val surfaceGlass: Color,
    val border: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textMuted: Color,
    val surfaceVariant: Color,
    val primary: Color = MutedForestGreen,
    val accentMint: Color = ElectricMint,
    val accentCyan: Color = QuantumCyan,
    val accentEmerald: Color = NeonEmerald
)

val LocalAppColors = staticCompositionLocalOf {
    AppColors(
        background = WarmNeutralBackground,
        surface = CardSurface,
        surfaceGlass = CardSurfaceGlass,
        border = SoftBorder,
        textPrimary = DeepCharcoalText,
        textSecondary = CharcoalSecondary,
        textMuted = CharcoalMuted,
        surfaceVariant = SurfaceVariantWarm
    )
}
