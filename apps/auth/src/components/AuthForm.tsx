'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input, Alert } from '@3de/ui';
import { authApi } from '@3de/apis';
import { useAuth } from '@3de/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// مخططات التحقق
const signinSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

const signupSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    confirmPassword: z.string(),
    phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
});

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

type AuthFormType = 'signin' | 'signup' | 'forgot-password' | 'reset-password';

interface AuthFormProps {
    type: AuthFormType;
    token?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, token }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [alert, setAlert] = useState<{
      type: 'success' | 'error' | 'info';
      message: string;
    } | null>(null);
    
    const { login } = useAuth();
    
    // let RedirectToWebsite=(role:string)=>{
    //     switch (role) {
    //         case 'STUDENT':
    //           router.push('https://st.3de.school');
    //           break;
    //         case 'INSTRUCTOR':
    //           router.push('https://in.3de.school');
    //           break;
    //         case 'ADMIN':
    //           router.push('https://ad.3de.school');
    //           break;
    //         case 'ACADEMY':
    //           router.push('https://ac.3de.school');
    //           break;
    //         case 'PARENT':
    //           router.push('https://pa.3de.school');
    //           break;
    //         default:
    //           ;
    //       }}
  // اختيار المخطط المناسب
  const getSchema = () => {
    switch (type) {
      case 'signin':
        return signinSchema;
      case 'signup':
        return signupSchema;
      case 'forgot-password':
        return forgotPasswordSchema;
      case 'reset-password':
        return resetPasswordSchema;
      default:
        return signinSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(getSchema()),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setAlert(null);

    try {
      switch (type) {
        case 'signin':
          const loginResult = await authApi.login({
            email: data.email,
            password: data.password,
          });
          
          if (loginResult) {
            await login(loginResult);
            setAlert({
              type: 'success',
              message: 'تم تسجيل الدخول بنجاح',
            });
            // RedirectToWebsite(loginResult.user.role);
            // سيتم التوجيه تلقائياً من خلال useAuth
          } else {
            setAlert({
              type: 'error',
              message: 'فشل في تسجيل الدخول، تحقق من بياناتك',
            });
          }
          break;

        case 'signup':
          const registerResult = await authApi.register({
            email: data.email,
            password: data.password,
            firstName: data.name.split(' ')[0],
            lastName: data.name.split(' ').slice(1).join(' ') || '',
            phone: data.phone,
            role: 'STUDENT',
            subRole: 'STUDENT',
          });
          
          if (registerResult) {
            setAlert({
              type: 'success',
              message: 'تم التسجيل بنجاح! سيتم تسجيل دخولك تلقائياً',
            });
            // تسجيل الدخول تلقائياً
            await login(registerResult);
            // RedirectToWebsite(registerResult.user.role);
          } else {
            setAlert({
              type: 'error',
              message: 'فشل في التسجيل، حاول مرة أخرى',
            });
          }
          break;

        case 'forgot-password':
          await authApi.forgotPassword(data.email);
          setAlert({
            type: 'success',
            message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
          });
          reset();
          break;

        case 'reset-password':
          if (!token) {
            setAlert({
              type: 'error',
              message: 'رابط غير صحيح',
            });
            return;
          }
          
          await authApi.resetPassword(token, data.password);
          setAlert({
            type: 'success',
            message: 'تم إعادة تعيين كلمة المرور بنجاح',
          });
          reset();
          break;
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'حدث خطأ ما، حاول مرة أخرى',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFormTitle = () => {
    switch (type) {
      case 'signin':
        return 'تسجيل الدخول';
      case 'signup':
        return 'إنشاء حساب جديد';
      case 'forgot-password':
        return 'نسيت كلمة المرور؟';
      case 'reset-password':
        return 'إعادة تعيين كلمة المرور';
      default:
        return '';
    }
  };

  const getSubmitText = () => {
    switch (type) {
      case 'signin':
        return 'تسجيل الدخول';
      case 'signup':
        return 'إنشاء الحساب';
      case 'forgot-password':
        return 'إرسال رابط الإعادة';
      case 'reset-password':
        return 'تغيير كلمة المرور';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', maxWidth: '28rem', margin: '0 auto' }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center">
            <Image src="/logo.png" alt="logo" width={100} height={100} className="mb-4 w-40 h-40 rounded-full" />
            </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getFormTitle()}
          </h1>
          <p className="text-gray-600">
            {type === 'signin' && 'أدخل بياناتك للدخول إلى حسابك'}
            {type === 'signup' && 'أدخل بياناتك لإنشاء حساب جديد'}
            {type === 'forgot-password' && 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور'}
            {type === 'reset-password' && 'أدخل كلمة المرور الجديدة'}
          </p>
        </div>

        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <Alert
              variant={alert.type}
              closable
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* حقل الاسم - للتسجيل فقط */}
          {type === 'signup' && (
            <Input
              label="الاسم الكامل"
              type="text"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message as string}
              {...register('name')}
            />
          )}

          {/* حقل البريد الإلكتروني */}
          {(type === 'signin' || type === 'signup' || type === 'forgot-password') && (
            <Input
              label="البريد الإلكتروني"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message as string}
              {...register('email')}
            />
          )}

          {/* حقل رقم الهاتف - للتسجيل فقط */}
          {type === 'signup' && (
            <Input
              label="رقم الهاتف"
              type="tel"
              icon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message as string}
              {...register('phone')}
            />
          )}

          {/* حقل كلمة المرور */}
          {(type === 'signin' || type === 'signup' || type === 'reset-password') && (
            <div className="relative">
              <Input
                label="كلمة المرور"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message as string}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* حقل تأكيد كلمة المرور */}
          {(type === 'signup' || type === 'reset-password') && (
            <div className="relative">
              <Input
                label="تأكيد كلمة المرور"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message as string}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* زر الإرسال */}
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            className="mt-8"
          >
            {getSubmitText()}
          </Button>
        </form>

        {/* روابط التنقل */}
        <div className="mt-6 text-center space-y-2">
          {type === 'signin' && (
            <>
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <a href="/signup" className="text-primary-main hover:text-primary-dark font-medium">
                  إنشاء حساب جديد
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <a href="/forgot-password" className="text-primary-main hover:text-primary-dark">
                  نسيت كلمة المرور؟
                </a>
              </p>
            </>
          )}

          {type === 'signup' && (
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <a href="/signin" className="text-primary-main hover:text-primary-dark font-medium">
                تسجيل الدخول
              </a>
            </p>
          )}

          {type === 'forgot-password' && (
            <p className="text-sm text-gray-600">
              <a href="/signin" className="text-primary-main hover:text-primary-dark">
                العودة لتسجيل الدخول
              </a>
            </p>
          )}

          {type === 'reset-password' && (
            <p className="text-sm text-gray-600">
              <a href="/signin" className="text-primary-main hover:text-primary-dark">
                العودة لتسجيل الدخول
              </a>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 