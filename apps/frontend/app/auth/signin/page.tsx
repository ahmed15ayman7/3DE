'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container, Paper, Typography, Button, Box, Alert, Avatar } from '@mui/material';
import { FormInput } from '@/components/ui/FormInput';
import { CustomPhoneInput } from '@/components/ui/PhoneInput';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { User } from '@shared/prisma';
import { toast } from 'react-toastify';

export default function SignIn() {
    let { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isPhone, setIsPhone] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    });

    const identifier = watch('identifier');

    const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIsPhone(/^\d/.test(value));
        setValue('identifier', value);
    };

    const onSubmit = async (data: SignInInput) => {
        setError(null);
        setLoading(true);
        let toastId = toast.loading('جاري تسجيل الدخول...');

        try {
            const result = await signIn('credentials', {
                identifier: data.identifier,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                toast.update(toastId, { render: result.error, type: 'error' ,autoClose: 3000,isLoading: false});
                setError(result.error);
            } else {
                if ((session?.user as any)?.role === 'STUDENT') {
                    toast.update(toastId, { render: 'تم تسجيل الدخول للطالب بنجاح', type: 'success', autoClose: 3000, isLoading: false });
                    console.log("session", session)
                    router.push('/student/dashboard');
                } else if ((session?.user as any)?.role === 'INSTRUCTOR') {
                    toast.update(toastId, { render: 'تم تسجيل الدخول للمحاضر بنجاح', type: 'success', autoClose: 3000, isLoading: false });
                    router.push('/instructor/dashboard');
                } else if ((session?.user as any)?.role === 'ACADEMY') {
                    toast.update(toastId, { render: 'تم تسجيل الدخول للجامعة بنجاح', type: 'success', autoClose: 3000, isLoading: false });
                    router.push('/academy/dashboard');
                } else if ((session?.user as any)?.role === 'ADMIN') {
                        toast.update(toastId, { render: 'تم تسجيل الدخول للمدير بنجاح', type: 'success', autoClose: 3000, isLoading: false });
                    router.push('/admin/dashboard');
                } else if ((session?.user as any)?.role === 'PARENT') {
                    toast.update(toastId, { render: 'تم تسجيل الدخول للولي بنجاح', type: 'success', autoClose: 3000, isLoading: false });
                    router.push('/parent/dashboard');
                } else {
                    toast.update(toastId, { render: 'حدث خطأ أثناء تسجيل الدخول', type: 'error', autoClose: 3000, isLoading: false });
                    router.push('/auth/signin');
                }
            }
        } catch (error) {
            toast.update(toastId, { render: 'حدث خطأ أثناء تسجيل الدخول', type: 'error', autoClose: 3000, isLoading: false });
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
                            3DE - اتعلم معنا 
                        </Typography>
                    </Box>

                    {searchParams.get('registered') && (
                        <Alert
                            severity="success"
                            sx={{ width: '100%', mb: 2, borderRadius: 1 }}
                        >
                            تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ width: '100%', mt: 2 }}
                    >
                        {isPhone ? (
                            <CustomPhoneInput
                                value={identifier || ''}
                                onChange={(value) => setValue('identifier', value)}
                                error={!!errors.identifier}
                                helperText={errors.identifier?.message}
                            />
                        ) : (
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
                                        onChange={handleIdentifierChange}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />

                        )}
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

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
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
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link
                                href="/auth/signup"
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
                                    ليس لديك حساب؟ سجل الآن
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
} 