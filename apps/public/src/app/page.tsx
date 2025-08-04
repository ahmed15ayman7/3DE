'use client';
import Layout from '../components/Layout';
import { Card, Button } from '@3de/ui';
import { 
  BookOpen, 
  Calendar, 
  Phone, 
  Users, 
  MessageSquare,
  TrendingUp,
  Bell,
  Activity,
  GraduationCap,
  UserCheck,
  Settings,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';

const statsCards = [
  {
    title: 'إجمالي المقالات',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: BookOpen,
    color: 'blue'
  },
  {
    title: 'الفعاليات القادمة',
    value: '8',
    change: '+3',
    trend: 'up',
    icon: Calendar,
    color: 'green'
  },
  {
    title: 'جهات الاتصال',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: Phone,
    color: 'purple'
  },
  {
    title: 'المجتمعات النشطة',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: MessageSquare,
    color: 'orange'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'post',
    title: 'تم نشر مقال جديد: "استراتيجيات التواصل الحديثة"',
    time: 'منذ ساعتين',
    icon: BookOpen
  },
  {
    id: 2,
    type: 'event',
    title: 'تم إضافة فعالية: "ورشة العلاقات العامة"',
    time: 'منذ 4 ساعات',
    icon: Calendar
  },
  {
    id: 3,
    type: 'contact',
    title: 'رسالة جديدة من شركة التقنية المتقدمة',
    time: 'منذ يوم',
    icon: Phone
  },
  {
    id: 4,
    type: 'community',
    title: 'انضمام 15 عضو جديد للمجتمع',
    time: 'منذ يومين',
    icon: Users
  }
];

export default function HomePage() {
  const router = useRouter();
  let {user} = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مرحباً بك في لوحة العلاقات العامة</h1>
            <p className="text-gray-600 mt-2">إدارة شاملة لجميع أنشطة العلاقات العامة والتواصل</p>
          </div>
          <div className="flex items-center gap-4 gap-reverse">
            <button className="relative p-3 cursor-pointer bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow" onClick={() => handleNavigation('/notifications')}>
              <Bell className="w-6 h-6 text-gray-600" />
              {user?.notifications?.length && user?.notifications?.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{user?.notifications?.length}</span>}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                      <span className="text-sm text-gray-500 mr-2">من الشهر الماضي</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl bg-${stat.color}-50`}>
                    <Icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">الأنشطة الأخيرة</h2>
                <button className="text-primary-main hover:text-primary-main text-sm font-medium">
                  عرض الكل
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 gap-reverse p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-main" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => handleNavigation('/groups')}
                  className="w-full cursor-pointer flex items-center p-4 bg-primary-main/10 hover:bg-primary-main/20 rounded-lg transition-colors group"
                >
                  <Users className="w-6 h-6 text-primary-main ml-3" />
                  <span className="text-primary-main font-medium">إدارة المجتمعات</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/students')}
                  className="w-full cursor-pointer flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <GraduationCap className="w-6 h-6 text-green-600 ml-3" />
                  <span className="text-green-700 font-medium">إدارة الطلاب</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/instructors')}
                  className="w-full cursor-pointer flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <UserCheck className="w-6 h-6 text-purple-600 ml-3" />
                  <span className="text-purple-700 font-medium">إدارة المحاضرين</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/contacts')}
                  className="w-full cursor-pointer flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
                >
                  <Phone className="w-6 h-6 text-orange-600 ml-3" />
                  <span className="text-orange-700 font-medium">رسائل الاتصال</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/events')}
                  className="w-full cursor-pointer flex items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <Calendar className="w-6 h-6 text-red-600 ml-3" />
                  <span className="text-red-700 font-medium">إدارة الفعاليات</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/posts')}
                  className="w-full cursor-pointer flex items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group"
                >
                  <BookOpen className="w-6 h-6 text-indigo-600 ml-3" />
                  <span className="text-indigo-700 font-medium">إدارة المقالات</span>
                </button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">إحصائيات سريعة</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المجتمعات النشطة</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الطلاب المسجلين</span>
                  <span className="font-bold text-green-600">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المحاضرين النشطين</span>
                  <span className="font-bold text-purple-600">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الرسائل الجديدة</span>
                  <span className="font-bold text-red-600">23</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
    </div>
    </Layout>
  );
}
