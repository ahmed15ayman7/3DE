'use client';

import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import CourseCard from '../../components/CourseCard';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Star,
  Clock,
  Award,
  Globe,
  Target,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Brain,
  Code,
  Briefcase,
  Palette,
  Database
} from 'lucide-react';
import { Button } from '@3de/ui';

// Learning Paths Data
const learningPaths = [
  {
    id: "web-development",
    title: "مطور الويب الشامل",
    description: "مسار متكامل لتعلم تطوير الويب من الأساسيات إلى المستوى المتقدم",
    icon: Code,
    duration: "6 أشهر",
    courses: 12,
    students: 2500,
    level: "جميع المستويات",
    skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    color: "from-blue-500 to-purple-600"
  },
  {
    id: "data-science",
    title: "عالم البيانات",
    description: "تعلم تحليل البيانات والذكاء الاصطناعي وعلوم البيانات",
    icon: Brain,
    duration: "8 أشهر",
    courses: 15,
    students: 1800,
    level: "متوسط إلى متقدم",
    skills: ["Python", "Machine Learning", "Data Analysis", "AI", "Statistics"],
    color: "from-green-500 to-teal-600"
  },
  {
    id: "business-management",
    title: "إدارة الأعمال الرقمية",
    description: "مهارات القيادة وإدارة المشاريع في العصر الرقمي",
    icon: Briefcase,
    duration: "4 أشهر",
    courses: 10,
    students: 2200,
    level: "مبتدئ إلى متوسط",
    skills: ["Project Management", "Leadership", "Digital Marketing", "Strategy"],
    color: "from-orange-500 to-red-600"
  },
  {
    id: "ui-ux-design",
    title: "تصميم تجربة المستخدم",
    description: "تعلم تصميم واجهات المستخدم وتجربة المستخدم الحديثة",
    icon: Palette,
    duration: "5 أشهر",
    courses: 8,
    students: 1500,
    level: "مبتدئ إلى متوسط",
    skills: ["UI Design", "UX Research", "Figma", "Prototyping", "User Testing"],
    color: "from-pink-500 to-purple-600"
  },
  {
    id: "cybersecurity",
    title: "الأمن السيبراني",
    description: "حماية الأنظمة والشبكات من التهديدات السيبرانية",
    icon: Shield,
    duration: "7 أشهر",
    courses: 14,
    students: 1200,
    level: "متوسط إلى متقدم",
    skills: ["Network Security", "Ethical Hacking", "Risk Management", "Compliance"],
    color: "from-gray-600 to-blue-700"
  },
  {
    id: "database-admin",
    title: "إدارة قواعد البيانات",
    description: "تصميم وإدارة قواعد البيانات الحديثة",
    icon: Database,
    duration: "4 أشهر",
    courses: 9,
    students: 900,
    level: "متوسط",
    skills: ["SQL", "Database Design", "Performance Tuning", "Cloud Databases"],
    color: "from-indigo-500 to-cyan-600"
  }
];

// Popular Courses
const popularCourses = [
  {
    id: "react-advanced",
    title: "React المتقدم - بناء تطبيقات متقدمة",
    description: "تعلم بناء تطبيقات React معقدة مع أحدث الممارسات والتقنيات",
    image: "https://www.patterns.dev/img/reactjs/react-logo@3x.svg",
    instructor: {
      name: "أحمد محمد",
      avatar: "https://media.istockphoto.com/id/2194078950/photo/profile-picture-of-smiling-confident-arabic-businessman.jpg?s=2048x2048&w=is&k=20&c=L9F4GK4q8_DiSOtQfWoc_XgDAPWsymcwnRji2qs01do="
    },
    duration: "8 أسابيع",
    lessons: 32,
    students: 850,
    rating: 4.9,
    price: 1200,
    originalPrice: 1800,
    level: "متقدم" as const,
    category: "البرمجة",
    isNew: true,
    variant: "featured" as const
  },
  {
    id: "ai-fundamentals",
    title: "أساسيات الذكاء الاصطناعي والتعلم الآلي",
    description: "مقدمة شاملة لعالم الذكاء الاصطناعي مع تطبيقات عملية",
    image: "https://academy.hsoub.com/uploads/monthly_2023_01/374072051_--.jpg.c7dab48ef8c4be326eb8c9f64a2c0b3c.jpg",
    instructor: {
      name: "د. سارة أحمد",
      avatar: "https://media.istockphoto.com/id/2194078950/photo/profile-picture-of-smiling-confident-arabic-businessman.jpg?s=2048x2048&w=is&k=20&c=L9F4GK4q8_DiSOtQfWoc_XgDAPWsymcwnRji2qs01do="
    },
    duration: "10 أسابيع",
    lessons: 40,
    students: 1200,
    rating: 4.8,
    price: 950,
    level: "مبتدئ" as const,
    category: "الذكاء الاصطناعي",
    isNew: false
  },
  {
    id: "digital-marketing",
    title: "التسويق الرقمي المتقدم",
    description: "استراتيجيات التسويق الرقمي الحديثة ووسائل التواصل الاجتماعي",
    image: "https://goalmakers.net/wp-content/uploads/2024/03/%D8%A7%D9%84%D8%AA%D8%B3%D9%88%D9%8A%D9%82-%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A-%D9%A2%D9%A5-.png",
    instructor: {
      name: "ليلى السعد",
      avatar: "https://media.istockphoto.com/id/2194078950/photo/profile-picture-of-smiling-confident-arabic-businessman.jpg?s=2048x2048&w=is&k=20&c=L9F4GK4q8_DiSOtQfWoc_XgDAPWsymcwnRji2qs01do="
    },
    duration: "6 أسابيع",
    lessons: 24,
    students: 750,
    rating: 4.7,
    price: 680,
    level: "متوسط" as const,
    category: "التسويق",
    isNew: false
  }
];

// Academy Features
const academyFeatures = [
  {
    icon: Target,
    title: "مسارات تعليمية مخصصة",
    description: "مسارات تعليمية متكاملة مصممة خصيصاً لتلبية احتياجات السوق المحلي والعالمي"
  },
  {
    icon: Users,
    title: "مجتمع متفاعل",
    description: "انضم إلى مجتمع من المتعلمين والخبراء للتعلم التشاركي وتبادل الخبرات"
  },
  {
    icon: Award,
    title: "شهادات معتمدة",
    description: "احصل على شهادات معتمدة تعزز سيرتك الذاتية وتفتح أمامك آفاق جديدة"
  },
  {
    icon: Clock,
    title: "مرونة في التعلم",
    description: "تعلم وفق جدولك الخاص مع إمكانية الوصول للمحتوى على مدار الساعة"
  },
  {
    icon: Zap,
    title: "تعلم تفاعلي",
    description: "أساليب تعليمية متقدمة تشمل المشاريع العملية والمختبرات الافتراضية"
  },
  {
    icon: Globe,
    title: "وصول عالمي",
    description: "تعلم من أي مكان في العالم مع دعم متعدد اللغات والثقافات"
  }
];

// Certification Levels
const certificationLevels = [
  {
    level: "المستوى الأساسي",
    duration: "1-2 أشهر",
    courses: "3-5 كورسات",
    description: "للمبتدئين الراغبين في دخول مجال جديد",
    color: "bg-green-100 text-green-800"
  },
  {
    level: "المستوى المتوسط",
    duration: "3-4 أشهر",
    courses: "6-8 كورسات",
    description: "لتطوير المهارات الحالية والتخصص أكثر",
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    level: "المستوى المتقدم",
    duration: "5-6 أشهر",
    courses: "8-12 كورس",
    description: "للوصول إلى مستوى الخبراء والقيادة",
    color: "bg-red-100 text-red-800"
  },
  {
    level: "المستوى الاحترافي",
    duration: "6-8 أشهر",
    courses: "12-15 كورس",
    description: "للحصول على شهادة احترافية معتمدة دولياً",
    color: "bg-purple-100 text-purple-800"
  }
];

export default function AcademyPage() {
  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="أكاديمية 3DE للتعليم الرقمي"
        subtitle="🎓 تعلم، تطور، تميز"
        description="اكتشف عالماً من الفرص التعليمية مع مسارات تعلم متكاملة، شهادات معتمدة، ومجتمع تعليمي متفاعل يدعمك في رحلتك نحو التميز المهني"
        primaryAction={{
          label: "استكشف المسارات التعليمية",
          href: "#learning-paths"
        }}
        secondaryAction={{
          label: "تصفح الكورسات",
          href: "/courses"
        }}
        size="lg"
        pattern={true}
      />

      {/* Academy Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-text-primary mb-6">
                منصة تعليمية شاملة للمستقبل
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                أكاديمية 3DE ليست مجرد منصة تعليمية، بل نظام بيئي متكامل للتعلم والتطوير المهني. 
                نقدم مسارات تعليمية مصممة بعناية لتلبية احتياجات السوق الحديث، مع التركيز على 
                المهارات العملية والتطبيق الفعلي للمعرفة.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { number: "300+", label: "كورس متخصص" },
                  { number: "50,000+", label: "طالب نشط" },
                  { number: "95%", label: "معدل إكمال" },
                  { number: "4.8/5", label: "تقييم الطلاب" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-primary-main">{stat.number}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <Button size="lg" className="bg-gradient-primary">
                ابدأ رحلتك التعليمية
                <ArrowRight size={20} className="mr-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQR9frNh-pCp_-2Rgpj50GH6qdbu7PwDBBQ&s"
                  alt="التعلم الرقمي"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section id="learning-paths" className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              مسارات التعلم المتخصصة
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              اختر المسار التعليمي الذي يناسب أهدافك المهنية واحصل على تجربة تعليمية متكاملة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card group cursor-pointer overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${path.color}`}></div>
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${path.color} flex items-center justify-center mr-3`}>
                      <path.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-primary-main transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-sm text-text-secondary">{path.level}</p>
                    </div>
                  </div>

                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-text-secondary">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={14} className="mr-1" />
                      <span>{path.courses} كورس</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      <span>{path.students} طالب</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap size={14} className="mr-1" />
                      <span>شهادة معتمدة</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-text-primary mb-2">المهارات التي ستتعلمها:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {path.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{path.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full group-hover:bg-primary-main group-hover:text-white group-hover:border-primary-main transition-all">
                    استكشف المسار
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Features */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              مميزات أكاديمية 3DE
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              تجربة تعليمية متكاملة تجمع بين أحدث التقنيات والممارسات التعليمية المبتكرة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academyFeatures.map((feature, index) => (
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

      {/* Popular Courses */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              الكورسات الأكثر شعبية
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              اكتشف أكثر الكورسات إقبالاً وتقييماً من قبل طلابنا
            </p>
            <Button size="lg" variant="outline" className="bg-white">
              عرض جميع الكورسات
              <BookOpen size={20} className="mr-2" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <CourseCard {...course} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Levels */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              مستويات الشهادات
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              نظام متدرج للشهادات يناسب جميع المستويات ويساعدك على التطور المهني المستمر
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationLevels.map((cert, index) => (
              <motion.div
                key={cert.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card text-center"
              >
                <div className="card-body">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${cert.color}`}>
                    {cert.level}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {cert.duration}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    {cert.courses}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
              ابدأ رحلتك التعليمية معنا اليوم
            </h2>
            <p className="text-xl mb-8 opacity-90 text-gray-200">
              انضم إلى آلاف الطلاب الذين حققوا أهدافهم المهنية من خلال أكاديمية 3DE
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" variant='primary'>
                <GraduationCap size={20} className="ml-2" />
                اختر مسارك التعليمي
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-primary-main">
                تحدث مع مستشار تعليمي
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 