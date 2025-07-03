'use client';
import dynamic from 'next/dynamic';
import React, { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
const Card = dynamic(() => import('@/components/common/Card'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const Progress = dynamic(() => import('@/components/common/Progress'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const Badge = dynamic(() => import('@/components/common/Badge'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const Alert = dynamic(() => import('@/components/common/Alert'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const Button = dynamic(() => import('@/components/common/Button'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const Tabs = dynamic(() => import('@/components/common/Tabs'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { ssr: false ,loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});
const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { ssr: false ,loading:()=>{
    return <div></div>
}});
const Carousel = dynamic(() => import('@/components/common/Carousel'), { ssr: false ,loading:()=>{
    return <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
}});
const Avatar = dynamic(() => import('@/components/common/Avatar'), { ssr: false ,loading:()=>{
    return <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
}});
import { userApi, courseApi, notificationApi, achievementApi, enrollmentApi, instructorApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { Achievement, Course, Enrollment, Notification, Quiz, User, Instructor } from '@shared/prisma';
import { useRouter } from 'next/navigation';

import { Home, Book, Bell, UserIcon, Users } from 'lucide-react';

let getUser = async (id: string): Promise<User> => {
    let user = await userApi.getProfile(id);
    return user.data;
}
let getCourses = async (userId: string): Promise<(Enrollment & { course: Course & { quizzes: Quiz[] } })[]> => {
    let enrollments = await enrollmentApi.getByUser(userId);
    return enrollments.data;
}
let getNotifications = async (id: string): Promise<Notification[]> => {
    let notifications = await userApi.getNotifications(id);
    return notifications.data;
}
let getAchievements = async (id: string): Promise<Achievement[]> => {
    let achievements = await achievementApi.getByUser(id);
    return achievements.data;
}
let getInstructors = async (): Promise<(Instructor & { user: User, courses: Course[] })[]> => {
    let instructors = await instructorApi.getAll(0, 10, "");
    return instructors.data;
}

function StudentDashboard() {
    const [activeTab, setActiveTab] = useState<number>(0);
    let { user, status } = useUser();
    const router = useRouter();

    // استعلامات البيانات
    const { data: profile, isLoading: isLoadingProfile } = useQuery<User>({
        queryKey: ['profile'],
        queryFn: () => getUser(user?.id || ''),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { data: courses, isLoading: isLoadingCourses } = useQuery<(Enrollment & { course: Course & { quizzes: Quiz[] } })[]>({
        queryKey: ['courses'],
        queryFn: () => getCourses(user?.id || ''),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { data: notifications, isLoading: isLoadingNotifications } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: () => getNotifications(user?.id || ''),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { data: achievements, isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
        queryKey: ['achievements'],
        queryFn: () => getAchievements(user?.id || ''),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { data: instructors, isLoading: isLoadingInstructors } = useQuery<(Instructor & { user: User, courses: Course[] })[]>({
        queryKey: ['instructors'],
        queryFn: () => getInstructors(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    if (status === 'loading' || isLoadingProfile || isLoadingCourses || isLoadingNotifications || isLoadingAchievements || isLoadingInstructors) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height={120} />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton height={300} />
                    <Skeleton height={300} />
                </div>
            </div>
        );
    }
console.log(courses)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* العنوان والترحيب */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">مرحباً بك، {profile?.firstName} {profile?.lastName} 👋</h1>
                    
                </div>
                <Button variant="contained" size="large">
                    تحديث الملف الشخصي
                </Button>
            </div>

            {/* Carousel المدرسين */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">مُدرسينا</h2>
                        <p className="text-gray-600">تعرف على مدرسك المتميز</p>
                    </div>
                    <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push('/student/teachers')}
                        className="flex items-center space-x-2 space-x-reverse"
                    >
                        <Users size={16} />
                        <span>عرض الكل</span>
                    </Button>
                </div>

                {instructors && instructors.length > 0 ? (
                    <Carousel 
                        itemsPerView={4} 
                        autoPlay={false}
                        showArrows={true}
                        showDots={true}
                        className="py-4"
                    >
                        {instructors.slice(0, 10).map((instructor, index) => (
                            <motion.div
                                key={instructor.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="text-center cursor-pointer group"
                                onClick={() => router.push(`/student/teachers?instructor=${instructor.id}`)}
                            >
                                <div className="relative mb-4">
                                    <Avatar
                                        src={instructor.user.avatar || ""}
                                        alt={`${instructor.user.firstName} ${instructor.user.lastName}`}
                                        size="xl"
                                        cw="200px"
                                        ch="200px"
                                        className="mx-auto group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {instructor.user.firstName} {instructor.user.lastName}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {instructor.title || 'مدرس'}
                                </p>
                                <div className="flex justify-center">
                                    <Badge variant="standard" className="text-xs">
                                        <span>{instructor.courses.length} مادة</span>
                                    </Badge>
                                </div>
                            </motion.div>
                        ))}
                    </Carousel>
                ) : (
                    <div className="text-center py-8">
                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">لا يوجد مدرسون متاحون حالياً</p>
                    </div>
                )}
            </motion.div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600">
                        هذه نظرة عامة على تقدمك الدراسي
                    </p>
                </div>
            </div>
            {/* التبويبات */}
            <Tabs
                value={activeTab}
                onChange={(value: number) => setActiveTab(value)}
                tabs={[
                    { value: 0, label: 'نظرة عامة', icon: <Home />, content: <div>نظرة عامة</div> },
                    { value: 1, label: 'موادي', icon: <Book />, content: <div>موادي</div> },
                    { value: 2, label: 'مُدرسي', icon: <UserIcon />, content: <div>مدرسوني</div> },
                    { value: 3, label: 'إنجازاتي', icon: <Bell />, content: <div>إنجازاتي</div> },
                    { value: 4, label: 'إشعاراتي', icon: <Bell />, content: <div>إشعاراتي</div> },
                ]}
            />

            {/* إحصائيات الأداء */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card title="المواد المسجلة" className="bg-primary-50">
                        <p className="text-2xl font-bold">{courses?.length || 0}</p>
                        <Progress
                            value={courses?.filter(c => c.progress === 100).length || 0}
                            max={courses?.length || 1}
                            showLabel
                            label={`${Math.round((courses?.filter(c => c.progress === 100).length || 0) / (courses?.length || 1) * 100)}% مكتملة`}
                        />
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card title="المهام المكتملة" className="bg-success-50">
                        <p className="text-2xl font-bold">{courses?.reduce((acc, c) => acc + c.course?.quizzes?.reduce((acc, q) => acc + (q.isCompleted ? 1 : 0), 0), 0) || 0}</p>
                        <Progress
                            value={courses?.reduce((acc, c) => acc + c.course?.quizzes?.reduce((acc, q) => acc + (q.isCompleted ? 1 : 0), 0), 0) || 0}
                            max={courses?.reduce((acc, c) => acc + c.course?.quizzes?.length, 0) || 1}
                            showLabel
                            label={`${Math.round((courses?.reduce((acc, c) => acc + c.course?.quizzes?.reduce((acc, q) => acc + (q.isCompleted ? 1 : 0), 0), 0) || 0) / (courses?.reduce((acc, c) => acc + c.course?.quizzes?.length, 0) || 1) * 100)}% مكتملة`}
                        />
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card title="الإنجازات" className="bg-warning-50">
                        <p className="text-2xl font-bold">{achievements?.length || 0}</p>
                        <div className="flex items-center space-x-2">
                            <Badge variant="dot" title={`${achievements?.filter(a => a.isNew).length || 0} جديد`}>
                                <></>
                            </Badge>
                            <Tooltip title="الإنجازات التي حصلت عليها مؤخراً">
                                <span className="text-warning-600">آخر 7 أيام</span>
                            </Tooltip>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card title="الإشعارات غير المقروءة" className="bg-info-50">
                        <p className="text-2xl font-bold">{notifications?.length || 0}</p>
                        <div className="flex items-center space-x-2">
                            <Badge variant="dot" title={`${notifications?.filter(n => !n.read).length || 0} جديد`}>
                                <></>
                            </Badge>
                            <Tooltip title="الإشعارات التي حصلت عليها مؤخراً">
                                <span className="text-info-600">آخر 7 أيام</span>
                            </Tooltip>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* المواد الحالية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Card title="موادي الحالية">
                        <DataGrid
                            rows={courses?.filter(c => c.progress < 100) || []}
                            columns={[
                                {
                                    field: 'title',
                                    headerName: 'اسم الدورة',
                                    renderCell: (row: any) => (
                                        <div className="flex items-center space-x-2">
                                            <span>{row?.course?.title}</span>
                                        </div>
                                    )
                                },
                                {
                                    field: 'progress',
                                    headerName: 'التقدم',
                                    renderCell: (row: any) => (
                                        <Progress
                                            value={row?.progress}
                                            max={100}
                                            size="small"
                                            showLabel
                                        />
                                    )
                                },
                                {
                                    field: 'actions',
                                    headerName: 'الإجراءات',
                                    renderCell: (row: any) => (
                                        <Button
                                            variant="text"
                                            onClick={() => {/* الانتقال للدورة */ }}
                                        >
                                            متابعة
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </motion.div>

                {/* المهام القادمة */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card title="المهام القادمة">
                        <div className="space-y-4">
                            {courses?.flatMap(c => c.course?.quizzes?.filter(q => q.upComing) || [])
                                .sort((a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
                                .slice(0, 5)
                                .map((assignment, index) => (
                                    <motion.div
                                        key={assignment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                                    >
                                        <Alert title={assignment.title} message={assignment.description || ''} variant="standard">
                                        </Alert>
                                    </motion.div>
                                ))}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* الإشعارات */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Card title="آخر الإشعارات" >
                    <div className="space-y-4">
                        {notifications?.slice(0, 3).map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                            >
                                <Alert title={notification.title} message={notification.message} variant="standard" className="bg-white">
                                </Alert>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
} 
export default function StudentDashboardS() {
    return (
        <Suspense fallback={<Skeleton />}>
            <StudentDashboard />
        </Suspense>
    );
} 