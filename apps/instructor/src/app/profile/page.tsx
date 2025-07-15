'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Progress, Tabs, Avatar } from '@3de/ui';
import ChartBox from '../../components/ChartBox';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data للملف الشخصي
  const profileData = {
    personal: {
      name: 'د. محمد أحمد',
      title: 'أستاذ مساعد',
      department: 'علوم الحاسوب',
      email: 'mohammed.ahmed@3de.edu',
      phone: '+966501234567',
      avatar: '👨‍🏫',
      bio: 'أستاذ مساعد في علوم الحاسوب مع خبرة 10 سنوات في التدريس والبحث العلمي. متخصص في البرمجة الكائنية وهندسة البرمجيات.',
      joinDate: '2020-09-01',
      location: 'الرياض، المملكة العربية السعودية',
      languages: ['العربية', 'الإنجليزية'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/mohammed-ahmed',
        github: 'https://github.com/mohammed-ahmed',
        website: 'https://mohammed-ahmed.edu'
      }
    },
    statistics: {
      totalStudents: 156,
      activeCourses: 8,
      completedCourses: 12,
      totalLessons: 95,
      averageRating: 4.8,
      totalRevenue: 185000,
      experienceYears: 10,
      certificates: 15
    },
    courses: [
      {
        id: '1',
        title: 'البرمجة المتقدمة',
        students: 45,
        rating: 4.9,
        status: 'نشط',
        startDate: '2024-01-15'
      },
      {
        id: '2',
        title: 'JavaScript للمبتدئين',
        students: 38,
        rating: 4.8,
        status: 'نشط',
        startDate: '2024-02-01'
      },
      {
        id: '3',
        title: 'React الأساسيات',
        students: 32,
        rating: 4.7,
        status: 'مكتمل',
        startDate: '2023-11-01'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'أفضل محاضر للعام',
        description: 'حصل على أعلى تقييم من الطلاب في 2023',
        date: '2023-12-15',
        icon: '🏆',
        category: 'تدريس'
      },
      {
        id: '2',
        title: 'محاضر الشهر',
        description: 'تقدير لجودة التدريس والتفاعل مع الطلاب',
        date: '2024-01-01',
        icon: '⭐',
        category: 'تدريس'
      },
      {
        id: '3',
        title: 'خبير البرمجة',
        description: 'إتمام 1000 ساعة تدريس في البرمجة',
        date: '2023-10-20',
        icon: '💻',
        category: 'تخصص'
      }
    ],
    certifications: [
      {
        id: '1',
        title: 'شهادة معتمد في React',
        issuer: 'Meta',
        date: '2023-08-15',
        level: 'متقدم'
      },
      {
        id: '2',
        title: 'شهادة JavaScript المتقدم',
        issuer: 'Google',
        date: '2023-06-10',
        level: 'متقدم'
      },
      {
        id: '3',
        title: 'شهادة في التعليم الإلكتروني',
        issuer: 'جامعة الملك سعود',
        date: '2022-12-05',
        level: 'متوسط'
      }
    ]
  };

  // بيانات الرسوم البيانية
  const monthlyStats = [
    { name: 'يناير', students: 120, revenue: 45000 },
    { name: 'فبراير', students: 135, revenue: 52000 },
    { name: 'مارس', students: 148, revenue: 58000 },
    { name: 'أبريل', students: 156, revenue: 62000 }
  ];

  const courseRatings = profileData.courses.map(course => ({
    name: course.title,
    value: course.rating,
    label: course.title
  }));

  const overviewTab = (
    <div className="space-y-6">
      {/* الإحصائيات الشخصية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-blue-600">{profileData.statistics.totalStudents}</div>
          <div className="text-sm text-gray-600">إجمالي الطلاب</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-green-600">{profileData.statistics.activeCourses}</div>
          <div className="text-sm text-gray-600">الكورسات النشطة</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-purple-600">{profileData.statistics.averageRating}</div>
          <div className="text-sm text-gray-600">متوسط التقييم</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{profileData.statistics.experienceYears}</div>
          <div className="text-sm text-gray-600">سنوات الخبرة</div>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox
          title="نمو الطلاب الشهري"
          type="line"
          data={monthlyStats.map(item => ({ name: item.name, value: item.students, label: item.name }))}
          className="h-80"
        />
        <ChartBox
          title="تقييمات الكورسات"
          type="bar"
          data={courseRatings}
          className="h-80"
        />
      </div>

      {/* نظرة سريعة على الكورسات */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الكورسات الحالية</h3>
        <div className="space-y-4">
          {profileData.courses.filter(c => c.status === 'نشط').map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-600">{course.students} طالب • بدأ في {course.startDate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{course.rating}</div>
                  <div className="text-xs text-gray-500">التقييم</div>
                </div>
                <Badge variant="success">{course.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const achievementsTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileData.achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card padding="lg" className="text-center h-full">
              <div className="text-4xl mb-4">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" size="sm">{achievement.category}</Badge>
                <span className="text-xs text-gray-500">{achievement.date}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const certificationsTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {profileData.certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                    <p className="text-sm text-gray-600">من {cert.issuer}</p>
                    <p className="text-xs text-gray-500">تاريخ الإصدار: {cert.date}</p>
                  </div>
                </div>
                <div className="text-center">
                  <Badge 
                    variant={
                      cert.level === 'متقدم' ? 'success' :
                      cert.level === 'متوسط' ? 'warning' : 'info'
                    }
                  >
                    {cert.level}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const aboutTab = (
    <div className="space-y-6">
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات شخصية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">الاسم الكامل</label>
              <p className="text-gray-900">{profileData.personal.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">المنصب</label>
              <p className="text-gray-900">{profileData.personal.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">القسم</label>
              <p className="text-gray-900">{profileData.personal.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">تاريخ الانضمام</label>
              <p className="text-gray-900">{profileData.personal.joinDate}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
              <p className="text-gray-900">{profileData.personal.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
              <p className="text-gray-900">{profileData.personal.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">الموقع</label>
              <p className="text-gray-900">{profileData.personal.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">اللغات</label>
              <div className="flex space-x-2">
                {profileData.personal.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" size="sm">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">نبذة تعريفية</h3>
        <p className="text-gray-700 leading-relaxed">{profileData.personal.bio}</p>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">روابط التواصل</h3>
        <div className="space-y-3">
          {Object.entries(profileData.personal.socialLinks).map(([platform, url]) => (
            <div key={platform} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {platform === 'linkedin' ? '💼' : 
                   platform === 'github' ? '💻' : '🌐'}
                </span>
                <span className="text-gray-900 capitalize">{platform}</span>
              </div>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                زيارة الرابط ↗
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const tabItems = [
    { id: 'overview', label: 'نظرة عامة', content: overviewTab, icon: '📊' },
    { id: 'achievements', label: 'الإنجازات', content: achievementsTab, icon: '🏆' },
    { id: 'certifications', label: 'الشهادات', content: certificationsTab, icon: '🎓' },
    { id: 'about', label: 'حولي', content: aboutTab, icon: '👤' }
  ];

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <Card padding="lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {profileData.personal.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profileData.personal.name}</h1>
              <p className="text-lg text-gray-600">{profileData.personal.title}</p>
              <p className="text-gray-500">{profileData.personal.department}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="success">متصل</Badge>
                <span className="text-sm text-gray-500">انضم منذ {profileData.personal.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              تحديث الصورة
            </Button>
            <Button variant="primary">
              تعديل الملف الشخصي
            </Button>
          </div>
        </div>
      </Card>

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
};

export default ProfilePage; 