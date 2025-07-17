'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Globe,
  Palette,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, Button, Input, Textarea, Switch, Badge, Tabs, Avatar } from '@3de/ui'

const profileSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب'),
  lastName: z.string().min(1, 'الاسم الأخير مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  bio: z.string().max(500, 'الحد الأقصى 500 حرف'),
  specialization: z.string().min(1, 'التخصص مطلوب'),
  experience: z.number().min(0, 'سنوات الخبرة يجب أن تكون رقم موجب'),
  location: z.string().optional(),
  website: z.string().url('رابط الموقع غير صحيح').optional().or(z.literal('')),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState('/instructor-avatar.jpg')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'ahmed@3de.academy',
      phone: '+966501234567',
      bio: 'محاضر متخصص في تطوير الويب وتقنيات JavaScript الحديثة، لدي خبرة 8 سنوات في التدريس والتطوير.',
      specialization: 'تطوير الويب',
      experience: 8,
      location: 'الرياض، المملكة العربية السعودية',
      website: 'https://ahmed-dev.com',
      linkedin: 'ahmed-mohammed',
      twitter: 'ahmed_dev',
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    // Handle form submission
    console.log('Profile data:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const tabItems = [
    {
      id: 'profile',
      label: 'الملف الشخصي',
      content: (
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                الصورة الشخصية
              </h3>
              
              <div className="flex items-center gap-6 gap-reverse">
                <div className="relative">
                  <Avatar
                    src={profileImage}
                    fallback="أ م"
                    size="xl"
                  />
                  <label className="absolute bottom-0 right-0 bg-primary-main text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    تحديث الصورة الشخصية
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    يُفضل استخدام صورة بحجم 400x400 بكسل
                  </p>
                  <div className="flex gap-2 gap-reverse">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 ml-2" />
                      رفع صورة
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الأول *
                  </label>
                  <Input
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الأخير *
                  </label>
                  <Input
                    {...register('lastName')}
                    error={errors.lastName?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <Input
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <Input
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التخصص *
                  </label>
                  <Input
                    {...register('specialization')}
                    error={errors.specialization?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنوات الخبرة *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    {...register('experience', { valueAsNumber: true })}
                    error={errors.experience?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع
                  </label>
                  <Input
                    {...register('location')}
                    error={errors.location?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نبذة تعريفية
                  </label>
                  <Textarea
                    {...register('bio')}
                    rows={4}
                    placeholder="اكتب نبذة مختصرة عن خبرتك وتخصصك..."
                    error={errors.bio?.message}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {watch('bio')?.length || 0}/500 حرف
                  </p>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                الروابط الاجتماعية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع الشخصي
                  </label>
                  <Input
                    type="url"
                    placeholder="https://your-website.com"
                    {...register('website')}
                    error={errors.website?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <Input
                    placeholder="username"
                    {...register('linkedin')}
                    error={errors.linkedin?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <Input
                    placeholder="@username"
                    {...register('twitter')}
                    error={errors.twitter?.message}
                  />
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'الإشعارات',
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              إعدادات الإشعارات
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">إشعارات الطلاب الجدد</h4>
                  <p className="text-sm text-gray-600">
                    تلقي إشعار عند انضمام طالب جديد لأحد كورساتك
                  </p>
                </div>
                <Switch  />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">إشعارات الرسائل</h4>
                  <p className="text-sm text-gray-600">
                    إشعارات عند تلقي رسائل جديدة من الطلاب
                  </p>
                </div>
                <Switch checked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">إشعارات الاختبارات</h4>
                  <p className="text-sm text-gray-600">
                    تنبيهات عند تسليم الطلاب للاختبارات
                  </p>
                </div>
                <Switch checked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">إشعارات المجتمع</h4>
                  <p className="text-sm text-gray-600">
                    إشعارات من المجتمعات التي تنتمي إليها
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">إشعارات البريد الإلكتروني</h4>
                  <p className="text-sm text-gray-600">
                    تلقي نسخة من الإشعارات عبر البريد الإلكتروني
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">إشعارات الأنشطة الأسبوعية</h4>
                  <p className="text-sm text-gray-600">
                    تقرير أسبوعي عن أنشطة طلابك
                  </p>
                </div>
                <Switch checked />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'الأمان',
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              تغيير كلمة المرور
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور الحالية"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <Input
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <Input
                  type="password"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                />
              </div>

              <Button variant="primary">
                <Shield className="h-4 w-4 ml-2" />
                تحديث كلمة المرور
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              الجلسات النشطة
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">الجلسة الحالية</h4>
                  <p className="text-sm text-gray-600">
                    Chrome على Windows • الرياض، السعودية
                  </p>
                  <p className="text-xs text-gray-500">نشط الآن</p>
                </div>
                <Badge variant="success" size="sm">حالي</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Safari على iPhone</h4>
                  <p className="text-sm text-gray-600">الرياض، السعودية</p>
                  <p className="text-xs text-gray-500">منذ ساعتين</p>
                </div>
                <Button variant="outline" size="sm">
                  إنهاء الجلسة
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              حذف الحساب
            </h3>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3 gap-reverse">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">
                    حذف الحساب نهائياً
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    سيتم حذف جميع البيانات والكورسات نهائياً ولا يمكن استرجاعها.
                  </p>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف الحساب
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'preferences',
      label: 'التفضيلات',
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              إعدادات العرض
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">الوضع المظلم</h4>
                  <p className="text-sm text-gray-600">
                    تبديل بين الوضع المضيء والمظلم
                  </p>
                </div>
                <div className="flex items-center gap-2 gap-reverse">
                  <Sun className="h-4 w-4 text-gray-400" />
                  <Switch />
                  <Moon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">اللغة</h4>
                  <p className="text-sm text-gray-600">
                    لغة واجهة المستخدم
                  </p>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main">
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">المنطقة الزمنية</h4>
                  <p className="text-sm text-gray-600">
                    المنطقة الزمنية المحلية
                  </p>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main">
                  <option value="Asia/Riyadh">توقيت الرياض (GMT+3)</option>
                  <option value="Asia/Dubai">توقيت دبي (GMT+4)</option>
                  <option value="UTC">توقيت عالمي (UTC)</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              تصدير البيانات
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                يمكنك تحميل نسخة من بياناتك الشخصية ومحتوى الكورسات
              </p>
              
              <div className="flex gap-4 gap-reverse">
                <Button variant="outline">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير البيانات الشخصية
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير محتوى الكورسات
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600 mt-1">
            إدارة ملفك الشخصي وتفضيلات الحساب
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          items={tabItems}
          defaultActiveTab="profile"
          variant="underline"
          fullWidth
        />
      </Card>
    </div>
  )
} 