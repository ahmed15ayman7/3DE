'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Select, Modal, Textarea } from '@3de/ui';

// Types
interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'academic' | 'participation' | 'improvement' | 'leadership' | 'creativity';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: string;
  isActive: boolean;
}

interface StudentAchievement {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  badgeId: string;
  badge: Badge;
  earnedAt: string;
  awardedBy: string;
  reason?: string;
}

// Mock data
const mockBadges: Badge[] = [
  {
    id: '1',
    title: 'متفوق أكاديمياً',
    description: 'حصل على درجة أعلى من 90% في 3 اختبارات متتالية',
    icon: '🎓',
    color: '#F59E0B',
    category: 'academic',
    points: 100,
    rarity: 'rare',
    criteria: 'درجة أعلى من 90% في 3 اختبارات',
    isActive: true,
  },
  {
    id: '2',
    title: 'مشارك نشط',
    description: 'شارك في أكثر من 10 مناقشات في الأسبوع',
    icon: '💬',
    color: '#10B981',
    category: 'participation',
    points: 50,
    rarity: 'common',
    criteria: '10+ مشاركات في الأسبوع',
    isActive: true,
  },
  {
    id: '3',
    title: 'سريع التطور',
    description: 'تحسن الدرجات بنسبة 20% في شهر واحد',
    icon: '📈',
    color: '#8B5CF6',
    category: 'improvement',
    points: 75,
    rarity: 'rare',
    criteria: 'تحسن 20% في الدرجات',
    isActive: true,
  },
  {
    id: '4',
    title: 'مبدع',
    description: 'قدم مشروع إبداعي متميز',
    icon: '🎨',
    color: '#EC4899',
    category: 'creativity',
    points: 150,
    rarity: 'epic',
    criteria: 'مشروع إبداعي متميز',
    isActive: true,
  },
];

const mockAchievements: StudentAchievement[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'أحمد محمد',
    badgeId: '1',
    badge: mockBadges[0],
    earnedAt: '2024-01-15',
    awardedBy: 'محمد علي',
    reason: 'أداء ممتاز في اختبارات الرياضيات',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'فاطمة علي',
    badgeId: '2',
    badge: mockBadges[1],
    earnedAt: '2024-01-14',
    awardedBy: 'محمد علي',
    reason: 'مشاركة فعالة في جميع النقاشات',
  },
];

const AchievementsPage = () => {
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [achievements, setAchievements] = useState<StudentAchievement[]>(mockAchievements);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateBadgeModalOpen, setIsCreateBadgeModalOpen] = useState(false);
  const [isAwardBadgeModalOpen, setIsAwardBadgeModalOpen] = useState(false);

  // New badge form state
  const [newBadge, setNewBadge] = useState<Partial<Badge>>({
    title: '',
    description: '',
    icon: '🏆',
    color: '#3B82F6',
    category: 'academic',
    points: 50,
    rarity: 'common',
    criteria: '',
    isActive: true,
  });

  // Award badge form state
  const [awardForm, setAwardForm] = useState({
    studentId: '',
    badgeId: '',
    reason: '',
  });

  // Mock students for dropdown
  const students = [
    { value: '1', label: 'أحمد محمد' },
    { value: '2', label: 'فاطمة علي' },
    { value: '3', label: 'محمد أحمد' },
    { value: '4', label: 'سارة خالد' },
  ];

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'academic', label: 'أكاديمي' },
    { value: 'participation', label: 'مشاركة' },
    { value: 'improvement', label: 'تطوير' },
    { value: 'leadership', label: 'قيادة' },
    { value: 'creativity', label: 'إبداع' },
  ];

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800 border-gray-300',
    rare: 'bg-blue-100 text-blue-800 border-blue-300',
    epic: 'bg-purple-100 text-purple-800 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const rarityLabels = {
    common: 'شائع',
    rare: 'نادر',
    epic: 'ملحمي',
    legendary: 'أسطوري',
  };

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const matchesSearch = badge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate statistics
  const totalBadges = badges.length;
  const activeBadges = badges.filter(b => b.isActive).length;
  const totalAchievements = achievements.length;
  const recentAchievements = achievements.filter(a => {
    const earnedDate = new Date(a.earnedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return earnedDate >= weekAgo;
  }).length;

  const handleCreateBadge = () => {
    const { id, ...badgeData } = newBadge;
    const badge: Badge = {
      id: Date.now().toString(),
      ...badgeData as Omit<Badge, 'id'>,
    };
    setBadges([...badges, badge]);
    setNewBadge({
      title: '',
      description: '',
      icon: '🏆',
      color: '#3B82F6',
      category: 'academic',
      points: 50,
      rarity: 'common',
      criteria: '',
      isActive: true,
    });
    setIsCreateBadgeModalOpen(false);
  };

  const handleAwardBadge = () => {
    const student = students.find(s => s.value === awardForm.studentId);
    const badge = badges.find(b => b.id === awardForm.badgeId);
    
    if (student && badge) {
      const achievement: StudentAchievement = {
        id: Date.now().toString(),
        studentId: awardForm.studentId,
        studentName: student.label,
        badgeId: awardForm.badgeId,
        badge,
        earnedAt: new Date().toISOString().split('T')[0],
        awardedBy: 'المحاضر الحالي',
        reason: awardForm.reason,
      };
      setAchievements([achievement, ...achievements]);
      setAwardForm({ studentId: '', badgeId: '', reason: '' });
      setIsAwardBadgeModalOpen(false);
    }
  };

  const handleToggleBadgeStatus = (badgeId: string) => {
    setBadges(badges.map(badge => 
      badge.id === badgeId ? { ...badge, isActive: !badge.isActive } : badge
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الإنجازات والشارات</h1>
          <p className="text-gray-600">قم بإنشاء شارات وتقدير إنجازات طلابك</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setIsAwardBadgeModalOpen(true)}>
            منح شارة
          </Button>
          <Button onClick={() => setIsCreateBadgeModalOpen(true)}>
            + إنشاء شارة جديدة
          </Button>
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
              <p className="text-gray-600 text-sm">إجمالي الشارات</p>
              <p className="text-2xl font-bold text-gray-900">{totalBadges}</p>
            </div>
            <div className="text-3xl">🏆</div>
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
              <p className="text-gray-600 text-sm">الشارات النشطة</p>
              <p className="text-2xl font-bold text-green-600">{activeBadges}</p>
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
              <p className="text-gray-600 text-sm">إجمالي الإنجازات</p>
              <p className="text-2xl font-bold text-blue-600">{totalAchievements}</p>
            </div>
            <div className="text-3xl">🎯</div>
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
              <p className="text-gray-600 text-sm">إنجازات هذا الأسبوع</p>
              <p className="text-2xl font-bold text-purple-600">{recentAchievements}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow-custom border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">الإنجازات الأخيرة</h2>
        </div>
        <div className="p-6">
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.slice(0, 5).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-4xl">{achievement.badge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{achievement.studentName}</h3>
                      <span className="text-sm text-gray-500">حصل على</span>
                      <span className="font-medium text-gray-900">{achievement.badge.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {achievement.reason || achievement.badge.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(achievement.earnedAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      +{achievement.badge.points} نقطة
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-gray-600">لا توجد إنجازات بعد</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-custom border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="البحث في الشارات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />
          <Select
            label="الفئة"
            options={categories}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg shadow-custom border-2 p-6 ${
              badge.isActive ? 'border-gray-200' : 'border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{badge.icon}</div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${rarityColors[badge.rarity]}`}>
                  {rarityLabels[badge.rarity]}
                </span>
                <button
                  onClick={() => handleToggleBadgeStatus(badge.id)}
                  className={`p-1 rounded-full text-xs ${
                    badge.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {badge.isActive ? '🟢' : '🔴'}
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{badge.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">المعايير:</span>
                <span className="text-gray-900">{badge.criteria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">النقاط:</span>
                <span className="font-medium text-gray-900">{badge.points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الفئة:</span>
                <span className="text-gray-900">
                  {categories.find(c => c.value === badge.category)?.label}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAwardForm(prev => ({ ...prev, badgeId: badge.id }));
                    setIsAwardBadgeModalOpen(true);
                  }}
                  disabled={!badge.isActive}
                  className="flex-1"
                >
                  منح الشارة
                </Button>
                <Button size="sm" variant="ghost">
                  تعديل
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد شارات</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'لا توجد شارات تطابق معايير البحث'
              : 'ابدأ بإنشاء أول شارة لطلابك'
            }
          </p>
        </div>
      )}

      {/* Create Badge Modal */}
      <Modal
        isOpen={isCreateBadgeModalOpen}
        onClose={() => setIsCreateBadgeModalOpen(false)}
        title="إنشاء شارة جديدة"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="عنوان الشارة *"
            value={newBadge.title || ''}
            onChange={(e) => setNewBadge({ ...newBadge, title: e.target.value })}
            placeholder="أدخل عنوان الشارة"
          />

          <Textarea
            label="الوصف *"
            value={newBadge.description || ''}
            onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
            placeholder="أدخل وصف الشارة"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="الأيقونة"
              value={newBadge.icon || ''}
              onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
              placeholder="🏆"
            />

            <Input
              type="color"
              label="اللون"
              value={newBadge.color || '#3B82F6'}
              onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="الفئة *"
              options={categories.filter(c => c.value !== 'all')}
              value={newBadge.category || 'academic'}
              onChange={(e) => setNewBadge({ ...newBadge, category: e.target.value as any })}
            />

            <Select
              label="الندرة"
              options={[
                { value: 'common', label: 'شائع' },
                { value: 'rare', label: 'نادر' },
                { value: 'epic', label: 'ملحمي' },
                { value: 'legendary', label: 'أسطوري' },
              ]}
              value={newBadge.rarity || 'common'}
              onChange={(e) => setNewBadge({ ...newBadge, rarity: e.target.value as any })}
            />
          </div>

          <Input
            type="number"
            label="النقاط *"
            value={newBadge.points || 50}
            onChange={(e) => setNewBadge({ ...newBadge, points: parseInt(e.target.value) })}
            min="1"
          />

          <Textarea
            label="المعايير *"
            value={newBadge.criteria || ''}
            onChange={(e) => setNewBadge({ ...newBadge, criteria: e.target.value })}
            placeholder="أدخل معايير الحصول على الشارة"
            rows={2}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateBadgeModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateBadge}
              disabled={!newBadge.title || !newBadge.description || !newBadge.criteria}
            >
              إنشاء الشارة
            </Button>
          </div>
        </div>
      </Modal>

      {/* Award Badge Modal */}
      <Modal
        isOpen={isAwardBadgeModalOpen}
        onClose={() => setIsAwardBadgeModalOpen(false)}
        title="منح شارة لطالب"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="الطالب *"
            options={[
              { value: '', label: 'اختر طالب' },
              ...students
            ]}
            value={awardForm.studentId}
            onChange={(e) => setAwardForm({ ...awardForm, studentId: e.target.value })}
          />

          <Select
            label="الشارة *"
            options={[
              { value: '', label: 'اختر شارة' },
              ...badges.filter(b => b.isActive).map(b => ({
                value: b.id,
                label: `${b.icon} ${b.title}`,
              }))
            ]}
            value={awardForm.badgeId}
            onChange={(e) => setAwardForm({ ...awardForm, badgeId: e.target.value })}
          />

          <Textarea
            label="السبب (اختياري)"
            value={awardForm.reason}
            onChange={(e) => setAwardForm({ ...awardForm, reason: e.target.value })}
            placeholder="أدخل سبب منح الشارة"
            rows={3}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAwardBadgeModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAwardBadge}
              disabled={!awardForm.studentId || !awardForm.badgeId}
            >
              منح الشارة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AchievementsPage; 