'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '../../components/AuthForm';
import { AuthLayout } from '../../components/AuthLayout';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '@3de/auth';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@3de/apis';

export default function SignInPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // إذا كان المستخدم مسجل الدخول بالفعل، قم بتحويله
    let getAdminData=async()=>{
      const admin=user?.id? await adminAuthApi.getAdminByUserId(user?.id!) : null
      if (user && !isLoading && admin) {
        if (user.role === 'ADMIN' && admin?.AdminRole?.[0]?.name === 'ADMIN') {
          window.location.href = '/';
        } 
      }
    }
    getAdminData()
  }, [user, isLoading, router]);

  // إذا كان يتم تحميل حالة المصادقة، اعرض شاشة تحميل
  if (isLoading) {
    return <LoadingSpinner message="جاري التحقق من حالة تسجيل الدخول..." />;
  }

  // إذا كان المستخدم مسجل الدخول، لا تعرض الصفحة
  if (user) {
    return null;
  }

  return (
    <AuthLayout 
      title="تسجيل الدخول"
      subtitle="منصة التعلم الإلكتروني المتقدمة"
    >
      <AuthForm type="signin" />
    </AuthLayout>
  );
} 