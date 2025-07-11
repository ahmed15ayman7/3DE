"use client";

import React, { Suspense, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { certificateApi, badgeApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Linkedin, Download, QrCode, Medal, Trophy, Eye, History as HistoryIcon, FileText as Description } from 'lucide-react';
import { Certificate, Badge as BadgeType } from '@shared/prisma';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div></div> });
const Alert = dynamic(() => import('@/components/common/Alert'), { loading: () => <div></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div></div> });
const Tabs = dynamic(() => import('@/components/common/Tabs'), { loading: () => <div></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });
const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { loading: () => <div></div> });
const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { loading: () => <div></div> });
const Input = dynamic(() => import('@/components/common/Input'), { loading: () => <div></div> });
const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div></div> });

const initialBadges: BadgeType[] = [
    {
        id: '1',
        title: 'شهادة المؤهل العلمي',
        description: 'شهادة المؤهل العلمي',
        image: 'https://marketplace.canva.com/EAFlVDzb7sA/3/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-Qn4Rei141MM.jpg',
        earnedAt: new Date('2021-01-01'),
        createdAt: new Date('2021-01-01'),
        userId: '1',
        type: 'medal',
        points: 100,
    },
    {
        id: '2',
        title: 'شهادة المؤهل العلمي',
        description: 'شهادة المؤهل العلمي',
        image: 'https://marketplace.canva.com/EAFlVDzb7sA/3/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-Qn4Rei141MM.jpg',
        earnedAt: new Date('2021-01-01'),
        createdAt: new Date('2021-01-01'),
        userId: '1',
        type: 'trophy',
        points: 100,
    },
];

const initialCertificates: Certificate[] = [
    {
        id: '1',
        title: 'شهادة المؤهل العلمي',
        description: 'شهادة المؤهل العلمي',
        image: 'https://marketplace.canva.com/EAFlVDzb7sA/3/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-Qn4Rei141MM.jpg',
        earnedAt: new Date('2021-01-01'),
        createdAt: new Date('2021-01-01'),
        name: 'محمد علي',
        address: 'الرياض',
        phone: '0599999999',
        notes: 'شهادة المؤهل العلمي',
        userId: '1',
        type: 'certificate',
        url: 'https://via.placeholder.com/150',
        points: 100,
    },
    {
        id: '2',
        title: 'شهادة المؤهل العلمي',
        description: 'شهادة المؤهل العلمي',
        image: 'https://marketplace.canva.com/EAFlVDzb7sA/3/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-Qn4Rei141MM.jpg',
        earnedAt: new Date('2021-01-01'),
        createdAt: new Date('2021-01-01'),
        name: 'محمد علي',
        address: 'الرياض',
        phone: '0599999999',
        notes: 'شهادة المؤهل العلمي',
        userId: '1',
        type: 'certificate',
        url: 'https://via.placeholder.com/150',
        points: 100,
    },
];

export default function StudentCertificates() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState(0);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [certificate, setCertificate] = useState("");
    const [requestData, setRequestData] = useState({
        name: '',
        address: '',
        phone: '',
        notes: '',
        userId: '',
        title: '',
        description: '',
        points: 0,
        type: '',
        earnedAt: '',
    });

    // استعلامات البيانات
    const { data: certificates, isLoading: isLoadingCertificates } = useQuery({
        queryKey: ['certificates'],
        queryFn: () => certificateApi.getByStudent(user.id),
    });

    const { data: badges, isLoading: isLoadingBadges } = useQuery({
        queryKey: ['badges'],
        queryFn: () => badgeApi.getByStudent(user.id),
    });

    // طلب شهادة مطبوعة
    const { mutate: requestCertificate, isPending: isRequesting } = useMutation({
        mutationFn: (data: {
            name: string;
            address: string;
            phone: string;
            notes: string;
            userId: string;
            title: string;
            description?: string;
            url?: string;
            image?: string;
            points: number;
            type: string;
            earnedAt: string;
        }) => certificateApi.create(data),
        onSuccess: () => {
            setShowRequestForm(false);
            setRequestData({ name: '', address: '', phone: '', notes: '', userId: '', title: '', description: '', points: 0, type: '', earnedAt: '' });
        }
    });

    if (isLoadingCertificates || isLoadingBadges) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} height={300} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* العنوان */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">شهاداتي وإنجازاتي 🏆</h1>
                    <p className="text-gray-600">
                        عرض وإدارة شهاداتك الأكاديمية وإنجازاتك الرقمية
                    </p>
                </div>
                <Button variant="default" onClick={() => setShowRequestForm(true)}>
                    طلب شهادة مطبوعة
                </Button>
            </div>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                tabs={[
                    {
                        value: 0,
                        label: 'الشهادات',
                        icon: <Description />,
                        content: (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(certificates?.data ?? initialCertificates)?.map((certificate, index) => (
                                    <motion.div
                                        key={certificate.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card title={certificate.title} className="h-full">
                                            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                                                <img
                                                    src={certificate.image || ''}
                                                    alt={certificate.title}
                                                    onClick={() => setCertificate(certificate.image || "")}
                                                    className="w-full h-full object-cover cursor-pointer"
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">{certificate.title}</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {format(new Date(certificate.earnedAt), 'd MMMM yyyy', { locale: ar })}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex space-x-2">
                                                    <Tooltip title="تحميل">
                                                        <Button variant="outline" size="sm">
                                                            <Download />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="مشاركة على LinkedIn">
                                                        <Button variant="outline" size="sm">
                                                            <Linkedin />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="رمز التحقق">
                                                        <Button variant="outline" size="sm">
                                                            <QrCode />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                                <Badge variant="standard" className="text-sm">
                                                    <span className="text-sm">{certificate.type}</span>
                                                </Badge>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    },
                    {
                        value: 1,
                        label: 'الإنجازات',
                        icon: <Trophy />,
                        content: (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(badges?.data ?? initialBadges)?.map((badge, index) => (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card title={badge.title} className="h-full">
                                            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                                                <img
                                                    src={badge.image || ''}
                                                    alt={badge.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">{badge.title}</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {format(new Date(badge.earnedAt), 'd MMMM yyyy', { locale: ar })}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex space-x-2">
                                                    <Tooltip title="عرض التفاصيل">
                                                        <Button variant="outline" size="sm">
                                                            <Eye />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="مشاركة">
                                                        <Button variant="outline" size="sm">
                                                            <Linkedin />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                                <Badge variant="standard" className="text-sm">
                                                    <span className="text-sm">{badge.points} نقطة</span>
                                                </Badge>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    },
                ]}
            />

            {/* Modal طلب شهادة مطبوعة */}
            {showRequestForm && (
                <Modal
                    open={showRequestForm}
                    onClose={() => setShowRequestForm(false)}
                    title="طلب شهادة مطبوعة"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="الاسم الكامل"
                                value={requestData.name}
                                onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                            />
                            <Input
                                label="العنوان"
                                value={requestData.address}
                                onChange={(e) => setRequestData({ ...requestData, address: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="رقم الجوال"
                                value={requestData.phone}
                                onChange={(e) => setRequestData({ ...requestData, phone: e.target.value })}
                            />
                            <Input
                                label="ملاحظات"
                                value={requestData.notes}
                                onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                                إلغاء
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => requestCertificate(requestData)}
                                disabled={isRequesting}
                            >
                                {isRequesting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal عرض الشهادة */}
            {showCertificate && certificate && (
                <Modal
                    open={showCertificate}
                    onClose={() => setShowCertificate(false)}
                    title="عرض الشهادة"
                >
                    <div className="text-center">
                        <img
                            src={certificate}
                            alt="شهادة"
                            className="w-full h-auto rounded-lg"
                        />
                        <div className="flex justify-center space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setShowCertificate(false)}>
                                إغلاق
                            </Button>
                            <Button variant="default">
                                <Download className="h-4 w-4 mr-2" />
                                تحميل
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </motion.div>
    );
}
