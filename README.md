# 🚀 Nova AI Launcher

Bare React Native Android launcher for the Xiaomi Redmi Note 8 / MIUI environment.

---

## 📋 দ্রুত শুরু (Quick Start)

### প্রয়োজনীয়তা:
- Node.js 18+
- Java 17
- Android SDK platform 35 & build-tools 35.0.0
- Android device or emulator

### ডিবাগ APK তৈরি করুন:

```bash
npm install
npm run build:debug
```

APK পাবেন এখানে:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### ডিভাইসে ইনস্টল করুন:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📚 বিস্তারিত নির্দেশিকা

- **[BUILD_GUIDE.md](BUILD_GUIDE.md)** - সম্পূর্ণ সেটআপ এবং বিল্ড নির্দেশিকা
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - সমস্যা সমাধান এবং FAQ

---

## 🏗️ বিল্ড কমান্ড

```bash
# ডিবাগ বিল্ড
npm run build:debug

# রিলিজ বিল্ড
npm run build:release

# পরিষ্কার করুন
npm run clean

# লাইভ লগ দেখুন
npm run logcat

# সরাসরি চালান (যদি সেটআপ থাকে)
npm run android
```

---

## 📱 রিলিজ APK তৈরি করুন

```bash
npm install
npm run build:release
```

APK পাবেন:
```
android/app/build/outputs/apk/release/app-release.apk
```

> ⚠️ **গুরুত্বপূর্ণ**: প্রকাশনার জন্য নিজের keystore ব্যবহার করুন।

---

## ⚙️ ডিভাইস সেটিংস

1. **ডিবাগ মোড চালু করুন:**
   - সেটিংস → বিকাশকারী বিকল্প → USB ডিবাগিং

2. **অনুমতি দিন:**
   - 🎤 মাইক্রোফোন (STT এর জন্য)
   - 🔋 ব্যাটারি অপটিমাইজেশন

3. **ডিফল্ট লঞ্চার সেট করুন:**
   - অ্যাপ খুলুন এবং **Nova AI Launcher** বেছে নিন

---

## 🔧 সেটআপ সহায়তা

সমস্যার সম্মুখীন হলে:

1. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** পড়ুন
2. [BUILD_GUIDE.md](BUILD_GUIDE.md) এ ধাপে ধাপে নির্দেশ অনুসরণ করুন
3. Issues এ রিপোর্ট করুন

---

## 📖 প্রযুক্তিগত বিবরণ

- **Framework**: React Native
- **Language**: JavaScript/TypeScript, Kotlin, Objective-C
- **Target**: Xiaomi Redmi Note 8 (Android 9+)
- **Build Tools**: Gradle, Android SDK 35

---

## 🎯 বৈশিষ্ট্য

- ✅ AI-চালিত লঞ্চার
- ✅ কণ্ঠ স্বীকৃতি (STT) সমর্থন
- ✅ MIUI সামঞ্জস্যপূর্ণ
- ✅ নিরাপদ API কী সংরক্ষণ (Android Keystore)

---

## 📝 লাইসেন্স

এই প্রজেক্ট সর্বজনীন। আরও তথ্যের জন্য LICENSE ফাইল দেখুন।

---

## 🙋 সাহায্যের প্রয়োজন?

**কিভাবে সমস্যা রিপোর্ট করতে হয়:**
1. [Issues](https://github.com/usa170904/NovaLauncher/issues) খুলুন
2. বিস্তারিত বর্ণনা করুন
3. লগ আউটপুট যোগ করুন (ঐচ্ছিক কিন্তু সহায়ক)

```bash
# লগ দেখান:
npm run logcat > logs.txt
```

---

**Happy Coding! 🎉**
