'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Video,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  ThumbsUp,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Button } from '@3de/ui';

// Support Categories
const supportCategories = [
  {
    id: 'account',
    title: 'إدارة الحساب',
    description: 'مساعدة في إنشاء وإدارة حسابك',
    icon: HelpCircle,
    color: 'from-blue-500 to-cyan-600',
    articlesCount: 15
  },
  {
    id: 'courses',
    title: 'الكورسات والتعلم',
    description: 'كل ما يتعلق بالكورسات والدروس',
    icon: Book,
    color: 'from-green-500 to-emerald-600',
    articlesCount: 28
  },
  {
    id: 'technical',
    title: 'المشاكل التقنية',
    description: 'حل المشاكل التقنية والأخطاء',
    icon: AlertCircle,
    color: 'from-red-500 to-orange-600',
    articlesCount: 12
  },
  {
    id: 'payment',
    title: 'الدفع والفواتير',
    description: 'أسئلة حول الدفع والاشتراكات',
    icon: CheckCircle,
    color: 'from-purple-500 to-indigo-600',
    articlesCount: 10
  },
  {
    id: 'certificates',
    title: 'الشهادات',
    description: 'الحصول على الشهادات وطباعتها',
    icon: FileText,
    color: 'from-yellow-500 to-orange-500',
    articlesCount: 8
  },
  {
    id: 'mobile',
    title: 'التطبيق المحمول',
    description: 'مساعدة في استخدام التطبيق',
    icon: MessageCircle,
    color: 'from-pink-500 to-rose-600',
    articlesCount: 6
  }
];

// Popular Articles
const popularArticles = [
  {
    id: 1,
    title: 'كيفية إنشاء حساب جديد في المنصة',
    category: 'إدارة الحساب',
    views: 15420,
    rating: 4.8,
    type: 'article',
    readTime: '3 دقائق'
  },
  {
    id: 2,
    title: 'طرق الدفع المتاحة والمقبولة',
    category: 'الدفع والفواتير',
    views: 12350,
    rating: 4.9,
    type: 'article',
    readTime: '5 دقائق'
  },
  {
    id: 3,
    title: 'كيفية تحميل الشهادة بعد إكمال الكورس',
    category: 'الشهادات',
    views: 9870,
    rating: 4.7,
    type: 'video',
    readTime: '2 دقائق'
  },
  {
    id: 4,
    title: 'حل مشكلة عدم ظهور الفيديو',
    category: 'المشاكل التقنية',
    views: 8540,
    rating: 4.6,
    type: 'article',
    readTime: '4 دقائق'
  },
  {
    id: 5,
    title: 'كيفية استرداد كلمة المرور المنسية',
    category: 'إدارة الحساب',
    views: 7220,
    rating: 4.8,
    type: 'article',
    readTime: '2 دقائق'
  }
];

// Contact Methods
const contactMethods = [
  {
    type: 'chat',
    title: 'الدردشة المباشرة',
    description: 'احصل على مساعدة فورية من فريق الدعم',
    icon: MessageCircle,
    availability: 'متاح 24/7',
    responseTime: 'خلال دقائق',
    color: 'bg-green-500'
  },
  {
    type: 'email',
    title: 'البريد الإلكتروني',
    description: 'أرسل استفسارك المفصل عبر البريد',
    icon: Mail,
    availability: 'support@3de.sa',
    responseTime: 'خلال 4 ساعات',
    color: 'bg-blue-500'
  },
  {
    type: 'phone',
    title: 'الهاتف',
    description: 'تحدث مباشرة مع مختص الدعم',
    icon: Phone,
    availability: 'الأحد - الخميس (9 ص - 6 م)',
    responseTime: 'فوري',
    color: 'bg-purple-500'
  }
];

// FAQ Data
const faqData = [
  {
    category: 'عام',
    questions: [
      {
        question: 'كيف يمكنني التسجيل في الكورسات؟',
        answer: 'يمكنك التسجيل بسهولة من خلال إنشاء حساب جديد على المنصة، ثم اختيار الكورس المناسب والضغط على زر التسجيل. ستحتاج إلى إكمال عملية الدفع لتأكيد التسجيل.'
      },
      {
        question: 'هل يمكنني الوصول للكورسات مدى الحياة؟',
        answer: 'نعم، بمجرد شراء الكورس تحصل على وصول مدى الحياة للمحتوى، بما في ذلك التحديثات المستقبلية.'
      }
    ]
  },
  {
    category: 'الدفع',
    questions: [
      {
        question: 'ما هي طرق الدفع المتاحة؟',
        answer: 'نقبل جميع البطاقات الائتمانية (فيزا، ماستركارد)، STC Pay، Apple Pay، والتحويل البنكي.'
      },
      {
        question: 'هل يمكنني استرداد الأموال؟',
        answer: 'نعم، نوفر ضمان استرداد الأموال خلال 14 يوم من تاريخ الشراء في حالة عدم الرضا.'
      }
    ]
  },
  {
    category: 'التقني',
    questions: [
      {
        question: 'لا أستطيع تشغيل الفيديوهات، ما الحل؟',
        answer: 'تأكد من سرعة الإنترنت، جرب متصفح آخر، أو امسح الكاش. إذا استمرت المشكلة، تواصل معنا.'
      },
      {
        question: 'كيف أحمل التطبيق على الهاتف؟',
        answer: 'يمكنك تحميل التطبيق من App Store أو Google Play بالبحث عن "أكاديمية 3DE".'
      }
    ]
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredArticles = popularArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="مركز المساعدة والدعم"
        subtitle="🆘 نحن هنا لمساعدتك"
        description="احصل على الدعم الذي تحتاجه لتحقيق أقصى استفادة من تجربتك التعليمية في أكاديمية 3DE"
        size="md"
        pattern={true}
      />

      {/* Search Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              كيف يمكننا مساعدتك؟
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              ابحث في قاعدة المعرفة أو تصفح الفئات للعثور على إجابات سريعة
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن المساعدة، مثل: كيفية التسجيل، مشاكل الدفع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-main focus:border-transparent text-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              تصفح حسب الفئة
            </h2>
            <p className="text-xl text-text-secondary">
              اختر الفئة المناسبة للعثور على الإجابات بسرعة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card group cursor-pointer overflow-hidden"
                onClick={() => setSelectedCategory(category.title)}
              >
                <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
                <div className="card-body">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <category.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2 text-center">
                    {category.title}
                  </h3>
                  <p className="text-text-secondary text-center mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-main font-medium">
                      {category.articlesCount} مقال
                    </span>
                    <ChevronRight size={16} className="text-primary-main group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              المقالات الأكثر شعبية
            </h2>
            <p className="text-xl text-text-secondary">
              الأسئلة والمواضيع الأكثر بحثاً من قبل المستخدمين
            </p>
          </motion.div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="card hover:shadow-soft-lg transition-all duration-200 cursor-pointer"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {article.type === 'video' ? (
                          <Video size={16} className="text-red-500 ml-2" />
                        ) : (
                          <FileText size={16} className="text-blue-500 ml-2" />
                        )}
                        <span className="text-sm text-primary-main font-medium">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2 hover:text-primary-main transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 gap-reverse text-sm text-text-secondary">
                        <span>{article.views.toLocaleString()} مشاهدة</span>
                        <span className="flex items-center">
                          <Star size={12} className="text-yellow-500 ml-1" />
                          {article.rating}
                        </span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              عرض جميع المقالات
              <ArrowRight size={16} className="mr-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              تحتاج مساعدة شخصية؟
            </h2>
            <p className="text-xl text-text-secondary">
              فريق الدعم جاهز لمساعدتك بعدة طرق مختلفة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="card text-center"
              >
                <div className="card-body">
                  <div className={`w-16 h-16 mx-auto mb-6 ${method.color} rounded-xl flex items-center justify-center`}>
                    <method.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {method.title}
                  </h3>
                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {method.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-medium text-text-primary">
                      {method.availability}
                    </p>
                    <p className="text-sm text-primary-main">
                      وقت الاستجابة: {method.responseTime}
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    <method.icon size={16} className="ml-2" />
                    بدء التواصل
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-xl text-text-secondary">
              إجابات سريعة للأسئلة الأكثر شيوعاً
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const faqId = `${category.category}-${questionIndex}`;
                    const isExpanded = expandedFaq === faqId;
                    
                    return (
                      <motion.div
                        key={faqId}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: questionIndex * 0.05 }}
                        className="card"
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                          className="w-full p-6 text-right focus:outline-none"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-text-primary">
                              {faq.question}
                            </h4>
                            <ChevronRight
                              size={20}
                              className={`text-primary-main transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </button>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-6"
                          >
                            <p className="text-text-secondary leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
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
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-xl mb-8 opacity-90 text-gray-200">
              فريق الدعم متاح على مدار الساعة لمساعدتك في أي استفسار أو مشكلة تواجهها
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" variant='primary'>
                <MessageCircle size={20} className="ml-2" />
                تحدث مع الدعم
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-primary-main">
                أرسل طلب دعم
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 