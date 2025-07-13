# UI Components Library

مكتبة مكونات واجهة المستخدم الاحترافية مع دعم TypeScript و Tailwind CSS.

## المكونات المتاحة

### 🎯 Button
زر تفاعلي مع أنواع وأحجام مختلفة.

```tsx
import { Button } from '@3de/ui';

<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  انقر هنا
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'

### 📻 Radio & RadioGroup
أزرار راديو مع دعم المجموعات.

```tsx
import { Radio, RadioGroup } from '@3de/ui';

<RadioGroup
  name="options"
  value={selectedValue}
  onChange={setSelectedValue}
  options={[
    { value: 'option1', label: 'الخيار الأول' },
    { value: 'option2', label: 'الخيار الثاني' }
  ]}
/>
```

### 🏷️ Badge & BadgeGroup
شارات مع أنواع مختلفة.

```tsx
import { Badge, BadgeGroup } from '@3de/ui';

<Badge variant="success" size="md" removable onRemove={() => console.log('removed')}>
  نجح
</Badge>
```

### 👤 Avatar & AvatarGroup
صور المستخدمين مع دعم الحالات.

```tsx
import { Avatar, AvatarGroup } from '@3de/ui';

<Avatar
  src="/path/to/image.jpg"
  fallback="أحمد محمد"
  size="lg"
  status="online"
/>
```

### ⚠️ Alert & AlertGroup
تنبيهات مع أنواع مختلفة.

```tsx
import { Alert, AlertGroup } from '@3de/ui';

<Alert variant="success" title="نجح" closable onClose={() => console.log('closed')}>
  تم حفظ البيانات بنجاح
</Alert>
```

### 💡 Tooltip & TooltipProvider
تلميحات مع مواضع مختلفة.

```tsx
import { Tooltip, TooltipProvider } from '@3de/ui';

<Tooltip content="معلومات إضافية" position="top">
  <button>مرر الماوس هنا</button>
</Tooltip>
```

### 📋 Dropdown
قوائم منسدلة تفاعلية.

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from '@3de/ui';

<Dropdown
  trigger={<button>القائمة</button>}
  items={[
    { id: '1', label: 'عنصر 1', onClick: () => console.log('1') },
    { id: '2', label: 'عنصر 2', onClick: () => console.log('2') }
  ]}
/>
```

### 📑 Tabs
تبويبات مع أنواع مختلفة.

```tsx
import { Tabs } from '@3de/ui';

<Tabs
  items={[
    { id: 'tab1', label: 'التبويب الأول', content: <div>محتوى التبويب الأول</div> },
    { id: 'tab2', label: 'التبويب الثاني', content: <div>محتوى التبويب الثاني</div> }
  ]}
  variant="pills"
/>
```

### 📖 Accordion
قوائم قابلة للطي والتوسيع.

```tsx
import { Accordion } from '@3de/ui';

<Accordion
  items={[
    { id: '1', title: 'عنوان 1', content: <div>محتوى 1</div> },
    { id: '2', title: 'عنوان 2', content: <div>محتوى 2</div> }
  ]}
  allowMultiple
/>
```

### 📊 Table
جداول مع دعم الترتيب والتصفية.

```tsx
import { Table } from '@3de/ui';

<Table
  data={data}
  columns={[
    { key: 'name', header: 'الاسم', sortable: true },
    { key: 'email', header: 'البريد الإلكتروني' }
  ]}
  sortable
  selectable
/>
```

### 📄 Pagination
تنقل بين الصفحات.

```tsx
import { Pagination } from '@3de/ui';

<Pagination
  currentPage={1}
  totalPages={10}
  totalItems={100}
  itemsPerPage={10}
  onPageChange={setCurrentPage}
  showTotalItems
/>
```

### 📈 Progress & CircularProgress
أشرطة التقدم الدائرية والمستقيمة.

```tsx
import { Progress, CircularProgress } from '@3de/ui';

<Progress value={75} variant="success" showLabel />
<CircularProgress value={60} size="lg" showLabel />
```

### ⏳ Spinner & LoadingSpinner
مؤشرات التحميل.

```tsx
import { Spinner, LoadingSpinner } from '@3de/ui';

<Spinner variant="dots" size="lg" />
<LoadingSpinner loading={isLoading} overlay>
  <div>محتوى الصفحة</div>
</LoadingSpinner>
```

### 💀 Skeleton
عناصر هيكلية للتحميل.

```tsx
import { Skeleton, SkeletonCard, SkeletonTable } from '@3de/ui';

<Skeleton variant="text" width="200px" />
<SkeletonCard showAvatar showImage />
<SkeletonTable rows={5} columns={4} />
```

## التثبيت

```bash
pnpm add @3de/ui
```

## الاستخدام

```tsx
import { Button, Alert, Badge } from '@3de/ui';

function MyComponent() {
  return (
    <div>
      <Button variant="primary">زر أساسي</Button>
      <Alert variant="info">معلومات مهمة</Alert>
      <Badge variant="success">نجح</Badge>
    </div>
  );
}
```

## الميزات

- ✅ TypeScript مكتوب بـ
- ✅ Tailwind CSS مصمم بـ
- ✅ قابل للتخصيص بالكامل
- ✅ دعم RTL
- ✅ مكونات تفاعلية
- ✅ حركات سلسة
- ✅ متوافق مع React 18+
- ✅ دعم SSR

## المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل البدء. 