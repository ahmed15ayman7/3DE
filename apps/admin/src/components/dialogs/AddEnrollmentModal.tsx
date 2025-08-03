import React, { useState } from 'react';
import { Modal, Input, Button, Select, toast, LoadingSpinner } from '@3de/ui';
import { courseApi, enrollmentApi, userApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { EnrollmentStatus } from '@3de/interfaces';

const formSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  status: z.string(),
});

const AddEnrollmentModal = ({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) => {
  let [searchStudent, setSearchStudent] = useState<string>('STUDENT');
  let {data: students, isLoading: isLoadingStudents} = useQuery({
    queryKey: ['students'],
    queryFn: () => userApi.getAll(0,10,searchStudent), 
    enabled: isOpen,
  });
  let {data: courses, isLoading: isLoadingCourses} = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
    enabled: isOpen,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
      status: 'PENDING' as EnrollmentStatus,
    },
  });

  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading('جاري اضافة الطالب...');
    try {
      await enrollmentApi.create({userId: dataFull.studentId, courseId: dataFull.courseId, status: dataFull.status as EnrollmentStatus,progress: 0});
      onClose();
      refetch();
      toast.dismiss(toastId);
      toast.success('تم اضافة الطالب بنجاح');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ ما');
    }
  };

  return (
    <Modal title={`اضافة طالب لدورة`} isOpen={isOpen} onClose={onClose} size="sm">
     {isLoadingStudents || isLoadingCourses ? <LoadingSpinner /> : <div className="flex flex-col gap-4 max-w-sm">
        <Input
          label="بحث عن طالب"
          placeholder="بحث عن طالب"
          icon={<SearchIcon />}
          className="w-full"
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
        />
        <Select
          label="اختر الطالب"
          {...form.register('studentId')}
          onChange={(e) => form.setValue('studentId', e.target.value)}
          error={form.formState.errors.studentId?.message}
          options={students?.data.map((student) => ({
            label: student.firstName + ' ' + student.lastName || '',
            value: student.id,
          }))||[]}
        />
        <Select
          label="اختر الدورة"
          {...form.register('courseId')}
          onChange={(e) => form.setValue('courseId', e.target.value)}
          error={form.formState.errors.courseId?.message}
          options={courses?.data.map((course) => ({
            label: course.title || '',
            value: course.id,
          }))||[]}
        />
        <Select
          label="اختر الحالة"
          {...form.register('status')}
          onChange={(e) => form.setValue('status', e.target.value)}
          error={form.formState.errors.status?.message}
          options={['PENDING', 'ACTIVE', 'COMPLETED'].map((status) => ({
            label: status==='PENDING' ? 'قيد الانتظار' : status==='ACTIVE' ? 'نشط' : 'مكتمل',
            value: status,
          }))}
        />
      </div>}
      <div className="flex justify-center py-5">
        <Button type="submit" onClick={() => onSubmit(form.getValues())}>
         اضافة الطالب
        </Button>
      </div>
    </Modal>
  );
};

export default AddEnrollmentModal;
