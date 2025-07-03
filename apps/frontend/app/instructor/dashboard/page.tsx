"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { instructorApi, courseApi, userApi, achievementApi, notificationApi } from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { Box, Grid, Typography, Container, Avatar, Chip, Badge, IconButton, Tooltip, Paper } from "@mui/material";
import { School, Group, EmojiEvents, TrendingUp, Notifications, Star, Info, PlayCircle } from "@mui/icons-material";
import { Course, Achievement, Notification, Enrollment } from "@shared/prisma";
import { useRouter } from "next/navigation";
// Dynamic imports
const StatsCard = dynamic(() => import("@/components/common/StatsCard"), { loading: () => <div>...</div> });
const Card = dynamic(() => import("@/components/common/Card"), { loading: () => <div>...</div> });
const DataGrid = dynamic(() => import("@/components/common/DataGrid"), { loading: () => <div>...</div> });
const HeroSection = dynamic(() => import("@/components/common/HeroSection"), { loading: () => <div>...</div> });

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
      icon: <School fontSize="large" />,
      color: "primary" as const,
    },
    {
      label: "عدد الطلاب",
      value: students.length,
      icon: <Group fontSize="large" />,
      color: "success" as const,
    },
    {
      label: "الإنجازات",
      value: achievements.length,
      icon: <EmojiEvents fontSize="large" />,
      color: "warning" as const,
    },
    {
      label: "الإشعارات",
      value: notifications.length,
      icon: <Notifications fontSize="large" />,
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
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* إشعارات سريعة */}
      <Container maxWidth="lg" className="pt-4">
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Paper elevation={2} className="flex items-center gap-4 p-3 bg-gradient-to-l from-blue-100 to-indigo-50 rounded-xl shadow">
                <Notifications color="primary" />
                <Typography variant="body1" className="font-semibold">
                  لديك {notifications.length} إشعار جديد
                </Typography>
                <Box className="flex gap-2 overflow-x-auto custom-scrollbar">
                  {notifications.slice(0, 4).map((n) => (
                    <Chip
                      key={n.id}
                      label={n.title}
                      color={n.urgent ? "error" : n.isImportant ? "warning" : "info"}
                      icon={<Info fontSize="small" />}
                      className="mx-1"
                    />
                  ))}
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Hero Section */}
      <HeroSection
        title={`مرحباً ${user?.firstName || ""}!`}
        subtitle="لوحة تحكم المحاضر"
        description="تابع تقدمك، إدارة الكورسات، واطلع على أحدث الأنشطة."
        backgroundImage="/assets/images/hero-instructor.avif"
        primaryAction={{
          label: "إضافة كورس جديد",
          onClick: () => {/* ... */},
          icon: <PlayCircle />,
        }}
        features={[
          { icon: <School />, title: "كورساتك", description: "إدارة جميع الكورسات بسهولة" },
          { icon: <Group />, title: "طلابك", description: "تتبع تقدم الطلاب" },
          { icon: <EmojiEvents />, title: "إنجازاتك", description: "شاهد إنجازاتك وتكريماتك" },
        ]}
        variant="split"
        className="mb-8"
      />

      <Container maxWidth="lg" className="py-8">
        {/* إحصائيات سريعة */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <StatsCard title="إحصائيات سريعة" stats={stats} variant="compact" className="mb-8" />
        </motion.div>

        {/* الكورسات النشطة */}
        <Typography variant="h5" className="font-bold mb-4">كورساتك النشطة</Typography>
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {courses.map((course, idx) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.04, boxShadow: "0 8px 24px #a5b4fc55" }}>
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
                    <Box className="flex items-center gap-2 mt-2">
                      <Tooltip title="عدد الطلاب">
                        <Badge badgeContent={students.filter(s => s.course === course.title).length} color="primary">
                          <Group />
                        </Badge>
                      </Tooltip>
                      <Tooltip title="مستوى الكورس">
                        <Chip label={course.level || "-"} color="info" size="small" />
                      </Tooltip>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* جدول الطلاب */}
        <Box className="mt-12">
          <Typography variant="h5" className="font-bold mb-4">آخر الطلاب النشطين</Typography>
          <Paper elevation={1} className="p-4 rounded-xl bg-white/80 card-shadow mb-4">
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
                    <Box className="flex items-center gap-2">
                      <span>{params.value}%</span>
                      <Box className="w-8 h-8 relative">
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
                      </Box>
                    </Box>
                  ),
                },
              ]}
              rows={students}
              pageSize={5}
              checkboxSelection={false}
            />
          </Paper>
        </Box>

        {/* الإنجازات */}
        <Box className="mt-12">
          <Typography variant="h5" className="font-bold mb-4">إنجازاتك</Typography>
          <Grid container spacing={2}>
            {achievements.map((ach, idx) => (
              <Grid item xs={12} sm={6} md={3} key={ach.id}>
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" whileHover={{ scale: 1.08 }}>
                  <Paper elevation={2} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 card-shadow mb-2 animate-fade-in-up">
                    <Star className="text-yellow-500 text-3xl mb-2" />
                    <Typography variant="h6" className="font-bold mb-1 text-yellow-800">
                      {ach.type}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      {ach.value ? ach.value.toString() : "-"}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}