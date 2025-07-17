'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Users,
  MessageSquare,
  Heart,
  Share2,
  MoreVertical,
  Pin,
  Eye,
  Clock,
  Image as ImageIcon,
  Video,
  File,
  Send,
  Bookmark,
  Flag,
  Crown,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { Card, Button, Badge, Avatar, Tabs, Textarea } from '@3de/ui'

const PostCard = ({ post }: { post: any }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 gap-reverse">
          <Avatar
            src={post.author.avatar}
            fallback={post.author.name.split(' ').map((n: string) => n[0]).join('')}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2 gap-reverse">
              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
              {post.author.isInstructor && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
              <Badge variant="outline" size="sm">
                {post.author.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2 gap-reverse text-sm text-gray-500">
              <span>{post.timeAgo}</span>
              {post.isPinned && (
                <>
                  <span>•</span>
                  <Pin className="h-3 w-3" />
                  <span>مثبت</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 mb-3">{post.content}</p>
        
        {post.attachments && post.attachments.length > 0 && (
          <div className="space-y-2">
            {post.attachments.map((attachment: any, index: number) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                {getFileIcon(attachment.type)}
                <span className="mr-2 text-sm font-medium text-gray-700">
                  {attachment.name}
                </span>
                <Button variant="ghost" size="sm" className="mr-auto">
                  تحميل
                </Button>
              </div>
            ))}
          </div>
        )}

        {post.image && (
          <div className="mt-3">
            <img
              src={post.image}
              alt="Post attachment"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-4 gap-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className={`h-4 w-4 ml-1 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4 ml-1" />
            {post.comments.length}
          </Button>
          
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 ml-1" />
            مشاركة
          </Button>
        </div>

        <div className="flex items-center gap-2 gap-reverse">
          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t"
        >
          <div className="space-y-3 mb-4">
            {post.comments.slice(0, 3).map((comment: any) => (
              <div key={comment.id} className="flex items-start gap-2 gap-reverse">
                <Avatar
                  src={comment.author.avatar}
                  fallback={comment.author.name[0]}
                  size="sm"
                />
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 gap-reverse mb-1">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                  </div>
                  <p className="text-sm text-gray-900">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex items-start gap-2 gap-reverse">
            <Avatar
              src="/current-user-avatar.jpg"
              fallback="أ"
              size="sm"
            />
            <div className="flex-1">
              <Textarea
                placeholder="اكتب تعليقاً..."
                rows={2}
                className="resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 gap-reverse">
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <File className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="primary" size="sm">
                  <Send className="h-4 w-4 ml-1" />
                  نشر
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

export default function CommunitiesPage() {
  const [selectedTab, setSelectedTab] = useState('my-communities')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data
  const myCommunities = [
    {
      id: '1',
      name: 'مطوري React',
      description: 'مجتمع للمطورين المهتمين بـ React وتقنيات الواجهات الأمامية',
      members: 1250,
      posts: 89,
      isOwner: true,
      avatar: '/community1.jpg',
      lastActivity: 'منذ ساعة واحدة',
    },
    {
      id: '2',
      name: 'خبراء JavaScript',
      description: 'مناقشات حول أحدث تقنيات وأدوات JavaScript',
      members: 890,
      posts: 156,
      isOwner: false,
      avatar: '/community2.jpg',
      lastActivity: 'منذ 3 ساعات',
    },
  ]

  const allCommunities = [
    ...myCommunities,
    {
      id: '3',
      name: 'مصممي UX/UI',
      description: 'مجتمع المصممين ومطوري تجربة المستخدم',
      members: 675,
      posts: 234,
      isOwner: false,
      avatar: '/community3.jpg',
      lastActivity: 'منذ يوم واحد',
    },
    {
      id: '4',
      name: 'مطوري الهواتف المحمولة',
      description: 'تطوير تطبيقات الهواتف الذكية والأجهزة المحمولة',
      members: 543,
      posts: 67,
      isOwner: false,
      avatar: '/community4.jpg',
      lastActivity: 'منذ يومين',
    },
  ]

  const mockPosts = [
    {
      id: '1',
      author: {
        name: 'د. محمد أحمد',
        avatar: '/instructor1.jpg',
        role: 'محاضر',
        isInstructor: true,
      },
      content: 'ما رأيكم في أحدث إصدار من React 18؟ هل جربتم ميزة Concurrent Features الجديدة؟ أريد أن أسمع تجاربكم وآرائكم.',
      timeAgo: 'منذ ساعتين',
      likes: 24,
      isLiked: false,
      isPinned: true,
      comments: [
        {
          id: '1',
          author: { name: 'أحمد محمد', avatar: '/student1.jpg' },
          content: 'جربت الميزة وهي ممتازة! تحسن الأداء ملحوظ.',
          timeAgo: 'منذ ساعة واحدة',
        },
        {
          id: '2',
          author: { name: 'فاطمة علي', avatar: '/student2.jpg' },
          content: 'أتفق معك، لكن التوثيق ما زال محدود.',
          timeAgo: 'منذ 45 دقيقة',
        },
      ],
      attachments: [],
    },
    {
      id: '2',
      author: {
        name: 'سارة أحمد',
        avatar: '/student3.jpg',
        role: 'طالبة',
        isInstructor: false,
      },
      content: 'أحتاج مساعدة في فهم مفهوم State Management في React. هل يمكن لأحد أن يشرح لي الفرق بين useState و useReducer؟',
      timeAgo: 'منذ 4 ساعات',
      likes: 12,
      isLiked: true,
      isPinned: false,
      comments: [
        {
          id: '3',
          author: { name: 'محمد سالم', avatar: '/instructor2.jpg' },
          content: 'useState للحالات البسيطة، useReducer للحالات المعقدة والمترابطة.',
          timeAgo: 'منذ 3 ساعات',
        },
      ],
      attachments: [
        { name: 'state-management-guide.pdf', type: 'file' },
      ],
    },
  ]

  const tabItems = [
    {
      id: 'my-communities',
      label: 'مجتمعاتي',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              المجتمعات التي أنتمي إليها ({myCommunities.length})
            </h3>
            <Button variant="primary">
              <Plus className="h-5 w-5 ml-2" />
              إنشاء مجتمع
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCommunities.map((community) => (
              <Card key={community.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 gap-reverse">
                    <Avatar
                      src={community.avatar}
                      fallback={community.name[0]}
                      size="lg"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {community.name}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {community.description}
                      </p>
                    </div>
                  </div>
                  
                  {community.isOwner && (
                    <Badge variant="success" size="sm">
                      مؤسس
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-main">
                      {community.members.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">عضو</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary-main">
                      {community.posts}
                    </div>
                    <div className="text-xs text-gray-500">منشور</div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  آخر نشاط: {community.lastActivity}
                </div>

                <div className="flex gap-2 gap-reverse">
                  <Link href={`/communities/${community.id}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      <Eye className="h-4 w-4 ml-2" />
                      دخول
                    </Button>
                  </Link>
                  {community.isOwner && (
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'all-communities',
      label: 'جميع المجتمعات',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              اكتشف المجتمعات
            </h3>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المجتمعات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCommunities.map((community) => (
              <Card key={community.id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-3 gap-reverse mb-4">
                  <Avatar
                    src={community.avatar}
                    fallback={community.name[0]}
                    size="md"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {community.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {community.members.toLocaleString()} عضو
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {community.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{community.posts} منشور</span>
                  <span>{community.lastActivity}</span>
                </div>

                <Button variant="primary" size="sm" className="w-full">
                  <Users className="h-4 w-4 ml-2" />
                  انضمام
                </Button>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'feed',
      label: 'آخر المنشورات',
      content: (
        <div className="space-y-6">
          {/* Create Post */}
          <Card className="p-6">
            <div className="flex items-start gap-3 gap-reverse">
              <Avatar
                src="/current-user-avatar.jpg"
                fallback="أ"
                size="md"
              />
              <div className="flex-1">
                <Textarea
                  placeholder="شارك شيئاً مفيداً مع المجتمع..."
                  rows={3}
                  className="resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 gap-reverse">
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="h-4 w-4 ml-1" />
                      صورة
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4 ml-1" />
                      فيديو
                    </Button>
                    <Button variant="ghost" size="sm">
                      <File className="h-4 w-4 ml-1" />
                      ملف
                    </Button>
                  </div>
                  <Button variant="primary" size="sm">
                    <Send className="h-4 w-4 ml-1" />
                    نشر
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المجتمعات التعليمية</h1>
          <p className="text-gray-600 mt-1">
            تفاعل مع زملائك المحاضرين والطلاب في مجتمعات متخصصة
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          items={tabItems}
          defaultActiveTab="my-communities"
          variant="underline"
          fullWidth
        />
      </Card>
    </div>
  )
} 