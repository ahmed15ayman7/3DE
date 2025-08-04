'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import { Card, Modal, Button, Input, Textarea, Pagination, toast } from '@3de/ui';
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Eye,
  Upload,
  X,
  TrendingUp,
  Activity,
  Star,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - replace with actual API calls
const mockCommunities = [
  {
    id: '1',
    name: 'مجتمع العلاقات العامة',
    description: 'مجتمع متخصص في مناقشة أحدث استراتيجيات العلاقات العامة والتسويق الرقمي',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
    type: 'عام',
    participantsCount: 245,
    postsCount: 89,
    discussionsCount: 34,
    liveRoomsCount: 3,
    groupsCount: 12,
    likes: 156,
    dislikes: 8,
    views: 1247,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    lastActivity: new Date('2024-01-22T14:30:00')
  },
  {
    id: '2',
    name: 'مجتمع الإعلام الرقمي',
    description: 'منصة للنقاش حول تطورات الإعلام الرقمي وتقنيات التواصل الحديثة',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500',
    type: 'متخصص',
    participantsCount: 187,
    postsCount: 67,
    discussionsCount: 23,
    liveRoomsCount: 2,
    groupsCount: 8,
    likes: 134,
    dislikes: 12,
    views: 892,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    lastActivity: new Date('2024-01-21T16:45:00')
  },
  {
    id: '3',
    name: 'مجتمع المؤثرين',
    description: 'شبكة تضم المؤثرين وصناع المحتوى لتبادل الخبرات والتعاون',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
    type: 'مؤثرين',
    participantsCount: 312,
    postsCount: 124,
    discussionsCount: 45,
    liveRoomsCount: 5,
    groupsCount: 18,
    likes: 289,
    dislikes: 15,
    views: 1856,
    isActive: true,
    createdAt: new Date('2023-12-20'),
    lastActivity: new Date('2024-01-22T10:15:00')
  },
  {
    id: '4',
    name: 'مجتمع الشركات الناشئة',
    description: 'مساحة للشركات الناشئة لمناقشة التحديات والفرص في مجال العلاقات العامة',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500',
    type: 'أعمال',
    participantsCount: 156,
    postsCount: 43,
    discussionsCount: 18,
    liveRoomsCount: 1,
    groupsCount: 6,
    likes: 98,
    dislikes: 7,
    views: 634,
    isActive: true,
    createdAt: new Date('2024-01-12'),
    lastActivity: new Date('2024-01-20T09:30:00')
  }
];

const communityTypes = ['الكل', 'عام', 'متخصص', 'مؤثرين', 'أعمال'];

const communitySchema = z.object({
  name: z.string().min(3, 'اسم المجتمع يجب أن يكون 3 أحرف على الأقل'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  type: z.string().min(1, 'نوع المجتمع مطلوب'),
  image: z.string().optional()
});

type CommunityFormData = z.infer<typeof communitySchema>;

export default function CommunitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('الكل');
  
  const itemsPerPage = 8;

  // Mock query - replace with actual API
  const { data: communitiesData, isLoading, refetch } = useQuery({
    queryKey: ['communities', currentPage, selectedType],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredCommunities = mockCommunities;
      if (selectedType !== 'الكل') {
        filteredCommunities = mockCommunities.filter(community => community.type === selectedType);
      }
      
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return {
        communities: filteredCommunities.slice(start, end),
        total: filteredCommunities.length,
        totalPages: Math.ceil(filteredCommunities.length / itemsPerPage)
      };
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema)
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

  const onSubmit = async (data: CommunityFormData) => {
    try {
      let imageUrl = data.image;
      
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Community data:', { ...data, image: imageUrl });
      
      toast.success(editingCommunity ? 'تم تحديث المجتمع بنجاح' : 'تم إنشاء المجتمع بنجاح');
      handleCloseModal();
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ المجتمع');
    }
  };

  const handleEdit = (community: any) => {
    setEditingCommunity(community);
    setValue('name', community.name);
    setValue('description', community.description);
    setValue('type', community.type);
    setValue('image', community.image);
    setImagePreview(community.image || '');
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (communityId: string) => {
    const confirmed = window.confirm(
      'هل أنت متأكد؟ سيتم حذف المجتمع نهائياً ولا يمكن التراجع عن هذا الإجراء'
    );

    if (confirmed) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('تم حذف المجتمع بنجاح');
        refetch();
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف المجتمع');
      }
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingCommunity(null);
    reset();
    setSelectedImage(null);
    setImagePreview('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'عام':
        return 'bg-blue-100 text-blue-800';
      case 'متخصص':
        return 'bg-purple-100 text-purple-800';
      case 'مؤثرين':
        return 'bg-pink-100 text-pink-800';
      case 'أعمال':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المجتمعات</h1>
            <p className="text-gray-600 mt-2">إدارة وعرض جميع المجتمعات والمنصات التفاعلية</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 gap-reverse"
          >
            <Plus className="w-5 h-5" />
            <span>مجتمع جديد</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي المجتمعات', value: '4', icon: MessageSquare, color: 'blue' },
            { label: 'إجمالي المشاركين', value: '900', icon: Users, color: 'green' },
            { label: 'المشاركات', value: '323', icon: Activity, color: 'purple' },
            { label: 'النقاشات', value: '120', icon: TrendingUp, color: 'orange' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                    <Icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 gap-reverse">
          <span className="text-sm font-medium text-gray-700">تصفية حسب النوع:</span>
          <div className="flex items-center gap-2 gap-reverse">
            {communityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-primary-main text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {communitiesData?.communities.map((community: any) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card padding='none' className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  {/* Community Image */}
                  <div className="relative h-48 overflow-hidden">
                    {community.image ? (
                      <Image
                        src={community.image}
                        alt={community.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <MessageSquare className="w-16 h-16 text-blue-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(community.type)}`}>
                        {community.type}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 gap-reverse">
                        <Link
                          href={`/communities/${community.id}`}
                          className="bg-white text-gray-900 px-3 py-2 rounded-lg font-medium flex items-center gap-1 gap-reverse"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض</span>
                        </Link>
                        <button
                          onClick={() => handleEdit(community)}
                          className="bg-primary-main text-white px-3 py-2 rounded-lg font-medium flex items-center gap-1 gap-reverse"
                        >
                          <Settings className="w-4 h-4" />
                          <span>إدارة</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Community Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{community.description}</p>

                    {/* Community Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 gap-reverse">
                          <Users className="w-4 h-4 text-primary-main" />
                          <span className="text-lg font-bold text-gray-900">{community.participantsCount}</span>
                        </div>
                        <p className="text-xs text-gray-600">مشارك</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 gap-reverse">
                          <Activity className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-bold text-gray-900">{community.postsCount}</span>
                        </div>
                        <p className="text-xs text-gray-600">مشاركة</p>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1 gap-reverse">
                        <MessageSquare className="w-4 h-4" />
                        <span>{community.discussionsCount}</span>
                      </div>
                      <div className="flex items-center gap-1 gap-reverse">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{community.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 gap-reverse">
                        <Eye className="w-4 h-4" />
                        <span>{community.views}</span>
                      </div>
                    </div>

                    {/* Last Activity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>آخر نشاط: {community.lastActivity.toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center gap-1 gap-reverse">
                        <button
                          onClick={() => handleEdit(community)}
                          className="p-1 text-primary-main hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(community.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
        </div>

        {/* Pagination */}
        {communitiesData && communitiesData.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalItems={communitiesData.total}
              totalPages={communitiesData.totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          title={editingCommunity ? 'تعديل المجتمع' : 'إنشاء مجتمع جديد'}
          className="max-w-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المجتمع
              </label>
              <Input
                {...register('name')}
                placeholder="أدخل اسم المجتمع"
                error={errors.name?.message}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المجتمع
              </label>
              <Textarea
                {...register('description')}
                rows={4}
                placeholder="اكتب وصفاً للمجتمع..."
                error={errors.description?.message}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المجتمع
              </label>
              <select
                {...register('type')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                <option value="">اختر نوع المجتمع</option>
                {communityTypes.slice(1).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة المجتمع
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
                    <p className="text-gray-600 mb-2">اختر صورة للمجتمع</p>
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
                <span>{editingCommunity ? 'تحديث' : 'إنشاء'}</span>
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
} 