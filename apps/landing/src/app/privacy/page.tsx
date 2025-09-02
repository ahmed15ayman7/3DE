'use client';

import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database,
  UserCheck,
  Cookie,
  Share2,
  AlertTriangle,
  CheckCircle,
  Settings,
  Mail,
  Calendar,
  FileText
} from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = "15 يناير 2024";

  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="سياسة الخصوصية"
        subtitle="🔒 حماية بياناتك أولويتنا"
        description="نحن في أكاديمية 3DE نلتزم بحماية خصوصيتك وأمان بياناتك الشخصية. تعرف على كيفية جمع واستخدام وحماية معلوماتك"
        size="md"
        pattern={true}
      />

      <section className="section bg-white">
        <div className="container max-w-4xl">
          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-4 mb-8 flex items-center"
          >
            <Calendar size={20} className="text-primary-main ml-3" />
            <span className="text-text-secondary">
              آخر تحديث: {lastUpdated}
            </span>
          </motion.div>

          {/* Privacy Content */}
          <div className="prose prose-lg max-w-none">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <FileText className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">1. مقدمة</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  تصف سياسة الخصوصية هذه كيفية جمع أكاديمية 3DE ("نحن"، "لنا"، أو "الأكاديمية") 
                  واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام موقعنا الإلكتروني 
                  ومنصتنا التعليمية.
                </p>
                
                <p>
                  نحن ملتزمون بحماية خصوصيتك ونضمن أن معلوماتك الشخصية آمنة ومحمية وفقاً لأعلى 
                  المعايير الدولية وقوانين حماية البيانات المعمول بها في مصر.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield size={20} className="text-primary-main mt-1 ml-2" />
                    <div>
                      <p className="font-medium text-blue-800">التزامنا بالخصوصية:</p>
                      <p className="mt-2 text-blue-700 text-sm">
                        نطبق أعلى معايير الأمان والحماية لضمان سرية بياناتك وعدم مشاركتها 
                        مع أطراف ثالثة إلا بموافقتك الصريحة أو وفقاً للقانون.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Database className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">2. المعلومات التي نجمعها</h2>
              </div>
              
              <div className="space-y-6 text-text-secondary leading-relaxed">
                <h3 className="text-xl font-semibold text-text-primary">2.1 المعلومات الشخصية</h3>
                <p>قد نجمع المعلومات التالية عندما تتفاعل مع منصتنا:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "الاسم الكامل",
                    "عنوان البريد الإلكتروني",
                    "رقم الهاتف",
                    "تاريخ الميلاد",
                    "الجنس",
                    "البلد والمدينة",
                    "المؤهل التعليمي",
                    "التخصص المهني",
                    "معلومات الدفع (مشفرة)",
                    "تفضيلات التعلم"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-text-primary">2.2 المعلومات التقنية</h3>
                <p>نجمع تلقائياً معلومات حول كيفية استخدامك للمنصة، مثل:</p>
                <ul className="space-y-2 mr-6">
                  <li>عنوان IP ونوع المتصفح</li>
                  <li>نظام التشغيل والجهاز المستخدم</li>
                  <li>الصفحات التي تزورها ووقت الزيارة</li>
                  <li>تقدمك في الكورسات والدروس</li>
                  <li>نتائج الاختبارات والتقييمات</li>
                </ul>

                <h3 className="text-xl font-semibold text-text-primary">2.3 ملفات تعريف الارتباط (Cookies)</h3>
                <p>
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتخصيص المحتوى. يمكنك إدارة 
                  إعدادات ملفات تعريف الارتباط من خلال متصفحك.
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Settings className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">3. كيف نستخدم معلوماتك</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">تقديم الخدمات التعليمية</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• إنشاء وإدارة حسابك الشخصي</li>
                      <li>• تقديم المحتوى التعليمي المطلوب</li>
                      <li>• تتبع تقدمك ونتائجك</li>
                      <li>• إصدار الشهادات والإنجازات</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">التحسين والتطوير</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• تحليل استخدام المنصة لتحسين الخدمات</li>
                      <li>• تطوير ميزات جديدة</li>
                      <li>• تخصيص المحتوى حسب اهتماماتك</li>
                      <li>• إجراء بحوث تعليمية مجهولة الهوية</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">التواصل والدعم</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• إرسال إشعارات مهمة حول حسابك</li>
                      <li>• تقديم الدعم التقني والأكاديمي</li>
                      <li>• إرسال تحديثات حول الكورسات الجديدة</li>
                      <li>• الرد على استفساراتك وطلباتك</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Share2 className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">4. مشاركة المعلومات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  نحن لا نبيع أو نؤجر أو نتاجر بمعلوماتك الشخصية. قد نشارك معلوماتك في 
                  الحالات المحدودة التالية:
                </p>

                <div className="space-y-4">
                  <div className="border-r-4 border-green-500 pr-4">
                    <h4 className="font-semibold text-text-primary">مقدمو الخدمات الموثوقون</h4>
                    <p className="text-sm">
                      نشارك البيانات مع شركاء موثوقين يساعدوننا في تقديم الخدمات مثل معالجة 
                      المدفوعات والاستضافة، وذلك بموجب اتفاقيات سرية صارمة.
                    </p>
                  </div>

                  <div className="border-r-4 border-blue-500 pr-4">
                    <h4 className="font-semibold text-text-primary">المتطلبات القانونية</h4>
                    <p className="text-sm">
                      قد نكشف عن المعلومات إذا كان ذلك مطلوباً بموجب القانون أو لحماية 
                      حقوقنا أو حقوق الآخرين.
                    </p>
                  </div>

                  <div className="border-r-4 border-purple-500 pr-4">
                    <h4 className="font-semibold text-text-primary">بموافقتك</h4>
                    <p className="text-sm">
                      قد نشارك معلوماتك مع أطراف ثالثة أخرى فقط بموافقتك الصريحة والمسبقة.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-red-600 mt-1 ml-2" />
                    <div>
                      <p className="font-medium text-red-800">تأكيد مهم:</p>
                      <p className="mt-2 text-red-700 text-sm">
                        نحن لا نشارك معلوماتك الشخصية لأغراض تسويقية مع أطراف ثالثة 
                        دون موافقتك الصريحة.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Lock className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">5. أمان المعلومات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  نطبق إجراءات أمنية متقدمة لحماية معلوماتك من الوصول غير المصرح به أو 
                  التلاعب أو الإفشاء أو التدمير:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-text-primary">التشفير والحماية</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>تشفير SSL/TLS لجميع البيانات المنقولة</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>تشفير قواعد البيانات</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>جدران حماية متقدمة</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>مراقبة أمنية على مدار الساعة</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-text-primary">ضوابط الوصول</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>التحقق الثنائي للحسابات</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>صلاحيات محدودة للموظفين</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>تسجيل جميع أنشطة الوصول</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                        <span>نسخ احتياطية آمنة ومشفرة</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">شهادات الأمان</h4>
                  <p className="text-green-700 text-sm">
                    منصتنا حاصلة على شهادات أمان دولية معتمدة، ونخضع لمراجعات أمنية دورية 
                    من جهات خارجية مستقلة لضمان أعلى مستويات الحماية.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <UserCheck className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">6. حقوقك في البيانات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>وفقاً لقوانين حماية البيانات، لديك الحقوق التالية:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "الحق في الوصول",
                      description: "طلب نسخة من جميع البيانات الشخصية التي نحتفظ بها عنك"
                    },
                    {
                      title: "الحق في التصحيح",
                      description: "طلب تصحيح أي معلومات غير صحيحة أو غير مكتملة"
                    },
                    {
                      title: "الحق في المحو",
                      description: "طلب حذف بياناتك الشخصية في ظروف معينة"
                    },
                    {
                      title: "الحق في تقييد المعالجة",
                      description: "طلب تقييد كيفية استخدام بياناتك"
                    },
                    {
                      title: "الحق في قابلية النقل",
                      description: "الحصول على بياناتك بصيغة قابلة للقراءة آلياً"
                    },
                    {
                      title: "الحق في الاعتراض",
                      description: "الاعتراض على معالجة بياناتك لأغراض معينة"
                    }
                  ].map((right, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-text-primary mb-2">{right.title}</h4>
                      <p className="text-sm text-text-secondary">{right.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">كيفية ممارسة حقوقك</h4>
                  <p className="text-blue-700 text-sm mb-2">
                    لممارسة أي من حقوقك، يمكنك التواصل معنا عبر:
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• البريد الإلكتروني: privacy@3de.sa</li>
                    <li>• نموذج طلب البيانات في حسابك الشخصي</li>
                    <li>• الهاتف: +966 11 123 4567</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Cookie className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">7. ملفات تعريف الارتباط</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  نستخدم أنواعاً مختلفة من ملفات تعريف الارتباط لتحسين تجربتك:
                </p>

                <div className="space-y-4">
                  <div className="border-r-4 border-red-500 pr-4">
                    <h4 className="font-semibold text-text-primary">ملفات تعريف الارتباط الضرورية</h4>
                    <p className="text-sm">
                      ضرورية لعمل الموقع بشكل صحيح ولا يمكن تعطيلها.
                    </p>
                  </div>

                  <div className="border-r-4 border-yellow-500 pr-4">
                    <h4 className="font-semibold text-text-primary">ملفات تعريف الارتباط الوظيفية</h4>
                    <p className="text-sm">
                      تساعد في تخصيص تجربتك وحفظ تفضيلاتك.
                    </p>
                  </div>

                  <div className="border-r-4 border-green-500 pr-4">
                    <h4 className="font-semibold text-text-primary">ملفات تعريف الارتباط التحليلية</h4>
                    <p className="text-sm">
                      تساعدنا في فهم كيفية استخدام الموقع لتحسين الخدمات.
                    </p>
                  </div>

                  <div className="border-r-4 border-blue-500 pr-4">
                    <h4 className="font-semibold text-text-primary">ملفات تعريف الارتباط التسويقية</h4>
                    <p className="text-sm">
                      تُستخدم لعرض إعلانات مخصصة (تتطلب موافقتك).
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  يمكنك إدارة تفضيلات ملفات تعريف الارتباط من خلال إعدادات متصفحك أو 
                  مركز التفضيلات في موقعنا.
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Eye className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">8. الاحتفاظ بالبيانات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  نحتفظ بمعلوماتك الشخصية فقط للمدة اللازمة لتحقيق الأغراض المذكورة في 
                  هذه السياسة أو حسب ما يتطلبه القانون:
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">معلومات الحساب النشط</span>
                    <span className="text-sm text-primary-main">طوال فترة النشاط + 3 سنوات</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">سجلات التعلم والشهادات</span>
                    <span className="text-sm text-primary-main">10 سنوات لأغراض التحقق</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">معلومات الدفع</span>
                    <span className="text-sm text-primary-main">7 سنوات لأغراض المحاسبة</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">بيانات التواصل والدعم</span>
                    <span className="text-sm text-primary-main">3 سنوات بعد آخر تفاعل</span>
                  </div>
                </div>

                <p className="text-sm">
                  بعد انتهاء فترة الاحتفاظ، نحذف البيانات بشكل آمن أو نجعلها مجهولة الهوية 
                  بحيث لا يمكن ربطها بك شخصياً.
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <Mail className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">9. التواصل معنا</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية هذه أو ممارساتنا 
                  في التعامل مع البيانات، يمكنك التواصل معنا:
                </p>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-primary-dark mb-4">معلومات التواصل</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary-dark mb-2">مسؤول حماية البيانات</h4>
                      <div className="space-y-2 text-primary-dark">
                        <p><strong>البريد الإلكتروني:</strong> privacy@3de.sa</p>
                        <p><strong>الهاتف:</strong> +966 11 123 4567</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary-dark mb-2">العنوان البريدي</h4>
                      <div className="text-primary-dark">
                        <p>أكاديمية 3DE للتعليم الرقمي</p>
                        <p>قسم حماية البيانات</p>
                        <p>الخانكة، مصر</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary-200">
                    <p className="text-sm text-primary-dark">
                      <strong>وقت الاستجابة:</strong> نلتزم بالرد على جميع استفساراتك خلال 48 ساعة عمل.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-yellow-600 mt-1 ml-2" />
                    <div>
                      <p className="font-medium text-yellow-800">تحديثات السياسة</p>
                      <p className="mt-2 text-yellow-700 text-sm">
                        قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات مهمة 
                        عبر البريد الإلكتروني أو من خلال إشعار واضح على موقعنا.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </section>
    </Layout>
  );
} 