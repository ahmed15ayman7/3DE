'use client';

import { useEffect } from 'react';
import { Button } from '@3de/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-6xl font-bold text-red-500 mb-4">خطأ</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">حدث خطأ غير متوقع</h1>
        <p className="text-gray-600 mb-8">
          عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى
        </p>
        <div className="gap-4">
          <Button onClick={reset}>
            إعادة المحاولة
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
} 