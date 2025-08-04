'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  Modal, 
  Input, 
  Textarea, 
  Badge, 
  LoadingSpinner,
  Alert,
  Table,
  TableHeader,
  TableCell,
  Pagination,
  PaginationInfo,
  ItemsPerPage
} from '@3de/ui';
import { groupApi } from '@3de/apis';
import { Group, User } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import { Plus, Users, Edit, Trash2, Eye, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import AddGroupModal from '../../components/dialogs/addGroupModal';

export default function GroupsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group & {members:string[]} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

      // Form state
      const [formData, setFormData] = useState<Partial<Group & {members:string[]}>>({
        name: '',
        subject: '',
        image: '',
        members: [],
        adminId: '',
        posts: [],
        admin: undefined,
        createdAt: new Date(),
        Community: undefined,
      });

  // Fetch groups
  const { data: groupsData, isLoading, error } = useQuery({
    queryKey: ['groups', currentPage, itemsPerPage, searchTerm],
    queryFn: () => groupApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (data: Partial<Group & {members:string[]}>) =>
      groupApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsCreateModalOpen(false);
      setFormData({ name: '', subject: '', image: '' });
    },
  });

  // Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Group> }) =>
      groupApi.update(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsEditModalOpen(false);
      setSelectedGroup(null);
      setFormData({ name: '', subject: '', image: '' });
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => groupApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    },
  });

  // Handle form submission


  // Handle edit
  const handleEdit = (group: Group) => {
    setSelectedGroup({...group,members:group.members?.map((member:User) => member.id) || [] as any});
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (group: Group) => {
    setSelectedGroup({...group,members:group.members?.map((member:User) => member.id) || [] as any});
    setIsDeleteModalOpen(true);
  };

  // Handle view group
  const handleViewGroup = (groupId: string) => {
    router.push(`/group/${groupId}/posts`);
  };

  // Filter groups based on search term
  const filteredGroups = groupsData?.data?.filter((group: Group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Pagination
  const totalItems = filteredGroups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" title="خطأ في التحميل">
          حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
        </Alert>
      </div>
    );
  }

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الجروبات</h1>
          <p className="text-gray-600 mt-2">إدارة الجروبات والجروبات في النظام</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إنشاء جروب جديد
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="البحث في الجروبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Groups Table */}
      <Card>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className='px-6 py-4 whitespace-nowrap'>اسم الجروب</th>
                <th className='px-6 py-4 whitespace-nowrap'>الموضوع</th>
                <th className='px-6 py-4 whitespace-nowrap'>عدد الأعضاء</th>
                <th className='px-6 py-4 whitespace-nowrap'>تاريخ الإنشاء</th>
                <th className='px-6 py-4 whitespace-nowrap'>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGroups.map((group: Group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {group.image && (
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{group.name}</div>
                        <div className="text-sm text-gray-500">ID: {group.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">{group.subject || 'غير محدد'}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {group.members?.length || 0} عضو
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">
                      {new Date(group.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewGroup(group.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        عرض
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(group)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        تعديل
                      </Button>
                                             <Button
                         variant="danger"
                         size="sm"
                         onClick={() => handleDelete(group)}
                         className="flex items-center gap-1"
                       >
                         <Trash2 className="w-3 h-3" />
                         حذف
                       </Button>
                    </div>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <PaginationInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
              <div className="flex items-center gap-4">
                <ItemsPerPage
                  value={itemsPerPage}
                  onChange={setItemsPerPage}
                  options={[5, 10, 20, 50]}
                />
                <Pagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Create Group Modal */}
     {isCreateModalOpen && <AddGroupModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} createGroupMutation={createGroupMutation as any} formData={formData} setFormData={setFormData} isEdit={false} selectedGroup={null} updateGroupMutation={updateGroupMutation as any} />}

      {/* Edit Group Modal */}
      {/* <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل الجروب"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الجروب *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="أدخل اسم الجروب"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموضوع
            </label>
            <Textarea
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="أدخل موضوع الجروب"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط الصورة
            </label>
            <Input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="أدخل رابط صورة الجروب"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={updateGroupMutation.isPending}
            >
              {updateGroupMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </div>
        </form>
      </Modal> */}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            هل أنت متأكد من حذف الجروب "{selectedGroup?.name}"؟ 
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={() => selectedGroup && deleteGroupMutation.mutate(selectedGroup.id)}
              disabled={deleteGroupMutation.isPending}
            >
              {deleteGroupMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'حذف الجروب'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </Layout>
  );
} 