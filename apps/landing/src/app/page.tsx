'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { courseApi, instructorApi, eventApi, communityApi } from '@3de/apis';
import { Course, Instructor, Event, BlogPost, User } from '@3de/interfaces';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import InstructorCard from '../components/InstructorCard';
import BlogCard from '../components/BlogCard';
import EventCard from '../components/EventCard';
import ContactForm from '../components/ContactForm';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Star,
  Play,
  Clock,
  Award,
  Globe,
  Calendar,
  CheckCircle,
  Zap,
  Heart,
  Target,
  TrendingUp,
  Building,
  GraduationCap,
  Shield
} from 'lucide-react';
import { Button } from '@3de/ui';
import axios from 'axios';
let getCourses = async () => {
  const response = await axios.get('https://api.3de.school/public/courses');
  return response as {data: Course[]};
}
let getInstructors = async () => {
  const response = await axios.get('https://api.3de.school/public/instructors');
  return response as {data: Instructor[]};
}
let getEvents = async () => {
  const response = await axios.get('https://api.3de.school/public/events');
  return response as {data: Event[]};
}
export default function HomePage() {
  // Fetch featured courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () =>
       getCourses(),
  });

  // Fetch top instructors
  const { data: instructorsData, isLoading: instructorsLoading } = useQuery({
    queryKey: ['top-instructors'],
    queryFn: () =>
       getInstructors(),
  });

  // Fetch upcoming events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () =>
       getEvents(),
  });

  // Get featured courses (first 3)
  const featuredCourses = coursesData?.data?.slice(0, 3) || [];
  
  // Get top instructors (first 3)  
  const topInstructors = instructorsData?.data?.slice(0, 3) || [];
  
  // Get upcoming events (first 2)
  const upcomingEvents = eventsData?.data?.slice(0, 2) || [];

  // Mock blog data (since there's no blog API yet)
  const latestBlogs = [
    {
      id: "1",
      title: "مستقبل التعليم الرقمي في المنطقة العربية",
      excerpt: "نظرة عميقة على التطورات الحديثة في مجال التعليم الإلكتروني وتأثيرها على المنطقة العربية",
      featuredImage: "/images/blogs/digital-education.jpg",
      author: {
        name: "فريق 3DE",
        avatar: "/images/team/3de-team.jpg",
        role: "فريق المحتوى"
      },
      publishedAt: "2024-01-15",
      readTime: "5 دقائق",
      category: "التعليم الرقمي",
      tags: ["تعليم", "تكنولوجيا", "مستقبل"],
      views: 1250,
      likes: 89,
      comments: 24
    },
    {
      id: "2",
      title: "10 نصائح لتعلم البرمجة بفعالية",
      excerpt: "دليل شامل للمبتدئين في البرمجة مع أفضل الطرق والأساليب للتعلم السريع",
      featuredImage: "/images/blogs/programming-tips.jpg",
      author: {
        name: "أحمد محمد",
        avatar: "/images/instructors/ahmed.jpg",
        role: "مطور ومعلم"
      },
      publishedAt: "2024-01-10",
      readTime: "8 دقائق",
      category: "البرمجة",
      tags: ["برمجة", "نصائح", "تعلم"],
      views: 2100,
      likes: 156,
      comments: 45,
      variant: "featured" as const
    }
  ];

  const transformCourseData = (course: Course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    image: course.image || "/images/courses/default.jpg",
    instructor: {
      name: course.instructors?.[0]?.user?.firstName + " " + course.instructors?.[0]?.user?.lastName || "مدرب",
      avatar: course.instructors?.[0]?.user?.avatar || "/images/instructors/default.jpg"
    },
    duration: course.duration ? `${course.duration} أسبوع` : "مدة غير محددة",
    lessons: course.lessons?.length || 0,
    students: course.enrollments?.length || 0,
    rating: 4.8, // Default rating
    level: course.level as 'مبتدئ' | 'متوسط' | 'متقدم',
    category: course.level,
    isNew: new Date(course.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isFree: true, // Default to free
    startDate: course.startDate ? new Date(course.startDate).toLocaleDateString('ar-SA') : undefined
  });

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

  const transformEventData = (event: Event) => ({
    id: event.id,
    title: event.title,
    description: event.description || "حدث تعليمي مميز",
    featuredImage: "/images/events/default.jpg",
    startDate: new Date(event.startTime).toISOString().split('T')[0],
    startTime: new Date(event.startTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    endTime: new Date(event.endTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    location: {
      type: "offline" as const,
      venue: "أكاديمية 3DE",
      city: "الرياض"
    },
    organizer: {
      name: "أكاديمية 3DE",
      avatar: "/images/logo.png"
    },
    category: "فعالية تعليمية",
    tags: ["تعليم", "تدريب"],
    maxAttendees: 100,
    currentAttendees: 50,
    isFree: true
  });

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="أكاديمية 3DE - نحو تعليم رقمي متميز"
        subtitle="🚀 انطلق في رحلتك التعليمية"
        description="منصة تعليمية شاملة تقدم أفضل الكورسات التقنية والمهنية بأحدث الأساليب التفاعلية مع نخبة من أفضل المحاضرين في الوطن العربي"
        primaryAction={{
          label: "ابدأ التعلم الآن",
          href: "/courses"
        }}
        secondaryAction={{
          label: "تصفح الكورسات",
          href: "/courses"
        }}
        size="xl"
        pattern={true}
      >
        {/* Hero Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
        >
          {[
            { icon: Users, number: `${instructorsData?.data?.reduce((total, instructor) => total + (instructor.courses?.reduce((courseTotal, course) => courseTotal + (course.enrollments?.length || 0), 0) || 0), 0) || "10,000"}+`, label: "طالب" },
            { icon: BookOpen, number: `${coursesData?.data?.length || "200"}+`, label: "كورس" },
            { icon: Award, number: `${instructorsData?.data?.length || "50"}+`, label: "محاضر" },
            { icon: Trophy, number: "95%", label: "نسبة النجاح" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <stat.icon size={28} className="text-primary-main" />
              </div>
              <div className="text-2xl font-bold text-text-primary">{stat.number}</div>
              <div className="text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Hero>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              لماذا تختار أكاديمية 3DE؟
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              نقدم تجربة تعليمية متكاملة تجمع بين أحدث التقنيات والخبرات المتميزة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "تعليم هادف ومخصص",
                description: "مناهج مصممة خصيصاً لتلبية احتياجات السوق العربي مع تركيز على المهارات العملية"
              },
              {
                icon: Users,
                title: "محاضرون متميزون",
                description: "نخبة من أفضل الخبراء والأكاديميين في المنطقة العربية مع خبرات عملية واسعة"
              },
              {
                icon: Zap,
                title: "تعلم تفاعلي",
                description: "منصة متطورة تدعم التعلم التفاعلي مع مشاريع عملية ومتابعة شخصية"
              },
              {
                icon: Shield,
                title: "شهادات معتمدة",
                description: "احصل على شهادات معتمدة ومعترف بها في السوق العربي والدولي"
              },
              {
                icon: Clock,
                title: "مرونة في التعلم",
                description: "تعلم في أي وقت ومن أي مكان مع إمكانية الوصول مدى الحياة للمحتوى"
              },
              {
                icon: Heart,
                title: "دعم مستمر",
                description: "فريق دعم متخصص ومجتمع نشط من المتعلمين لمساعدتك في رحلتك التعليمية"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card text-center group"
              >
                <div className="card-body">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              الكورسات المميزة
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              اكتشف أحدث الكورسات التقنية والمهنية المصممة خصيصاً للطلاب العرب
            </p>
            <Button size="lg" variant="outline" className="bg-white">
              <BookOpen size={20} className="ml-2" />
              عرض جميع الكورسات
            </Button>
          </motion.div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="card-body animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <CourseCard {...transformCourseData(course)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Instructors Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              محاضرونا المتميزون
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              تعلم من نخبة الخبراء والأكاديميين المتميزين في مختلف المجالات التقنية
            </p>
            <Button size="lg" variant="outline">
              <Users size={20} className="ml-2" />
              تصفح جميع المحاضرين
            </Button>
          </motion.div>

          {instructorsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="card-body animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topInstructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <InstructorCard {...transformInstructorData(instructor)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              أرقام تتحدث عن نجاحنا
            </h2>
            <p className="text-xl opacity-90 text-gray-300">
              إنجازات حققناها معاً في رحلة التعليم الرقمي
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { 
                icon: GraduationCap, 
                number: `${instructorsData?.data?.reduce((total, instructor) => total + (instructor.courses?.reduce((courseTotal, course) => courseTotal + (course.enrollments?.length || 0), 0) || 0), 0) || "15,000"}+`, 
                label: "خريج" 
              },
              { 
                icon: BookOpen, 
                number: `${coursesData?.data?.reduce((total, course) => total + (course.lessons?.length || 0), 0) || "500"}+`, 
                label: "ساعة محتوى" 
              },
              { icon: Building, number: "100+", label: "شريك" },
              { icon: Globe, number: "25+", label: "دولة" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <stat.icon size={32} className="text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              أحدث المقالات
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              اطلع على أحدث المقالات والأخبار في عالم التقنية والتعليم الرقمي
            </p>
            <Button size="lg" variant="outline">
              <BookOpen size={20} className="ml-2" />
              عرض جميع المقالات
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <BlogCard {...blog} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              الفعاليات القادمة
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              انضم إلى فعالياتنا التعليمية وورش العمل التطبيقية
            </p>
            <Button size="lg" variant="outline" className="bg-white">
              <Calendar size={20} className="ml-2" />
              عرض جميع الفعاليات
            </Button>
          </motion.div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="card">
                  <div className="card-body animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event: Event, index: number) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <EventCard {...transformEventData(event)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container">
          <ContactForm 
            className="mb-16"
            onSubmit={async (data) => {
              // Handle contact form submission
              console.log('Contact form submitted:', data);
            }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              ابدأ رحلتك التعليمية اليوم
            </h2>
            <p className="text-xl mb-8 opacity-90 text-white">
              انضم إلى آلاف الطلاب الذين حققوا أهدافهم التعليمية والمهنية معنا
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" variant="primary" >
                <Play size={20} className="ml-2" />
                ابدأ التعلم مجاناً
              </Button>
              <Button size="lg" variant="outline" >
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
