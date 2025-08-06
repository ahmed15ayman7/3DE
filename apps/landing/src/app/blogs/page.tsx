'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { landingApi } from '@3de/apis';
import { BlogPost } from '@3de/interfaces';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import BlogCard from '../../components/BlogCard';
import { 
  Search, 
  Filter, 
  Eye,
  Heart,
  MessageCircle,
  BookOpen,
  X,
} from 'lucide-react';
import { Button, Pagination } from '@3de/ui';

const categories = [
  "جميع المقالات",
  "تقنية",
  "تعليم",
  "ذكاء اصطناعي",
  "تطوير الويب",
  "أمن سيبراني",
  "تصميم",
  "ريادة أعمال",
  "نصائح"
];

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "popular", label: "الأكثر شعبية" },
  { value: "mostRead", label: "الأكثر قراءة" },
  { value: "mostLiked", label: "الأكثر إعجاباً" }
];

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع المقالات');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // Fetch blog posts from community posts
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () =>
       landingApi.getBlogs(searchTerm, take, skip),
  });

  const allPosts = postsData?.data.posts || [];

  // Transform post data to match component props
  const transformBlogData = (post: Partial<BlogPost>) => ({
    id: post.id || "",
    title: post.title || "",
    excerpt: post.content?.substring(0, 200) + "...",
    featuredImage: post.image || "",
    publishDate: new Date(post.publishDate || "").toLocaleDateString('ar-EG'),
    readTime: Math.ceil(post.content?.split(' ').length || 0 / 200) + " دقيقة",
    category: "مقال تقني",
    tags: post.tags || [],
    isNew: new Date(post.createdAt || "") > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isFeatured: false
  });

  // Filter and search logic
  const filteredPosts = allPosts.filter((post: Partial<BlogPost> ) => {
    const transformedPost = transformBlogData(post);
    
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase()) 
                      
    
    const matchesCategory = selectedCategory === 'جميع المقالات' || transformedPost.category.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('جميع المقالات');
    setSortBy('newest');
  };

  if (postsError) {
    return (
      <Layout showBreadcrumb={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">حدث خطأ في تحميل المقالات</h2>
            <p className="text-text-secondary">يرجى المحاولة مرة أخرى لاحقاً</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="مدونة أكاديمية IAFCE"
        subtitle="📚 رؤى ومقالات تقنية"
        description="اكتشف أحدث المقالات والرؤى التقنية من خبرائنا في مختلف المجالات التكنولوجية والتعليمية"
        size="md"
        pattern={true}
      />

      <section className="section bg-white">
        <div className="container">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Search Bar */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ابحث في المقالات، الكتاب، أو الكلمات المفتاحية..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter size={18} />
                  فلترة
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {filteredPosts.length} مقال من أصل {postsData?.data.total || 0}
                    </span>
                    <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
                      <X size={16} className="ml-1" />
                      مسح الفلاتر
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Active Filters */}
          {(selectedCategory !== 'جميع المقالات' || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  البحث: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedCategory !== 'جميع المقالات' && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  الفئة: {selectedCategory}
                  <button onClick={() => setSelectedCategory('جميع المقالات')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card">
                  <div className="card-body animate-pulse">
                    <div className="h-40 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <BlogCard {...transformBlogData(post)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <BookOpen className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  لم نجد أي مقالات
                </h3>
                <p className="text-text-secondary mb-6">
                  لم نتمكن من العثور على مقالات تطابق معايير البحث الخاصة بك. 
                  جرب تعديل الفلاتر أو مصطلحات البحث.
                </p>
                <Button onClick={clearAllFilters}>
                  مسح جميع الفلاتر
                </Button>
              </div>
            </motion.div>
          )}
          {postsData && postsData.data.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                totalPages={postsData?.data.totalPages || 0}
                currentPage={skip / take + 1}
                onPageChange={(page) => setSkip(page * take)}
                totalItems={postsData?.data.total || 0}
                itemsPerPage={take}
                onItemsPerPageChange={(itemsPerPage) => setTake(itemsPerPage)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Blog Statistics */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              إحصائيات اخبارنا
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  icon: BookOpen, 
                  number: allPosts.length.toString(), 
                  label: "مقال منشور" 
                },
                { 
                  icon: Eye, 
                  number: (allPosts.length * 450).toLocaleString(), 
                  label: "مشاهدة إجمالية" 
                },
                { 
                  icon: Heart, 
                  number: (allPosts.length * 25).toString(), 
                  label: "إعجاب" 
                },
                { 
                  icon: MessageCircle, 
                  number: (allPosts.length * 8).toString(), 
                  label: "تعليق" 
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-main rounded-xl flex items-center justify-center">
                    <stat.icon size={28} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{stat.number}</div>
                  <div className="text-text-secondary">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="section bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              اشترك في نشرتنا الإخبارية
            </h2>
            <p className="text-xl mb-8 opacity-90 text-gray-200">
              احصل على أحدث المقالات والرؤى التقنية مباشرة في بريدك الإلكتروني
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-4 py-3 rounded-lg text-white focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <Button size="lg" variant='primary'>
                  اشتراك
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-3 text-gray-200">
                لن نرسل لك رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 