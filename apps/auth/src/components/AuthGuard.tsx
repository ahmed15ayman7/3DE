'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@3de/auth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/signin'
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // إذا لم يكن المستخدم مسجل الدخول
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // إذا كان هناك أدوار مسموحة، تحقق من دور المستخدم
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // توجيه المستخدم حسب دوره
        switch (user.role) {
          case 'STUDENT':
            router.push('/student');
            break;
          case 'INSTRUCTOR':
            router.push('/instructor');
            break;
          case 'ADMIN':
            router.push('/admin');
            break;
          case 'ACADEMY':
            router.push('/academy');
            break;
          case 'PARENT':
            router.push('/parent');
            break;
          default:
            router.push('/student');
        }
      }
    }
  }, [user, isLoading, allowedRoles, redirectTo, router]);

  // إذا كان يتم تحميل حالة المصادقة
  if (isLoading) {
    return <LoadingSpinner message="جاري التحقق من الصلاحيات..." />;
  }

  // إذا لم يكن المستخدم مسجل الدخول
  if (!user) {
    return <LoadingSpinner message="جاري التوجيه..." />;
  }

  // إذا كان المستخدم لا يملك الصلاحيات المطلوبة
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <LoadingSpinner message="جاري التوجيه..." />;
  }

  // إذا كان كل شيء على ما يرام، اعرض المحتوى
  return <>{children}</>;
}; 