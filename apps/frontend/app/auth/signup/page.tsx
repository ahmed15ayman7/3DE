'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/FormInput';
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-6">
                        <Image
                            src="/assets/images/logo.png"
                            alt="3DE Logo"
                            width={120}
                            height={120}
                            placeholder='blur'
                            blurDataURL='/assets/images/logo.png'
                            className="mx-auto mb-4 rounded-full"
                        />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            إنشاء حساب جديد
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                                <FormInput
                                    {...field}
                                    label="الاسم الأول"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
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
                                />
                            )}
                        />

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                    <p className="text-sm font-medium text-red-800">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? 'جاري التسجيل...' : 'تسجيل'}
                        </button>

                        <div className="text-center mt-4">
                            <Link
                                href="/auth/signin"
                                className="text-primary hover:text-primary-dark hover:underline text-sm font-medium"
                            >
                                لديك حساب بالفعل؟ تسجيل الدخول
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
} 