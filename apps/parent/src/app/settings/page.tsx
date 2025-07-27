'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../../components/Layout';
import { Card, Input, Button, Switch } from '@3de/ui';
import { 
  User, 
  Bell, 
  Shield, 
  Mail, 
  Phone,
  Save,
  Eye,
  EyeOff,
  Key,
  Globe
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    attendance: true,
    grades: true,
    courseProgress: true,
    achievements: true,
    urgent: true,
    email: true,
    push: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-main"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    try {
      // هنا سيتم إضافة منطق تحديث الملف الشخصي
      console.log('تحديث الملف الشخصي:', profileData);
      // await updateProfile(profileData);
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }

    setIsUpdating(true);
    try {
      // هنا سيتم إضافة منطق تغيير كلمة المرور
      console.log('تغيير كلمة المرور');
      // await changePassword(passwordData);
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            الإعدادات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة حسابك وتفضيلاتك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary-main" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                الملف الشخصي
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم الأول
                  </label>
                  <Input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="الاسم الأول"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم الأخير
                  </label>
                  <Input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="الاسم الأخير"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="البريد الإلكتروني"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الهاتف
                </label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleProfileUpdate}
                disabled={isUpdating}
                className="w-full"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </div>
          </Card>

          {/* Password Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                كلمة المرور
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="كلمة المرور الحالية"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  كلمة المرور الجديدة
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="كلمة المرور الجديدة"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="تأكيد كلمة المرور الجديدة"
                  className="w-full"
                />
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="w-full"
              >
                <Key className="w-4 h-4 ml-2" />
                تغيير كلمة المرور
              </Button>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                الإشعارات
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">إشعارات الحضور</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تنبيهات عند غياب الطفل
                  </p>
                </div>
                <Switch
                  checked={notifications.attendance}
                  onChange={() => handleNotificationToggle('attendance')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">إشعارات الدرجات</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تنبيهات عند صدور نتائج جديدة
                  </p>
                </div>
                <Switch
                  checked={notifications.grades}
                  onChange={() => handleNotificationToggle('grades')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">تقدم الكورسات</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تحديثات عن تقدم الطفل في الكورسات
                  </p>
                </div>
                <Switch
                  checked={notifications.courseProgress}
                  onChange={() => handleNotificationToggle('courseProgress')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">الإنجازات</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تنبيهات عند تحقيق إنجازات جديدة
                  </p>
                </div>
                <Switch
                  checked={notifications.achievements}
                  onChange={() => handleNotificationToggle('achievements')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">الإشعارات العاجلة</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    إشعارات مهمة وعاجلة
                  </p>
                </div>
                <Switch
                  checked={notifications.urgent}
                  onChange={() => handleNotificationToggle('urgent')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    إرسال الإشعارات عبر البريد الإلكتروني
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onChange={() => handleNotificationToggle('email')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">إشعارات الموقع</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    إشعارات مباشرة في الموقع
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onChange={() => handleNotificationToggle('push')}
                />
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                الخصوصية والأمان
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">المصادقة الثنائية</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تفعيل المصادقة الثنائية لحسابك
                  </p>
                </div>
                <Switch checked={false} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">جلسات نشطة</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    عرض وإدارة الجلسات النشطة
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  عرض الجلسات
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">حذف الحساب</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    حذف الحساب نهائياً
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                  حذف الحساب
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 