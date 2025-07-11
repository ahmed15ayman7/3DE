"use client";
import React, { useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";
import { instructorApi, lessonApi, attendanceApi, enrollmentApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const HeroSection = dynamic(() => import("@/components/common/HeroSection"), { ssr: false });
const StatsCard = dynamic(() => import("@/components/common/StatsCard"), { ssr: false });
const Card = dynamic(() => import("@/components/common/Card"), { ssr: false });
const DataGrid = dynamic(() => import("@/components/common/DataGrid"), { ssr: false });
const Avatar = dynamic(() => import("@/components/common/Avatar"), { ssr: false });
const Skeleton = dynamic(() => import("@/components/common/Skeleton"), { ssr: false });

const today = format(new Date(), "yyyy-MM-dd");

export default function InstructorDailyTracking() {
  const { user } = useUser();
  const instructorId = user?.id;

  // جلب كورسات المحاضر
  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: () => instructorApi.getCourses(instructorId),
    enabled: !!instructorId,
    select: (res) => res.data,
  });

  // جلب الدروس اليوم من كل كورس
  const { data: lessonsData, isLoading: loadingLessons } = useQuery({
    queryKey: ["instructor-lessons", instructorId, today],
    queryFn: async () => {
      if (!coursesData) return [];
      const allLessons = await Promise.all(
        coursesData.map((course) => lessonApi.getByCourse(course.id))
      );
      // فلترة الدروس لليوم الحالي فقط
      return allLessons
        .flatMap((res) => res.data)
        .filter((lesson) => format(new Date(lesson.createdAt), "yyyy-MM-dd") === today);
    },
    enabled: !!coursesData,
  });

  // جلب حضور الطلاب اليوم
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ["attendance", today],
    queryFn: () => attendanceApi.getByDate(today).then((res) => res.data),
  });

  // حساب إحصائيات سريعة
  const stats = useMemo(() => {
    if (!attendanceData || !lessonsData) return [];
    const present = attendanceData.filter((a: any) => a.status === "PRESENT").length;
    const absent = attendanceData.filter((a: any) => a.status === "ABSENT").length;
    const late = attendanceData.filter((a: any) => a.status === "LATE").length;
    return [
      {
        label: "الحصص اليوم",
        value: lessonsData.length,
        icon: <Clock className="h-8 w-8" />, color: "primary" as const,
      },
      {
        label: "طلاب حاضرين",
        value: present,
        icon: <CheckCircle className="h-8 w-8" />, color: "success" as const,
      },
      {
        label: "طلاب غائبين",
        value: absent,
        icon: <XCircle className="h-8 w-8" />, color: "error" as const,
      },
      {
        label: "طلاب متأخرين",
        value: late,
        icon: <AlertCircle className="h-8 w-8" />, color: "warning" as const,
      },
    ];
  }, [attendanceData, lessonsData]);

  // تجهيز بيانات الطلاب (من enrollments)
  const students = useMemo(() => {
    if (!coursesData) return [];
    const allEnrollments = coursesData.flatMap((c: any) => c.enrollments || []);
    // دمج الطلاب بدون تكرار
    const unique: Record<string, any> = {};
    allEnrollments.forEach((e: any) => {
      if (e.user) unique[e.user.id] = e.user;
    });
    return Object.values(unique);
  }, [coursesData]);

  // تجهيز بيانات الجدول اليومي
  const dailyRows = useMemo(() => {
    if (!lessonsData || !students) return [];
    return lessonsData.flatMap((lesson: any) =>
      (students as any[]).map((student: any) => ({
        id: `${lesson.id}-${student.id}`,
        student: student.firstName + " " + student.lastName,
        subject: lesson.title,
        time: format(new Date(lesson.createdAt), "hh:mm a", { locale: arSA }),
        status: attendanceData?.find((a: any) => a.studentId === student.id && a.lessonId === lesson.id)?.status || "غير محدد",
      }))
    );
  }, [lessonsData, students, attendanceData]);

  // أعمدة الجدول
  const columns = [
    {
      field: "student",
      headerName: "الطالب",
      width: 180,
      renderCell: (params: any) => (
        <div className="flex items-center gap-2">
          <Avatar name={params.value} size="sm" />
          <span>{params.value}</span>
        </div>
      ),
    },
    { field: "subject", headerName: "المادة", width: 150 },
    { field: "time", headerName: "الوقت", width: 120 },
    { field: "status", headerName: "الحالة", width: 120 },
  ];

  // حالة التحميل
  const loading = loadingCourses || loadingLessons || loadingAttendance;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Skeleton height={200} />}>
        <HeroSection
          title="المتابعة اليومية للمحاضر"
          subtitle={user?.firstName ? `مرحباً ${user.firstName}` : ""}
          description="تابع حضور الطلاب وجدول الحصص اليومية بشكل تفاعلي واحترافي."
          backgroundImage="/assets/images/teacher-bg.avif"
          animate
        />
      </Suspense>

      <div className="my-8">
        {loading ? (
          <Skeleton height={120} />
        ) : (
          <StatsCard stats={stats} animate />
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-right">بطاقات الطلاب</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} height={140} />
            ))
          : (students as any[]).map((student: any) => (
              <motion.div key={student.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card title={student.firstName + " " + student.lastName}>
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar src={student.avatar} name={student.firstName + " " + student.lastName} size="lg" />
                    <div>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    </div>
                  </div>
                  <p className="text-right text-primary-main font-bold">
                    آخر حضور: {attendanceData?.find((a: any) => a.studentId === student.id)?.createdAt ? format(new Date(attendanceData.find((a: any) => a.studentId === student.id).createdAt), "hh:mm a", { locale: arSA }) : "-"}
                  </p>
                </Card>
              </motion.div>
            ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-right">الجدول اليومي</h2>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <Skeleton height={300} />
        ) : (
          <DataGrid columns={columns} rows={dailyRows} pageSize={8} checkboxSelection />
        )}
      </div>
    </div>
  );
} 