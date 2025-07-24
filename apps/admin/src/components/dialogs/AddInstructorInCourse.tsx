import React, { useState } from 'react';
import { Modal, Input, Button, Select, toast, Textarea } from '@3de/ui';
import { courseApi, instructorApi, userApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseStatus } from '@3de/interfaces';
import { useQuery } from '@tanstack/react-query';
import { User } from '@3de/interfaces';

const formSchema = z.object({
  instructorId: z.string(),
});

const AddInstructorInCourse = ({
  isOpen,
  onClose,
  refetch,
  courseId,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  courseId: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instructorId: '',
    },
  });
  const { data: instructors } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => instructorApi.getAll(0,100,""),
  });
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading('جاري إضافة المحاضر...');
    try {
      await courseApi.addInstructor(courseId, dataFull.instructorId);
      toast.dismiss(toastId);
      toast.success('تم إضافة المحاضر بنجاح');
      onClose();
      refetch();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ ما');
    }
  };


  return (
    <Modal title="إضافة محاضر للدورة" isOpen={isOpen} onClose={onClose} size="sm">
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <div className=""></div>
        <Select
          label="اختر المحاضر"
          {...form.register('instructorId')}
          onChange={(e) => form.setValue('instructorId', e.target.value)}
          error={form.formState.errors.instructorId?.message}
          options={instructors?.data.map((instructor) => ({
            label: instructor.user?.firstName + ' ' + instructor.user?.lastName || '',
            value: instructor.user?.id,
          }))||[]}
        />
          <div className=""></div>
      </div>
      <div className="flex justify-center py-5">
        <Button type="submit" onClick={() => onSubmit(form.getValues())}>
          إضافة محاضر للدورة
        </Button>
      </div>
    </Modal>
  );
};

export default AddInstructorInCourse;
