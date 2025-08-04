'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import { Card, Modal, Button, Textarea, Pagination, toast } from '@3de/ui';
import { 
  HelpCircle, 
  Mail, 
  User, 
  Calendar,
  MessageSquare,
  Reply,
  Search,
  Filter,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Mock data - replace with actual API calls
const mockSupportMessages = [
  {
    id: '1',
    name: 'علي محمد الشمري',
    email: 'ali.alshammari@email.com',
    phone: '+966501234567',
    subject: 'مشكلة في تسجيل الدخول',
    message: 'أواجه مشكلة في تسجيل الدخول إلى الحساب الخاص بي. تظهر رسالة خطأ تفيد بأن كلمة المرور غير صحيحة رغم أنني متأكد من صحتها.',
    category: 'تقني',
    priority: 'متوسطة',
    status: 'جديد',
    createdAt: new Date('2024-01-22T10:30:00'),
    response: null,
    respondedAt: null,
    respondedBy: null
  },
  {
    id: '2',
    name: 'سارة أحمد القحطاني',
    email: 'sarah.alqahtani@email.com',
    phone: '+966502345678',
    subject: 'استفسار حول الدورات المتاحة',
    message: 'أود الاستفسار عن الدورات التدريبية المتاحة في مجال العلاقات العامة. هل توجد دورة مبتدئين؟ وما هي التكلفة؟',
    category: 'عام',
    priority: 'منخفضة',
    status: 'تم الرد',
    createdAt: new Date('2024-01-20T14:15:00'),
    response: 'شكراً لتواصلك معنا. نعم، لدينا دورة مبتدئين في العلاقات العامة تبدأ الشهر القادم. التكلفة 500 جنية وتشمل الشهادة. يمكنك التسجيل من خلال الموقع.',
    respondedAt: new Date('2024-01-21T09:00:00'),
    respondedBy: 'فريق الدعم'
  },
  {
    id: '3',
    name: 'محمد عبدالعزيز النجار',
    email: 'mohammed.najjar@email.com',
    phone: '+966503456789',
    subject: 'طلب استرداد مبلغ',
    message: 'لقد سددت رسوم التسجيل في إحدى الدورات ولكن تم إلغاؤها. أرجو المساعدة في استرداد المبلغ المدفوع.',
    category: 'مالي',
    priority: 'عالية',
    status: 'قيد المعالجة',
    createdAt: new Date('2024-01-19T16:45:00'),
    response: 'تم استلام طلبك وهو قيد المراجعة من القسم المالي. سيتم التواصل معك خلال 3-5 أيام عمل.',
    respondedAt: new Date('2024-01-20T10:30:00'),
    respondedBy: 'القسم المالي'
  },
  {
    id: '4',
    name: 'نورا سعد الدوسري',
    email: 'nora.aldosari@email.com',
    phone: '+966504567890',
    subject: 'اقتراح تحسين الموقع',
    message: 'لدي اقتراح لتحسين واجهة الموقع الإلكتروني. أعتقد أن إضافة خاصية البحث المتقدم ستساعد المستخدمين كثيراً.',
    category: 'اقتراح',
    priority: 'منخفضة',
    status: 'جديد',
    createdAt: new Date('2024-01-21T11:20:00'),
    response: null,
    respondedAt: null,
    respondedBy: null
  }
];

const categories = ['الكل', 'تقني', 'عام', 'مالي', 'اقتراح'];
const statuses = ['الكل', 'جديد', 'قيد المعالجة', 'تم الرد', 'مغلق'];
const priorities = ['الكل', 'عالية', 'متوسطة', 'منخفضة'];

const responseSchema = z.object({
  response: z.string().min(10, 'الرد يجب أن يكون 10 أحرف على الأقل')
});

type ResponseFormData = z.infer<typeof responseSchema>;

export default function SupportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedPriority, setSelectedPriority] = useState('الكل');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  
  const itemsPerPage = 10;

  // Mock query - replace with actual API
  const { data: supportData, isLoading, refetch } = useQuery({
    queryKey: ['support', currentPage, searchTerm, selectedCategory, selectedStatus, selectedPriority],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredMessages = mockSupportMessages;
      
      // Apply filters
      if (searchTerm) {
        filteredMessages = filteredMessages.filter(message =>
          message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedCategory !== 'الكل') {
        filteredMessages = filteredMessages.filter(message => message.category === selectedCategory);
      }
      
      if (selectedStatus !== 'الكل') {
        filteredMessages = filteredMessages.filter(message => message.status === selectedStatus);
      }
      
      if (selectedPriority !== 'الكل') {
        filteredMessages = filteredMessages.filter(message => message.priority === selectedPriority);
      }
      
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return {
        messages: filteredMessages.slice(start, end),
        total: filteredMessages.length,
        totalPages: Math.ceil(filteredMessages.length / itemsPerPage)
      };
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema)
  });

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setIsResponseModalOpen(true);
  };

  const onSubmitResponse = async (data: ResponseFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Response data:', {
        messageId: selectedMessage.id,
        response: data.response,
        respondedBy: 'الإدارة'
      });
      
      toast.success('تم إرسال الرد بنجاح');
      setIsResponseModalOpen(false);
      reset();
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الرد');
    }
  };

  const handleEmailReply = (message: any) => {
    const subject = `رد على: ${message.subject}`;
    const body = `مرحباً ${message.name}،%0D%0A%0D%0Aشكراً لتواصلك معنا...%0D%0A%0D%0Aتحياتنا،%0D%0Aفريق العلاقات العامة`;
    window.open(`mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${body}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية':
        return 'bg-red-100 text-red-800';
      case 'متوسطة':
        return 'bg-yellow-100 text-yellow-800';
      case 'منخفضة':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جديد':
        return 'bg-blue-100 text-blue-800';
      case 'قيد المعالجة':
        return 'bg-orange-100 text-orange-800';
      case 'تم الرد':
        return 'bg-green-100 text-green-800';
      case 'مغلق':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'جديد':
        return <AlertCircle className="w-4 h-4" />;
      case 'قيد المعالجة':
        return <Clock className="w-4 h-4" />;
      case 'تم الرد':
        return <CheckCircle className="w-4 h-4" />;
      case 'مغلق':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-24 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الدعم والاستفسارات</h1>
            <p className="text-gray-600 mt-2">إدارة والرد على رسائل الدعم والاستفسارات</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي الرسائل', value: '24', color: 'blue' },
            { label: 'رسائل جديدة', value: '8', color: 'green' },
            { label: 'قيد المعالجة', value: '5', color: 'orange' },
            { label: 'تم الرد', value: '11', color: 'purple' }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <HelpCircle className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في رسائل الدعم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Support Messages List */}
        <div className="space-y-4">
          <AnimatePresence>
            {supportData?.messages.map((message: any) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 gap-reverse mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{message.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                        <div className={`flex items-center gap-1 gap-reverse px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          <span>{message.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 gap-reverse text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2 gap-reverse">
                          <User className="w-4 h-4" />
                          <span>{message.name}</span>
                        </div>
                        <div className="flex items-center gap-2 gap-reverse">
                          <Mail className="w-4 h-4" />
                          <span>{message.email}</span>
                        </div>
                        <div className="flex items-center gap-2 gap-reverse">
                          <Calendar className="w-4 h-4" />
                          <span>{message.createdAt.toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{message.message}</p>
                  </div>

                  {/* Response Section */}
                  {message.response && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 gap-reverse mb-2">
                        <Reply className="w-4 h-4 text-primary-main" />
                        <span className="text-sm font-medium text-blue-900">رد {message.respondedBy}</span>
                        <span className="text-xs text-primary-main">
                          {message.respondedAt?.toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-blue-800">{message.response}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 gap-reverse">
                    <button
                      onClick={() => handleEmailReply(message)}
                      className="flex items-center gap-2 gap-reverse px-4 py-2 text-gray-600 hover:text-primary-main hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-medium">رد بالإيميل</span>
                    </button>
                    <button
                      onClick={() => handleReply(message)}
                      className="flex items-center gap-2 gap-reverse px-4 py-2 bg-primary-main text-white hover:bg-primary-main rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">رد سريع</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {supportData?.messages.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">لا توجد رسائل دعم</h2>
            <p className="text-gray-600">لم يتم العثور على أي رسائل دعم تطابق المعايير المحددة</p>
          </div>
        )}

        {/* Pagination */}
        {supportData && supportData.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalItems={supportData.total}
              totalPages={supportData.totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Response Modal */}
        <Modal
          isOpen={isResponseModalOpen}
          onClose={() => setIsResponseModalOpen(false)}
          title="الرد على الاستفسار"
          className="max-w-2xl"
        >
          {selectedMessage && (
            <form onSubmit={handleSubmit(onSubmitResponse)} className="space-y-6">
              {/* Message Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{selectedMessage.subject}</h3>
                <p className="text-sm text-gray-600 mb-2">من: {selectedMessage.name} ({selectedMessage.email})</p>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-700">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Response */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرد
                </label>
                <Textarea
                  {...register('response')}
                  rows={6}
                  placeholder="اكتب ردك هنا..."
                  error={errors.response?.message}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 gap-reverse pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResponseModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 gap-reverse"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>إرسال الرد</span>
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </Layout>
  );
} 