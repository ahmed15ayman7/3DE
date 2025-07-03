'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Tooltip,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Badge,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    EventNote as SecretariatIcon,
    Group as GroupIcon,
    Description as ReportIcon,
    AttachFile as FileIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Notifications as NotificationsIcon,
    AttachMoney as MoneyIcon,
    Search as SearchIcon,
    Event as EventIcon,
    AccessTime as AttendanceIcon,
    Mail as MessageIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { secretariatApi } from '@/lib/api';
import { PermissionGuard } from '@/components/PermissionGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import TraineesTable from './components/TraineesTable';
import ScheduleTable from './components/ScheduleTable';
import PaymentsTable from './components/PaymentsTable';
import FilesTable from './components/FilesTable';
import AttendanceTable from './components/AttendanceTable';
import MessagesTable from './components/MessagesTable';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
let initialmeetingsData = [
    {
        id: '1',
        meetingTitle: 'الاجتماع الاول',
        meetingDate: new Date(),
        location: 'الموقع',
        notes: 'الملاحظات',
        participants: [
            {
                id: '1',
                name: 'محمد حسين',
                isAttended: true,
                user: {
                    id: '1',
                    firstName: 'محمد',
                    lastName: 'حسين',
                },
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByAdminId: '1',
        updatedByAdminId: '1',
        createdByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
    },
    {
        id: '1',
        meetingTitle: 'الاجتماع الاول',
        meetingDate: new Date(),
        location: 'الموقع',
        notes: 'الملاحظات',
        participants: [
            {
                id: '1',
                name: 'محمد حسين',
                isAttended: true,
                user: {
                    id: '1',
                    firstName: 'محمد',
                    lastName: 'حسين',
                },
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByAdminId: '1',
        updatedByAdminId: '1',
        createdByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
    },
    {
        id: '1',
        meetingTitle: 'الاجتماع الاول',
        meetingDate: new Date(),
        location: 'الموقع',
        notes: 'الملاحظات',
        participants: [
            {
                id: '1',
                name: 'محمد حسين',
                isAttended: true,
                user: {
                    id: '1',
                    firstName: 'محمد',
                    lastName: 'حسين',
                },
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByAdminId: '1',
        updatedByAdminId: '1',
        createdByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
    },
    {
        id: '1',
        meetingTitle: 'الاجتماع الاول',
        meetingDate: new Date(),
        location: 'الموقع',
        notes: 'الملاحظات',
        participants: [
            {
                id: '1',
                name: 'محمد حسين',
                isAttended: true,
                user: {
                    id: '1',
                    firstName: 'محمد',
                    lastName: 'حسين',
                },
            },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByAdminId: '1',
        updatedByAdminId: '1',
        createdByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
    },
]
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`secretariat-tabpanel-${index}`}
            aria-labelledby={`secretariat-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

interface DashboardStats {
    totalStudents: number;
    activeCourses: number;
    todayMeetings: number;
    newNotifications: number;
    totalPayments: number;
}

export default function SecretariatPage() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [formData, setFormData] = useState({
        meetingTitle: '',
        meetingDate: '',
        location: '',
        notes: '',
        participants: [] as string[],
    });
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        activeCourses: 0,
        todayMeetings: 0,
        newNotifications: 0,
        totalPayments: 0,
    });
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const queryClient = useQueryClient();

    const { data: meetingsData } = useQuery({
        queryKey: ['meetings'],
        queryFn: () => secretariatApi.getAll('academy-id'),
    });

    const addMutation = useMutation({
        mutationFn: (data: any) => secretariatApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            setOpen(false);
            setSnackbar({ open: true, message: 'تم إضافة الاجتماع بنجاح', severity: 'success' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => secretariatApi.update(selectedItem?.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            setOpen(false);
            setSnackbar({ open: true, message: 'تم تحديث الاجتماع بنجاح', severity: 'success' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => secretariatApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            setSnackbar({ open: true, message: 'تم حذف الاجتماع بنجاح', severity: 'success' });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItem) {
            updateMutation.mutate({
                ...formData,
                academyId: 'academy-id',
            });
        } else {
            addMutation.mutate({
                ...formData,
                academyId: 'academy-id',
            });
        }
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            meetingTitle: item.meetingTitle,
            meetingDate: item.meetingDate,
            location: item.location,
            notes: item.notes || '',
            participants: item.participants?.map((p: any) => p.userId) || [],
        });
        setOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الاجتماع؟')) {
            deleteMutation.mutate(id);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await secretariatApi.getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const StatCard = ({ title, value, icon, color, onClick }: any) => (
        <Card
            sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                },
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <Box
                        sx={{
                            backgroundColor: `${color}.light`,
                            borderRadius: '50%',
                            p: 1,
                            mr: 2,
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="h6" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card elevation={3} sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SecretariatIcon color="primary" sx={{ fontSize: 40 }} />
                                <Typography variant="h4" component="h1">
                                    السكرتارية
                                </Typography>
                            </Box>
                            <PermissionGuard requiredPermissions={['manageSecretary']}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                        setSelectedItem(null);
                                        setFormData({
                                            meetingTitle: '',
                                            meetingDate: '',
                                            location: '',
                                            notes: '',
                                            participants: [],
                                        });
                                        setOpen(true);
                                    }}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                    }}
                                >
                                    إضافة اجتماع جديد
                                </Button>
                            </PermissionGuard>
                        </Box>

                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab label="الاجتماعات" />
                            <Tab label="المشاركون" />
                            <Tab label="التقارير" />
                            <Tab label="الملفات" />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <TableContainer component={Paper} elevation={3}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>عنوان الاجتماع</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>التاريخ</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الموقع</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>عدد المشاركين</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>الإجراءات</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <AnimatePresence>
                                            {(meetingsData?.data ?? initialmeetingsData).map((item: any) => (
                                                <motion.tr
                                                    key={item.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <TableCell>{item.meetingTitle}</TableCell>
                                                    <TableCell>
                                                        {format(new Date(item.meetingDate), 'PPP', { locale: arSA })}
                                                    </TableCell>
                                                    <TableCell>{item.location}</TableCell>
                                                    <TableCell>
                                                        <Badge badgeContent={item.participants?.length || 0} color="primary">
                                                            <GroupIcon />
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <PermissionGuard requiredPermissions={['manageSecretary']}>
                                                            <Tooltip title="تعديل">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleEdit(item)}
                                                                    sx={{ color: 'primary.main' }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="حذف">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDelete(item.id)}
                                                                    sx={{ color: 'error.main' }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </PermissionGuard>
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <Grid container spacing={3}>
                                {(meetingsData?.data ?? initialmeetingsData).map((meeting: any) => (
                                    <Grid item xs={12} md={6} lg={4} key={meeting.id}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <GroupIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="h6">{meeting.meetingTitle}</Typography>
                                                </Box>
                                                {meeting.participants?.map((participant: any) => (
                                                    <Box key={participant.id} sx={{ mt: 2 }}>
                                                        <Typography variant="subtitle2">
                                                            {participant.user?.firstName} {participant.user?.lastName}
                                                        </Typography>
                                                        <Chip
                                                            label={participant.isAttended ? 'حضر' : 'لم يحضر'}
                                                            color={participant.isAttended ? 'success' : 'error'}
                                                            size="small"
                                                            sx={{ mt: 1 }}
                                                        />
                                                    </Box>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Grid container spacing={3}>
                                {(meetingsData?.data ?? initialmeetingsData).map((meeting: any) => (
                                    <Grid item xs={12} md={6} lg={4} key={meeting.id}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <ReportIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="h6">تقرير الاجتماع</Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {meeting.notes}
                                                </Typography>
                                                {meeting.reports?.map((report: any) => (
                                                    <Box key={report.id} sx={{ mt: 2 }}>
                                                        <Typography variant="subtitle2">{report.title}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {format(new Date(report.createdAt), 'PPP', { locale: arSA })}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={3}>
                            <Grid container spacing={3}>
                                {(meetingsData?.data ?? initialmeetingsData).map((meeting: any) => (
                                    <Grid item xs={12} md={6} lg={4} key={meeting.id}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <FileIcon color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="h6">ملفات الاجتماع</Typography>
                                                </Box>
                                                {meeting.files?.map((file: any) => (
                                                    <Box key={file.id} sx={{ mt: 2 }}>
                                                        <Typography variant="subtitle2">{file.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {format(new Date(file.createdAt), 'PPP', { locale: arSA })}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>
                    </CardContent>
                </Card>

                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: 24,
                        },
                    }}
                >
                    <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                        {selectedItem ? 'تعديل الاجتماع' : 'إضافة اجتماع جديد'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="عنوان الاجتماع"
                                        value={formData.meetingTitle}
                                        onChange={(e) =>
                                            setFormData({ ...formData, meetingTitle: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="تاريخ الاجتماع"
                                        type="datetime-local"
                                        value={formData.meetingDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, meetingDate: e.target.value })
                                        }
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="الموقع"
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({ ...formData, location: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="ملاحظات"
                                        multiline
                                        rows={4}
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>المشاركون</InputLabel>
                                        <Select
                                            multiple
                                            value={formData.participants}
                                            onChange={(e) =>
                                                setFormData({ ...formData, participants: e.target.value as string[] })
                                            }
                                            label="المشاركون"
                                        >
                                            <MenuItem value="user1">المستخدم 1</MenuItem>
                                            <MenuItem value="user2">المستخدم 2</MenuItem>
                                            <MenuItem value="user3">المستخدم 3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button
                                onClick={() => setOpen(false)}
                                variant="outlined"
                                sx={{ mr: 1 }}
                            >
                                إلغاء
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                }}
                            >
                                {selectedItem ? 'تحديث' : 'إضافة'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </motion.div>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    لوحة تحكم السكرتارية
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    مرحباً بك في لوحة تحكم السكرتارية. هنا يمكنك إدارة المتدربين والمواعيد والدفعات والمزيد.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="إجمالي المتدربين"
                        value={stats.totalStudents}
                        icon={<PeopleIcon sx={{ color: 'primary.main' }} />}
                        color="primary"
                        onClick={() => router.push('/admin/secretariat/trainees')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="المواد النشطة"
                        value={stats.activeCourses}
                        icon={<SchoolIcon sx={{ color: 'success.main' }} />}
                        color="success"
                        onClick={() => router.push('/admin/secretariat/schedule')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="مواعيد اليوم"
                        value={stats.todayMeetings}
                        icon={<EventIcon sx={{ color: 'warning.main' }} />}
                        color="warning"
                        onClick={() => router.push('/admin/secretariat/schedule')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="إشعارات جديدة"
                        value={stats.newNotifications}
                        icon={<NotificationsIcon sx={{ color: 'error.main' }} />}
                        color="error"
                        onClick={() => router.push('/admin/secretariat/messages')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="إجمالي المدفوعات"
                        value={`${stats.totalPayments} ريال`}
                        icon={<MoneyIcon sx={{ color: 'info.main' }} />}
                        color="info"
                        onClick={() => router.push('/admin/secretariat/payments')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="الملفات والمستندات"
                        value="إدارة الملفات"
                        icon={<FileIcon sx={{ color: 'secondary.main' }} />}
                        color="secondary"
                        onClick={() => router.push('/admin/secretariat/files')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="سجل الحضور"
                        value="إدارة الحضور"
                        icon={<AttendanceIcon sx={{ color: 'success.main' }} />}
                        color="success"
                        onClick={() => router.push('/admin/secretariat/attendance')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="الرسائل الداخلية"
                        value="إدارة الرسائل"
                        icon={<MessageIcon sx={{ color: 'primary.main' }} />}
                        color="primary"
                        onClick={() => router.push('/admin/secretariat/messages')}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="secretariat tabs">
                    <Tab label="المتدربين" />
                    <Tab label="المواعيد" />
                    <Tab label="الدفعات" />
                    <Tab label="الملفات" />
                    <Tab label="الحضور" />
                    <Tab label="الرسائل" />
                </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
                {activeTab === 0 && <TraineesTable />}
                {activeTab === 1 && <ScheduleTable />}
                {activeTab === 2 && <PaymentsTable />}
                {activeTab === 3 && <FilesTable />}
                {activeTab === 4 && <AttendanceTable />}
                {activeTab === 5 && <MessagesTable />}
            </Box>
        </Box>
    );
} 