'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Instructor } from '@3de/interfaces';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import InstructorCard from '../../components/InstructorCard';
import { 
  Search, 
  Filter, 
  Users,
  BookOpen,
  Star,
  Award,
  Globe,
  GraduationCap,
  TrendingUp,
  X
} from 'lucide-react';
import { Button } from '@3de/ui';
import axios from 'axios';
const categories = [
  "جميع التخصصات",
  "البرمجة",
  "الذكاء الاصطناعي", 
  "إدارة الأعمال",
  "التصميم",
  "الأمن السيبراني",
  "التسويق"
];

const sortOptions = [
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "students", label: "الأكثر طلاباً" },
  { value: "courses", label: "الأكثر كورسات" },
  { value: "experience", label: "الأكثر خبرة" },
  { value: "name", label: "الاسم (أبجدياً)" }
];
let getInstructors = async (search: string) => {
  const response = await axios.get(`https://api.3de.school/public/instructors?search=${search}`);
  return response as {data: Instructor[]};
}

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع التخصصات');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Fetch instructors
  const { data: instructorsData, isLoading: instructorsLoading, error: instructorsError } = useQuery({
    queryKey: ['instructors'],
    queryFn: () =>
       getInstructors(searchTerm),
  });


  const allInstructors = instructorsData?.data || [];

  // Transform instructor data to match component props
  const transformInstructorData = (instructor: Instructor) => ({
    id: instructor.id,
    name: instructor.user?.firstName + " " + instructor.user?.lastName,
    title: instructor.title || "مدرب متخصص",
    bio: instructor.bio || "خبير في مجاله مع سنوات من الخبرة العملية",
    avatar: instructor.user?.avatar || "/images/instructors/default.jpg",
    specializations: instructor.skills || ["التدريس", "التطوير"],
    rating: instructor.rating || 4.8,
    totalStudents: instructor.courses?.reduce((total, course) => total + (course.enrollments?.length || 0), 0) || 0,
    totalCourses: instructor.courses?.length || 0,
    experience: instructor.experienceYears ? `${instructor.experienceYears} سنة` : "خبرة متميزة",
    location: instructor.location || "المملكة العربية السعودية",
    isVerified: true,
    languages: ["العربية", "الإنجليزية"],
    socialLinks: {}
  });

  // Filter and search logic
  const filteredInstructors = allInstructors.filter(instructor => {
    const transformedInstructor = transformInstructorData(instructor);
    
    const matchesSearch = instructor.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (instructor.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (instructor.bio || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'جميع التخصصات' || 
                           instructor.skills.some(skill => skill.includes(selectedCategory));
    const matchesVerified = !showVerifiedOnly || transformedInstructor.isVerified;
    
    return matchesSearch && matchesCategory && matchesVerified;
  });

  // Sort logic
  const sortedInstructors = [...filteredInstructors].sort((a, b) => {
    const aTransformed = transformInstructorData(a);
    const bTransformed = transformInstructorData(b);
    
    switch (sortBy) {
      case 'students':
        return bTransformed.totalStudents - aTransformed.totalStudents;
      case 'courses':
        return bTransformed.totalCourses - aTransformed.totalCourses;
      case 'experience':
        return (b.experienceYears || 0) - (a.experienceYears || 0);
      case 'name':
        return (a.user?.firstName + " " + a.user?.lastName).localeCompare(
          b.user?.firstName + " " + b.user?.lastName, 'ar'
        );
      default: // rating
        return (b.rating || 4.8) - (a.rating || 4.8);
    }
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('جميع التخصصات');
    setShowVerifiedOnly(false);
    setSortBy('rating');
  };

  if (instructorsError) {
    return (
      <Layout showBreadcrumb={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">حدث خطأ في تحميل بيانات المدربين</h2>
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
        title="فريق المدربين"
        subtitle="👨‍🏫 خبراء في مجالاتهم"
        description="تعرف على نخبة من أفضل المدربين والخبراء الذين يقدمون المعرفة والخبرة العملية في مختلف التخصصات التقنية والمهنية"
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
                    placeholder="ابحث عن المدربين حسب الاسم، التخصص، أو المهارات..."
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
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

                    {/* Verified Filter */}
                    <div className="flex items-center gap-2 gap-reverse pt-6">
                      <input
                        type="checkbox"
                        id="verifiedOnly"
                        checked={showVerifiedOnly}
                        onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                        className="w-4 h-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
                      />
                      <label htmlFor="verifiedOnly" className="text-sm font-medium text-gray-700">
                        المدربين المعتمدين فقط
                      </label>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {sortedInstructors.length} مدرب من أصل {allInstructors.length}
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
          {(selectedCategory !== 'جميع التخصصات' || showVerifiedOnly || searchTerm) && (
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
              {selectedCategory !== 'جميع التخصصات' && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-dark rounded-full text-sm">
                  التخصص: {selectedCategory}
                  <button onClick={() => setSelectedCategory('جميع التخصصات')} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
              {showVerifiedOnly && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  معتمد فقط
                  <button onClick={() => setShowVerifiedOnly(false)} className="mr-2">
                    <X size={14} />
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {/* Instructors Grid */}
          {instructorsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card">
                  <div className="card-body animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedInstructors.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedInstructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <InstructorCard {...transformInstructorData(instructor)} />
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
                  لم نجد أي مدربين
                </h3>
                <p className="text-text-secondary mb-6">
                  لم نتمكن من العثور على مدربين يطابقون معايير البحث الخاصة بك. 
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

      {/* Stats Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              إحصائيات فريق المدربين
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  icon: Users, 
                  number: allInstructors.length.toString(), 
                  label: "مدرب متخصص" 
                },
                { 
                  icon: BookOpen, 
                  number: allInstructors.reduce((total, instructor) => total + (instructor.courses?.length || 0), 0).toString(), 
                  label: "كورس متاح" 
                },
                { 
                  icon: GraduationCap, 
                  number: allInstructors.reduce((total, instructor) => total + (instructor.courses?.reduce((courseTotal, course) => courseTotal + (course.enrollments?.length || 0), 0) || 0), 0).toLocaleString(), 
                  label: "طالب تدرب" 
                },
                { 
                  icon: Star, 
                  number: allInstructors.length > 0 ? (allInstructors.reduce((total, instructor) => total + (instructor.rating || 4.8), 0) / allInstructors.length).toFixed(1) : "4.8", 
                  label: "متوسط التقييم" 
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

      {/* Join Our Team CTA */}
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
              انضم إلى فريق المدربين
            </h2>
            <p className="text-xl mb-8 opacity-90">
              هل أنت خبير في مجالك وتريد مشاركة معرفتك؟ انضم إلى فريقنا وساعد في تعليم الآلاف من الطلاب
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" className="bg-white text-primary-main hover:bg-gray-100">
                <Award size={20} className="ml-2" />
                تقدم كمدرب
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-main">
                تعرف على المتطلبات
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 