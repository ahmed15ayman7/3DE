'use client';
import React, { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { layoutsConfig } from '@/config/layouts';
import { useRouter } from 'next/navigation';

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, status } = useUser();
    let router = useRouter()

    // if (loading) {
    //     return <div></div>;
    // }
    useEffect(() => {
        if ((!user || user.role !== 'INSTRUCTOR') && status === 'authenticated') {
            router.replace('/auth/signin');
        }
    }, [user, status]);

    const layoutConfig = layoutsConfig.instructor;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar
                role={user?.role}
                links={layoutConfig.navbarLinks}
                user={user}
                showNotifications={layoutConfig.showNotifications ?? false}
                showProfile={layoutConfig.showProfile ?? false}
                showSearch={layoutConfig.showSearch ?? false}
            // showLanguageSwitcher={layoutConfig.showLanguageSwitcher ?? false}
            // showThemeSwitcher={layoutConfig.showThemeSwitcher ?? false}
            />
            <main className="flex-1">{children}</main>
            <Footer links={layoutConfig.footerLinks} />
        </div>
    );
} 