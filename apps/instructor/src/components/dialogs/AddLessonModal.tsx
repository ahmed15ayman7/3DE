import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select, toast, Textarea } from '@3de/ui';
import {  lessonApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Lesson } from '@3de/interfaces';

const formSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  courseId: z.string().min(1),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'NOT_STARTED']),
});

const AddLessonModal = ({
  isEdit,
  courseId,
  isOpen,
  onClose,
  refetch,
  lesson,
}: {
  isEdit?: boolean;
  courseId:string;
  isOpen: boolean;
  lesson?: Lesson;
  onClose: () => void;
  refetch: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      courseId: courseId,
      status: 'NOT_STARTED',
    },
  });
  useEffect(()=>{
    if(isEdit){
      form.setValue('title',lesson?.title || '')
      form.setValue('content',lesson?.content || '')
      form.setValue('courseId',lesson?.courseId || '')
      form.setValue('status',lesson?.status || 'NOT_STARTED')
    }

  },[isEdit])
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading(`جاري ${isEdit ? 'تعديل' : 'إضافة'} الدرس...`);
    try {
       isEdit?await lessonApi.update(lesson?.id || '',{
        ...dataFull,
        courseId: courseId,
       }):await lessonApi.create({
          ...dataFull,
          courseId: courseId,
        });
        refetch();
      toast.dismiss(toastId);
      toast.success(`تم ${isEdit ? 'تعديل' : 'إضافة'} الدرس بنجاح`);
      onClose();
      form.reset()
    } catch (error) {
      toast.dismiss(toastId);
      console.log(error);
      toast.error('حدث خطأ ما');
    }
  };

  return (
    <Modal title={` ${isEdit ? 'تعديل' : 'إضافة'} درس`} isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          label="اسم الدرس"
          placeholder="اسم الدرس"
          {...form.register('title')}
          onChange={(e) => form.setValue('title', e.target.value)}
          error={form.formState.errors.title?.message}
        />
          <Select
            label="حالة الدرس"
            options={['IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'].map((type: string) => ({
              label: type==='IN_PROGRESS'?'قيد الاكمال':type==='COMPLETED'?'منتهي':type==='NOT_STARTED'?'لم يبدأ':'',
              value: type,
            }))}
            {...form.register('status')}
            error={form.formState.errors.status?.message}
          />
        <Textarea
          label="المحتوى"
          className='w-full'
          placeholder={`ادخل المحتوى هنا`}
          {...form.register('content')}
          onChange={(e) => form.setValue('content', e.target.value)}
          error={form.formState.errors.content?.message}
        />
      </div>
      <div className="flex justify-center py-5">
        <Button type="submit" onClick={() => onSubmit(form.getValues())}>
            {isEdit ? 'تعديل الدرس' : 'إضافة الدرس'}
        </Button>
      </div>
    </Modal>
  );
};

export default AddLessonModal;
