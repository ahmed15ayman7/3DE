// Parallel Route: المنتديات
'use client';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { communityApi } from '@/lib/api';
// import { Forum } from '@shared/prisma';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div /> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div /> });

export default function ForumsTab() {
  const { user } = useUser();
//   const { data: forums = [], isLoading } = useQuery({
//     queryKey: ['forums'],
//     queryFn: async () => {
//     //   const res = await communityApi.getForumsByUser(user.id);
//     //   return res?.data ?? [];
//     },
//     staleTime: 1000 * 60 * 5,
//     gcTime: 1000 * 60 * 10,
//     placeholderData: [],
//   });

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[1, 2, 3].map((i) => (
//           <Skeleton key={i} height={200} />
//         ))}
//       </div>
//     );
//   }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* {forums.length === 0 ? (
        <div className="text-center text-gray-400 col-span-3">لا توجد منتديات بعد</div>
      ) : (
        forums.map((forum: Forum, index: number) => (
          <Card key={forum.id} title={forum.title} className="h-full">
            <p className="text-sm text-gray-600 mb-2">{forum.description}</p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>عدد المشاركات: {forum.postsCount ?? 0}</span>
              <span>آخر تحديث: {new Date(forum.updatedAt).toLocaleDateString('ar-EG')}</span>
            </div>
          </Card>
        ))
      )} */}
    </div>
  );
} 