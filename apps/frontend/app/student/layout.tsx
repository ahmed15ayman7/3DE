"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: false ,loading:()=>{
    return <div className="bg-white text-primary-dark shadow-navbar animate-pulse w-full h-[10vh]">
        <div className='flex items-center justify-center '>
        </div>
    </div>
}});
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false ,loading:()=>{
    return <div    className="bg-primary-main text-secondary-dark w-full h-[40vh] animate-pulse  py-12">
        <div className='flex items-center justify-center '>
        </div>
    </div>
}});
import { layoutsConfig } from '@/config/layouts';
import { useUser } from '@/hooks/useUser';
const ChatDialog = dynamic(() => import('@/components/layout/ChatDialog'), { ssr: false ,loading:()=>{
    return   <div
    style={{
        position: 'fixed',
        bottom: '50px',
        right: '20px',
        border:"1px solid #003f59",
        backgroundColor: '#249491',
        color: 'white',
        borderRadius: '50%',
        width: 30,
        height: 50,
        zIndex: 1001,
    }}
    className='flex items-center justify-center animate-pulse'
>
</div>
}});

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, status } = useUser();
    let router=useRouter();

    if (status === 'loading') {
        return <div>جاري التحميل...</div>;
    }

    if (!user || user.role !== 'STUDENT') {
        router.replace('/auth/signin');
    }

    const layoutConfig = layoutsConfig.student;

    return (
        <div className="flex min-h-screen flex-col w-full h-full">
            <Navbar
                links={layoutConfig.navbarLinks}
                user={user}
                role={user.role}
                showNotifications={layoutConfig.showNotifications ?? false}
                showProfile={layoutConfig.showProfile ?? false}
                showSearch={layoutConfig.showSearch ?? false}
            // showLanguageSwitcher={layoutConfig.showLanguageSwitcher}
            // showThemeSwitcher={layoutConfig.showThemeSwitcher}
            />
            <main className="flex-1 p-5">{children}</main>
            <ChatDialog/>
            <Footer
                links={layoutConfig.footerLinks}
            />
        </div>
    );
} 