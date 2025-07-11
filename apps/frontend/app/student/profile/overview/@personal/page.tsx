"use client";
// Parallel Route: البيانات الشخصية
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import { userApi } from '@/lib/api';
import { User, LoginHistory, TwoFactor, UserRole } from '@shared/prisma';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div /> });
const Input = dynamic(() => import('@/components/common/Input'), { loading: () => <div /> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div /> });
const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div /> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () =><div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });

let getProfileData = async (id: string) => {
    let { success, data } = await userApi.getProfile(id);
    if (success) {
        return data;
    }
    return null;
};

export default function PersonalTab() {
    let { user, status } = useUser();
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfileData(user?.id),
    });
    const { mutate: updateProfile } = useMutation({
        mutationFn: (data: any) => userApi.updateProfile(data),
    });
    const [profileData, setProfileData] = useState<User>({
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
        <Card title="البيانات الشخصية">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="الاسم الكامل"
                        value={profileData?.firstName + ' ' + profileData?.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value.split(' ')[0], lastName: e.target.value.split(' ')[1] || '' }))}
                        required
                    />
                    <Input
                        label="البريد الإلكتروني"
                        value={profileData?.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        type="email"
                    />
                    <Input
                        label="رقم الهاتف"
                        value={profileData?.phone || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        type="tel"
                    />
                    <Input
                        label="العمر"
                        value={profileData?.age?.toString() || ''}
                        onChange={(e) => setProfileData(prev => ({ ...prev, age: +e.target.value }))}
                        type="number"
                    />
                </div>
                <div className="flex justify-center">
                    <Button variant="default" size="lg" onClick={() => updateProfile(profileData)}>
                        حفظ التغييرات
                    </Button>
                </div>
            </div>
        </Card>
    );
} 