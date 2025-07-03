"use client"
import React, { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@/components/layout/Navbar'), { loading: () => <div>جاري التحميل...</div> });
const Footer = dynamic(() => import('@/components/layout/Footer'), { loading: () => <div>جاري التحميل...</div> });
import { layoutsConfig } from '@/config/layouts';
import { useRouter } from 'next/navigation';

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, status } = useUser();
    const router = useRouter();
    useEffect(() => {
        if ((!user || user.role !== 'PARENT') && status === 'authenticated') {
            router.replace('/auth/signin');
        }
    }, [user, status]);


    const layoutConfig = layoutsConfig.parent;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar
                links={layoutConfig.navbarLinks}
                role={user?.role}
              
                user={user}
                showNotifications={layoutConfig.showNotifications ?? false}
                showProfile={layoutConfig.showProfile ?? false}
                showSearch={layoutConfig.showSearch ?? false}
            // showLanguageSwitcher={layoutConfig.showLanguageSwitcher ?? false}
            // showThemeSwitcher={layoutConfig.showThemeSwitcher}
            />
            <main className="flex-1">{children}</main>
            <Footer links={layoutConfig.footerLinks} />
        </div>
    );
} 