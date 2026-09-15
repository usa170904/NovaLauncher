# 🔧 সমস্যা সমাধান গাইড

## সাধারণ ত্রুটি এবং সমাধান

### 1. **Gradle ডাউনলোড ব্যর্থ**

**ত্রুটি:**
```
Could not download gradle
```

**সমাধান:**
```bash
cd android
rm -rf .gradle
./gradlew clean
./gradlew assembleDebug
```

---

### 2. **Java সংস্করণ মিলছে না**

**ত্রুটি:**
```
Java 17 is required but you have Java 11/8
```

**সমাধান:**
- Java 17 ডাউনলোড এবং ইনস্টল করুন
- JAVA_HOME সেট করুন:

**Windows:**
```bash
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

**Mac/Linux:**
```bash
export JAVA_HOME=/path/to/jdk-17
```

---

### 3. **Android SDK প্ল্যাটফর্ম পাওয়া যাচ্ছে না**

**ত্রুটি:**
```
Failed to find Build Tools revision 35.0.0
```

**সমাধান:**
```bash
# Android SDK প্ল্যাটফর্ম ইনস্টল করুন
sdkmanager "platforms;android-35"
sdkmanager "build-tools;35.0.0"
```

বা Android Studio থেকে:
1. Tools → SDK Manager খুলুন
2. Android 15 (API 35) চেক করুন
3. Apply ক্লিক করুন

---

### 4. **NDK সংস্করণ সমস্যা**

**ত্রুটি:**
```
NDK not found
```

**সমাধান:**
```bash
sdkmanager "ndk;26.1.10909125"
```

---

### 5. **npm install ব্যর্থ হলে**

**ত্রুটি:**
```
npm ERR! 404 Not Found
```

**সমাধান:**
```bash
# npm ক্যাশ সাফ করুন
npm cache clean --force

# পুনরায় চেষ্টা করুন
npm install
```

---

### 6. **APK তৈরি হচ্ছে না**

**পরীক্ষা:**
```bash
cd android
./gradlew clean
./gradlew --info assembleDebug
```

এটি বিস্তারিত লগ দেখাবে।

---

### 7. **ADB ডিভাইস খুঁজে পাচ্ছে না**

**ত্রুটি:**
```
adb: device not found
```

**সমাধান:**
```bash
# ডিভাইস তালিকা পরীক্ষা করুন
adb devices

# যদি অনুমোদিত না হয়, ডিভাইসে অনুমতি দিন এবং:
adb kill-server
adb start-server
adb devices

# ড্রাইভার আপডেট করুন (প্রয়োজনে)
```

**ডিভাইস পক্ষ:**
1. সেটিংস → বিকাশকারী বিকল্প খুলুন
2. USB ডিবাগিং চালু করুন
3. USB সংযোগের ধরন: ফাইল স্থানান্তর নির্বাচন করুন

---

### 8. **ইনস্টলেশন ব্যর্থ: INSTALL_FAILED_VERSION_DOWNGRADE**

**ত্রুটি:**
```
INSTALL_FAILED_VERSION_DOWNGRADE
```

**সমাধান:**
```bash
# পুরানো সংস্করণ আনইনস্টল করুন
adb uninstall com.novalauncher

# নতুন সংস্করণ ইনস্টল করুন
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 9. **স্মৃতি অপ্রতুল ত্��ুটি (OutOfMemory)**

**ত্রুটি:**
```
java.lang.OutOfMemoryError
```

**সমাধান:**

`android/gradle.properties` তে যোগ করুন:
```properties
org.gradle.jvmargs=-Xmx2048m -Xms512m
```

---

### 10. **লঞ্চের পর অ্যাপ ক্র্যাশ হলে**

**লগ পড়ুন:**
```bash
adb logcat | grep -i "NovaLauncher\|ReactNative"
```

**বা সমস্ত লগ সংরক্ষণ করুন:**
```bash
npm run logcat > crash_log.txt
```

---

## পরিবেশ চেকলিস্ট

এই কমান্ডগুলো চালিয়ে যাচাই করুন:

```bash
# Node.js সংস্করণ
node --version  # ≥18.0.0

# npm সংস্করণ
npm --version

# Java সংস্করণ
java -version  # 17+

# Gradle সংস্করণ
cd android && ./gradlew --version
```

---

## পূর্ণ পুনরায় সেটআপ

যদি সবকিছু ব্যর্থ হয়:

```bash
# সমস্ত ক্যাশ সাফ করুন
rm -rf node_modules
rm -rf android/.gradle
rm -rf ~/.gradle/caches
npm cache clean --force

# পুনরায় শুরু ক��ুন
npm install
npm run build:debug
```

---

## অনলাইন সংস্থান

- [React Native ডকুমেন্টেশন](https://reactnative.dev/)
- [Android ডেভেলপার গাইড](https://developer.android.com/)
- [Gradle বিল্ড সিস্টেম](https://gradle.org/)

---

**এখনও সমস্যা? GitHub Issues এ রিপোর্ট করুন।**
