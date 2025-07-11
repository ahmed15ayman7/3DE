"use client";
import React, { useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";
import { instructorApi, lessonApi, attendanceApi ,courseApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { Users, School, CheckCircle, Download, Clock, X } from "lucide-react";

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
      { label: "متوسط نسبة الحضور", value: avg + "%", icon: <Users className="h-6 w-6" />, color: "blue" },
      { label: "إجمالي الطلاب", value: totalStudents, icon: <School className="h-6 w-6" />, color: "green" },
      { label: "أعلى نسبة حضور", value: max + "%", icon: <CheckCircle className="h-6 w-6" />, color: "purple" },
    ];
  }, [attendanceRecords]);

  // فلتر بحث
  const [search, setSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  // فلاتر متقدمة
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [studentSelectedCourse, setStudentSelectedCourse] = useState("");
  const [studentSelectedDate, setStudentSelectedDate] = useState<string>("");

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
      records = records.filter((r: any) => r.date === selectedDate);
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
      records = records.filter((r: any) => r.date === studentSelectedDate);
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
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          parseInt(params.value) >= 80 ? 'bg-green-100 text-green-800' :
          parseInt(params.value) >= 60 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {params.value}
        </span>
      )
    },
  ];

  const studentColumns = [
    { field: "name", headerName: "اسم الطالب", width: 200 },
    { field: "course", headerName: "الدورة", width: 200 },
    { field: "attendance", headerName: "الحضور", width: 100,
      renderCell: (params: any) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          params.value === "حاضر" ? 'bg-green-100 text-green-800' :
          params.value === "متأخر" ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {params.value}
        </span>
      )
    },
    { field: "date", headerName: "التاريخ", width: 150 },
    { field: "time", headerName: "الوقت", width: 100 },
    { field: "status", headerName: "الحالة", width: 100 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* العنوان والإحصائيات */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">إدارة الحضور والانصراف</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <h3 className="text-lg font-semibold">{stat.label}</h3>
              </div>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* سجلات الحضور */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">سجلات الحضور</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
              onClick={() => exportToExcel(filteredAttendanceRecords, "سجلات_الحضور.xlsx")}
            >
              <Download className="h-4 w-4" />
              تصدير Excel
            </button>
          </div>
          
          {/* فلاتر البحث */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">البحث</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="البحث بالدورة أو التاريخ..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تصفية بالدورة</label>
              <select
                className="w-full border rounded p-2"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value="">جميع الدورات</option>
                {allCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تصفية بالتاريخ</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {loadingAttendance ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <DataGrid
              columns={columns}
              rows={filteredAttendanceRecords}
              pageSize={10}
              checkboxSelection={false}
            />
          )}
        </div>
      </div>

      {/* حضور الطلاب */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">حضور الطلاب</h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              onClick={() => exportToExcel(filteredStudentAttendance, "حضور_الطلاب.xlsx")}
            >
              <Download className="h-4 w-4" />
              تصدير Excel
            </button>
          </div>
          
          {/* فلاتر البحث */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">البحث</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="البحث بالاسم أو الدورة..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تصفية بالدورة</label>
              <select
                className="w-full border rounded p-2"
                value={studentSelectedCourse}
                onChange={e => setStudentSelectedCourse(e.target.value)}
              >
                <option value="">جميع الدورات</option>
                {allCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تصفية بالتاريخ</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={studentSelectedDate}
                onChange={e => setStudentSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {loadingAttendance ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <DataGrid
              columns={studentColumns}
              rows={filteredStudentAttendance}
              pageSize={10}
              checkboxSelection={false}
            />
          )}
        </div>
      </div>

      {/* Drawer تفاصيل الطالب */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${drawerOpen ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">تفاصيل الطالب</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setDrawerOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {selectedStudent && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">الاسم</label>
                <p className="text-gray-700">{selectedStudent.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">الدورة</label>
                <p className="text-gray-700">{selectedStudent.course}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">الحضور</label>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  selectedStudent.attendance === "حاضر" ? 'bg-green-100 text-green-800' :
                  selectedStudent.attendance === "متأخر" ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedStudent.attendance}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium">التاريخ</label>
                <p className="text-gray-700">{selectedStudent.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">الوقت</label>
                <p className="text-gray-700">{selectedStudent.time}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Snackbar */}
      {snackbarOpen && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="rounded border px-4 py-3 shadow-lg border-green-500 bg-green-50">
            <p className="font-bold text-green-700">
              {snackbarMsg}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 