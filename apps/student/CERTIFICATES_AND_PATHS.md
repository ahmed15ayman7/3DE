# الشهادات ومسارات التعلم - واجهة الطالب

## نظرة عامة

تم بناء قسمين رئيسيين في واجهة الطالب:

### 🔶 القسم 1: الشهادات (Certificates)

#### المكونات المنشأة:

1. **`QRCode`** - مكون لعرض رمز QR للشهادات
   - يستخدم Canvas لرسم QR Code
   - يدعم أحجام مختلفة
   - يحتوي على أنيميشن باستخدام Framer Motion

2. **`CertificateDialog`** - نموذج طلب الشهادة
   - نموذج شامل مع التحقق من صحة البيانات
   - يستخدم react-hook-form + zod
   - يحتوي على حقول: الاسم، العنوان، الهاتف، ملاحظات
   - معلومات مهمة للمستخدم

3. **`CertificateCard`** - كارت عرض الشهادة
   - يعرض تفاصيل الشهادة مع QR Code
   - أزرار للتحميل والمشاركة ونسخ الرابط
   - تصميم جذاب مع أنيميشن

4. **`useCertificates`** - Hook لإدارة الشهادات
   - جلب الشهادات الموافق عليها
   - طلب شهادة جديدة
   - تحميل ومشاركة الشهادات

#### الصفحات المنشأة:

- **`/certificates/page.tsx`** - صفحة الشهادات الرئيسية
  - عرض جميع الشهادات الموافق عليها
  - إحصائيات سريعة
  - حالة فارغة عند عدم وجود شهادات

### 🔶 القسم 2: مسارات التعلم (Learning Paths)

#### المكونات المنشأة:

1. **`PathAvatars`** - عرض صور المشاركين
   - تراكب دائري للصور
   - دعم أحجام مختلفة
   - عرض عدد المشاركين الإضافيين

2. **`LearningPathCard`** - كارت مسار تعليمي
   - عرض معلومات المسار الأساسية
   - نسبة التقدم والوقت المتبقي
   - صور المشاركين
   - أنيميشن عند التفاعل

3. **`SubscribeButton`** - زر الاشتراك في المسار
   - حالات مختلفة (مشترك/غير مشترك)
   - معالجة الأخطاء
   - أنيميشن عند الضغط

4. **`usePaths`** - Hook لإدارة المسارات
   - جلب جميع المسارات
   - جلب مسار واحد بالتفاصيل
   - الاشتراك وإلغاء الاشتراك

#### الصفحات المنشأة:

- **`/paths/page.tsx`** - صفحة المسارات الرئيسية
  - عرض قائمة المسارات مع pagination
  - تصفية حسب المستوى
  - بحث في المسارات
  - إحصائيات سريعة

- **`/paths/[id]/page.tsx`** - صفحة تفاصيل المسار
  - معلومات المسار الكاملة
  - الكورسات المرتبطة
  - المشاركون
  - زر الاشتراك

## الميزات المطبقة:

### ✅ الشهادات:
- [x] عرض الشهادات الموافق عليها فقط
- [x] نموذج طلب شهادة مع التحقق من صحة البيانات
- [x] QR Code للتحقق من الشهادة
- [x] تحميل ومشاركة الشهادات
- [x] إحصائيات سريعة

### ✅ مسارات التعلم:
- [x] عرض قائمة المسارات مع pagination
- [x] تصفية وبحث في المسارات
- [x] عرض تفاصيل المسار الكاملة
- [x] صور المشاركين بتصميم تراكب دائري
- [x] الاشتراك وإلغاء الاشتراك
- [x] نسبة التقدم والوقت المتبقي

## التقنيات المستخدمة:

- **Next.js 14** مع App Router
- **TypeScript** للأنواع الآمنة
- **Tailwind CSS** للتصميم
- **Framer Motion** للأنيميشن
- **React Query** لإدارة الحالة
- **React Hook Form + Zod** للنماذج
- **Lucide React** للأيقونات

## الملفات المنشأة:

```
apps/student/src/
├── components/
│   ├── certificates/
│   │   ├── CertificateCard.tsx
│   │   └── CertificateDialog.tsx
│   ├── paths/
│   │   ├── LearningPathCard.tsx
│   │   ├── PathAvatars.tsx
│   │   └── SubscribeButton.tsx
│   └── common/
│       └── QRCode.tsx
├── hooks/
│   ├── useCertificates.ts
│   └── usePaths.ts
└── app/
    ├── certificates/
    │   └── page.tsx
    └── paths/
        ├── page.tsx
        └── [id]/
            └── page.tsx
```

## الاستخدام:

### الشهادات:
```tsx
import { useCertificates } from '../hooks/useCertificates';

const { useApprovedCertificates, useRequestCertificate } = useCertificates();
const { data: certificates, isLoading } = useApprovedCertificates();
```

### مسارات التعلم:
```tsx
import { usePaths } from '../hooks/usePaths';

const { useAllPaths, useSubscribeToPath } = usePaths();
const { data: paths, isLoading } = useAllPaths();
```

## ملاحظات:

1. جميع البيانات حالياً محاكاة (mock data)
2. تم استخدام مكتبة @3de/ui للمكونات الأساسية
3. جميع المكونات تدعم اللغة العربية
4. تم تطبيق أفضل ممارسات UX/UI
5. جميع المكونات responsive وتدعم الأجهزة المحمولة 