# Android Build Setup & Troubleshooting Guide

## ✅ সব সেটআপ সম্পন্ন হয়েছে

আপনার সব configuration files ঠিক করা হয়েছে। এখন শুরু করুন:

## 🚀 শুরুর জন্য কমান্ড

### Step 1: নতুন করে সবকিছু ইনস্টল করুন
```bash
cd /path/to/NovaLauncher
npm run clean
```

### Step 2: Debug APK বিল্ড করুন
```bash
npm run build:debug
```

### Step 3: যদি সমস্যা হয়, এই কমান্ড চালান
```bash
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

## 🔧 সাধারণ সমস্যা ও সমাধান

### সমস্যা 1: "Command 'gradlew' not found"
**সমাধান:**
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

### সমস্যা 2: "Gradle daemon is not responding"
**সমাধান:**
```bash
cd android
./gradlew --stop
./gradlew clean
./gradlew assembleDebug
```

### সমস্যা 3: "ANDROID_HOME not set"
**সমাধান (Mac/Linux):**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# স্থায়ীভাবে সেভ করতে ~/.zshrc বা ~/.bash_profile তে যোগ করুন
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.zshrc
source ~/.zshrc
```

**সমাধান (Windows):**
```batch
set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
set PATH=%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin
```

### সমস্যা 4: "NDK not found"
**সমাধান:**
```bash
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;26.1.10909125"
```

### সমস্যা 5: "Build Tools not found"
**সমাধান:**
```bash
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "build-tools;35.0.0"
```

### সমস্যা 6: "Out of memory during build"
**সমাধান:**
File: `android/gradle.properties`
```properties
org.gradle.jvmargs=-Xmx8192m -Xms2048m
```

### সমস্যা 7: "React Native modules not found"
**সমাধান:**
```bash
npm run clean
# বা ম্যানুয়ালি:
rm -rf node_modules package-lock.json
npm install
cd android
./gradlew clean
./gradlew assembleDebug
```

## 📋 চেকলিস্ট

- [ ] Java JDK 17+ ইনস্টল করা আছে? `java -version` চেক করুন
- [ ] Android SDK 35 ইনস্টল করা আছে?
- [ ] Build Tools 35.0.0 ইনস্টল করা ��ছে?
- [ ] NDK 26.1.10909125 ইনস্টল করা আছে?
- [ ] ANDROID_HOME সেট করা আছে? `echo $ANDROID_HOME` চেক করুন
- [ ] Node.js 16+ ইনস্টল করা আছে? `node --version` চেক করুন
- [ ] npm/yarn dependencies ইনস্টল করা আছে? `npm install` করুন

## 🛠️ Advanced Debug

### সবকিছু স্ট্যাকট্রেস সহ দেখতে:
```bash
cd android
./gradlew assembleDebug --stacktrace --debug
```

### লগ ফাইল দেখতে:
```bash
cd android
./gradlew assembleDebug 2>&1 | tee build.log
cat build.log | tail -100
```

### Gradle ক্যাশ ক্লিয়ার করতে:
```bash
cd android
rm -rf .gradle build app/build
./gradlew clean
./gradlew assembleDebug
```

## 📱 ডিভাইসে ইনস্টল করা

### Debug APK ইনস্টল করুন:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### লগ দেখুন:
```bash
adb logcat *:S ReactNative:V ReactNativeJS:V
```

## ✨ সব কনফিগারেশন

- ✅ `android/build.gradle` - Gradle 8.3.0
- ✅ `android/app/build.gradle` - App configuration  
- ✅ `android/gradle.properties` - JVM memory optimization
- ✅ `android/settings.gradle` - Plugin settings
- ✅ `package.json` - npm scripts

## 💡 টিপস

1. প্রথম বিল্ড স্লো হবে (dependencies download)
2. দ্বিতীয় বার থেকে দ্রুত হবে
3. যদি কোনো এরর দেখেন, সম্পূর্ণ এরর মেসেজ শেয়ার করুন
4. `npm run clean` সব ক্যাশ ক্লিয়ার করে

---

**কোনো সমস্যা হলে আমাকে জানান!** 🚀
