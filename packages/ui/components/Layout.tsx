import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">منصة 3DE التعليمية</h1>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white shadow-sm mt-auto">
          <div className="px-6 py-4 text-center text-gray-600">
            <p>© 2024 منصة 3DE التعليمية. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}; 