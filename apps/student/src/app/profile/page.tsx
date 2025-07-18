'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@3de/auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userApi } from '@3de/apis';
import Layout from '../../components/layout/Layout';
import { Button, Card, Avatar, Progress, Skeleton } from '@3de/ui';
import { User as UserIcon, Mail, Phone, Calendar, MapPin, Edit, Save, X } from 'lucide-react';
import { User } from '@3de/interfaces';
import { sanitizeApiResponse } from '../../lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // bio: '',
    // location: '',
  });

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await userApi.getProfile(user?.id || "");
      return sanitizeApiResponse(response);
    },
  });

  const profile = (profileResponse as any)?.data;

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => userApi.update(user?.id || "", data),
    onSuccess: () => {
      setIsEditing(false);
      // Refetch profile data
    },
  });

  const handleEdit = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    //   bio: profile?.bio || '',
    //   location: profile?.location || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // تحويل التاريخ إلى string إذا كان Date object
  const formatDate = (date: any) => {
    if (!date) return 'غير محدد';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('ar-EG');
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('ar-EG');
    }
    return 'غير محدد';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-main to-secondary-main rounded-xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <Avatar
              src={profile?.avatar || user?.avatar}
              alt={profile?.firstName + ' ' + profile?.lastName || user?.firstName + ' ' + user?.lastName || ''}
              size="xl"
              className="w-20 h-20"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                {profile?.firstName + ' ' + profile?.lastName || user?.firstName + ' ' + user?.lastName || 'الطالب'}
              </h1>
              {/* <p className="text-white/90">
                {profile?.bio || 'طالب في منصة 3DE التعليمية'}
              </p> */}
            </div>
            <Button
              variant="outline"
              onClick={isEditing ? handleSave : handleEdit}
              disabled={updateProfileMutation.isPending}
              loading={updateProfileMutation.isPending}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? 'حفظ' : 'تعديل'}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4" />
                إلغاء
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                        placeholder="الاسم"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">الاسم</p>
                        <p className="font-medium">{profile?.firstName  || 'غير محدد'}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                        placeholder="الاسم"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">اللقب</p>
                        <p className="font-medium">{profile?.lastName || 'غير محدد'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                        placeholder="البريد الإلكتروني"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                        <p className="font-medium">{profile?.email || 'غير محدد'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                        placeholder="رقم الهاتف"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">رقم الهاتف</p>
                        <p className="font-medium">{profile?.phone || 'غير محدد'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                        placeholder="الموقع"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">الموقع</p>
                        <p className="font-medium">{profile?.location || 'غير محدد'}</p>
                      </div>
                    )}
                  </div>
                </div> */}

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                    <p className="font-medium">
                      {formatDate(profile?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Academic Progress */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">التقدم الأكاديمي</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">التقدم العام</span>
                    <span className="text-sm text-gray-500">
                      {(() => {
                        if (!profile?.enrollments?.length) return 0;
                        const totalProgress = profile.enrollments.reduce((acc: number, enrollment: any) => acc + (enrollment.progress || 0), 0);
                        return Math.round(totalProgress / profile.enrollments.length);
                      })()}%
                    </span>
                  </div>
                  <Progress 
                    value={(() => {
                      if (!profile?.enrollments?.length) return 0;
                      const totalProgress = profile.enrollments.reduce((acc: number, enrollment: any) => acc + (enrollment.progress || 0), 0);
                      return Math.round(totalProgress / profile.enrollments.length);
                    })()} 
                    className="h-2" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-main">
                      {profile?.enrollments?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">الكورسات المشترك فيها</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-main">
                      {profile?.enrollments?.filter((enrollment: any) => enrollment.progress === 100).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">الكورسات المكتملة</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-main">
                      {profile?.enrollments?.filter((enrollment: any) => enrollment.progress > 0 && enrollment.progress < 100).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">الكورسات قيد التقدم</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h2>
              
              <div className="space-y-4">
                {profile?.loginHistory?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-main rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.device}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">لا يوجد نشاط حديث</p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 