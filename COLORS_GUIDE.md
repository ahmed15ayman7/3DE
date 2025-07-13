# دليل استخدام الألوان المخصصة في مشروع 3DE

## الألوان المتاحة

### الألوان الأساسية (Primary)
- `bg-primary-main` - الخلفية الأساسية (#249491)
- `bg-primary-light` - الخلفية الفاتحة (#4db3b0)
- `bg-primary-dark` - الخلفية الداكنة (#1a6b69)
- `text-primary-main` - لون النص الأساسي
- `text-primary-light` - لون النص الفاتح
- `text-primary-dark` - لون النص الداكن
- `border-primary-main` - لون الحدود الأساسي
- `border-primary-light` - لون الحدود الفاتح
- `border-primary-dark` - لون الحدود الداكن

### الألوان الثانوية (Secondary)
- `bg-secondary-main` - الخلفية الثانوية (#003f59)
- `bg-secondary-light` - الخلفية الثانوية الفاتحة (#005a7a)
- `bg-secondary-dark` - الخلفية الثانوية الداكنة (#002a3a)
- `text-secondary-main` - لون النص الثانوي
- `text-secondary-light` - لون النص الثانوي الفاتح
- `text-secondary-dark` - لون النص الثانوي الداكن
- `border-secondary-main` - لون الحدود الثانوي
- `border-secondary-light` - لون الحدود الثانوي الفاتح
- `border-secondary-dark` - لون الحدود الثانوي الداكن

## أمثلة الاستخدام

### الأزرار
```jsx
// زر أساسي
<button className="bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors">
  زر أساسي
</button>

// زر ثانوي
<button className="bg-secondary-main hover:bg-secondary-dark text-white px-4 py-2 rounded-lg transition-colors">
  زر ثانوي
</button>
```

### البطاقات
```jsx
<div className="bg-white border border-primary-main rounded-lg p-4">
  <h3 className="text-primary-main font-semibold">عنوان البطاقة</h3>
  <p className="text-gray-600">محتوى البطاقة</p>
</div>
```

### النصوص
```jsx
<h1 className="text-primary-main text-2xl font-bold">عنوان رئيسي</h1>
<p className="text-secondary-main">نص ثانوي</p>
<span className="text-primary-light">نص فاتح</span>
```

### الحقول
```jsx
<input 
  className="border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-main rounded-lg px-3 py-2"
  placeholder="أدخل النص هنا"
/>
```

## الألوان المخصصة الأخرى

### ألوان الحالة
- `success` - الأخضر (#4CAF50)
- `error` - الأحمر (#F44336)
- `warning` - البرتقالي (#FF9800)
- `info` - الأزرق (#2196F3)

### ألوان النص
- `text-primary` - النص الأساسي (#002D32)
- `text-secondary` - النص الثانوي (#666666)

## ملاحظات مهمة

1. تأكد من أن ملف `tailwind.config.js` يحتوي على تعريف الألوان المخصصة
2. تأكد من أن ملف `globals.css` يحتوي على متغيرات CSS المطلوبة
3. استخدم `safelist` في ملف Tailwind لتجنب حذف الألوان المخصصة عند البناء
4. الألوان متوافقة مع الوضع المظلم (Dark Mode)

## اختبار الألوان

يمكنك استخدام ملف `apps/student/src/app/test-colors.tsx` لاختبار جميع الألوان المخصصة والتأكد من عملها بشكل صحيح. 