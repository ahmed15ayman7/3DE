'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Avatar, Tabs, Progress, Modal, Input, Textarea } from '@3de/ui';
import { useInstructorCourses, useCourseStudents, useCreatePost } from '../../../hooks/useInstructorQueries';
import ChartBox from '../../../components/ChartBox';

// Mock data للكورس
const mockCourse = {
  id: '1',
  title: 'البرمجة المتقدمة',
  description: 'كورس شامل في البرمجة الكائنية وأنماط التصميم باستخدام JavaScript و TypeScript',
  image: '💻',
  instructor: 'د. محمد أحمد',
  startDate: '2024-01-15',
  endDate: '2024-04-15',
  duration: '12 أسبوع',
  level: 'متقدم',
  status: 'نشط',
  price: 1200,
  studentsCount: 45,
  lessonsCount: 24,
  quizzesCount: 8,
  progress: 78,
  completionRate: 85,
  averageGrade: 'A-',
  category: 'برمجة',
  prerequisites: ['أساسيات JavaScript', 'HTML & CSS'],
  learningOutcomes: [
    'فهم مبادئ البرمجة الكائنية',
    'تطبيق أنماط التصميم المختلفة',
    'كتابة كود TypeScript متقدم',
    'بناء تطبيقات معقدة بنمط MVC'
  ],
  students: [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      avatar: '🧑‍💻',
      progress: 85,
      grade: 'A',
      lastActivity: '2024-01-21',
      status: 'نشط',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      avatar: '👩‍💻',
      progress: 92,
      grade: 'A+',
      lastActivity: '2024-01-21',
      status: 'نشط',
      joinDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'محمد سعد',
      email: 'mohammed@example.com',
      avatar: '👨‍💻',
      progress: 76,
      grade: 'B+',
      lastActivity: '2024-01-20',
      status: 'نشط',
      joinDate: '2024-01-16'
    }
  ],
  lessons: [
    {
      id: '1',
      title: 'مقدمة في البرمجة الكائنية',
      description: 'تعرف على المفاهيم الأساسية للبرمجة الكائنية',
      duration: '45 دقيقة',
      type: 'video',
      completedStudents: 40,
      status: 'منشور',
      publishDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'الكلاسات والكائنات',
      description: 'كيفية إنشاء واستخدام الكلاسات والكائنات',
      duration: '60 دقيقة',
      type: 'video',
      completedStudents: 38,
      status: 'منشور',
      publishDate: '2024-01-17'
    },
    {
      id: '3',
      title: 'الوراثة والتغليف',
      description: 'المبادئ المتقدمة في البرمجة الكائنية',
      duration: '50 دقيقة',
      type: 'video',
      completedStudents: 35,
      status: 'منشور',
      publishDate: '2024-01-20'
    }
  ],
  quizzes: [
    {
      id: '1',
      title: 'اختبار البرمجة الكائنية',
      questions: 15,
      duration: 60,
      attempts: 42,
      averageScore: 78,
      status: 'منشور',
      dueDate: '2024-01-25'
    },
    {
      id: '2',
      title: 'اختبار الكلاسات والكائنات',
      questions: 12,
      duration: 45,
      attempts: 38,
      averageScore: 85,
      status: 'منشور',
      dueDate: '2024-01-30'
    }
  ],
  announcements: [
    {
      id: '1',
      title: 'تحديث جدول المحاضرات',
      content: 'تم تحديث جدول المحاضرات للأسبوع القادم',
      date: '2024-01-21',
      urgent: false
    },
    {
      id: '2',
      title: 'اختبار نصف الفصل',
      content: 'موعد اختبار نصف الفصل يوم الأحد القادم',
      date: '2024-01-20',
      urgent: true
    }
  ]
};

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    urgent: false
  });

  const createPostMutation = useCreatePost();

  const handleCreateAnnouncement = async () => {
    try {
      await createPostMutation.mutateAsync({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        urgent: newAnnouncement.urgent
      });
      setNewAnnouncement({ title: '', content: '', urgent: false });
      setIsAnnouncementModalOpen(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  // بيانات الرسوم البيانية
  const progressData = mockCourse.students.map(student => ({
    name: student.name,
    value: student.progress,
    label: student.name
  }));

  const gradeDistribution = [
    { name: 'A+', value: mockCourse.students.filter(s => s.grade === 'A+').length },
    { name: 'A', value: mockCourse.students.filter(s => s.grade === 'A').length },
    { name: 'A-', value: mockCourse.students.filter(s => s.grade === 'A-').length },
    { name: 'B+', value: mockCourse.students.filter(s => s.grade === 'B+').length },
    { name: 'B', value: mockCourse.students.filter(s => s.grade === 'B').length }
  ];

  const overviewTab = (
    <div className="space-y-6">
      {/* معلومات الكورس الأساسية */}
      <Card padding="lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{mockCourse.image}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{mockCourse.title}</h2>
              <p className="text-gray-600 mb-4 max-w-2xl">{mockCourse.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📅 {mockCourse.startDate} - {mockCourse.endDate}</span>
                <span>⏱️ {mockCourse.duration}</span>
                <span>📊 {mockCourse.level}</span>
                <span>💰 {mockCourse.price} ريال</span>
              </div>
            </div>
          </div>
          <Badge 
            variant={mockCourse.status === 'نشط' ? 'success' : 'warning'}
            size="lg"
          >
            {mockCourse.status}
          </Badge>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{mockCourse.studentsCount}</div>
            <div className="text-sm text-gray-600">طالب مسجل</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{mockCourse.progress}%</div>
            <div className="text-sm text-gray-600">نسبة التقدم</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{mockCourse.lessonsCount}</div>
            <div className="text-sm text-gray-600">عدد الدروس</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{mockCourse.averageGrade}</div>
            <div className="text-sm text-gray-600">متوسط الدرجات</div>
          </div>
        </div>
      </Card>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox
          title="تقدم الطلاب"
          type="bar"
          data={progressData}
          className="h-80"
        />
        <ChartBox
          title="توزيع الدرجات"
          type="pie"
          data={gradeDistribution as any}
          className="h-80"
        />
      </div>

      {/* أهداف التعلم */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أهداف التعلم</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCourse.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">{outcome}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* المتطلبات المسبقة */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المتطلبات المسبقة</h3>
        <div className="flex flex-wrap gap-2">
          {mockCourse.prerequisites.map((prerequisite, index) => (
            <Badge key={index} variant="secondary">
              {prerequisite}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );

  const studentsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          الطلاب المسجلين ({mockCourse.studentsCount})
        </h3>
        <Button variant="outline">تصدير قائمة الطلاب</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockCourse.students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {student.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{student.name}</h4>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-xs text-gray-500">انضم في {student.joinDate}</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{student.progress}%</div>
                <div className="text-sm text-gray-500">التقدم</div>
                <Progress value={student.progress} size="sm" className="w-20 mt-2" />
              </div>
              
              <div className="text-center">
                <Badge 
                  variant={
                    student.grade === 'A+' || student.grade === 'A' ? 'success' :
                    student.grade.startsWith('B') ? 'warning' : 'info'
                  }
                >
                  {student.grade}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">آخر نشاط: {student.lastActivity}</p>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/students/${student.id}`)}
                >
                  عرض الملف
                </Button>
                <Button size="sm" variant="ghost">
                  إرسال رسالة
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const lessonsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          الدروس ({mockCourse.lessonsCount})
        </h3>
        <Button>إضافة درس جديد</Button>
      </div>

      <div className="space-y-4">
        {mockCourse.lessons.map((lesson, index) => (
          <Card key={lesson.id} padding="lg" hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                    <span>⏱️ {lesson.duration}</span>
                    <span>📹 {lesson.type}</span>
                    <span>👥 {lesson.completedStudents} طالب أكمل</span>
                    <span>📅 {lesson.publishDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge 
                  variant={lesson.status === 'منشور' ? 'success' : 'warning'}
                  size="sm"
                >
                  {lesson.status}
                </Badge>
                <Button size="sm" variant="outline">تعديل</Button>
                <Button size="sm" variant="ghost">عرض</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const quizzesTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          الاختبارات ({mockCourse.quizzesCount})
        </h3>
        <Button onClick={() => router.push('/quizzes/new')}>
          إنشاء اختبار جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCourse.quizzes.map((quiz) => (
          <Card key={quiz.id} padding="lg" hover>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                <Badge 
                  variant={quiz.status === 'منشور' ? 'success' : 'warning'}
                  size="sm"
                >
                  {quiz.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>عدد الأسئلة:</span>
                  <span>{quiz.questions}</span>
                </div>
                <div className="flex justify-between">
                  <span>مدة الاختبار:</span>
                  <span>{quiz.duration} دقيقة</span>
                </div>
                <div className="flex justify-between">
                  <span>المحاولات:</span>
                  <span>{quiz.attempts}</span>
                </div>
                <div className="flex justify-between">
                  <span>متوسط الدرجات:</span>
                  <span className="font-medium">{quiz.averageScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>الموعد النهائي:</span>
                  <span className="text-red-600">{quiz.dueDate}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <Button size="sm" variant="outline" className="flex-1">
                  عرض النتائج
                </Button>
                <Button size="sm" variant="ghost">
                  تعديل
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const announcementsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">الإعلانات</h3>
        <Button onClick={() => setIsAnnouncementModalOpen(true)}>
          إضافة إعلان جديد
        </Button>
      </div>

      <div className="space-y-4">
        {mockCourse.announcements.map((announcement) => (
          <Card key={announcement.id} padding="lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                  {announcement.urgent && (
                    <Badge variant="danger" size="sm">عاجل</Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{announcement.content}</p>
                <p className="text-sm text-gray-500">{announcement.date}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">تعديل</Button>
                <Button size="sm" variant="ghost">حذف</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const tabItems = [
    { id: 'overview', label: 'نظرة عامة', content: overviewTab, icon: '📊' },
    { id: 'students', label: 'الطلاب', content: studentsTab, icon: '👥' },
    { id: 'lessons', label: 'الدروس', content: lessonsTab, icon: '📚' },
    { id: 'quizzes', label: 'الاختبارات', content: quizzesTab, icon: '📝' },
    { id: 'announcements', label: 'الإعلانات', content: announcementsTab, icon: '📢' }
  ];

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            ← العودة
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الكورس</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            معاينة الكورس
          </Button>
          <Button variant="outline">
            تعديل الكورس
          </Button>
          <Button variant="primary">
            إعدادات الكورس
          </Button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <Card padding="none">
        <Tabs
          items={tabItems}
          defaultActiveTab="overview"
          onTabChange={setActiveTab}
          className="p-6"
        />
      </Card>

      {/* Modal لإضافة إعلان */}
      <Modal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        title="إضافة إعلان جديد"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="عنوان الإعلان *"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            placeholder="أدخل عنوان الإعلان"
          />

          <Textarea
            label="محتوى الإعلان *"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
            placeholder="أدخل محتوى الإعلان"
            rows={4}
          />

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="urgent"
              checked={newAnnouncement.urgent}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, urgent: e.target.checked }))}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
              إعلان عاجل
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAnnouncementModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateAnnouncement}
              disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
              loading={createPostMutation.isPending}
            >
              نشر الإعلان
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetailPage; 