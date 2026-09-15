package com.novalauncher

import android.Manifest
import android.content.pm.PackageManager
import android.telephony.SmsManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NovaSmsModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "NovaSms"
    @ReactMethod fun hasSmsPermission(promise: Promise) = promise.resolve(context.checkSelfPermission(Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED)
    @ReactMethod fun requestSmsPermission(promise: Promise) {
        val activity = context.currentActivity ?: return promise.reject("NO_ACTIVITY", "A visible activity is required")
        activity.requestPermissions(arrayOf(Manifest.permission.SEND_SMS), 7101)
        promise.resolve(true)
    }
    @ReactMethod fun sendSms(phone: String, message: String, promise: Promise) {
        if (context.checkSelfPermission(Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED) return promise.reject("SMS_PERMISSION_REQUIRED", "Grant SEND_SMS first")
        try { SmsManager.getDefault().sendTextMessage(phone, null, message, null, null); promise.resolve(true) }
        catch (error: Exception) { promise.reject("SMS_SEND_FAILED", error) }
    }
}
