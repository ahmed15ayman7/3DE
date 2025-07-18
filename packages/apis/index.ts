import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  Course,
  Lesson,
  Enrollment,
  Quiz,
  Question,
  Submission,
  Achievement,
  Notification,
  Message,
  Post,
  Comment,
  Group,
  Payment,
  Certificate,
  Event,
  Attendance,
  Badge,
  Report,
  Admin,
  AdminRole,
  Permission,
  Academy,
  Path,
  Milestone,
  Bookmark,
  Community,
  Discussion,
  LiveRoom,
  AccountingEntry,
  Invoice,
  LegalCase,
  Installment,
  Expense,
  Branch,
  BranchFinance,
  PublicRelationsRecord,
  PRResponse,
  Meeting,
  MeetingParticipant,
  AboutSection,
  NewsEvent,
  SuccessStory,
  Testimonial,
  ContactMessage,
  FAQ,
  BlogPost,
  Partnership,
  PartnershipAgreement,
  CSRProject,
  CrisisCommunication,
  MediaAlert,
  SecretariatDashboard,
  TraineeManagement,
  TrainingSchedule,
  QuickActionLink,
  PaymentLogBySecretary,
  InternalMessage,
  Profile,
  LoginHistory,
  TwoFactor,
  Instructor,
  File as FileModel,
  NotificationSettings,
  Option,
  ContactUs,
  Support,
} from '@3de/interfaces';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL|| "https://api.3de.school" || 'https://api.3de.school' ;

interface TokenPayload {
  exp: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private refreshTokenTimeout?: NodeJS.Timeout;
  private accessToken: string = '';
  private refresh_token: string = '';

  private constructor() { }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // تعيين التوكن عند تسجيل الدخول
  public async setTokens(accessToken: string, refreshToken: string) {
    if (!accessToken || !refreshToken) {
      console.error('Invalid tokens provided');
      return;
    }

    this.accessToken = accessToken;
    this.refresh_token = refreshToken;
    
    // حفظ التوكن في الكوكيز
    setCookie('accessToken', accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 // 15 minutes
    });
    
    setCookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    try {
      this.startRefreshTokenTimer();
    } catch (error) {
      console.error('Error setting up refresh timer:', error);
    }
  }

  // الحصول على التوكن الحالي
  public async getAccessTokenFromCookie(): Promise<string> {
    const token = getCookie('accessToken') as string;
    return token || this.accessToken || '';
  }

  // التحقق من حالة تسجيل الدخول
  public async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessTokenFromCookie();
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<TokenPayload>(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // بدء مؤقت تجديد التوكن
  private startRefreshTokenTimer() {
    try {
      const decodedToken = jwtDecode<TokenPayload>(this.accessToken);
      const expires = new Date(decodedToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // تجديد قبل دقيقة من الانتهاء

      this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    } catch (error) {
      console.error('Error starting refresh timer:', error);
    }
  }

  // إيقاف مؤقت تجديد التوكن
  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  // تجديد التوكن
  public async refreshToken(): Promise<string> {
    try {
      const refreshT = getCookie('refreshToken') as string;
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken: refreshT || this.refresh_token || ''
      });

      const { access_Token } = response.data;
      await this.setTokens(access_Token, refreshT || this.refresh_token);
      return access_Token;
    } catch (error: any) {
      await this.logout();
      throw new Error('Failed to refresh token' + error);
    }
  }

  // تسجيل الخروج
  public async logout() {
    this.accessToken = '';
    this.refresh_token = '';
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    this.stopRefreshTokenTimer();
    
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  }

  public async clearTokens() {
    this.accessToken = '';
    this.refresh_token = '';
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    this.stopRefreshTokenTimer();    
  }
}

const authService = AuthService.getInstance();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor للطلبات
api.interceptors.request.use(
    async (config) => {
        const accessToken = await authService.getAccessTokenFromCookie();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        console.log(error)
        return Promise.reject(error);
    }
);

// Interceptor للردود
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // إذا كان الخطأ 401 ولم نكن نحاول تجديد التوكن بالفعل
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await authService.refreshToken();
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                await authService.setTokens(accessToken, refreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // إذا فشل تجديد التوكن، نوجه المستخدم لصفحة تسجيل الدخول
                await authService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth APIs
export const authApi = {
    login: async (credentials: { email: string; password: string }):Promise<{ access_token: string; refreshToken: string, user: User }|null> => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { access_token, refreshToken } = response.data;
            await authService.setTokens(access_token, refreshToken);

            return response.data;
        } catch (error) {
            console.log(error)
            return null
        }
    },

    signup: async (data: { email: string; password: string; name: string }) => {
        const response = await api.post('/auth/signup', data);
        const { accessToken, refreshToken } = response.data;

        await authService.setTokens(accessToken, refreshToken);

        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            await authService.logout();
        }
    },

    refreshToken: async ({ refreshToken }: { refreshToken: string }) => {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        const { access_Token } = response.data;
        await authService.setTokens(access_Token, refreshToken);
        return access_Token;
    },

    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: string;
        subRole: string;
    }):Promise<{ access_token: string; refreshToken: string, user: User }|null> => {
        const response = await api.post('/auth/register', data);
        const { access_token, refreshToken } = response.data;
        await authService.setTokens(access_token, refreshToken);
        return response.data;
    },
    
    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),
    
    resetPassword: (token: string, password: string) =>
        api.post('/auth/reset-password', { token, password }),
};

// User APIs
export const userApi = {
    getAll: (page: number, limit: number, search: string): Promise<{ success: boolean, data: User[] }> => api.get(`/users?page=${page}&limit=${limit}&search=${search}`),
    getById: (id: string): Promise<{ success: boolean, data: User & { loginHistory: LoginHistory[], twoFactor: TwoFactor, createdCourses: Course[], enrollments: Enrollment[], achievements: Achievement[], notifications: Notification[], lessons: Lesson[] } }> => api.get(`/users/${id}`),
    create: (data: User) => api.post('/users', data),
    update: (id: string, data: Partial<User>) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
    getLoginHistory: (id: string): Promise<{ success: boolean, data: LoginHistory[] }> => api.get(`/users/${id}/login-history`),
    getTwoFactor: (id: string): Promise<{ success: boolean, data: TwoFactor }> => api.get(`/users/${id}/two-factor`),
    updateTwoFactor: (id: string, data: TwoFactor) => api.post(`/users/${id}/two-factor`, data),
    getProfile: (id: string): Promise<{ success: boolean, data: User & { loginHistory: LoginHistory[], twoFactor: TwoFactor, createdCourses: Course[], enrollments: Enrollment[], achievements: Achievement[], notifications: Notification[], lessons: Lesson[] } }> => api.get(`/users/${id}`),
    updateProfile: (data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        avatar?: string;
    }) => api.patch('/users/profile', data),
    changePassword: (data: {
        currentPassword: string;
        newPassword: string;
    }) => api.post('/users/change-password', data),
    getEnrolledCourses: () => api.get('/users/courses'),
    getAchievements: (id: string): Promise<{ success: boolean, data: Achievement[] }> => api.get(`/users/achievements/${id}`),
    getNotifications: (id: string): Promise<{ success: boolean, data: Notification[] }> => api.get(`/notifications/user/${id}`),
    getSubmissions: () => api.get('/users/submissions'),
    getAttendance: () => api.get('/users/attendance'),
    getEnrollments: (id: string): Promise<{ success: boolean, data: Enrollment[] }> => api.get(`/users/${id}/enrollments`),
};

// Course APIs
export const courseApi = {
    getAll: (): Promise<{ success: boolean, data: Course[] }> => api.get('/courses'),
    getById: (id: string): Promise<{ success: boolean, data: Course & { lessons: (Lesson & { files: FileModel[], quizzes: Quiz[] })[], quizzes: Quiz[], enrollments: (Enrollment & { user: User })[] } }> => api.get(`/courses/${id}`),
    create: async (data: Partial<Course>,instructorId?:string) => {
        try {
            const response = await api.post('/courses', { ...data })
            let resAddInstructor= await api.post(`/courses/${response.data.id}/add-instructor/${instructorId}` )
            return response.data
        } catch (error:any) {
            console.log(error)
            throw new Error(error.response.data.message)
        }
    },
    update: (id: string, data: Partial<Course>) => api.put(`/courses/${id}`, data),
    delete: (id: string) => api.delete(`/courses/${id}`),
    enroll: (courseId: string) => api.post(`/courses/${courseId}/enroll`),
    unenroll: (courseId: string) => api.post(`/courses/${courseId}/unenroll`),
    addInstructor: (courseId: string, instructorId: string) => api.post(`/courses/${courseId}/add-instructor`, { instructorId }),
    removeInstructor: (courseId: string, instructorId: string) => api.post(`/courses/${courseId}/remove-instructor`, { instructorId }),
    getLessons: (courseId: string) => api.get(`/courses/${courseId}/lessons`),
    getQuizzes: (courseId: string) => api.get(`/courses/${courseId}/quizzes`),
    getStudents: (courseId: string): Promise<{ status:number, data: (Enrollment & { user: User })[] }> => api.get(`/courses/${courseId}/students`),
    getInstructors: (courseId: string) => api.get(`/courses/${courseId}/instructors`),
    getByStudentId: (studentId: string): Promise<{ success: boolean, data: (Course & { instructors: (Instructor & { user: User })[] ,lessons: (Lesson & { files: FileModel[], quizzes: Quiz[] })[] })[] }> => api.get(`/courses/by-student/${studentId}`),
    getByInstructorId: (instructorId: string) => api.get(`/courses/by-instructor/${instructorId}`),
    getByAcademyId: (academyId: string) => api.get(`/courses/by-academy/${academyId}`),
};

// Lesson APIs
export const lessonApi = {
    getByCourse: (courseId: string): Promise<{ success: boolean, data: (Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] })[] }> => api.get(`/lessons/course/${courseId}`),
    getById: (id: string): Promise<{ success: boolean, data: Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] } }> => api.get(`/lessons/${id}`),
    create: (data: {
        title: string;
        content: string;
        videoUrl?: string;
        courseId: string;
    }) => api.post('/lessons', data),
    update: (id: string, data: Partial<Lesson>) => api.put(`/lessons/${id}`, data),
    delete: (id: string) => api.delete(`/lessons/${id}`),
    getFiles: (lessonId: string) => api.get(`/lessons/${lessonId}/files`),
    getQuizzes: (lessonId: string) => api.get(`/lessons/${lessonId}/quizzes`),
    markAsCompleted: (lessonId: string) =>
        api.post(`/lessons/${lessonId}/complete`),
    updateBlockList: (lessonId: string, userId: string, isBlocked: boolean) =>
        api.post(`/lessons/block-list`, { lessonId, userId, isBlocked }),
    updateWatchedLesson: (lessonId: string, userId: string, progress: number) =>
        api.put(`/lessons/watched-lesson/${lessonId}/${userId}`, { progress }),
    addWatchedLesson: (lessonId: string, userId: string,progress:number) =>
        api.post(`/lessons/watched-lesson`, { lessonId, userId,progress }),
};

// Quiz APIs
export const quizApi = {
    getByLesson: (lessonId: string) => api.get(`/quizzes/lesson/${lessonId}`),
    getById: (id: string) => api.get(`/quizzes/${id}`),
    create: (data: Quiz & { questions: (Question & { options:  Option[] })[] }) => api.post('/quizzes', data),
    update: (id: string, data: {
        title?: string;
        description?: string;
        questions?: Array<{
            text: string;
            type: string;
            options?: any;
            answer: any;
        }>;
    }) => api.patch(`/quizzes/${id}`, data),
    delete: (id: string) => api.delete(`/quizzes/${id}`),
    submit: (quizId: string, answers: any) =>
        api.post(`/quizzes/${quizId}/submit`, { answers }),
    getResults: (quizId: string) => api.get(`/quizzes/${quizId}/results`),
    getStudentResults: (quizId: string, studentId: string) =>
        api.get(`/quizzes/${quizId}/student/${studentId}/results`),
    getByStudent: (studentId: string) => api.get(`/quizzes/student/${studentId}`),
    getByInstructor: (instructorId: string) => api.get(`/quizzes/instructor/${instructorId}`),
    getByCourse: (courseId: string) => api.get(`/quizzes/course/${courseId}`),
    getByDate: (date: string) => api.get(`/quizzes/date/${date}`),
    getByStatus: (status: string) => api.get(`/quizzes/status/${status}`),
    getActive: () => api.get(`/quizzes/active`),
    getPerformance: (studentId: string) => api.get(`/quizzes/performance/${studentId}`),
};

// Assignment APIs
export const assignmentApi = {
    getByCourse: (courseId: string) => api.get(`/assignments/course/${courseId}`),
    getById: (id: string) => api.get(`/assignments/${id}`),
    create: (data: any) => api.post('/assignments', data),
    update: (id: string, data: any) => api.patch(`/assignments/${id}`, data),
    delete: (id: string) => api.delete(`/assignments/${id}`),
    getByStudent: (studentId: string) => api.get(`/assignments/student/${studentId}`),
    getByInstructor: (instructorId: string) => api.get(`/assignments/instructor/${instructorId}`),
    getByDate: (date: string) => api.get(`/assignments/date/${date}`),
    getByStatus: (status: string) => api.get(`/assignments/status/${status}`),
};

// Attendance APIs
export const attendanceApi = {
    getAll: () => api.get('/attendance'),
    getById: (id: string) => api.get(`/attendance/${id}`),
    create: (data: Partial<Attendance>) => api.post('/attendance', data),
    update: (id: string, data: Partial<Attendance>) => api.patch(`/attendance/${id}`, data),
    delete: (id: string) => api.delete(`/attendance/${id}`),
    track: (data: {
        lessonId: string;
        studentId: string;
        method: 'FACE_ID' | 'QR_CODE';
    }) => api.post('/attendance/track', data),
    getStudentStats: (studentId: string) =>
        api.get(`/attendance/student/${studentId}/stats`),
    getLessonAttendance: (lessonId: string) =>
        api.get(`/attendance/lesson/${lessonId}`),
    updateStatus: (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') =>
        api.patch(`/attendance/${id}/status`, { status }),
    getByDate: (date: string) => api.get(`/attendance/date/${date}`),
    getByDateAndLesson: (date: string, lessonId: string) => api.get(`/attendance/date/${date}/lesson/${lessonId}`),
    getByStudent: (studentId: string) => api.get(`/attendance/student/${studentId}`),
    getByDateAndStudent: (date: string, studentId: string) => api.get(`/attendance/date/${date}/student/${studentId}`),
    getByDateAndStudentAndLesson: (date: string, studentId: string, lessonId: string) => api.get(`/attendance/date/${date}/student/${studentId}/lesson/${lessonId}`),
    getByDateAndStudentAndLessonAndStatus: (date: string, studentId: string, lessonId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => api.get(`/attendance/date/${date}/student/${studentId}/lesson/${lessonId}/status/${status}`),
};

// Notification APIs
export const notificationApi = {
    getAll: (page: number, limit: number, search: string): Promise<{ success: boolean, data: Notification[] }> => api.get(`/notifications?page=${page}&limit=${limit}&search=${search}`),
    getAllByUserId: (userId: string): Promise<{ success: boolean, data: Notification[] }> => api.get(`/notifications/user/${userId}`),
    getUnread: () => api.get('/notifications/unread'),
    markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all'),
    create: (data: {
        userId: string;
        type: string;
        message: string;
        actionUrl?: string;
        title?: string;
        urgent?: boolean;
        isImportant?: boolean;
    }) => api.post('/notifications', data),
    update: (id: string, data: {
        message?: string;
        actionUrl?: string;
        title?: string;
        urgent?: boolean;
        isImportant?: boolean;
    }) => api.patch(`/notifications/${id}`, data),
    delete: (id: string) => api.delete(`/notifications/${id}`),
    getSettings: () => api.get('/notifications/settings'),
    getSettingsByUserId: (userId: string): Promise<{ success: boolean, data: NotificationSettings }> => api.get(`/notifications/settings/user/${userId}`),
    updateSettings: (data: {
        assignments: boolean;
        grades: boolean;
        messages: boolean;
        achievements: boolean;
        urgent: boolean;
        email: boolean;
        push: boolean;
    }) => api.patch('/notifications/settings', data),
    createSettings: (data: {
        assignments: boolean;
        grades: boolean;
        messages: boolean;
        achievements: boolean;
        urgent: boolean;
        email: boolean;
        push: boolean;
    }) => api.post('/notifications/settings', data),
};

// File APIs
export const fileApi = {
    create: (data: Partial<FileModel>) => api.post('/files', data),
    getAll: (): Promise<{ success: boolean, data: FileModel[] }> => api.get('/files'),
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id: string, data: Partial<FileModel>) => api.put(`/files/${id}`, data),
    delete: (id: string) => api.delete(`/files/${id}`),
    getByLesson: (lessonId: string) => api.get(`/files/lesson/${lessonId}`),
    download: (id: string) => api.get(`/files/${id}/download`, {
        responseType: 'blob',
    }),
};

// Group APIs
export const groupApi = {
    getAll: () => api.get('/groups'),
    getById: (id: string) => api.get(`/groups/${id}`),
    create: (data: { name: string; members?: string[] }) => api.post('/groups', data),
    update: (id: string, data: { name?: string; members?: string[] }) =>
        api.patch(`/groups/${id}`, data),
    delete: (id: string) => api.delete(`/groups/${id}`),
    addMember: (groupId: string, userId: string) =>
        api.post(`/groups/${groupId}/members/${userId}`),
    removeMember: (groupId: string, userId: string) =>
        api.delete(`/groups/${groupId}/members/${userId}`),
};

// Channel APIs
export const channelApi = {
    getAll: () => api.get('/channels'),
    getById: (id: string) => api.get(`/channels/${id}`),
    create: (data: { name: string; members?: string[] }) => api.post('/channels', data),
    update: (id: string, data: { name?: string; members?: string[] }) =>
        api.patch(`/channels/${id}`, data),
    delete: (id: string) => api.delete(`/channels/${id}`),
    addMember: (channelId: string, userId: string) =>
        api.post(`/channels/${channelId}/members/${userId}`),
    removeMember: (channelId: string, userId: string) =>
        api.delete(`/channels/${channelId}/members/${userId}`),
};

// Message APIs
export const messageApi = {
    getByChannel: (channelId: string) => api.get(`/messages/channel/${channelId}`),
    create: (data: { content: string; channelId: string }) =>
        api.post('/messages', data),
    update: (id: string, content: string) =>
        api.patch(`/messages/${id}`, { content }),
    delete: (id: string) => api.delete(`/messages/${id}`),
};

// Post APIs
export const postApi = {
    getAll: () => api.get('/posts'),
    getById: (id: string) => api.get(`/posts/${id}`),
    create: (data: Partial<Post>) => api.post('/posts', data),
    update: (id: string, content: string) =>
        api.patch(`/posts/${id}`, { content }),
    delete: (id: string) => api.delete(`/posts/${id}`),
    like: (id: string,userId:string) => api.post(`/posts/${id}/like/${userId}`),
    unlike: (id: string,userId:string) => api.delete(`/posts/${id}/unlike/${userId}`),
    createComment: (id: string,userId:string,content:string) => api.post(`/posts/${id}/comments`,{userId,content}),
    getComments: (id: string) => api.get(`/posts/${id}/comments`),
    updateComment: (id: string,commentId:string,content:string) => api.put(`/posts/${id}/comments/${commentId}`,{content}),
    deleteComment: (id: string,commentId:string) => api.delete(`/posts/${id}/comments/${commentId}`),
};

// Bookmark APIs
export const bookmarkApi = {
    getAll: () => api.get('/bookmarks'),
    create: (data: { type: string; itemId: string }) =>
        api.post('/bookmarks', data),
    delete: (id: string) => api.delete(`/bookmarks/${id}`),
};

// Event APIs
export const eventApi = {
    getAll: () => api.get('/events'),
    getById: (id: string) => api.get(`/events/${id}`),
    create: (data: {
        title: string;
        description?: string;
        startTime: string;
        endTime: string;
        academyId: string;
    }) => api.post('/events', data),
    update: (id: string, data: {
        title?: string;
        description?: string;
        startTime?: string;
        endTime?: string;
    }) => api.patch(`/events/${id}`, data),
    delete: (id: string) => api.delete(`/events/${id}`),
};

// Academy APIs
export const academyApi = {
    getAll: () => api.get('/academies'),
    getById: (id: string) => api.get(`/academies/${id}`),
    create: (data: {
        name: string;
        description?: string;
        logo?: string;
        settings?: any;
    }) => api.post('/academies', data),
    update: (id: string, data: {
        name?: string;
        description?: string;
        logo?: string;
        settings?: any;
    }) => api.patch(`/academies/${id}`, data),
    delete: (id: string) => api.delete(`/academies/${id}`),
};

// Achievement APIs
export const achievementApi = {
    getAll: () => api.get('/achievements'),
    getByUser: (userId: string): Promise<{ success: boolean, data: Achievement[] }> => api.get(`/achievements/user/${userId}`),
    create: (data: {
        userId: string;
        type: string;
        value: any;
    }) => api.post('/achievements', data),
    delete: (id: string) => api.delete(`/achievements/${id}`),
};

// Enrollment APIs
export const enrollmentApi = {
    getAll: (): Promise<{ success: boolean, data: (Enrollment & { course: Course & { quizzes: Quiz[] } })[] }> => api.get('/enrollments'),
    getByUser: (userId: string): Promise<{ success: boolean, data: (Enrollment & { course: Course & { quizzes: Quiz[] } })[] }> => api.get(`/enrollments/user/${userId}`),
    getByCourse: (courseId: string): Promise<{ success: boolean, data: (Enrollment & { course: Course & { quizzes: Quiz[] } })[] }> => api.get(`/enrollments/course/${courseId}`),
    create: (data: Partial<Enrollment>) => api.post('/enrollments', data),
    update: (id: string, data: {
        progress?: number;
        status?: string;
    }) => api.patch(`/enrollments/${id}`, data),
    delete: (id: string) => api.delete(`/enrollments/${id}`),
};

// Question APIs
export const questionApi = {
    getByQuiz: (quizId: string) => api.get(`/questions/${quizId}/quiz`),
    getById: (id: string) => api.get(`/questions/${id}`),
    create: (data: {
        text: string;
        type: string;
        options?: any;
        answer: any;
        quizId: string;
    }) => api.post('/questions', data),
    update: (id: string, data: {
        text?: string;
        type?: string;
        options?: any;
        answer?: any;
    }) => api.patch(`/questions/${id}`, data),
    delete: (id: string) => api.delete(`/questions/${id}`),
    createOption: (data: Option) => api.post('/questions/option', data),
    updateOption: (id: string, data: Option) => api.patch(`/questions/option/${id}`, data),
    deleteOption: (id: string) => api.delete(`/questions/option/${id}`),
};

// Submission APIs
export const submissionApi = {
    getByQuiz: (quizId: string): Promise<{ success: boolean, data: (Submission & { user: User, quiz: Quiz & { questions: (Question & { options: Option[] })[] } })[] }> => api.get(`/submissions/quiz/${quizId}`),
    getByUser: (userId: string): Promise<{ success: boolean, data: (Submission & { user: User, quiz: Quiz & { questions: (Question & { options: Option[] })[] } })[] }> => api.get(`/submissions/user/${userId}`),
    create: (data: {
        userId: string;
        quizId: string;
        answers: any;
    }) => api.post('/submissions', data),
    update: (id: string, data: {
        answers?: any;
        score?: number;
    }) => api.patch(`/submissions/${id}`, data),
    delete: (id: string) => api.delete(`/submissions/${id}`),
};

// Profile APIs
export const profileApi = {
    getByUser: (userId: string) => api.get(`/profiles/user/${userId}`),
    update: (data: {
        bio?: string;
        phone?: string;
        address?: string;
        preferences?: any;
    }) => api.patch('/profiles', data),
};

// WebSocket APIs
export const websocketApi = {
    connect: () => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'}/ws`);
        return ws;
    },
};

// Badge APIs
export const badgeApi = {
    getAll: (): Promise<{ success: boolean, data: (Badge & { user: User })[] }> => api.get('/badges'),
    getById: (id: string): Promise<{ success: boolean, data: (Badge & { user: User }) }> => api.get(`/badges/${id}`),
    getByStudent: (studentId: string): Promise<{ success: boolean, data: (Badge & { user: User })[] }> => api.get(`/badges/student/${studentId}`),
    create: (data: {
        userId: string;
        title: string;
        description?: string;
        image?: string;
        points: number;
        type: string;
        earnedAt: string;
    }) => api.post('/badges', data),
    update: (id: string, data: {
        title?: string;
        description?: string;
        image?: string;
        points?: number;
        type?: string;
        earnedAt?: string;
    }) => api.patch(`/badges/${id}`, data),
    delete: (id: string) => api.delete(`/badges/${id}`),
};

// Certificate APIs
export const certificateApi = {
    getAll: (): Promise<{ success: boolean, data: (Certificate & { user: User })[] }> => api.get('/certificates'),
    getById: (id: string): Promise<{ success: boolean, data: (Certificate & { user: User }) }> => api.get(`/certificates/${id}`),
    getByStudent: (studentId: string): Promise<{ success: boolean, data: (Certificate & { user: User })[] }> => api.get(`/certificates/student?userId=${studentId}`),
    create: (data: {
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
    }) => api.post('/certificates', data),
    update: (id: string, data: {
        title?: string;
        description?: string;
        url?: string;
        image?: string;
        points?: number;
        type?: string;
        earnedAt?: string;
    }) => api.patch(`/certificates/${id}`, data),
    delete: (id: string) => api.delete(`/certificates/${id}`),
    download: (id: string) => api.get(`/certificates/${id}/download`, {
        responseType: 'blob',
    }),
    share: (id: string, platform: string) => api.post(`/certificates/${id}/share`, { platform }),
};

// Community APIs
export const communityApi = {
    getAll: (): Promise<{ status: number, data: (Community & { participants: User[],posts:Post[],discussions:Discussion[],liveRooms:LiveRoom[],groups:Group[] })[] }> => api.get('/communities'),
    getById: (id: string) => api.get(`/communities/${id}`),
    create: (data: { name: string; description?: string }) => api.post('/communities', data),
    update: (id: string, data: { name?: string; description?: string }) => api.patch(`/communities/${id}`, data),
    delete: (id: string) => api.delete(`/communities/${id}`),
    getDiscussions: (id: string): Promise<(Discussion & { post: Post & { author: User, comments: Comment[] } })[]> => api.get(`/communities/${id}/discussions`),
    getDiscussionsByCommunityId: (id: string) => api.get(`/communities/${id}/discussions/by-community-id`),
    getDiscussionById: (id: string) => api.get(`/communities/${id}/discussions/${id}`),
    createDiscussion: (id: string, data: { title: string; content: string }) => api.post(`/communities/${id}/discussions`, data),
    updateDiscussion: (id: string, discussionId: string, data: { title?: string; content?: string }) => api.patch(`/communities/${id}/discussions/${discussionId}`, data),
    deleteDiscussion: (id: string, discussionId: string) => api.delete(`/communities/${id}/discussions/${discussionId}`),
    getLiveRooms: (id: string): Promise<(LiveRoom & { community: Community })[]> => api.get(`/communities/${id}/live-rooms`),
    getLiveRoomById: (id: string, liveRoomId: string) => api.get(`/communities/${id}/live-rooms/${liveRoomId}`),
    createLiveRoom: (id: string, data: { title: string; description?: string }) => api.post(`/communities/${id}/live-rooms`, data),
    updateLiveRoom: (id: string, liveRoomId: string, data: { title?: string; description?: string }) => api.patch(`/communities/${id}/live-rooms/${liveRoomId}`, data),
    deleteLiveRoom: (id: string, liveRoomId: string) => api.delete(`/communities/${id}/live-rooms/${liveRoomId}`),
    getGroups: (id: string): Promise<(Group & { members: User[] })[]> => api.get(`/communities/${id}/groups`),
    getGroupById: (id: string, groupId: string) => api.get(`/communities/${id}/groups/${groupId}`),
    addGroup: (id: string, groupId: string) => api.post(`/communities/${id}/groups`, { groupId }),
    removeGroup: (id: string, groupId: string) => api.delete(`/communities/${id}/groups/${groupId}`),
    getGroup: (id: string, groupId: string) => api.get(`/communities/${id}/groups/${groupId}`),
    getPosts: (id: string): Promise<(Post & { author: User, comments: Comment[] })[]> => api.get(`/communities/${id}/posts`),
    getEvents: (id: string): Promise<(Event & { community: Community })[]> => api.get(`/communities/${id}/events`),
    getEventsByUser: (userId: string): Promise<(Event & { community: Community })[]> => api.get(`/communities/events/user/${userId}`),
    getEventById: (id: string, eventId: string) => api.get(`/communities/${id}/events/${eventId}`),
    createEvent: (id: string, data: { title: string; description?: string }) => api.post(`/communities/${id}/events`, data),
    updateEvent: (id: string, eventId: string, data: { title?: string; description?: string }) => api.patch(`/communities/${id}/events/${eventId}`, data),
    deleteEvent: (id: string, eventId: string) => api.delete(`/communities/${id}/events/${eventId}`),
    getGroupsByUser: (userId: string): Promise<(Group & { members: User[] })[]> => api.get(`/communities/groups/user/${userId}`),
    addParticipant: (id:string,userId: string): Promise<{status:number,data:Community}> => api.post(`/communities/${id}/participants/${userId}`),
    removeParticipant: (id:string,userId: string): Promise<{status:number,data:Community}> => api.delete(`/communities/${id}/participants/${userId}`),
};

// Path APIs
export const pathApi = {
    getAll: (page: number, limit: number,search: string): Promise<{ success: boolean, data: (Path & { courses: Course[], milestones: Milestone[], peers: User[] })[] }> => api.get(`/paths?page=${page}&limit=${limit}&search=${search}`),
    getById: (id: string): Promise<{ success: boolean, data: (Path & { courses: Course[], milestones: Milestone[], peers: User[] }) }> => api.get(`/paths/${id}`),
    getByCourse: (courseId: string): Promise<{ success: boolean, data: (Path & { courses: Course[], milestones: Milestone[], peers: User[] })[] }> => api.get(`/paths/course/${courseId}`),
    create: (data: Path) => api.post('/paths', data),
    update: (id: string, data: Path) => api.patch(`/paths/${id}`, data),
    delete: (id: string) => api.delete(`/paths/${id}`),
};

// Instructor APIs
export const instructorApi = {
    getAll: (skip: number, limit: number, search: string): Promise<{ success: boolean, data: (Instructor & { user: User, courses: Course[] })[] }> => api.get(`/instructors?skip=${skip}&limit=${limit}&search=${search}`),
    getById: (id: string): Promise<{ success: boolean, data: Instructor & { user: User & { profile: Profile }, courses: Course[] } }> => api.get(`/instructors/${id}`),
    create: (data: Partial<Instructor>) => api.post('/instructors', data),
    update: (id: string, data: Partial<Instructor>) => api.patch(`/instructors/${id}`, data),
    getCourses: (id: string): Promise<{ success: boolean, data: (Course & { instructor: Instructor, quizzes: Quiz[], lessons: Lesson[], enrollments:( Enrollment &{user: User})[] })[] }> => api.get(`/instructors/${id}/courses`),
    delete: (id: string) => api.delete(`/instructors/${id}`),
    getAllForStudents: (): Promise<{ success: boolean, data: (Instructor & { user: User, courses: Course[] })[] }> => api.get('/instructors/for-students'),
};

// Contact APIs
export const contactApi = {
    getAll: (): Promise<{ success: boolean, data: ContactUs[] }> => api.get('/contacts'),
    getById: (id: string): Promise<{ success: boolean, data: ContactUs }> => api.get(`/contacts/${id}`),
    create: (data: ContactUs): Promise<{ success: boolean, data: ContactUs }> => axios.post('https://3de.school/contacts', data),
    update: (id: string, data: Partial<ContactUs>): Promise<{ success: boolean, data: ContactUs }> => api.patch(`/contacts/${id}`, data),
    delete: (id: string): Promise<{ success: boolean, data: ContactUs }> => api.delete(`/contacts/${id}`),
};

// Support APIs
export const supportApi = {
    getAll: (): Promise<{ success: boolean, data: Support[] }> => api.get('/supports'),
    getById: (id: string): Promise<{ success: boolean, data: Support }> => api.get(`/supports/${id}`),
    create: (data: Support): Promise<{ success: boolean, data: Support }> => api.post('/supports', data),
    update: (id: string, data: Partial<Support>): Promise<{ success: boolean, data: Support }> => api.patch(`/supports/${id}`, data),
    delete: (id: string): Promise<{ success: boolean, data: Support }> => api.delete(`/supports/${id}`),
};

// Export auth service for direct access
export { authService };

// Export default api instance
export default api; 