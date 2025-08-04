'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Phone, 
  HelpCircle, 
  MessageSquare,
  User,
  BookOpen,
  ChevronRight,
  Home,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  UserCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '@3de/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// Utility function to combine class names
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface SidebarProps {
  className?: string;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

interface MenuItem {
  title: string;
  icon: any;
  href: string;
  count?: number;
}

const menuItems: MenuItem[] = [
  { title: 'الرئيسية', icon: Home, href: '/' },
  { title: 'إدارة المجتمعات', icon: Users, href: '/groups' },
  { title: 'إدارة الطلاب', icon: GraduationCap, href: '/students' },
  { title: 'إدارة المحاضرين', icon: UserCheck, href: '/instructors' },
  { title: 'المقالات', icon: BookOpen, href: '/posts' },
  { title: 'الفعاليات', icon: Calendar, href: '/events' },
  { title: 'جهات الاتصال', icon: Phone, href: '/contacts' },
  { title: 'المجتمعات', icon: MessageSquare, href: '/communities' },
  { title: 'الإشعارات', icon: Bell, href: '/notifications' }, 
  // { title: 'الدعم', icon: HelpCircle, href: '/support' },
  // { title: 'الإحصائيات', icon: BarChart3, href: '/analytics' },
  // { title: 'الإعدادات', icon: Settings, href: '/settings' },
];

export default function Sidebar({ className,isExpanded,setIsExpanded }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
       logout();
    router.push('/auth/signin');
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' },
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '100%' },
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className={cn(
          "hidden md:flex flex-col bg-white border-l border-gray-200 shadow-lg h-screen fixed right-0 top-0 z-40",
          className
        )}
        variants={sidebarVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isExpanded && (
              <div className="flex items-center gap-3 gap-reverse">
                 <div className="w-16 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">3DE</span>
              </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">العلاقات العامة</h2>
                  <p className="text-sm text-gray-500">لوحة التحكم</p>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                             <ChevronRight 
                 className={cn(
                   "w-5 h-5 text-gray-600 transition-transform duration-300",
                   isExpanded ? "rotate-180" : "rotate-0"
                 )}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||( pathname.startsWith(item.href) && item.href !== '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-50 text-primary-main border-r-2 border-primary-main" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-main"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="mr-3 font-medium">{item.title}</span>
                )}
                {item.count && isExpanded && (
                  <span className="mr-auto bg-blue-100 text-primary-main text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          {isExpanded && user && (
            <div className="mb-4">
              <div className="flex items-center gap-3 gap-reverse">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-main to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.firstName?.charAt(0) || 'م'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full",
              !isExpanded && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {isExpanded && <span className="mr-3">تسجيل الخروج</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 right-4 z-50 p-3 bg-white rounded-lg shadow-lg border"
      >
        <ChevronRight 
          className={cn(
            "w-6 h-6 text-gray-600 transition-transform duration-300",
            isMobileOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 gap-reverse">
                    <div className="w-10 h-10 bg-primary-main rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">3DE</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">العلاقات العامة</h2>
                      <p className="text-sm text-gray-500">لوحة التحكم</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center p-4 rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-blue-50 text-primary-main" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary-main"
                      )}
                    >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <span className="mr-4 font-medium">{item.title}</span>
                      {item.count && (
                        <span className="mr-auto bg-blue-100 text-primary-main text-xs px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* User Info */}
              <div className="p-6 border-t border-gray-200">
                {user && (
                  <div className="mb-4">
                    <div className="flex items-center gap-4 gap-reverse">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-main to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.firstName?.charAt(0) || 'م'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center p-4 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="mr-4 font-medium">تسجيل الخروج</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 