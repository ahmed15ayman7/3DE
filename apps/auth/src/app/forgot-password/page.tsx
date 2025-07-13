'use client';

import React, { useEffect } from 'react';
import { AuthForm } from '../../components/AuthForm';
import { AuthLayout } from '../../components/AuthLayout';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '@3de/auth';

export default function ForgotPasswordPage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // إذا كان المستخدم مسجل الدخول بالفعل، قم بتحويله
    if (user && !isLoading) {
      switch (user.role) {
        case 'STUDENT':
          window.location.href = '/student';
          break;
        case 'INSTRUCTOR':
          window.location.href = '/instructor';
          break;
        case 'ADMIN':
          window.location.href = '/admin';
          break;
        case 'ACADEMY':
          window.location.href = '/academy';
          break;
        case 'PARENT':
          window.location.href = '/parent';
          break;
        default:
          ;
      }
    }
  }, [user, isLoading]);

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
      title="نسيت كلمة المرور؟"
      subtitle="أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور"
    >
      <AuthForm type="forgot-password" />
    </AuthLayout>
  );
} 