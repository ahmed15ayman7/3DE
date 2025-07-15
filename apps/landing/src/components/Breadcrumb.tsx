'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
  separator?: ReactNode;
  className?: string;
  showHome?: boolean;
  autoGenerate?: boolean;
}

const pathNameMap: Record<string, string> = {
  '': 'الرئيسية',
  'about-us': 'من نحن',
  'courses': 'الكورسات',
  'instructors': 'المحاضرون',
  'our-academy': 'الأكاديمية',
  'blogs': 'المدونة',
  'events': 'الفعاليات',
  'contact-us': 'تواصل معنا',
  'support': 'الدعم الفني',
  'login': 'تسجيل الدخول',
  'register': 'التسجيل',
  'terms': 'الشروط والأحكام',
  'privacy': 'سياسة الخصوصية',
};

export default function Breadcrumb({
  items,
  homeLabel = 'الرئيسية',
  separator,
  className = '',
  showHome = true,
  autoGenerate = true,
}: BreadcrumbProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    if (!autoGenerate || pathname === '/') return [];

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home
    if (showHome) {
      breadcrumbs.push({
        label: homeLabel,
        href: '/',
        icon: <Home size={16} />,
      });
    }

    // Add path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: pathNameMap[segment] || segment,
        href: isLast ? undefined : currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  const defaultSeparator = <ChevronLeft size={16} className="text-gray-400 mx-2" />;

  return (
    <nav
      className={`bg-gray-50 border-b border-gray-100 ${className}`}
      aria-label="مسار التنقل"
    >
      <div className="container py-4">
        <ol className="flex items-center gap-1 gap-reverse text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <motion.li
                key={`${item.href || 'current'}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center"
              >
                {/* Separator */}
                {index > 0 && (
                  <span className="select-none" aria-hidden="true">
                    {separator || defaultSeparator}
                  </span>
                )}

                {/* Breadcrumb Item */}
                {item.href && !item.current ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 gap-reverse text-text-secondary hover:text-primary-main transition-colors duration-200 font-medium"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1 gap-reverse font-medium ${
                      item.current 
                        ? 'text-primary-main' 
                        : 'text-text-secondary'
                    }`}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
} 