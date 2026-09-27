package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.localization.*
import com.example.ui.components.FloatingAgentButton
import com.example.ui.screens.*
import com.example.ui.theme.*

enum class AppNavTab(
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val testTag: String
) {
    DASHBOARD(Icons.Default.Dashboard, Icons.Outlined.Dashboard, "nav_dashboard"),
    DIAGNOSIS(Icons.Default.MedicalServices, Icons.Outlined.MedicalServices, "nav_diagnosis"),
    WATER_ADVISOR(Icons.Default.WaterDrop, Icons.Outlined.WaterDrop, "nav_water"),
    QUANTUM(Icons.Default.AutoAwesome, Icons.Outlined.AutoAwesome, "nav_quantum"),
    SAFETY(Icons.Default.Shield, Icons.Outlined.Shield, "nav_safety")
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var isDarkMode by remember { mutableStateOf(false) }
            var currentLanguage by remember { mutableStateOf(AppLanguage.ARABIC) }

            val strings = when (currentLanguage) {
                AppLanguage.ARABIC -> ArabicStrings
                AppLanguage.FRENCH -> FrenchStrings
                AppLanguage.ENGLISH -> EnglishStrings
            }

            MyApplicationTheme(darkTheme = isDarkMode) {
                val appColors = LocalAppColors.current

                CompositionLocalProvider(
                    LocalAppLanguage provides currentLanguage,
                    LocalAppStrings provides strings,
                    LocalLayoutDirection provides currentLanguage.layoutDirection
                ) {
                    var currentTab by remember { mutableStateOf(AppNavTab.DASHBOARD) }
                    var diagnosisPrefilledPrompt by remember { mutableStateOf<String?>(null) }
                    var showLangMenu by remember { mutableStateOf(false) }

                    Scaffold(
                        modifier = Modifier
                            .fillMaxSize()
                            .testTag("main_app_scaffold"),
                        containerColor = appColors.background,
                        topBar = {
                            // Sleek Global Action Bar: Language Selector (3 Languages) & Dark Mode Toggle
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .statusBarsPadding()
                                    .padding(horizontal = 16.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // 3-Language Selector Dropdown
                                Box {
                                    Surface(
                                        shape = RoundedCornerShape(20.dp),
                                        color = appColors.surface,
                                        border = BorderStroke(1.dp, appColors.border),
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(20.dp))
                                            .clickable { showLangMenu = true }
                                            .testTag("language_selector_button")
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(currentLanguage.flag, fontSize = 14.sp)
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(
                                                text = currentLanguage.displayName,
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = appColors.textPrimary
                                            )
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Icon(
                                                imageVector = Icons.Default.ArrowDropDown,
                                                contentDescription = "Language",
                                                tint = appColors.textSecondary,
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }

                                    DropdownMenu(
                                        expanded = showLangMenu,
                                        onDismissRequest = { showLangMenu = false },
                                        modifier = Modifier.background(appColors.surface)
                                    ) {
                                        AppLanguage.entries.forEach { lang ->
                                            DropdownMenuItem(
                                                text = {
                                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                                        Text(lang.flag, fontSize = 16.sp)
                                                        Spacer(modifier = Modifier.width(8.dp))
                                                        Text(
                                                            text = lang.displayName,
                                                            fontWeight = if (lang == currentLanguage) FontWeight.Bold else FontWeight.Normal,
                                                            color = if (lang == currentLanguage) appColors.primary else appColors.textPrimary
                                                        )
                                                    }
                                                },
                                                onClick = {
                                                    currentLanguage = lang
                                                    showLangMenu = false
                                                }
                                            )
                                        }
                                    }
                                }

                                // Dark / Light Mode Toggle Button
                                IconButton(
                                    onClick = { isDarkMode = !isDarkMode },
                                    modifier = Modifier
                                        .size(38.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(appColors.surface)
                                        .border(1.dp, appColors.border, RoundedCornerShape(12.dp))
                                        .testTag("dark_mode_toggle_button")
                                ) {
                                    Icon(
                                        imageVector = if (isDarkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                                        contentDescription = if (isDarkMode) "Light Mode" else "Dark Mode",
                                        tint = if (isDarkMode) ElectricMint else DeepCharcoalText,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        },
                        floatingActionButton = {
                            // Animated Glowing Floating Agent Button
                            if (currentTab != AppNavTab.DIAGNOSIS) {
                                FloatingAgentButton(
                                    onClick = {
                                        diagnosisPrefilledPrompt = null
                                        currentTab = AppNavTab.DIAGNOSIS
                                    }
                                )
                            }
                        },
                        bottomBar = {
                            NavigationBar(
                                containerColor = appColors.surface,
                                tonalElevation = 3.dp,
                                modifier = Modifier.testTag("app_bottom_nav_bar")
                            ) {
                                AppNavTab.entries.forEach { tab ->
                                    val isSelected = currentTab == tab
                                    val title = when (tab) {
                                        AppNavTab.DASHBOARD -> strings.navDashboard
                                        AppNavTab.DIAGNOSIS -> strings.navDiagnosis
                                        AppNavTab.WATER_ADVISOR -> strings.navWaterAdvisor
                                        AppNavTab.QUANTUM -> strings.navQuantum
                                        AppNavTab.SAFETY -> strings.navSafety
                                    }

                                    NavigationBarItem(
                                        selected = isSelected,
                                        onClick = {
                                            if (tab == AppNavTab.DIAGNOSIS && currentTab != AppNavTab.DIAGNOSIS) {
                                                diagnosisPrefilledPrompt = null
                                            }
                                            currentTab = tab
                                        },
                                        icon = {
                                            Icon(
                                                imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                                                contentDescription = title,
                                                modifier = Modifier.size(22.dp)
                                            )
                                        },
                                        label = {
                                            Text(
                                                text = title,
                                                fontSize = 10.sp,
                                                maxLines = 1,
                                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                            )
                                        },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = if (isDarkMode) ElectricMint else ForestGreenDark,
                                            selectedTextColor = if (isDarkMode) ElectricMint else ForestGreenDark,
                                            indicatorColor = if (isDarkMode) ForestGreenDark.copy(alpha = 0.5f) else ForestGreenLight,
                                            unselectedIconColor = appColors.textMuted,
                                            unselectedTextColor = appColors.textMuted
                                        ),
                                        modifier = Modifier.testTag(tab.testTag)
                                    )
                                }
                            }
                        }
                    ) { innerPadding ->
                        Crossfade(
                            targetState = currentTab,
                            label = "tab_crossfade_animation",
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding)
                        ) { tab ->
                            when (tab) {
                                AppNavTab.DASHBOARD -> {
                                    DashboardScreen(
                                        onNavigateToDiagnosis = { cropPrompt ->
                                            diagnosisPrefilledPrompt = cropPrompt
                                            currentTab = AppNavTab.DIAGNOSIS
                                        },
                                        onNavigateToWaterAdvisor = {
                                            currentTab = AppNavTab.WATER_ADVISOR
                                        },
                                        onNavigateToQuantum = {
                                            currentTab = AppNavTab.QUANTUM
                                        },
                                        onNavigateToSafety = {
                                            currentTab = AppNavTab.SAFETY
                                        }
                                    )
                                }
                                AppNavTab.DIAGNOSIS -> {
                                    DiagnosisScreen(
                                        initialPrompt = diagnosisPrefilledPrompt
                                    )
                                }
                                AppNavTab.WATER_ADVISOR -> {
                                    WaterAdvisorScreen()
                                }
                                AppNavTab.QUANTUM -> {
                                    QuantumOptimizationScreen()
                                }
                                AppNavTab.SAFETY -> {
                                    SafetyScreen()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
