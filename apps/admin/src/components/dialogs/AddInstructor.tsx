import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Select, toast, Textarea, UploadImage } from '@3de/ui';
import { courseApi, instructorApi, userApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseStatus } from '@3de/interfaces';
import { useQuery } from '@tanstack/react-query';
import { User } from '@3de/interfaces';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatar: z.string().optional(),
  age: z.number().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  rating: z.number().optional(),
  experienceYears: z.number().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

const AddInstructor = ({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  let inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      age: 0,
      phone: '',
      avatar: '',
      title: '',
      rating: 0,
      experienceYears: 0,
      bio: '',
      skills: '',
      location: '',
    },
  });
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading('جاري إضافة المحاضر...');
    try {
      let user = await userApi.create({
        email: dataFull.email,
        password: dataFull.password,
        firstName: dataFull.firstName,
        lastName: dataFull.lastName,
        phone: dataFull.phone,
        role: 'INSTRUCTOR',
        isOnline: true,
        isVerified: true,
        age: dataFull.age,
        location: dataFull.location,
        avatar: imageUrl||dataFull.avatar||'',
      });
      await instructorApi.create({
        title: dataFull.title,
        rating: +(dataFull.rating||0),
        experienceYears: +(dataFull.experienceYears||0),
        bio: dataFull.bio,
        skills: dataFull.skills?.split(',') || [],
        location: dataFull.location,
        userId: user.data.id,
        academyId:"cmdaq4jvc0005kzy14clcj9x4"
      });
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
    <Modal title="إضافة محاضر" isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col py-5 items-center justify-center">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Instructor Image"
            className="w-40 h-40 object-cover rounded-full"
          />
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <Input
          type="text"
          label="الاسم الاول"
          placeholder="الاسم الاول"
          {...form.register('firstName')}
          onChange={(e) => form.setValue('firstName', e.target.value)}
          error={form.formState.errors.firstName?.message}
        />
        <Input
          type="text"
          label="الاسم الاخير"
          placeholder="الاسم الاخير"
          {...form.register('lastName')}
          onChange={(e) => form.setValue('lastName', e.target.value)}
          error={form.formState.errors.lastName?.message}
        />
        <Input
          type="email"
          label="البريد الإلكتروني"
          placeholder="البريد الإلكتروني"
          {...form.register('email')}
          onChange={(e) => form.setValue('email', e.target.value)}
          error={form.formState.errors.email?.message}
        />
        <Input
          type="password"
          label="كلمة المرور"
          placeholder="كلمة المرور"
          {...form.register('password')}
          onChange={(e) => form.setValue('password', e.target.value)}
          error={form.formState.errors.password?.message}
        />
        <UploadImage 
          image={imageUrl as string}
          setImage={setImageUrl}
          className="w-full" inputRef={inputRef} setIsUploading={setIsUploading}
            />
        <Input
          type="text"
          label="الهاتف"
          placeholder="الهاتف"
          {...form.register('phone')}
          onChange={(e) => form.setValue('phone', e.target.value)}
          error={form.formState.errors.phone?.message}
        />
        <Input
          type="number"
          label="العمر"
          placeholder="العمر"
          {...form.register('age')}
          onChange={(e) => form.setValue('age', +e.target.value)}
          error={form.formState.errors.age?.message}
        />
        <Input
          type="text"
          label="المهنة"
          placeholder="المهنة"
          {...form.register('title')}
          onChange={(e) => form.setValue('title', e.target.value)}
          error={form.formState.errors.title?.message}
        />
        <Input
          type="text"
          label="الموقع"
          placeholder="الموقع"
          {...form.register('location')}
          onChange={(e) => form.setValue('location', e.target.value)}
          error={form.formState.errors.location?.message}
        />
        <Input
          type="number"
          label="سنوات الخبرة"
          placeholder="سنوات الخبرة"
          {...form.register('experienceYears')}
          onChange={(e) => form.setValue('experienceYears', +e.target.value)}
          error={form.formState.errors.experienceYears?.message}
        />
        <Input
          type="text"
          label="المهارات"
          placeholder="اكتب المهارات بفاصلة"
          {...form.register('skills')}
          onChange={(e) => form.setValue('skills', e.target.value)}
          error={form.formState.errors.skills?.message}
        />
        <Input
          type="number"
          label="تقييم المحاضر"
          min={0}
          max={5}
          placeholder="تقييم المحاضر"
          {...form.register('rating')}
          onChange={(e) => form.setValue('rating', +e.target.value)}
          error={form.formState.errors.rating?.message}
        />
        <div className="col-span-3 max-sm:col-span-1">
          <Textarea
            label="البايو"
            placeholder="البايو"
            {...form.register('bio')}
            onChange={(e) => form.setValue('bio', e.target.value)}
            error={form.formState.errors.bio?.message}
          />
        </div>
      </div>
      <div className="flex justify-center py-5">
        <Button type="submit" disabled={isUploading} onClick={() => onSubmit(form.getValues())}>
          إضافة محاضر
        </Button>
      </div>
    </Modal>
  );
};

export default AddInstructor;
