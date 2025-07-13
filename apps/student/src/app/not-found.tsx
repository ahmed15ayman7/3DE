'use client';

import Link from 'next/link';
import { Button } from '@3de/ui';

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary-main mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <div className="space-x-4">
          <Link href="/">
            <Button>العودة للرئيسية</Button>
          </Link>
          <Button variant="outline" onClick={handleGoBack}>
            العودة للصفحة السابقة
          </Button>
        </div>
      </div>
    </div>
  );
} 