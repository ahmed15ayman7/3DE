'use client';

import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import { 
  FileText, 
  Shield, 
  Scale, 
  CheckCircle,
  AlertTriangle,
  User,
  CreditCard,
  Lock,
  RefreshCw,
  Globe,
  Calendar
} from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "15 يناير 2024";

  return (
    <Layout showBreadcrumb={true}>
      {/* Hero Section */}
      <Hero
        title="الشروط والأحكام"
        subtitle="📋 اتفاقية الاستخدام"
        description="يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدمات أكاديمية 3DE. باستخدامك لمنصتنا، فإنك توافق على الالتزام بهذه الشروط"
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

          {/* Terms Content */}
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
                <h2 className="text-3xl font-bold text-text-primary">1. تعريفات ومصطلحات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  في هذه الاتفاقية، تحمل الكلمات والعبارات التالية المعاني المحددة أدناه ما لم يقتض السياق خلاف ذلك:
                </p>
                
                <ul className="space-y-2 mr-6">
                  <li><strong>"الأكاديمية" أو "المنصة":</strong> تعني أكاديمية 3DE للتعليم الرقمي وجميع خدماتها</li>
                  <li><strong>"المستخدم" أو "أنت":</strong> تعني أي شخص يستخدم خدمات الأكاديمية</li>
                  <li><strong>"المحتوى":</strong> يشمل جميع المواد التعليمية والكورسات والفيديوهات والنصوص</li>
                  <li><strong>"الحساب":</strong> الحساب الشخصي المسجل على المنصة</li>
                  <li><strong>"الخدمات":</strong> جميع الخدمات التعليمية المقدمة من خلال المنصة</li>
                </ul>
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
                <User className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">2. قبول الشروط والأحكام</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  باستخدامك لخدمات أكاديمية 3DE، فإنك تؤكد وتوافق على:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "قراءة وفهم جميع الشروط والأحكام",
                    "الالتزام بجميع القوانين المحلية والدولية",
                    "استخدام المنصة للأغراض التعليمية فقط",
                    "عدم انتهاك حقوق الملكية الفكرية",
                    "تقديم معلومات صحيحة ودقيقة",
                    "الحفاظ على سرية بيانات الحساب"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mt-1 ml-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
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
                <Lock className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">3. التسجيل وإدارة الحساب</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <h3 className="text-xl font-semibold text-text-primary">3.1 إنشاء الحساب</h3>
                <p>
                  لاستخدام خدماتنا، يجب عليك إنشاء حساب شخصي. عند التسجيل، يجب عليك:
                </p>
                <ul className="space-y-2 mr-6">
                  <li>تقديم معلومات صحيحة ومحدثة</li>
                  <li>اختيار كلمة مرور قوية وآمنة</li>
                  <li>التحقق من عنوان البريد الإلكتروني</li>
                  <li>قبول هذه الشروط والأحكام</li>
                </ul>

                <h3 className="text-xl font-semibold text-text-primary">3.2 أمان الحساب</h3>
                <p>
                  أنت مسؤول عن الحفاظ على سرية معلومات حسابك. في حالة اشتباهك في حدوث أي 
                  نشاط غير مصرح به، يجب عليك إخطارنا فوراً.
                </p>

                <h3 className="text-xl font-semibold text-text-primary">3.3 إيقاف الحساب</h3>
                <p>
                  نحتفظ بالحق في إيقاف أو إغلاق حسابك في حالة انتهاك هذه الشروط أو 
                  استخدام المنصة بطريقة غير مناسبة.
                </p>
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
                <CreditCard className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">4. الرسوم والمدفوعات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <h3 className="text-xl font-semibold text-text-primary">4.1 هيكل الرسوم</h3>
                <p>
                  تختلف رسوم الكورسات حسب نوع المحتوى ومدة الكورس. جميع الأسعار معروضة 
                  بالريال السعودي وتشمل ضريبة القيمة المضافة حيث ينطبق ذلك.
                </p>

                <h3 className="text-xl font-semibold text-text-primary">4.2 طرق الدفع</h3>
                <p>نقبل الدفع من خلال:</p>
                <ul className="space-y-2 mr-6">
                  <li>بطاقات الائتمان والخصم المباشر</li>
                  <li>محافظ إلكترونية (Apple Pay, مدى، STC Pay)</li>
                  <li>التحويل البنكي</li>
                  <li>فواتير الشركات للمؤسسات</li>
                </ul>

                <h3 className="text-xl font-semibold text-text-primary">4.3 سياسة الاسترداد</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-yellow-600 mt-1 ml-2" />
                    <div>
                      <p className="font-medium text-yellow-800">سياسة الاسترداد:</p>
                      <ul className="mt-2 space-y-1 text-yellow-700 text-sm">
                        <li>• يمكن طلب الاسترداد خلال 7 أيام من الشراء</li>
                        <li>• الاسترداد متاح فقط إذا لم يتم الوصول لأكثر من 20% من المحتوى</li>
                        <li>• معالجة طلبات الاسترداد تستغرق 5-10 أيام عمل</li>
                        <li>• بعض الكورسات المخفضة قد تكون غير قابلة للاسترداد</li>
                      </ul>
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
                <Shield className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">5. حقوق الملكية الفكرية</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <h3 className="text-xl font-semibold text-text-primary">5.1 ملكية المحتوى</h3>
                <p>
                  جميع المواد التعليمية والمحتوى المتاح على المنصة محمي بحقوق الطبع والنشر 
                  وهو ملكية حصرية لأكاديمية 3DE أو شركائها المرخصين.
                </p>

                <h3 className="text-xl font-semibold text-text-primary">5.2 الاستخدام المسموح</h3>
                <p>يُسمح لك بـ:</p>
                <ul className="space-y-2 mr-6">
                  <li>مشاهدة المحتوى للاستخدام الشخصي التعليمي</li>
                  <li>تنزيل المواد المخصصة للتنزيل لاستخدامك الشخصي</li>
                  <li>طباعة أجزاء من المحتوى للمراجعة الشخصية</li>
                </ul>

                <h3 className="text-xl font-semibold text-text-primary">5.3 الاستخدام المحظور</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-800 mb-2">يُحظر صراحة:</p>
                  <ul className="space-y-1 text-red-700 text-sm">
                    <li>• نسخ أو توزيع المحتوى دون إذن مكتوب</li>
                    <li>• بيع أو تأجير أو ترخيص المحتوى لأطراف ثالثة</li>
                    <li>• تسجيل أو بث المحتوى بأي وسيلة</li>
                    <li>• استخدام المحتوى لأغراض تجارية</li>
                    <li>• تعديل أو تحرير المحتوى الأصلي</li>
                  </ul>
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
                <Scale className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">6. المسؤوليات والالتزامات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <h3 className="text-xl font-semibold text-text-primary">6.1 التزامات المستخدم</h3>
                <p>يلتزم المستخدم بـ:</p>
                <ul className="space-y-2 mr-6">
                  <li>استخدام المنصة وفقاً للشروط المحددة</li>
                  <li>عدم تعطيل أو إضرار أمان المنصة</li>
                  <li>احترام حقوق المستخدمين الآخرين</li>
                  <li>عدم نشر محتوى مسيء أو غير قانوني</li>
                  <li>الحفاظ على سرية معلومات الدخول</li>
                </ul>

                <h3 className="text-xl font-semibold text-text-primary">6.2 مسؤوليات الأكاديمية</h3>
                <p>تلتزم الأكاديمية بـ:</p>
                <ul className="space-y-2 mr-6">
                  <li>توفير محتوى تعليمي عالي الجودة</li>
                  <li>الحفاظ على خصوصية وأمان بيانات المستخدمين</li>
                  <li>توفير دعم تقني مناسب</li>
                  <li>تحديث المحتوى والمنصة بانتظام</li>
                </ul>

                <h3 className="text-xl font-semibold text-text-primary">6.3 إخلاء المسؤولية</h3>
                <p>
                  الأكاديمية غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن 
                  استخدام المنصة، بما في ذلك فقدان البيانات أو انقطاع الخدمة.
                </p>
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
                <RefreshCw className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">7. تعديل الشروط والأحكام</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعار المستخدمين 
                  بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.
                </p>
                
                <p>
                  استمرارك في استخدام المنصة بعد نشر التعديلات يُعتبر موافقة منك على 
                  الشروط المحدثة.
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
                <Globe className="text-primary-main ml-3" size={28} />
                <h2 className="text-3xl font-bold text-text-primary">8. القانون المطبق وحل النزاعات</h2>
              </div>
              
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <h3 className="text-xl font-semibold text-text-primary">8.1 القانون المطبق</h3>
                <p>
                  تخضع هذه الشروط والأحكام لقوانين مصر، ويتم تفسيرها 
                  وفقاً لها.
                </p>

                <h3 className="text-xl font-semibold text-text-primary">8.2 حل النزاعات</h3>
                <p>
                  في حالة نشوء أي نزاع، نشجع على حله ودياً من خلال التواصل المباشر. 
                  إذا لم يتم الوصول لحل، فإن المحاكم السعودية المختصة لها الولاية القضائية.
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
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-primary-dark mb-4">معلومات التواصل</h3>
                <p className="text-primary-dark mb-4">
                  إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يمكنك التواصل معنا:
                </p>
                <div className="space-y-2 text-primary-dark">
                  <p><strong>البريد الإلكتروني:</strong> legal@3de.school</p>
                  <p><strong>الهاتف:</strong> +01284959694</p>
                  <p><strong>العنوان:</strong> الخانكة، مصر</p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </section>
    </Layout>
  );
} 