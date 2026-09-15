package com.novalauncher

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Handler
import android.os.Looper
import android.os.Build
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class NovaVoiceModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val handler = Handler(Looper.getMainLooper())
    private var recognizer: SpeechRecognizer? = null
    private var requested = false
    private var language = "en-US"
    override fun getName() = "NovaVoice"

    @ReactMethod fun isServiceRunning(promise: Promise) = promise.resolve(NovaVoiceService.isRunning)
    @ReactMethod fun hasMicrophonePermission(promise: Promise) = promise.resolve(
        context.checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED,
    )
    @ReactMethod fun startVoiceService(language: String, promise: Promise) {
        try {
            val intent = Intent(context, NovaVoiceService::class.java).putExtra(NovaVoiceService.EXTRA_LANGUAGE, language)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(intent)
            else context.startService(intent)
            promise.resolve(true)
        } catch (error: Exception) { promise.reject("VOICE_SERVICE_FAILED", error) }
    }
    @ReactMethod fun stopVoiceService(promise: Promise) { promise.resolve(context.stopService(Intent(context, NovaVoiceService::class.java))) }

    @ReactMethod fun startRecognition(language: String, promise: Promise) {
        if (context.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            return promise.reject("MIC_PERMISSION_REQUIRED", "Grant microphone permission first")
        }
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            return promise.reject("STT_UNAVAILABLE", "No Android speech recognition service is available")
        }
        requested = true
        this.language = language.substringBefore(',').ifBlank { "en-US" }
        handler.post {
            destroyRecognizer()
            recognizer = SpeechRecognizer.createSpeechRecognizer(context).apply { setRecognitionListener(listener) }
            listen()
            promise.resolve(true)
        }
    }

    @ReactMethod fun stopRecognition(promise: Promise) {
        requested = false
        handler.post { recognizer?.cancel(); destroyRecognizer(); promise.resolve(true) }
    }
    @ReactMethod fun addListener(eventName: String) = Unit
    @ReactMethod fun removeListeners(count: Int) = Unit
    override fun invalidate() { requested = false; handler.post { destroyRecognizer() }; super.invalidate() }

    private val listener = object : RecognitionListener {
        override fun onReadyForSpeech(params: android.os.Bundle?) = emit("novaSpeechState", "listening")
        override fun onBeginningOfSpeech() = emit("novaSpeechState", "speaking")
        override fun onRmsChanged(value: Float) = Unit
        override fun onBufferReceived(buffer: ByteArray?) = Unit
        override fun onEndOfSpeech() = emit("novaSpeechState", "processing")
        override fun onError(error: Int) {
            emitError(error)
            if (requested) handler.postDelayed({ listen() }, 350)
        }
        override fun onResults(results: android.os.Bundle?) {
            emitResult(results, true)
            if (requested) handler.postDelayed({ listen() }, 120)
        }
        override fun onPartialResults(results: android.os.Bundle?) = emitResult(results, false)
        override fun onEvent(eventType: Int, params: android.os.Bundle?) = Unit
    }

    private fun listen() {
        if (!requested || recognizer == null) return
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, language)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
        }
        try { recognizer?.startListening(intent) } catch (error: Exception) { emitError(error.message ?: "STT start failed") }
    }
    private fun emitResult(results: android.os.Bundle?, isFinal: Boolean) {
        val text = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull().orEmpty()
        if (text.isNotBlank()) context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("novaSpeechResult", Arguments.createMap().apply { putString("text", text); putBoolean("isFinal", isFinal); putString("language", language) })
    }
    private fun emit(state: String, value: String) = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(state, Arguments.createMap().apply { putString("state", value) })
    private fun emitError(value: Any) = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("novaSpeechError", Arguments.createMap().apply { putString("message", value.toString()) })
    private fun destroyRecognizer() { recognizer?.setRecognitionListener(null); recognizer?.destroy(); recognizer = null }
}
