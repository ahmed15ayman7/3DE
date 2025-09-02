'use client';

import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import ContactForm from '../../components/ContactForm';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Headphones,
  Globe,
  Calendar,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
import { Button } from '@3de/ui';

// Contact Information
const contactInfo = [
  {
    icon: MapPin,
    title: "العنوان",
    details: [
      " وسط البلد",
      "الخانكة 12344",
      "مصر"
    ],
    action: {
      label: "عرض على الخريطة",
      href: "https://maps.google.com"
    }
  },
  {
    icon: Phone,
    title: "الهاتف",
    details: [
      "+01284959694",
      "+966 11 123 4568",
      "للدعم الفني: +966 11 123 4569"
    ],
    action: {
      label: "اتصل بنا",
      href: "tel:+966111234567"
    }
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    details: [
      "info@3de.school",
      "support@3de.school",
      "admissions@3de.school"
    ],
    action: {
      label: "راسلنا",
      href: "mailto:info@3de.school"
    }
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    details: [
      "الأحد - الخميس: 8:00 ص - 6:00 م",
      "الجمعة: 2:00 م - 6:00 م",
      "السبت: مغلق"
    ]
  }
];

// Contact Methods
const contactMethods = [
  {
    icon: MessageCircle,
    title: "الدردشة المباشرة",
    description: "احصل على إجابات فورية من فريق الدعم",
    availability: "متاح على مدار الساعة",
    color: "from-green-500 to-emerald-600",
    action: "ابدأ المحادثة"
  },
  {
    icon: Phone,
    title: "المكالمة الهاتفية",
    description: "تحدث مباشرة مع أحد مستشارينا التعليميين",
    availability: "الأحد - الخميس (8:00 ص - 6:00 م)",
    color: "from-blue-500 to-cyan-600",
    action: "اطلب مكالمة"
  },
  {
    icon: Calendar,
    title: "حجز موعد",
    description: "احجز موعداً شخصياً للاستشارة التعليمية",
    availability: "مواعيد متاحة خلال 24 ساعة",
    color: "from-purple-500 to-indigo-600",
    action: "احجز موعد"
  },
  {
    icon: Headphones,
    title: "الدعم الفني",
    description: "حل المشاكل التقنية مع فريق الدعم المتخصص",
    availability: "استجابة خلال ساعة واحدة",
    color: "from-orange-500 to-red-600",
    action: "اطلب الدعم"
  }
];

// Social Media Links
const socialLinks = [
  { platform: "Facebook", icon: Facebook, href: "https://facebook.com/3de", color: "hover:text-primary-main" },
  { platform: "Twitter", icon: Twitter, href: "https://twitter.com/3de", color: "hover:text-blue-400" },
  { platform: "Instagram", icon: Instagram, href: "https://instagram.com/3de", color: "hover:text-pink-600" },
  { platform: "YouTube", icon: Youtube, href: "https://youtube.com/3de", color: "hover:text-red-600" },
  { platform: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/3de", color: "hover:text-blue-700" }
];

// FAQ Data
const faqData = [
  {
    question: "كيف يمكنني التسجيل في الكورسات؟",
    answer: "يمكنك التسجيل بسهولة من خلال إنشاء حساب جديد على المنصة، ثم اختيار الكورس المناسب والضغط على زر التسجيل."
  },
  {
    question: "هل يمكنني الحصول على شهادة معتمدة؟",
    answer: "نعم، نقدم شهادات معتمدة لجميع الكورسات بعد إكمال المتطلبات بنجاح وتحقيق درجة النجاح المطلوبة."
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نقبل جميع البطاقات الائتمانية، التحويل البنكي، ومحافظ الدفع الإلكترونية مثل STC Pay و Apple Pay."
  },
  {
    question: "هل يوجد دعم فني باللغة العربية؟",
    answer: "نعم، فريق الدعم الفني متاح باللغة العربية والإنجليزية على مدار الساعة لمساعدتك في أي استفسار."
  }
];

export default function ContactUsPage() {
  const handleContactFormSubmit = async (data: any) => {
    // Handle contact form submission
    console.log('Contact form submitted:', data);
  };

  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="تواصل معنا"
        subtitle="📞 نحن هنا لمساعدتك"
        description="فريقنا جاهز للإجابة على جميع استفساراتك ومساعدتك في رحلتك التعليمية. تواصل معنا بالطريقة التي تناسبك"
        size="md"
        pattern={true}
      />

      {/* Contact Methods */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              طرق التواصل السريعة
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              اختر الطريقة الأنسب للتواصل معنا وستحصل على الرد في أقرب وقت ممكن
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card text-center group cursor-pointer overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${method.color}`}></div>
                <div className="card-body">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <method.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {method.title}
                  </h3>
                  <p className="text-text-secondary mb-3 leading-relaxed">
                    {method.description}
                  </p>
                  <p className="text-sm text-primary-main font-medium mb-4">
                    {method.availability}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary-main group-hover:text-white group-hover:border-primary-main transition-all"
                    size="sm"
                  >
                    {method.action}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              معلومات التواصل
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              جميع المعلومات التي تحتاجها للوصول إلينا أو التواصل معنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card text-center"
              >
                <div className="card-body">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-xl flex items-center justify-center">
                    <info.icon size={28} className="text-primary-main" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    {info.title}
                  </h3>
                  <div className="space-y-2 mb-6">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-text-secondary">
                        {detail}
                      </p>
                    ))}
                  </div>
                  {info.action && (
                    <a
                      href={info.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-main hover:text-primary-dark font-medium transition-colors"
                    >
                      {info.action.label}
                      <ArrowRight size={16} className="mr-1" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section bg-white">
        <div className="container">
          <ContactForm 
            onSubmit={handleContactFormSubmit}
            className="mb-16"
          />
        </div>
      </section>

      {/* Map and Social Media */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-text-primary mb-6">
                موقعنا على الخريطة
              </h3>
              <div className="rounded-xl overflow-hidden shadow-soft">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9499!2d46.6863!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDEnMTAuNyJF!5e0!3m2!1sen!2ssa!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع أكاديمية 3DE"
                />
              </div>
            </motion.div>

            {/* Social Media & FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Social Media */}
              <div>
                <h3 className="text-3xl font-bold text-text-primary mb-6">
                  تابعنا على
                </h3>
                <div className="flex items-center gap-4 gap-reverse mb-6">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.platform}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-white rounded-xl shadow-soft flex items-center justify-center text-gray-600 ${social.color} transition-all duration-200 hover:scale-110 hover:shadow-soft-lg`}
                        aria-label={social.platform}
                      >
                        <Icon size={24} />
                      </a>
                    );
                  })}
                </div>
                <p className="text-text-secondary mb-6">
                  ابق على اطلاع دائم بآخر الأخبار، الكورسات الجديدة، والنصائح التعليمية
                </p>
              </div>

              {/* Quick FAQ */}
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-6">
                  الأسئلة الشائعة
                </h3>
                <div className="space-y-4">
                  {faqData.slice(0, 3).map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="bg-white rounded-lg p-4 shadow-soft"
                    >
                      <h4 className="font-medium text-text-primary mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    عرض جميع الأسئلة الشائعة
                    <ArrowRight size={16} className="mr-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
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
              جاهز للبدء؟
            </h2>
            <p className="text-xl mb-8 opacity-90 text-gray-200">
              لا تتردد في التواصل معنا. نحن هنا لمساعدتك في تحقيق أهدافك التعليمية
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:gap-6 sm:gap-reverse">
              <Button size="lg" variant='primary' >
                <MessageCircle size={20} className="ml-2" />
                ابدأ المحادثة الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-primary-main">
                حجز استشارة مجانية
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 