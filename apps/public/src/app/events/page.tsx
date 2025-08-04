'use client';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import { Card, Modal, Button, Input, Textarea, Pagination, toast } from '@3de/ui';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Clock,
  MapPin,
  Eye,
  Upload,
  X,
  Users,
  PackageOpen,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { UploadImage } from '@3de/ui';
import { eventApi } from '@3de/apis';
import { Event } from '@3de/interfaces';



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

export default function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Mock query - replace with actual API
  const { data: eventsData, isLoading, refetch } = useQuery<{ events: Event[], total: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean }>({
    queryKey: ['events', currentPage, search, itemsPerPage],
    queryFn: async () => {
      // Simulate API call
      let {data} = await eventApi.getAll(search, itemsPerPage, (currentPage - 1) * itemsPerPage);
      
      return data;
    }
  });
  useEffect(() => {
    refetch();
  }, [currentPage, search, itemsPerPage]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema)
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const onSubmit = async (data: EventFormData) => {
    try {
      await eventApi.create({
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        location: data.location,
        capacity: parseInt(data.capacity),
        image: imagePreview
      })
      toast.success(editingEvent ? 'تم تحديث الفعالية بنجاح' : 'تم إنشاء الفعالية بنجاح');
      handleCloseModal();
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الفعالية');
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setValue('title', event.title);
    setValue('description', event.description);
    setValue('startTime', new Date(event.startTime).toISOString().slice(0, 16));
    setValue('endTime', new Date(event.endTime).toISOString().slice(0, 16));
    setValue('location', event.location);
    setValue('capacity', event.capacity.toString());
    setValue('image', event.image);
    setImagePreview(event.image || '');
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      'هل أنت متأكد؟ سيتم حذف الفعالية نهائياً ولا يمكن التراجع عن هذا الإجراء'
    );

    if (confirmed) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('تم حذف الفعالية بنجاح');
        refetch();
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف الفعالية');
      }
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingEvent(null);
    reset();
    setImagePreview('');
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



  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الفعاليات</h1>
            <p className="text-gray-600 mt-2">إدارة وعرض جميع الفعاليات والمؤتمرات</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 gap-reverse"
          >
            <Plus className="w-5 h-5" />
            <span>فعالية جديدة</span>
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الفعاليات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>
          </div>
        </Card>
        <div className="flex items-center gap-4 gap-reverse">
        
          {/* <span className="text-sm font-medium text-gray-700">تصفية حسب الحالة:</span>
          <div className="flex items-center gap-2 gap-reverse">
            {[
              { key: 'all', label: 'الكل' },
              { key: 'upcoming', label: 'القادمة' },
              { key: 'completed', label: 'المنتهية' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.key
                    ? 'bg-primary-main text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div> */}
        </div>
        {isLoading && (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
    )}
        {/* Events Grid */}
      {eventsData && !isLoading && eventsData.events?.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {eventsData?.events.map((event: Event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card padding='none' className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-blue-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <Link
                        href={`/events/${event.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 gap-reverse"
                      >
                        <Eye className="w-4 h-4" />
                        <span>عرض</span>
                      </Link>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.startTime).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(event.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(event.endTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {/* <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{event.registeredCount} / {event.capacity} مسجل</span>
                      </div> */}
                    </div>

                    {/* Event Progress */}
                    {/* <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>نسبة التسجيل</span>
                        <span>{Math.round((event.registeredCount / event.capacity) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-main h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div> */}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 text-primary-main hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>}

        {/* Pagination */}
        {eventsData && eventsData.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalItems={eventsData.total}
              totalPages={eventsData.totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        )}
        {eventsData && eventsData.events.length === 0 && !isLoading && (
          <div className="flex flex-col gap-4 justify-center items-center h-[50vh]">
            <PackageOpen className="w-20 h-20 text-gray-400" />
            <p className="text-gray-600">لا يوجد فعاليات</p>
          </div>
        )}
        {/* Create/Edit Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          title={editingEvent ? 'تعديل الفعالية' : 'إنشاء فعالية جديدة'}
          className="max-w-4xl overflow-y-auto"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                rows={4}
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
                      width={200}
                      height={120}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
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
                   <UploadImage image={imagePreview} setImage={setImagePreview} inputRef={inputRef} isUploading={isUploading} className='hidden' setIsUploading={setIsUploading}/>
                    <label
                      onClick={() => {
                        inputRef.current?.click();
                      }}
                      className="cursor-pointer bg-blue-50 text-primary-main px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                     {isUploading ? 'جاري الرفع...' : 'رفع صورة'}
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
                <span>{editingEvent ? 'تحديث' : 'إنشاء'}</span>
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
} 