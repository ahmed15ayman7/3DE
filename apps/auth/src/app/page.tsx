'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // توجيه المستخدم إلى صفحة تسجيل الدخول
    router.push('/signin');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>جاري التوجيه...</p>
      </div>
    </div>
  );
}
