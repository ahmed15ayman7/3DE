"use client";

import React, { Suspense, use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });
const Tabs = dynamic(() => import('@/components/common/Tabs'), { loading: () => <div></div> });
import { communityApi, courseApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FaSearch, FaPlus, FaComments, FaUsers, FaVideo, FaThumbsUp, FaComment } from 'react-icons/fa';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import { years } from '@/constant';
import { Comment, Discussion, Group, LiveRoom, Post, User } from '@shared/prisma';
import { ChevronDown } from 'lucide-react';

const getCourses = async () => {
    let res = await courseApi.getAll();
    if (res.success) {
        return res.data.map((course) => ({
            value: course.id,
            label: course.title
        }));
    }
    return [];
}
const initialDiscussions: (Discussion & { post: Post & { author: User, comments: Comment[] } })[] = [{
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    communityId: "1",
    postId: "1",
    post: {
        id: "1",
        title: "المناقشة",
        content: "المناقشة",
        createdAt: new Date(),
        authorId: "1",
        likesCount: 0,
        publicRelationsRecordId: null,
        comments: [
            {
                id: "1",
                content: "التعليق",
                createdAt: new Date(),
                postId: "1",
                // author: {
                //     id: "1",
                //     firstName: "أحمد",
                //     lastName: "محمد",
                //     avatar: "https://via.placeholder.com/150",
                //     email: "ahmed@gmail.com",
                //     password: "123456",
                //     phone: "01234567890",
                //     role: "STUDENT",
                //     subRole: "STUDENT",
                //     academyId: "1",
                //     createdAt: new Date(),
                //     updatedAt: new Date(),
                // }
            }
        ],
        author: {
            id: "1",
            firstName: "أحمد",
            lastName: "محمد",
            avatar: "https://via.placeholder.com/150",
            email: "ahmed@gmail.com",
            password: "123456",
            phone: "01234567890",
            role: "STUDENT",
            subRole: "STUDENT",
            academyId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
            isOnline: true,
            isVerified: true,
            age: 20,
        }
    }
},
{
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    communityId: "1",
    postId: "2",
    post: {
        id: "2",
        title: "المناقشة",
        content: "المناقشة",
        createdAt: new Date(),
        authorId: "1",
        likesCount: 0,
        publicRelationsRecordId: null,
        comments: [],
        author: {
            id: "1",
            firstName: "أحمد",
            lastName: "محمد",
            avatar: "https://via.placeholder.com/150",
            email: "ahmed@gmail.com",
            password: "123456",
            phone: "01234567890",
            role: "STUDENT",
            subRole: "STUDENT",
            academyId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
            isOnline: true,
            isVerified: true,
            age: 20,
        }
    }
},
];
const initialLiveRooms: LiveRoom[] = [{
    id: "1",
    title: "الغرفة المباشرة",
    topic: "البرمجة",
    createdAt: new Date(),
    updatedAt: new Date(),
    participants: 0,
    isLive: false,
    isActive: false,
    isPublic: false,
    isPrivate: false,
    isPasswordProtected: false,
    communityId: "1",
    courseId: null,
}];
const initialGroups: (Group & { members: User[] })[] = [
    {
        id: "1",
        name: "حلقة المجتمع التعليمي",
        subject: "البرمجة",
        image: "https://via.placeholder.com/150",
        adminId: "1",
        createdAt: new Date(),
        members: [
            {
                id: "1",
                firstName: "أحمد",
                lastName: "محمد",
                avatar: "https://via.placeholder.com/150",
                email: "ahmed@gmail.com",
                password: "123456",
                phone: "01234567890",
                role: "STUDENT",
                subRole: "STUDENT",
                academyId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                isOnline: true,
                isVerified: true,
                age: 20,
            },
            {
                id: "2",
                firstName: "محمد",
                lastName: "علي",
                avatar: "https://via.placeholder.com/150",
                email: "ali@gmail.com",
                password: "123456",
                phone: "01234567890",
                role: "STUDENT",
                subRole: "STUDENT",
                academyId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                isOnline: true,
                isVerified: true,
                age: 20,
            },
        ],
    },
    {
        id: "2",
        name: "حلقة المجتمع التعليمي",
        subject: "البرمجة",
        image: "https://via.placeholder.com/150",
        adminId: "1",
        createdAt: new Date(),
        members: [],
    }, {
        id: "1",
        name: "حلقة المجتمع التعليمي",
        subject: "البرمجة",
        image: "https://via.placeholder.com/150",
        adminId: "1",
        createdAt: new Date(),
        members: [
            {
                id: "1",
                firstName: "أحمد",
                lastName: "محمد",
                avatar: "https://via.placeholder.com/150",
                email: "ahmed@gmail.com",
                password: "123456",
                phone: "01234567890",
                role: "STUDENT",
                subRole: "STUDENT",
                academyId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                isOnline: true,
                isVerified: true,
                age: 20,
            },
            {
                id: "2",
                firstName: "محمد",
                lastName: "علي",
                avatar: "https://via.placeholder.com/150",
                email: "ali@gmail.com",
                password: "123456",
                phone: "01234567890",
                role: "STUDENT",
                subRole: "STUDENT",
                academyId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                isOnline: true,
                isVerified: true,
                age: 20,
            },
        ],
    }, {
        id: "1",
        name: "حلقة المجتمع التعليمي",
        subject: "البرمجة",
        image: "https://via.placeholder.com/150",
        adminId: "1",
        createdAt: new Date(),
        members: [
            {
                id: "1",
                firstName: "أحمد",
                lastName: "محمد",
                avatar: "https://via.placeholder.com/150",
                email: "ahmed@gmail.com",
                password: "123456",
                phone: "01234567890",
                role: "STUDENT",
                subRole: "STUDENT",
                academyId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                isOnline: true,
                isVerified: true,
                age: 20,
            },
            {
                id: "2",
                firstName: "محمد",
                lastName: "علي",
                avatar: "https://via.placeholder.com/150",
                email: "ali@gmail.com",
                password: "123456",
                phone: "01234567890",
                role: "STUDENT",
                subRole: "STUDENT",
                academyId: "1",
                createdAt: new Date(),
                updatedAt: new Date(),
                isOnline: true,
                isVerified: true,
                age: 20,
            },
        ],
    },
]
const initialCourses: { label: string, value: string }[] = [
    {
        label: 'البرمجة بلغة Python',
        value: '1',
    },
    {
        label: 'تطوير تطبيقات الويب',
        value: '2',
    },
];
const initialMyPosts: (Post & { author: User, comments: Comment[] })[] = [
    {
        id: "1",
        title: "المناقشة",
        content: "المناقشة",
        createdAt: new Date(),
        authorId: "1",
        likesCount: 0,
        comments: [],
        publicRelationsRecordId: null,
        author: {
            id: "1",
            firstName: "أحمد",
            lastName: "محمد",
            avatar: "https://via.placeholder.com/150",
            email: "ahmed@gmail.com",
            password: "123456",
            phone: "01234567890",
            role: "STUDENT",
            subRole: "STUDENT",
            academyId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
            isOnline: true,
            isVerified: true,
            age: 20,
        }
    },
    {
        id: "2",
        title: "المناقشة",
        content: "المناقشة",
        createdAt: new Date(),
        authorId: "1",
        likesCount: 0,
        comments: [],
        publicRelationsRecordId: null,
        author: {
            id: "1",
            firstName: "أحمد",
            lastName: "محمد",
            avatar: "https://via.placeholder.com/150",
            email: "ahmed@gmail.com",
            password: "123456",
            phone: "01234567890",
            role: "STUDENT",
            subRole: "STUDENT",
            academyId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
            isOnline: true,
            isVerified: true,
            age: 20,
        }
    }
];


 function StudentCommunity({ params }: { params: { id: string } }) {
    const { id } = params;
    const [activeTab, setActiveTab] = useState(0);
    const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        subject: '',
        type: '',
        year: '',
        participant: ''
    });

    // استعلامات البيانات
    const { data: discussions, isLoading: isLoadingDiscussions } = useQuery({
        queryKey: ['discussions'],
        queryFn: () => communityApi.getDiscussions(id),
    });

    const { data: groups, isLoading: isLoadingGroups } = useQuery({
        queryKey: ['groups'],
        queryFn: () => communityApi.getGroups(id),
    });

    const { data: myPosts, isLoading: isLoadingMyPosts } = useQuery({
        queryKey: ['myPosts'],
        queryFn: () => communityApi.getPosts(id),
    });

    // const { data: leaderboard, isLoading: isLoadingLeaderboard } = useQuery({
    //     queryKey: ['leaderboard'],
    //     queryFn: () => communityApi.getLeaderboard(id),
    // });

    const { data: liveRooms, isLoading: isLoadingLiveRooms } = useQuery({
        queryKey: ['liveRooms'],
        queryFn: () => communityApi.getLiveRooms(id),
    });
    const { data: courses, isLoading: isLoadingCourses } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCourses(),
    });

    if (isLoadingDiscussions || isLoadingGroups || isLoadingMyPosts || isLoadingLiveRooms || isLoadingCourses) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height={200} />
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
                    <h1 className="text-2xl font-bold">المجتمع التعليمي 💬</h1>
                    <p className="text-gray-600">
                        تواصل مع زملائك ومعلميك وشارك في المناقشات
                    </p>
                </div>
                <Button
                    variant="default"
                    onClick={() => setShowNewQuestionModal(true)}
                >
                    <FaPlus className="ml-2" />
                    اسأل سؤال جديد
                </Button>
            </div>

            {/* البحث والفلترة */}
            <Card title=''>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Input
                        placeholder="ابحث عن مناقشة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        startIcon={<FaSearch />}
                    />
                    <div className="relative">
                        <Input
                            placeholder="المادة"
                            value={filters.subject}
                            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                            startIcon={<ChevronDown className="text-gray-500" />}
                        />
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {courses?.map((course) => (
                                <li
                                    key={course.value}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => setFilters({ ...filters, subject: course.value })}
                                >
                                    {course.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <Input
                            placeholder="النوع"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            startIcon={<ChevronDown className="text-gray-500" />}
                        />
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {[
                                { value: 'question', label: 'سؤال' },
                                { value: 'discussion', label: 'مناقشة' },
                                { value: 'resource', label: 'مصدر' },
                            ].map((option) => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => setFilters({ ...filters, type: option.value })}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <Input
                            placeholder="السنة"
                            value={filters.year}
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                            startIcon={<ChevronDown className="text-gray-500" />}
                        />
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {years.map((year) => (
                                <li
                                    key={year.value}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => setFilters({ ...filters, year: year.value })}
                                >
                                    {year.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <Input
                            placeholder="المشارك"
                            value={filters.participant}
                            onChange={(e) => setFilters({ ...filters, participant: e.target.value })}
                            startIcon={<ChevronDown className="text-gray-500" />}
                        />
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {[
                                { value: 'instructor', label: 'المدرس' },
                                { value: 'student', label: 'الطالب' },
                                { value: 'all', label: 'الكل' },
                                { value: "academy", label: 'الاكاديمية' },
                                { value: "parent", label: 'اولياء الامور' },
                            ].map((option) => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => setFilters({ ...filters, participant: option.value })}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>

            {/* التبويبات */}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                tabs={[
                    {
                        value: 0, label: 'المناقشات', icon: <FaComments />, content: <div className="space-y-4">
                            {(discussions ?? initialDiscussions).map((discussion, index) => (
                                <motion.div
                                    key={discussion.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card title={discussion.post.title}>
                                        <div className="flex items-start space-x-4">
                                            <Avatar src={discussion.post.author.avatar || ""} size="lg" />
                                            <div className="flex-1">
                                                {/* <div className="flex items-center justify-between">
                                                    <Badge variant={discussion.post.type === 'question' ? 'standard' : 'dot'}>
                                                        <span className="text-sm">
                                                            {discussion.post.type === 'question' ? 'سؤال' : 'مناقشة'}
                                                        </span>
                                                    </Badge>
                                                </div> */}
                                                <p className="text-gray-600 mt-2">{discussion.post.content}</p>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm text-gray-500">
                                                            {discussion.post.author.firstName} {discussion.post.author.lastName}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {format(new Date(discussion.createdAt), 'd MMMM yyyy', { locale: ar })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <Button variant="default" size="sm">
                                                            <FaThumbsUp className="ml-2" />
                                                            {discussion.post.likesCount}
                                                        </Button>
                                                        <Button variant="default" size="sm">
                                                            <FaComment className="ml-2" />
                                                            {discussion.post.comments.length}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    },
                    {
                        value: 1, label: 'المجموعات', icon: <FaUsers />, content: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(groups ?? initialGroups).map((group, index) => (
                                <motion.div
                                    key={group.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card title={group.name} className='h-full'>
                                        <div className="flex items-center space-x-4 mb-4">
                                            {group.image && <Avatar src={group.image} size="lg" />}
                                            <div>
                                                <h3 className="text-lg font-bold">{group.name}</h3>
                                                <p className="text-sm text-gray-600">{group.subject}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            {/* <Badge variant={group.status === 'new' ? 'standard' : 'dot'}>
                                                <span className="text-sm">
                                                    {group.status === 'new' ? 'جديدة' :
                                                        group.status === 'active' ? 'نشطة' :
                                                            'بها مناقشات'}
                                                </span>
                                            </Badge> */}
                                            <div className="flex items-center space-x-2">
                                                <FaUsers className="text-gray-500" />
                                                <span className="text-sm text-gray-600">{group.members.length} عضو</span>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    },
                    {
                        value: 2, label: 'مشاركاتي', icon: <FaThumbsUp />, content: <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(myPosts ?? initialMyPosts).map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card title={post.title}>
                                        <p className="text-gray-600">{post.content}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-500">{post.author.firstName} {post.author.lastName}</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Button variant="default" size="sm">
                                                    <FaThumbsUp className="ml-2" />
                                                    {post.likesCount}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                            {/* <Card title='إحصائيات مشاركاتي'>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{myPosts?.questions}</p>
                                        <p className="text-gray-600">أسئلة</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{myPosts?.answers}</p>
                                        <p className="text-gray-600">إجابات</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{myPosts?.likes}</p>
                                        <p className="text-gray-600">إعجابات</p>
                                    </div>
                                </div>
                            </Card> */}
                            {/* <Card title='آخر مشاركاتي'>
                                <div className="space-y-4">
                                    {myPosts?.recent.map((post, index) => (
                                        <Alert key={index} variant="outlined" title={post.title} message={format(new Date(post.createdAt), 'd MMMM yyyy', { locale: ar })}>
                                            <p className="font-medium">{post.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {format(new Date(post.createdAt), 'd MMMM yyyy', { locale: ar })}
                                        </p> 
                                        </Alert>
                                    ))}
                                </div>
                            </Card> */}
                        </div>
                    },
                    // {
                    //     value: 2, label: 'قائمة المتصدرين', icon: <FaTrophy />, content: <Card title='قائمة المتصدرين'>
                    //         <div className="space-y-4">
                    //             {leaderboard?.map((student, index) => (
                    //                 <motion.div
                    //                     key={student.id}
                    //                     initial={{ opacity: 0, x: -20 }}
                    //                     animate={{ opacity: 1, x: 0 }}
                    //                     transition={{ duration: 0.5, delay: index * 0.1 }}
                    //                 >
                    //                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    //                         <div className="flex items-center space-x-4">
                    //                             <Avatar src={student.avatar} size="lg" />
                    //                             <div>
                    //                                 <h3 className="font-bold">{student.name}</h3>
                    //                                 <p className="text-sm text-gray-600">{student.role}</p>
                    //                             </div>
                    //                         </div>
                    //                         <div className="flex items-center space-x-4">
                    //                             <Badge variant="standard">
                    //                                 <span className="text-sm">
                    //                                     {student.points} نقطة
                    //                                 </span>
                    //                             </Badge>
                    //                             {student.badge && (
                    //                                 <Tooltip title={student.badge.description}>
                    //                                     <FaTrophy className="text-yellow-500" />
                    //                                 </Tooltip>
                    //                             )}
                    //                         </div>
                    //                     </div>
                    //                 </motion.div>
                    //             ))}
                    //         </div>
                    //     </Card>
                    // },
                    {
                        value: 3, label: 'الغرف المباشرة', icon: <FaVideo />, content: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(liveRooms ?? initialLiveRooms).map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card title={room.title} className="h-full">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <FaVideo className="text-primary-500 text-2xl" />
                                            <div>
                                                <h3 className="text-lg font-bold">{room.title}</h3>
                                                <p className="text-sm text-gray-600">{room.topic}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <FaUsers className="text-gray-500" />
                                                <span className="text-sm text-gray-600">{room.participants} مشارك</span>
                                            </div>
                                            <Button
                                                variant="default"
                                            // onClick={() => communityApi.joinRoom(room.id)}
                                            >
                                                انضم الآن
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    },
                ]}
            />

            {/* نافذة السؤال الجديد */}
            {
                showNewQuestionModal && (
                    <Modal
                        open={showNewQuestionModal}
                        onClose={() => setShowNewQuestionModal(false)}
                        title="سؤال جديد"
                    >
                        <div className="space-y-4">
                            <Input
                                label="عنوان السؤال"
                                placeholder="اكتب عنواناً واضحاً لسؤالك"
                                required
                            />
                            <div className="relative">
                                <Input
                                    label="المادة"
                                    value={filters.subject}
                                    onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                                    startIcon={<ChevronDown className="text-gray-500" />}
                                />
                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {courses?.map((course) => (
                                        <li
                                            key={course.value}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => setFilters({ ...filters, subject: course.value })}
                                        >
                                            {course.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Input
                                label="تفاصيل السؤال"
                                placeholder="اكتب تفاصيل سؤالك هنا..."
                                required
                                multiline
                                rows={5}
                            />
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowNewQuestionModal(false)}
                                >
                                    إلغاء
                                </Button>
                                <Button variant="default">
                                    نشر السؤال
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </motion.div >
    );
} 
export default function StudentCommunityS({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<Skeleton />}>
            <StudentCommunity params={params} />
        </Suspense>
    );
}