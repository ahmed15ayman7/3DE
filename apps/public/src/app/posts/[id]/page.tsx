'use client';
import { useState, useEffect, use, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {  useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Card, Modal, Button, Input, Textarea, toast, UploadImage } from '@3de/ui';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Calendar,
  ArrowRight,
  Upload,
  X,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { postApi } from '@3de/apis';
import { useAuth } from '@3de/auth';
import { BlogPost } from '@3de/interfaces';


const postSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  content: z.string().min(10, 'المحتوى يجب أن يكون 10 أحرف على الأقل'),
  image: z.string().optional()
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostDetailPage({params}:{params:Promise<{id:string}>}) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);  
  const {user} = useAuth();
  const postId = use(params).id;
  const inputRef = useRef<HTMLInputElement>(null);
  // Mock query - replace with actual API
  const { data: post, isLoading, refetch } = useQuery<BlogPost>({
    queryKey: ['post', postId],
    queryFn: async () => {
      let {data} = await postApi.getBlogPostById(postId);
      return data;
    },
    enabled: !!postId
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema)
  });

  useEffect(() => {
    if (post) {
      setValue('title', post.title);
      setValue('content', post.content);
      setValue('image', post.image);
      setImagePreview(post.image || '');
    }
  }, [post, setValue]);

 
  const onSubmit = async (data: PostFormData) => {
    try {
      // Simulate API call
      await postApi.updateBlogPost(postId, {
        title: data.title,
        content: data.content,
        image: imagePreview,
        authorId: user?.id,
        slug: data.title.toLowerCase().replace(/ /g, '-'),
        tags: data.content.split(' ').filter((tag) => tag.startsWith('#')&&tag.length>4),
      });
      toast.success('تم تحديث المقال بنجاح');
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المقال');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'هل أنت متأكد؟ سيتم حذف المقال نهائياً ولا يمكن التراجع عن هذا الإجراء'
    );

    if (confirmed) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('تم حذف المقال بنجاح');
        router.push('/posts');
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف المقال');
      }
    }
  };


  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    // reset();
    if (post) {
      setImagePreview(post.image || '');
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

  if (!post) {
    return (
      <Layout>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">المقال غير موجود</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على المقال المطلوب</p>
          <Link href="/posts">
            <Button className="flex items-center gap-2 gap-reverse">
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمقالات</span>
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
let replaceBold = (paragraph:string) => {
  const boldAtStart = paragraph.match(/^\*\*(.*?)\*\*(.*)/);
  if (boldAtStart) {
    return <span><strong>{boldAtStart[1]}</strong>{boldAtStart[2]}</span>;
  }
  return paragraph;
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
          <Link href="/posts" className="hover:text-primary-main transition-colors">
            المقالات
          </Link>
          <span>/</span>
          <span className="text-gray-900">{post.title}</span>
        </div>

        {/* Article Header */}
        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 gap-reverse text-gray-600">
                
                <div className="flex items-center gap-2 gap-reverse">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 gap-reverse">
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

          {/* Article Image */}
          {post.image && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

         {post.tags.length>0&& <div className='flex items-center gap-2 mb-4 gap-reverse'>
            <div className='flex items-center gap-2 gap-reverse'>
              <Tag className='w-4 h-4' />
              <span className='text-primary-main'>{post.tags.join(', ')}</span>
            </div>
          </div>}


          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900">
            {post.content.split('\n')?.map((paragraph:string, index:number) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              } else if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              } else if (paragraph.startsWith('- ')) {
              
                return (
                  <ul key={index} className="list-disc list-inside text-gray-700 mb-4">
                    <li>{replaceBold(paragraph.replace('- ', ''))}</li>
                  </ul>
                );
              } else if (paragraph.trim()) {
                 // إذا كان السطر يبدأ بـ **...**
    const boldAtStart = paragraph.match(/^\*\*(.*?)\*\*(.*)/);
    if (boldAtStart) {
      console.log(boldAtStart);
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
          <strong>{boldAtStart[1]}</strong>
          {boldAtStart[2]}
        </p>
      );
    }
    return (
      <p key={index} className="text-gray-700 mb-4 leading-relaxed">
        {paragraph}
      </p>
    );
                
              }
              return null;
            })}
          </div>
        </Card>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="تعديل المقال"
          className='max-w-7xl'
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى المقال
              </label>
              <Textarea
                {...register('content')}
                rows={4}
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
                      width={300}
                      height={180}
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
                    <UploadImage inputRef={inputRef} setImage={setImagePreview} isUploading={isUploading} setIsUploading={setIsUploading} className='hidden' image={imagePreview} />
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
                <span>تحديث المقال</span>
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
    </Layout>
  );
} 