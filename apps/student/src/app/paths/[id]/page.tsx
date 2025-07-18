'use client';

import React, { use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Alert, Skeleton, Progress, Badge } from '@3de/ui';
import { PathAvatars } from '../../../components/paths/PathAvatars';
import { SubscribeButton } from '../../../components/paths/SubscribeButton';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Target, 
  ArrowLeft,
  Star,
  Play,
  CheckCircle
} from 'lucide-react';

import { usePaths } from '../../../hooks/usePaths';


export default function PathDetailPage({params}: {params: Promise<{id: string}>}) {
  const router = useRouter();
  const pathId = use(params).id;

  // جلب تفاصيل المسار
  const { data: path, isLoading, error } = usePaths().usePath(pathId);

  const handleSubscribe = async (pathId: string) => {
    try {
      // محاكاة الاشتراك في المسار
      console.log('Subscribing to path:', pathId);
    } catch (error) {
      console.error('Error subscribing to path:', error);
      throw error;
    }
  };

  const handleUnsubscribe = async (pathId: string) => {
    try {
      // محاكاة إلغاء الاشتراك
      console.log('Unsubscribing from path:', pathId);
    } catch (error) {
      console.error('Error unsubscribing from path:', error);
      throw error;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'مبتدئ';
      case 'intermediate':
        return 'متوسط';
      case 'advanced':
        return 'متقدم';
      default:
        return level;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} ساعة`;
    }
    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" title="خطأ في تحميل المسار">
          حدث خطأ أثناء تحميل تفاصيل المسار. يرجى المحاولة مرة أخرى.
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" title="المسار غير موجود">
          لم يتم العثور على المسار المطلوب.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* زر العودة */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          العودة للمسارات
        </button>

        {/* رأس المسار */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 gap-reverse mb-4">
                <Badge className={getLevelColor(path.level)}>
                  {getLevelText(path.level)}
                </Badge>
                <div className="flex items-center text-yellow-600">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {path.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {path.description}
              </p>
            </div>
          </div>

          {/* إحصائيات المسار */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-primary-main" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{path.courses?.length || 0}</div>
              <div className="text-sm text-gray-600">كورس</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatTime(path.studyTime)}</div>
              <div className="text-sm text-gray-600">وقت الدراسة</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{path.completedTasks}/{path.totalTasks}</div>
              <div className="text-sm text-gray-600">مهام مكتملة</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{path.peers?.length || 0}</div>
              <div className="text-sm text-gray-600">مشارك</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            {/* نسبة التقدم */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">نسبة التقدم</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">التقدم العام</span>
                  <span className="font-bold text-gray-900">{Math.round(path.progress)}%</span>
                </div>
                <Progress value={path.progress} className="h-3" />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>الوقت المتبقي: {formatTime(path.remainingTime)}</span>
                  <span>معدل المشاركة: {Math.round(path.engagement)}%</span>
                </div>
              </div>
            </div>

            {/* الكورسات المرتبطة */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">الكورسات المرتبطة</h2>
              <div className="space-y-4">
                {path.courses?.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 gap-reverse">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary-main" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 gap-reverse">
                      <span className="text-sm text-gray-600">{formatTime(course.duration || 0)}</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* زر الاشتراك */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <SubscribeButton
                pathId={path.id}
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
              />
            </div>

            {/* المشاركون */}
            {path.peers && path.peers.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">المشاركون</h3>
                <PathAvatars
                  users={path.peers}
                  maxDisplay={8}
                  size="lg"
                  className="mb-4"
                />
                <p className="text-sm text-gray-600">
                  انضم إلى {path.peers.length} شخص في هذا المسار
                </p>
              </div>
            )}

            {/* معلومات إضافية */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات المسار</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <span className="font-medium">
                    {new Date(path.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">آخر تحديث:</span>
                  <span className="font-medium">
                    {new Date(path.updatedAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المستوى:</span>
                  <Badge className={getLevelColor(path.level)}>
                    {getLevelText(path.level)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 