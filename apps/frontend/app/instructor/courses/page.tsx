"use client";
import React, { useState, useMemo, Suspense } from "react";
import dayjs, { Dayjs } from 'dayjs';
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";
import { instructorApi, courseApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Course } from "@shared/prisma";
import { Plus, Edit, Trash2, School, CheckCircle, Eye, Delete } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

const HeroSection = dynamic(() => import("@/components/common/HeroSection"), {
  ssr: false,
});
const DataGrid = dynamic(() => import("@/components/common/DataGrid"), {
  ssr: false,
});
const Skeleton = dynamic(() => import("@/components/common/Skeleton"), {
  ssr: false,
});

export default function InstructorCourses() {
  const { user } = useUser();
  const instructorId = user?.id;
  const queryClient = useQueryClient();
  const router = useRouter();

  // جلب الكورسات
  const {
    data: coursesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: () => instructorApi.getCourses(instructorId),
    enabled: !!instructorId,
    select: (res) => res.data,
  });

  // تقسيم الكورسات
  const activeCourses = useMemo(
    () => (coursesData || []).filter((c: any) => c.status === "ACTIVE"),
    [coursesData]
  );
  const pendingCourses = useMemo(
    () => (coursesData || []).filter((c: any) => c.status === "PENDING"),
    [coursesData]
  );
  const completedCourses = useMemo(
    () => (coursesData || []).filter((c: any) => c.status === "COMPLETED"),
    [coursesData]
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [courseForm, setCourseForm] = useState<any>({
    title: "",
    description: "",
    level: "",
    image: "",
    startDate: new Date(),
    status:"PENDING"
  });
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({ open: false, msg: "", type: "success" });
  const [loadingAction, setLoadingAction] = useState(false);

  // Mutations
  const addCourseMutation = useMutation({
    mutationFn: (data: Partial<Course>) => courseApi.create(data, user?.id),
    onSuccess: () => {
      refetch();
      setSnackbar({
        open: true,
        msg: "تم إضافة الدورة بنجاح!",
        type: "success",
      });
      setDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["instructor-courses", instructorId],
      });
    },
    onError: () =>
      setSnackbar({ open: true, msg: "حدث خطأ أثناء الإضافة!", type: "error" }),
  });
  const editCourseMutation = useMutation({
    mutationFn: ({ id, data }: any) => courseApi.update(id, data),
    onSuccess: () => {
      refetch();
      setSnackbar({
        open: true,
        msg: "تم تعديل الدورة بنجاح!",
        type: "success",
      });
      setDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["instructor-courses", instructorId],
      });
    },
    onError: () =>
      setSnackbar({ open: true, msg: "حدث خطأ أثناء التعديل!", type: "error" }),
  });
  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => courseApi.delete(id),
    onSuccess: () => {
      refetch();
      setSnackbar({ open: true, msg: "تم حذف الدورة بنجاح!", type: "success" });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["instructor-courses", instructorId],
      });
    },
    onError: () =>
      setSnackbar({ open: true, msg: "حدث خطأ أثناء الحذف!", type: "error" }),
  });

  // Handlers
  const handleOpenAdd = () => {
    setEditMode(false);
    setCourseForm({
      title: "",
      description: "",
      level: "",
      image: "",
      startDate: new Date(),
      status:"PENDING"
    });
    setDialogOpen(true);
  };
  const handleOpenEdit = (course: any) => {
    console.log(course);
    setEditMode(true);
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      level: course.level,
      image: course.image,
      startDate: course.startDate ? new Date(course.startDate) : new Date(),
      status: course.status,
    });
    setDialogOpen(true);
  };
  const handleSave = () => {
    setLoadingAction(true);
    if (editMode && selectedCourse) {
      editCourseMutation.mutate({ id: selectedCourse.id, data: courseForm });
    } else {
      addCourseMutation.mutate({ ...courseForm, academyId: user?.academyId });
    }
    setLoadingAction(false);
  };
  const handleDelete = (course: any) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    setLoadingAction(true);
    deleteCourseMutation.mutate(selectedCourse.id);
    setLoadingAction(false);
  };

  // DataGrid columns
  const completedColumns = [
    { field: "title", headerName: "عنوان الدورة", width: 200 },
    {
      field: "enrollments",
      headerName: "عدد الطلاب",
      width: 150,
      valueGetter: (row: any) => row?.row?.enrollments?.length || 0,
    },
    {
      field: "updatedAt",
      headerName: "تاريخ الإكمال",
      width: 150,
      valueGetter: (row: any) =>
        row?.row?.updatedAt ? row?.row?.updatedAt.split("T")[0] : "-",
    },
    {
      field: "averageGrade",
      headerName: "المعدل العام",
      width: 150,
      valueGetter: () => Math.floor(Math.random() * 20) + 80 + "%",
    },
    {
      field: "actions",
      headerName: "إجراءات",
      width: 120,
      renderCell: (row: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row.row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.row)}
          >
            <Delete className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={<Skeleton variant="rectangular" height={200} count={1} />}
      >
        <HeroSection
          title="إدارة موادي"
          subtitle={user?.firstName ? `مرحباً ${user.firstName}` : ""}
          description="يمكنك إضافة وتعديل وحذف الدورات الخاصة بك بكل سهولة."
          backgroundImage="/assets/images/courses-bg.jpg"
          animate
        />
      </Suspense>

      <div className="flex justify-between items-center my-8">
        <h2 className="text-2xl font-bold">
          دوراتي النشطة
        </h2>
        <Button
          onClick={handleOpenAdd}
          className="flex gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة دورة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <Skeleton variant="rectangular" height={180} />
            </div>
          ))
        ) : activeCourses.length === 0 ? (
          <p className="text-center w-full col-span-2">
            لا توجد دورات نشطة حالياً.
          </p>
        ) : (
          activeCourses.map((course: any, idx: number) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + idx * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    عدد الطلاب: {course.enrollments?.length || 0}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">التقدم</span>
                    <span className="font-medium">
                      {course.progress || Math.floor(Math.random() * 40) + 60}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${course.progress || Math.floor(Math.random() * 40) + 60}%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    آخر نشاط: {course.updatedAt ? course.updatedAt.split("T")[0] : "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    ميعاد البدأ: {course.startDate ? course.startDate.split("T")[0] : "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    الدرس التالي: {course.lessons?.[0]?.title || "-"}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/instructor/courses/${course.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(course)}
                      className="flex gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course)}
                      className="flex gap-2"
                    >
                      <Delete className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center my-8">
        <h2 className="text-2xl font-bold">
          دوراتي الغير نشطة
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <Skeleton variant="rectangular" height={180} />
            </div>
          ))
        ) : pendingCourses.length === 0 ? (
          <p className="text-center w-full col-span-2">
            لا توجد دورات غير نشطة حالياً.
          </p>
        ) : (
          pendingCourses.map((course: any, idx: number) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + idx * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    عدد الطلاب: {course.enrollments?.length || 0}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">التقدم</span>
                    <span className="font-medium">
                      {course.progress || Math.floor(Math.random() * 40) + 60}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${course.progress || Math.floor(Math.random() * 40) + 60}%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    آخر نشاط: {course.updatedAt ? course.updatedAt.split("T")[0] : "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    ميعاد البدأ: {course.startDate ? course.startDate.split("T")[0] : "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    الدرس التالي: {course.lessons?.[0]?.title || "-"}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/instructor/courses/${course.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(course)}
                      className="flex gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course)}
                      className="flex gap-2"
                    >
                      <Delete className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">
          الدورات المكتملة
        </h3>
        {isLoading ? (
          <Skeleton variant="rectangular" height={200} />
        ) : (
          <DataGrid
            columns={completedColumns}
            rows={completedCourses}
            pageSize={5}
            checkboxSelection={false}
          />
        )}
      </div>

      {/* Dialog إضافة/تعديل */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "تعديل الدورة" : "إضافة دورة جديدة"}
            </DialogTitle>
            <DialogDescription>
              {editMode ? "قم بتعديل معلومات الدورة" : "أدخل معلومات الدورة الجديدة"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="font-medium">عنوان الدورة</label>
              <Input
                id="title"
                value={courseForm.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCourseForm({ ...courseForm, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="font-medium">وصف الدورة</label>
              <textarea
                id="description"
                className="border rounded p-2 min-h-[80px]"
                value={courseForm.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setCourseForm({ ...courseForm, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="level" className="font-medium">المستوى</label>
              <select
                id="level"
                className="border rounded p-2"
                value={courseForm.level}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCourseForm({ ...courseForm, level: e.target.value })
                }
              >
                <option value="">اختر المستوى</option>
                <option value="مبتدئ">مبتدئ</option>
                <option value="متوسط">متوسط</option>
                <option value="متقدم">متقدم</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="image" className="font-medium">رابط صورة الدورة (اختياري)</label>
              <Input
                id="image"
                value={courseForm.image}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCourseForm({ ...courseForm, image: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="status" className="font-medium">حالة الدورة</label>
              <select
                id="status"
                className="border rounded p-2"
                value={courseForm.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCourseForm({ ...courseForm, status: e.target.value })
                }
              >
                <option value="PENDING">قيد المراجعة</option>
                <option value="ACTIVE">نشط</option>
                <option value="COMPLETED">مكتمل</option>
              </select>
            </div>

            {courseForm.status !== "COMPLETED" && (
              <div className="grid gap-2">
                <label className="font-medium">تاريخ البدء</label>
                <Input
                  type="date"
                  value={courseForm.startDate ? courseForm.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCourseForm({ ...courseForm, startDate: new Date(e.target.value) })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={loadingAction}
            >
              {editMode ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog حذف */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد حذف الدورة؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loadingAction}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`rounded border px-4 py-3 shadow-lg ${snackbar.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}`}>
            <p className={`font-bold ${snackbar.type === "error" ? "text-red-700" : "text-green-700"}`}>
              {snackbar.msg}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
