"use client";
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import { userApi } from '@/lib/api';
import { User } from '@shared/prisma';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div /> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div /> });
const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div /> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });

export default function SecurityTab() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    let { user, status } = useUser();
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => userApi.getProfile(user?.id),
    });
    if (isLoadingProfile || status === 'loading') {
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
        <div className="space-y-6">
            <Card title="الأمان">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold">كلمة المرور</h3>
                        <p className="text-gray-600">قم بتغيير كلمة المرور الخاصة بك</p>
                    </div>
                    <Button
                        variant="default"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        تغيير كلمة المرور
                    </Button>
                </div>
            </Card>
            <Card title="التحقق الثنائي">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold">التحقق الثنائي</h3>
                        <p className="text-gray-600">قم بتفعيل التحقق الثنائي لحماية حسابك</p>
                    </div>
                    <Button
                        variant="default"
                        onClick={() => setShow2FAModal(true)}
                    >
                        إعداد التحقق الثنائي
                    </Button>
                </div>
            </Card>
            <Card title="سجل الدخول">
                <h3 className="text-lg font-bold mb-4">سجل الدخول</h3>
                <div className="space-y-4">
                    {profile?.data?.loginHistory?.map((login: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">{login.ip}</p>
                                <p className="text-sm text-gray-600">{login.createdAt.toLocaleString()}</p>
                            </div>
                            <Badge variant={login.success ? 'standard' : 'dot'} color={login.success ? 'success' : 'error'}>
                                <span className="text-xs">
                                    {login.success ? 'ناجح' : 'فاشل'}
                                </span>
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>
            {/* يمكن إضافة Modals هنا عند الحاجة */}
        </div>
    );
} 