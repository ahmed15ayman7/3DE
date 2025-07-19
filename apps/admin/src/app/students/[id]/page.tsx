'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  Star,
  Trash2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  userApi, 
  enrollmentApi, 
  achievementApi, 
  badgeApi,
  attendanceApi,
  courseApi
} from '@3de/apis';
import { Button, Input, Modal, toast } from '@3de/ui';
import { User as UserType, Enrollment, Achievement, Badge, Course } from '@3de/interfaces';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<UserType>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch student data
  const { data: studentData, isLoading: studentLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => userApi.getById(studentId),
    enabled: !!studentId,
  });

  // Fetch student enrollments
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['student-enrollments', studentId],
    queryFn: () => enrollmentApi.getByUser(studentId),
    enabled: !!studentId,
  });

  // Fetch student achievements
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['student-achievements', studentId],
    queryFn: () => achievementApi.getByUser(studentId),
    enabled: !!studentId,
  });

  // Fetch student badges
  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ['student-badges', studentId],
    queryFn: () => badgeApi.getByStudent(studentId),
    enabled: !!studentId,
  });

  const student = studentData?.data;
  const enrollments = enrollmentsData?.data || [];
  const achievements = achievementsData?.data || [];
  const badges = badgesData?.data || [];

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: (data: Partial<UserType>) => userApi.update(studentId, data),
    onSuccess: () => {
      toast.success('تم تحديث بيانات الطالب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['student', studentId] });
      setIsEditing(false);
      setEditingStudent({});
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث البيانات');
    },
  });

  // Delete enrollment mutation
  const deleteEnrollmentMutation = useMutation({
    mutationFn: (enrollmentId: string) => enrollmentApi.delete(enrollmentId),
    onSuccess: () => {
      toast.success('تم حذف الاشتراك بنجاح');
      queryClient.invalidateQueries({ queryKey: ['student-enrollments', studentId] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الاشتراك');
    },
  });

  // Calculate statistics
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE').length;
  const completedCourses = enrollments.filter(e => e.progress === 100).length;
  const averageProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length 
    : 0;
  const totalPoints = [...achievements, ...badges].reduce((sum, item) => sum + (0), 0);

  const handleEdit = () => {
    setEditingStudent({
      firstName: student?.firstName,
      lastName: student?.lastName,
      email: student?.email,
      phone: student?.phone,
      age: student?.age,
      location: student?.location,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateStudentMutation.mutate(editingStudent);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingStudent({});
  };

  const isLoading = studentLoading || enrollmentsLoading || achievementsLoading || badgesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لم يتم العثور على الطالب</h3>
          <p className="text-gray-500 mb-4">الطالب المطلوب غير موجود أو تم حذفه.</p>
          <Link href="/students">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للطلاب
            </Button>
          </Link>
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
          <Link href="/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1">تفاصيل الطالب ومعلوماته الشخصية</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Edit className="w-4 h-4 ml-2" />
              تعديل البيانات
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
              
              <Button 
                onClick={handleSave} 
                disabled={updateStudentMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
          <p className="text-gray-600">الكورسات المسجل بها</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Activity className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{activeEnrollments}</p>
          <p className="text-gray-600">كورسات نشطة</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
          <p className="text-gray-600">كورسات مكتملة</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
          <p className="text-gray-600">إجمالي النقاط</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                {isEditing ? (
                  <Input
                    value={editingStudent.firstName || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})}
                    placeholder="الاسم الأول"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{student.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأخير</label>
                {isEditing ? (
                  <Input
                    value={editingStudent.lastName || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})}
                    placeholder="الاسم الأخير"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{student.lastName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editingStudent.email || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {student.email}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                {isEditing ? (
                  <Input
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {student.phone || 'غير محدد'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العمر</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editingStudent.age || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, age: parseInt(e.target.value)})}
                    placeholder="العمر"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {student.age ? `${student.age} سنة` : 'غير محدد'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                {isEditing ? (
                  <Input
                    value={editingStudent.location || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, location: e.target.value})}
                    placeholder="الموقع"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {student.location || 'غير محدد'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ التسجيل</label>
                <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {new Date(student.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <div className="flex items-center gap-2">
                  {student.isVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.isVerified ? 'متحقق' : 'في انتظار التحقق'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollments */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الكورسات المسجل بها</h3>
            
            {enrollments.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">لا يوجد كورسات مسجل بها</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {enrollment.course?.title || 'كورس غير محدد'}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          المستوى: {enrollment.course?.level}
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {enrollment.status === 'ACTIVE' ? 'نشط' :
                               enrollment.status === 'PENDING' ? 'في الانتظار' : 'ملغى'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">
                              التقدم: {Math.round(enrollment.progress || 0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mr-4">
                        <Button
                          onClick={() => deleteEnrollmentMutation.mutate(enrollment.id)}
                          disabled={deleteEnrollmentMutation.isPending}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">نظرة عامة على التقدم</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">متوسط التقدم</span>
                  <span className="text-lg font-bold text-gray-900">{Math.round(averageProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${averageProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{completedCourses}</p>
                  <p className="text-xs text-gray-500">مكتمل</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{activeEnrollments}</p>
                  <p className="text-xs text-gray-500">قيد التقدم</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الإنجازات</h3>
            
            {achievements.length === 0 ? (
              <div className="text-center py-6">
                <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">لا توجد إنجازات بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{achievement.type}</p>
                      <p className="text-xs text-gray-500">{achievement.value}</p>
                    </div>
                  </div>
                ))}
                
                {achievements.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{achievements.length - 3} إنجاز إضافي
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الشارات</h3>
            
            {badges.length === 0 ? (
              <div className="text-center py-6">
                <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">لا توجد شارات بعد</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {badges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className="text-center p-3 bg-blue-50 rounded-lg">
                    <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-900 truncate">{badge.title}</p>
                    <p className="text-xs text-gray-500">{badge.points} نقطة</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            هل أنت متأكد من رغبتك في حذف هذا الطالب؟ سيتم حذف جميع البيانات المرتبطة به.
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              حذف نهائياً
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 