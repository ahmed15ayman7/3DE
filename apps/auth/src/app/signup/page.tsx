'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '../../components/AuthForm';
import { AuthLayout } from '../../components/AuthLayout';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '@3de/auth';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // إذا كان المستخدم مسجل الدخول بالفعل، قم بتحويله
    if (user && !isLoading) {
      switch (user.role) {
        case 'STUDENT':
          router.push('https://st.3de.school');
          break;
        case 'INSTRUCTOR':
          router.push('https://in.3de.school');
          break;
        case 'ADMIN':
          router.push('https://ad.3de.school');
          break;
        case 'ACADEMY':
          router.push('https://ac.3de.school');
          break;
        case 'PARENT':
          router.push('https://pa.3de.school');
          break;
        default:
          ;
      }
    }
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
      title="إنشاء حساب جديد"
      subtitle="انضم إلى منصة التعلم الإلكتروني المتقدمة"
    >
      <AuthForm type="signup" />
    </AuthLayout>
  );
} 