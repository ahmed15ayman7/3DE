import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select, toast, Textarea, Progress } from '@3de/ui';
import {  fileApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Lesson, FileType } from '@3de/interfaces';
import VideoPlayer from '../files/VideoPlayer';
import { LinkIcon, VideoIcon } from 'lucide-react';
import { AxiosProgressEvent } from 'axios';

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
  setUploading,
}: {
  isEdit?: boolean;
  fileId?:string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  lesson: Lesson;
  setFileId: (fileId: string | null) => void;
  setUploading: (uploading: boolean) => void;
}) => {
  let [file,setFile] = useState<File>()
  let [videoUrl,setVideoUrl] = useState<string>()
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
      form.setValue('url',file.url)
      setVideoUrl(file.type === 'VIDEO' ? file.url : undefined)
      form.setValue('lessonId',lesson?.id)
    }

  },[fileId,isEdit])
 
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading(`جاري إضافة الملف...`);
    try {
      const finalFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.mp4`;
      const fileUrl = `https://3de.school/videos/${finalFilename}`;
  
      // إنشاء السجل في DB
      await fileApi.create({
        ...dataFull,
        url: fileUrl,
        type: dataFull.type as FileType,
        lessonId: lesson?.id,
      });
  
      // رفع الفيديو
      if (file && fileUrl && dataFull.type === "VIDEO") {
        setUploading(true);
        setUploadProgress(0);
  
        const uploadToast = toast(
          <div className='flex flex-col gap-2'>
          <Progress
          value={uploadProgress}
          color='primary'
          className='w-full'
          />
          <p className='text-sm text-gray-500'>{uploadProgress}%</p>
          </div>
          ,
          {
            duration: Infinity,
            position: 'top-center',
          }
        );
        onClose();
  
        await fileApi.upload(file, fileUrl, (progressEvent: AxiosProgressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percent);
          });
  
        toast.dismiss(uploadToast);
      }
  
      setUploading(false);
      refetch();
      toast.dismiss(toastId);
      toast.success("تم إضافة الملف بنجاح");
      form.reset();
      setFileId(null);
    } catch (error) {
      setUploading(false);
      toast.dismiss(toastId);
      toast.error("حدث خطأ أثناء الإضافة");
    }
  };
  let handleSelectVideo =  () => {
    console.log(file)
    if(file){
      console.log(file)
      let url = URL.createObjectURL(file)
      console.log(url)
      setVideoUrl(url)
    }
  }
  useEffect(()=>{
    if(file){
      handleSelectVideo()
    }
  },[file])
  
  
  return (
    <Modal title={` ${isEdit ? 'تعديل' : 'إضافة'} ملف لدرس ${lesson?.title}`} isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col py-5 items-center justify-center">
       {form.getValues('type') === 'VIDEO' && videoUrl && <VideoPlayer src={videoUrl} />}
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
          type={form.getValues('type') === 'VIDEO' ? "file" : "text"}
          label="الرابط"
          accept={form.getValues('type') === 'VIDEO' ? "video/*" : undefined}
          icon={form.getValues('type') === 'VIDEO' ? <VideoIcon className='w-4 h-4' /> : <LinkIcon className='w-4 h-4' />}
          className='w-full'
          placeholder={form.getValues('type') === 'VIDEO' ? `اختر الفيديو` : `ادخل الرابط هنا `}
          {...form.register('url')}
          onChange={(e) => {
            if(form.getValues('type') === 'VIDEO'){
              setFile(e.target.files?.[0])
            }else{
              form.setValue('url', e.target.value)
            }
          }}
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
