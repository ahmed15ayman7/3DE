'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Container,
    ToggleButtonGroup,
    ToggleButton,
    Skeleton,
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { adminAuthApi } from '@/lib/api';
import {
    People as PeopleIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Gavel as GavelIcon,
    Description as DescriptionIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

type TimeRange = 'day' | 'week' | 'month' | 'year';
let initialStats = {
    users: {
        total: 4,
        students: 6,
        instructors: 7,
        admins: 8,
    },
    courses: {
        total: 9,
        active: 4,
        completed: 5,
        pending: 6,
    },
    attendance: {
        present: 3,
        absent: 7,
        late: 1,
    },
    paths: {
        total: 3,
        milestones: 1,
        completedTasks: {
            _sum: {
                completedTasks: 22,
            },
        },
        totalTasks: {
            _sum: {
                totalTasks: 29,
            },
        },
    },
    community: {
        total: 60,
        groups: 10,
        posts: 30,
        discussions: 20,
        liveRooms: 10,
    },
    assessments: {
        quizzes: 10,
        questions: 10,
        submissions: 10,
        passed: 10,
    },
    finance: {
        totalAmount: {
            _sum: {
                amount: 10000,
            },
        },
        totalPayments: 10,
        salaryAmount: {
            _sum: {
                amount: 1000,
            },
        },
        salaryPayments: 10,
    },
    publicRelations: {
        records: 10,
        responses: 10,
        events: 10,
        pending: 10,
    },
    secretariat: {
        meetings: 10,
        participants: 10,
        attended: 10,
    },
    legal: {
        activeCases: 10,
        cases: 10,
        contracts: 10,
    },
    marketing: {
        campaigns: 10,
        leads: 10,
        conversions: 10,
        revenue: 10,
    },
    operations: {
        total: 10,
        active: 10,
        completed: 10,
        pending: 10,
    },
    support: {
        tickets: 10,
        resolved: 10,
        pending: 10,
    },
    settings: {
        users: 10,
        roles: 10,
        permissions: 10,
    },
};
export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(initialStats);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('month');
    const [loadingSections, setLoadingSections] = useState<{ [key: string]: boolean }>({});

    const fetchStats = async (range: TimeRange) => {
        try {
            const response = await adminAuthApi.getDashboardStats(range);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTimeRangeChange = async (newRange: TimeRange) => {
        setTimeRange(newRange);
        setLoadingSections({ all: true });
        await fetchStats(newRange);
        setLoadingSections({});
    };

    useEffect(() => {
        if (session) {
            fetchStats(timeRange);
        }
    }, [session]);

    const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {icon}
                        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                            {title}
                        </Typography>
                    </Box>
                    <Typography variant="h4" component="div">
                        {value}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );

    const StatCardSkeleton = () => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
                </Box>
                <Skeleton variant="text" width={80} height={40} />
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <StatCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    لوحة التحكم
                </Typography>
                <ToggleButtonGroup
                    value={timeRange}
                    exclusive
                    onChange={(_, newRange) => newRange && handleTimeRangeChange(newRange)}
                    aria-label="time range"
                >
                    <ToggleButton value="day" aria-label="day">
                        اليوم
                    </ToggleButton>
                    <ToggleButton value="week" aria-label="week">
                        الأسبوع
                    </ToggleButton>
                    <ToggleButton value="month" aria-label="month">
                        الشهر
                    </ToggleButton>
                    <ToggleButton value="year" aria-label="year">
                        السنة
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {stats?.users && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات المستخدمين
                    </Typography>
                    <Grid container spacing={3}>
                        {loadingSections.all ? (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <Grid item xs={12} sm={6} md={3} key={i}>
                                        <StatCardSkeleton />
                                    </Grid>
                                ))}
                            </>
                        ) : (
                            <>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        title="المستخدمين"
                                        value={stats.users.total}
                                        icon={<PeopleIcon />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        title="الطلاب"
                                        value={stats.users.students}
                                        icon={<SchoolIcon />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        title="المدرسيين"
                                        value={stats.users.instructors}
                                        icon={<PersonIcon />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <StatCard
                                        title="المسؤولين"
                                        value={stats.users.admins}
                                        icon={<AdminPanelSettingsIcon />}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>
            )}

            {stats?.courses && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات المواد
                    </Typography>
                    <Grid container spacing={3}>
                        {loadingSections.all ? (
                            <>
                                <Grid item xs={12} md={8}>
                                    <Card>
                                        <CardContent>
                                            <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
                                            <Skeleton variant="rectangular" height={300} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
                                            <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={12} md={8}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                توزيع المواد
                                            </Typography>
                                            <Bar
                                                data={{
                                                    labels: ['المواد النشطة', 'المواد المكتملة', 'المواد المعلقة'],
                                                    datasets: [
                                                        {
                                                            label: 'عدد المواد',
                                                            data: [
                                                                stats.courses.active,
                                                                stats.courses.completed,
                                                                stats.courses.pending,
                                                            ],
                                                            backgroundColor: [
                                                                'rgba(75, 192, 192, 0.6)',
                                                                'rgba(54, 162, 235, 0.6)',
                                                                'rgba(255, 206, 86, 0.6)',
                                                            ],
                                                        },
                                                    ],
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                    },
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                توزيع المحتوى
                                            </Typography>
                                            <Pie
                                                data={{
                                                    labels: ['الدروس', 'الاختبارات', 'الملفات'],
                                                    datasets: [
                                                        {
                                                            data: [
                                                                stats.courses.lessons,
                                                                stats.courses.quizzes,
                                                                stats.courses.files,
                                                            ],
                                                            backgroundColor: [
                                                                'rgba(255, 99, 132, 0.6)',
                                                                'rgba(54, 162, 235, 0.6)',
                                                                'rgba(255, 206, 86, 0.6)',
                                                            ],
                                                        },
                                                    ],
                                                }}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                    },
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>
            )}

            {stats?.attendance && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات الحضور
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        معدل الحضور
                                    </Typography>
                                    <Line
                                        data={{
                                            labels: ['حاضر', 'غائب', 'متأخر'],
                                            datasets: [
                                                {
                                                    label: 'عدد الطلاب',
                                                    data: [
                                                        stats.attendance.present,
                                                        stats.attendance.absent,
                                                        stats.attendance.late,
                                                    ],
                                                    borderColor: 'rgb(75, 192, 192)',
                                                    tension: 0.1,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {stats?.paths && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات المسارات التعليمية
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        تقدم المسارات
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>المهام المكتملة</Typography>
                                        <Typography>{stats.paths.completedTasks._sum.completedTasks || 0}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>إجمالي المهام</Typography>
                                        <Typography>{stats.paths.totalTasks._sum.totalTasks || 0}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        نظرة عامة
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>إجمالي المسارات</Typography>
                                        <Typography>{stats.paths.total}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>المراحل</Typography>
                                        <Typography>{stats.paths.milestones}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {stats?.community && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات المجتمع
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        نشاط المجتمع
                                    </Typography>
                                    <Bar
                                        data={{
                                            labels: ['المجتمعات', 'المجموعات', 'المنشورات', 'المناقشات', 'الغرف المباشرة'],
                                            datasets: [
                                                {
                                                    label: 'العدد',
                                                    data: [
                                                        stats.community.total,
                                                        stats.community.groups,
                                                        stats.community.posts,
                                                        stats.community.discussions,
                                                        stats.community.liveRooms,
                                                    ],
                                                    backgroundColor: [
                                                        'rgba(255, 99, 132, 0.6)',
                                                        'rgba(54, 162, 235, 0.6)',
                                                        'rgba(255, 206, 86, 0.6)',
                                                        'rgba(75, 192, 192, 0.6)',
                                                        'rgba(153, 102, 255, 0.6)',
                                                    ],
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {stats?.assessments && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات التقييم
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        نتائج الاختبارات
                                    </Typography>
                                    <Pie
                                        data={{
                                            labels: ['ناجح', 'راسب'],
                                            datasets: [
                                                {
                                                    data: [
                                                        stats.assessments.passed,
                                                        stats.assessments.submissions - stats.assessments.passed,
                                                    ],
                                                    backgroundColor: [
                                                        'rgba(75, 192, 192, 0.6)',
                                                        'rgba(255, 99, 132, 0.6)',
                                                    ],
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        نظرة عامة
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>إجمالي الاختبارات</Typography>
                                        <Typography>{stats.assessments.quizzes}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>إجمالي الأسئلة</Typography>
                                        <Typography>{stats.assessments.questions}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>إجمالي التقديمات</Typography>
                                        <Typography>{stats.assessments.submissions}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {stats?.finance && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات مالية
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        المدفوعات
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>إجمالي المدفوعات</Typography>
                                        <Typography>{stats.finance.totalAmount._sum.amount || 0} ريال</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>عدد المعاملات</Typography>
                                        <Typography>{stats.finance.totalPayments}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        الرواتب
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>إجمالي الرواتب</Typography>
                                        <Typography>{stats.finance.salaryAmount._sum.amount || 0} ريال</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>عدد صرف الرواتب</Typography>
                                        <Typography>{stats.finance.salaryPayments}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {stats?.publicRelations && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات العلاقات العامة
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        نشاط العلاقات العامة
                                    </Typography>
                                    <Bar
                                        data={{
                                            labels: ['السجلات', 'الردود', 'الفعاليات', 'قيد الانتظار'],
                                            datasets: [
                                                {
                                                    label: 'العدد',
                                                    data: [
                                                        stats.publicRelations.records,
                                                        stats.publicRelations.responses,
                                                        stats.publicRelations.events,
                                                        stats.publicRelations.pending,
                                                    ],
                                                    backgroundColor: [
                                                        'rgba(75, 192, 192, 0.6)',
                                                        'rgba(54, 162, 235, 0.6)',
                                                        'rgba(255, 206, 86, 0.6)',
                                                        'rgba(255, 99, 132, 0.6)',
                                                    ],
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {stats?.secretariat && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات السكرتارية
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        الاجتماعات
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>إجمالي الاجتماعات</Typography>
                                        <Typography>{stats.secretariat.meetings}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>إجمالي المشاركين</Typography>
                                        <Typography>{stats.secretariat.participants}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>الحضور</Typography>
                                        <Typography>{stats.secretariat.attended}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {stats?.legal && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        إحصائيات الشؤون القانونية
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="القضايا النشطة"
                                value={stats.legal.activeCases}
                                icon={<GavelIcon />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="إجمالي القضايا"
                                value={stats.legal.cases}
                                icon={<DescriptionIcon />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="العقود"
                                value={stats.legal.contracts}
                                icon={<AssignmentIcon />}
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    );
} 