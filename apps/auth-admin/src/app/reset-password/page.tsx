'use client';

import React, { useEffect, Suspense } from 'react';
import { AuthForm } from '../../components/AuthForm';
import { AuthLayout } from '../../components/AuthLayout';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '@3de/auth';
import { useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

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

  // إذا لم يكن هناك توكن، اعرض رسالة خطأ
  if (!token) {
    return (
      <AuthLayout 
        title="رابط غير صحيح"
        subtitle="رابط إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <p className="text-red-600 mb-4">رابط إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية</p>
          <a 
            href="/forgot-password" 
            className="text-primary-main hover:text-primary-dark font-medium"
          >
            طلب رابط جديد
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="إعادة تعيين كلمة المرور"
      subtitle="أدخل كلمة المرور الجديدة"
    >
      <AuthForm type="reset-password" token={token} />
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="جاري التحميل..." />}>
      <ResetPasswordContent />
    </Suspense>
  );
} 