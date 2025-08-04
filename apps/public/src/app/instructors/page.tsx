'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  Input, 
  Textarea,
  LoadingSpinner,
  Alert,
  Table,
  TableHeader,
  TableCell,
  Pagination,
  PaginationInfo,
  ItemsPerPage,
  Badge,
  Modal,
  Select
} from '@3de/ui';
import { instructorApi, userApi } from '@3de/apis';
import { Instructor, User } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import { 
  Search, 
  Mail, 
  Phone, 
  MessageCircle, 
  User as UserIcon,
  BookOpen,
  Edit,
  Save,
  X,
  Calendar,
  Star,
  MapPin
} from 'lucide-react';
import Layout from "../../components/Layout";

export default function InstructorsPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    location: '',
    experienceYears: 0
  });

  // Fetch instructors
  const { data: instructorsData, isLoading, error } = useQuery({
    queryKey: ['instructors', currentPage, itemsPerPage, searchTerm],
    queryFn: () => instructorApi.getAll(currentPage, itemsPerPage, searchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update instructor mutation
  const updateInstructorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Instructor> }) =>
      instructorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      setIsEditModalOpen(false);
      setSelectedInstructor(null);
      setEditingInstructor(null);
    },
  });

  // Handle email click
  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  // Handle phone click
  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = (phone: string) => {
    const whatsappNumber = phone.replace(/\s/g, '');
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle edit instructor
  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setEditingInstructor(instructor);
    setEditFormData({
      firstName: instructor.user?.firstName || '',
      lastName: instructor.user?.lastName || '',
      email: instructor.user?.email || '',
      phone: instructor.user?.phone || '',
      title: instructor.title || '',
      bio: instructor.bio || '',
      location: instructor.location || '',
      experienceYears: instructor.experienceYears || 0
    });
    setIsEditModalOpen(true);
  };

  // Handle form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInstructor) {
      updateInstructorMutation.mutate({
        id: selectedInstructor.id,
        data: {
          title: editFormData.title,
          bio: editFormData.bio,
          location: editFormData.location,
          experienceYears: editFormData.experienceYears
        }
      });
    }
  };

  // Filter instructors based on search term
  const instructors = instructorsData?.data || [];
  const filteredInstructors = instructors.filter((instructor: Instructor) =>
    instructor.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.user?.phone?.includes(searchTerm) ||
    instructor.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalItems = filteredInstructors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInstructors = filteredInstructors.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>  
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" title="خطأ في التحميل">
          حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
        </Alert>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>  
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المحاضرين</h1>
          <p className="text-gray-600 mt-2">عرض وإدارة بيانات المحاضرين في النظام</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {instructors.length} محاضر
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="البحث بالاسم أو التخصص أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pr-10"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructors Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader>
              <tr>
                <TableCell>المحاضر</TableCell>
                <TableCell>التخصص والمعلومات</TableCell>
                <TableCell>معلومات الاتصال</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>الإجراءات</TableCell>
              </tr>
            </TableHeader>
            <tbody>
              {paginatedInstructors.length === 0 ? (
                <tr>
                  <TableCell span={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-500">لا توجد نتائج للبحث</p>
                    </div>
                  </TableCell>
                </tr>
              ) : (
                paginatedInstructors.map((instructor: Instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {instructor.user?.firstName?.charAt(0)}{instructor.user?.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {instructor.user?.firstName} {instructor.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {instructor.title || 'محاضر'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {instructor.bio && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {instructor.bio}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {instructor.experienceYears && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {instructor.experienceYears} سنوات خبرة
                            </span>
                          )}
                          {instructor.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {instructor.location}
                            </span>
                          )}
                        </div>
                        {instructor.courses && instructor.courses.length > 0 && (
                          <Badge variant="info" className="w-fit">
                            {instructor.courses.length} دورة
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {instructor.user?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{instructor.user.email}</span>
                          </div>
                        )}
                        {instructor.user?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{instructor.user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={instructor.user?.isOnline ? "success" : "warning"}
                          className="w-fit"
                        >
                          {instructor.user?.isOnline ? 'متصل' : 'غير متصل'}
                        </Badge>
                        <Badge 
                          variant={instructor.user?.isVerified ? "success" : "warning"}
                          className="w-fit"
                        >
                          {instructor.user?.isVerified ? 'مفعل' : 'غير مفعل'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditInstructor(instructor)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          تعديل
                        </Button>
                        {instructor.user?.email && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmailClick(instructor.user?.email || '')}
                            className="flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                          </Button>
                        )}
                        {instructor.user?.phone && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePhoneClick(instructor.user?.phone || '')}
                              className="flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWhatsAppClick(instructor.user?.phone || '')}
                              className="flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <PaginationInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
              <div className="flex items-center gap-4">
                <ItemsPerPage
                  value={itemsPerPage}
                  onChange={setItemsPerPage}
                  options={[5, 10, 20, 50]}
                />
                <Pagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي المحاضرين</p>
                <p className="text-2xl font-bold text-gray-900">{instructors.length}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">المحاضرون المتصلون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {instructors.filter((i: Instructor) => i.user?.isOnline).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">المحاضرون المفعلون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {instructors.filter((i: Instructor) => i.user?.isVerified).length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">متوسط الخبرة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {instructors.length > 0 
                    ? Math.round(instructors.reduce((acc: number, i: Instructor) => acc + (i.experienceYears || 0), 0) / instructors.length)
                    : 0
                  } سنوات
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Instructor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل بيانات المحاضر"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الأول
              </label>
              <Input
                type="text"
                value={editFormData.firstName}
                onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                placeholder="الاسم الأول"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الأخير
              </label>
              <Input
                type="text"
                value={editFormData.lastName}
                onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                placeholder="الاسم الأخير"
                disabled
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="البريد الإلكتروني"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <Input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                placeholder="رقم الهاتف"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المسمى الوظيفي
            </label>
            <Input
              type="text"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              placeholder="مثال: محاضر، أستاذ مساعد، أستاذ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السيرة الذاتية
            </label>
            <Textarea
              value={editFormData.bio}
              onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
              placeholder="نبذة مختصرة عن المحاضر وخبراته"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع
              </label>
              <Input
                type="text"
                value={editFormData.location}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                placeholder="المدينة أو البلد"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سنوات الخبرة
              </label>
              <Input
                type="number"
                value={editFormData.experienceYears}
                onChange={(e) => setEditFormData({ ...editFormData, experienceYears: parseInt(e.target.value) || 0 })}
                placeholder="عدد سنوات الخبرة"
                min="0"
                max="50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={updateInstructorMutation.isPending}
            >
              {updateInstructorMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
    </Layout>
  );
} 