import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select, toast, Textarea, Switch } from '@3de/ui';
import {  fileApi, lessonApi, quizApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Lesson, FileType, Quiz } from '@3de/interfaces';
import VideoPlayer from '../files/VideoPlayer';

const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    lessonId: z.string().min(1),
    timeLimit: z.number().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    upComing: z.boolean(),
    isCompleted: z.boolean(),
    courseId: z.string().min(1),

});

const AddQuizModal = ({
  isEdit,
  courseId,
  isOpen,
  onClose,
  refetch,
  quiz,
  lessons,
  lessonId,
}: {
  isEdit?: boolean;
  courseId:string;
  isOpen: boolean;
  quiz: Quiz;
  onClose: () => void;
  refetch: () => void;
  lessons: Lesson[];
  lessonId?:string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      lessonId: lessonId || '',
      timeLimit: 0,
      upComing: false,
      isCompleted: false,
      courseId: courseId,
    },
  });
  console.log(quiz)
  useEffect(()=>{
    if(isEdit){
      form.setValue('title',quiz.title)
      form.setValue('description',quiz.description)
      form.setValue('lessonId',quiz.lessonId)
      form.setValue('timeLimit',quiz.timeLimit)
      form.setValue('upComing',quiz.upComing)
      form.setValue('isCompleted',quiz.isCompleted)
      form.setValue('courseId',quiz.courseId)
      form.setValue('startDate',quiz.startDate ? new Date(quiz.startDate) : undefined)
      form.setValue('endDate',quiz.endDate ? new Date(quiz.endDate) : undefined)
    }

  },[isEdit])
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading(`جاري ${isEdit ? 'تعديل' : 'إضافة'} الدرس...`);
    try {
       isEdit?await quizApi.update(quiz.id as string,{
        ...dataFull,
        courseId: courseId,
        timeLimit:+(dataFull.timeLimit || 0),
        lessonId: dataFull.lessonId,
        startDate: dataFull.startDate ? new Date(dataFull.startDate) : undefined,
        endDate: dataFull.endDate ? new Date(dataFull.endDate) : undefined,
       }):await quizApi.create({
          ...dataFull,
          timeLimit:+(dataFull.timeLimit || 0),
          courseId: courseId,
          lessonId: dataFull.lessonId,
          startDate: dataFull.startDate ? new Date(dataFull.startDate) : undefined,
          endDate: dataFull.endDate ? new Date(dataFull.endDate) : undefined,
        });
        refetch();
      toast.dismiss(toastId);
      toast.success(`تم ${isEdit ? 'تعديل' : 'إضافة'} الاختبار بنجاح`);
      onClose();
      form.reset()
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ ما');
    }
  };

  return (
    <Modal title={` ${isEdit ? 'تعديل' : 'إضافة'} اختبار`} isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4">
        <Select
          label="الدرس"
          disabled={isEdit}
          options={lessons.map((lesson) => ({
            label: lesson.title,
            value: lesson.id,
          }))}
          {...form.register('lessonId')}
          onChange={(e) => form.setValue('lessonId', e.target.value)}
          error={form.formState.errors.lessonId?.message}
        />
        <Input
          type="text"
          label="اسم الاختبار"
          placeholder="اسم الاختبار"
          {...form.register('title')}
          onChange={(e) => form.setValue('title', e.target.value)}
          error={form.formState.errors.title?.message}
        />
          
        <Textarea
          label="الوصف"
          className='w-full'
          placeholder={`ادخل الوصف هنا`}
          {...form.register('description')}
          onChange={(e) => form.setValue('description', e.target.value)}
          error={form.formState.errors.description?.message}
        />
        <Input
          type="number"
          label="الوقت المحدد بالدقائق"
          placeholder="الوقت المحدد بالدقائق"
          {...form.register('timeLimit')}
          onChange={(e) => form.setValue('timeLimit', parseInt(e.target.value))}
          error={form.formState.errors.timeLimit?.message}
        />
        <div className="flex justify-between gap-2">

        <Input
          type="date"
          label="التاريخ البدء"
          placeholder="التاريخ البدء"
          {...form.register('startDate')}
          error={form.formState.errors.startDate?.message}
          />
        <Input
          type="date"
          label="التاريخ الانتهاء"
          placeholder="التاريخ الانتهاء"
          {...form.register('endDate')}
          error={form.formState.errors.endDate?.message}
          />
          </div>
        <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>الاختبار قيد التنفيذ</span>
        <Switch
          checked={form.watch('upComing')}
          onChange={(checked) => form.setValue('upComing', checked)}
          />
          </div>
        <div className="flex items-center gap-2">
          <span>الاختبار منتهي</span>
        <Switch
          checked={form.watch('isCompleted')}
          onChange={(checked) => form.setValue('isCompleted', checked)}
          />
          </div>
        </div>
        </div>
        <div className="flex justify-center py-5">
        <Button type="submit" onClick={() => onSubmit(form.getValues())}>
            {isEdit ? 'تعديل الاختبار' : 'إضافة الاختبار'}
        </Button>
      </div>
    </Modal>
  );
};

export default AddQuizModal;
