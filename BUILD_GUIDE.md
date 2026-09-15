# 📱 Nova AI Launcher - বিল্ড গাইড

## প্রয়োজনীয় যন্ত্রপাতি

### সফটওয়্যার প্রয়োজনীয়তা:
- **Node.js**: 18 বা তার উপরে ([ডাউনলোড করুন](https://nodejs.org/))
- **Java Development Kit (JDK)**: 17 ([ডাউনলোড করুন](https://www.oracle.com/java/technologies/downloads/))
- **Android SDK**: Platform 35, Build-tools 35.0.0
- **Android Studio**: সুপারিশকৃত ([ডাউনলোড করুন](https://developer.android.com/studio))

### হার্ডওয়্যার:
- Xiaomi Redmi Note 8 ডিভাইস বা Android এমুলেটর
- USB ডেটা কেবল (ডিভাইস সংযোগের জন্য)

---

## ধাপে ধাপে সেটআপ

### ১. রিপোজিটরি ক্লোন করুন
```bash
git clone https://github.com/usa170904/NovaLauncher.git
cd NovaLauncher
```

### ২. নির্ভরতা ইনস্টল করুন
```bash
npm install
```

### ৩. Android SDK কনফিগার করুন
Android Studio খুলুন এবং নিশ্চিত করুন:
- Platform 35 ইনস্টল করা আছে
- Build-tools 35.0.0 ইনস্টল করা আছে

**অথবা কমান্ড লাইনে:**
```bash
sdkmanager "platforms;android-35"
sdkmanager "build-tools;35.0.0"
```

---

## ডিবাগ APK তৈরি করুন

```bash
npm run build:debug
```

বা ম্যানুয়ালি:
```bash
cd android
./gradlew assembleDebug
```

**APK অবস্থান:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## রিলিজ APK তৈরি করুন

```bash
npm run build:release
```

**APK অবস্থান:**
```
android/app/build/outputs/apk/release/app-release.apk
```

> **সতর্কতা**: উৎপাদনের জন্য নিজের keystore ব্যবহার করুন। বর্তমানে debug keystore ব্যবহৃত হচ্ছে।

---

## ডিভাইসে ইনস্টল করুন

### পূর্বশর্ত:
1. **ডিবাগ মোড চালু করুন**: সেটিংস → বিকাশকারী বিকল্প → USB ডিবাগিং
2. **ডিভাইস সংযুক্ত করুন**: USB কেবলের মাধ্যমে
3. **সংযোগ যাচাই করুন:**
```bash
adb devices
```

### ইনস্টলেশন:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### লঞ্চ:
```bash
adb shell am start -n com.novalauncher/.MainActivity
```

---

## সমস্যা সমাধান

### ❌ Gradle সিঙ্ক ব্যর্থ হলে:
```bash
npm run clean
npm install
npm run build:debug
```

### ❌ কোনো APK তৈরি না হলে:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### ❌ ADB ডিভাইস খুঁজে না পেলে:
```bash
# ড্রাইভার পুনরায় ইনস্টল করুন বা:
adb kill-server
adb start-server
adb devices
```

### ❌ স্টোরেজ সমস্যা:
```bash
# Gradle ক্যাশ সাফ করুন
rm -rf ~/.gradle/caches
npm run build:debug
```

---

## দরকারী কমান্ড

```bash
# লাইভ লগ দেখুন
npm run logcat

# ডিভাইসে সরাসরি চালান (সম্ভাব্য)
npm run android

# সম্পূর্ণ পরিষ্কার করুন
npm run clean

# শুধু Gradle রিবিল্ড
cd android && ./gradlew build
```

---

## ডিভাইস নোট

- 🎤 লাইভ STT শুরু করার আগে মাইক্রোফোন অনুমতি দিন
- 🔊 Android SpeechRecognizer আংশিক/চূড়ান্ত ফলাফল প্রদান করে
- 🌐 Ollama এমুলেটরে: `http://10.0.2.2:11434/v1`
- 🔋 MIUI এ ব্যাটারি-অটোস্টার্ট অনুমতি প্রয়োজন হতে পারে
- 🔐 API কী Android Keystore এ সংরক্ষিত, APK তে অন্তর্ভুক্ত নয়

---

## সফল বিল্ড ✅

APK সফলভাবে তৈরি হলে, আপনি দেখবেন:
```
BUILD SUCCESSFUL in XXs
```

এবং APK ফাইল প্রস্তুত থাকবে ইনস্টলেশনের জন্য।

---

**সাহায্যের প্রয়োজন?** Issues খুলুন অথবা README চেক করুন।
