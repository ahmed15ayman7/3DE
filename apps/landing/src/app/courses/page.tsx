'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { landingApi } from '@3de/apis';
import { Course } from '@3de/interfaces';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import CourseCard from '../../components/CourseCard';
import { 
  Search, 
  Filter, 
  Grid3X3,
  List,
  BookOpen,
  Users,
  Award,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@3de/ui';
import { Pagination } from '@3de/ui';
const categories = [
  "جميع الفئات",
  "البرمجة",
  "الذكاء الاصطناعي", 
  "إدارة الأعمال",
  "التصميم",
  "الأمن السيبراني",
  "التسويق"
];

const levels = [
  { value: "all", label: "جميع المستويات" },
  { value: "مبتدئ", label: "مبتدئ" },
  { value: "متوسط", label: "متوسط" },
  { value: "متقدم", label: "متقدم" }
];

const priceRanges = [
  { value: "all", label: "جميع الأسعار" },
  { value: "free", label: "مجاني" },
  { value: "0-100", label: "أقل من 100 جنية" },
  { value: "100-500", label: "100 - 500 جنية" },
  { value: "500-1000", label: "500 - 1000 جنية" },
  { value: "1000+", label: "أكثر من 1000 جنية" }
];

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "popular", label: "الأكثر شعبية" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "price-low", label: "السعر: من الأقل للأعلى" },
  { value: "price-high", label: "السعر: من الأعلى للأقل" }
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع الفئات');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // Fetch courses
  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: () =>
       landingApi.getCourses(searchTerm,take,skip),
  });

  // Fetch instructors for filtering
  const { data: instructorsData } = useQuery({
    queryKey: ['instructors'],
    queryFn: () =>
       landingApi.getInstructors("", 9, 0),
  });

  const allCourses = coursesData?.data.courses || [];

  // Transform course data to match component props
  const transformCourseData = (course: Course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    image: course.image || "/images/courses/default.jpg",
    instructor: {
      name: course.instructors?.[0]?.user?.firstName + " " + course.instructors?.[0]?.user?.lastName || "محاضر",
      avatar: course.instructors?.[0]?.user?.avatar || "/images/instructors/default.jpg"
    },
    duration: course.duration ? `${course.duration} أسبوع` : "مدة غير محددة",
    lessons: course.lessons?.length || 0,
    students: course.enrollments?.length || 0,
    rating: 4.8, // Default rating since not in schema
    price: course.price || 0, // No price in schema
    level: course.level as 'مبتدئ' | 'متوسط' | 'متقدم',
    category: course.level, // Using level as category for now
    isNew: new Date(course.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isFree: true, // Default to free
    startDate: course.startDate ? new Date(course.startDate).toLocaleDateString('ar-EG') : undefined
  });

  // Filter and search logic
  const filteredCourses = allCourses.filter(course => {
    const transformedCourse = transformCourseData(course);
    
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.instructors?.[0]?.user?.firstName + " " + course.instructors?.[0]?.user?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'جميع الفئات' || transformedCourse.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || transformedCourse.level === selectedLevel;
    const matchesFree = !showFreeOnly || transformedCourse.isFree;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesFree;
  });

  // Sort logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.enrollments?.length || 0) - (a.enrollments?.length || 0);
      case 'rating':
        return 4.8 - 4.8; // Default rating
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('جميع الفئات');
    setSelectedLevel('all');
    setSelectedPriceRange('all');
    setShowFreeOnly(false);
    setSortBy('newest');
  };

  if (coursesError) {
    return (
      <Layout showBreadcrumb={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">حدث خطأ في تحميل الكورسات</h2>
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
        title="الكورسات التعليمية"
        subtitle="📚 اكتشف عالم المعرفة"
        description="مجموعة شاملة من الكورسات التقنية والمهنية المصممة لتناسب جميع المستويات ومختلف التخصصات"
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
                    placeholder="ابحث في الكورسات، المحاضرين، أو المواضيع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter size={18} />
                    فلترة
                  </Button>
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-main text-white' : 'bg-white text-gray-600'}`}
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-main text-white' : 'bg-white text-gray-600'}`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                    {/* Level Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المستوى</label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main"
                      >
                        {levels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
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

                    {/* Free Filter */}
                    <div className="flex items-center gap-2 gap-reverse pt-6">
                      <input
                        type="checkbox"
                        id="freeOnly"
                        checked={showFreeOnly}
                        onChange={(e) => setShowFreeOnly(e.target.checked)}
                        className="w-4 h-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
                      />
                      <label htmlFor="freeOnly" className="text-sm font-medium text-gray-700">
                        الكورسات المجانية فقط
                      </label>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {sortedCourses.length} كورس من أصل {allCourses.length}
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
          {(selectedCategory !== 'جميع الفئات' || selectedLevel !== 'all' || showFreeOnly || searchTerm) && (
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
              {selectedCategory !== 'جميع الفئات' && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  الفئة: {selectedCategory}
                  <button onClick={() => setSelectedCategory('جميع الفئات')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedLevel !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  المستوى: {levels.find(l => l.value === selectedLevel)?.label}
                  <button onClick={() => setSelectedLevel('all')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {showFreeOnly && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  مجاني فقط
                  <button onClick={() => setShowFreeOnly(false)} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {/* Courses Grid/List */}
          {coursesLoading ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
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
          ) : sortedCourses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {sortedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <CourseCard 
                    {...transformCourseData(course)}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
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
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  لم نجد أي كورسات
                </h3>
                <p className="text-text-secondary mb-6">
                  لم نتمكن من العثور على كورسات تطابق معايير البحث الخاصة بك. 
                  جرب تعديل الفلاتر أو مصطلحات البحث.
                </p>
                <Button onClick={clearAllFilters}>
                  مسح جميع الفلاتر
                </Button>
              </div>
            </motion.div>
          )}
          { coursesData?.data.totalPages && coursesData?.data.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={skip}
              totalPages={coursesData?.data.totalPages || 0}
              totalItems={coursesData?.data.total || 0}
              itemsPerPage={take}
              onPageChange={(page) => setSkip(page)}
              onItemsPerPageChange={(itemsPerPage) => setTake(itemsPerPage)}
              showItemsPerPage={false}
              showTotalItems={false}
            />
          </div>
          )}
        </div>
      </section>

      {/* Course Statistics */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              إحصائيات الكورسات
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  icon: BookOpen, 
                  number: allCourses.length.toString(), 
                  label: "كورس متاح" 
                },
                { 
                  icon: Users, 
                  number: allCourses.reduce((total, course) => total + (course.enrollments?.length || 0), 0).toLocaleString(), 
                  label: "طالب مسجل" 
                },
                { 
                  icon: Clock, 
                  number: allCourses.reduce((total, course) => total + (course.lessons?.length || 0), 0).toString(), 
                  label: "درس تعليمي" 
                },
                { 
                  icon: Award, 
                  number: (instructorsData?.data?.instructors.length || 0).toString(), 
                  label: "محاضر متخصص" 
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

      {/* CTA Section */}
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
              لم تجد الكورس المناسب؟
            </h2>
            <p className="text-xl mb-8 opacity-90 text-gray-200">
              تواصل معنا وسنساعدك في العثور على البرنامج التدريبي المثالي لاحتياجاتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" variant='primary'>
                <BookOpen size={20} className="ml-2" />
                اقترح كورس
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-primary-main">
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 