'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Award,
  Check,
  X,
  Eye,
  Download,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { certificateApi } from '@3de/apis';
import { Button, Input, Modal, toast } from '@3de/ui';
import { Certificate, User as UserType } from '@3de/interfaces';

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');

  const queryClient = useQueryClient();

  // Fetch certificates data
  const { data: certificatesData, isLoading, error } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => certificateApi.getAll(),
  });

  const certificates = certificatesData?.data || [];

  // Update certificate status mutation
  const updateCertificateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      certificateApi.update(id, data),
    onSuccess: () => {
      toast.success('تم تحديث حالة الشهادة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      setShowApprovalModal(false);
      setSelectedCertificate(null);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الشهادة');
    },
  });

  // Filter certificates
  const filteredCertificates = certificates.filter(certificate => {
    const student = certificate.user;
    
    const matchesSearch = 
      student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'APPROVED' && certificate.isApproved) ||
      (statusFilter === 'PENDING' && !certificate.isApproved);
    
    const matchesType = typeFilter === 'ALL' || certificate.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Statistics
  const pendingCertificates = certificates.filter(c => !c.isApproved).length;
  const approvedCertificates = certificates.filter(c => c.isApproved).length;
  const totalPoints = certificates.reduce((sum, c) => sum + (c.points || 0), 0);
  const uniqueTypes = [...new Set(certificates.map(c => c.type))];

  const getStatusIcon = (isApproved: boolean) => {
    return isApproved ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <Clock className="w-4 h-4 text-yellow-500" />
    );
  };

  const getStatusText = (isApproved: boolean) => {
    return isApproved ? 'معتمدة' : 'في الانتظار';
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const handleApproval = (certificate: Certificate, action: 'approve' | 'reject') => {
    setSelectedCertificate(certificate);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const confirmApproval = () => {
    if (!selectedCertificate) return;
    
         updateCertificateMutation.mutate({
       id: selectedCertificate.id,
       data: { isApproved: approvalAction === 'approve' }
     });
  };

  const handleDownload = async (certificate: Certificate) => {
    try {
      const response = await certificateApi.download(certificate.id);
      // Handle download logic here
      toast.success('تم تحميل الشهادة بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل الشهادة');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل الشهادات</h3>
          <p className="text-gray-500">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الشهادات</h1>
          <p className="text-gray-600 mt-1">
            مراجعة وإدارة الشهادات المطلوبة ({filteredCertificates.length} شهادة)
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
          <p className="text-gray-600">إجمالي الشهادات</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{pendingCertificates}</p>
          <p className="text-gray-600">في انتظار المراجعة</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{approvedCertificates}</p>
          <p className="text-gray-600">معتمدة</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{uniqueTypes.length}</p>
          <p className="text-gray-600">أنواع الشهادات</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث في الشهادات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="PENDING">في الانتظار</option>
            <option value="APPROVED">معتمدة</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="ALL">جميع الأنواع</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Certificates Grid */}
      {filteredCertificates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center min-h-96"
        >
          <div className="text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد شهادات</h3>
            <p className="text-gray-500">لم يتم العثور على شهادات تطابق معايير البحث.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCertificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
            >
              {/* Certificate Image */}
              <div className="relative h-48 bg-gradient-to-r from-yellow-400 to-yellow-500">
                {certificate.image ? (
                  <img 
                    src={certificate.image} 
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Award className="w-16 h-16 text-white opacity-60" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(certificate.isApproved)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.isApproved)}`}>
                      {getStatusText(certificate.isApproved)}
                    </span>
                  </div>
                </div>

                {/* Points Badge */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                  {certificate.points} نقطة
                </div>
              </div>

              {/* Certificate Content */}
              <div className="p-6">
                {/* Title and Type */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {certificate.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {certificate.type}
                  </span>
                </div>

                {/* Student Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {certificate.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {certificate.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="mb-4 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">العنوان:</span> {certificate.address}</p>
                  <p><span className="font-medium">الهاتف:</span> {certificate.phone}</p>
                </div>

                {/* Description */}
                {certificate.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {certificate.description}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {certificate.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">ملاحظات:</span> {certificate.notes}
                    </p>
                  </div>
                )}

                {/* Date */}
                <div className="mb-4 flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  تاريخ الإنجاز: {new Date(certificate.earnedAt).toLocaleDateString('ar-SA')}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedCertificate(certificate);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    عرض
                  </Button>
                  
                  {certificate.isApproved ? (
                    <Button
                      onClick={() => handleDownload(certificate)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleApproval(certificate, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleApproval(certificate, 'reject')}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Certificate Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل الشهادة"
      >
        {selectedCertificate && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <p className="text-sm text-gray-900">{selectedCertificate.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <p className="text-sm text-gray-900">{selectedCertificate.type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <p className="text-sm text-gray-900">{selectedCertificate.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النقاط</label>
                <p className="text-sm text-gray-900">{selectedCertificate.points}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
              <p className="text-sm text-gray-900">{selectedCertificate.address}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
              <p className="text-sm text-gray-900">{selectedCertificate.phone}</p>
            </div>
            
            {selectedCertificate.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <p className="text-sm text-gray-900">{selectedCertificate.description}</p>
              </div>
            )}
            
            {selectedCertificate.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <p className="text-sm text-gray-900">{selectedCertificate.notes}</p>
              </div>
            )}
            
            {selectedCertificate.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">صورة الشهادة</label>
                <img 
                  src={selectedCertificate.image} 
                  alt="Certificate" 
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approval Confirmation Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={approvalAction === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض'}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {approvalAction === 'approve' ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                {approvalAction === 'approve' ? 'موافقة على الشهادة' : 'رفض الشهادة'}
              </p>
              <p className="text-sm text-gray-500">
                {selectedCertificate?.title}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            {approvalAction === 'approve' 
              ? 'هل أنت متأكد من رغبتك في الموافقة على هذه الشهادة؟'
              : 'هل أنت متأكد من رغبتك في رفض هذه الشهادة؟'
            }
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowApprovalModal(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            
            <Button
              onClick={confirmApproval}
              disabled={updateCertificateMutation.isPending}
              className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
            >
              {approvalAction === 'approve' ? 'موافقة' : 'رفض'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 