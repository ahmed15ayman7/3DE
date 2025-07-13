# 🧪 اختبار نظام المصادقة

## 📋 المتطلبات

1. **تشغيل الخادم الخلفي (Backend)**
   ```bash
   # في مجلد backend
   pnpm dev
   # أو
   npm run start:dev
   ```

2. **تشغيل تطبيق المصادقة**
   ```bash
   # في مجلد apps/auth
   pnpm dev
   # أو
   npm run dev
   ```

## 🔑 بيانات الاختبار

- **البريد الإلكتروني:** `st@st.st`
- **كلمة المرور:** `123456789`
- **الرابط:** `http://localhost:3002/auth/signin`

## 🔍 مراقبة العملية

### 1. فتح أدوات المطور (Developer Tools)
- اضغط `F12` أو `Ctrl+Shift+I`
- انتقل إلى تبويب `Console`

### 2. مراقبة السجلات
ستظهر رسائل ملونة في Console:

- 🟢 **أخضر:** إعدادات التكوين
- 🔵 **أزرق:** محاولات تسجيل الدخول
- 🟠 **برتقالي:** عمليات الكوكيز
- 🔴 **أحمر:** الأخطاء
- 🟢 **أخضر:** النجاح
- 🟣 **بنفسجي:** تجديد التوكن

### 3. الوصول إلى أداة التصحيح
```javascript
// في Console
window.authDebugger.getLogs()        // عرض جميع السجلات
window.authDebugger.clearLogs()      // مسح السجلات
window.authDebugger.exportLogs()     // تصدير السجلات
window.authDebugger.debugCookieCheck() // فحص الكوكيز الحالية
```

## 📊 خطوات الاختبار

### 1. فتح صفحة تسجيل الدخول
```
http://localhost:3002/auth/signin
```

### 2. إدخال بيانات الاختبار
- البريد الإلكتروني: `st@st.st`
- كلمة المرور: `123456789`

### 3. مراقبة العملية
في Console ستظهر الرسائل التالية:

```
🔧 CONFIG: AuthDebugger initialized
🔧 CONFIG: Current configuration
🔧 CONFIG: Test credentials
🍪 COOKIE: Current cookies
🔐 LOGIN: Login attempt for: st@st.st
🍪 COOKIE: Saving tokens to cookies
✅ SUCCESS: Tokens saved successfully to cookies
🍪 COOKIE: Verification - Access Token saved: true
🍪 COOKIE: Verification - Refresh Token saved: true
🔐 LOGIN: AuthProvider.login() called with data
✅ SUCCESS: AuthProvider.login() completed successfully
✅ SUCCESS: Login successful
```

### 4. التحقق من الكوكيز
في Console اكتب:
```javascript
document.cookie
```

يجب أن ترى:
```
accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🐛 استكشاف الأخطاء

### إذا لم تظهر الكوكيز:
1. تحقق من إعدادات المتصفح (Third-party cookies)
2. تأكد من تشغيل الخادم الخلفي
3. تحقق من Console للأخطاء

### إذا فشل تسجيل الدخول:
1. تحقق من صحة بيانات الاختبار
2. تأكد من تشغيل API على المنفذ 3000
3. تحقق من رسائل الخطأ في Console

## 📝 ملاحظات مهمة

- الكوكيز محفوظة على النطاق `localhost` للتطوير
- في الإنتاج ستكون على النطاق `.3de.school`
- Access Token صالح لمدة ساعة واحدة
- Refresh Token صالح لمدة 30 يوم
- يتم تجديد Access Token تلقائياً قبل انتهاء صلاحيته بـ 5 دقائق

## 🔧 إعدادات التطوير

```javascript
// في config.ts
export const config = {
  API_URL: 'http://localhost:3000',
  COOKIE_DOMAIN: 'localhost',
  COOKIE_SECURE: false,
  NODE_ENV: 'development'
};
``` 