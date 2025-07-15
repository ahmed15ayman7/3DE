'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Textarea, Select, Switch, Tabs } from '@3de/ui';

// Types
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  title: string;
  department: string;
  experienceYears: number;
  specialization: string;
  avatar?: string;
  linkedIn?: string;
  website?: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'students-only';
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  dataCollection: boolean;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  studentSubmissions: boolean;
  gradeReminders: boolean;
  systemUpdates: boolean;
}

const SettingsPage = () => {
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'محمد',
    lastName: 'أحمد',
    email: 'mohamed.ahmed@3de.edu',
    phone: '+966501234567',
    bio: 'محاضر في قسم الرياضيات مع خبرة 10 سنوات في التدريس الجامعي والتعليم الإلكتروني',
    title: 'دكتور',
    department: 'الرياضيات',
    experienceYears: 10,
    specialization: 'الجبر الخطي والتحليل الرياضي',
    linkedIn: 'https://linkedin.com/in/mohamed-ahmed',
    website: 'https://mathpro.edu',
  });

  // Security State
  const [security, setSecurity] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
  });

  // Privacy State
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'students-only',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataCollection: true,
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
    studentSubmissions: true,
    gradeReminders: true,
    systemUpdates: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile Tab
  const ProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">الملف الشخصي</h2>
      
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </span>
        </div>
        <div>
          <Button variant="outline">تغيير الصورة</Button>
          <p className="text-sm text-gray-500 mt-2">JPG, PNG أو GIF (حد أقصى 2MB)</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="الاسم الأول *"
          value={profile.firstName}
          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
        />
        <Input
          label="الاسم الأخير *"
          value={profile.lastName}
          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
        />
        <Input
          label="البريد الإلكتروني *"
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({...profile, email: e.target.value})}
        />
        <Input
          label="رقم الهاتف"
          value={profile.phone}
          onChange={(e) => setProfile({...profile, phone: e.target.value})}
        />
      </div>

      <Textarea
        label="نبذة تعريفية"
        value={profile.bio}
        onChange={(e) => setProfile({...profile, bio: e.target.value})}
        rows={4}
        placeholder="اكتب نبذة مختصرة عن خبراتك وتخصصك..."
      />

      {/* Professional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="اللقب العلمي"
          options={[
            { value: 'أستاذ', label: 'أستاذ' },
            { value: 'أستاذ مشارك', label: 'أستاذ مشارك' },
            { value: 'أستاذ مساعد', label: 'أستاذ مساعد' },
            { value: 'دكتور', label: 'دكتور' },
            { value: 'محاضر', label: 'محاضر' },
          ]}
          value={profile.title}
          onChange={(e) => setProfile({...profile, title: e.target.value})}
        />
        
        <Input
          label="القسم"
          value={profile.department}
          onChange={(e) => setProfile({...profile, department: e.target.value})}
        />
        
        <Input
          label="سنوات الخبرة"
          type="number"
          value={profile.experienceYears}
          onChange={(e) => setProfile({...profile, experienceYears: parseInt(e.target.value)})}
        />
        
        <Input
          label="التخصص"
          value={profile.specialization}
          onChange={(e) => setProfile({...profile, specialization: e.target.value})}
        />
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="LinkedIn"
          value={profile.linkedIn || ''}
          onChange={(e) => setProfile({...profile, linkedIn: e.target.value})}
          placeholder="https://linkedin.com/in/username"
        />
        <Input
          label="الموقع الشخصي"
          value={profile.website || ''}
          onChange={(e) => setProfile({...profile, website: e.target.value})}
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  );

  // Security Tab
  const SecurityTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">الأمان</h2>
      
      {/* Password Change */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">تغيير كلمة المرور</h3>
        <div className="space-y-4">
          <Input
            label="كلمة المرور الحالية"
            type="password"
            value={security.currentPassword}
            onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
          />
          <Input
            label="كلمة المرور الجديدة"
            type="password"
            value={security.newPassword}
            onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
          />
          <Input
            label="تأكيد كلمة المرور الجديدة"
            type="password"
            value={security.confirmPassword}
            onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
          />
          <Button variant="primary">تحديث كلمة المرور</Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">إعدادات الأمان</h3>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">المصادقة الثنائية</h4>
            <p className="text-sm text-gray-600">إضافة طبقة حماية إضافية لحسابك</p>
          </div>
          <Switch
            checked={security.twoFactorAuth}
            onChange={(checked) => setSecurity({...security, twoFactorAuth: checked})}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">إشعارات تسجيل الدخول</h4>
            <p className="text-sm text-gray-600">تنبيه عند تسجيل الدخول من جهاز جديد</p>
          </div>
          <Switch
            checked={security.loginNotifications}
            onChange={(checked) => setSecurity({...security, loginNotifications: checked})}
          />
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">انتهاء الجلسة</h4>
            <span className="text-sm text-gray-600">{security.sessionTimeout} دقيقة</span>
          </div>
          <Select
            options={[
              { value: '15', label: '15 دقيقة' },
              { value: '30', label: '30 دقيقة' },
              { value: '60', label: 'ساعة واحدة' },
              { value: '120', label: 'ساعتين' },
              { value: '0', label: 'لا تنتهي' },
            ]}
            value={security.sessionTimeout.toString()}
            onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
          />
        </div>
      </div>
    </div>
  );

  // Privacy Tab
  const PrivacyTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">الخصوصية</h2>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">رؤية الملف الشخصي</h4>
          <Select
            options={[
              { value: 'public', label: 'عام (مرئي للجميع)' },
              { value: 'students-only', label: 'الطلاب فقط' },
              { value: 'private', label: 'خاص (غير مرئي)' },
            ]}
            value={privacy.profileVisibility}
            onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value as any})}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">إظهار البريد الإلكتروني</h4>
            <p className="text-sm text-gray-600">السماح للطلاب برؤية بريدك الإلكتروني</p>
          </div>
          <Switch
            checked={privacy.showEmail}
            onChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">إظهار رقم الهاتف</h4>
            <p className="text-sm text-gray-600">السماح للطلاب برؤية رقم هاتفك</p>
          </div>
          <Switch
            checked={privacy.showPhone}
            onChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">السماح بالرسائل</h4>
            <p className="text-sm text-gray-600">السماح للطلاب بإرسال رسائل مباشرة</p>
          </div>
          <Switch
            checked={privacy.allowMessages}
            onChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">جمع البيانات</h4>
            <p className="text-sm text-gray-600">السماح بجمع البيانات لتحسين الخدمة</p>
          </div>
          <Switch
            checked={privacy.dataCollection}
            onChange={(checked) => setPrivacy({...privacy, dataCollection: checked})}
          />
        </div>
      </div>
    </div>
  );

  // Notifications Tab
  const NotificationsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">الإشعارات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">طرق الإشعار</h3>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">إشعارات البريد الإلكتروني</h4>
              <p className="text-sm text-gray-600">تلقي الإشعارات عبر البريد</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">إشعارات المتصفح</h4>
              <p className="text-sm text-gray-600">إشعارات فورية في المتصفح</p>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">الرسائل النصية</h4>
              <p className="text-sm text-gray-600">تنبيهات عبر SMS للأحداث المهمة</p>
            </div>
            <Switch
              checked={notifications.smsNotifications}
              onChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">أنواع الإشعارات</h3>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">تقديم الطلاب</h4>
              <p className="text-sm text-gray-600">عند تقديم الطلاب للواجبات</p>
            </div>
            <Switch
              checked={notifications.studentSubmissions}
              onChange={(checked) => setNotifications({...notifications, studentSubmissions: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">تذكير الدرجات</h4>
              <p className="text-sm text-gray-600">تذكير بتصحيح الواجبات المعلقة</p>
            </div>
            <Switch
              checked={notifications.gradeReminders}
              onChange={(checked) => setNotifications({...notifications, gradeReminders: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">تحديثات النظام</h4>
              <p className="text-sm text-gray-600">الميزات الجديدة والتحديثات المهمة</p>
            </div>
            <Switch
              checked={notifications.systemUpdates}
              onChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">الخلاصة الأسبوعية</h4>
              <p className="text-sm text-gray-600">تقرير أسبوعي بالأنشطة والإحصائيات</p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // محاكاة حفظ البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabItems = [
    {
      id: 'profile',
      label: 'الملف الشخصي',
      content: <ProfileTab />,
      icon: '👤'
    },
    {
      id: 'security',
      label: 'الأمان',
      content: <SecurityTab />,
      icon: '🔒'
    },
    {
      id: 'privacy',
      label: 'الخصوصية',
      content: <PrivacyTab />,
      icon: '🛡️'
    },
    {
      id: 'notifications',
      label: 'الإشعارات',
      content: <NotificationsTab />,
      icon: '🔔'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">إدارة ملفك الشخصي وإعدادات الحساب</p>
        </div>
        
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
          >
            {successMessage}
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-custom border border-gray-200">
        <Tabs
          items={tabItems}
          defaultActiveTab="profile"
          variant="underline"
          className="p-6"
        />
        
        {/* Save Button */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <Button variant="outline">إلغاء</Button>
            <Button 
              onClick={handleSave}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-custom border border-red-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">منطقة الخطر</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">تصدير البيانات</h4>
                <p className="text-sm text-gray-600">تحميل نسخة من جميع بياناتك</p>
              </div>
              <Button variant="outline">تصدير البيانات</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">إلغاء تفعيل الحساب</h4>
                <p className="text-sm text-gray-600">إيقاف الحساب مؤقتاً مع الاحتفاظ بالبيانات</p>
              </div>
              <Button variant="outline">إلغاء التفعيل</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-600">حذف الحساب</h4>
                <p className="text-sm text-gray-600">حذف الحساب نهائياً مع جميع البيانات</p>
              </div>
              <Button variant="danger">حذف الحساب</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 