import { redirect } from 'next/navigation';
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import dynamic from 'next/dynamic';
// const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
// const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div>جاري التحميل...</div> });
// const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div>جاري التحميل...</div> });
// const Tabs = dynamic(() => import('@/components/common/Tabs'), { loading: () => <div>جاري التحميل...</div> });
// const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div>جاري التحميل...</div> });
// const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { loading: () => <div>جاري التحميل...</div> });
// const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div>جاري التحميل...</div> });
// const Input = dynamic(() => import('@/components/common/Input'), { loading: () => <div>جاري التحميل...</div> });
// const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div>جاري التحميل...</div> });
// import { Switch, Select, Alert } from "@mui/material"

// import { profileApi, userApi } from '@/lib/api';
// import { motion } from 'framer-motion';
// import { FaUser, FaLock, FaShieldAlt, FaCog, FaQrcode, FaCheck, FaTimes, FaUpload, FaGlobe, FaMoon, FaSun } from 'react-icons/fa';
// import { QRCodeSVG } from 'qrcode.react';
// import { LoginDevice, LoginHistory, Profile, TwoFactor, User, UserRole } from '@shared/prisma';
// import { useUser } from '@/hooks/useUser';
// import { frontendUrl } from '@/constant';
// import { redirect } from 'next/navigation';
// let getProfileData = async (id: string) => {
//     let { success, data } = await userApi.getProfile(id);
//     if (success) {
//         return data;
//     }
//     return null;
// }
//  function StudentProfile() {
//     const [activeTab, setActiveTab] = useState(0);
//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     const [show2FAModal, setShow2FAModal] = useState(false);
//     const [theme, setTheme] = useState('light');
//     const [showNightModeTrial, setShowNightModeTrial] = useState(false);
//     let [profileData, setProfileData] = useState<User & { loginHistory: LoginHistory[], twoFactor: TwoFactor }>({
//         id: '',
//         email: '',
//         password: '',
//         phone: '',
//         firstName: '',
//         lastName: '',
//         role: UserRole.STUDENT,
//         subRole: '',
//         avatar: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         academyId: '',
//         isOnline: false,
//         isVerified: false,
//         age: 0,
//         loginHistory: [
//             {
//                 id: '',
//                 createdAt: new Date(),
//                 userId: '',
//                 ip: '',
//                 success: false,
//                 device: LoginDevice.LAPTOP,
//                 location: 'الرياض',
//                 browser: 'Chrome',
//                 os: 'Windows',
//             }
//         ],
//         twoFactor: {
//             id: '',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             userId: '',
//             email: false,
//             sms: false,
//             authenticator: false,
//             secret: '',
//         },
//     });
//     let { user, status } = useUser();

// import { profileApi, userApi } from '@/lib/api';
// import { motion } from 'framer-motion';
// import { FaUser, FaLock, FaShieldAlt, FaCog, FaQrcode, FaCheck, FaTimes, FaUpload, FaGlobe, FaMoon, FaSun } from 'react-icons/fa';
// import { QRCodeSVG } from 'qrcode.react';
// import { LoginDevice, LoginHistory, Profile, TwoFactor, User, UserRole } from '@shared/prisma';
// import { useUser } from '@/hooks/useUser';
// import { frontendUrl } from '@/constant';
// import { redirect } from 'next/navigation';
// let getProfileData = async (id: string) => {
//     let { success, data } = await userApi.getProfile(id);
//     if (success) {
//         return data;
//     }
//     return null;
// }
//  function StudentProfile() {
//     const [activeTab, setActiveTab] = useState(0);
//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     const [show2FAModal, setShow2FAModal] = useState(false);
//     const [theme, setTheme] = useState('light');
//     const [showNightModeTrial, setShowNightModeTrial] = useState(false);
//     let [profileData, setProfileData] = useState<User & { loginHistory: LoginHistory[], twoFactor: TwoFactor }>({
//         id: '',
//         email: '',
//         password: '',
//         phone: '',
//         firstName: '',
//         lastName: '',
//         role: UserRole.STUDENT,
//         subRole: '',
//         avatar: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         academyId: '',
//         isOnline: false,
//         isVerified: false,
//         age: 0,
//         loginHistory: [
//             {
//                 id: '',
//                 createdAt: new Date(),
//                 userId: '',
//                 ip: '',
//                 success: false,
//                 device: LoginDevice.LAPTOP,
//                 location: 'الرياض',
//                 browser: 'Chrome',
//                 os: 'Windows',
//             }
//         ],
//         twoFactor: {
//             id: '',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             userId: '',
//             email: false,
//             sms: false,
//             authenticator: false,
//             secret: '',
//         },
//     });
//     let { user, status } = useUser();

//     // استعلامات البيانات
//     const { data: profile, isLoading: isLoadingProfile } = useQuery({
//         queryKey: ['profile'],
//         queryFn: () => getProfileData(user?.id),
//     });

//     // طلب تحديث البيانات
//     const { mutate: updateProfile } = useMutation({
//         mutationFn: (data: any) => userApi.updateProfile(data),
//     });

//     // طلب تغيير كلمة المرور
//     const { mutate: changePassword } = useMutation({
//         mutationFn: (data: any) => userApi.changePassword(data),
//         onSuccess: () => setShowPasswordModal(false)
//     });

//     // طلب تحديث التحقق الثنائي
//     const { mutate: update2FA } = useMutation({
//         mutationFn: (data: any) => userApi.updateTwoFactor(user?.id, data),
//         onSuccess: () => setShow2FAModal(false)
//     });
//     useEffect(() => {
//         setProfileData((prev) => ({ ...prev, ...user }));
//     }, [user])

//     if (isLoadingProfile || status === "loading") {
//         return (
//             <div className="space-y-6">
//                 <Skeleton height={200} />
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Skeleton height={300} />
//                     <Skeleton height={300} />
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-6"
//         >
//             {/* ملخص الحساب */}
//             <Card title="ملخص الحساب">
//                 <div className="flex items-center space-x-6">
//                     <div className="relative">
//                         <Avatar src={profile?.avatar || ''} size="xl" />
//                         <Badge
//                             variant={profile?.isOnline ? 'standard' : 'dot'}
//                             color={profile?.isOnline ? 'success' : 'primary'}
//                             className="absolute -bottom-2 -right-2"
//                         >
//                             <span className="text-xs text-secondary-main ">
//                                 {profile?.isOnline ? 'نشط' : 'غير نشط'}
//                             </span>
//                         </Badge>
//                     </div>
//                     <div className="flex-1">
//                         <div className="flex items-center space-x-4">
//                             <h1 className="text-2xl font-bold">
//                                 {profile?.firstName} {profile?.lastName}
//                                 {profile?.subRole && (
//                                     <span className="text-gray-500 text-lg">
//                                         ({profile.subRole})
//                                     </span>
//                                 )}
//                             </h1>
//                             {profile?.isVerified && (
//                                 <Tooltip title="حساب موثق">
//                                     <Badge variant="standard" color="success">
//                                         <span className="text-xs">
//                                             <FaCheck className="ml-2" />
//                                             موثق
//                                         </span>
//                                     </Badge>
//                                 </Tooltip>
//                             )}
//                         </div>
//                         <p className="text-gray-600 mt-2">
//                             رقم الطالب: {profile?.id}
//                         </p>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <QRCodeSVG value={`${frontendUrl}/profiles/${profile?.id}`} size={100} />
//                         <Button variant="text" size="small">
//                             <FaQrcode className="ml-2" />
//                             تحميل
//                         </Button>
//                     </div>
//                 </div>
//             </Card>

//             {/* التبويبات */}
//             <Tabs
//                 value={activeTab}
//                 onChange={(value) => setActiveTab(value)}
//                 tabs={[
//                     { value: 0, label: 'البيانات الشخصية', icon: <FaUser />, content: <></> },
//                     { value: 1, label: 'الأمان', icon: <FaLock />, content: <></> },
//                     { value: 2, label: 'التفضيلات', icon: <FaCog />, content: <></> },
//                 ]}
//             />

//             {/* محتوى التبويبات */}
//             {activeTab === 0 && (
//                 <Card title="البيانات الشخصية">
//                     <div className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <Input
//                                 label="الاسم الكامل"
//                                 value={profileData?.firstName + ' ' + profileData?.lastName}
//                                 onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value.split(' ')[0], lastName: e.target.value.split(' ')[1] || '' }))}
//                                 required
//                             />

//                             <Input
//                                 label="البريد الإلكتروني"
//                                 value={profileData?.email}
//                                 onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
//                                 required
//                                 type="email"
//                             />
//                             <Input
//                                 label="رقم الهاتف"
//                                 value={profileData?.phone || ''}
//                                 onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
//                                 type="tel"
//                             />
//                             <Input
//                                 label="العمر"
//                                 value={profileData?.age?.toString() || ''}
//                                 onChange={(e) => setProfileData(prev => ({ ...prev, age: +e.target.value }))}
//                                 type="number"
//                             />
//                         </div>
//                         <div className="flex justify-center">
//                             <Button variant="contained" size="large" onClick={() => updateProfile(profileData)}>
//                                 حفظ التغييرات
//                             </Button>
//                         </div>
//                     </div>
//                 </Card>
//             )}

//             {activeTab === 1 && (
//                 <div className="space-y-6">
//                     <Card title="الأمان">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-bold">كلمة المرور</h3>
//                                 <p className="text-gray-600">قم بتغيير كلمة المرور الخاصة بك</p>
//                             </div>
//                             <Button
//                                 variant="contained"
//                                 onClick={() => setShowPasswordModal(true)}
//                             >
//                                 تغيير كلمة المرور
//                             </Button>
//                         </div>
//                     </Card>

//                     <Card title="التحقق الثنائي">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-bold">التحقق الثنائي</h3>
//                                 <p className="text-gray-600">قم بتفعيل التحقق الثنائي لحماية حسابك</p>
//                             </div>
//                             <Button
//                                 variant="contained"
//                                 onClick={() => setShow2FAModal(true)}
//                             >
//                                 إعداد التحقق الثنائي
//                             </Button>
//                         </div>
//                     </Card>

//                     <Card title="سجل الدخول">
//                         <h3 className="text-lg font-bold mb-4">سجل الدخول</h3>
//                         <div className="space-y-4">
//                             {profile?.loginHistory?.map((login, index) => (
//                                 <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                     <div>
//                                         <p className="font-medium">{login.ip}</p>
//                                         <p className="text-sm text-gray-600">{login.createdAt.toLocaleString()}</p>
//                                     </div>
//                                     <Badge variant={login.success ? 'standard' : 'dot'} color={login.success ? 'success' : 'error'}>
//                                         <span className="text-xs">
//                                             {login.success ? 'ناجح' : 'فاشل'}
//                                         </span>
//                                     </Badge>
//                                 </div>
//                             ))}
//                         </div>
//                     </Card>
//                 </div>
//             )}

//             {activeTab === 2 && (
//                 <div className="space-y-6">
//                     {/* <Card title="التفضيلات">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-bold">اللغة</h3>
//                                 <p className="text-gray-600">اختر لغة واجهة التطبيق</p>
//                             </div>
//                             <Select
//                                 value={profile?.language}
//                                 onChange={(value) => updateProfile({ language: value })}
//                                 options={[
//                                     { value: 'ar', label: 'العربية' },
//                                     { value: 'en', label: 'English' },
//                                 ]}
//                             />
//                         </div>
//                     </Card> */}

//                     <Card title="المظهر">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-lg font-bold">المظهر</h3>
//                                 <p className="text-gray-600">اختر مظهر واجهة التطبيق</p>
//                             </div>
//                             <div className="flex items-center space-x-4">
//                                 <Button
//                                     variant={theme === 'light' ? 'contained' : 'outlined'}
//                                     onClick={() => setTheme('light')}
//                                 >
//                                     <FaSun className="ml-2" />
//                                     فاتح
//                                 </Button>
//                                 <Button
//                                     variant={theme === 'dark' ? 'contained' : 'outlined'}
//                                     onClick={() => setTheme('dark')}
//                                 >
//                                     <FaMoon className="ml-2" />
//                                     داكن
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     onClick={() => setShowNightModeTrial(true)}
//                                 >
//                                     تجربة الوضع الليلي
//                                 </Button>
//                             </div>
//                         </div>
//                     </Card>
//                 </div>
//             )}

//             {/* نافذة تغيير كلمة المرور */}
//             {showPasswordModal && (
//                 <Modal
//                     open={showPasswordModal}
//                     onClose={() => setShowPasswordModal(false)}
//                     title="تغيير كلمة المرور"
//                 >
//                     <div className="space-y-4">
//                         <Input
//                             label="كلمة المرور الحالية"
//                             type="password"
//                             required
//                         />
//                         <Input
//                             label="كلمة المرور الجديدة"
//                             type="password"
//                             required
//                         />
//                         <Input
//                             label="تأكيد كلمة المرور الجديدة"
//                             type="password"
//                             required
//                         />
//                         <div className="flex justify-end space-x-2">
//                             <Button
//                                 variant="outlined"
//                                 onClick={() => setShowPasswordModal(false)}

//                             >
//                                 إلغاء
//                             </Button>
//                             <Button variant="contained">
//                                 حفظ التغييرات
//                             </Button>
//                         </div>
//                     </div>
//                 </Modal>
//             )}

//             {/* نافذة التحقق الثنائي */}
//             {show2FAModal && (
//                 <Modal
//                     open={show2FAModal}
//                     onClose={() => setShow2FAModal(false)}
//                     title="إعداد التحقق الثنائي"
//                 >
//                     <div className="space-y-6">
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <span>البريد الإلكتروني</span>
//                                 <Switch
//                                     checked={profile?.twoFactor?.email}
//                                     onChange={(checked) => update2FA({ email: checked.target.checked })}
//                                 />
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <span>رسالة SMS</span>
//                                 <Switch
//                                     checked={profile?.twoFactor?.sms}
//                                     onChange={(checked) => update2FA({ sms: checked.target.checked })}
//                                 />
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <span>Google Authenticator</span>
//                                 <Switch
//                                     checked={profile?.twoFactor?.authenticator}
//                                     onChange={(checked) => update2FA({ authenticator: checked.target.checked })}
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex justify-end space-x-2">
//                             <Button
//                                 variant="outlined"
//                                 onClick={() => setShow2FAModal(false)}
//                             >
//                                 إلغاء
//                             </Button>
//                             <Button variant="contained">
//                                 حفظ التغييرات
//                             </Button>
//                         </div>
//                     </div>
//                 </Modal>
//             )}


//             {/* تجربة الوضع الليلي */}
//             {showNightModeTrial && (
//                 <Alert variant="standard" color="info">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <FaMoon className="text-primary-500 text-xl" />
//                             <div>
//                                 <p className="font-medium">تجربة الوضع الليلي</p>
//                                 <p className="text-sm text-gray-600">
//                                     سيتم إعادة الوضع السابق بعد 30 ثانية
//                                 </p>
//                             </div>
//                         </div>
//                         <Button
//                             variant="outlined"
//                             size="small"
//                             onClick={() => setShowNightModeTrial(false)}
//                         >
//                             إلغاء التجربة
//                         </Button>
//                     </div>
//                 </Alert>
//             )}
//         </motion.div>
//     );
// } 
export default function StudentProfilePage() {
    redirect('/student/profile/overview/');
}