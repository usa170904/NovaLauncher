package com.novalauncher

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.IBinder

class NovaVoiceService : Service() {
    companion object {
        const val EXTRA_LANGUAGE = "language"
        var isRunning = false
            private set
    }
    override fun onCreate() {
        super.onCreate()
        val channel = NotificationChannel("nova_voice", "Nova voice assistant", NotificationManager.IMPORTANCE_LOW)
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        startForeground(401, Notification.Builder(this, "nova_voice")
            .setContentTitle("Nova is ready").setContentText("Voice assistant is running")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now).setOngoing(true).build())
        isRunning = true
    }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int) = START_STICKY
    override fun onDestroy() { isRunning = false; super.onDestroy() }
    override fun onBind(intent: Intent?): IBinder? = null
}
