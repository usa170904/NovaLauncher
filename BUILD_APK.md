# APK build checklist

## 1. Install the toolchain

Install Node.js 18+, Java 17, Android Studio, and Android SDK platform 35. In Android Studio's SDK Manager, install:

- Android SDK Platform 35
- Android SDK Build-Tools 35.0.0
- Android SDK Platform-Tools

Set `ANDROID_HOME` to the Android SDK directory and ensure `adb` is on `PATH`.

## 2. Install JavaScript dependencies

```bash
npm install
```

## 3. Verify the Android device

```bash
adb devices
```

On the Redmi Note 8, enable Developer options and USB debugging. Accept the computer authorization prompt.

## 4. Build and install

```bash
cd android
./gradlew clean
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## 5. Create a signed release

Generate a private upload key outside this repository:

```bash
keytool -genkeypair -v \
  -keystore nova-upload.keystore \
  -alias nova-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Then configure `android/app/build.gradle` with the keystore path and passwords through environment variables or a local untracked properties file. Never commit the keystore, passwords, API keys, or `local.properties`.

## What to validate on the Redmi Note 8

1. Set Nova as the default Home app.
2. Grant microphone permission and start/stop live recognition.
3. Confirm partial Bengali and English transcript events.
4. Save an AI provider in AI Lab and send a short chat prompt.
5. Generate a wallpaper and test the apply action.
6. Open MIUI battery settings and whitelist Nova only if the user wants persistent background voice service.
