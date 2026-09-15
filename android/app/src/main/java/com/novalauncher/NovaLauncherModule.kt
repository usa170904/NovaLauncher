package com.novalauncher

import android.app.role.RoleManager
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NovaLauncherModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "NovaLauncher"

    @ReactMethod
    fun isDefaultLauncher(promise: Promise) {
        val manager = context.getSystemService(RoleManager::class.java)
        promise.resolve(Build.VERSION.SDK_INT >= 29 && manager?.isRoleHeld(RoleManager.ROLE_HOME) == true)
    }

    @ReactMethod
    fun requestDefaultLauncher(promise: Promise) {
        val activity = context.currentActivity ?: return promise.reject("NO_ACTIVITY", "A visible activity is required")
        try {
            val manager = context.getSystemService(RoleManager::class.java)
            if (Build.VERSION.SDK_INT >= 29 && manager != null) {
                activity.startActivityForResult(manager.createRequestRoleIntent(RoleManager.ROLE_HOME), 7001)
            } else {
                activity.startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME))
            }
            promise.resolve(true)
        } catch (error: Exception) { promise.reject("LAUNCHER_ROLE_FAILED", error) }
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val query = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
            val result = com.facebook.react.bridge.WritableNativeArray()
            context.packageManager.queryIntentActivities(query, PackageManager.MATCH_ALL)
                .sortedBy { it.loadLabel(context.packageManager).toString().lowercase() }
                .forEach { info ->
                    result.pushMap(com.facebook.react.bridge.WritableNativeMap().apply {
                        putString("packageName", info.activityInfo.packageName)
                        putString("label", info.loadLabel(context.packageManager).toString())
                    })
                }
            promise.resolve(result)
        } catch (error: Exception) { promise.reject("APPS_QUERY_FAILED", error) }
    }
}
