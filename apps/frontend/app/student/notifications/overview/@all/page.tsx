// Parallel Route: جميع الإشعارات
'use client';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/lib/api';
import { Notification } from '@shared/prisma';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });

export default function AllNotificationsTab() {
  const { user } = useUser();
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getAllByUserId(user.id);
      return res?.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: [],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={100} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center text-gray-400">لا توجد إشعارات</div>
      ) : (
        notifications.map((notification: Notification) => (
          <Card key={notification.id} title={notification.title} className="bg-white">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-600">{notification.message}</span>
              <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString('ar-EG')}</span>
            </div>
          </Card>
        ))
      )}
    </div>
  );
} 