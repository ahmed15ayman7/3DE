'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Card, Modal, Button, Input, Textarea, toast } from '@3de/ui';
import { 
  Calendar, 
  Edit, 
  Trash2, 
  User, 
  Clock,
  MapPin,
  ArrowRight,
  Users,
  Share2,
  Upload,
  X,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - replace with actual API
const mockEvent = {
  id: '1',
  title: 'ورشة العلاقات العامة الحديثة',
  description: `ورشة تدريبية شاملة حول أحدث استراتيجيات العلاقات العامة والتواصل مع الجمهور في العصر الرقمي.

## محاور الورشة

### الجلسة الأولى: مقدمة في العلاقات العامة الرقمية
- تطور العلاقات العامة في العصر الرقمي
- أهمية وسائل التواصل الاجتماعي
- بناء الهوية المؤسسية الرقمية

### الجلسة الثانية: استراتيجيات المحتوى
- إنشاء محتوى جذاب وفعال
- التخطيط للحملات الإعلامية
- قياس الأداء والنتائج

### الجلسة الثالثة: إدارة الأزمات
- التعامل مع الأزمات في البيئة الرقمية
- خطط الاستجابة السريعة
- الحفاظ على سمعة المؤسسة

### الجلسة الرابعة: التطبيق العملي
- ورش عمل تفاعلية
- دراسات حالة حقيقية
- تصميم استراتيجية شاملة

## ما ستتعلمه

- أحدث استراتيجيات العلاقات العامة
- كيفية بناء علاقات إعلامية قوية
- إدارة الأزمات بفعالية
- استخدام أدوات القياس والتحليل

## متطلبات الحضور

- خبرة أساسية في مجال التسويق أو الإعلام
- إحضار جهاز محمول للتطبيق العملي
- الاستعداد للمشاركة والتفاعل`,
  image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
  startTime: new Date('2024-02-15T10:00:00'),
  endTime: new Date('2024-02-15T16:00:00'),
  location: 'قاعة المؤتمرات الرئيسية - الدور الثالث',
  capacity: 100,
  registeredCount: 75,
  price: 500,
  status: 'upcoming',
  organizer: { 
    firstName: 'سارة', 
    lastName: 'أحمد',
    email: 'sarah@example.com',
    phone: '+966501234567'
  },
  speakers: [
    { name: 'د. محمد السالم', title: 'خبير العلاقات العامة', company: 'شركة الإعلام المتقدم' },
    { name: 'أ. فاطمة النوري', title: 'مديرة التسويق الرقمي', company: 'مجموعة التقنية الحديثة' }
  ],
  agenda: [
    { time: '10:00 - 10:30', activity: 'تسجيل الحضور وكلمة ترحيبية' },
    { time: '10:30 - 12:00', activity: 'الجلسة الأولى: مقدمة في العلاقات العامة الرقمية' },
    { time: '12:00 - 12:15', activity: 'استراحة' },
    { time: '12:15 - 13:45', activity: 'الجلسة الثانية: استراتيجيات المحتوى' },
    { time: '13:45 - 14:45', activity: 'استراحة غداء' },
    { time: '14:45 - 15:30', activity: 'الجلسة الثالثة: إدارة الأزمات' },
    { time: '15:30 - 16:00', activity: 'الجلسة الرابعة: التطبيق العملي وختام الورشة' }
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15')
};

const eventSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  startTime: z.string().min(1, 'وقت البداية مطلوب'),
  endTime: z.string().min(1, 'وقت النهاية مطلوب'),
  location: z.string().min(3, 'المكان مطلوب'),
  capacity: z.string().min(1, 'السعة مطلوبة'),
  image: z.string().optional()
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const eventId = params?.id as string;

  // Mock query - replace with actual API
  const { data: event, isLoading, refetch } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockEvent;
    },
    enabled: !!eventId
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema)
  });

  useEffect(() => {
    if (event) {
      setValue('title', event.title);
      setValue('description', event.description);
      setValue('startTime', event.startTime.toISOString().slice(0, 16));
      setValue('endTime', event.endTime.toISOString().slice(0, 16));
      setValue('location', event.location);
      setValue('capacity', event.capacity.toString());
      setValue('image', event.image);
      setImagePreview(event.image || '');
    }
  }, [event, setValue]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'default');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) throw new Error('فشل في رفع الصورة');
      
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      let imageUrl = data.image;
      
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated event data:', { ...data, image: imageUrl });
      
      toast.success('تم تحديث الفعالية بنجاح');
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الفعالية');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'هل أنت متأكد؟ سيتم حذف الفعالية نهائياً ولا يمكن التراجع عن هذا الإجراء'
    );

    if (confirmed) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('تم حذف الفعالية بنجاح');
        router.push('/events');
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف الفعالية');
      }
    }
  };

  const handleRegister = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsRegistered(true);
      toast.success('تم التسجيل في الفعالية بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء التسجيل');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    reset();
    setSelectedImage(null);
    if (event) {
      setImagePreview(event.image || '');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'قادمة';
      case 'completed':
        return 'منتهية';
      default:
        return 'غير محدد';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-16 rounded mb-4"></div>
            <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
            <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-4 rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">الفعالية غير موجودة</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على الفعالية المطلوبة</p>
          <Link href="/events">
            <Button className="flex items-center gap-2 gap-reverse">
              <ArrowRight className="w-4 h-4" />
              <span>العودة للفعاليات</span>
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
          <Link href="/events" className="hover:text-primary-main transition-colors">
            الفعاليات
          </Link>
          <span>/</span>
          <span className="text-gray-900">{event.title}</span>
        </div>

        {/* Event Header */}
        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 gap-reverse mb-4">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {event.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center gap-2 gap-reverse">
                  <Calendar className="w-5 h-5" />
                  <span>{event.startTime.toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2 gap-reverse">
                  <Clock className="w-5 h-5" />
                  <span>
                    {event.startTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })} - 
                    {event.endTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 gap-reverse">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 gap-reverse">
                  <Users className="w-5 h-5" />
                  <span>{event.registeredCount} / {event.capacity} مسجل</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 gap-reverse">
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex items-center gap-2 gap-reverse"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة</span>
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2 gap-reverse"
              >
                <Edit className="w-4 h-4" />
                <span>تعديل</span>
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="flex items-center gap-2 gap-reverse text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف</span>
              </Button>
            </div>
          </div>

          {/* Event Image */}
          {event.image && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Registration Progress */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">حالة التسجيل</h3>
              <div className="flex items-center gap-4 gap-reverse">
                <span className="text-2xl font-bold text-primary-main">{event.price} جنية</span>
                {event.status === 'upcoming' && (
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistered || event.registeredCount >= event.capacity}
                    className="flex items-center gap-2 gap-reverse"
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>مسجل</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>سجل الآن</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>الأماكن المحجوزة</span>
              <span>{event.registeredCount} من {event.capacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-main h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Event Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">وصف الفعالية</h2>
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700">
                {event.description.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  } else if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-disc list-inside text-gray-700 mb-2">
                        <li>{paragraph.replace('- ', '')}</li>
                      </ul>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </Card>

            {/* Agenda */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">جدول الفعالية</h2>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 gap-reverse p-4 bg-gray-50 rounded-lg">
                    <div className="bg-primary-main text-white px-3 py-1 rounded-lg text-sm font-medium min-w-max">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">منظم الفعالية</h3>
              <div className="flex items-center gap-3 gap-reverse">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-main to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {event.organizer.firstName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{event.organizer.email}</p>
                </div>
              </div>
            </Card>

            {/* Speakers */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">المتحدثون</h3>
              <div className="space-y-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-start gap-3 gap-reverse">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-primary-main rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {speaker.name.split(' ')[1]?.charAt(0) || speaker.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{speaker.name}</p>
                      <p className="text-sm text-gray-600">{speaker.title}</p>
                      <p className="text-xs text-gray-500">{speaker.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Event Details */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل إضافية</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الإنشاء</span>
                  <span className="text-gray-900">{event.createdAt.toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">آخر تحديث</span>
                  <span className="text-gray-900">{event.updatedAt.toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة</span>
                  <span className="text-gray-900">
                    {Math.round((event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60))} ساعة
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الأماكن المتبقية</span>
                  <span className="text-gray-900">{event.capacity - event.registeredCount}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="تعديل الفعالية"
          className="max-w-4xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الفعالية
              </label>
              <Input
                {...register('title')}
                placeholder="أدخل عنوان الفعالية"
                error={errors.title?.message}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الفعالية
              </label>
              <Textarea
                {...register('description')}
                rows={8}
                placeholder="اكتب وصفاً للفعالية..."
                error={errors.description?.message}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت البداية
                </label>
                <Input
                  {...register('startTime')}
                  type="datetime-local"
                  error={errors.startTime?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت النهاية
                </label>
                <Input
                  {...register('endTime')}
                  type="datetime-local"
                  error={errors.endTime?.message}
                />
              </div>
            </div>

            {/* Location and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المكان
                </label>
                <Input
                  {...register('location')}
                  placeholder="مكان الفعالية"
                  error={errors.location?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعة
                </label>
                <Input
                  {...register('capacity')}
                  type="number"
                  placeholder="عدد الأماكن المتاحة"
                  error={errors.capacity?.message}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الفعالية
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={300}
                      height={180}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setSelectedImage(null);
                        setValue('image', '');
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">اختر صورة للفعالية</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-blue-50 text-primary-main px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      رفع صورة
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 gap-reverse pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex items-center gap-2 gap-reverse"
              >
                {(isSubmitting || isUploading) && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>تحديث الفعالية</span>
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </Layout>
  );
} 