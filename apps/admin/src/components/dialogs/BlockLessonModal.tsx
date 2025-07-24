import React, { useState } from 'react';
import { Modal, Input, Button, Select, toast, Textarea, Switch } from '@3de/ui';
import { courseApi, instructorApi, lessonApi, userApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseStatus, Lesson } from '@3de/interfaces';
import { useQuery } from '@tanstack/react-query';
import { User } from '@3de/interfaces';

const formSchema = z.object({
  studentId: z.string(),
  isBlocked: z.boolean(),
});

const BlockLessonModal = ({
  isOpen,
  onClose,
  refetch,
  lesson,
  students
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  lesson: Lesson;
  students: User[];
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      isBlocked: false,
    },
  });
  // i need 
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading(dataFull.isBlocked ? 'جاري حظر الطالب...' : 'جاري إلغاء الحظر...');
    try {
      await lessonApi.updateBlockList(lesson.id, dataFull.studentId, dataFull.isBlocked);
      toast.dismiss(toastId);
      toast.success(dataFull.isBlocked ? 'تم حظر الطالب بنجاح' : 'تم إلغاء الحظر بنجاح');
      onClose();
      refetch();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ ما');
    }
  };


  return (
    <Modal title={`حظر طالب من محاضرة ${lesson?.title || '' }`} isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4 max-w-sm">
        <Select
          label="اختر الطالب"
          {...form.register('studentId')}
          onChange={(e) => form.setValue('studentId', e.target.value)}
          error={form.formState.errors.studentId?.message}
          options={students.map((student) => ({
            label: student.firstName + ' ' + student.lastName || '',
            value: student.id,
          }))}
        />
          <Switch
            checked={lesson?.LessonWhiteList?.filter((whiteList) => whiteList.userId === form.watch('studentId'))?.[0]?.isBlocked}
            onChange={(checked) => form.setValue('isBlocked', checked as boolean)}
          />
      </div>
      <div className="flex justify-center py-5">
        <Button type="submit" onClick={() => onSubmit(form.getValues())}>
         {form.watch('isBlocked') ? "حظر الطالب" : "إلغاء الحظر"}
        </Button>
      </div>
    </Modal>
  );
};

export default BlockLessonModal;
