"use client";

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { profileApi, userApi } from '@/lib/api';
import { LoginDevice, LoginHistory, TwoFactor, User, UserRole } from '@shared/prisma';
import { motion } from 'framer-motion';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div>جاري التحميل...</div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div>جاري التحميل...</div> });
const Tabs = dynamic(() => import('@/components/common/Tabs'), { loading: () => <div>جاري التحميل...</div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div>جاري التحميل...</div> });
const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { loading: () => <div>جاري التحميل...</div> });
const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div>جاري التحميل...</div> });
const Input = dynamic(() => import('@/components/common/Input'), { loading: () => <div>جاري التحميل...</div> });
const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div>جاري التحميل...</div> });

const initialProfileData: User & { loginHistory: LoginHistory[], twoFactor: TwoFactor } = {
    id: '',
    email: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
    role: UserRole.STUDENT,
    subRole: '',
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    academyId: '',
    isOnline: false,
    isVerified: false,
    age: 0,
    loginHistory: [],
    twoFactor: {
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '',
        email: false,
        sms: false,
        authenticator: false,
        secret: '',
    },
};

export default function StudentProfile() {
    const { user, status } = useUser();
    const [profileData, setProfileData] = useState(initialProfileData);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // استعلامات البيانات
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => userApi.getProfile(user?.id),
        enabled: !!user,
    });

    // طلب تحديث البيانات
    const { mutate: updateProfile } = useMutation({
        mutationFn: (data: any) => userApi.updateProfile(data),
    });

    // طلب تغيير كلمة المرور
    const { mutate: changePassword } = useMutation({
        mutationFn: (data: any) => userApi.changePassword(data),
        onSuccess: () => setShowPasswordModal(false)
    });

    // طلب تحديث التحقق الثنائي
    const { mutate: update2FA } = useMutation({
        mutationFn: (data: any) => userApi.updateTwoFactor(user?.id, data),
        onSuccess: () => setShow2FAModal(false)
    });

    useEffect(() => {
        if (profile) setProfileData((prev) => ({ ...prev, ...profile }));
    }, [profile]);

    if (isLoadingProfile || status === "loading") {
        return (
            <div className="space-y-6">
                <Skeleton height={200} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton height={300} />
                    <Skeleton height={300} />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* ملخص الحساب */}
            <Card title="ملخص الحساب">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <Avatar src={profileData?.avatar || ''} size="xl" />
                        <Badge
                            variant={profileData?.isOnline ? 'standard' : 'dot'}
                            color={profileData?.isOnline ? 'success' : 'primary'}
                            className="absolute -bottom-2 -right-2"
                        >
                            <span className="text-xs text-secondary-main ">
                                {profileData?.isOnline ? 'نشط' : 'غير نشط'}
                            </span>
                        </Badge>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{profileData?.firstName} {profileData?.lastName}</h2>
                        <p className="text-gray-600">{profileData?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="standard" color={profileData?.isVerified ? 'success' : 'warning'}>
                                <span>{profileData?.isVerified ? 'موثق' : 'غير موثق'}</span>
                            </Badge>
                            <Badge variant="standard" color="info">
                                <span>{profileData?.role === 'STUDENT' ? 'طالب' : profileData?.role}</span>
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                tabs={[
                    {
                        value: 0,
                        label: 'البيانات الشخصية',
                        content: (
                            <Card title="البيانات الشخصية">
                                <div className="space-y-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Input label="الاسم الأول" value={profileData.firstName} onChange={() => {}} readOnly />
                                        <Input label="الاسم الأخير" value={profileData.lastName} onChange={() => {}} readOnly />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Input label="البريد الإلكتروني" value={profileData.email} onChange={() => {}} readOnly />
                                        <Input label="رقم الجوال" value={profileData.phone || ''} onChange={() => {}} readOnly />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Input label="الدور" value={profileData.role} onChange={() => {}} readOnly />
                                        <Input label="العمر" value={profileData.age?.toString() || ''} onChange={() => {}} readOnly />
                                    </div>
                                </div>
                            </Card>
                        )
                    },
                    {
                        value: 1,
                        label: 'تاريخ الدخول',
                        content: (
                            <Card title="تاريخ الدخول">
                                <div className="space-y-2">
                                    {(profileData.loginHistory ?? []).length === 0 && <p className="text-gray-500">لا يوجد سجل دخول</p>}
                                    {(profileData.loginHistory ?? []).map((item, idx) => (
                                        <div key={idx} className="p-2 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center gap-2">
                                            <span className="text-sm text-gray-700">{item.location} - {item.browser} - {item.os}</span>
                                            <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString('ar-EG')}</span>
                                            <Badge variant="dot" color={item.success ? 'success' : 'error'}>
                                                <span>{item.success ? 'ناجح' : 'فشل'}</span>
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )
                    },
                    {
                        value: 2,
                        label: 'التحقق الثنائي',
                        content: (
                            <Card title="التحقق الثنائي">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Badge variant="dot" color={profileData.twoFactor.email ? 'success' : 'error'}>
                                            <span>البريد الإلكتروني</span>
                                        </Badge>
                                        <Badge variant="dot" color={profileData.twoFactor.sms ? 'success' : 'error'}>
                                            <span>رسالة نصية</span>
                                        </Badge>
                                        <Badge variant="dot" color={profileData.twoFactor.authenticator ? 'success' : 'error'}>
                                            <span>تطبيق المصادقة</span>
                                        </Badge>
                                    </div>
                                    <Button variant="outline" onClick={() => setShow2FAModal(true)}>
                                        إدارة التحقق الثنائي
                                    </Button>
                                </div>
                            </Card>
                        )
                    },
                ]}
            />
        </motion.div>
    );
}