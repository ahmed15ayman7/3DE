# مكونات Layout المحسنة

تم تحويل جميع مكونات Layout من MUI إلى Tailwind CSS مع LazyMotion لتحسين الأداء.

## المكونات المتاحة

### Navbar
شريط التنقل الرئيسي مع دعم للجوال والكمبيوتر.

```tsx
import { Navbar } from '@/components/layout'

<Navbar
  user={user}
  role="STUDENT"
  notifications={notifications}
  messages={messages}
  showNotifications={true}
  showProfile={true}
  showSearch={false}
  links={[
    { label: 'الرئيسية', href: '/' },
    { label: 'الدورات', href: '/courses' },
    { label: 'الملف الشخصي', href: '/profile' }
  ]}
/>
```

#### المميزات:
- **Responsive Design**: تصميم متجاوب للجوال والكمبيوتر
- **Mobile Drawer**: قائمة جانبية للجوال
- **Notifications**: نظام إشعارات متكامل
- **Messages**: نظام رسائل
- **Profile Dropdown**: قائمة الملف الشخصي
- **LazyMotion**: تحسين الأداء

### Footer
تذييل الصفحة مع روابط ومعلومات التواصل.

```tsx
import { Footer } from '@/components/layout'

<Footer
  links={{
    quickLinks: {
      label: 'روابط سريعة',
      links: [
        { label: 'الرئيسية', href: '/' },
        { label: 'من نحن', href: '/about' }
      ]
    },
    support: {
      label: 'الدعم',
      links: [
        { label: 'المساعدة', href: '/help' },
        { label: 'اتصل بنا', href: '/contact' }
      ]
    }
  }}
/>
```

#### المميزات:
- **Social Media**: أزرار وسائل التواصل الاجتماعي
- **Contact Info**: معلومات التواصل
- **Quick Links**: روابط سريعة
- **Support Links**: روابط الدعم
- **Responsive Grid**: شبكة متجاوبة

### ChatDialog
نافذة الدردشة المباشرة مع المساعد الذكي.

```tsx
import { ChatDialog } from '@/components/layout'

<ChatDialog />
```

#### المميزات:
- **Floating Button**: زر عائم للدردشة
- **Real-time Chat**: دردشة فورية
- **Message History**: تاريخ الرسائل
- **Responsive Design**: تصميم متجاوب
- **Smooth Animations**: حركات سلسة

## المميزات العامة

### الأداء
- **LazyMotion**: جميع المكونات تستخدم LazyMotion من framer-motion
- **Optimized Rendering**: تحسين العرض
- **Reduced Bundle Size**: تقليل حجم الباندل

### التصميم
- **Tailwind CSS**: تصميم متسق باستخدام Tailwind CSS
- **Modern UI**: واجهة مستخدم حديثة
- **Accessibility**: دعم إمكانية الوصول
- **RTL Support**: دعم اللغة العربية

### التفاعل
- **Smooth Transitions**: انتقالات سلسة
- **Hover Effects**: تأثيرات التحويم
- **Loading States**: حالات التحميل
- **Error Handling**: معالجة الأخطاء

## الاستيراد

```tsx
// استيراد مكون واحد
import { Navbar } from '@/components/layout'

// استيراد عدة مكونات
import { Navbar, Footer, ChatDialog } from '@/components/layout'

// استيراد جميع المكونات
import * as Layout from '@/components/layout'
```

## الاستخدام في Layout

```tsx
import { Navbar, Footer, ChatDialog } from '@/components/layout'

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar {...navbarProps} />
      <main className="flex-1">
        {children}
      </main>
      <Footer {...footerProps} />
      <ChatDialog />
    </div>
  )
}
```

## التخصيص

جميع المكونات قابلة للتخصيص عبر props ويمكن تعديل الألوان والأنماط باستخدام Tailwind CSS classes.

```tsx
// تخصيص الألوان
<Navbar className="bg-blue-600 text-white" />

// تخصيص الحجم
<ChatDialog className="w-96 h-[500px]" />

// تخصيص الموضع
<Footer className="mt-auto" />
``` 