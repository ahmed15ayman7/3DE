'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  Input, 
  LoadingSpinner,
  Alert,
  Table,
  TableHeader,
  TableCell,
  Pagination,
  PaginationInfo,
  ItemsPerPage,
  Badge
} from '@3de/ui';
import { userApi } from '@3de/apis';
import { User } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import { 
  Search, 
  Mail, 
  Phone, 
  MessageCircle, 
  User as UserIcon,
  GraduationCap,
  Calendar
} from 'lucide-react';
import Layout from '../../components/Layout';

export default function StudentsPage() {
  const { user: currentUser } = useAuth();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch students (users with STUDENT role)
  const { data: studentsData, isLoading, error } = useQuery({
    queryKey: ['students', currentPage, itemsPerPage, searchTerm],
    queryFn: () => userApi.getAll(currentPage, itemsPerPage, searchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter students from all users
  const students = studentsData?.data?.filter((user: User) => user.role === 'STUDENT') || [];

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

  // Pagination
  const totalItems = students.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = students.slice(startIndex, endIndex);

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
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطلاب</h1>
          <p className="text-gray-600 mt-2">عرض وإدارة بيانات الطلاب المسجلين في النظام</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            {students.length} طالب
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
                  placeholder="البحث بالاسم أو رقم الهاتف أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pr-10"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader>
              <tr>
                <TableCell>الطالب</TableCell>
                <TableCell>معلومات الاتصال</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell>تاريخ التسجيل</TableCell>
                <TableCell>الإجراءات</TableCell>
              </tr>
            </TableHeader>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <TableCell span={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <UserIcon className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-500">لا توجد نتائج للبحث</p>
                    </div>
                  </TableCell>
                </tr>
              ) : (
                paginatedStudents.map((student: User) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {student.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{student.email}</span>
                          </div>
                        )}
                        {student.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{student.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={student.isOnline ? "success" : "warning"}
                          className="w-fit"
                        >
                          {student.isOnline ? 'متصل' : 'غير متصل'}
                        </Badge>
                        <Badge 
                          variant={student.isVerified ? "success" : "warning"}
                          className="w-fit"
                        >
                          {student.isVerified ? 'مفعل' : 'غير مفعل'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {student.email && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmailClick(student.email)}
                            className="flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                          </Button>
                        )}
                        {student.phone && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePhoneClick(student?.phone || '')}
                              className="flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWhatsAppClick(student?.phone || '')}
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

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
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
                <p className="text-sm text-gray-600">الطلاب المتصلون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter((s: User) => s.isOnline).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">الطلاب المفعلون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter((s: User) => s.isVerified).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </Layout>
  );
} 