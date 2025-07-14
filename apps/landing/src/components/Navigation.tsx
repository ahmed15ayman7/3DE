'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  BookOpen, 
  Users, 
  Calendar,
  MessageCircle,
  HelpCircle,
  LogIn
} from 'lucide-react';
import { Button } from '@3de/ui';

const navigationItems = [
  {
    href: '/',
    label: 'الرئيسية',
    icon: null,
  },
  {
    href: '/about-us',
    label: 'من نحن',
    icon: null,
  },
  {
    href: '/courses',
    label: 'الكورسات',
    icon: BookOpen,
  },
  {
    href: '/instructors',
    label: 'المحاضرون',
    icon: Users,
  },
  {
    href: '/academy',
    label: 'الأكاديمية',
    icon: null,
  },
  {
    href: '/blogs',
    label: 'المدونة',
    icon: null,
  },
  {
    href: '/events',
    label: 'الفعاليات',
    icon: Calendar,
  },
  {
    href: '/contact-us',
    label: 'تواصل معنا',
    icon: MessageCircle,
  },
  {
    href: '/support',
    label: 'الدعم',
    icon: HelpCircle,
  },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">3DE</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-text-primary">أكاديمية 3DE</h1>
                <p className="text-xs text-text-secondary">نحو تعليم رقمي متميز</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigationItems.slice(0, 7).map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`nav-link flex items-center gap-1 ${
                      isActiveLink(item.href) ? 'active' : ''
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}

            {/* More Menu */}
            <div className="relative group">
              <button className="nav-link flex items-center gap-1">
                <span>المزيد</span>
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  {navigationItems.slice(7).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 gap-reverse px-4 py-3 text-sm text-text-secondary hover:text-primary-main hover:bg-gray-50 transition-colors duration-200 ${
                          isActiveLink(item.href) ? 'text-primary-main bg-primary-50' : ''
                        }`}
                      >
                        {Icon && <Icon size={16} />}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-4"
          >
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-text-secondary hover:text-primary-main">
                <LogIn size={16} className="ml-1" />
                دخول
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                تسجيل مجاني
              </Button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-text-secondary hover:text-primary-main transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md"
            >
              <div className="py-6 space-y-4">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 gap-reverse px-4 py-3 text-text-secondary hover:text-primary-main hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
                          isActiveLink(item.href) ? 'text-primary-main bg-primary-50' : ''
                        }`}
                      >
                        {Icon && <Icon size={20} />}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
                
                <div className="px-4 pt-4 border-t border-gray-100 space-y-3">
                  <Link href="/auth/signin" className="block w-full">
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      <LogIn size={16} className="ml-1" />
                      دخول
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block w-full">
                    <Button size="sm" className="w-full justify-center bg-gradient-primary hover:opacity-90">
                      تسجيل مجاني
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
} 