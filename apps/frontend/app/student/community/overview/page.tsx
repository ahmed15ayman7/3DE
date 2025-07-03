"use client"

import React, { useState, useEffect,useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Box, 
    Typography, 
    Grid, 
    Container, 
    TextField, 
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
    Skeleton,
    Alert
} from '@mui/material';
import {
    Search as SearchIcon,
    Group as GroupIcon,
    Forum as ForumIcon,
    VideoCall as VideoCallIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Visibility as VisibilityIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
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
                return 'primary';
            case 'social':
                return 'success';
            case 'professional':
                return 'warning';
            case 'hobby':
                return 'info';
            default:
                return 'default';
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
                return 'هوايات';
            default:
                return type;
        }
    };

    const handleCommunityClick = (communityId: string,isJoin:boolean) => {
        // Navigate to community details
        if(isJoin){
            router.push(`/student/community/${communityId}/overview`)
        }else{
            communityApi.addParticipant(communityId,user.id).then(res=>{
                if(res.status>=200 && res.status<300){
                    router.push(`/student/community/${communityId}/overview`)
                }
            })
        }
    };

    const handleLike = (communityId: string) => {
        // Handle like functionality
        console.log('Liked community:', communityId);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" className="py-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={headerVariants}
                >
                    <Typography variant="h4" className="font-bold mb-8 text-center">
                        المجتمعات
                    </Typography>
                </motion.div>
                
                <Grid container spacing={3}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" className="py-8">
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <React.Suspense fallback={<div>جاري التحميل...</div>}>
                <HeroSection
                    title="اكتشف عالم المجتمعات"
                    subtitle="انضم إلى مجتمعات متنوعة"
                    description="انضم إلى مجتمعات متنوعة وشارك في النقاشات والأنشطة التعليمية والاجتماعية. اكتشف أشخاص جدد وتبادل المعرفة والخبرات."
                    primaryAction={{
                        label: "استكشف المجتمعات",
                        onClick: () => heroRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    secondaryAction={{
                        label: "كيف تعمل المجتمعات",
                        onClick: () => console.log('Learn more clicked')
                    }}
                    features={[
                        {
                            icon: <GroupIcon />,
                            title: "مجتمعات متنوعة",
                            description: "انضم إلى مجتمعات أكاديمية واجتماعية ومهنية"
                        },
                        {
                            icon: <ForumIcon />,
                            title: "نقاشات تفاعلية",
                            description: "شارك في النقاشات والمناقشات المثمرة"
                        },
                        {
                            icon: <VideoCallIcon />,
                            title: "غرف مباشرة",
                            description: "انضم إلى الغرف المباشرة للتفاعل المباشر"
                        }
                    ]}
                    variant="split"
                    className="mb-8"
                />
            </React.Suspense>
                <div className="pb-24"  ref={heroRef}></div>
            <Container maxWidth="lg" className="pb-8">
                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                   
                    variants={headerVariants}
                    className="mb-8"
                >
                    <Typography variant="h4"  className="font-bold mb-4 text-center">
                        استكشف المجتمعات
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 text-center mb-6">
                        اختر من بين مجموعة متنوعة من المجتمعات
                    </Typography>

                {/* Search and Filter Section */}
                <Box className="flex flex-col sm:flex-row gap-4 mb-6">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="ابحث في المجتمعات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        className="sm:flex-1"
                    />
                    
                    <Box className="flex gap-2 flex-wrap">
                        {['all', 'academic', 'social', 'professional', 'hobby'].map((type) => (
                            <Chip
                                key={type}
                                label={type === 'all' ? 'الكل' : getCommunityTypeLabel(type)}
                                onClick={() => setSelectedType(type)}
                                color={selectedType === type ? 'primary' : 'default'}
                                variant={selectedType === type ? 'filled' : 'outlined'}
                                className="cursor-pointer"
                            />
                        ))}
                    </Box>
                </Box>
            </motion.div>

            {/* Overall Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
            >
                <React.Suspense fallback={<div>جاري التحميل...</div>}>
                    <StatsCard
                        title="إحصائيات المجتمعات"
                        stats={[
                            {
                                label: "إجمالي المجتمعات",
                                value: overallStats.totalCommunities,
                                icon: <GroupIcon />,
                                color: "primary"
                            },
                            {
                                label: "إجمالي الأعضاء",
                                value: overallStats.totalParticipants,
                                icon: <GroupIcon />,
                                color: "success"
                            },
                            {
                                label: "إجمالي المنشورات",
                                value: overallStats.totalPosts,
                                icon: <ForumIcon />,
                                color: "info"
                            },
                            {
                                label: "إجمالي النقاشات",
                                value: overallStats.totalDiscussions,
                                icon: <ForumIcon />,
                                color: "warning"
                            }
                        ]}
                        variant="compact"
                        className="mb-6"
                    />
                </React.Suspense>
            </motion.div>

            {/* Communities Grid */}
            <React.Suspense fallback={
                <Grid container spacing={3}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                    ))}
                </Grid>
            }>
                <AnimatePresence>
                    {filteredCommunities.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <EmptyState
                                icon={<GroupIcon />}
                                title="لا توجد مجتمعات"
                                description={searchTerm || selectedType !== 'all' 
                                    ? "لا توجد مجتمعات تطابق معايير البحث" 
                                    : "لم يتم إنشاء أي مجتمعات بعد"
                                }
                            />
                        </motion.div>
                    ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Grid container spacing={3}>
                            {filteredCommunities.map((community, index) => {
                                const stats = getCommunityStats(community);
                                
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={community.id}>
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                            layout
                                        >
                                            <Card
                                                // variant="course"
                                                title={community.name}
                                                description={community.description||''}
                                                // image={community.image || '/api/placeholder/400/200'}
                                                tags={[getCommunityTypeLabel(community.type)]}
                                                onClick={() => handleCommunityClick(community.id,community.participants.find(p=>p.id===user?.id)?true:false)}
                                                className="h-full cursor-pointer transition-all duration-300"
                                                actionText={community.participants.find(p=>p.id===user?.id)?"عرض للمجتمع":"انضم المجتمع"}
                                                onAction={() => handleCommunityClick(community.id,community.participants.find(p=>p.id===user?.id)?true:false)}
                                            >
                                                <Box className="p-4 pt-0">
                                                    {/* Stats Section */}
                                                    <Box className="flex justify-between items-center mb-4">
                                                        <Box className="flex items-center gap-1">
                                                            <GroupIcon className="text-primary text-sm" />
                                                            <Typography variant="body2" className="text-gray-600">
                                                                {stats.participants} عضو
                                                            </Typography>
                                                        </Box>
                                                        <Box className="flex items-center gap-1">
                                                            <ForumIcon className="text-primary text-sm" />
                                                            <Typography variant="body2" className="text-gray-600">
                                                                {stats.posts} منشور
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Additional Stats */}
                                                    <Box className="flex justify-between items-center mb-4">
                                                        <Box className="flex items-center gap-1">
                                                            <VideoCallIcon className="text-primary text-sm" />
                                                            <Typography variant="body2" className="text-gray-600">
                                                                {stats.liveRooms} غرفة
                                                            </Typography>
                                                        </Box>
                                                        <Box className="flex items-center gap-1">
                                                            <GroupIcon className="text-primary text-sm" />
                                                            <Typography variant="body2" className="text-gray-600">
                                                                {stats.groups} مجموعة
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Engagement Stats */}
                                                    <Box className="flex justify-between items-center">
                                                        <Box className="flex items-center gap-2">
                                                            <Tooltip title="الإعجابات">
                                                                <IconButton 
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleLike(community.id);
                                                                    }}
                                                                >
                                                                    {community.likes > 0 ? (
                                                                        <FavoriteIcon className="text-red-500 text-sm" />
                                                                    ) : (
                                                                        <FavoriteBorderIcon className="text-gray-400 text-sm" />
                                                                    )}
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Typography variant="body2" className="text-gray-600">
                                                                {community.likes}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Box className="flex items-center gap-1">
                                                            <VisibilityIcon className="text-gray-400 text-sm" />
                                                            <Typography variant="body2" className="text-gray-600">
                                                                {community.views}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </motion.div>
                )}
                </AnimatePresence>
            </React.Suspense>
        </Container>
        </Box>
    );
};

export default CommunityOverviewPage;
