package com.example.model

import android.net.Uri

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val sender: MessageSender,
    val text: String,
    val imageUri: Uri? = null,
    val diagnosticReport: DiagnosticReport? = null,
    val timestamp: Long = System.currentTimeMillis()
)

enum class MessageSender {
    USER,
    AI_DOCTOR
}
