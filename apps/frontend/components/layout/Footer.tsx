import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    useTheme,
} from '@mui/material';
import Link from 'next/link';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    Linkedin as LinkedInIcon,
    Youtube as YouTubeIcon,
} from 'lucide-react';

const Footer: React.FC<{ links: { quickLinks: { label: string; links: Array<{ label: string; href: string }> }; support: { label: string; links: Array<{ label: string; href: string }> } } }> = ({ links }) => {
    const theme = useTheme();

    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            className="bg-primary-main text-secondary-dark  py-12"
        >
            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* معلومات الشركة */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" className="mb-4 font-bold">
                            {"من نحن"}
                        </Typography>
                        <Typography variant="body2" className="mb-4">
                            {'3DE - اتعلم معنا'}
                        </Typography>
                        <Box className="flex space-x-4 rtl:space-x-reverse">
                            <IconButton
                                className="text-secondary-dark  hover:text-secondary-main"
                                aria-label="Facebook"
                            >
                                <FacebookIcon />
                            </IconButton>
                            <IconButton
                                className="text-secondary-dark  hover:text-secondary-main"
                                aria-label="Twitter"
                            >
                                <TwitterIcon />
                            </IconButton>
                            <IconButton
                                className="text-secondary-dark  hover:text-secondary-main"
                                aria-label="Instagram"
                            >
                                <InstagramIcon />
                            </IconButton>
                            <IconButton
                                className="text-secondary-dark  hover:text-secondary-main"
                                aria-label="LinkedIn"
                            >
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton
                                className="text-secondary-dark  hover:text-secondary-main"
                                aria-label="YouTube"
                            >
                                <YouTubeIcon />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* روابط سريعة */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" className="mb-4 font-bold">
                            {links.quickLinks.label}
                        </Typography>
                        <Box className="flex flex-col space-y-2">
                            {links.quickLinks.links.map((link,i) => (
                                <Link href={link.href} key={i} className="text-secondary-dark  hover:text-secondary-main">
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* الدعم */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" className="mb-4 font-bold">
                            {links.support.label}
                        </Typography>
                        <Box className="flex flex-col space-y-2">
                            {links.support.links.map((link,i) => (
                                <Link href={link.href} key={i} className="text-secondary-dark  hover:text-secondary-main">
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* اتصل بنا */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" className="mb-4 font-bold">
                            {'contact'}
                        </Typography>
                        <Box className="flex flex-col space-y-2">
                            <Typography variant="body2">
                                {'address'}
                            </Typography>
                            <Typography variant="body2">
                                {'phone'}
                            </Typography>
                            <Typography variant="body2">
                                {'email'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* حقوق النشر */}
                <Box className="mt-12 pt-8 border-t border-gray-200 ">
                    <Typography variant="body2" className="text-center">
                        © {currentYear} {'copyright'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 