import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Select,toast, Textarea } from '@3de/ui'
import { courseApi,instructorApi } from '@3de/apis'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Course, CourseStatus } from '@3de/interfaces'


const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().optional(),
    startDate: z.date().optional(),
    level: z.string().min(1),
    duration: z.string().optional(),
    status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED']),
    progress: z.string().optional(),
    price: z.string().optional(),
})

const AddCourse = ({ isOpen, onClose, refetch,instructorId,course }: { isOpen: boolean, onClose: () => void, refetch: () => void,instructorId:string,course?:Course }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            level: '',
            status: 'PENDING',
            image: '',
            startDate: new Date(),
            duration: "0",
            progress: "0",
            price: "0",
        },
    })
    useEffect(()=>{
        if(course){
            form.setValue('title',course.title)
            form.setValue('description',course.description)
            form.setValue('level',course.level)
            form.setValue('image',course.image)
            form.setValue('price',course.price?.toString() || "0")
            form.setValue('startDate',course.startDate || new Date())
            form.setValue('duration',course.duration?.toString() || "0")
            form.setValue('progress',course.progress?.toString() || "0")
            form.setValue('status',course.status)
        }
    },[course])
    const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
        let {...data} = dataFull
        let toastId = toast.loading('جاري إضافة الكورس...')
        try {
          course?await courseApi.update(course.id, {...data, image: imageUrl || undefined,price: +(data.price || 0),duration: +(data.duration || 0),startDate: new Date(data.startDate || new Date().toISOString()),status: data.status as CourseStatus,progress: +(data.progress || 0),instructors:  undefined}):await courseApi.create({...data, image: imageUrl || undefined,price: +(data.price || 0),duration: +(data.duration || 0),startDate: new Date(data.startDate || new Date().toISOString()),status: data.status as CourseStatus,progress: +(data.progress || 0),instructors:  undefined},instructorId)
            toast.dismiss(toastId)
            toast.success(course?'تم تعديل الكورس بنجاح':'تم إضافة الكورس بنجاح')
            onClose()
            refetch()
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(course?'حدث خطأ ما':'حدث خطأ ما')
        }
    }
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''); // 👈 غيّرها
        formData.append("folder", "uploads");
    
        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
          });
    
          const data = await res.json();
    
          if (data.secure_url) {
            console.log("🔗 Uploaded Image URL:", data.secure_url);
            setImageUrl(data.secure_url);
          }
        } catch (err) {
          console.error("Upload error:", err);
          alert("❌ فشل رفع الصورة!");
        }
      };
    
  return (
    <Modal title="إضافة كورس" isOpen={isOpen} onClose={onClose} size='sm'>
        <div className="flex flex-col py-5 items-center justify-center">
            {imageUrl && <img src={imageUrl} alt="Course Image" className="w-40 h-40 object-cover rounded-md" />}
        </div>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <Input type="text" label="اسم الكورس" placeholder="اسم الكورس" {...form.register('title')} onChange={(e) => form.setValue('title', e.target.value)} error={form.formState.errors.title?.message} />
                <Input type="file" label="صورة الكورس" placeholder="صورة الكورس" accept="image/*"   onChange={handleFileChange} />
                <div className="col-span-2 max-sm:col-span-1">
                    <Textarea label="وصف الكورس" placeholder="وصف الكورس" {...form.register('description')} onChange={(e) => form.setValue('description', e.target.value)} error={form.formState.errors.description?.message} />
                </div>
                <Input type="number" label="سعر الكورس" placeholder="سعر الكورس" {...form.register('price')} onChange={(e) => form.setValue('price', e.target.value)} error={form.formState.errors.price?.message} />
                <Input type="date" label="تاريخ البدء" placeholder="تاريخ البدء" {...form.register('startDate')}  error={form.formState.errors.startDate?.message} />
                <Input type="text" label="مستوى الكورس" placeholder="مستوى الكورس" {...form.register('level')} onChange={(e) => form.setValue('level', e.target.value)} error={form.formState.errors.level?.message} />
                <Input type="number" label=" مدة الكورس (ساعة)" placeholder="مدة الكورس" {...form.register('duration')} onChange={(e) => form.setValue('duration', e.target.value)} error={form.formState.errors.duration?.message} />
                {/* <Select label="حالة الكورس"
                options={['PENDING', 'ACTIVE', 'COMPLETED'].map((status: string) => ({
                    label: status === 'PENDING' ? 'قيد الإنتظار' : status === 'ACTIVE' ? 'نشط' : 'مكتمل',
                    value: status,
                }))}
                {...form.register('status')}
                error={form.formState.errors.status?.message}
                value={form.watch('status')}
                onChange={(e) => form.setValue('status', e.target.value as "PENDING" | "ACTIVE" | "COMPLETED")}
            /> */}
            {/* <Select label="المحاضر"
                options={instructors?.data?.map((instructor) => ({
                    label: instructor.user.firstName + " " + instructor.user.lastName + " (" + instructor.user.email + ")",
                    value: instructor.user.id,
                })) || []}
                {...form.register('instructorId')}
                error={form.formState.errors.instructorId?.message}
                value={form.watch('instructorId')}
                onChange={(e) => form.setValue('instructorId', e.target.value)}
            /> */}
        </div>
        <div className="flex justify-center py-5">
            <Button type="submit" onClick={() => onSubmit(form.getValues())}>إضافة كورس</Button>
        </div>
    </Modal>
  )
}

export default AddCourse