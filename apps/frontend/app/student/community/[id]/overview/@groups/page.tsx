// Parallel Route: المجموعات
'use client';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { communityApi } from '@/lib/api';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div /> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div /> });

export default function GroupsTab() {
  const { user } = useUser();
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await communityApi.getGroupsByUser(user.id);
      return res ?? [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={200} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.length === 0 ? (
        <div className="text-center text-gray-400 col-span-3">لا توجد مجموعات بعد</div>
      ) : (
        groups.map((group: any, index: number) => (
          <Card key={group.id} title={group.name} className="h-full">
            <p className="text-sm text-gray-600 mb-2">{group.description}</p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>عدد الأعضاء: {group.membersCount ?? 0}</span>
              <span>آخر تحديث: {new Date(group.updatedAt).toLocaleDateString('ar-EG')}</span>
            </div>
          </Card>
        ))
      )}
    </div>
  );
} 