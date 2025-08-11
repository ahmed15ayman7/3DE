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
  BookOpen,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Eye,
  Trash2,
  UserPlus,
  BookOpenCheck
} from 'lucide-react';
import { instructorApi, courseApi, userApi } from '@3de/apis';
import { Button, Input, Modal, Badge, Avatar } from '@3de/ui';
import { Instructor, Course, User } from '@3de/interfaces';

type TabType = 'students' | 'courses';

export default function InstructorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const instructorId = params.id as string;

  // State
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('user.firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    experienceYears: 0,
    rating: 0,
    location: '',
    skills: [] as string[]
  });

  // Fetch instructor data
  const { data: instructorData, isLoading, error } = useQuery({
    queryKey: ['instructor', instructorId],
    queryFn: () => instructorApi.getById(instructorId),
    enabled: !!instructorId
  });

  const instructor = instructorData?.data;

  // Fetch instructor courses
  const { data: coursesData } = useQuery({
    queryKey: ['instructor-courses', instructorId],
    queryFn: () => courseApi.getByInstructorId(instructorId),
    enabled: !!instructorId
  });

  const courses = coursesData?.data || [];

  // Fetch all courses for adding to instructor
  const { data: allCoursesData } = useQuery({
    queryKey: ['all-courses'],
    queryFn: () => courseApi.getAll(),
    enabled: showAddCourseModal
  });

  const allCourses = allCoursesData?.data || [];


  // Update instructor mutation
  const updateInstructorMutation = useMutation({
    mutationFn: (data: Partial<Instructor>) => instructorApi.update(instructorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', instructorId] });
      setIsEditing(false);
    }
  });

  // Add course to instructor mutation
  const addCourseMutation = useMutation({
    mutationFn: (courseId: string) => courseApi.addInstructor(courseId, instructorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', instructorId] });
      queryClient.invalidateQueries({ queryKey: ['instructor-courses', instructorId] });
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      setShowAddCourseModal(false);
    }
  });

  // Initialize form data when instructor data loads
  useEffect(() => {
    if (instructor) {
      setFormData({
        firstName: instructor.user?.firstName || '',
        lastName: instructor.user?.lastName || '',
        email: instructor.user?.email || '',
        phone: instructor.user?.phone || '',
        title: instructor.title || '',
        bio: instructor.bio || '',
        experienceYears: instructor.experienceYears || 0,
        rating: instructor.rating || 0,
        location: instructor.location || '',
        skills: instructor.skills || []
      });
    }
  }, [instructor]);

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
      title: formData.title,
      bio: formData.bio,
      experienceYears: formData.experienceYears,
      rating: formData.rating,
      location: formData.location,
      skills: formData.skills
    };

    updateInstructorMutation.mutate(updateData);
  };

  // Get students from all courses
  const students = courses.flatMap((course: Course) => 
    course.enrollments?.map((enrollment: any) => enrollment.user).filter(Boolean) || []
  );

  // Filter and sort data based on active tab
  const getFilteredData = () => {
    let data = activeTab === 'students' ? students : courses;
    
    // Filter by search term
    if (searchTerm) {
      data = data.filter((item: any) => {
        if (activeTab === 'students') {
          const fullName = `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase();
          const email = item.email?.toLowerCase() || '';
          return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
        } else {
          const title = item.title?.toLowerCase() || '';
          const description = item.description?.toLowerCase() || '';
          return title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
        }
      });
    }

    // Sort data
    data.sort((a: any, b: any) => {
      let aValue: any, bValue: any;
      
      if (sortBy.includes('.')) {
        const [obj, prop] = sortBy.split('.');
        aValue = (a as any)[obj]?.[prop];
        bValue = (b as any)[obj]?.[prop];
      } else {
        aValue = (a as any)[sortBy];
        bValue = (b as any)[sortBy];
      }
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return data;
  };

  const filteredData = getFilteredData();

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

  if (error || !instructor) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل بيانات المحاضر</h3>
          <p className="text-gray-500">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        </div>
      </div>
    );
  }

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
              {isEditing ? 'تعديل بيانات المحاضر' : `${instructor.user?.firstName} ${instructor.user?.lastName}`}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'تعديل معلومات المحاضر' : 'تفاصيل المحاضر والكورسات والطلاب'}
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
              src={instructor.user?.avatar}
              alt={`${instructor.user?.firstName} ${instructor.user?.lastName}`}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المنصب</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="المنصب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">سنوات الخبرة</label>
                  <Input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value))}
                    placeholder="سنوات الخبرة"
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">نبذة شخصية</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="نبذة شخصية"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {instructor.user?.firstName} {instructor.user?.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{instructor.title}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{instructor.user?.email}</span>
                    </div>
                    {instructor.user?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{instructor.user.phone}</span>
                      </div>
                    )}
                    {instructor.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{instructor.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        انضم في {new Date(instructor.user?.createdAt || '').toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    {instructor.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-semibold">{instructor.rating}/5</span>
                      </div>
                    )}
                    
                    {instructor.experienceYears && (
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700">{instructor.experienceYears} سنوات خبرة</span>
                      </div>
                    )}

                    {instructor.bio && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">نبذة شخصية</h3>
                        <p className="text-gray-700">{instructor.bio}</p>
                      </div>
                    )}

                    {instructor.skills && instructor.skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">المهارات</h3>
                        <div className="flex flex-wrap gap-2">
                          {instructor.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
              disabled={updateInstructorMutation.isPending}
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
          <BookOpen className="w-12 h-12 text-primary-main mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          <p className="text-gray-600">الكورسات</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          <p className="text-gray-600">الطلاب</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Star className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{instructor.rating || 0}/5</p>
          <p className="text-gray-600">التقييم</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{instructor.experienceYears || 0}</p>
          <p className="text-gray-600">سنوات الخبرة</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md"
      >
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center cursor-pointer gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'students'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              الطلاب ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'courses'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              الكورسات ({courses.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={`البحث في ${activeTab === 'students' ? 'الطلاب' : 'الكورسات'}...`}
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
                {activeTab === 'students' ? (
                  <>
                    <option value="firstName">الاسم</option>
                    <option value="email">البريد الإلكتروني</option>
                    <option value="createdAt">تاريخ الانضمام</option>
                  </>
                ) : (
                  <>
                    <option value="title">العنوان</option>
                    <option value="status">الحالة</option>
                    <option value="createdAt">تاريخ الإنشاء</option>
                  </>
                )}
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

              {activeTab === "courses"? <Button
                onClick={() => setShowAddCourseModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة كورس
              </Button>:null}
            </div>
          </div>

          {/* Content */}
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'students' ? (
                  <Users className="w-8 h-8 text-gray-400" />
                ) : (
                  <BookOpen className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا يوجد {activeTab === 'students' ? 'طلاب' : 'كورسات'}
              </h3>
              <p className="text-gray-500">
                لم يتم العثور على {activeTab === 'students' ? 'طلاب' : 'كورسات'} تطابق معايير البحث.
              </p>
            </div>
          ) : viewMode === 'list' ? (
            // Table View
            <div className="overflow-x-auto">
              {activeTab === 'students' ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الطالب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الدور
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
                    {filteredData.map((student: User) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar
                              src={student.avatar}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-10 h-10 ml-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              {student.phone && (
                                <div className="text-sm text-gray-500">{student.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">{student.role}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(student.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => router.push(`/students/${student.id}`)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {/* <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الكورس
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الطلاب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الإنشاء
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((course: Course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {course.image && (
                              <img
                                src={course.image}
                                alt={course.title}
                                className="w-10 h-10 rounded-lg object-cover ml-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                المستوى: {course.level}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {course.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={course.status === 'ACTIVE' ? 'success' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.enrollments?.length || 0} طالب
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(course.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  {activeTab === 'students' ? (
                    <StudentCard student={item} viewMode={viewMode} />
                  ) : (
                    <CourseCard course={item} viewMode={viewMode} />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        title="إضافة كورس للمحاضر"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            اختر الكورس الذي تريد إضافته للمحاضر {instructor.user?.firstName} {instructor.user?.lastName}
          </p>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {allCourses
              .filter((course: Course) => !courses.find((c: Course) => c.id === course.id))
              .map((course: Course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.description}</p>
                  </div>
                  <Button
                    onClick={() => addCourseMutation.mutate(course.id)}
                    disabled={addCourseMutation.isPending}
                    size="sm"
                  >
                    إضافة
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </Modal>

      {/* Add Student Modal */}
      {/* <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="إضافة طالب للمحاضر"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            اختر الطالب الذي تريد إضافته للمحاضر {instructor.user?.firstName} {instructor.user?.lastName}
          </p>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {allStudents
              .filter((student: User) => student.role === 'STUDENT' && !students.find((s: User) => s.id === student.id))
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
                    onClick={() => {
                      // Add student to instructor logic here
                      setShowAddStudentModal(false);
                    }}
                    size="sm"
                  >
                    إضافة
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </Modal> */}
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

// Course Card Component
function CourseCard({ course, viewMode }: { course: Course; viewMode: 'grid' | 'list' }) {
  const router = useRouter();
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4">
        {course.image && (
          <img src={course.image} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <h4 className="font-medium">{course.title}</h4>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={course.status === 'ACTIVE' ? 'success' : 'secondary'}>
            {course.status}
          </Badge>
          <Button size="sm" variant="outline" onClick={() => router.push(`/courses/${course.id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {course.image && (
        <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-4" />
      )}
      <h4 className="font-medium mb-2">{course.title}</h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Badge variant={course.status === 'ACTIVE' ? 'success' : 'secondary'}>
          {course.status}
        </Badge>
        <span className="text-sm text-gray-500">
          {course.enrollments?.length || 0} طالب
        </span>
      </div>
      <Button size="sm" variant="outline" className="w-full" onClick={() => router.push(`/courses/${course.id}`)}>
        <Eye className="w-4 h-4 ml-2" />
        عرض التفاصيل
      </Button>
    </div>
  );
} 