'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import dynamic from 'next/dynamic';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast, getRoleRedirectPath, getRoleSuccessMessage } from '@/lib/toast-helpers';
import { AlertCircle, CheckCircle } from 'lucide-react';

const FormInput = dynamic(() => import('@/components/ui/FormInput').then(mod => mod.FormInput), { ssr: false });
const CustomPhoneInput = dynamic(() => import('@/components/ui/PhoneInput').then(mod => mod.CustomPhoneInput), { ssr: false });
const Image = dynamic(() => import('next/image'), { ssr: false });

export default function SignIn() {
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
        let toastId = showToast.loading('جاري تسجيل الدخول...');

        try {
            const result = await signIn('credentials', {
                identifier: data.identifier,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                showToast.error(result.error, toastId);
                setError(result.error);
            } else {
                // جلب بيانات الجلسة بعد نجاح تسجيل الدخول
                const sessionRes = await fetch('/api/auth/role');
                const session = await sessionRes.json();
                const role = session.role;
                    showToast.success(getRoleSuccessMessage(role), toastId);
                    router.replace(getRoleRedirectPath(role));
                
            }
        } catch (error) {
            showToast.error('حدث خطأ أثناء تسجيل الدخول', toastId);
            setError('حدث خطأ أثناء تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <LazyMotion features={domAnimation}>
                <m.div
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
                            <p className="text-primary text-lg font-medium">
                                3DE - اتعلم معنا 
                            </p>
                        </div>

                        {searchParams.get('registered') && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                    <p className="text-sm font-medium text-green-800">
                                        تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                            </button>

                            <div className="text-center mt-4">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-primary hover:text-primary-dark hover:underline text-sm font-medium"
                                >
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>

                            <div className="text-center mt-2">
                                <Link
                                    href="/auth/signup"
                                    className="text-primary hover:text-primary-dark hover:underline text-sm font-medium"
                                >
                                    ليس لديك حساب؟ سجل الآن
                                </Link>
                            </div>
                        </form>
                    </div>
                </m.div>
            </LazyMotion>
        </div>
    );
} 