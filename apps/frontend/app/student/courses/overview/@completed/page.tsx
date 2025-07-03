// Parallel Route: الكورسات المكتملة
'use client';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import { courseApi } from '@/lib/api';
import { Course, Instructor, Lesson, Quiz, User, File as FileModel } from '@shared/prisma';

const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div /> });

// جلب بيانات الكورسات المكتملة
let getCoursesData = async (id: string) => {
  const response = await courseApi.getByStudentId(id);
  return response.data;
};

export default function CompletedCoursesTab() {
  let { user } = useUser();
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCoursesData(user?.id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  // تصفية الكورسات المكتملة فقط
  const completedCourses = Array.isArray(courses)
    ? courses.filter((course) => course.status === 'COMPLETED')
    : [];

  // أعمدة الجدول
  const completedColumns = [
    { field: 'title', headerName: 'عنوان الكورس', width: 200 },
    { field: 'instructor', headerName: 'المدرس', width: 150 },
    { field: 'completionDate', headerName: 'تاريخ الإكمال', width: 150 },
    { field: 'grade', headerName: 'الدرجة', width: 100 },
    {
      field: 'certificate',
      headerName: 'الشهادة',
      width: 400,
      renderCell: (params: any) => (
        <img src={params.row.certificate} alt="certificate" className="w-16 h-16 border border-primary-main p-1" onClick={() => {}} />
      ),
    },
  ];

  return (
    <div>
      <DataGrid columns={completedColumns} rows={completedCourses} pageSize={5} checkboxSelection={false} />
    </div>
  );
} 