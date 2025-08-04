'use client';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import {
  Card,
  Modal,
  Button,
  Input,
  Textarea,
  Pagination,
  toast,
  Alert,
  UploadImage,
  Tooltip,
} from '@3de/ui';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  Eye,
  Upload,
  X,
  PackageOpen,
  HelpCircle,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Remove date-fns imports for now
import Image from 'next/image';
import Link from 'next/link';
import { postApi } from '@3de/apis';
import { useAuth } from '@3de/auth';
import { BlogPost } from '@3de/interfaces';

// Mock data - replace with actual API calls
const mockPosts = [
  {
    id: '1',
    title: 'استراتيجيات التواصل الحديثة في العلاقات العامة',
    content:
      'تطورت استراتيجيات التواصل بشكل كبير مع ظهور وسائل التواصل الاجتماعي...',
    // image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500',
    author: { firstName: 'أحمد', lastName: 'محمد' },
    createdAt: new Date('2024-01-15'),
    likesCount: 45,
  },
  {
    id: '2',
    title: 'أهمية بناء العلاقات مع الإعلام',
    content:
      'تعتبر العلاقات الإعلامية جزءاً أساسياً من استراتيجية العلاقات العامة...',
    // image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500',
    author: { firstName: 'فاطمة', lastName: 'أحمد' },
    createdAt: new Date('2024-01-12'),
    likesCount: 32,
  },
  {
    id: '3',
    title: 'إدارة الأزمات في العلاقات العامة',
    content:
      'تتطلب إدارة الأزمات مهارات خاصة وتخطيطاً مسبقاً للتعامل مع المواقف الطارئة...',
    // image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    author: { firstName: 'محمد', lastName: 'علي' },
    createdAt: new Date('2024-01-10'),
    likesCount: 28,
  },
];

const postSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  content: z.string().min(10, 'المحتوى يجب أن يكون 10 أحرف على الأقل'),
  image: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  // Mock query - replace with actual API
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: async () => {
      let { data } = await postApi.getPublicPosts(
        search,
        itemsPerPage,
        (currentPage - 1) * itemsPerPage
      );
      return data;
    },
  });
  useEffect(() => {
    refetch();
  }, [search, itemsPerPage, currentPage]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    if (!user) return toast.error('يجب عليك تسجيل الدخول لإنشاء مقال');
    let toastId = toast.loading('يتم إنشاء المقال...');
    try {
      // let imageUrl = data.image;
      // Simulate API call
      if (editingPost) {
        await postApi.updateBlogPost(editingPost.id, {
          title: data.title,
          content: data.content,
          image: imagePreview,
          authorId: user?.id,
          slug: data.title.toLowerCase().replace(/ /g, '-'),
          tags: data.content.split(' ').filter((tag) => tag.startsWith('#')&&tag.length>4),
          publishDate: new Date(),
          isPublished: true,
        });
      } else {
        await postApi.createBlogPost({
          title: data.title,
          content: data.content,
          image: imagePreview,
          authorId: user?.id,
          slug: data.title.toLowerCase().replace(/ /g, '-'),
          tags: data.content.split(' ').filter((tag) => tag.startsWith('#')&&tag.length>4),
          publishDate: new Date(),
          isPublished: true,
        });
      }
      toast.dismiss(toastId);

      toast.success(
        editingPost ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح'
      );
      handleCloseModal();
      refetch();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('حدث خطأ أثناء حفظ المقال');
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setValue('title', post.title);
    setValue('content', post.content);
    setValue('image', post.image);
    setImagePreview(post.image || '');
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (postId: string) => {
    const confirmed = window.confirm(
      'هل أنت متأكد؟ سيتم حذف المقال نهائياً ولا يمكن التراجع عن هذا الإجراء'
    );

    if (confirmed) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success('تم حذف المقال بنجاح');
        refetch();
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف المقال');
      }
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingPost(null);
    reset();
    setImagePreview('');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المقالات</h1>
            <p className="text-gray-600 mt-2">
              إدارة وعرض جميع المقالات المنشورة
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 gap-reverse"
          >
            <Plus className="w-5 h-5" />
            <span>مقال جديد</span>
          </Button>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المقالات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>
          </div>
        </Card>
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
        {/* Posts Grid */}
        {!isLoading && postsData && postsData.posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {postsData?.posts.map((post: BlogPost) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    padding="none"
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Post Image */}
                    <div className="relative h-48 overflow-hidden ">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-blue-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Link
                          href={`/posts/${post.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 gap-reverse"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض</span>
                        </Link>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      {/* Post Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        {/* <div className="flex items-center gap-2 gap-reverse">
                        <User className="w-4 h-4" />
                        <span>{post.author.firstName} {post.author.lastName}</span>
                      </div> */}
                        <div className="flex items-center gap-2 gap-reverse">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              'ar-EG'
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 gap-reverse text-primary-main">
                          <span className="text-sm font-bold">
                            {post.tags?.map((tag: string) => tag).join('  ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 gap-reverse">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-2 text-primary-main hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
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
          </div>
        )}
        {/* Pagination */}
        {!isLoading && postsData && postsData.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalItems={postsData.total}
              totalPages={postsData.totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
              onItemsPerPageChange={(itemsPerPage) => {
                setItemsPerPage(itemsPerPage);
              }}
            />
          </div>
        )}
        {postsData && postsData.posts.length === 0 && (
          <div className="flex flex-col gap-4 justify-center items-center h-[50vh]">
            <PackageOpen className="w-20 h-20 text-gray-400" />
            <p className="text-gray-600">لا يوجد مقالات</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          title={editingPost ? 'تعديل المقال' : 'إنشاء مقال جديد'}
          className="max-w-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان المقال
              </label>
              <Input
                {...register('title')}
                placeholder="أدخل عنوان المقال"
                error={errors.title?.message}
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  محتوى المقال
                </label>
                <Tooltip
                  position="right"
                  content="اكتب محتوى المقال مع دعم العناوين مثل: ## و ### و - لقوائم"
                  maxWidth={500}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <Textarea
                {...register('content')}
                rows={6}
                placeholder="اكتب محتوى المقال هنا..."
                error={errors.content?.message}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة المقال
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
                    <p className="text-gray-600 mb-2">اختر صورة للمقال</p>
                    <UploadImage
                      image={imagePreview}
                      setImage={setImagePreview}
                      inputRef={inputRef}
                      isUploading={isUploading}
                      setIsUploading={setIsUploading}
                      className="hidden"
                    />
                    <label
                      onClick={() => inputRef.current?.click()}
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
                <span>{editingPost ? 'تحديث' : 'إنشاء'}</span>
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
