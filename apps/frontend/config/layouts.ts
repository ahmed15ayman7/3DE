import { UserLayoutConfig } from '@/types/user';

export const layoutsConfig: UserLayoutConfig = {
    student: {
        navbarLinks: [
            {
                label: 'الرئيسية',
                href: '/student/dashboard',
                icon: 'home',
            },
            {
                label: 'مساراتي',
                href: '/student/paths',
                icon: 'book',
            },
            {
                label: 'كورساتي',
                href: '/student/courses',
                icon: 'school',
            },
            {
                label: 'شهاداتي',
                href: '/student/certificates',
                icon: 'award',
            },
            {
                label: 'المجتمع',
                href: '/student/community',
                icon: 'users',
            },
            {
                label: 'اختباراتي',
                href: '/student/quizzes',
                icon: 'clipboard-check',
            },
        ],
        footerLinks: {
            quickLinks: {
                label: 'الرئيسية',
                links: [
                    {
                        label: 'الرئيسية',
                        href: '/student/dashboard',
                    },
                    {
                        label: 'الدعم الفني',
                        href: '/privacy',
                    },
                    {
                        label: 'سياسة الخصوصية',
                        href: '/privacy',
                    },
                    {
                        label: 'الشروط والأحكام',
                        href: '/terms',
                    },
                ]
            },
            support: {
                label: 'الدعم الفني',
                links: [
                    {
                        label: 'الدعم الفني',
                        href: '/support',
                    },
                ]
            }
        },
        showNotifications: true,
        showProfile: true,
        showSearch: true,
        showLanguageSwitcher: true,
        showThemeSwitcher: true,
    },
    instructor: {
        navbarLinks: [
            {
                label: 'الرئيسية',
                href: '/instructor/dashboard',
                icon: 'home',
            },
            {
                label: 'إدارة دوراتي',
                href: '/instructor/courses',
                icon: 'book',
            },
            {
                label: 'الطلاب',
                href: '/instructor/students',
                icon: 'users',
            },
            // {
            //     label: 'تجهيز كورس',
            //     href: '/instructor/course-builder',
            //     icon: 'plus-circle',
            // },
            {
                label: 'تتبع الحضور',
                href: '/instructor/attendance',
                icon: 'clipboard-check',
            },
            // {
            //     label: 'المتابعة اليومية',
            //     href: '/instructor/daily-tracking',
            //     icon: 'clipboard-check',
            // },
            {
                label: 'الاختبارات',
                href: '/instructor/quizzes',
                icon: 'clipboard-check',
            },
        ],
        footerLinks: {
            quickLinks: {
                label: 'الرئيسية',
                links: [
                    {
                        label: 'الرئيسية',
                        href: '/',
                    },
                ]
            },
            support: {
                label: 'سياسة الخصوصية',
                links: [
                    {
                        label: 'سياسة الخصوصية',
                        href: '/privacy',
                    },
                ]
            }
        },
        showNotifications: true,
        showProfile: true,
        showSearch: true,
        showLanguageSwitcher: true,
        showThemeSwitcher: true,
    },
    parent: {
        navbarLinks: [
            {
                label: 'الرئيسية',
                href: '/parent/dashboard',
                icon: 'home',
            },
            {
                label: 'المتابعة اليومية',
                href: '/parent/daily-tracking',
                 icon: 'clipboard-check',
             },
            {
                label: 'تقارير الأداء',
                href: '/parent/reports',
                icon: 'chart-bar',
            },
            {
                label: 'إشعارات الغياب',
                href: '/parent/absences',
                icon: 'bell',
            },
            {
                label: 'المحاضرين',
                href: '/parent/teachers',
                icon: 'bell',
            },
            {
                label: 'تواصل مع الإدارة',
                href: '/parent/contact',
                icon: 'message-square',
            },
        ],
        footerLinks: {
            quickLinks: {
                label: 'الدعم الفني',
                links: [
                    {
                        label: 'الدعم الفني',
                        href: '/support',
                    },
                ]
            },
            support: {
                label: 'سياسة الخصوصية',
                links: [
                    {
                        label: 'سياسة الخصوصية',
                        href: '/privacy',
                    },
                ]
            }
        },
        showNotifications: true,
        showProfile: true,
        showSearch: false,
        showLanguageSwitcher: true,
        showThemeSwitcher: true,
    },
    admin: {
        navbarLinks: [
            {
                label: 'لوحة التحكم',
                href: '/admin/dashboard',
                icon: 'home',
            },
            {
                label: 'إدارة المستخدمين',
                href: '/admin/users',
                icon: 'users',
            },
            {
                label: 'الإدارة المالية',
                href: '/admin/finance',
                icon: 'dollar-sign',
            },
            {
                label: 'الإشعارات العامة',
                href: '/admin/notifications',
                icon: 'bell',
            },
            {
                label: 'التقارير',
                href: '/admin/reports',
                icon: 'file-text',
            },
        ],
        footerLinks: {
            quickLinks: {
                label: 'الدعم الفني',
                links: [
                    {
                        label: 'الدعم الفني',
                        href: '/support',
                    },
                    {
                        label: 'سياسة الخصوصية',
                        href: '/privacy',
                    },
                ]
            },
            support: {
                label: 'سياسة الخصوصية',
                links: [
                    {
                        label: 'سياسة الخصوصية',
                        href: '/privacy',
                    },
                ]
            }
        },
        showNotifications: true,
        showProfile: true,
        showSearch: true,
        showLanguageSwitcher: true,
        showThemeSwitcher: true,
    },
    academy: {
        navbarLinks: [
            {
                label: 'إدارة الفرق',
                href: '/academy/teams',
                icon: 'users',
            },
            {
                label: 'تقارير المدارس',
                href: '/academy/schools',
                icon: 'file-text',
            },
            {
                label: 'الأحداث',
                href: '/academy/events',
                icon: 'calendar',
            },
            {
                label: 'الإحصائيات',
                href: '/academy/statistics',
                icon: 'bar-chart-2',
            },
        ],
        footerLinks: {
            quickLinks: {
                label: 'الدعم الفني',
                links: [
                    {
                        label: 'الدعم الفني',
                        href: '/support',
                    },
                ]
            },
            support: {
                label: 'سياسة الخصوصية',
                links: [
                    {
                        label: 'سياسة الخصوصية',
                        href: '/privacy',
                    },
                ]
            }
        },
        showNotifications: true,
        showProfile: true,
        showSearch: true,
        showLanguageSwitcher: true,
        showThemeSwitcher: true,
    },
}; 