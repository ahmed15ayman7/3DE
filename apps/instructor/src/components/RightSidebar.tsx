'use client';

import React from 'react';

interface QuickStat {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
}

interface RecentActivity {
  id: string;
  student: string;
  action: string;
  course: string;
  time: string;
  avatar: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  type: 'quiz' | 'lesson' | 'meeting';
  icon: string;
}

const quickStats: QuickStat[] = [
  {
    id: '1',
    label: 'إجمالي الطلاب',
    value: '156',
    change: '+12%',
    changeType: 'increase',
    icon: '👥'
  },
  {
    id: '2',
    label: 'الكورسات النشطة',
    value: '8',
    change: '+2',
    changeType: 'increase',
    icon: '📚'
  },
  {
    id: '3',
    label: 'نسبة الإنجاز',
    value: '78%',
    change: '+5%',
    changeType: 'increase',
    icon: '📈'
  },
  {
    id: '4',
    label: 'التقييم العام',
    value: '4.8',
    change: '+0.2',
    changeType: 'increase',
    icon: '⭐'
  }
];

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    student: 'أحمد محمد',
    action: 'أكمل اختبار',
    course: 'البرمجة المتقدمة',
    time: 'منذ 5 دقائق',
    avatar: 'أ'
  },
  {
    id: '2',
    student: 'فاطمة علي',
    action: 'سلمت واجب',
    course: 'قواعد البيانات',
    time: 'منذ 15 دقيقة',
    avatar: 'ف'
  },
  {
    id: '3',
    student: 'محمد سعد',
    action: 'شاهد درس',
    course: 'الخوارزميات',
    time: 'منذ 30 دقيقة',
    avatar: 'م'
  },
  {
    id: '4',
    student: 'نورا أحمد',
    action: 'طرحت سؤال',
    course: 'البرمجة المتقدمة',
    time: 'منذ ساعة',
    avatar: 'ن'
  }
];

const upcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'اختبار الخوارزميات',
    time: 'اليوم 2:00 م',
    type: 'quiz',
    icon: '📝'
  },
  {
    id: '2',
    title: 'درس قواعد البيانات',
    time: 'غداً 10:00 ص',
    type: 'lesson',
    icon: '📚'
  },
  {
    id: '3',
    title: 'اجتماع أولياء الأمور',
    time: 'الأحد 4:00 م',
    type: 'meeting',
    icon: '👥'
  }
];

interface RightSidebarProps {
  className?: string;
}

export function RightSidebar({ className = '' }: RightSidebarProps) {
  const getChangeColor = (changeType: QuickStat['changeType']) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType: QuickStat['changeType']) => {
    switch (changeType) {
      case 'increase':
        return '↗️';
      case 'decrease':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <div className={`
      w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto
      ${className}
    `}>
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
          <div className="space-y-4">
            {quickStats.map((stat) => (
              <div
                key={stat.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                    <span className="mr-1">{getChangeIcon(stat.changeType)}</span>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-main rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.student}</span>
                    {' '}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.course}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-sm text-primary-main hover:text-primary-dark mt-3">
            عرض المزيد
          </button>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الأحداث القادمة</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-main transition-colors"
              >
                <span className="text-xl">{event.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
          <div className="space-y-2">
            <button className="w-full text-right px-4 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors">
              <span className="mr-2">➕</span>
              إضافة اختبار جديد
            </button>
            <button className="w-full text-right px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <span className="mr-2">📊</span>
              عرض التقارير
            </button>
            <button className="w-full text-right px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <span className="mr-2">💬</span>
              إرسال إشعار
            </button>
          </div>
        </div>

        {/* Performance Overview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">نظرة على الأداء</h3>
          <div className="bg-gradient-to-r from-primary-main to-primary-dark rounded-lg p-4 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm opacity-90">متوسط نجاح الطلاب</div>
            </div>
            <div className="flex justify-between mt-4 text-sm opacity-90">
              <div className="text-center">
                <div className="font-semibold">42</div>
                <div>اختبار</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">128</div>
                <div>واجب</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">96</div>
                <div>درس</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 