"use client";
import React, { useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";
import { instructorApi, lessonApi, attendanceApi ,courseApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Box, Grid, Typography, Button, InputAdornment, TextField, Snackbar, Alert, Drawer, IconButton, MenuItem } from "@mui/material";
import { School, Group, CheckCircle, Cancel, AccessTime, FileDownload } from "@mui/icons-material";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from "@mui/icons-material/Close";

const HeroSection = dynamic(() => import("@/components/common/HeroSection"), { ssr: false });
const StatsCard = dynamic(() => import("@/components/common/StatsCard"), { ssr: false });
const Card = dynamic(() => import("@/components/common/Card"), { ssr: false });
const DataGrid = dynamic(() => import("@/components/common/DataGrid"), { ssr: false });
const Avatar = dynamic(() => import("@/components/common/Avatar"), { ssr: false });
const Skeleton = dynamic(() => import("@/components/common/Skeleton"), { ssr: false });

const today = format(new Date(), "yyyy-MM-dd");

export default function InstructorAttendance() {
  const { user } = useUser();
  const instructorId = user?.id;

  // جلب كورسات المحاضر
  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: () => instructorApi.getCourses(instructorId),
    enabled: !!instructorId,
    select: (res) => res.data,
  });

  // جلب الدروس لكل كورس
  const { data: lessonsData, isLoading: loadingLessons } = useQuery({
    queryKey: ["instructor-lessons", instructorId],
    queryFn: async () => {
      if (!coursesData) return [];
      const allLessons = await Promise.all(
        coursesData.map((course) => courseApi.getLessons(course.id))
      );
      return allLessons.flatMap((res) => res.data);
    },
    enabled: !!coursesData,
  });

  // جلب حضور الطلاب لكل درس
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ["attendance-all", instructorId],
    queryFn: async () => {
      if (!lessonsData) return [];
      const allAttendance = await Promise.all(
        lessonsData.map((lesson) => attendanceApi.getByDateAndLesson(today, lesson.id).then((res) => res.data))
      );
      return allAttendance.flat();
    },
    enabled: !!lessonsData,
  });

  // تجهيز بيانات جدول "سجلات الحضور" (لكل درس)
  const attendanceRecords = useMemo(() => {
    if (!lessonsData || !attendanceData) return [];
    return lessonsData.map((lesson) => {
      const records = attendanceData.filter((a: any) => a.lessonId === lesson.id);
      const present = records.filter((a: any) => a.status === "PRESENT").length;
      const absent = records.filter((a: any) => a.status === "ABSENT").length;
      const late = records.filter((a: any) => a.status === "LATE").length;
      const total = records.length;
      const percentage = total ? Math.round((present / total) * 100) : 0;
      return {
        id: lesson.id,
        date: format(new Date(lesson.createdAt), "yyyy-MM-dd", { locale: arSA }),
        course: lesson.title,
        totalStudents: total,
        present,
        absent,
        late,
        percentage: percentage + "%",
      };
    });
  }, [lessonsData, attendanceData]);

  // تجهيز بيانات جدول "حضور الطلاب"
  const studentAttendance = useMemo(() => {
    if (!attendanceData || !lessonsData) return [];
    return attendanceData.map((a: any, i: number) => {
      const lesson = lessonsData.find((l: any) => l.id === a.lessonId);
      return {
        id: a.id,
        name: a.student?.firstName + " " + a.student?.lastName,
        course: lesson?.title,
        attendance: a.status === "PRESENT" ? "حاضر" : a.status === "ABSENT" ? "غائب" : "متأخر",
        date: format(new Date(a.createdAt), "yyyy-MM-dd", { locale: arSA }),
        time: format(new Date(a.createdAt), "hh:mm a", { locale: arSA }),
        status: a.status === "LATE" ? "متأخر" : a.status === "PRESENT" ? "في الوقت" : "غير مسجل",
      };
    });
  }, [attendanceData, lessonsData]);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    if (!attendanceRecords.length) return [];
    const avg = Math.round(
      attendanceRecords.reduce((acc: number, r: any) => acc + parseInt(r.percentage), 0) / attendanceRecords.length
    );
    const totalStudents = attendanceRecords.reduce((acc: number, r: any) => acc + r.totalStudents, 0);
    const max = Math.max(...attendanceRecords.map((r: any) => parseInt(r.percentage)));
    return [
      { label: "متوسط نسبة الحضور", value: avg + "%", icon: <Group fontSize="large" />, color: "primary" as const },
      { label: "إجمالي الطلاب", value: totalStudents, icon: <School fontSize="large" />, color: "success" as const },
      { label: "أعلى نسبة حضور", value: max + "%", icon: <CheckCircle fontSize="large" />, color: "info" as const },
    ];
  }, [attendanceRecords]);

  // فلتر بحث
  const [search, setSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  // فلاتر متقدمة
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [studentSelectedCourse, setStudentSelectedCourse] = useState("");
  const [studentSelectedDate, setStudentSelectedDate] = useState<Date | null>(null);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // جميع الدورات المتاحة
  const allCourses = useMemo(() => {
    if (!lessonsData) return [];
    const titles = lessonsData.map((l: any) => l.title);
    return Array.from(new Set(titles));
  }, [lessonsData]);

  // فلترة متقدمة لسجلات الحضور
  const filteredAttendanceRecords = useMemo(() => {
    let records = attendanceRecords;
    if (search) {
      records = records.filter((r: any) =>
        r.course?.includes(search) || r.date?.includes(search)
      );
    }
    if (selectedCourse) {
      records = records.filter((r: any) => r.course === selectedCourse);
    }
    if (selectedDate) {
      const d = format(selectedDate, "yyyy-MM-dd");
      records = records.filter((r: any) => r.date === d);
    }
    return records;
  }, [attendanceRecords, search, selectedCourse, selectedDate]);

  // فلترة متقدمة لحضور الطلاب
  const filteredStudentAttendance = useMemo(() => {
    let records = studentAttendance;
    if (studentSearch) {
      records = records.filter((r: any) =>
        r.name?.includes(studentSearch) || r.course?.includes(studentSearch) || r.date?.includes(studentSearch)
      );
    }
    if (studentSelectedCourse) {
      records = records.filter((r: any) => r.course === studentSelectedCourse);
    }
    if (studentSelectedDate) {
      const d = format(studentSelectedDate, "yyyy-MM-dd");
      records = records.filter((r: any) => r.date === d);
    }
    return records;
  }, [studentAttendance, studentSearch, studentSelectedCourse, studentSelectedDate]);

  // تصدير Excel مع Snackbar
  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName);
    setSnackbarMsg("تم تصدير البيانات بنجاح!");
    setSnackbarOpen(true);
  };

  // أعمدة الجداول مع تحسين الألوان
  const columns = [
    { field: "date", headerName: "التاريخ", width: 150 },
    { field: "course", headerName: "الدورة", width: 200 },
    { field: "totalStudents", headerName: "إجمالي الطلاب", width: 100 },
    { field: "present", headerName: "حاضر", width: 100 },
    { field: "absent", headerName: "غائب", width: 100 },
    { field: "late", headerName: "متأخر", width: 100 },
    { field: "percentage", headerName: "نسبة الحضور", width: 100,
      renderCell: (params: any) => (
        <span className={
          parseInt(params.value) >= 90 ? "text-green-600 font-bold" :
          parseInt(params.value) >= 75 ? "text-yellow-600 font-bold" :
          "text-red-600 font-bold"
        }>{params.value}</span>
      )
    },
  ];

    const studentColumns = [
    { field: "name", headerName: "اسم الطالب", width: 200,
      renderCell: (params: any) => (
        <Button color="primary" onClick={() => {
          setSelectedStudent(filteredStudentAttendance.find((s: any) => s.name === params.value));
          setDrawerOpen(true);
        }}>{params.value}</Button>
      )
    },
    { field: "course", headerName: "الدورة", width: 200 },
    { field: "attendance", headerName: "الحضور", width: 100 },
    { field: "date", headerName: "التاريخ", width: 150 },
    { field: "time", headerName: "الوقت", width: 100 },
    { field: "status", headerName: "الحالة", width: 100 },
  ];

  const loading = loadingCourses || loadingLessons || loadingAttendance;

    return (
    <Box className="container mx-auto px-4 py-8">
      <Suspense fallback={<Skeleton variant="rectangular" height={200} count={1} />}>
        <HeroSection
          title="تتبع الحضور للمحاضر"
          subtitle={user?.firstName ? `مرحباً ${user.firstName}` : ""}
          description="تابع حضور الطلاب في جميع الدورات مع إمكانية البحث والتصفية والتصدير."
          backgroundImage="/assets/images/attendance-bg.jpg"
          animate
        />
      </Suspense>

      <Box className="my-8">
        {loading ? (
          <Skeleton variant="rectangular" height={120} count={1} />
        ) : (
          <StatsCard stats={stats} animate />
        )}
      </Box>

      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card title="متوسط نسبة الحضور">
              <Typography className="text-4xl font-bold text-center">
                {stats[0]?.value || "-"}
              </Typography>
                </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Card title="إجمالي الطلاب">
              <Typography className="text-4xl font-bold text-center">
                {stats[1]?.value || "-"}
              </Typography>
                </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <Card title="أعلى نسبة حضور">
              <Typography className="text-4xl font-bold text-center">
                {stats[2]?.value || "-"}
              </Typography>
                </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* جدول سجلات الحضور */}
      <Box className="mb-8">
        <Box className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Typography variant="h5" className="font-bold text-right">سجلات الحضور</Typography>
          <Box className="flex gap-2 w-full md:w-auto">
            <TextField
              select
              label="الدورة"
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              size="small"
              className="bg-white min-w-[120px]"
            >
              <MenuItem value="">الكل</MenuItem>
              {allCourses.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={arSA}>
              <DatePicker
                label="التاريخ"
                value={selectedDate}
                onChange={(value) => setSelectedDate(value as Date)}
                slotProps={{ textField: { size: "small", className: "bg-white min-w-[120px]" } }}
              />
            </LocalizationProvider>
            <TextField
              placeholder="بحث عن الدورة أو التاريخ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              className="bg-white"
              InputProps={{
                startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownload />}
              onClick={() => exportToExcel(filteredAttendanceRecords, "attendance-records.xlsx")}
            >
              تصدير Excel
            </Button>
          </Box>
        </Box>
        {loading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <DataGrid columns={columns} rows={filteredAttendanceRecords} pageSize={8} checkboxSelection />
        )}
      </Box>

      {/* جدول حضور الطلاب */}
      <Box>
        <Box className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Typography variant="h5" className="font-bold text-right">حضور الطلاب</Typography>
          <Box className="flex gap-2 w-full md:w-auto">
            <TextField
              select
              label="الدورة"
              value={studentSelectedCourse}
              onChange={e => setStudentSelectedCourse(e.target.value)}
              size="small"
              className="bg-white min-w-[120px]"
            >
              <MenuItem value="">الكل</MenuItem>
              {allCourses.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={arSA}>
              <DatePicker
                label="التاريخ"
                value={studentSelectedDate}
                onChange={(value) => setStudentSelectedDate(value as Date)}
                slotProps={{ textField: { size: "small", className: "bg-white min-w-[120px]" } }}
              />
            </LocalizationProvider>
            <TextField
              placeholder="بحث عن اسم الطالب أو الدورة أو التاريخ..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              size="small"
              className="bg-white"
              InputProps={{
                startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownload />}
              onClick={() => exportToExcel(filteredStudentAttendance, "student-attendance.xlsx")}
            >
              تصدير Excel
            </Button>
          </Box>
        </Box>
        {loading ? (
          <Skeleton variant="rectangular" height={300} />
        ) : (
          <DataGrid columns={studentColumns} rows={filteredStudentAttendance} pageSize={8} checkboxSelection />
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>

      {/* Drawer تفاصيل الطالب */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box className="w-80 p-6" role="presentation">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-bold">تفاصيل الطالب</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          {selectedStudent && (
            <>
              <Avatar name={selectedStudent.name} size="xl" />
              <Typography className="mt-4 font-bold">{selectedStudent.name}</Typography>
              <Typography className="text-gray-600">الدورة: {selectedStudent.course}</Typography>
              <Typography className="text-gray-600">الحضور: {selectedStudent.attendance}</Typography>
              <Typography className="text-gray-600">التاريخ: {selectedStudent.date}</Typography>
              <Typography className="text-gray-600">الوقت: {selectedStudent.time}</Typography>
              <Typography className="text-gray-600">الحالة: {selectedStudent.status}</Typography>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
    );
} 