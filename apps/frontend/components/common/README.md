# Common Components Library

مكتبة المكونات المشتركة للتطبيق - مجموعة من المكونات القابلة لإعادة الاستخدام مع animations احترافية من framer-motion.

## 🚀 المميزات

- **Animations احترافية**: جميع المكونات تدعم animations من framer-motion
- **Responsive Design**: مصممة للعمل على جميع أحجام الشاشات
- **RTL Support**: دعم كامل للغة العربية والاتجاه من اليمين لليسار
- **TypeScript**: مكتوبة بالكامل بـ TypeScript مع أنواع قوية
- **Dynamic Imports**: دعم للتحميل المتأخر لتحسين الأداء
- **Customizable**: سهلة التخصيص والتعديل
- **Accessible**: متوافقة مع معايير الوصول

## 📦 المكونات المتاحة

### 1. StatsCard
مكون لعرض الإحصائيات بشكل جميل مع animations.

```tsx
import { StatsCard } from '@/components/common/StatsCard';

<StatsCard
    title="إحصائيات المجتمعات"
    stats={[
        {
            label: "إجمالي المجتمعات",
            value: 10,
            icon: <GroupIcon />,
            color: "primary"
        }
    ]}
    variant="compact"
    animate={true}
/>
```

**الخصائص:**
- `title`: عنوان البطاقة
- `stats`: مصفوفة من الإحصائيات
- `variant`: نوع العرض (default, compact, detailed)
- `animate`: تفعيل/إلغاء الـ animations

### 2. FeatureCard
مكون لعرض المميزات مع إمكانية التقييم والإضافة للمفضلة.

```tsx
import { FeatureCard } from '@/components/common/FeatureCard';

<FeatureCard
    title="مميزة جديدة"
    description="وصف المميزة"
    icon={<StarIcon />}
    rating={4.5}
    isBookmarked={false}
    onBookmark={() => {}}
    onRate={() => {}}
    variant="detailed"
/>
```

**الخصائص:**
- `title`: عنوان المميزة
- `description`: وصف المميزة
- `icon`: أيقونة المميزة
- `rating`: التقييم (0-5)
- `isBookmarked`: هل تمت الإضافة للمفضلة
- `onBookmark`: دالة الإضافة للمفضلة
- `onRate`: دالة التقييم

### 3. HeroSection
مكون للعرض الرئيسي الجذاب مع خلفية وتأثيرات بصرية.

```tsx
import { HeroSection } from '@/components/common/HeroSection';

<HeroSection
    title="عنوان رئيسي"
    subtitle="عنوان فرعي"
    description="وصف تفصيلي"
    primaryAction={{
        label: "إجراء أساسي",
        onClick: () => {}
    }}
    secondaryAction={{
        label: "إجراء ثانوي",
        onClick: () => {}
    }}
    features={[
        {
            icon: <Icon />,
            title: "مميزة",
            description: "وصف المميزة"
        }
    ]}
    variant="split"
/>
```

**الخصائص:**
- `title`: العنوان الرئيسي
- `subtitle`: العنوان الفرعي
- `description`: الوصف
- `primaryAction`: الإجراء الأساسي
- `secondaryAction`: الإجراء الثانوي
- `features`: قائمة المميزات
- `variant`: نوع العرض (default, centered, split)
- `backgroundImage`: صورة الخلفية
- `backgroundVideo`: فيديو الخلفية

## 🎨 استخدام framer-motion

جميع المكونات تدعم animations من framer-motion:

```tsx
// تفعيل الـ animations
<StatsCard animate={true} />

// إلغاء الـ animations
<FeatureCard animate={false} />
```

### أنواع الـ Animations المدعومة:
- **Fade In/Out**: ظهور واختفاء تدريجي
- **Slide**: حركة انزلاقية
- **Scale**: تكبير وتصغير
- **Stagger**: ظهور متتابع
- **Hover Effects**: تأثيرات عند التمرير

## ⚡ Dynamic Imports

يمكن استخدام المكونات مع dynamic imports لتحسين الأداء:

```tsx
const StatsCard = React.lazy(() => import('@/components/common/StatsCard'));

<React.Suspense fallback={<div>جاري التحميل...</div>}>
    <StatsCard />
</React.Suspense>
```

## 🎨 الألوان المدعومة

- `primary`: اللون الأساسي
- `secondary`: اللون الثانوي
- `success`: اللون الأخضر
- `error`: اللون الأحمر
- `warning`: اللون البرتقالي
- `info`: اللون الأزرق

## 📱 Responsive Design

جميع المكونات مصممة لتكون responsive وتعمل على جميع أحجام الشاشات:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🧪 الاختبارات

المكونات مزودة باختبارات شاملة:

```bash
# تشغيل الاختبارات
npm test

# تشغيل الاختبارات في وضع المراقبة
npm run test:watch

# تشغيل الاختبارات مع تقرير التغطية
npm run test:coverage
```

## 📁 هيكل الملفات

```
components/common/
├── StatsCard.tsx          # مكون الإحصائيات
├── FeatureCard.tsx        # مكون المميزات
├── HeroSection.tsx        # مكون العرض الرئيسي
├── types.ts              # الأنواع المشتركة
├── styles.css            # الأنماط الإضافية
├── index.ts              # ملف التصدير
├── README.md             # التوثيق
└── __tests__/            # الاختبارات
    ├── components.test.tsx
    ├── setupTests.ts
    └── package.json
```

## 🔧 التثبيت والاستخدام

### المتطلبات:
- React 18+
- TypeScript 4.5+
- framer-motion 10+
- Material-UI 5+

### التثبيت:
```bash
npm install framer-motion @mui/material @mui/icons-material
```

### الاستخدام:
```tsx
import { StatsCard, FeatureCard, HeroSection } from '@/components/common';

function MyComponent() {
    return (
        <div>
            <HeroSection
                title="مرحباً بك"
                description="وصف الصفحة"
            />
            <StatsCard
                title="الإحصائيات"
                stats={[...]}
            />
        </div>
    );
}
```

## 🎯 أمثلة الاستخدام

### صفحة المجتمعات:
```tsx
import { HeroSection, StatsCard, Card } from '@/components/common';

function CommunityPage() {
    return (
        <div>
            <HeroSection
                title="اكتشف عالم المجتمعات"
                subtitle="انضم إلى مجتمعات متنوعة"
                description="انضم إلى مجتمعات متنوعة وشارك في النقاشات"
                features={[
                    {
                        icon: <GroupIcon />,
                        title: "مجتمعات متنوعة",
                        description: "انضم إلى مجتمعات أكاديمية واجتماعية"
                    }
                ]}
                variant="split"
            />
            
            <StatsCard
                title="إحصائيات المجتمعات"
                stats={[
                    {
                        label: "إجمالي المجتمعات",
                        value: communities.length,
                        icon: <GroupIcon />,
                        color: "primary"
                    }
                ]}
                variant="compact"
            />
            
            <Grid container spacing={3}>
                {communities.map(community => (
                    <Grid item xs={12} sm={6} md={4} key={community.id}>
                        <Card
                            variant="course"
                            title={community.name}
                            description={community.description}
                            onClick={() => handleClick(community.id)}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يرجى فتح issue في GitHub أو التواصل مع فريق التطوير. 