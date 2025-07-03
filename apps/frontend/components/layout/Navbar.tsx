"use client";
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Avatar,
    Box,
    Typography,
    Button,
} from '@mui/material';
import {
    MenuIcon,
    Bell as NotificationsIcon,
    MessageCircle as MessageIcon,
    Languages as LanguageIcon,
    Moon as DarkModeIcon,
    Sun as LightModeIcon,
    User as PersonIcon,
    Settings as SettingsIcon,
    LogOut as LogoutIcon,
} from 'lucide-react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import authService from '@/lib/auth.service';
import { signOut } from 'next-auth/react';

interface NavbarProps {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        role: string;
    };
    role: string;
    notifications?: Array<{
        id: string;
        title: string;
        message: string;
        read: boolean;
    }>;
    messages?: Array<{
        id: string;
        sender: string;
        message: string;
        read: boolean;
    }>;
    showNotifications: boolean;
    showProfile: boolean;
    showSearch: boolean;
    links: Array<{
        label: string;
        href: string;
    }>;
}

const Navbar: React.FC<NavbarProps> = ({
    user,
    role,
    notifications = [],
    showNotifications = false,
    showProfile = false,
    showSearch = false,
    messages = [],
    links,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
    const [messagesAnchor, setMessagesAnchor] = useState<null | HTMLElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const pathname = usePathname();
    const router = useRouter();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
        if (role === 'STUDENT') {
            router.push('/student/notifications');
        } else {
            setNotificationsAnchor(event.currentTarget);
        }
    };

    const handleMessagesClick = (event: React.MouseEvent<HTMLElement>) => {
        setMessagesAnchor(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setNotificationsAnchor(null);
    };

    const handleCloseMessages = () => {
        setMessagesAnchor(null);
    };

    const handleToggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // يمكن إضافة منطق إضافي هنا لتغيير الثيم
    };

    const handleToggleLanguage = () => {
        // يمكن إضافة منطق إضافي هنا لتغيير اللغة
    };

    const handleLogout = async () => {
        try {
            await authService.clearTokens();
            signOut();
            router.push('/auth/signin');
        } catch (error) {
            signOut();
            router.push('/auth/signin');
            console.error('خطأ في تسجيل الخروج:', error);
        }
        handleMenuClose();
    };

    const drawer = (
        <List>
            {links.map((link,i) => (
                <ListItem button component={Link} href={link.href} key={i}>
                    <ListItemText primary={link.label} />
                </ListItem>
            ))}
            {user && (
                <>
                    <ListItem button component={Link} href={`${role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : role === 'STUDENT' ? '/student' : role === "PARENT" ? '/parent' : ''}/profile`}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={'profile'} />
                    </ListItem>
                    <ListItem button component={Link} href="/settings">
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'settings'} />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={'logout'} />
                    </ListItem>
                </>
            )}
        </List>
    );

    return (
        <AppBar position="sticky" className="bg-white text-primary-dark shadow-navbar">
            <Toolbar>
                {isMobile && <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className="md:hidden"
                >
                    <MenuIcon />
                </IconButton>
                }
                <Link href="/" prefetch={true} className="flex items-center">
                    <img
                        src="/assets/images/logo.png"
                        alt="Logo"
                        className="h-24 w-auto mr-4 rounded-full"
                    />
                </Link>

                <Box className="hidden md:flex flex-1 justify-center gap-8 max-lg:gap-4 rtl:space-x-reverse">
                        {links.map((link,i) => (
                        <Link href={link.href} prefetch={true} key={i} className={`  hover:underline border-2 rounded-lg  px-4 py-2 ${pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/') ? 'bg-secondary-main/80 text-white' : 'border-transparent text-secondary-main hover:text-secondary-light '}`}>
                            {link.label}
                        </Link>
                    ))}
                </Box>

                <Box className="flex items-center space-x-4">

                    {showNotifications && <IconButton
                        color="inherit"
                        onClick={handleNotificationsClick}
                        className="relative"
                    >
                        <Badge badgeContent={notifications.filter(n => !n.read).length} color="primary">
                            <NotificationsIcon className={`hover:text-white ${pathname === '/notifications' || (pathname.startsWith('/notifications') && pathname !== '/notifications') ? 'text-white' : 'text-secondary-main'}`} />
                        </Badge>
                    </IconButton>
                    }
                    <IconButton
                        color="inherit"
                        onClick={handleMessagesClick}
                        className="relative"
                    >
                        <Badge badgeContent={messages.filter(m => !m.read).length} color="primary">
                            <MessageIcon className={`hover:text-white text-secondary-main`} />
                        </Badge>
                    </IconButton>
                    {/* 
                    <IconButton color="inherit" onClick={handleToggleLanguage}>
                        <LanguageIcon />
                    </IconButton>

                    <IconButton color="inherit" onClick={handleToggleTheme}>
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton> */}

                    {user ? (
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleProfileMenuOpen}
                        >
                            <Avatar
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-8 w-8"
                            >
                                {user.firstName[0]}
                            </Avatar>
                        </IconButton>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            href="/auth/login"
                        >
                            {'login'}
                        </Button>
                    )}
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose} component={Link} href={`${role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : role === 'STUDENT' ? '/student' : role === "PARENT" ? '/parent' : ''}/profile/`}>
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        {'الملف الشخصي'}
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} href="/settings">
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        {'الاعدادات'}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        {'تسجيل الخروج'}
                    </MenuItem>
                </Menu>

                <Menu
                    anchorEl={notificationsAnchor}
                    open={Boolean(notificationsAnchor)}
                    onClose={handleCloseNotifications}
                >
                    {notifications.map((notification, index) => (
                        <MenuItem key={index} onClick={handleCloseNotifications}>
                            <ListItemText
                                primary={notification.title}
                                secondary={notification.message}
                                className={!notification.read ? 'font-bold' : ''}
                            />
                        </MenuItem>
                    ))}
                    {notifications.length === 0 && (
                        <MenuItem>
                            <ListItemText primary={"لا يوجد اشعارات"} />
                        </MenuItem>
                    )}
                </Menu>

                <Menu
                    anchorEl={messagesAnchor}
                    open={Boolean(messagesAnchor)}
                    onClose={handleCloseMessages}
                >
                    {messages.map((message, index) => (
                        <MenuItem key={index} onClick={handleCloseMessages}>
                            <ListItemText
                                primary={message.sender}
                                secondary={message.message}
                                className={!message.read ? 'font-bold' : ''}
                            />
                        </MenuItem>
                    ))}
                    {messages.length === 0 && (
                        <MenuItem>
                            <ListItemText primary={"لا يوجد رسائل"} />
                        </MenuItem>
                    )}
                </Menu>
            </Toolbar>

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar; 