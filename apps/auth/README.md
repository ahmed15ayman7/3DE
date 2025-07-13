# تطبيق المصادقة - 3DE

تطبيق المصادقة لمنصة التعلم الإلكتروني 3DE، يوفر صفحات تسجيل الدخول والتسجيل وإعادة تعيين كلمة المرور.

## المميزات

- ✅ **تسجيل الدخول** (`/signin`) - تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
- ✅ **التسجيل** (`/signup`) - إنشاء حساب جديد مع التحقق من البيانات
- ✅ **نسيت كلمة المرور** (`/forgot-password`) - طلب رابط إعادة تعيين كلمة المرور
- ✅ **إعادة تعيين كلمة المرور** (`/reset-password?token=...`) - تغيير كلمة المرور باستخدام التوكن

## التقنيات المستخدمة

- **Next.js 15** - إطار العمل الرئيسي
- **TypeScript** - للكتابة الآمنة
- **Tailwind CSS** - للتصميم
- **React Hook Form** - لإدارة النماذج
- **Zod** - للتحقق من البيانات
- **Framer Motion** - للحركات والانتقالات
- **Lucide React** - للأيقونات

## المكتبات المشتركة

- `@3de/ui` - مكونات واجهة المستخدم المشتركة
- `@3de/apis` - وظائف API المشتركة
- `@3de/auth` - مكتبة المصادقة والجلسات
- `@3de/interfaces` - أنواع TypeScript المشتركة

## كيفية التشغيل

### 1. تثبيت التبعيات

```bash
# من مجلد المشروع الرئيسي
pnpm install
```

### 2. تشغيل التطبيق

```bash
# من مجلد apps/auth
cd apps/auth
pnpm dev
```

### 3. الوصول للتطبيق

افتح المتصفح على العنوان: `http://localhost:3000`

## هيكل المشروع

```
apps/auth/
├── src/
│   ├── app/
│   │   ├── signin/
│   │   │   └── page.tsx          # صفحة تسجيل الدخول
│   │   ├── signup/
│   │   │   └── page.tsx          # صفحة التسجيل
│   │   ├── forgot-password/
│   │   │   └── page.tsx          # صفحة نسيت كلمة المرور
│   │   ├── reset-password/
│   │   │   └── page.tsx          # صفحة إعادة تعيين كلمة المرور
│   │   ├── layout.tsx            # التخطيط الرئيسي
│   │   ├── page.tsx              # الصفحة الرئيسية
│   │   └── globals.css           # الأنماط العامة
│   └── components/
│       └── AuthForm.tsx          # مكون النموذج المركزي
├── package.json
└── README.md
```

## المكونات

### المكونات الأساسية

#### AuthForm
مكون مركزي يستخدم في جميع صفحات المصادقة، يدعم:
- **تسجيل الدخول**: email + password
- **التسجيل**: name + email + password + confirmPassword + phone
- **نسيت كلمة المرور**: email
- **إعادة تعيين كلمة المرور**: password + confirmPassword

#### AuthLayout
مكون التخطيط الموحد لجميع صفحات المصادقة مع الخلفية المتدرجة والعنوان.

#### LoadingSpinner
مكون التحميل مع رسالة قابلة للتخصيص.

#### ErrorBoundary
مكون للتعامل مع الأخطاء وعرض رسائل خطأ مناسبة.

#### AuthGuard
مكون لحماية الصفحات والتحقق من الصلاحيات.

### مكونات الحركة (Framer Motion)

#### PageTransition
مكون للانتقالات السلسة بين الصفحات مع خيارات متعددة:
- `fade`: تلاشي بسيط
- `slide`: انزلاق أفقي
- `scale`: تكبير/تصغير
- `slideUp`: انزلاق رأسي

#### AnimatedButton
أزرار متحركة مع تأثيرات مختلفة:
- `scale`: تكبير عند التمرير
- `bounce`: ارتداد
- `pulse`: نبض
- `shake`: اهتزاز

#### AnimatedInput
حقول إدخال متحركة مع تأثيرات التركيز.

### المميزات

- ✅ تحقق من البيانات باستخدام Zod
- ✅ إدارة الحالة باستخدام React Hook Form
- ✅ عرض الأخطاء والتنبيهات
- ✅ إخفاء/إظهار كلمة المرور
- ✅ تحميل أثناء الإرسال
- ✅ حركات سلسة باستخدام Framer Motion
- ✅ تصميم متجاوب
- ✅ دعم اللغة العربية (RTL)
- ✅ مكونات قابلة لإعادة الاستخدام
- ✅ معالجة الأخطاء المتقدمة

## التوجيه التلقائي

عند تسجيل الدخول بنجاح، يتم توجيه المستخدم تلقائياً حسب نوعه:

- **STUDENT** → `/student`
- **INSTRUCTOR** → `/instructor`
- **ADMIN** → `/admin`
- **ACADEMY** → `/academy`
- **PARENT** → `/parent`

## الألوان

النظام يستخدم مجموعة ألوان موحدة:

- **Primary**: `#3b82f6` (أزرق)
- **Error**: `#ef4444` (أحمر)
- **Success**: `#10b981` (أخضر)
- **Warning**: `#f59e0b` (برتقالي)
- **Info**: `#06b6d4` (أزرق فاتح)

## أمثلة الاستخدام

### استخدام AuthForm
```tsx
import { AuthForm } from '../components/AuthForm';

export default function SignInPage() {
  return (
    <AuthLayout title="تسجيل الدخول">
      <AuthForm type="signin" />
    </AuthLayout>
  );
}
```

### استخدام PageTransition
```tsx
import { PageTransition } from '../components/PageTransition';

export default function MyPage() {
  return (
    <PageTransition>
      <div>محتوى الصفحة</div>
    </PageTransition>
  );
}
```

### استخدام AnimatedButton
```tsx
import { AnimatedButton } from '../components/AnimatedButton';

export default function MyComponent() {
  return (
    <AnimatedButton 
      animationType="bounce"
      variant="primary"
      onClick={() => console.log('تم النقر')}
    >
      زر متحرك
    </AnimatedButton>
  );
}
```

### استخدام AuthGuard
```tsx
import { AuthGuard } from '../components/AuthGuard';

export default function ProtectedPage() {
  return (
    <AuthGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
      <div>محتوى محمي</div>
    </AuthGuard>
  );
}
```

## التطوير

### إضافة صفحة جديدة

1. أنشئ مجلد جديد في `src/app/`
2. أضف `page.tsx` داخل المجلد
3. استخدم `AuthForm` مع النوع المناسب
4. أضف التوجيه في `layout.tsx` إذا لزم الأمر

### تخصيص التصميم

- عدّل `globals.css` لتغيير الألوان
- استخدم مكونات `@3de/ui` للاتساق
- أضف حركات جديدة باستخدام Framer Motion

### إضافة مكونات جديدة

1. أنشئ المكون في `src/components/`
2. أضف التصدير في `src/components/index.ts`
3. استخدم المكون في الصفحات المطلوبة

## الاستكشاف

إذا واجهت أي مشاكل:

1. تأكد من تثبيت جميع التبعيات
2. تحقق من تشغيل الخادم الخلفي
3. راجع وحدة التحكم للمتصفح للأخطاء
4. تأكد من صحة متغيرات البيئة

## النشر

### النشر المحلي

```bash
# تشغيل التطبيق
pnpm dev

# بناء التطبيق للإنتاج
pnpm build

# تشغيل التطبيق المبني
pnpm start
```

### النشر باستخدام Docker

```bash
# بناء الصورة
docker build -t 3de-auth .

# تشغيل الحاوية
docker run -p 3001:3000 3de-auth

# أو باستخدام docker-compose
docker-compose up -d
```

### النشر على Vercel

1. اربط المشروع بـ Vercel
2. اضبط متغيرات البيئة:
   - `NEXT_PUBLIC_API_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
3. انشر التطبيق

### النشر على AWS

1. استخدم AWS Amplify أو Elastic Beanstalk
2. اضبط متغيرات البيئة
3. انشر التطبيق

## المساهمة

1. Fork المشروع
2. أنشئ فرع جديد للميزة
3. اكتب الكود مع الاختبارات
4. أرسل Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

---

**ملاحظة**: هذا التطبيق جزء من نظام 3DE الشامل، تأكد من تشغيل جميع الخدمات المطلوبة.
