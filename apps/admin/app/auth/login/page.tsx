'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Container,
    Paper,
} from '@mui/material';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/ui/FormInput';
import { CustomPhoneInput } from '@/components/ui/PhoneInput';
import { AdminRole } from '@shared/prisma';



export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const { control, handleSubmit, formState: { errors } } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInInput) => {
        setError('');
        setLoading(true);

        try {
            console.log(data);
            const result = await signIn('credentials', {
                email: data.identifier,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            }
            else {
                if ((session?.user as any)?.roles.some((role: AdminRole) => role.name === 'ADMIN')) {
                    router.push('/admin/dashboard');
                } else if ((session?.user as any)?.roles.some((role: AdminRole) => role.name === 'ACCOUNTANT')) {
                    router.push('/admin/finance/');
                } else {
                    router.push('/admin/dashboard');
                }
            }
        } catch (error) {
            setError('حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mt: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                        borderRadius: 2,
                    }}
                >
                    <Box sx={{ mb: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Image
                            src="/assets/images/logo.png"
                            alt="3DE Logo"
                            width={120}
                            height={120}
                            placeholder='blur'
                            blurDataURL='/assets/images/logo.png'
                            style={{ marginBottom: '1rem', textAlign: 'center', borderRadius: '50%' }}
                        />
                        {/* <Typography
                            component="h1"
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                            }}
                        >
                            3DE
                        </Typography> */}
                        <Typography
                            variant="subtitle1"
                            sx={{ color: 'primary', mb: 2 }}
                        >
                            3DE - لوحة التحكم
                        </Typography>
                    </Box>


                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ width: '100%', mt: 2 }}
                    >

                        <Controller
                            control={control}
                            name="identifier"
                            render={({ field }) => (
                                <FormInput
                                    {...field}
                                    label="البريد الإلكتروني"
                                    type="email"
                                    error={!!errors.identifier}
                                    helperText={errors.identifier?.message}
                                    onChange={field.onChange}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />


                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <FormInput
                                    {...field}
                                    label="كلمة المرور"
                                    type="password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />

                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2, borderRadius: 1 }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            className='bg-primary-DEFAULT hover:bg-primary-dark'
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
                            }}
                        >
                            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                        </Button>

                        {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link
                                href="/auth/forgot-password"
                                style={{ textDecoration: 'none' }}
                            >
                                <Typography
                                    color="primary"
                                    sx={{
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    نسيت كلمة المرور؟
                                </Typography>
                            </Link>
                        </Box> */}

                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
} 