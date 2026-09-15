package com.novalauncher

import android.content.Intent
import android.view.KeyEvent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NovaMediaModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "NovaMedia"
    @ReactMethod fun dispatchMediaAction(action: String, promise: Promise) {
        val code = when (action) { "play", "pause" -> KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE; "next" -> KeyEvent.KEYCODE_MEDIA_NEXT; "previous" -> KeyEvent.KEYCODE_MEDIA_PREVIOUS; else -> return promise.reject("MEDIA_ACTION_UNKNOWN", "Unsupported action") }
        try {
            context.sendBroadcast(Intent(Intent.ACTION_MEDIA_BUTTON).putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, code)))
            context.sendBroadcast(Intent(Intent.ACTION_MEDIA_BUTTON).putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_UP, code)))
            promise.resolve(true)
        } catch (error: Exception) { promise.reject("MEDIA_ACTION_FAILED", error) }
    }
}
