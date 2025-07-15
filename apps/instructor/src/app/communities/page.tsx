'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Tabs } from '@3de/ui';

// Types
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  category: string;
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  author: string;
  participants: number;
  lastActivity: string;
  isActive: boolean;
  tags: string[];
}

interface LiveRoom {
  id: string;
  title: string;
  description: string;
  host: string;
  participants: number;
  maxParticipants: number;
  startTime: string;
  isActive: boolean;
  category: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  category: string;
  image?: string;
}

// Mock Data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'نصائح لتحسين الفهم في الرياضيات',
    content: 'أردت مشاركة بعض النصائح التي ساعدت طلابي في تحسين فهمهم للرياضيات...',
    author: 'د. أحمد محمد',
    createdAt: '2024-01-20',
    likes: 15,
    comments: 8,
    isLiked: false,
    category: 'تعليمي',
  },
  {
    id: '2',
    title: 'تجربتي مع التعلم الرقمي',
    content: 'بعد عام من استخدام المنصات الرقمية، هذه خلاصة تجربتي...',
    author: 'د. فاطمة علي',
    createdAt: '2024-01-19',
    likes: 23,
    comments: 12,
    isLiked: true,
    category: 'تجارب',
  },
];

const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'كيفية تحفيز الطلاب في الفصول الافتراضية',
    description: 'نقاش حول استراتيجيات تحفيز الطلاب في بيئة التعلم الرقمي',
    author: 'د. محمد أحمد',
    participants: 15,
    lastActivity: '2024-01-20T10:30:00',
    isActive: true,
    tags: ['تحفيز', 'تعلم رقمي', 'إدارة فصل'],
  },
  {
    id: '2',
    title: 'أفضل أدوات التقييم الإلكتروني',
    description: 'مشاركة وتبادل الخبرات حول أدوات التقييم المختلفة',
    author: 'د. سارة خالد',
    participants: 22,
    lastActivity: '2024-01-19T15:45:00',
    isActive: false,
    tags: ['تقييم', 'أدوات', 'تكنولوجيا'],
  },
];

const mockLiveRooms: LiveRoom[] = [
  {
    id: '1',
    title: 'ورشة عمل: استراتيجيات التدريس الحديثة',
    description: 'ورشة تفاعلية حول أحدث استراتيجيات التدريس',
    host: 'د. أحمد محمد',
    participants: 25,
    maxParticipants: 50,
    startTime: '2024-01-21T14:00:00',
    isActive: false,
    category: 'ورش عمل',
  },
  {
    id: '2',
    title: 'جلسة نقاش مفتوحة: تحديات التعليم',
    description: 'نقاش مفتوح حول التحديات التي تواجه المعلمين',
    host: 'د. فاطمة علي',
    participants: 12,
    maxParticipants: 30,
    startTime: '2024-01-20T16:00:00',
    isActive: true,
    category: 'نقاشات',
  },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'مدرسو الرياضيات',
    description: 'مجموعة لمدرسي ومحاضري الرياضيات لتبادل الخبرات',
    members: 45,
    isPrivate: false,
    category: 'تخصص',
  },
  {
    id: '2',
    name: 'التعلم الرقمي والتكنولوجيا',
    description: 'مجموعة مهتمة بتطبيق التكنولوجيا في التعليم',
    members: 67,
    isPrivate: false,
    category: 'تكنولوجيا',
  },
];

const CommunitiesPage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');

  // Posts Tab Component
  const PostsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">المنشورات</h2>
        <Button>+ منشور جديد</Button>
      </div>

      <div className="space-y-4">
        {mockPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-custom border border-gray-200 p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {post.category}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h4>
                <p className="text-gray-600 mb-4">{post.content}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <button className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-600' : 'hover:text-red-600'} transition-colors`}>
                    <span>{post.isLiked ? '❤️' : '🤍'}</span>
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                    <span>📤</span>
                    <span>مشاركة</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Discussions Tab Component
  const DiscussionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">المناقشات</h2>
        <Button>+ مناقشة جديدة</Button>
      </div>

      <div className="space-y-4">
        {mockDiscussions.map((discussion, index) => (
          <motion.div
            key={discussion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-custom border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                  {discussion.isActive && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      نشط
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{discussion.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {discussion.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>بواسطة {discussion.author}</span>
                  <span>•</span>
                  <span>{discussion.participants} مشارك</span>
                  <span>•</span>
                  <span>
                    آخر نشاط: {new Date(discussion.lastActivity).toLocaleString('ar-SA')}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                انضم للمناقشة
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Live Rooms Tab Component
  const LiveRoomsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">الغرف المباشرة</h2>
        <Button>+ إنشاء غرفة</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockLiveRooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-custom border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {room.category}
              </span>
              {room.isActive ? (
                <span className="flex items-center space-x-1 text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  <span className="text-sm">مباشر</span>
                </span>
              ) : (
                <span className="text-sm text-gray-500">مجدول</span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.title}</h3>
            <p className="text-gray-600 mb-4">{room.description}</p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>المضيف:</span>
                <span>{room.host}</span>
              </div>
              <div className="flex justify-between">
                <span>المشاركون:</span>
                <span>{room.participants}/{room.maxParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span>الوقت:</span>
                <span>{new Date(room.startTime).toLocaleString('ar-SA')}</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(room.participants / room.maxParticipants) * 100}%` }}
              ></div>
            </div>

            <Button
              variant={room.isActive ? 'primary' : 'outline'}
              fullWidth
              disabled={room.participants >= room.maxParticipants}
            >
              {room.isActive ? 'انضم الآن' : 'سجل اهتمام'}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Groups Tab Component
  const GroupsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">المجموعات</h2>
        <Button>+ إنشاء مجموعة</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGroups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-custom border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">
                  {group.name.charAt(0)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {group.isPrivate && (
                  <span className="text-gray-400">🔒</span>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {group.category}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
            <p className="text-gray-600 mb-4 text-sm">{group.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {group.members} عضو
              </span>
              <span className="text-sm text-gray-500">
                {group.isPrivate ? 'خاصة' : 'عامة'}
              </span>
            </div>

            <Button variant="outline" fullWidth>
              {group.isPrivate ? 'طلب انضمام' : 'انضم للمجموعة'}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const tabItems = [
    {
      id: 'posts',
      label: 'المنشورات',
      content: <PostsTab />,
      icon: '📝'
    },
    {
      id: 'discussions',
      label: 'المناقشات',
      content: <DiscussionsTab />,
      icon: '💭'
    },
    {
      id: 'liverooms',
      label: 'الغرف المباشرة',
      content: <LiveRoomsTab />,
      icon: '📺'
    },
    {
      id: 'groups',
      label: 'المجموعات',
      content: <GroupsTab />,
      icon: '👥'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المجتمعات</h1>
          <p className="text-gray-600">تواصل وتبادل الخبرات مع زملائك المحاضرين</p>
        </div>
        <div className="flex space-x-3">
          <Input
            placeholder="البحث في المجتمعات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
            className="w-64"
          />
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
              <p className="text-gray-600 text-sm">المنشورات</p>
              <p className="text-2xl font-bold text-gray-900">{mockPosts.length}</p>
            </div>
            <div className="text-3xl">📝</div>
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
              <p className="text-gray-600 text-sm">المناقشات النشطة</p>
              <p className="text-2xl font-bold text-green-600">
                {mockDiscussions.filter(d => d.isActive).length}
              </p>
            </div>
            <div className="text-3xl">💭</div>
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
              <p className="text-gray-600 text-sm">الغرف المباشرة</p>
              <p className="text-2xl font-bold text-purple-600">
                {mockLiveRooms.filter(r => r.isActive).length}
              </p>
            </div>
            <div className="text-3xl">📺</div>
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
              <p className="text-gray-600 text-sm">المجموعات</p>
              <p className="text-2xl font-bold text-blue-600">{mockGroups.length}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </motion.div>
      </div>

      {/* Main Content with Tabs */}
      <div className="bg-white rounded-lg shadow-custom border border-gray-200">
        <Tabs
          items={tabItems}
          defaultActiveTab="posts"
          variant="underline"
          className="p-6"
        />
      </div>
    </div>
  );
};

export default CommunitiesPage; 