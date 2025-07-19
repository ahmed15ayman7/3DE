'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus,
  Award,
  Trophy,
  Medal,
  Star,
  Crown,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  Gift,
  Target,
  Zap,
  Filter
} from 'lucide-react';
import { achievementApi, badgeApi, userApi } from '@3de/apis';
import { Button, Input, Modal, toast } from '@3de/ui';
import { Achievement, Badge, User as UserType } from '@3de/interfaces';

export default function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements');
  const [selectedItem, setSelectedItem] = useState<Achievement | Badge | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch achievements data
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementApi.getAll(),
  });

  // Fetch badges data
  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: () => badgeApi.getAll(),
  });

  // Fetch students for assignment
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => userApi.getAll(1, 100, ''),
  });

  const achievements = achievementsData?.data || [];
  const badges = badgesData?.data || [];
  const students = studentsData?.data?.filter(user => user.role === 'STUDENT') || [];

  // Delete mutations
  const deleteAchievementMutation = useMutation({
    mutationFn: (id: string) => achievementApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الإنجاز بنجاح');
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      setShowDeleteModal(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الإنجاز');
    },
  });

  const deleteBadgeMutation = useMutation({
    mutationFn: (id: string) => badgeApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الشارة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      setShowDeleteModal(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الشارة');
    },
  });

  // Create badge mutation
  const createBadgeMutation = useMutation({
    mutationFn: (data: any) => badgeApi.create(data),
    onSuccess: () => {
      toast.success('تم إنشاء الشارة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      setShowCreateModal(false);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء إنشاء الشارة');
    },
  });

  // Filter current data based on active tab
  const currentData = activeTab === 'achievements' ? achievements : badges;
  const filteredData = currentData.filter((item: any) => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Statistics
  const totalAchievements = achievements.length;
  const totalBadges = badges.length;
  const uniqueStudents = new Set([
    ...achievements.map((a: any) => a.userId),
    ...badges.map((b: any) => b.userId)
  ]).size;
  const totalPoints = [...achievements, ...badges].reduce((sum, item) => sum + (item.points || 0), 0);

  // Get unique types
  const uniqueTypes = [...new Set(currentData.map((item: any) => item.type))];

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'completion':
      case 'إكمال':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'excellence':
      case 'تميز':
        return <Crown className="w-5 h-5 text-purple-500" />;
      case 'participation':
      case 'مشاركة':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'achievement':
      case 'إنجاز':
        return <Medal className="w-5 h-5 text-orange-500" />;
      case 'streak':
      case 'تسلسل':
        return <Zap className="w-5 h-5 text-green-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDelete = (item: Achievement | Badge) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedItem) return;
    
    if (activeTab === 'achievements') {
      deleteAchievementMutation.mutate(selectedItem.id);
    } else {
      deleteBadgeMutation.mutate(selectedItem.id);
    }
  };

  const isLoading = achievementsLoading || badgesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإنجازات والشارات</h1>
          <p className="text-gray-600 mt-1">
            إدارة ومراقبة إنجازات الطلاب والشارات المكتسبة
          </p>
        </div>
        
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
        >
          <Plus className="w-5 h-5 ml-2" />
          {activeTab === 'achievements' ? 'إضافة إنجاز' : 'إضافة شارة'}
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalAchievements}</p>
          <p className="text-gray-600">إجمالي الإنجازات</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Medal className="w-12 h-12 text-orange-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalBadges}</p>
          <p className="text-gray-600">إجمالي الشارات</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{uniqueStudents}</p>
          <p className="text-gray-600">طلاب محققين</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Star className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
          <p className="text-gray-600">إجمالي النقاط</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'achievements'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="w-4 h-4 inline ml-2" />
              الإنجازات ({totalAchievements})
            </button>
            
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'badges'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Medal className="w-4 h-4 inline ml-2" />
              الشارات ({totalBadges})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={`البحث في ${activeTab === 'achievements' ? 'الإنجازات' : 'الشارات'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="ALL">جميع الأنواع</option>
            {uniqueTypes.map((type: any) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Content Grid */}
      {filteredData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center min-h-96"
        >
          <div className="text-center">
            {activeTab === 'achievements' ? (
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            ) : (
              <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد {activeTab === 'achievements' ? 'إنجازات' : 'شارات'}
            </h3>
            <p className="text-gray-500">
              لم يتم العثور على {activeTab === 'achievements' ? 'إنجازات' : 'شارات'} تطابق معايير البحث.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredData.map((item: any, index: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
            >
              {/* Item Header */}
              <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 p-6">
                {item.icon ? (
                  <img 
                    src={item.icon} 
                    alt={item.title}
                    className="w-16 h-16 rounded-full mx-auto border-4 border-white shadow-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-md">
                    {getTypeIcon(item.type)}
                  </div>
                )}
                
                {/* Points Badge */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                  {item.points} نقطة
                </div>
              </div>

              {/* Item Content */}
              <div className="p-6">
                {/* Title and Type */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(item.type)}
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Student Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.user?.firstName} {item.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="mb-4 flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {activeTab === 'achievements' ? 'تاريخ الإنجاز' : 'تاريخ الحصول'}: {' '}
                  {new Date(
                    activeTab === 'achievements' 
                      ? (item as Achievement).createdAt 
                      : (item as Badge).earnedAt
                  ).toLocaleDateString('ar-SA')}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    عرض
                  </Button>
                  
                  <Button
                    onClick={() => handleDelete(item)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Details Modal */}
      {/* <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`تفاصيل ${activeTab === 'achievements' ? 'الإنجاز' : 'الشارة'}`}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="text-center">
              {selectedItem.id ? (
                <img 
                  src={selectedItem.icon} 
                  alt={selectedItem.title}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto flex items-center justify-center border-4 border-yellow-400">
                  {getTypeIcon(selectedItem.type)}
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1">
                {selectedItem.title}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                {getTypeIcon(selectedItem.type)}
                <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {selectedItem.type}
                </span>
              </div>
              
              <div className="bg-yellow-100 text-yellow-800 text-lg font-bold px-4 py-2 rounded-full inline-block">
                {selectedItem.points} نقطة
              </div>
            </div>
            
            {selectedItem.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedItem.description}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الطالب</label>
                <p className="text-sm text-gray-900">
                  {selectedItem.user?.firstName} {selectedItem.user?.lastName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <p className="text-sm text-gray-900">{selectedItem.user?.email}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'achievements' ? 'تاريخ الإنجاز' : 'تاريخ الحصول'}
              </label>
              <p className="text-sm text-gray-900">
                {new Date(
                  activeTab === 'achievements' 
                    ? (selectedItem as Achievement).createdAt 
                    : (selectedItem as Badge).earnedAt
                ).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        )}
      </Modal> */}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={`إضافة ${activeTab === 'achievements' ? 'إنجاز جديد' : 'شارة جديدة'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            سيتم إضافة المزيد من الميزات قريباً لإنشاء {activeTab === 'achievements' ? 'الإنجازات' : 'الشارات'} الجديدة.
          </p>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                حذف {activeTab === 'achievements' ? 'الإنجاز' : 'الشارة'}
              </p>
              <p className="text-sm text-gray-500">
                {selectedItem?.type}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            هل أنت متأكد من رغبتك في حذف هذا {activeTab === 'achievements' ? 'الإنجاز' : 'الشارة'}؟ 
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            
            <Button
              onClick={confirmDelete}
              disabled={deleteAchievementMutation.isPending || deleteBadgeMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 