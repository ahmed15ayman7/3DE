'use client';

import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import InstructorCard from '../../components/InstructorCard';
import { 
  Target, 
  Eye, 
  Award, 
  Users,
  BookOpen,
  Globe,
  Heart,
  Star,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@3de/ui';

// Team Members Data
const teamMembers = [
  {
    id: "1",
    name: "د. عبدالله الأحمد",
    title: "المؤسس والرئيس التنفيذي",
    bio: "رائد في مجال التعليم الرقمي مع خبرة تزيد عن 20 عاماً في التقنية والتعليم",
    avatar: "/images/team/ceo.jpg",
    specializations: ["القيادة", "التعليم الرقمي", "الابتكار"],
    rating: 4.9,
    totalStudents: 5000,
    totalCourses: 25,
    experience: "20 سنة",
    location: "الرياض",
    isVerified: true,
    languages: ["العربية", "الإنجليزية"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/abdullah",
      twitter: "https://twitter.com/abdullah"
    }
  },
  {
    id: "2",
    name: "د. فاطمة العتيبي",
    title: "مديرة العمليات الأكاديمية",
    bio: "خبيرة في تطوير المناهج والبرامج التعليمية مع تخصص في التقييم والجودة",
    avatar: "/images/team/academic-director.jpg",
    specializations: ["تطوير المناهج", "جودة التعليم", "التقييم"],
    rating: 4.8,
    totalStudents: 3500,
    totalCourses: 18,
    experience: "15 سنة",
    location: "الرياض",
    isVerified: true,
    languages: ["العربية", "الإنجليزية"]
  },
  {
    id: "3",
    name: "م. خالد الشهري",
    title: "مدير التقنية",
    bio: "مهندس برمجيات متخصص في تطوير منصات التعليم الإلكتروني والحلول التقنية",
    avatar: "/images/team/tech-director.jpg",
    specializations: ["هندسة البرمجيات", "المنصات التعليمية", "الذكاء الاصطناعي"],
    rating: 4.9,
    totalStudents: 2800,
    totalCourses: 12,
    experience: "12 سنة",
    location: "الرياض",
    isVerified: true,
    languages: ["العربية", "الإنجليزية"]
  }
];

// Company Values
const values = [
  {
    icon: Target,
    title: "التميز في التعليم",
    description: "نسعى لتقديم أعلى معايير الجودة في التعليم الرقمي مع التركيز على النتائج العملية والمهارات القابلة للتطبيق."
  },
  {
    icon: Heart,
    title: "الشغف بالتطوير",
    description: "نؤمن بأن الشغف هو المحرك الأساسي للتعلم المستمر والتطوير الذاتي في عالم متغير."
  },
  {
    icon: Users,
    title: "المجتمع والتعاون",
    description: "نبني مجتمعاً تعليمياً متفاعلاً يشجع على التعلم التشاركي وتبادل الخبرات والمعرفة."
  },
  {
    icon: Zap,
    title: "الابتكار والتقنية",
    description: "نستخدم أحدث التقنيات والأساليب التعليمية المبتكرة لتوفير تجربة تعليمية متطورة وفعالة."
  },
  {
    icon: Shield,
    title: "المصداقية والثقة",
    description: "نلتزم بأعلى معايير المصداقية والشفافية في جميع تعاملاتنا مع الطلاب والشركاء."
  },
  {
    icon: Globe,
    title: "الوصول العالمي",
    description: "نهدف لجعل التعليم الجيد متاحاً للجميع بغض النظر عن الموقع الجغرافي أو الظروف الاجتماعية."
  }
];

// Statistics
const statistics = [
  { number: "2018", label: "سنة التأسيس", icon: Award },
  { number: "50,000+", label: "طالب مسجل", icon: Users },
  { number: "300+", label: "كورس متاح", icon: BookOpen },
  { number: "95%", label: "معدل إتمام الكورسات", icon: TrendingUp },
  { number: "4.8/5", label: "تقييم الطلاب", icon: Star },
  { number: "25+", label: "دولة عربية", icon: Globe }
];

export default function AboutUsPage() {
  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="من نحن"
        subtitle="✨ قصة نجاح في التعليم الرقمي"
        description="نحن أكاديمية 3DE، رواد التعليم الرقمي في المنطقة العربية. نؤمن بقوة التعليم في تحويل الأحلام إلى واقع ونسعى لتمكين كل متعلم من تحقيق إمكاناته الكاملة"
        size="lg"
        pattern={true}
      />

      {/* Mission & Vision Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Target className="text-primary-main ml-3" size={28} />
                  <h2 className="text-3xl font-bold text-text-primary">رسالتنا</h2>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed">
                  تمكين الأفراد في المنطقة العربية من خلال توفير تعليم رقمي عالي الجودة 
                  يجمع بين أحدث التقنيات والمحتوى المتخصص، مما يساهم في بناء مجتمع 
                  معرفي قادر على مواكبة التطورات العالمية والمساهمة في النهضة الرقمية.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Eye className="text-primary-main ml-3" size={28} />
                  <h2 className="text-3xl font-bold text-text-primary">رؤيتنا</h2>
                </div>
                <p className="text-lg text-text-secondary leading-relaxed">
                  أن نصبح المنصة التعليمية الرائدة في العالم العربي، ونكون الخيار الأول 
                  للمتعلمين الساعين لتطوير مهاراتهم التقنية والمهنية، مع التركيز على 
                  الابتكار والجودة والتأثير الإيجابي في المجتمع.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">أهدافنا الاستراتيجية</h3>
                <ul className="space-y-4">
                  {[
                    "تطوير محتوى تعليمي متميز يواكب احتياجات السوق",
                    "بناء شراكات استراتيجية مع الجامعات والشركات الرائدة",
                    "تطبيق أحدث تقنيات التعليم التفاعلي والذكاء الاصطناعي",
                    "توسيع الوصول لتشمل جميع أنحاء العالم العربي",
                    "تحقيق معدلات إنجاز عالية وضمان جودة التعليم"
                  ].map((goal, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <CheckCircle size={20} className="text-white mt-1 ml-3 flex-shrink-0" />
                      <span>{goal}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              قيمنا ومبادئنا
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              نؤمن بمجموعة من القيم الأساسية التي توجه عملنا وتشكل ثقافتنا المؤسسية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card text-center group"
              >
                <div className="card-body">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <value.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              إنجازاتنا بالأرقام
            </h2>
            <p className="text-xl opacity-90">
              مسيرة حافلة بالنجاحات والإنجازات المتواصلة
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              قصتنا
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              رحلة بدأت بحلم وتطورت لتصبح واقعاً يغير حياة الآلاف
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                {
                  year: "2018",
                  title: "البداية والحلم",
                  description: "تأسست أكاديمية 3DE على يد مجموعة من الخبراء في التقنية والتعليم، بهدف سد الفجوة بين التعليم التقليدي ومتطلبات السوق الحديث."
                },
                {
                  year: "2019",
                  title: "النمو والتوسع",
                  description: "إطلاق أول منصة تعليمية متكاملة مع أكثر من 50 كورس متخصص وانضمام أكثر من 5000 طالب في السنة الأولى."
                },
                {
                  year: "2020",
                  title: "التطوير والابتكار",
                  description: "تطوير تقنيات التعلم التفاعلي وإضافة المختبرات الافتراضية، مما ساهم في تحسين تجربة التعلم بشكل كبير."
                },
                {
                  year: "2021",
                  title: "الشراكات والتوسع",
                  description: "توقيع شراكات استراتيجية مع جامعات وشركات رائدة، وتوسيع الخدمات لتشمل التدريب المؤسسي والاستشارات."
                },
                {
                  year: "2022",
                  title: "التقنيات المتقدمة",
                  description: "تطبيق تقنيات الذكاء الاصطناعي في التعلم الشخصي والتقييم التكيفي، مما رفع معدلات النجاح إلى 95%."
                },
                {
                  year: "2023",
                  title: "الريادة والمستقبل",
                  description: "أصبحت الأكاديمية المنصة التعليمية الأولى في المنطقة مع أكثر من 50,000 طالب و300 كورس متخصص."
                }
              ].map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className="flex-1">
                    <div className={`${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="inline-block px-4 py-2 bg-primary-100 text-primary-dark rounded-full text-sm font-bold mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-bold text-text-primary mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              فريق القيادة
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              تعرف على الفريق الذي يقود رؤية الأكاديمية ويعمل على تحقيق أهدافها الطموحة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <InstructorCard {...member} variant="featured" />
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              كن جزءاً من رحلتنا
            </h2>
            <p className="text-xl mb-8 opacity-90">
              انضم إلى مجتمعنا التعليمي وساهم في بناء مستقبل أفضل من خلال التعلم والتطوير المستمر
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" className="bg-white text-secondary-main hover:bg-gray-100">
                ابدأ التعلم الآن
                <ArrowRight size={20} className="mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary-main">
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 