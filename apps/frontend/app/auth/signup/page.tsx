'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container, Paper, Typography, Button, Box, Alert } from '@mui/material';
import { FormInput } from '@/components/ui/FormInput';
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api';
import Image from 'next/image';

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpInput) => {
        setError(null);
        setLoading(true);

        try {
            await authApi.register({
                phone: data.identifier,
                email: data.identifier,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                role: "STUDENT",
                subRole: ""
            });
            router.push('/auth/signin?registered=true');
        } catch (error) {
            setError('حدث خطأ أثناء التسجيل');
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
                    }}
                >
                    <Image
                        src="/assets/images/logo.png"
                        alt="3DE Logo"
                        width={120}
                        height={120}
                        style={{ marginBottom: '1rem', textAlign: 'center' }}
                    />
                    <Typography component="h1" variant="h4" gutterBottom>
                        إنشاء حساب جديد
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ width: '100%', mt: 2 }}
                    >
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                                <FormInput
                                    {...field}
                                    label="الاسم الأول"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field }) => (
                                <FormInput
                                    {...field}
                                    label="الاسم الأخير"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="identifier"
                            render={({ field }) => (
                                <FormInput
                                    {...field}
                                    label="البريد الإلكتروني"
                                    type="text"
                                    error={!!errors.identifier}
                                    helperText={errors.identifier?.message}
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
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? 'جاري التسجيل...' : 'تسجيل'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link
                                href="/auth/signin"
                                style={{ textDecoration: 'none' }}
                            >
                                <Typography color="primary">
                                    لديك حساب بالفعل؟ تسجيل الدخول
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
} 