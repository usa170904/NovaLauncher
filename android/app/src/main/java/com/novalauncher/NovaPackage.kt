package com.novalauncher

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class NovaPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> = listOf(
        NovaLauncherModule(context), NovaVoiceModule(context), NovaSmsModule(context),
        NovaTelecomModule(context), NovaMediaModule(context), NovaMiuiModule(context), NovaAiModule(context),
    )
    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
