'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, Badge, Avatar, Tabs, Progress } from '@3de/ui';
import ChartBox from '../../../components/ChartBox';

// Mock data للطالب
const mockStudent = {
  id: '1',
  firstName: 'أحمد',
  lastName: 'محمد',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  avatar: '/avatars/ahmed.jpg',
  bio: 'طالب متفوق في مجال البرمجة، لديه شغف كبير لتعلم التقنيات الحديثة ومهتم بتطوير تطبيقات الويب.',
  dateOfBirth: '1995-03-15',
  address: 'الرياض، المملكة العربية السعودية',
  enrollmentDate: '2024-01-15',
  status: 'نشط',
  overallProgress: 75,
  totalCourses: 4,
  completedCourses: 2,
  certificates: 3,
  badges: 8,
  courses: [
    {
      id: '1',
      title: 'React الأساسيات',
      progress: 95,
      grade: 'A',
      status: 'مكتمل',
      enrollmentDate: '2024-01-15',
      completionDate: '2024-02-15',
      instructor: 'د. علي أحمد',
      duration: '6 أسابيع',
      lessons: 24,
      quizzes: 8,
      assignments: 5
    },
    {
      id: '2',
      title: 'JavaScript المتقدم',
      progress: 80,
      grade: 'A',
      status: 'نشط',
      enrollmentDate: '2024-02-01',
      instructor: 'د. فاطمة سالم',
      duration: '8 أسابيع',
      lessons: 32,
      quizzes: 12,
      assignments: 8
    },
    {
      id: '3',
      title: 'Node.js و Express',
      progress: 45,
      grade: 'B+',
      status: 'نشط',
      enrollmentDate: '2024-03-01',
      instructor: 'م. خالد العتيبي',
      duration: '10 أسابيع',
      lessons: 40,
      quizzes: 15,
      assignments: 10
    },
    {
      id: '4',
      title: 'قواعد البيانات',
      progress: 30,
      grade: '-',
      status: 'نشط',
      enrollmentDate: '2024-03-15',
      instructor: 'د. نورا محمد',
      duration: '6 أسابيع',
      lessons: 20,
      quizzes: 8,
      assignments: 6
    }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'quiz_completed',
      title: 'اكمل اختبار JavaScript المتقدم - الوحدة 4',
      timestamp: '2024-01-21T10:30:00Z',
      score: 92,
      course: 'JavaScript المتقدم'
    },
    {
      id: '2',
      type: 'lesson_completed',
      title: 'انهى درس Async/Await في JavaScript',
      timestamp: '2024-01-21T09:15:00Z',
      course: 'JavaScript المتقدم'
    },
    {
      id: '3',
      type: 'assignment_submitted',
      title: 'سلم مشروع React Todo App',
      timestamp: '2024-01-20T16:45:00Z',
      course: 'React الأساسيات'
    },
    {
      id: '4',
      type: 'badge_earned',
      title: 'حصل على شارة "مطور React المبتدئ"',
      timestamp: '2024-01-20T14:20:00Z',
      badge: 'React Developer'
    },
    {
      id: '5',
      type: 'forum_post',
      title: 'شارك في نقاش حول أفضل ممارسات React',
      timestamp: '2024-01-19T11:30:00Z',
      course: 'React الأساسيات'
    }
  ],
  attendance: {
    total: 48,
    present: 44,
    absent: 2,
    late: 2,
    rate: 92
  },
  performance: {
    averageGrade: 'A-',
    quizzesCompleted: 28,
    assignmentsSubmitted: 15,
    projectsCompleted: 6,
    forumPosts: 23,
    studyHours: 156
  }
};

// Mock data للاختبارات الأخيرة
const recentQuizzes = [
  { name: 'JavaScript الأساسيات', score: 95, date: '2024-01-20' },
  { name: 'React Components', score: 88, date: '2024-01-18' },
  { name: 'CSS المتقدم', score: 92, date: '2024-01-15' },
  { name: 'HTML5', score: 89, date: '2024-01-12' }
];

// Mock data لتوزيع الدرجات
const gradeDistribution = [
  { name: 'A+', value: 8 },
  { name: 'A', value: 12 },
  { name: 'B+', value: 6 },
  { name: 'B', value: 2 },
  { name: 'C+', value: 0 }
];

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id;
  const [activeTab, setActiveTab] = useState('overview');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz_completed': return '📝';
      case 'lesson_completed': return '📚';
      case 'assignment_submitted': return '📤';
      case 'badge_earned': return '🏆';
      case 'forum_post': return '💬';
      default: return '📋';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabItems = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      content: (
        <div className="space-y-6">
          {/* الكورسات الحالية */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الكورسات المسجلة</h3>
            <div className="space-y-4">
              {mockStudent.courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-500">المحاضر: {course.instructor}</p>
                      <p className="text-sm text-gray-500">المدة: {course.duration} • {course.lessons} درس</p>
                    </div>
                    <Badge
                      variant={
                        course.status === 'مكتمل' ? 'success' :
                        course.status === 'نشط' ? 'info' : 'warning'
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>التقدم</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} variant="default" />
                    
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>الدرجة: {course.grade || 'غير محدد'}</span>
                      <span>الاختبارات: {course.quizzes} | المهام: {course.assignments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartBox
              title="درجات الاختبارات الأخيرة"
              type="bar"
              data={recentQuizzes.map(quiz => ({ name: quiz.name, value: quiz.score }))}
              className="h-80"
            />
            <ChartBox
              title="توزيع الدرجات"
              type="pie"
              data={gradeDistribution.map(grade => ({ name: grade.name, value: grade.value }))}
              className="h-80"
            />
          </div>
        </div>
      )
    },
    {
      id: 'activity',
      label: 'النشاط',
      content: (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
          <div className="space-y-4">
            {mockStudent.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                    {activity.score && (
                      <Badge variant="success" size="sm">
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                  {activity.course && (
                    <p className="text-xs text-blue-600 mt-1">{activity.course}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )
    },
    {
      id: 'performance',
      label: 'الأداء',
      content: (
        <div className="space-y-6">
          {/* إحصائيات الأداء */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="md">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{mockStudent.performance.averageGrade}</div>
                <div className="text-sm text-gray-500">متوسط الدرجات</div>
              </div>
            </Card>
            
            <Card padding="md">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{mockStudent.attendance.rate}%</div>
                <div className="text-sm text-gray-500">نسبة الحضور</div>
              </div>
            </Card>
            
            <Card padding="md">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{mockStudent.performance.studyHours}</div>
                <div className="text-sm text-gray-500">ساعات الدراسة</div>
              </div>
            </Card>
          </div>

          {/* تفاصيل الأداء */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الأداء</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">الاختبارات المكتملة</span>
                  <span className="font-medium">{mockStudent.performance.quizzesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المهام المسلمة</span>
                  <span className="font-medium">{mockStudent.performance.assignmentsSubmitted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المشاريع المكتملة</span>
                  <span className="font-medium">{mockStudent.performance.projectsCompleted}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">مشاركات المنتدى</span>
                  <span className="font-medium">{mockStudent.performance.forumPosts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الشارات المكتسبة</span>
                  <span className="font-medium">{mockStudent.badges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الشهادات</span>
                  <span className="font-medium">{mockStudent.certificates}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* سجل الحضور */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">سجل الحضور</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mockStudent.attendance.present}</div>
                <div className="text-sm text-gray-600">حاضر</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{mockStudent.attendance.absent}</div>
                <div className="text-sm text-gray-600">غائب</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{mockStudent.attendance.late}</div>
                <div className="text-sm text-gray-600">متأخر</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockStudent.attendance.total}</div>
                <div className="text-sm text-gray-600">إجمالي الحصص</div>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          <Avatar
            src={mockStudent.avatar}
            fallback={`${mockStudent.firstName} ${mockStudent.lastName}`}
            size="xl"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mockStudent.firstName} {mockStudent.lastName}
            </h1>
            <p className="text-gray-600">{mockStudent.email}</p>
            <p className="text-gray-600">{mockStudent.phone}</p>
            <div className="flex items-center space-x-3 mt-2">
              <Badge
                variant={mockStudent.status === 'نشط' ? 'success' : 'warning'}
              >
                {mockStudent.status}
              </Badge>
              <span className="text-sm text-gray-500">
                انضم في {new Date(mockStudent.enrollmentDate).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            إرسال رسالة
          </Button>
          <Button variant="primary">
            تعديل الملف الشخصي
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">📊</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">التقدم الإجمالي</div>
              <div className="text-2xl font-bold text-gray-900">{mockStudent.overallProgress}%</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">📚</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">الكورسات المكتملة</div>
              <div className="text-2xl font-bold text-gray-900">{mockStudent.completedCourses}/{mockStudent.totalCourses}</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-sm">🎓</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">الشهادات</div>
              <div className="text-2xl font-bold text-gray-900">{mockStudent.certificates}</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-sm">🏆</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">الشارات</div>
              <div className="text-2xl font-bold text-gray-900">{mockStudent.badges}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* التبويبات */}
      <Card padding="none">
        <Tabs
          items={tabItems}
          defaultActiveTab="overview"
          onTabChange={setActiveTab}
          className="p-6"
        />
      </Card>
    </div>
  );
} 