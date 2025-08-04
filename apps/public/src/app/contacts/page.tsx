'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import { Card, Modal, Button, Pagination } from '@3de/ui';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  User, 
  Calendar,
  Building,
  MapPin,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { contactApi } from '@3de/apis';
import { ContactUs } from '@3de/interfaces';
const categories = ['الكل', 'شراكة', 'إعلام', 'فعاليات', 'استشارات'];
const statuses = ['الكل', 'جديد', 'متابع', 'مكتمل'];
const priorities = ['الكل', 'عالية', 'متوسطة', 'منخفضة'];

export default function ContactsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedPriority, setSelectedPriority] = useState('الكل');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const itemsPerPage = 12;

  // Mock query - replace with actual API
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ['contacts', currentPage, searchTerm, selectedCategory, selectedStatus, selectedPriority],
    queryFn: ()=>contactApi.getAll(searchTerm, itemsPerPage, (currentPage - 1) * itemsPerPage)
  });

  const handleContactClick = (contact: any, contactType: 'email' | 'phone' | 'whatsapp') => {
    setSelectedContact({ ...contact, contactType });
    setIsContactModalOpen(true);
  };

  const handleContactAction = () => {
    if (!selectedContact) return;

    const { contactType, email, phone, name } = selectedContact;

    switch (contactType) {
      case 'email':
        window.open(`mailto:${email}?subject=تواصل من فريق العلاقات العامة&body=مرحباً ${name}،%0D%0A%0D%0A`);
        break;
      case 'phone':
        window.open(`tel:${phone}`);
        break;
      case 'whatsapp':
        const whatsappMessage = encodeURIComponent(`مرحباً ${name}، نتواصل معك من فريق العلاقات العامة.`);
        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`);
        break;
    }

    setIsContactModalOpen(false);
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
      case 'متابع':
        return 'bg-orange-100 text-orange-800';
      case 'مكتمل':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContactIcon = (contactType: string) => {
    switch (contactType) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getContactLabel = (contactType: string) => {
    switch (contactType) {
      case 'email':
        return 'إرسال إيميل';
      case 'phone':
        return 'اتصال هاتفي';
      case 'whatsapp':
        return 'مراسلة واتساب';
      default:
        return 'اتصال';
    }
  };


  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">جهات الاتصال</h1>
            <p className="text-gray-600 mt-2">إدارة والتواصل مع جميع جهات الاتصال</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في جهات الاتصال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>

            {/* Filters */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div> */}
          </div>
        </Card>
        {isLoading && (
        <div className="space-y-6">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

        {/* Contacts Grid */}
      { !isLoading && contactsData?.data?.data && contactsData?.data?.data?.length  > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {contactsData?.data.data.map((contact: ContactUs) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 gap-reverse">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-main to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {contact.name.split(' ')[0].charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                        {/* <span className="text-sm text-gray-600 flex items-center gap-2 gap-reverse" onClick={() => handleContactClick(contact, 'email')}>
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </span>
                        <p className="text-sm text-gray-600 flex items-center gap-2 gap-reverse">
                          <Phone className="w-4 h-4" onClick={() => handleContactClick(contact, 'phone')} />
                            <MessageSquare className="w-4 h-4" onClick={() => handleContactClick(contact, 'whatsapp')} />
                          <span className="text-sm text-gray-600" onClick={() => handleContactClick(contact, 'phone')}>{contact.phone}</span>
                        </p>*/}
                      </div> 
                    </div>
                    <div className="flex items-center gap-1 gap-reverse">
                      {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                        {contact.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span> */}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(contact.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {contact.message}
                    </p>
                  </div>

                  {/* Contact Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleContactClick(contact, 'email')}
                      className="flex items-center justify-center gap-1 gap-reverse py-2 px-3 bg-blue-50 hover:bg-blue-100 text-primary-main rounded-lg transition-colors group"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-xs font-medium">إيميل</span>
                    </button>
                    <button
                      onClick={() => handleContactClick(contact, 'phone')}
                      className="flex items-center justify-center gap-1 gap-reverse py-2 px-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors group"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-xs font-medium">هاتف</span>
                    </button>
                    <button
                      onClick={() => handleContactClick(contact, 'whatsapp')}
                      className="flex items-center justify-center gap-1 gap-reverse py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors group"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-medium">واتساب</span>
                    </button>
                  </div>

                  {/* Last Contact */}
                  {contact.updatedAt && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        آخر تواصل: {new Date(contact.updatedAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>}

        {/* Empty State */}
        {contactsData?.data.data.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">لا توجد جهات اتصال</h2>
            <p className="text-gray-600">لم يتم العثور على أي جهات اتصال تطابق المعايير المحددة</p>
          </div>
        )}

        {/* Pagination */}
        {contactsData && contactsData.data.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalItems={contactsData.data.total}
              totalPages={contactsData.data.totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Contact Modal */}
        <Modal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          title="اختيار طريقة التواصل"
          className="max-w-md"
        >
          {selectedContact && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-main to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {selectedContact.name.split(' ')[0].charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{selectedContact.name}</h3>
                <p className="text-sm text-gray-600">{selectedContact.company}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 gap-reverse mb-3">
                  {getContactIcon(selectedContact.contactType)}
                  <span className="font-medium text-gray-900">
                    {getContactLabel(selectedContact.contactType)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedContact.contactType === 'email' && `البريد الإلكتروني: ${selectedContact.email}`}
                  {selectedContact.contactType === 'phone' && `رقم الهاتف: ${selectedContact.phone}`}
                  {selectedContact.contactType === 'whatsapp' && `رقم الواتساب: ${selectedContact.phone}`}
                </p>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-700">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 gap-reverse">
                <Button
                  variant="outline"
                  onClick={() => setIsContactModalOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleContactAction}
                  className="flex items-center gap-2 gap-reverse"
                >
                  {getContactIcon(selectedContact.contactType)}
                  <span>{getContactLabel(selectedContact.contactType)}</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
} 