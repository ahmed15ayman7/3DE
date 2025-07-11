# مكونات UI المحسنة

تم تحويل جميع مكونات UI من MUI إلى Tailwind CSS مع LazyMotion لتحسين الأداء.

## المكونات المتاحة

### المكونات الأساسية

#### Button
```tsx
import { Button } from '@/components/ui'

<Button variant="default" size="lg" loading={false}>
  انقر هنا
</Button>
```

#### Input
```tsx
import { Input } from '@/components/ui'

<Input 
  placeholder="أدخل النص هنا"
  error={false}
  helperText="نص مساعد"
/>
```

#### FormInput
```tsx
import { FormInput } from '@/components/ui'

<FormInput 
  label="البريد الإلكتروني"
  type="email"
  error={false}
  helperText="نص الخطأ"
/>
```

#### PhoneInput
```tsx
import { CustomPhoneInput } from '@/components/ui'

<CustomPhoneInput 
  value={phone}
  onChange={setPhone}
  error={false}
  helperText="نص الخطأ"
/>
```

#### Select
```tsx
import { Select } from '@/components/ui'

<Select 
  label="اختر الخيار"
  options={[
    { value: '1', label: 'الخيار الأول' },
    { value: '2', label: 'الخيار الثاني' }
  ]}
  error={false}
  helperText="نص الخطأ"
/>
```

#### Textarea
```tsx
import { Textarea } from '@/components/ui'

<Textarea 
  label="الوصف"
  placeholder="أدخل الوصف هنا"
  error={false}
  helperText="نص الخطأ"
/>
```

#### Checkbox
```tsx
import { Checkbox } from '@/components/ui'

<Checkbox 
  label="أوافق على الشروط"
  checked={checked}
  onChange={setChecked}
/>
```

#### Radio
```tsx
import { Radio } from '@/components/ui'

<Radio 
  label="الخيار الأول"
  checked={selected === '1'}
  onChange={() => setSelected('1')}
/>
```

#### Switch
```tsx
import { Switch } from '@/components/ui'

<Switch 
  label="تفعيل الإشعارات"
  checked={notifications}
  onChange={setNotifications}
/>
```

### مكونات التخطيط

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'

<Card>
  <CardHeader>
    <CardTitle>عنوان البطاقة</CardTitle>
  </CardHeader>
  <CardContent>
    محتوى البطاقة
  </CardContent>
  <CardFooter>
    <Button>إجراء</Button>
  </CardFooter>
</Card>
```

#### Dialog
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>عنوان الحوار</DialogTitle>
    </DialogHeader>
    <DialogBody>
      محتوى الحوار
    </DialogBody>
    <DialogFooter>
      <Button>إغلاق</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### مكونات التغذية الراجعة

#### Badge
```tsx
import { Badge } from '@/components/ui'

<Badge variant="success" size="lg">
  نجح
</Badge>
```

#### Alert
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui'

<Alert variant="success">
  <AlertTitle>نجح!</AlertTitle>
  <AlertDescription>
    تم حفظ البيانات بنجاح
  </AlertDescription>
</Alert>
```

### المكونات المساعدة

#### SearchBar
```tsx
import { SearchBar } from '@/components/ui'

<SearchBar 
  placeholder="ابحث هنا..."
  setSearch={setSearchTerm}
/>
```

## المميزات

- **LazyMotion**: جميع المكونات تستخدم LazyMotion من framer-motion لتحسين الأداء
- **Tailwind CSS**: تصميم متسق باستخدام Tailwind CSS
- **TypeScript**: دعم كامل لـ TypeScript
- **Responsive**: تصميم متجاوب لجميع أحجام الشاشات
- **Accessibility**: دعم إمكانية الوصول
- **Customizable**: سهولة التخصيص عبر props

## الاستيراد

```tsx
// استيراد مكون واحد
import { Button } from '@/components/ui'

// استيراد عدة مكونات
import { Button, Input, Card } from '@/components/ui'

// استيراد جميع المكونات
import * as UI from '@/components/ui'
``` 