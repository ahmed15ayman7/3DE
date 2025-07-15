'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  HelpCircle,
  Shield,
  FileText,
  ChevronUp
} from 'lucide-react';
import { Button } from '@3de/ui';

const footerLinks = {
  company: [
    { href: '/about-us', label: 'من نحن', icon: null },
    { href: '/our-academy', label: 'الأكاديمية', icon: null },
    { href: '/instructors', label: 'المحاضرون', icon: Users },
    { href: '/blogs', label: 'المدونة', icon: null },
    { href: '/contact-us', label: 'تواصل معنا', icon: MessageCircle },
  ],
  services: [
    { href: '/courses', label: 'الكورسات', icon: BookOpen },
    { href: '/events', label: 'الفعاليات', icon: Calendar },
    { href: '/support', label: 'الدعم الفني', icon: HelpCircle },
    { href: '/auth/signup', label: 'التسجيل', icon: null,isWindows: true },
    { href: '/auth/signin', label: 'تسجيل الدخول', icon: null,isWindows: true },
  ],
  legal: [
    { href: '/terms', label: 'الشروط والأحكام', icon: FileText },
    { href: '/privacy', label: 'سياسة الخصوصية', icon: Shield },
  ],
};

const socialLinks = [
  { href: 'https://facebook.com/3de', icon: Facebook, label: 'فيسبوك' },
  { href: 'https://twitter.com/3de', icon: Twitter, label: 'تويتر' },
  { href: 'https://instagram.com/3de', icon: Instagram, label: 'انستجرام' },
  { href: 'https://youtube.com/3de', icon: Youtube, label: 'يوتيوب' },
  { href: 'https://linkedin.com/company/3de', icon: Linkedin, label: 'لينكد إن' },
];

const contactInfo = [
  { icon: MapPin, label: '  بنها القليوبية مصر' },
  { icon: Phone, label: '+201097395678', href: 'tel:+201097395678' },
  { icon: Mail, label: 'info@3de.school', href: 'mailto:info@3de.school' },
  { icon: Globe, label: 'www.3de.school', href: 'https://3de.school' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary-main text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="bg-pattern h-full w-full"></div>
      </div>
      
      <div className="relative">
        {/* Main Footer */}
        <div className="container section">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 gap-reverse">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">3DE</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">أكاديمية 3DE</h3>
                  <p className="text-sm text-gray-300">نحو تعليم رقمي متميز</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                منصة تعليمية شاملة تهدف إلى تقديم تعليم رقمي متميز لجميع المراحل التعليمية 
                مع كوادر متخصصة وأحدث الأساليب التعليمية.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4 gap-reverse">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-white">الشركة</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 gap-reverse text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        {Icon && <Icon size={16} className="group-hover:text-primary-light" />}
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-white">الخدمات</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      {link.isWindows ? (
                        <a href={`https://3de.school${link.href}`} target="_blank" rel="noopener noreferrer">
                          <div className="flex items-center gap-2 gap-reverse text-gray-300 hover:text-white transition-colors duration-200 group">
                            {Icon && <Icon size={16} className="group-hover:text-primary-light" />}
                            <span>{link.label}</span>
                          </div>
                        </a>
                      ) : (
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 gap-reverse text-gray-300 hover:text-white transition-colors duration-200 group"
                      >
                        {Icon && <Icon size={16} className="group-hover:text-primary-light" />}
                        <span>{link.label}</span>
                      </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
              
              <div className="pt-4 space-y-3">
                <h5 className="text-sm font-medium text-gray-400">القانونية</h5>
                {footerLinks.legal.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 gap-reverse text-gray-300 hover:text-white transition-colors duration-200 group text-sm"
                    >
                      {Icon && <Icon size={14} className="group-hover:text-primary-light" />}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-semibold text-white">تواصل معنا</h4>
              <ul className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  const Component = info.href ? 'a' : 'div';
                  const props = info.href 
                    ? { href: info.href, ...(info.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
                    : {};
                  
                  return (
                    <motion.li
                      key={info.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Component
                        {...props}
                        className={`flex items-start gap-3 gap-reverse text-gray-300 ${
                          info.href ? 'hover:text-white transition-colors duration-200' : ''
                        }`}
                      >
                        <Icon size={18} className="mt-0.5 text-primary-light" />
                        <span className="text-sm leading-relaxed">{info.label}</span>
                      </Component>
                    </motion.li>
                  );
                })}
              </ul>
              
              {/* Newsletter */}
              <div className="pt-4">
                <h5 className="text-sm font-medium text-white mb-3">اشترك في النشرة البريدية</h5>
                <div className="flex gap-2 gap-reverse">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-main text-sm"
                  />
                  <Button size="sm" className="bg-primary-main hover:bg-primary-dark text-white">
                    اشتراك
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-gray-300 text-sm text-center md:text-right"
              >
                © {new Date().getFullYear()} أكاديمية 3DE. جميع الحقوق محفوظة.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 gap-reverse text-sm text-gray-300"
              >
                <span>صُنع بـ ❤️ في  مصر</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-6 left-6 w-12 h-12 bg-primary-main hover:bg-primary-dark rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          aria-label="العودة إلى الأعلى"
        >
          <ChevronUp size={20} className="text-white" />
        </motion.button>
      </div>
    </footer>
  );
} 