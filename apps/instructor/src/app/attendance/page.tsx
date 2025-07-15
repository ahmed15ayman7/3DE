'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Select } from '@3de/ui';

// Types
interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  course: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  student: Student;
  date: string;
  lesson: string;
  status: 'present' | 'absent' | 'late';
  method?: 'manual' | 'qr_code' | 'face_recognition';
  timestamp?: string;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    course: 'الرياضيات المتقدمة',
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    course: 'الفيزياء العامة',
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '3',
    name: 'محمد أحمد',
    email: 'mohammed@example.com',
    course: 'البرمجة للمبتدئين',
    avatar: '/api/placeholder/40/40',
  },
  {
    id: '4',
    name: 'سارة خالد',
    email: 'sara@example.com',
    course: 'الكيمياء الأساسية',
    avatar: '/api/placeholder/40/40',
  },
];

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    student: mockStudents[0],
    date: '2024-01-20',
    lesson: 'الدرس الأول - مقدمة في الجبر',
    status: 'present',
    method: 'qr_code',
    timestamp: '09:15',
  },
  {
    id: '2',
    studentId: '2',
    student: mockStudents[1],
    date: '2024-01-20',
    lesson: 'الدرس الأول - قوانين نيوتن',
    status: 'late',
    method: 'manual',
    timestamp: '09:25',
  },
  {
    id: '3',
    studentId: '3',
    student: mockStudents[2],
    date: '2024-01-20',
    lesson: 'الدرس الأول - أساسيات البرمجة',
    status: 'absent',
  },
];

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Filter data based on selected filters
  const filteredData = attendanceData.filter(record => {
    const matchesDate = record.date === selectedDate;
    const matchesCourse = selectedCourse === 'all' || record.student.course === selectedCourse;
    const matchesSearch = record.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.lesson.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesCourse && matchesSearch;
  });

  // Calculate statistics
  const totalStudents = filteredData.length;
  const presentStudents = filteredData.filter(r => r.status === 'present').length;
  const absentStudents = filteredData.filter(r => r.status === 'absent').length;
  const lateStudents = filteredData.filter(r => r.status === 'late').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

  const courses = [
    { value: 'all', label: 'جميع الكورسات' },
    { value: 'الرياضيات المتقدمة', label: 'الرياضيات المتقدمة' },
    { value: 'الفيزياء العامة', label: 'الفيزياء العامة' },
    { value: 'البرمجة للمبتدئين', label: 'البرمجة للمبتدئين' },
    { value: 'الكيمياء الأساسية', label: 'الكيمياء الأساسية' },
  ];

  const handleAttendanceChange = (recordId: string, newStatus: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, status: newStatus, timestamp: newStatus === 'present' ? new Date().toLocaleTimeString() : undefined }
          : record
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'حاضر';
      case 'absent':
        return 'غائب';
      case 'late':
        return 'متأخر';
      default:
        return 'غير محدد';
    }
  };

  const StatusBadge = ({ status, onClick, interactive = false }: any) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)} ${
        interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
      onClick={onClick}
    >
      {getStatusText(status)}
    </span>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الحضور والغياب</h1>
          <p className="text-gray-600">تتبع وإدارة حضور الطلاب في الدروس</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>إضافة حضور يدوي</Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الطلاب</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الحاضرين</p>
              <p className="text-2xl font-bold text-green-600">{presentStudents}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الغائبين</p>
              <p className="text-2xl font-bold text-red-600">{absentStudents}</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">نسبة الحضور</p>
              <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-custom border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="date"
            label="التاريخ"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          
          <Select
            label="الكورس"
            options={courses}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          />

          <Input
            placeholder="البحث عن طالب أو درس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />

          <Select
            label="طريقة العرض"
            options={[
              { value: 'daily', label: 'يومي' },
              { value: 'weekly', label: 'أسبوعي' },
              { value: 'monthly', label: 'شهري' },
            ]}
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-custom border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">سجل الحضور - {selectedDate}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطالب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكورس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدرس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الوقت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطريقة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {record.student.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.lesson}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.timestamp || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.method === 'qr_code' && '📱 QR كود'}
                    {record.method === 'face_recognition' && '👤 التعرف على الوجه'}
                    {record.method === 'manual' && '✋ يدوي'}
                    {!record.method && '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceChange(record.id, 'present')}
                        className={`px-3 py-1 rounded-full text-xs ${
                          record.status === 'present' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                        } transition-colors`}
                      >
                        حاضر
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(record.id, 'late')}
                        className={`px-3 py-1 rounded-full text-xs ${
                          record.status === 'late' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
                        } transition-colors`}
                      >
                        متأخر
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(record.id, 'absent')}
                        className={`px-3 py-1 rounded-full text-xs ${
                          record.status === 'absent' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                        } transition-colors`}
                      >
                        غائب
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد سجلات حضور</h3>
            <p className="text-gray-600">
              لا توجد سجلات حضور للتاريخ والفلاتر المحددة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage; 