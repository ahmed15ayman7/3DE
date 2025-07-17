'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@3de/auth';
import Layout from '../../components/layout/Layout';
import { Button, Card, Switch, Skeleton } from '@3de/ui';
import { Bell, Shield, Palette, Globe, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      allowMessages: true,
    },
    appearance: {
      theme: 'light',
      language: 'ar',
      fontSize: 'medium',
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-600">
            تخصيص تجربتك التعليمية وإدارة إعدادات حسابك
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-primary-main" />
                <h2 className="text-lg font-semibold text-gray-900">التنبيهات</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">تنبيهات البريد الإلكتروني</p>
                    <p className="text-sm text-gray-500">استلام تنبيهات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(checked:boolean) => handleSettingChange('notifications', 'email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">تنبيهات الموقع</p>
                    <p className="text-sm text-gray-500">استلام تنبيهات في المتصفح</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(checked:boolean) => handleSettingChange('notifications', 'push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">تنبيهات الرسائل النصية</p>
                    <p className="text-sm text-gray-500">استلام تنبيهات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={(checked:boolean) => handleSettingChange('notifications', 'sms', checked)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary-main" />
                <h2 className="text-lg font-semibold text-gray-900">الخصوصية</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رؤية الملف الشخصي
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="public">عام</option>
                    <option value="private">خاص</option>
                    <option value="friends">الأصدقاء فقط</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">إظهار التقدم</p>
                    <p className="text-sm text-gray-500">السماح للآخرين برؤية تقدمك</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showProgress}
                    onChange={(checked:boolean) => handleSettingChange('privacy', 'showProgress', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">السماح بالرسائل</p>
                    <p className="text-sm text-gray-500">السماح للآخرين بإرسال رسائل لك</p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowMessages}
                    onChange={(checked:boolean) => handleSettingChange('privacy', 'allowMessages', checked)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-primary-main" />
                <h2 className="text-lg font-semibold text-gray-900">المظهر</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المظهر
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.appearance.theme === 'light' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                    >
                      <Sun className="w-4 h-4" />
                      فاتح
                    </Button>
                    <Button
                      variant={settings.appearance.theme === 'dark' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                    >
                      <Moon className="w-4 h-4" />
                      داكن
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللغة
                  </label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حجم الخط
                  </label>
                  <select
                    value={settings.appearance.fontSize}
                    onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="small">صغير</option>
                    <option value="medium">متوسط</option>
                    <option value="large">كبير</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Account */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-primary-main" />
                <h2 className="text-lg font-semibold text-gray-900">الحساب</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">البريد الإلكتروني</p>
                  <p className="font-medium">{user?.email || 'غير محدد'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">تاريخ الانضمام</p>
                  <p className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    تغيير كلمة المرور
                  </Button>
                  <Button variant="outline" className="w-full">
                    تصدير البيانات
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <Button size="lg">
            حفظ الإعدادات
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
} 