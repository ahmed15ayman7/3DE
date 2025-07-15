'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { postApi } from '@3de/apis';
import { Post, User, Comment } from '@3de/interfaces';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import BlogCard from '../../components/BlogCard';
import { 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  BookOpen,
  TrendingUp,
  X,
  Tag
} from 'lucide-react';
import { Button } from '@3de/ui';
import axios from 'axios';

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
let getPosts = async () => {
  const response = await axios.get('https://api.3de.school/posts/public');
  return response as {data: Post[]};
} 
export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع المقالات');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch blog posts from community posts
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () =>
       getPosts(),
  });

  const allPosts = postsData?.data || [];

  // Transform post data to match component props
  const transformBlogData = (post: Post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.content.substring(0, 200) + "...",
    featuredImage: "/images/blog/default.jpg",
    publishDate: new Date(post.createdAt).toLocaleDateString('ar-SA'),
    publishedAt: new Date(post.createdAt).toLocaleDateString('ar-SA'),
    readTime: Math.ceil(post.content.split(' ').length / 200) + " دقيقة",
    author: {
      name: post.author?.firstName + " " + post.author?.lastName,
      avatar: post.author?.avatar || "/images/authors/default.jpg",
      role: "كاتب محتوى"
    },
    category: "مقال تقني",
    tags: ["تقنية", "تعليم"],
    views: Math.floor(Math.random() * 1000) + 100, // Mock views
    likes: Math.floor(Math.random() * 50) + 10, // Mock likes
    comments: post.comments?.length || 0,
    isNew: new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isFeatured: false
  });

  // Filter and search logic
  const filteredPosts = allPosts.filter((post: Post ) => {
    const transformedPost = transformBlogData(post);
    
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.author?.firstName + " " + post.author?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'جميع المقالات' || transformedPost.category.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aTransformed = transformBlogData(a);
    const bTransformed = transformBlogData(b);
    
    switch (sortBy) {
      case 'popular':
        return bTransformed.likes - aTransformed.likes;
      case 'mostRead':
        return bTransformed.views - aTransformed.views;
      case 'mostLiked':
        return bTransformed.likes - aTransformed.likes;
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
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
        title="مدونة أكاديمية 3DE"
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
                      {sortedPosts.length} مقال من أصل {allPosts.length}
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
          ) : sortedPosts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedPosts.map((post, index) => (
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
              إحصائيات المدونة
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              اشترك في نشرتنا الإخبارية
            </h2>
            <p className="text-xl mb-8 opacity-90">
              احصل على أحدث المقالات والرؤى التقنية مباشرة في بريدك الإلكتروني
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-4 py-3 rounded-lg text-text-primary focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <Button size="lg" className="bg-white text-primary-main hover:bg-gray-100">
                  اشتراك
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-3">
                لن نرسل لك رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 