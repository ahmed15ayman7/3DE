'use client';

import { useState } from 'react';
import { Button, Card, Table, Input, Select, Badge, Avatar, Pagination } from '@3de/ui';
import  ChartBox from '../../components/ChartBox';

// Mock data للطلاب
const mockStudents = [
  {
    id: '1',
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    avatar: '/avatars/ahmed.jpg',
    courses: ['React الأساسيات', 'JavaScript المتقدم'],
    enrollmentDate: '2024-01-15',
    status: 'نشط',
    progress: 75,
    grade: 'A',
    attendanceRate: 92,
    lastActivity: '2024-01-20'
  },
  {
    id: '2',
    firstName: 'فاطمة',
    lastName: 'أحمد',
    email: 'fatima@example.com',
    phone: '+966502345678',
    avatar: '/avatars/fatima.jpg',
    courses: ['Python للمبتدئين', 'قواعد البيانات'],
    enrollmentDate: '2024-01-10',
    status: 'نشط',
    progress: 85,
    grade: 'A+',
    attendanceRate: 96,
    lastActivity: '2024-01-21'
  },
  {
    id: '3',
    firstName: 'محمد',
    lastName: 'عبدالله',
    email: 'mohammed@example.com',
    phone: '+966503456789',
    avatar: '/avatars/mohammed.jpg',
    courses: ['React المتقدم'],
    enrollmentDate: '2024-01-08',
    status: 'متوقف',
    progress: 45,
    grade: 'B',
    attendanceRate: 78,
    lastActivity: '2024-01-18'
  },
  {
    id: '4',
    firstName: 'نورا',
    lastName: 'سالم',
    email: 'nora@example.com',
    phone: '+966504567890',
    avatar: '/avatars/nora.jpg',
    courses: ['تطوير المواقع', 'UI/UX'],
    enrollmentDate: '2024-01-12',
    status: 'نشط',
    progress: 68,
    grade: 'B+',
    attendanceRate: 88,
    lastActivity: '2024-01-21'
  },
  {
    id: '5',
    firstName: 'خالد',
    lastName: 'العتيبي',
    email: 'khalid@example.com',
    phone: '+966505678901',
    avatar: '/avatars/khalid.jpg',
    courses: ['Node.js', 'MongoDB'],
    enrollmentDate: '2024-01-05',
    status: 'مكتمل',
    progress: 100,
    grade: 'A',
    attendanceRate: 94,
    lastActivity: '2024-01-19'
  }
];

const courseOptions = [
  { value: 'all', label: 'جميع الكورسات' },
  { value: 'react-basics', label: 'React الأساسيات' },
  { value: 'javascript-advanced', label: 'JavaScript المتقدم' },
  { value: 'python-beginners', label: 'Python للمبتدئين' },
  { value: 'databases', label: 'قواعد البيانات' },
  { value: 'react-advanced', label: 'React المتقدم' },
  { value: 'web-development', label: 'تطوير المواقع' },
  { value: 'ui-ux', label: 'UI/UX' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'mongodb', label: 'MongoDB' }
];

const statusOptions = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'متوقف' },
  { value: 'completed', label: 'مكتمل' }
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // إحصائيات الطلاب
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(student => student.status === 'نشط').length;
  const completedStudents = mockStudents.filter(student => student.status === 'مكتمل').length;
  const averageProgress = Math.round(mockStudents.reduce((sum, student) => sum + student.progress, 0) / totalStudents);

  // فلترة البيانات
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all';
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && student.status === 'نشط') ||
                         (selectedStatus === 'inactive' && student.status === 'متوقف') ||
                         (selectedStatus === 'completed' && student.status === 'مكتمل');
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  // تقسيم الصفحات
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // أعمدة الجدول
  const columns = [
    {
      key: 'student',
      header: 'الطالب',
      render: (value: any, student: any) => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={student.avatar}
            fallback={`${student.firstName} ${student.lastName}`}
            size="sm"
          />
          <div>
            <div className="font-medium text-gray-900">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'courses',
      header: 'الكورسات',
      render: (value: any, student: any) => (
        <div className="space-y-1">
          {student.courses.map((course: string, index: number) => (
            <Badge key={index} variant="secondary" size="sm">
              {course}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'progress',
      header: 'التقدم',
      render: (value: any, student: any) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-main h-2 rounded-full transition-all duration-300"
              style={{ width: `${student.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
        </div>
      )
    },
    {
      key: 'grade',
      header: 'الدرجة',
      render: (value: any, student: any) => (
        <Badge
          variant={
            student.grade === 'A+' || student.grade === 'A' ? 'success' :
            student.grade.startsWith('B') ? 'warning' : 'danger'
          }
        >
          {student.grade}
        </Badge>
      )
    },
    {
      key: 'attendance',
      header: 'نسبة الحضور',
      render: (value: any, student: any) => (
        <span className={`font-medium ${
          student.attendanceRate >= 90 ? 'text-green-600' :
          student.attendanceRate >= 80 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {student.attendanceRate}%
        </span>
      )
    },
    {
      key: 'status',
      header: 'الحالة',
      render: (value: any, student: any) => (
        <Badge
          variant={
            student.status === 'نشط' ? 'success' :
            student.status === 'مكتمل' ? 'info' : 'warning'
          }
        >
          {student.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      render: (value: any, student: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/students/${student.id}`, '_self')}
          >
            عرض
          </Button>
          <Button variant="ghost" size="sm">
            تواصل
          </Button>
        </div>
      )
    }
  ];

  // بيانات الرسوم البيانية
  const progressData = [
    { name: '0-25%', value: mockStudents.filter(s => s.progress < 25).length },
    { name: '25-50%', value: mockStudents.filter(s => s.progress >= 25 && s.progress < 50).length },
    { name: '50-75%', value: mockStudents.filter(s => s.progress >= 50 && s.progress < 75).length },
    { name: '75-100%', value: mockStudents.filter(s => s.progress >= 75).length }
  ];

  const statusData = [
    { name: 'نشط', value: activeStudents },
    { name: 'متوقف', value: mockStudents.filter(s => s.status === 'متوقف').length },
    { name: 'مكتمل', value: completedStudents }
  ];

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الطلاب</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            تصدير البيانات
          </Button>
          <Button variant="primary">
            إضافة طالب جديد
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="md" hover>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">👥</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">إجمالي الطلاب</div>
              <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">✅</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">الطلاب النشطين</div>
              <div className="text-2xl font-bold text-gray-900">{activeStudents}</div>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-sm">🎓</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">طلاب مكتملين</div>
              <div className="text-2xl font-bold text-gray-900">{completedStudents}</div>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-sm">📊</span>
              </div>
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium text-gray-500">متوسط التقدم</div>
              <div className="text-2xl font-bold text-gray-900">{averageProgress}%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox
          title="توزيع التقدم"
          type="pie"
          data={progressData as any}
          className="h-80"
        />
        <ChartBox
          title="حالة الطلاب"
          type="bar"
          data={statusData as any}
          className="h-80"
        />
      </div>

      {/* الفلاتر وأدوات البحث */}
      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="البحث عن طالب..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />
          <Select
            options={courseOptions}
            value={selectedCourse}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCourse('all');
              setSelectedStatus('all');
              setCurrentPage(1);
            }}
          >
            مسح الفلاتر
          </Button>
        </div>
      </Card>

      {/* جدول الطلاب */}
      <Card padding="none">
        <Table
          data={currentStudents}
          columns={columns}
          className="min-h-96"
        />
        
        {/* التصفح */}
        <div className="p-6 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            showTotalItems
          />
        </div>
      </Card>
    </div>
  );
} 