# Nova AI Launcher

Bare React Native Android launcher for the Xiaomi Redmi Note 8 / MIUI environment.

## Build a debug APK

Requirements:

- Node.js 18 or newer
- Java 17
- Android SDK platform 35 and build-tools 35.0.0
- Android device or emulator

From this directory:

```bash
npm install
cd android
./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

Install it on the Redmi Note 8 with:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Then choose **Nova AI Launcher** as the default Home app.

## Build a release APK

The template currently uses the bundled debug keystore for local release builds. For a shareable or publishable APK, replace the release signing configuration with your own private keystore and keep that file outside source control.

```bash
npm install
cd android
./gradlew assembleRelease
```

The release output will be at `android/app/build/outputs/apk/release/app-release.apk`.

## Device notes

- Grant microphone permission before starting live STT.
- Android's SpeechRecognizer provides partial/final results; it is not an offline wake-word engine.
- For Ollama on the Android emulator, use `http://10.0.2.2:11434/v1`, not `localhost`.
- MIUI may require battery-autostart permission for the foreground voice service.
- API keys are stored through Android Keystore and are not included in the APK.

The app intentionally does not claim to clear arbitrary RAM or bypass Android role and permission prompts.
