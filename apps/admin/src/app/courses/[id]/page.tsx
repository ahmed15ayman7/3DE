'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Eye,
  Play,
  Lock,
  Unlock,
  AlertTriangle,
  Star,
  Award,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  ArrowLeft
} from 'lucide-react';
import { courseApi, lessonApi, enrollmentApi } from '@3de/apis';
import { Button, Input, Textarea, Modal, toast } from '@3de/ui';
import { Course, Lesson, File, Quiz, Enrollment, User } from '@3de/interfaces';
import FileViewer from '../../../components/files/FileViewer';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    level: '',
    duration: 0,
    price: 0,
    startDate: '',
    image: ''
  });

  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showLessonContentModal, setShowLessonContentModal] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentLessonData, setCurrentLessonData] = useState<Lesson | null>(null);

  // Fetch course data
  const { data: courseData, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseApi.getById(courseId),
    enabled: !!courseId,
  });

  // Fetch course students
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['course-students', courseId],
    queryFn: () => courseApi.getStudents(courseId),
    enabled: !!courseId,
  });

  const course = courseData?.data;
  const students = studentsData?.data || [];

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: (updatedData: Partial<Course>) => 
      courseApi.update(courseId, updatedData),
    onSuccess: () => {
      toast.success('تم تحديث الكورس بنجاح');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الكورس');
    },
  });

  // Update lesson whitelist mutation
  const updateWhitelistMutation = useMutation({
    mutationFn: ({ lessonId, userId, isBlocked }: { 
      lessonId: string; 
      userId: string; 
      isBlocked: boolean; 
    }) => lessonApi.updateBlockList(lessonId, userId, isBlocked),
    onSuccess: () => {
      toast.success('تم تحديث حالة الدرس بنجاح');
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث حالة الدرس');
    },
  });

  const handleEdit = () => {
    if (course) {
      setEditForm({
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration || 0,
        price: course.price || 0,
        startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
        image: course.image || ''
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const updatedData: Partial<Course> = {
      ...editForm,
      startDate: editForm.startDate ? new Date(editForm.startDate) : undefined,
    };
    updateCourseMutation.mutate(updatedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      title: '',
      description: '',
      level: '',
      duration: 0,
      price: 0,
      startDate: '',
      image: ''
    });
  };

  const checkLessonWarning = (lesson: Lesson) => {
    if (!lesson.lastOpenedAt) return false;
    const lastOpened = new Date(lesson.lastOpenedAt);
    const daysSinceOpened = (Date.now() - lastOpened.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceOpened > 15;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'IMAGE':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'PDF':
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleViewLessonContent = (lesson: Lesson) => {
    setCurrentLessonData(lesson);
    if (lesson.files && lesson.files.length > 0) {
      setCurrentFile(lesson.files[0] as File);
    } else {
      setCurrentFile(null);
    }
    setShowLessonContentModal(true);
  };

  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
  };

  const handleFileProgress = (progress: number, duration: number) => {
    // يمكن إضافة logic لتتبع التقدم هنا
    console.log(`File progress: ${progress}%`);
  };

  const handleFileComplete = () => {
    // يمكن إضافة logic عند اكتمال مشاهدة الملف
    console.log('File viewing completed');
  };

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل الكورس</h3>
          <p className="text-gray-500">لم يتم العثور على الكورس أو حدث خطأ في التحميل.</p>
          <Button 
            onClick={() => router.back()} 
            className="mt-4 bg-primary-main text-white"
          >
            العودة
          </Button>
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? editForm.title : course.title}
          </h1>
          <p className="text-gray-600 mt-1">تفاصيل وإدارة الكورس</p>
        </div>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={updateCourseMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-5 h-5 ml-2" />
                حفظ
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300"
              >
                <X className="w-5 h-5 ml-2" />
                إلغاء
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEdit}
              className="bg-primary-main hover:bg-primary-dark text-white"
            >
              <Edit className="w-5 h-5 ml-2" />
              تعديل
            </Button>
          )}
        </div>
      </motion.div>

      {/* Course Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Course Image */}
        <div className="relative h-64 bg-gradient-to-r from-primary-main to-primary-dark">
          {course.image ? (
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="w-24 h-24 text-white opacity-60" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              course.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {course.status === 'ACTIVE' ? 'نشط' :
               course.status === 'PENDING' ? 'في الانتظار' : 'مكتمل'}
            </span>
          </div>
        </div>

        {/* Course Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Description */}
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="عنوان الكورس"
                      className="text-2xl font-bold"
                    />
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف الكورس"
                      rows={4}
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{course.description}</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{course.enrollments?.length || 0}</p>
                  <p className="text-blue-600 text-sm">طالب مشترك</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">{course.lessons?.length || 0}</p>
                  <p className="text-green-600 text-sm">درس</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">{course.duration || 0}</p>
                  <p className="text-purple-600 text-sm">ساعة</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">{Math.round(course.progress || 0)}%</p>
                  <p className="text-orange-600 text-sm">التقدم</p>
                </div>
              </div>
            </div>

            {/* Side Info */}
            <div className="space-y-6">
              {/* Course Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-900">تفاصيل الكورس</h3>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المستوى</label>
                      <Input
                        value={editForm.level}
                        onChange={(e) => setEditForm(prev => ({ ...prev, level: e.target.value }))}
                        placeholder="مستوى الكورس"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المدة (ساعة)</label>
                      <Input
                        type="number"
                        value={editForm.duration}
                        onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        placeholder="مدة الكورس"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ريال)</label>
                      <Input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        placeholder="سعر الكورس"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label>
                      <Input
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">المستوى: {course.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600">المدة: {course.duration || 0} ساعة</span>
                    </div>
                    {course.price && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">السعر: {course.price} ريال</span>
                      </div>
                    )}
                    {course.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">
                          البدء: {new Date(course.startDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Instructors */}
              {course.instructors && course.instructors.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">المحاضرين</h3>
                  <div className="space-y-2">
                    {course.instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-main rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {instructor.user?.firstName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {instructor.user?.firstName} {instructor.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{instructor.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={() => setShowStudentsModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Users className="w-4 h-4 ml-2" />
                  عرض الطلاب ({students.length})
                </Button>
                
                <Button
                  onClick={() => router.push(`/courses/${courseId}/lessons`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <BookOpen className="w-4 h-4 ml-2" />
                  إدارة الدروس
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lessons Section */}
      {course.lessons && course.lessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">دروس الكورس</h3>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 ml-2" />
              إضافة درس
            </Button>
          </div>

          <div className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const hasWarning = checkLessonWarning(lesson);
              
              return (
                <div 
                  key={lesson.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    hasWarning ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-primary-main text-white rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{lesson.content}</p>
                        </div>
                        {hasWarning && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs">تحذير: مفتوح لأكثر من 15 يوم</span>
                          </div>
                        )}
                      </div>

                      {/* Lesson Files */}
                      {lesson.files && lesson.files.length > 0 && (
                        <div className="mt-3 ml-11">
                          <div className="flex flex-wrap gap-2">
                            {lesson.files.map((file) => (
                              <div key={file.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs">
                                {getFileIcon(file.type || '')}
                                <span>{file.name}</span>
                                <button className="text-blue-600 hover:text-blue-700">
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lesson Progress */}
                      <div className="mt-3 ml-11">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>التقدم: {Math.round(lesson.progress || 0)}%</span>
                          <span>مكتمل بواسطة: {lesson.completedBy?.length || 0} طالب</span>
                          {lesson.quizzes && lesson.quizzes.length > 0 && (
                            <span>الاختبارات: {lesson.quizzes.length}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleViewLessonContent(lesson)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Play className="w-4 h-4 ml-1" />
                        عرض المحتوى
                      </Button>
                      
                      <Button
                        onClick={() => setSelectedLesson(lesson.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-600"
                      >
                        <Lock className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Students Modal */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title={`طلاب الكورس (${students.length})`}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {studentsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">لا يوجد طلاب مسجلين في هذا الكورس</p>
            </div>
          ) : (
            students.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-primary-main rounded-full flex items-center justify-center">
                     <span className="text-white font-medium">
                       {enrollment.user.firstName?.[0] || 'T'}
                     </span>
                   </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {enrollment.user.firstName} {enrollment.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {Math.round(enrollment.progress || 0)}%
                  </p>
                  <p className={`text-xs ${
                    enrollment.status === 'ACTIVE' ? 'text-green-600' : 
                    enrollment.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {enrollment.status === 'ACTIVE' ? 'نشط' :
                     enrollment.status === 'PENDING' ? 'في الانتظار' : 'ملغى'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Lesson Content Modal */}
      <Modal
        isOpen={showLessonContentModal}
        onClose={() => setShowLessonContentModal(false)}
        title={currentLessonData?.title || 'محتوى الدرس'}
        size="xl"
      >
        <div className="h-full">
          {currentLessonData && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              {/* Files List */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-4 h-full">
                  <h4 className="font-semibold text-gray-900 mb-4">ملفات الدرس</h4>
                  
                  {!currentLessonData.files || currentLessonData.files.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">لا توجد ملفات في هذا الدرس</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentLessonData.files.map((file, index) => (
                        <div
                          key={file.id}
                          onClick={() => handleFileSelect(file as File)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            currentFile?.id === file.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
                              {getFileIcon(file.type || '')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.type || 'ملف'}
                              </p>
                            </div>
                            {currentFile?.id === file.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lesson Description */}
                  <div className="mt-6 p-4 bg-white rounded-lg border">
                    <h5 className="font-medium text-gray-900 mb-2">وصف الدرس</h5>
                    <p className="text-sm text-gray-600">
                      {currentLessonData.content || 'لا يوجد وصف للدرس'}
                    </p>
                  </div>

                  {/* Lesson Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {Math.round(currentLessonData.progress || 0)}%
                      </p>
                      <p className="text-xs text-gray-500">التقدم</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {currentLessonData.completedBy?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">مكتمل</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Viewer */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg border h-full">
                  {currentFile ? (
                    <div className="p-4 h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          {currentFile.name}
                        </h4>
                        <a
                          href={currentFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          تحميل
                        </a>
                      </div>
                      
                      <div className="h-full max-h-96 overflow-hidden">
                        <FileViewer
                          file={currentFile}
                          onProgress={handleFileProgress}
                          onComplete={handleFileComplete}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          اختر ملفاً لعرضه
                        </h3>
                        <p className="text-gray-600">
                          اختر ملفاً من القائمة على اليسار لعرض محتواه
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
} 