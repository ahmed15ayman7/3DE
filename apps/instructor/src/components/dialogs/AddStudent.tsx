import React, { useState } from 'react';
import { Modal, Input, Button, toast } from '@3de/ui';
import { userApi } from '@3de/apis';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatar: z.string().optional(),
  age: z.number().optional(),
  location: z.string().optional(),
});

const AddStudent = ({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      location: '',
    },
  });
  const onSubmit = async (dataFull: z.infer<typeof formSchema>) => {
    let toastId = toast.loading('جاري إضافة الطالب...');
    try {
       await userApi.create({
        email: dataFull.email,
        password: dataFull.password,
        firstName: dataFull.firstName,
        lastName: dataFull.lastName,
        phone: dataFull.phone,
        role: 'STUDENT',
        isOnline: true,
        isVerified: true,
        age: dataFull.age,
        location: dataFull.location,
        avatar: dataFull.avatar,
      });
      toast.dismiss(toastId);
      toast.success('تم إضافة الطالب بنجاح');
      onClose();
      refetch();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ ما');
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
    ); // 👈 غيّرها
    formData.append('folder', 'uploads');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        console.log('🔗 Uploaded Image URL:', data.secure_url);
        setImageUrl(data.secure_url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ فشل رفع الصورة!');
    }
  };

  return (
    <Modal title="إضافة الطالب" isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col py-5 items-center justify-center">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Instructor Image"
            className="w-40 h-40 object-cover rounded-full"
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
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
        <Input
          type="file"
          label="الصورة الشخصية"
          placeholder="الصورة الشخصية"
          onChange={handleFileChange}
          error={form.formState.errors.avatar?.message}
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
          label="الموقع"
          placeholder="الموقع"
          {...form.register('location')}
          onChange={(e) => form.setValue('location', e.target.value)}
          error={form.formState.errors.location?.message}
        />

      </div>
      <div className="flex justify-center py-5">
        <Button type="submit" onClick={() => onSubmit(form.getValues())}>
          إضافة الطالب
        </Button>
      </div>
    </Modal>
  );
};

export default AddStudent;
