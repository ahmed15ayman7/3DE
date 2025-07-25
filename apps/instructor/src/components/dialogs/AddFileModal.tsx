import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select, toast, Textarea } from '@3de/ui';
import {  fileApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Lesson, FileType } from '@3de/interfaces';
import VideoPlayer from '../files/VideoPlayer';

const formSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  type: z.enum(['VIDEO', 'AUDIO', 'PDF', 'DOCUMENT', 'IMAGE', 'OTHER']),
  isCompleted: z.boolean(),
  lastWatched: z.number().optional(),
  lessonId: z.string().optional(),
});

const AddFileModal = ({
  isEdit,
  fileId,
  isOpen,
  onClose,
  refetch,
  lesson,
  setFileId,
}: {
  isEdit?: boolean;
  fileId?:string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  lesson: Lesson;
  setFileId: (fileId: string | null) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'VIDEO',
      url: '',
      lessonId: lesson?.id,
    },
  });
  useEffect(()=>{
    let file=lesson?.files?.find((file)=>file.id === fileId)
    if(file){
      form.setValue('name',file.name)
      form.setValue('type',file.type as FileType||"VIDEO")
      form.setValue('url',file.type === 'VIDEO' ? file.url.split('/embed/')[1] : file.url)
      form.setValue('lessonId',lesson?.id)
    }

  },[fileId,isEdit])
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading(`جاري ${isEdit ? 'تعديل' : 'إضافة'} الملف...`);
    try {
       isEdit?await fileApi.update(fileId as string,{
        ...dataFull,
        url:dataFull.type === 'VIDEO' ? `https://www.youtube.com/embed/${dataFull.url}` : dataFull.url,
        type: dataFull.type as FileType,
        lessonId: lesson?.id,
       }):await fileApi.create({
          ...dataFull,
          url:dataFull.type === 'VIDEO' ? `https://www.youtube.com/embed/${dataFull.url}` : dataFull.url,
          type: dataFull.type as FileType,
          lessonId: lesson?.id,
        });
        refetch();
      toast.dismiss(toastId);
      toast.success(`تم ${isEdit ? 'تعديل' : 'إضافة'} الملف بنجاح`);
      onClose();
      form.reset()
      setFileId(null)
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ ما');
    }
  };

  return (
    <Modal title={` ${isEdit ? 'تعديل' : 'إضافة'} ملف لدرس ${lesson?.title}`} isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col py-5 items-center justify-center">
       {form.getValues('type') === 'VIDEO' && form.getValues('url') && <VideoPlayer src={`https://www.youtube.com/embed/${form.getValues('url')}`} />}
      </div>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          label="اسم الملف"
          placeholder="اسم الملف"
          {...form.register('name')}
          onChange={(e) => form.setValue('name', e.target.value)}
          error={form.formState.errors.name?.message}
        />
          <Select
            label="نوع الملف"
            options={['VIDEO', 'AUDIO', 'DOCUMENT', 'IMAGE', 'OTHER'].map((type: string) => ({
              label: type,
              value: type,
            }))}
            {...form.register('type')}
            error={form.formState.errors.type?.message}
          />
        <Input
          type="text"
          label="الرابط"
          className='w-full'
          placeholder={`ادخل الرابط هنا ${form.getValues('type') === 'VIDEO' ? 'id الفيديو' : ''}`}
          {...form.register('url')}
          onChange={(e) => form.setValue('url', e.target.value)}
          error={form.formState.errors.url?.message}
        />
      </div>
      <div className="flex justify-center py-5">
        <Button type="submit" onClick={() => onSubmit(form.getValues())}>
          {isEdit ? 'تعديل الملف' : 'إضافة الملف'}
        </Button>
      </div>
    </Modal>
  );
};

export default AddFileModal;
