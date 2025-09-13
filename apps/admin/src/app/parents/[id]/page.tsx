'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Edit,
  Save,
  X,
  Search,
  Plus,
  Grid,
  List,
  SortAsc,
  SortDesc,
  GraduationCap,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { parentApi, userApi } from '@3de/apis';
import { Button, Input, Modal, Badge, Avatar, toast } from '@3de/ui';
import { User, Parent, Child } from '@3de/interfaces';

type TabType = 'students' | 'courses';

export default function ParentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const parentId = params.id as string;
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('user.firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Fetch instructor data
  const { data: parentData, isLoading, error } = useQuery({
    queryKey: ['parent', parentId],
    queryFn: () => parentApi.getById(parentId),
    enabled: !!parentId
  });

  const parent : Parent = parentData?.data;
  let [searchStudent, setSearchStudent] = useState<string>('');
  let {data: allStudents, isLoading: isLoadingStudents,refetch: refetchStudents} = useQuery({
    queryKey: ['students'],
    queryFn: () => userApi.getAll(0,1000,searchStudent),
    enabled: showAddStudentModal,
  });
  useEffect(() => {
          refetchStudents();  
  }, [searchStudent]);
  // Update instructor mutation
  const updateParentMutation = useMutation({
    mutationFn: (data: Partial<User>) => parentApi.updateParentUser(parentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', parentId] });
      setIsEditing(false);
    }
  });

  // Add course to instructor mutation
  const addStudentMutation = useMutation({
    mutationFn: (studentId: string) => parentApi.createChild(parentId, { userId: studentId, status: 'ACTIVE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', parentId] });
      queryClient.invalidateQueries({ queryKey: ['parent-students', parentId] });
      queryClient.invalidateQueries({ queryKey: ['all-students'] });
      setShowAddStudentModal(false);
    }
  });
  const deleteStudentMutation = useMutation({
    mutationFn: (studentId: string) => parentApi.deleteChild(parentId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', parentId] });
      queryClient.invalidateQueries({ queryKey: ['parent-students', parentId] });
      setShowAddStudentModal(false);
      queryClient.invalidateQueries({ queryKey: ['all-students'] });
    }
  });
  const updateStudentMutation = useMutation({
    mutationFn: (studentId: string) => parentApi.updateChild(parentId, studentId, { status: 'ACTIVE' }),
    onSuccess: () => {
      toast.success('تم تحديث حالة الطالب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['parent', parentId] });
      queryClient.invalidateQueries({ queryKey: ['parent-students', parentId] });
      setShowAddStudentModal(false);
    }
  });

  // Initialize form data when instructor data loads
  useEffect(() => {
    if (parent) {
      setFormData({
        firstName: parent.user?.firstName || '',
        lastName: parent.user?.lastName || '',
        email: parent.user?.email || '',
        phone: parent.user?.phone || '',
      });
    }
  }, [parent]);

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    };

    updateParentMutation.mutate(updateData);
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !parent) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل بيانات الولي</h3>
          <p className="text-gray-500">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        </div>
      </div>
    );
  }
let filteredChildren = parent.children?.filter((child: Child) => {
  return child.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || child.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || child.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
});
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'تعديل بيانات الولي' : `${parent.user?.firstName} ${parent.user?.lastName}`}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'تعديل معلومات الولي' : 'تفاصيل الولي والأولاد'}
            </p>
          </div>
        </div>

        {!isEditing && (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </Button>
          </div>
        )}
      </motion.div>

      {/* Instructor Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar
              src={parent.user?.avatar}
              alt={`${parent.user?.firstName} ${parent.user?.lastName}`}
              className="w-24 h-24"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="الاسم الأول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأخير</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="الاسم الأخير"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="رقم الهاتف"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="الموقع"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {parent.user?.firstName} {parent.user?.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{parent.user?.role}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{parent.user?.email}</span>
                    </div>
                    {parent.user?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{parent.user.phone}</span>
                      </div>
                    )}
                    {parent.user?.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{parent.user?.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        انضم في {new Date(parent.user?.createdAt || '').toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex gap-2 mt-6 pt-6 border-t">
            <Button
              onClick={handleSubmit}
              disabled={updateParentMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              إلغاء
            </Button>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{filteredChildren?.length}</p>
          <p className="text-gray-600">الأولاد</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md"
      >

        {/* Tab Content */}
        <div className="p-6">
          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={`البحث في الأولاد...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main"
              >
                  <>
                    <option value="firstName">الاسم</option>
                    <option value="email">البريد الإلكتروني</option>
                    <option value="createdAt">تاريخ الانضمام</option>
                  </>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>

              <Button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة كورس
              </Button>
            </div>
          </div>

          {/* Content */}
          {filteredChildren?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا يوجد 
              </h3>
              <p className="text-gray-500">
                لم يتم العثور على أولاد تطابق معايير البحث.
              </p>
            </div>
          ) : viewMode === 'list' ? (
            // Table View
            <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الأولاد
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        حالة الطالب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الانضمام
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredChildren?.map((student: Child) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar
                              src={student.user?.avatar}
                              alt={`${student.user?.firstName} ${student.user?.lastName}`}
                              className="w-10 h-10 ml-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.user?.firstName} {student.user?.lastName}
                              </div>
                              {student.user?.phone && (
                                <div className="text-sm text-gray-500">{student.user?.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">{student.status === 'ACTIVE' ? 'مفعل' : 'لم يتم التحقق'}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(student.createdAt || '').toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => router.push(`/students/${student.user?.id}`)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteStudentMutation.mutate(student.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button> 
                            <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700" onClick={() => updateStudentMutation.mutate(student.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChildren?.map((item: Child, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
               {item.user && <StudentCard student={item.user} viewMode={viewMode} />}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="إضافة طالب للولي"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            اختر الطالب الذي تريد إضافته للولي {parent.user?.firstName} {parent.user?.lastName}
          </p>

          <Input
            placeholder="البحث في الطلاب"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
          />
          <div className="max-h-96 overflow-y-auto space-y-2">
            {allStudents?.data
              .filter((student: User) => !filteredChildren?.find((c: Child) => c.user?.id === student.id))
              .map((student: User) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                  <Button
                    onClick={() => addStudentMutation.mutate(student.id)}
                    disabled={addStudentMutation.isPending}
                    size="sm"
                  >
                    إضافة
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Student Card Component
function StudentCard({ student, viewMode }: { student: User; viewMode: 'grid' | 'list' }) {
  const router = useRouter();
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4">
        <Avatar src={student.avatar} alt={`${student.firstName} ${student.lastName}`} />
        <div className="flex-1">
          <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
          <p className="text-sm text-gray-600">{student.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{student.role}</Badge>
          <Button size="sm" variant="outline" onClick={() => router.push(`/students/${student.id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Avatar
        src={student.avatar}
        alt={`${student.firstName} ${student.lastName}`}
        className="w-16 h-16 mx-auto mb-4"
      />
      <h4 className="font-medium mb-1">{student.firstName} {student.lastName}</h4>
      <p className="text-sm text-gray-600 mb-3">{student.email}</p>
      <Badge variant="secondary" className="mb-3">{student.role}</Badge>
      <Button size="sm" variant="outline" className="w-full" onClick={() => router.push(`/students/${student.id}`)}>
        <Eye className="w-4 h-4 ml-2" />
        عرض التفاصيل
      </Button>
    </div>
  );
}