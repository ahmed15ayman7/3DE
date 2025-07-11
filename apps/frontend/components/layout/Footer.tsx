import React from 'react';
import Link from 'next/link';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    Linkedin as LinkedInIcon,
    Youtube as YouTubeIcon,
} from 'lucide-react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

const Footer: React.FC<{ links: { quickLinks: { label: string; links: Array<{ label: string; href: string }> }; support: { label: string; links: Array<{ label: string; href: string }> } } }> = ({ links }) => {
    const currentYear = new Date().getFullYear();

    return (
        <LazyMotion features={domAnimation}>
            <m.footer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-primary text-white py-12"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* معلومات الشركة */}
                        <div className="md:col-span-4">
                            <h3 className="text-xl font-bold mb-4">
                                من نحن
                            </h3>
                            <p className="mb-4 text-gray-200">
                                3DE - اتعلم معنا
                            </p>
                            <div className="flex space-x-4 rtl:space-x-reverse">
                                <button
                                    className="text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                                    aria-label="Facebook"
                                >
                                    <FacebookIcon className="h-5 w-5" />
                                </button>
                                <button
                                    className="text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                                    aria-label="Twitter"
                                >
                                    <TwitterIcon className="h-5 w-5" />
                                </button>
                                <button
                                    className="text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                                    aria-label="Instagram"
                                >
                                    <InstagramIcon className="h-5 w-5" />
                                </button>
                                <button
                                    className="text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                                    aria-label="LinkedIn"
                                >
                                    <LinkedInIcon className="h-5 w-5" />
                                </button>
                                <button
                                    className="text-gray-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                                    aria-label="YouTube"
                                >
                                    <YouTubeIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* روابط سريعة */}
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-bold mb-4">
                                {links.quickLinks.label}
                            </h3>
                            <div className="flex flex-col space-y-2">
                                {links.quickLinks.links.map((link, i) => (
                                    <Link
                                        href={link.href}
                                        key={i}
                                        className="text-gray-200 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* الدعم */}
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-bold mb-4">
                                {links.support.label}
                            </h3>
                            <div className="flex flex-col space-y-2">
                                {links.support.links.map((link, i) => (
                                    <Link
                                        href={link.href}
                                        key={i}
                                        className="text-gray-200 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* اتصل بنا */}
                        <div className="md:col-span-4">
                            <h3 className="text-xl font-bold mb-4">
                                اتصل بنا
                            </h3>
                            <div className="flex flex-col space-y-2">
                                <p className="text-gray-200">
                                    العنوان: شارع الملك فهد، الرياض، المملكة العربية السعودية
                                </p>
                                <p className="text-gray-200">
                                    الهاتف: +966 11 123 4567
                                </p>
                                <p className="text-gray-200">
                                    البريد الإلكتروني: info@3de.edu.sa
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* حقوق النشر */}
                    <div className="mt-12 pt-8 border-t border-gray-600">
                        <p className="text-center text-gray-200">
                            © {currentYear} جميع الحقوق محفوظة لشركة 3DE التعليمية
                        </p>
                    </div>
                </div>
            </m.footer>
        </LazyMotion>
    );
};

export default Footer; 