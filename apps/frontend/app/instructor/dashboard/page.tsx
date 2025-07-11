"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { instructorApi, courseApi, userApi, achievementApi, notificationApi } from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { Course, Achievement, Notification, Enrollment } from "@shared/prisma";
import { useRouter } from "next/navigation";
import { School, Users, Trophy, Bell, TrendingUp, Star, Info, Play } from "lucide-react";

// Dynamic imports
const StatsCard = dynamic(() => import("@/components/common/StatsCard"), { loading: () => <div>...</div> });
const Card = dynamic(() => import("@/components/common/Card"), { loading: () => <div>...</div> });
const DataGrid = dynamic(() => import("@/components/common/DataGrid"), { loading: () => <div>...</div> });
const HeroSection = dynamic(() => import("@/components/common/HeroSection"), { loading: () => <div>...</div> });
const Badge = dynamic(() => import("@/components/common/Badge"), { loading: () => <div>...</div> });
const Avatar = dynamic(() => import("@/components/common/Avatar"), { loading: () => <div>...</div> });
const Tooltip = dynamic(() => import("@/components/common/Tooltip"), { loading: () => <div>...</div> });

type StudentRow = {
  id: string;
  name: string;
  course: string;
  progress: number;
  avatar?: string;
};

type CourseWithLevel = Course & { level?: string };

type AchievementType = Achievement & { value?: any };

type NotificationType = Notification;

export default function InstructorDashboard() {
  const { user } = useUser();
  const [courses, setCourses] = useState<CourseWithLevel[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // جلب البيانات من الـ APIs
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    Promise.all([
      instructorApi.getCourses(user.id),
      achievementApi.getByUser(user.id),
      notificationApi.getAllByUserId(user.id),
    ]).then(([coursesRes, achievementsRes, notificationsRes]) => {
      setCourses(coursesRes.data || []);
      setAchievements(achievementsRes.data || []);
      setNotifications(notificationsRes.data || []);
      // جلب الطلاب من كل كورس
      Promise.all((coursesRes.data || []).map((c: CourseWithLevel) => courseApi.getStudents(c.id))).then((studentsArr) => {
        // studentsArr: array of { data: Enrollment[] }
        const allStudents: StudentRow[] = studentsArr.flatMap((s) =>
          (s.data || []).map((enrollment: any) => ({
            id: enrollment.user.id,
            name: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
            course: enrollment.course.title,
            progress: enrollment.progress,
            avatar: enrollment.user.avatar,
          }))
        );
        setStudents(allStudents);
        setLoading(false);
      });
    });
  }, [user?.id]);

  // حساب الإحصائيات
  const stats = [
    {
      label: "عدد الكورسات",
      value: courses.length,
      icon: <School className="h-8 w-8" />,
      color: "primary" as const,
    },
    {
      label: "عدد الطلاب",
      value: students.length,
      icon: <Users className="h-8 w-8" />,
      color: "success" as const,
    },
    {
      label: "الإنجازات",
      value: achievements.length,
      icon: <Trophy className="h-8 w-8" />,
      color: "warning" as const,
    },
    {
      label: "الإشعارات",
      value: notifications.length,
      icon: <Bell className="h-8 w-8" />,
      color: "info" as const,
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };
  const stagger = {
    visible: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* إشعارات سريعة */}
      <div className="container mx-auto px-4 pt-4">
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <div className="flex items-center gap-4 p-3 bg-gradient-to-l from-blue-100 to-indigo-50 rounded-xl shadow-md">
                <Bell className="h-6 w-6 text-blue-600" />
                <p className="font-semibold text-gray-800">
                  لديك {notifications.length} إشعار جديد
                </p>
                <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                  {notifications.slice(0, 4).map((n) => (
                    <Badge
                      key={n.id}
                      variant="standard"
                      color={n.urgent ? "error" : n.isImportant ? "warning" : "info"}
                      className="mx-1"
                    >
                      <span className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {n.title}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <HeroSection
        title={`مرحباً ${user?.firstName || ""}!`}
        subtitle="لوحة تحكم المحاضر"
        description="تابع تقدمك، إدارة الكورسات، واطلع على أحدث الأنشطة."
        backgroundImage="/assets/images/hero-instructor.avif"
        primaryAction={{
          label: "إضافة كورس جديد",
          onClick: () => {/* ... */},
          icon: <Play className="h-4 w-4" />,
        }}
        features={[
          { icon: <School className="h-6 w-6" />, title: "كورساتك", description: "إدارة جميع الكورسات بسهولة" },
          { icon: <Users className="h-6 w-6" />, title: "طلابك", description: "تتبع تقدم الطلاب" },
          { icon: <Trophy className="h-6 w-6" />, title: "إنجازاتك", description: "شاهد إنجازاتك وتكريماتك" },
        ]}
        variant="split"
        className="mb-8"
      />

      <div className="container mx-auto px-4 py-8">
        {/* إحصائيات سريعة */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <StatsCard title="إحصائيات سريعة" stats={stats} variant="compact" className="mb-8" />
        </motion.div>

        {/* الكورسات النشطة */}
        <h2 className="text-2xl font-bold mb-4">كورساتك النشطة</h2>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div key={course.id} variants={fadeInUp} whileHover={{ scale: 1.04, boxShadow: "0 8px 24px #a5b4fc55" }}>
              <Card
                title={course.title}
                description={course.description}
                image={course.image || undefined}
                tags={[course.level || ""]}
                onClick={() => {/* ... */}}
                className="h-full cursor-pointer hover-lift card-shadow bg-white/90"
                actionText="إدارة الكورس"
                onAction={() => {
                  router.push(`/instructor/courses/${course.id}`);
                }}
              >
                <div className="flex items-center gap-2 mt-2">
                  <Tooltip title="عدد الطلاب">
                    <div className="relative">
                      <Users className="h-5 w-5 text-blue-600" />
                      <Badge variant="dot" color="primary" className="absolute -top-1 -right-1">
                        <span className="text-xs">{students.filter(s => s.course === course.title).length}</span>
                      </Badge>
                    </div>
                  </Tooltip>
                  <Badge variant="standard" color="info" className="text-xs">
                    <span>{course.level || "-"}</span>
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* جدول الطلاب */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">آخر الطلاب النشطين</h2>
          <div className="p-4 rounded-xl bg-white/80 card-shadow mb-4">
            <DataGrid
              columns={[
                {
                  field: "avatar",
                  headerName: "الصورة",
                  width: 60,
                  renderCell: (params: any) => (
                    <Avatar src={params.value} alt={params.row.name} />
                  ),
                },
                { field: "name", headerName: "اسم الطالب", width: 150 },
                { field: "course", headerName: "الكورس", width: 150 },
                {
                  field: "progress",
                  headerName: "التقدم",
                  width: 120,
                  renderCell: (params: any) => (
                    <div className="flex items-center gap-2">
                      <span>{params.value}%</span>
                      <div className="w-8 h-8 relative">
                        <svg viewBox="0 0 36 36" className="w-8 h-8">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeDasharray={`${params.value}, 100`}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-main">
                          {params.value}
                        </span>
                      </div>
                    </div>
                  ),
                },
              ]}
              rows={students}
              pageSize={5}
              checkboxSelection={false}
            />
          </div>
        </div>

        {/* الإنجازات */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">إنجازاتك</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((ach, idx) => (
              <motion.div key={ach.id} variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ scale: 1.08 }}>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 card-shadow mb-2 animate-fade-in-up">
                  <Star className="h-8 w-8 text-yellow-500 mb-2" />
                  <h3 className="font-bold mb-1 text-yellow-800">
                    {ach.type}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {ach.value ? ach.value.toString() : "-"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}