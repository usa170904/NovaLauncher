package com.novalauncher

import android.app.role.RoleManager
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NovaTelecomModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "NovaTelecom"
    @ReactMethod fun isCallScreeningRoleHeld(promise: Promise) {
        val manager = context.getSystemService(RoleManager::class.java)
        promise.resolve(Build.VERSION.SDK_INT >= 29 && manager?.isRoleHeld(RoleManager.ROLE_CALL_SCREENING) == true)
    }
    @ReactMethod fun requestCallScreeningRole(promise: Promise) {
        if (Build.VERSION.SDK_INT < 29) return promise.reject("ROLE_UNSUPPORTED", "Android 10 or newer is required")
        val activity = context.currentActivity ?: return promise.reject("NO_ACTIVITY", "A visible activity is required")
        val manager = context.getSystemService(RoleManager::class.java) ?: return promise.reject("ROLE_UNAVAILABLE", "RoleManager unavailable")
        activity.startActivityForResult(manager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING), 7002)
        promise.resolve(true)
    }
}
