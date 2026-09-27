package com.example.ui.screens

import android.net.Uri
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.outlined.SmartToy
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ChatMessage
import com.example.model.MessageSender
import com.example.service.AgronomyDoctorService
import com.example.ui.components.ChatMessageBubble
import com.example.ui.components.EmptyState
import com.example.ui.components.InputBar
import com.example.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AgentChatScreen(
    initialPrompt: String? = null,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Intercept hardware/system back button
    BackHandler {
        onNavigateBack()
    }

    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    var messages by remember { mutableStateOf<List<ChatMessage>>(emptyList()) }
    var inputText by remember { mutableStateOf(initialPrompt ?: "") }
    var attachedImageUri by remember { mutableStateOf<Uri?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    // Android Zero-permission Photo Picker
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            attachedImageUri = uri
        }
    }

    fun sendMessage(queryText: String, imageUri: Uri?) {
        if (queryText.isBlank() && imageUri == null) return

        val userMessage = ChatMessage(
            sender = MessageSender.USER,
            text = queryText.ifBlank { "فحص عينة نباتية مرفقة" },
            imageUri = imageUri
        )

        messages = messages + userMessage
        inputText = ""
        attachedImageUri = null
        isLoading = true

        coroutineScope.launch {
            listState.animateScrollToItem((messages.size - 1).coerceAtLeast(0))

            val (doctorReply, report) = AgronomyDoctorService.analyzePlantQuery(
                context = context,
                prompt = queryText,
                imageUri = imageUri
            )

            val doctorMessage = ChatMessage(
                sender = MessageSender.AI_DOCTOR,
                text = doctorReply,
                diagnosticReport = report
            )

            messages = messages + doctorMessage
            isLoading = false
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    // If an initial prompt was provided and messages are empty, auto-send or set it
    LaunchedEffect(initialPrompt) {
        if (!initialPrompt.isNullOrBlank() && messages.isEmpty()) {
            sendMessage(initialPrompt, null)
        }
    }

    Scaffold(
        modifier = modifier
            .fillMaxSize()
            .testTag("agent_chat_scaffold"),
        containerColor = WarmNeutralBackground,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(ForestGreenLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.SmartToy,
                                contentDescription = "الوكيل الذكي",
                                tint = MutedForestGreen,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "الوكيل الذكي (Agent AI)",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = DeepCharcoalText
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .size(7.dp)
                                        .clip(CircleShape)
                                        .background(MutedForestGreen)
                                )
                            }
                            Text(
                                text = "طبيب زراعي ومستشار ترشيد مياه الري",
                                fontSize = 11.sp,
                                color = CharcoalSecondary
                            )
                        }
                    }
                },
                navigationIcon = {
                    IconButton(
                        onClick = onNavigateBack,
                        modifier = Modifier.testTag("back_to_landing_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "العودة للرئيسية",
                            tint = DeepCharcoalText
                        )
                    }
                },
                actions = {
                    if (messages.isNotEmpty()) {
                        IconButton(
                            onClick = { messages = emptyList() },
                            modifier = Modifier.testTag("reset_chat_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "بدء تشخيص جديد",
                                tint = CharcoalSecondary
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = WarmNeutralBackground
                )
            )
        },
        bottomBar = {
            InputBar(
                text = inputText,
                onTextChange = { inputText = it },
                attachedImageUri = attachedImageUri,
                onRemoveImage = { attachedImageUri = null },
                onAttachPhotoClick = {
                    photoPickerLauncher.launch(
                        PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                    )
                },
                onSendClick = {
                    sendMessage(inputText, attachedImageUri)
                },
                isLoading = isLoading
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (messages.isEmpty()) {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(bottom = 20.dp)
                ) {
                    item {
                        EmptyState(
                            onSuggestionClick = { selectedQuery ->
                                sendMessage(selectedQuery, null)
                            }
                        )
                    }
                }
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .testTag("chat_messages_list"),
                    contentPadding = PaddingValues(vertical = 12.dp)
                ) {
                    items(messages, key = { it.id }) { message ->
                        ChatMessageBubble(message = message)
                    }

                    if (isLoading) {
                        item {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 20.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(18.dp),
                                    color = MutedForestGreen,
                                    strokeWidth = 2.dp
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = "جاري الفحص المخبري والتحليل الزراعي للمحصول...",
                                    fontSize = 12.5.sp,
                                    color = CharcoalSecondary
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
