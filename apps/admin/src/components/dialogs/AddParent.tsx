import React, { useRef, useState } from 'react';
import { Modal, Input, Button, toast, UploadImage } from '@3de/ui';
import { parentApi, userApi } from '@3de/apis';
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

const AddParent = ({
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
        role: 'PARENT',
        isOnline: true,
        isVerified: true,
        age: dataFull.age,
        location: dataFull.location,
        avatar: imageUrl||dataFull.avatar||'',
      });
      await parentApi.create({
        userId: user.data.id
      });
      toast.dismiss(toastId);
      toast.success('تم إضافة الولي بنجاح');
      onClose();
      refetch();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ ما');
    }
  };

  return (
    <Modal title="إضافة ولي" isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col py-5 items-center justify-center">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Parent Image"
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
          label="الموقع"
          placeholder="الموقع"
          {...form.register('location')}
          onChange={(e) => form.setValue('location', e.target.value)}
          error={form.formState.errors.location?.message}
        />
      </div>
      <div className="flex justify-center py-5">
        <Button type="submit" disabled={isUploading} onClick={() => onSubmit(form.getValues())}>
          إضافة ولي
        </Button>
      </div>
    </Modal>
  );
};

export default AddParent;
