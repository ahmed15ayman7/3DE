'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-500 mb-4">خطأ عام</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">حدث خطأ في التطبيق</h1>
            <p className="text-gray-600 mb-8">
              عذراً، حدث خطأ في التطبيق. يرجى إعادة تحميل الصفحة
            </p>
            <button
              onClick={reset}
              className="bg-primary-main hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 