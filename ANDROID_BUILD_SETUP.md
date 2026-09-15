# Android Build Setup Guide - NovaLauncher

## Prerequisites

### 1. Java Development Kit (JDK)
```bash
# Check if Java is installed
java -version

# Required: Java 17 or later
# Download from: https://www.oracle.com/java/technologies/javase/jdk17-archive.html
```

### 2. Android SDK Setup

#### Using Android Studio (Recommended)
1. Download Android Studio: https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio > Settings > SDK Manager
4. Install:
   - Android SDK 35 (API Level 35)
   - Build Tools 35.0.0
   - NDK 26.1.10909125
   - Android Emulator (optional)

#### Manual Setup (Linux/Mac)
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Save to ~/.zshrc or ~/.bash_profile for permanent setup
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

#### Manual Setup (Windows)
```batch
# Set in Environment Variables:
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\sdk
PATH = %ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin
```

### 3. Node.js & npm/yarn
```bash
# Check versions
node --version
npm --version

# Required: Node 16.x or later
# Download: https://nodejs.org/
```

## Build Instructions

### Step 1: Install Dependencies
```bash
# Navigate to project root
cd /path/to/NovaLauncher

# Clean node_modules (if needed)
rm -rf node_modules package-lock.json

# Install dependencies
npm install
# or
yarn install
```

### Step 2: Verify Android Setup
```bash
# Check if SDK components are properly installed
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list_installed

# Should show:
# - Android SDK 35
# - Build-tools 35.0.0
# - NDK 26.1.10909125
```

### Step 3: Clean Previous Builds
```bash
cd android
./gradlew clean
```

### Step 4: Build Debug APK
```bash
# Option 1: Using npm script
npm run build:debug

# Option 2: Using gradle directly
cd android
./gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 5: Build Release APK
```bash
npm run build:release
# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Error: "NDK not found"
```bash
# Install NDK via sdkmanager
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;26.1.10909125"
```

### Error: "Build Tools not found"
```bash
# Install Build Tools
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "build-tools;35.0.0"
```

### Error: "Gradle daemon not responding"
```bash
cd android
./gradlew --stop
./gradlew clean
./gradlew assembleDebug
```

### Error: "Out of memory during build"
The gradle.properties already includes optimized settings:
```properties
org.gradle.jvmargs=-Xmx4096m -Xms1024m
```

If still failing, increase to:
```properties
org.gradle.jvmargs=-Xmx8192m -Xms2048m
```

### Error: "React Native modules not found"
```bash
# Ensure all dependencies are installed
npm install
cd android
./gradlew clean
./gradlew build
```

### Error: "Kotlin compilation failed"
```bash
# Clear Kotlin cache
cd android
rm -rf .gradle build app/build
./gradlew clean
./gradlew build
```

## Testing the Build

### Install on Connected Device/Emulator
```bash
# Start emulator or connect physical device
adb devices

# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# View logs
npm run logcat
```

### View Build Logs
```bash
cd android
./gradlew assembleDebug --stacktrace --debug
```

## Configuration Files Modified
- `android/build.gradle` - Root build configuration
- `android/app/build.gradle` - App build configuration
- `android/gradle.properties` - Gradle properties
- `android/gradle/wrapper/gradle-wrapper.properties` - Gradle wrapper version

## Additional Resources
- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [Android Developer Guide](https://developer.android.com/guide)
- [Gradle Documentation](https://docs.gradle.org/)
- [Android Studio Configuration](https://developer.android.com/studio/intro/update)
