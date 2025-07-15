'use client';

import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { RightSidebar } from '../components/RightSidebar';

// Mock data for demonstration
const mockCourses = [
  {
    id: '1',
    title: 'البرمجة المتقدمة',
    students: 45,
    lessons: 12,
    progress: 78,
    status: 'active',
    image: '💻'
  },
  {
    id: '2',
    title: 'قواعد البيانات',
    students: 38,
    lessons: 10,
    progress: 65,
    status: 'active',
    image: '🗄️'
  },
  {
    id: '3',
    title: 'الخوارزميات',
    students: 52,
    lessons: 15,
    progress: 82,
    status: 'active',
    image: '🧮'
  },
  {
    id: '4',
    title: 'تطوير المواقع',
    students: 29,
    lessons: 8,
    progress: 45,
    status: 'draft',
    image: '🌐'
  }
];

const mockStudents = [
  {
    id: '1',
    name: 'أحمد محمد',
    course: 'البرمجة المتقدمة',
    progress: 85,
    status: 'active',
    lastSeen: 'منذ 5 دقائق',
    avatar: 'أ'
  },
  {
    id: '2',
    name: 'فاطمة علي',
    course: 'قواعد البيانات',
    progress: 92,
    status: 'active',
    lastSeen: 'منذ ساعة',
    avatar: 'ف'
  },
  {
    id: '3',
    name: 'محمد سعد',
    course: 'الخوارزميات',
    progress: 78,
    status: 'inactive',
    lastSeen: 'منذ 3 أيام',
    avatar: 'م'
  },
  {
    id: '4',
    name: 'نورا أحمد',
    course: 'البرمجة المتقدمة',
    progress: 95,
    status: 'active',
    lastSeen: 'منذ 15 دقيقة',
    avatar: 'ن'
  }
];

const mockQuizzes = [
  {
    id: '1',
    title: 'اختبار البرمجة الكائنية',
    course: 'البرمجة المتقدمة',
    students: 45,
    completed: 32,
    averageScore: 78,
    status: 'active',
    dueDate: 'اليوم 11:59 م'
  },
  {
    id: '2',
    title: 'اختبار SQL المتقدم',
    course: 'قواعد البيانات',
    students: 38,
    completed: 38,
    averageScore: 85,
    status: 'completed',
    dueDate: 'أمس'
  },
  {
    id: '3',
    title: 'اختبار الترتيب والبحث',
    course: 'الخوارزميات',
    students: 52,
    completed: 15,
    averageScore: 0,
    status: 'upcoming',
    dueDate: 'غداً 2:00 م'
  }
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="mr-1">
              {changeType === 'increase' ? '↗️' : '↘️'}
            </span>
            {change}
          </div>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: typeof mockCourses[0];
}

function CourseCard({ course }: CourseCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{course.image}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.lessons} درس • {course.students} طالب</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[course.status as keyof typeof statusColors]}`}>
          {course.status === 'active' ? 'نشط' : course.status === 'draft' ? 'مسودة' : 'مكتمل'}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>التقدم</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-main h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm">
          عرض التفاصيل
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          تعديل
        </button>
      </div>
    </div>
  );
}

interface StudentRowProps {
  student: typeof mockStudents[0];
}

function StudentRow({ student }: StudentRowProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-main rounded-full flex items-center justify-center text-white font-medium">
            {student.avatar}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.course}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
            <div 
              className="bg-primary-main h-2 rounded-full"
              style={{ width: `${student.progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-900 min-w-12">{student.progress}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[student.status as keyof typeof statusColors]}`}>
          {student.status === 'active' ? 'نشط' : 'غير نشط'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {student.lastSeen}
      </td>
    </tr>
  );
}

interface QuizCardProps {
  quiz: typeof mockQuizzes[0];
}

function QuizCard({ quiz }: QuizCardProps) {
  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    upcoming: 'bg-yellow-100 text-yellow-800'
  };

  const statusText = {
    active: 'جاري',
    completed: 'مكتمل',
    upcoming: 'قريباً'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
          <p className="text-sm text-gray-500">{quiz.course}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[quiz.status as keyof typeof statusColors]}`}>
          {statusText[quiz.status as keyof typeof statusText]}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">الطلاب المشتركين:</span>
          <span className="font-medium">{quiz.students}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">المكتملين:</span>
          <span className="font-medium">{quiz.completed}</span>
        </div>
        {quiz.status !== 'upcoming' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">متوسط الدرجات:</span>
            <span className="font-medium">{quiz.averageScore}%</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">الموعد النهائي:</span>
          <span className="font-medium text-red-600">{quiz.dueDate}</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm">
        عرض النتائج
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="إجمالي الطلاب"
              value="156"
              change="+12% من الشهر الماضي"
              changeType="increase"
              icon="👥"
            />
            <StatCard
              title="الكورسات النشطة"
              value="8"
              change="+2 كورس جديد"
              changeType="increase"
              icon="📚"
            />
            <StatCard
              title="الاختبارات المكتملة"
              value="45"
              change="+8 هذا الأسبوع"
              changeType="increase"
              icon="📝"
            />
            <StatCard
              title="نسبة النجاح"
              value="85%"
              change="+3% من الشهر الماضي"
              changeType="increase"
              icon="📈"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Courses Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">الكورسات الحالية</h2>
                <button className="bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  إضافة كورس جديد
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* Active Quizzes */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">الاختبارات النشطة</h2>
              <div className="space-y-4">
                {mockQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">أحدث نشاط الطلاب</h2>
                <button className="text-primary-main hover:text-primary-dark text-sm">
                  عرض الكل
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطالب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التقدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      آخر ظهور
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockStudents.map((student) => (
                    <StudentRow key={student.id} student={student} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <RightSidebar />
    </div>
  );
}
