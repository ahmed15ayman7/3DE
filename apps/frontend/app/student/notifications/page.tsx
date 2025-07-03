// 'use client';

// import React, { Suspense, useEffect, useState } from 'react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import dynamic from 'next/dynamic';
// const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
// const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div></div> });
// const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div></div> });
// const Tabs = dynamic(() => import('@/components/common/Tabs'), { loading: () => <div></div> });
// const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });
// const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { loading: () => <div></div> });
// const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { loading: () => <div></div> });
// const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div></div> });
// // import { Switch, Alert } from '@mui/material'; // يفضل استبدالهم لاحقاً بمكونات مخصصة


// import { notificationApi } from '@/lib/api';
// import { motion } from 'framer-motion';
// import { format } from 'date-fns';
// import { ar } from 'date-fns/locale';
// import {
//     Bell ,
//     Check,
//     AlertTriangle,
//     Trophy,
//     Mail,
//     Cog,
//     ArrowRight,
//     AlertCircle
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { Notification, NotificationSettings } from '@shared/prisma';
// import { useUser } from '@/hooks/useUser';

// let getNotificationsData = async (id: string) => {
//     let { success, data } = await notificationApi.getAllByUserId(id);
//     if (success) {
//         return data;
//     }
//     return null;
// }
// let getNotificationsSettingsData = async (id: string) => {
//     let { success, data } = await notificationApi.getSettingsByUserId(id);
//     if (success) {
//         return data;
//     }
//     return null;
// }
// let initialNotifications: Notification[] = [
//     {
//         id: '1',
//         title: 'الواجب الأول',
//         message: 'الواجب الأول هو الواجب الأول',
//         userId: '1',
//         type: 'ASSIGNMENT',
//         isImportant: false,
//         urgent: false,
//         read: false,
//         createdAt: new Date(),
//         actionUrl: null,
//         trainingScheduleId: null,
//     },
//     {
//         id: '2',
//         title: 'الواجب الثاني',
//         message: 'الواجب الثاني هو الواجب الثاني',
//         userId: '1',
//         type: 'GRADE',
//         isImportant: false,
//         urgent: false,
//         read: false,
//         createdAt: new Date(),
//         actionUrl: null,
//         trainingScheduleId: null,
//         }
// ]

//  function StudentNotifications() {
//     const [activeTab, setActiveTab] = useState(0);
//     const [showSettings, setShowSettings] = useState(false);
//     const [settings, setSettings] = useState<NotificationSettings>({
//         id: '',
//         userId: '',
//         createdAt: new Date(),
//         assignments: true,
//         grades: true,
//         messages: true,
//         achievements: true,
//         urgent: true,
//         email: false,
//         push: true
//     });
//     let router = useRouter();
//     let { user, status } = useUser();

//     // استعلامات البيانات
//     const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
//         queryKey: ['notifications'],
//         queryFn: () => getNotificationsData(user?.id || ''),
//         staleTime: 1000 * 60 * 5,
//         gcTime: 1000 * 60 * 10,
//         placeholderData: (previousData) => previousData ?? initialNotifications,
//     });
//     let { data: notificationsSettings, isLoading: isLoadingNotificationsSettings } = useQuery({
//         queryKey: ['notificationsSettings'],
//         queryFn: () => getNotificationsSettingsData(user?.id || ''),
//         staleTime: 1000 * 60 * 5,
//         gcTime: 1000 * 60 * 10,
//         placeholderData: (previousData) => previousData ?? null,
//     });

//     // طلب تحديث حالة الإشعار
//     const { mutate: markAsRead } = useMutation({
//         mutationFn: (id: string) => notificationApi.markAsRead(id),
//     });

//     // طلب تحديث الإعدادات
//     const { mutate: updateSettings } = useMutation({
//         mutationFn: (data: NotificationSettings) => notificationsSettings ? notificationApi.updateSettings(data) : notificationApi.createSettings(data),
//         onSuccess: () => setShowSettings(false)
//     });
//     useEffect(() => {
//         if (notificationsSettings) {
//             setSettings({
//                 id: notificationsSettings.id,
//                 userId: notificationsSettings.userId,
//                 createdAt: notificationsSettings.createdAt,
//                 assignments: notificationsSettings.assignments,
//                 grades: notificationsSettings.grades,
//                 messages: notificationsSettings.messages,
//                 achievements: notificationsSettings.achievements,
//                 urgent: notificationsSettings.urgent,
//                 email: notificationsSettings.email,
//                 push: notificationsSettings.push
//             });
//         } else {
//             setSettings((prev) => ({
//                 ...prev,
//                 userId: user?.id || '',
//             }));
//         }
//     }, [notificationsSettings, user?.id]);


//     if (isLoadingNotifications || isLoadingNotificationsSettings || status === "loading") {
//         return (
//             <div className="space-y-6">
//                 <Skeleton height={40} width={300} />
//                 <div className="space-y-4">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                         <Skeleton key={i} height={100} />
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     // تصفية الإشعارات حسب التبويب النشط
//     const filteredNotifications = (notifications || initialNotifications)?.filter(notification => {
//         switch (activeTab) {
//             case 1:
//                 return !notification.read;
//             case 2:
//                 return notification.read;
//             case 3:
//                 return notification.isImportant;
//             default:
//                 return true;
//         }
//     });

//     // الحصول على الإشعار العاجل
//     const urgentNotification = (notifications || initialNotifications)?.find(n => n.urgent && !n.read);
//     let filteredNotificationsDesign = <div className="space-y-4">
//         {filteredNotifications?.length === 0 ? (
//             <EmptyState
//                 icon={<Bell className="text-gray-400 text-4xl" />}
//                 title="لا توجد إشعارات"
//                 description="لا توجد إشعارات جديدة لعرضها"
//             />
//         ) : (
//             filteredNotifications?.map((notification, index) => (
//                 <motion.div
//                     key={notification.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                     <Card title={notification.title} className={`${!notification.read ? 'border-l-4 border-primary-500' : ''}`}>
//                         <div className="flex items-start space-x-4">
//                             <div className={`p-3 rounded-full ${notification.type === 'ASSIGNMENT' ? 'bg-blue-100' :
//                                 notification.type === 'GRADE' ? 'bg-green-100' :
//                                     notification.type === 'MESSAGE' ? 'bg-purple-100' :
//                                         'bg-yellow-100'
//                                 }`}>
//                                 {notification.type === 'ASSIGNMENT' ? <AlertTriangle className="text-blue-500" /> :
//                                     notification.type === 'GRADE' ? <Trophy className="text-green-500" /> :
//                                         notification.type === 'MESSAGE' ? <Mail className="text-purple-500" /> :
//                                             <Bell className="text-yellow-500" />
//                                 }
//                             </div>
//                             <div className="flex-1">
//                                 <div className="flex items-center justify-between">
//                                     <h3 className="text-lg font-bold">{notification.title}</h3>
//                                     {!notification.read && (
//                                         <Badge variant="dot">
//                                             <span>جديد</span>
//                                         </Badge>
//                                     )}
//                                 </div>
//                                 <p className="text-gray-600 mt-2">{notification.message}</p>
//                                 <div className="flex items-center justify-between mt-4">
//                                     <span className="text-sm text-gray-500">
//                                         {format(new Date(notification.createdAt), 'd MMMM yyyy - h:mm a', { locale: ar })}
//                                     </span>
//                                     <div className="flex items-center space-x-2">
//                                         {!notification.read && (
//                                             <Button
//                                                 variant="text"
//                                                 size="small"
//                                                 onClick={() => markAsRead(notification.id)}
//                                             >
//                                                 <Check className="ml-2" />
//                                                 تم
//                                             </Button>
//                                         )}
//                                         {notification.actionUrl && (
//                                             <Button
//                                                 variant="contained"
//                                                 size="small"
//                                                 onClick={() => router.push(notification.actionUrl || '')}
//                                             >
//                                                 اذهب للمهمة
//                                                 <ArrowRight className="mr-2" />
//                                             </Button>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </motion.div>
//             ))
//         )}
//     </div>;
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//         >
//             {/* العنوان */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold">إشعاراتي 🔔</h1>
//                     <p className="text-gray-600">
//                         تابع آخر المستجدات والتنبيهات المهمة
//                     </p>
//                 </div>
//                 <Button
//                     variant="text"
//                     onClick={() => setShowSettings(true)}
//                 >
//                     <Cog className="ml-2" />
//                     إعدادات الإشعارات
//                 </Button>
//             </div>

//             {/* الإشعار العاجل */}
//             {urgentNotification && (
//                 <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <AlertTriangle className="text-yellow-500 text-xl" />
//                             <div>
//                                 <p className="font-medium">{urgentNotification.title}</p>
//                                 <p className="text-sm text-gray-600">{urgentNotification.message}</p>
//                             </div>
//                         </div>
//                         <Button
//                             variant="contained"
//                             size="small"
//                             onClick={() => markAsRead(urgentNotification.id)}
//                         >
//                             تم
//                         </Button>
//                     </div>
//                 </div>
//             )}

//             {/* التبويبات */}
//             <Tabs
//                 value={activeTab}
//                 onChange={setActiveTab}
//                 tabs={[
//                     { value: 0, label: 'كل الإشعارات', icon: <Bell className="text-gray-400 text-4xl" />, content: filteredNotificationsDesign },
//                     { value: 1, label: 'غير مقروء', icon: <AlertTriangle className="text-gray-400 text-4xl" />, content: filteredNotificationsDesign },
//                     { value: 2, label: 'تم القراءة', icon: <Check className="text-gray-400 text-4xl" />, content: filteredNotificationsDesign },
//                     { value: 3, label: 'مهم', icon: <AlertCircle className="text-gray-400 text-4xl" />, content: filteredNotificationsDesign },
//                 ]}
//             />

//             {/* قائمة الإشعارات */}


//             {/* إعدادات الإشعارات */}
//             {showSettings && (
//                 <Modal
//                     open={showSettings}
//                     onClose={() => setShowSettings(false)}
//                     title="إعدادات الإشعارات"
//                 >
//                     <div className="space-y-6">
//                         <div className="space-y-4">
//                             <h3 className="font-bold">أنواع الإشعارات</h3>
//                             <div className="space-y-2">
//                                 <div className="flex items-center justify-between">
//                                     <span>الواجبات والمواعيد النهائية</span>
//                                     <button onClick={() => setSettings({ ...settings, assignments: !settings.assignments })} className="px-2 py-1 border rounded">
//                                         {settings.assignments ? 'تشغيل' : 'إيقاف'}
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span>الدرجات والنتائج</span>
//                                     <button onClick={() => setSettings({ ...settings, grades: !settings.grades })} className="px-2 py-1 border rounded">
//                                         {settings.grades ? 'تشغيل' : 'إيقاف'}
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span>الرسائل الإدارية</span>
//                                     <button onClick={() => setSettings({ ...settings, messages: !settings.messages })} className="px-2 py-1 border rounded">
//                                         {settings.messages ? 'تشغيل' : 'إيقاف'}
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span>الإنجازات والشارات</span>
//                                     <button onClick={() => setSettings({ ...settings, achievements: !settings.achievements })} className="px-2 py-1 border rounded">
//                                         {settings.achievements ? 'تشغيل' : 'إيقاف'}
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span>الإشعارات العاجلة</span>
//                                     <button onClick={() => setSettings({ ...settings, urgent: !settings.urgent })} className="px-2 py-1 border rounded">
//                                         {settings.urgent ? 'تشغيل' : 'إيقاف'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <h3 className="font-bold">طرق الإرسال</h3>
//                             <div className="space-y-2">
//                                 <div className="flex items-center justify-between">
//                                     <span>البريد الإلكتروني</span>
//                                     <button onClick={() => setSettings({ ...settings, email: !settings.email })} className="px-2 py-1 border rounded">
//                                         {settings.email ? 'تشغيل' : 'إيقاف'}
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span>إشعارات التطبيق</span>
//                                     <button onClick={() => setSettings({ ...settings, push: !settings.push })} className="px-2 py-1 border rounded">
//                                         {settings.push ? 'تشغيل' : 'إيقاف'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex justify-end space-x-2">
//                             <Button
//                                 variant="text"
//                                 onClick={() => setShowSettings(false)}
//                             >
//                                 إلغاء
//                             </Button>
//                             <Button
//                                 variant="contained"
//                                 onClick={() => updateSettings(settings)}
//                             >
//                                 حفظ التغييرات
//                             </Button>
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </motion.div>
//     );
// } 
// export default function StudentNotificationsS() {
//     return (
//         <Suspense fallback={<Skeleton />}>
//             <StudentNotifications />
//         </Suspense>
//     );
// }

import { redirect } from 'next/navigation';

export default function OverviewPage() {
  // Redirect to الكورسات النشطة كافتراضي
  redirect('/student/notifications/overview');
}
