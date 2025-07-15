'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { RightSidebar } from '../../components/RightSidebar';
import { BarChart, PieChart } from '../../components/ChartBox';

// Mock data for courses
const mockCourses = [
  {
    id: '1',
    title: 'البرمجة المتقدمة',
    description: 'كورس شامل في البرمجة الكائنية وأنماط التصميم',
    students: 45,
    lessons: 12,
    progress: 78,
    status: 'active',
    image: '💻',
    rating: 4.8,
    category: 'برمجة',
    difficulty: 'متقدم',
    duration: '12 أسبوع',
    price: 500
  },
  {
    id: '2',
    title: 'قواعد البيانات',
    description: 'تعلم SQL و NoSQL وتصميم قواعد البيانات',
    students: 38,
    lessons: 10,
    progress: 65,
    status: 'active',
    image: '🗄️',
    rating: 4.6,
    category: 'قواعد البيانات',
    difficulty: 'متوسط',
    duration: '8 أسابيع',
    price: 400
  },
  {
    id: '3',
    title: 'الخوارزميات',
    description: 'خوارزميات الترتيب والبحث وتحليل التعقد',
    students: 52,
    lessons: 15,
    progress: 82,
    status: 'active',
    image: '🧮',
    rating: 4.9,
    category: 'خوارزميات',
    difficulty: 'متقدم',
    duration: '10 أسابيع',
    price: 600
  },
  {
    id: '4',
    title: 'تطوير المواقع',
    description: 'HTML, CSS, JavaScript و React.js',
    students: 29,
    lessons: 8,
    progress: 45,
    status: 'draft',
    image: '🌐',
    rating: 4.5,
    category: 'تطوير ويب',
    difficulty: 'مبتدئ',
    duration: '6 أسابيع',
    price: 350
  },
  {
    id: '5',
    title: 'الذكاء الاصطناعي',
    description: 'مقدمة في ML و Deep Learning',
    students: 67,
    lessons: 20,
    progress: 92,
    status: 'active',
    image: '🤖',
    rating: 4.7,
    category: 'ذكاء اصطناعي',
    difficulty: 'متقدم',
    duration: '16 أسبوع',
    price: 800
  },
  {
    id: '6',
    title: 'أمن المعلومات',
    description: 'أساسيات الأمان والحماية السيبرانية',
    students: 34,
    lessons: 14,
    progress: 55,
    status: 'completed',
    image: '🔒',
    rating: 4.4,
    category: 'أمن معلومات',
    difficulty: 'متوسط',
    duration: '12 أسبوع',
    price: 550
  }
];

interface CourseCardProps {
  course: typeof mockCourses[0];
  onEdit: (course: typeof mockCourses[0]) => void;
  onDelete: (courseId: string) => void;
  onViewStudents: (courseId: string) => void;
}

function CourseCard({ course, onEdit, onDelete, onViewStudents }: CourseCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const difficultyColors = {
    'مبتدئ': 'bg-green-100 text-green-800',
    'متوسط': 'bg-yellow-100 text-yellow-800',
    'متقدم': 'bg-red-100 text-red-800'
  };

  const statusText = {
    active: 'نشط',
    draft: 'مسودة',
    completed: 'مكتمل'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{course.image}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{course.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📚 {course.lessons} درس</span>
                <span>👥 {course.students} طالب</span>
                <span>⏰ {course.duration}</span>
                <span>💰 {course.price} ريال</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[course.status as keyof typeof statusColors]}`}>
              {statusText[course.status as keyof typeof statusText]}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${difficultyColors[course.difficulty as keyof typeof difficultyColors]}`}>
              {course.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{course.progress}%</div>
            <div className="text-xs text-gray-500">التقدم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{course.rating}</div>
            <div className="text-xs text-gray-500">التقييم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{Math.round(course.students * 0.85)}</div>
            <div className="text-xs text-gray-500">نشط</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>تقدم الكورس</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-main h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewStudents(course.id)}
            className="flex-1 bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            عرض الطلاب
          </button>
          <button
            onClick={() => onEdit(course)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            تعديل
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['الكل', 'برمجة', 'قواعد البيانات', 'خوارزميات', 'تطوير ويب', 'ذكاء اصطناعي', 'أمن معلومات'];
  const statuses = ['الكل', 'نشط', 'مسودة', 'مكتمل'];

  const filteredCourses = mockCourses.filter(course => {
    const categoryMatch = selectedCategory === 'الكل' || course.category === selectedCategory;
    const statusMatch = selectedStatus === 'الكل' || 
      (selectedStatus === 'نشط' && course.status === 'active') ||
      (selectedStatus === 'مسودة' && course.status === 'draft') ||
      (selectedStatus === 'مكتمل' && course.status === 'completed');
    const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && statusMatch && searchMatch;
  });

  // Chart data
  const courseStats = [
    { label: 'نشط', value: mockCourses.filter(c => c.status === 'active').length },
    { label: 'مسودة', value: mockCourses.filter(c => c.status === 'draft').length },
    { label: 'مكتمل', value: mockCourses.filter(c => c.status === 'completed').length }
  ];

  const categoryStats = categories.slice(1).map(category => ({
    label: category,
    value: mockCourses.filter(c => c.category === category).length
  }));

  const handleEditCourse = (course: typeof mockCourses[0]) => {
    // Navigate to edit page or open modal
    console.log('Edit course:', course.id);
  };

  const handleDeleteCourse = (courseId: string) => {
    // Show confirmation and delete
    console.log('Delete course:', courseId);
  };

  const handleViewStudents = (courseId: string) => {
    // Navigate to students page for this course
    console.log('View students for course:', courseId);
  };

  const handleCreateCourse = () => {
    // Navigate to create course page
    console.log('Create new course');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الكورسات</h1>
              <p className="text-gray-600 mt-1">إدارة وتتبع جميع الكورسات التعليمية</p>
            </div>
            <button
              onClick={handleCreateCourse}
              className="bg-primary-main text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <span>➕</span>
              <span>إضافة كورس جديد</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الكورسات</p>
                  <p className="text-3xl font-bold text-gray-900">{mockCourses.length}</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                  <p className="text-3xl font-bold text-gray-900">{mockCourses.reduce((sum, c) => sum + c.students, 0)}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">متوسط التقييم</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(mockCourses.reduce((sum, c) => sum + c.rating, 0) / mockCourses.length).toFixed(1)}
                  </p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold text-gray-900">{(mockCourses.reduce((sum, c) => sum + (c.price * c.students), 0) / 1000).toFixed(0)}K</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieChart
              data={courseStats}
              title="توزيع حالة الكورسات"
            />
            <BarChart
              data={categoryStats}
              title="الكورسات حسب الفئة"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="البحث في الكورسات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('الكل');
                    setSelectedStatus('الكل');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onViewStudents={handleViewStudents}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد كورسات</h3>
              <p className="text-gray-600 mb-4">لم يتم العثور على كورسات تطابق معايير البحث</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('الكل');
                  setSelectedStatus('الكل');
                }}
                className="text-primary-main hover:text-primary-dark"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          )}
        </main>
      </div>

      <RightSidebar />
    </div>
  );
} 