"use client";
import React, { useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/useUser";
import { instructorApi, courseApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  MenuItem,
  CircularProgress,
  Select,
} from "@mui/material";
import { Add, Edit, Delete, School, CheckCircle, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Course } from "@shared/prisma";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import router from "next/router";

const HeroSection = dynamic(() => import("@/components/common/HeroSection"), {
  ssr: false,
});
const Card = dynamic(() => import("@/components/common/Card"), { ssr: false });
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
    setEditMode(true);
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      level: course.level,
      image: course.image,
      startDate: course.startDate,
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
      valueGetter: (row: any) => row?.enrollments?.length || 0,
    },
    {
      field: "updatedAt",
      headerName: "تاريخ الإكمال",
      width: 150,
      valueGetter: (row: any) =>
        row?.updatedAt ? row?.updatedAt.split("T")[0] : "-",
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
        <Box className="flex gap-2">
          <IconButton
            color="primary"
            onClick={() => handleOpenEdit(row)}
          >
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className="container mx-auto px-4 py-8">
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

      <Box className="flex justify-between items-center my-8">
        <Typography variant="h4" className="font-bold">
          دوراتي النشطة
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenAdd}
        >
          إضافة دورة جديدة
        </Button>
      </Box>

      <Grid container spacing={3} className="mb-8">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton variant="rectangular" height={180} />
            </Grid>
          ))
        ) : activeCourses.length === 0 ? (
          <Typography className="text-center w-full">
            لا توجد دورات نشطة حالياً.
          </Typography>
        ) : (
          activeCourses.map((course: any, idx: number) => (
            <Grid item xs={12} md={6} key={course.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 + idx * 0.2 }}
              >
                <Card
                  title={course.title}
                  description={`عدد الطلاب: ${course.enrollments?.length || 0}`}
                  className="h-full"
                >
                  <Box className="mt-4 space-y-2">
                    <Box className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 ">التقدم</span>
                      <span className="font-medium">
                        {course.progress || Math.floor(Math.random() * 40) + 60}
                        %
                      </span>
                    </Box>
                    <Box className="w-full bg-gray-200 rounded-full h-2">
                      <Box
                        className="bg-primary-main h-2 rounded-full"
                        style={{
                          width: `${
                            course.progress ||
                            Math.floor(Math.random() * 40) + 60
                          }%`,
                        }}
                      />
                    </Box>
                    <Box className="text-sm text-gray-600 ">
                      آخر نشاط:{" "}
                      {course.updatedAt ? course.updatedAt.split("T")[0] : "-"}
                    </Box>
                    <Box className="text-sm text-gray-600 ">
                       ميعاد البدأ:{" "}
                      {course.startDate ? course.startDate.split("T")[0] : "-"}
                    </Box>
                    <Box className="text-sm text-gray-600 ">
                      الدرس التالي: {course.lessons?.[0]?.title || "-"}
                    </Box>
                    <Box className="flex gap-2 mt-2">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => router.push(`/instructor/courses/${course.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Edit />}
                        className="flex gap-4"
                        onClick={() => handleOpenEdit(course)}
                        >
                        تعديل
                      </Button>
                      <Button
                        size="small"
                        className="flex gap-4"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(course)}
                      >
                        حذف
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
      <Box className="flex justify-between items-center my-8">
        <Typography variant="h4" className="font-bold">
          دوراتي الغير نشطة
        </Typography>
      </Box>
      <Grid container spacing={3} className="mb-8">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton variant="rectangular" height={180} />
            </Grid>
          ))
        ) : pendingCourses.length === 0 ? (
          <Typography className="text-center w-full">
            لا توجد دورات نشطة حالياً.
          </Typography>
        ) : (
          pendingCourses.map((course: any, idx: number) => (
            <Grid item xs={12} md={6} key={course.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 + idx * 0.2 }}
              >
                <Card
                  title={course.title}
                  description={`عدد الطلاب: ${course.enrollments?.length || 0}`}
                  className="h-full"
                >
                  <Box className="mt-4 space-y-2">
                    <Box className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 ">التقدم</span>
                      <span className="font-medium">
                        {course.progress || Math.floor(Math.random() * 40) + 60}
                        %
                      </span>
                    </Box>
                    <Box className="w-full bg-gray-200 rounded-full h-2">
                      <Box
                        className="bg-primary-main h-2 rounded-full"
                        style={{
                          width: `${
                            course.progress ||
                            Math.floor(Math.random() * 40) + 60
                          }%`,
                        }}
                      />
                    </Box>
                    <Box className="text-sm text-gray-600 ">
                      آخر نشاط:{" "}
                      {course.updatedAt ? course.updatedAt.split("T")[0] : "-"}
                    </Box>
                    <Box className="text-sm text-gray-600 ">
                       ميعاد البدأ:{" "}
                      {course.startDate ? course.startDate.split("T")[0] : "-"}
                    </Box>
                    <Box className="text-sm text-gray-600 ">
                      الدرس التالي: {course.lessons?.[0]?.title || "-"}
                    </Box>
                    <Box className="flex gap-2 mt-2">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => router.push(`/instructor/courses/${course.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Edit />}
                        className="flex gap-4"
                        onClick={() => handleOpenEdit(course)}
                        >
                        تعديل
                      </Button>
                      <Button
                        size="small"
                        className="flex gap-4"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(course)}
                      >
                        حذف
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>

      <Box>
        <Typography variant="h5" className="font-bold mb-4">
          الدورات المكتملة
        </Typography>
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
      </Box>

      {/* Dialog إضافة/تعديل */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editMode ? "تعديل الدورة" : "إضافة دورة جديدة"}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-5">
          <TextField
            label="عنوان الدورة"
            value={courseForm.title}
            onChange={(e) =>
              setCourseForm({ ...courseForm, title: e.target.value })
            }
            fullWidth
            className="mb-4"
          />

          <TextField
            label="وصف الدورة"
            value={courseForm.description}
            onChange={(e) =>
              setCourseForm({ ...courseForm, description: e.target.value })
            }
            fullWidth
            className="mb-4"
            multiline
            rows={3}
          />
          <TextField
            label="المستوى"
            value={courseForm.level}
            onChange={(e) =>
              setCourseForm({ ...courseForm, level: e.target.value })
            }
            select
            fullWidth
            className="mb-4"
          >
            <MenuItem value="مبتدئ">مبتدئ</MenuItem>
            <MenuItem value="متوسط">متوسط</MenuItem>
            <MenuItem value="متقدم">متقدم</MenuItem>
          </TextField>
          <TextField
            label="رابط صورة الدورة (اختياري)"
            value={courseForm.image}
            onChange={(e) =>
              setCourseForm({ ...courseForm, image: e.target.value })
            }
            fullWidth
            className="mb-4"
          />
          <Select
            label="حالة الدورة"
            value={courseForm.status}
            onChange={(e) =>
              setCourseForm({ ...courseForm, status: e.target.value })
            }
            fullWidth
            className="mb-4"
          >
            <MenuItem value="PENDING">قيد المراجعة</MenuItem>
            <MenuItem value="ACTIVE">نشط</MenuItem>
            <MenuItem value="COMPLETED">مكتمل</MenuItem>
          </Select>
          {(courseForm.status !== "COMPLETED") && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="تاريخ البدء"
                value={courseForm.startDate}
                format="DD/MM/YYYY"
                onChange={(e) => setCourseForm({ ...courseForm, startDate: e })}
                className="mb-4 flex flex-row-reverse text-center"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    
                  },
                }}
              />
            </LocalizationProvider>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loadingAction}
          >
            {editMode ? "حفظ التعديلات" : "إضافة"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog حذف */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد أنك تريد حذف الدورة؟ لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loadingAction}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
