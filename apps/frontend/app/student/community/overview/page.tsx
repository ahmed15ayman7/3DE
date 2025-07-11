"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search,
    Users,
    MessageSquare,
    Video,
    Heart,
    Eye,
    TrendingUp
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamic imports for common components
const Card = dynamic(() => import('@/components/common/Card'),{loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});
const Badge = dynamic(() => import('@/components/common/Badge'),{loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});
const EmptyState = dynamic(() => import('@/components/common/EmptyState'),{loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});
const SkeletonComponent = dynamic(() => import('@/components/common/Skeleton'),{loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});
const StatsCard = dynamic(() => import('@/components/common/StatsCard'),{loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});
const FeatureCard = dynamic(() => import('@/components/common/FeatureCard'),{loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});
const HeroSection = dynamic(() => import('@/components/common/HeroSection'),{loading:()=>{
    return <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div>
}});

import { communityApi } from '@/lib/api';
import { Community, Post, Discussion, LiveRoom, Group, User } from '@shared/prisma';
import { useUser } from '@/hooks/useUser';

interface CommunityWithParticipants extends Community {
    participants: User[];
}

const CommunityOverviewPage = () => {
    let {user,status}=useUser();
    const router = useRouter();
    const heroRef = useRef<HTMLDivElement>(null);
    const [communities, setCommunities] = useState<(Community & { participants: User[],posts:Post[],discussions:Discussion[],liveRooms:LiveRoom[],groups:Group[] })[]>([]);
    const [filteredCommunities, setFilteredCommunities] = useState<(Community & { participants: User[],posts:Post[],discussions:Discussion[],liveRooms:LiveRoom[],groups:Group[] })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [overallStats, setOverallStats] = useState({
        totalCommunities: 0,
        totalParticipants: 0,
        totalPosts: 0,
        totalDiscussions: 0
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.9
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -10,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    useEffect(() => {
        filterCommunities();
    }, [communities, searchTerm, selectedType]);

    const fetchCommunities = async () => {
        try {
            setLoading(true);
            const response = await communityApi.getAll();
            if (response.status>=200 && response.status<300) {
                setCommunities(response.data);
                
                // Calculate overall stats
                const stats = {
                    totalCommunities: response.data.length,
                    totalParticipants: response.data.reduce((sum, community) => sum + community.participants.length, 0),
                    totalPosts: response.data.reduce((sum, community) => sum + (community.posts?.length || 0), 0),
                    totalDiscussions: response.data.reduce((sum, community) => sum + (community.discussions?.length || 0), 0)
                };
                setOverallStats(stats);
            } else {
                setError('فشل في تحميل المجتمعات');
            }
        } catch (err) {
            setError('حدث خطأ أثناء تحميل المجتمعات');
            console.error('Error fetching communities:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterCommunities = () => {
        let filtered = communities;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(community =>
                community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                community.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by type
        if (selectedType !== 'all') {
            filtered = filtered.filter(community => community.type === selectedType);
        }

        setFilteredCommunities(filtered);
    };

    const getCommunityStats = (community: Community & { participants: User[],posts:Post[],discussions:Discussion[],liveRooms:LiveRoom[],groups:Group[] }) => ({
        participants: community.participants.length,
        posts: community.posts?.length || 0,
        discussions: community.discussions?.length || 0,
        liveRooms: community.liveRooms?.length || 0,
        groups: community.groups?.length || 0
    });

    const getCommunityTypeColor = (type: string) => {
        switch (type) {
            case 'academic':
                return 'bg-blue-100 text-blue-800';
            case 'social':
                return 'bg-green-100 text-green-800';
            case 'professional':
                return 'bg-yellow-100 text-yellow-800';
            case 'hobby':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCommunityTypeLabel = (type: string) => {
        switch (type) {
            case 'academic':
                return 'أكاديمي';
            case 'social':
                return 'اجتماعي';
            case 'professional':
                return 'مهني';
            case 'hobby':
                return 'هواية';
            default:
                return 'عام';
        }
    };

    const handleCommunityClick = (communityId: string, isJoin: boolean) => {
        if (isJoin) {
            // Handle join logic
            console.log('Joining community:', communityId);
        } else {
            router.push(`/student/community/${communityId}`);
        }
    };

    const handleLike = (communityId: string) => {
        // Handle like logic
        console.log('Liking community:', communityId);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <SkeletonComponent height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonComponent key={i} height={300} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="mr-3">
                        <h3 className="text-sm font-medium text-red-800">خطأ</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Hero Section */}
            <motion.div
                ref={heroRef}
                variants={headerVariants}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-bold text-gray-900">المجتمعات التعليمية</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    انضم إلى مجتمعات تعليمية متنوعة وشارك في المناقشات والتعلم الجماعي
                </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                variants={cardVariants}
                className="flex flex-col md:flex-row gap-4 items-center justify-between"
            >
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="البحث في المجتمعات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                
                <div className="flex gap-2">
                    {['all', 'academic', 'social', 'professional', 'hobby'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedType === type
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {type === 'all' ? 'الكل' : getCommunityTypeLabel(type)}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                variants={cardVariants}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
                <StatsCard
                    title="إحصائيات المجتمعات"
                    stats={[
                        {
                            label: "إجمالي المجتمعات",
                            value: overallStats.totalCommunities,
                            icon: <Users className="h-5 w-5" />,
                            color: "primary"
                        },
                        {
                            label: "إجمالي المشاركين",
                            value: overallStats.totalParticipants,
                            icon: <Users className="h-5 w-5" />,
                            color: "success"
                        },
                        {
                            label: "إجمالي المنشورات",
                            value: overallStats.totalPosts,
                            icon: <MessageSquare className="h-5 w-5" />,
                            color: "info"
                        },
                        {
                            label: "إجمالي المناقشات",
                            value: overallStats.totalDiscussions,
                            icon: <TrendingUp className="h-5 w-5" />,
                            color: "warning"
                        }
                    ]}
                    variant="compact"
                />
            </motion.div>

            {/* Communities Grid */}
            <motion.div
                variants={cardVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredCommunities.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyState
                            icon={<Users className="h-12 w-12 text-gray-400" />}
                            title="لا توجد مجتمعات"
                            description="لم يتم العثور على مجتمعات تطابق معايير البحث"
                        />
                    </div>
                ) : (
                    filteredCommunities.map((community, index) => {
                        const stats = getCommunityStats(community);
                        return (
                            <motion.div
                                key={community.id}
                                variants={cardVariants}
                                whileHover="hover"
                                className="cursor-pointer"
                                onClick={() => handleCommunityClick(community.id, false)}
                            >
                                <Card title="" className="h-full hover:shadow-lg transition-shadow">
                                    <div className="space-y-4">
                                        {/* Community Image */}
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={community.image || 'https://via.placeholder.com/400x200'}
                                                alt={community.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Community Info */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {community.name}
                                                </h3>
                                                <Badge variant="standard" className={getCommunityTypeColor(community.type)}>
                                                    <span className="text-xs">
                                                        {getCommunityTypeLabel(community.type)}
                                                    </span>
                                                </Badge>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {community.description || 'لا يوجد وصف متاح'}
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">{stats.participants} مشارك</span>
                                            </div>
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">{stats.posts} منشور</span>
                                            </div>
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <Video className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">{stats.liveRooms} غرفة</span>
                                            </div>
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <TrendingUp className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">{stats.discussions} مناقشة</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLike(community.id);
                                                }}
                                                className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <Heart className="h-4 w-4" />
                                                <span className="text-xs">إعجاب</span>
                                            </button>
                                            
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCommunityClick(community.id, true);
                                                }}
                                                className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                                            >
                                                انضم الآن
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>
        </motion.div>
    );
};

export default CommunityOverviewPage;
