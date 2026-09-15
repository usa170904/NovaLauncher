package com.novalauncher

import android.content.Intent
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NovaMiuiModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "NovaMiui"
    @ReactMethod fun isXiaomiDevice(promise: Promise) = promise.resolve(Build.MANUFACTURER.equals("Xiaomi", true))
    @ReactMethod fun openBatteryOptimizationSettings(promise: Promise) {
        try { context.startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); promise.resolve(true) }
        catch (error: Exception) { promise.reject("MIUI_SETTINGS_FAILED", error) }
    }
    @ReactMethod fun openOverlaySettings(promise: Promise) {
        try { context.startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); promise.resolve(true) }
        catch (error: Exception) { promise.reject("OVERLAY_SETTINGS_FAILED", error) }
    }
}
