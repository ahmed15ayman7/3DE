import axios, { AxiosInstance, AxiosResponse } from 'axios';
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
  Post,
  Comment,
  Group,
  Certificate,
  Event,
  Attendance,
  Badge,
  Path,
  Milestone,
  Community,
  Discussion,
  LiveRoom,
  Profile,
  LoginHistory,
  TwoFactor,
  Instructor,
  File as FileModel,
  NotificationSettings,
  Option,
  ContactUs,
  Support,
  EnrollmentCode,
  BlogPost,
} from '@3de/interfaces';
import  * as serverActions  from './server-actions';

// ?? API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL|| "https://api.3de.school" || 'https://api.3de.school' ;

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

  // ?? تعيين التوكن عند تسجيل الدخول
  public async setTokens(accessToken: string, refreshToken: string) {
    if (!accessToken || !refreshToken) {
      console.error('Invalid tokens provided');
      return;
    }

    this.accessToken = accessToken;
    this.refresh_token = refreshToken;
    await serverActions.setAccessTokenToCookieServer(accessToken,refreshToken);

    try {
      this.startRefreshTokenTimer();
    } catch (error) {
      console.error('Error setting up refresh timer:', error);
    }
  }

  // ?? الحصول على التوكن الحالي
  public async getAccessTokenFromCookie(): Promise<string> {
    const token = await serverActions.getAccessTokenFromCookieServer();
    return token || this.accessToken || '';
  }

  // ?? التحقق من حالة تسجيل الدخول
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

  // ?? بدء مؤقت تجديد التوكن
  private startRefreshTokenTimer() {
    try {
      const decodedToken = jwtDecode<TokenPayload>(this.accessToken);
      const expires = new Date(decodedToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // ?? تجديد قبل دقيقة من الانتهاء

      this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    } catch (error) {
      console.error('Error starting refresh timer:', error);
    }
  }

  // ?? إيقاف مؤقت تجديد التوكن
  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  // ?? تجديد التوكن
  public async refreshToken(): Promise<string> {
    try {
      const {access_token,refreshToken} = await serverActions.refreshTokenServer();
      await this.setTokens(access_token, refreshToken||this.refresh_token);
      return access_token;
    } catch (error: any) {
      await this.logout();
      return "";
    }
  }

  // ?? تسجيل الخروج
  public async logout() {
    await serverActions.logoutServer();
    this.stopRefreshTokenTimer();
    
    if (typeof window !== 'undefined') {
        if(!window.location.href.includes('/auth/signin') && !window.location.href.includes('/auth/signup') && !window.location.href.includes('/auth/reset-password') && !window.location.href.includes('/auth/forgot-password') ){
          window.location.href = '/auth/signin';
      }
    }
  }

  public async clearTokens() {
    this.accessToken = '';
    this.refresh_token = '';
    await serverActions.logoutServer();
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

// ?? Interceptor للطلبات
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

// ?? Interceptor للردود
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ?? إذا كان الخطأ 401 ولم نكن نحاول تجديد التوكن بالفعل
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await authService.refreshToken();
                console.log("refreshToken",refreshToken)
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                await authService.setTokens(accessToken, refreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // ?? إذا فشل تجديد التوكن، نوجه المستخدم لصفحة تسجيل الدخول
                await authService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ?? Auth APIs
export const authApi = {
    login: serverActions.login,

    signup: serverActions.signup,

    logout: serverActions.logout,

    refreshToken: serverActions.refreshToken,

    register: serverActions.register,
    
    forgotPassword: serverActions.forgotPassword,
    
    resetPassword: serverActions.resetPassword,
};

// ?? Admin Auth APIs
export const adminAuthApi = {
    login: async (credentials: { email: string; password: string }) => {
        try {
            const {access_token,refreshToken,user} = await serverActions.adminLogin(credentials);
    
        await authService.setTokens(access_token, refreshToken);
    
        return {access_token,refreshToken,user};
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getDashboardStats: serverActions.getDashboardStats,
    getAdminByUserId: serverActions.getAdminByUserId,
  };

// ?? User APIs
export const userApi = {
    getAll: serverActions.getAllUsers,
    getById: serverActions.getUserById,
    create: serverActions.createUser,
    update: serverActions.updateUser,
    delete: serverActions.deleteUser,
    getLoginHistory: serverActions.getLoginHistory,
    getTwoFactor: serverActions.getTwoFactor,
    updateTwoFactor: serverActions.updateTwoFactor,
    getProfile: serverActions.getProfile,
    updateProfile: serverActions.updateProfile,
    changePassword: serverActions.changePassword,
    getEnrolledCourses: serverActions.getEnrolledCourses,
    getAchievements: serverActions.getAchievements,
    getNotifications: serverActions.getNotifications,
    getSubmissions: serverActions.getSubmissions,
    getAttendance: serverActions.getAttendance,
    getEnrollments: serverActions.getEnrollments,
};

// ?? Course APIs
export const courseApi = {
    getAll: serverActions.getAllCourses,
    getById:serverActions.getCourseById,
    create: serverActions.createCourse,
    update: serverActions.updateCourse,
    delete: serverActions.deleteCourse,
    enroll: serverActions.enrollCourse,
    unenroll: serverActions.unenrollCourse,
    addInstructor: serverActions.addInstructor,
    removeInstructor: serverActions.removeInstructor,
    getLessons: serverActions.getCourseLessons,
    getQuizzes: serverActions.getCourseQuizzes,
    getStudents: serverActions.getCourseStudents,
    getInstructors: serverActions.getCourseInstructors,
    getByStudentId: serverActions.getCoursesByStudentId,
    getByInstructorId: serverActions.getCoursesByInstructorId,
    getByAcademyId: serverActions.getCoursesByAcademyId,
    updateEnrollment: serverActions.updateEnrollment,
};

// ?? Lesson APIs
export const lessonApi = {
    getByCourse: (courseId: string): Promise<{ success: boolean, data: (Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] })[] }> => api.get(`/lessons/course/${courseId}`),
    getById: (id: string): Promise<{ success: boolean, data: Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] } }> => api.get(`/lessons/${id}`),
    create: (data: {
        title: string;
        content: string;
        videoUrl?: string;
        courseId: string;
    }) => api.post('/lessons', data),
    getAll: (page: number, limit: number, search: string): Promise<{ success: boolean, data: Lesson[] }> => api.get(`/lessons?page=${page}&limit=${limit}&search=${search}`),
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
    addWatchedLesson: (lessonId: string, userId: string, progress: number) =>
        api.post(`/lessons/watched-lesson`, { lessonId, userId, progress }),
};

// ?? Quiz APIs
export const quizApi = {
  getByLesson: serverActions.getQuizzesByLesson,
  getAll: serverActions.getAllQuizzes,
  getById: serverActions.getQuizById,
  create: serverActions.createQuiz,
  update: serverActions.updateQuiz,
  delete: serverActions.deleteQuiz,
  submit: serverActions.submitQuiz,
  getResults: serverActions.getQuizResults,
  getStudentResults: serverActions.getQuizStudentResults,
  getByStudent: serverActions.getQuizzesByStudent,
  getByInstructor: serverActions.getQuizzesByInstructor,
  getByCourse: serverActions.getQuizzesByCourse,
  getByDate: serverActions.getQuizzesByDate,
  getByStatus: serverActions.getQuizzesByStatus,
  getActive: serverActions.getActiveQuizzes,
  getPerformance: serverActions.getStudentPerformance,
};


// ?? Assignment APIs
export const assignmentApi = {
  getByCourse: serverActions.getAssignmentsByCourse,
  getById: serverActions.getAssignmentById,
  create: serverActions.createAssignment,
  update: serverActions.updateAssignment,
  delete: serverActions.deleteAssignment,
  getByStudent: serverActions.getAssignmentsByStudent,
  getByInstructor: serverActions.getAssignmentsByInstructor,
  getByDate: serverActions.getAssignmentsByDate,
  getByStatus: serverActions.getAssignmentsByStatus,
};


// ?? Attendance APIs
export const attendanceApi = {
    getAll: serverActions.getAllAttendance,
    getById: serverActions.getAttendanceById,
    create: serverActions.createAttendance,
    update: serverActions.updateAttendance,
    delete: serverActions.deleteAttendance,
    track: serverActions.trackAttendance,
    getStudentStats: serverActions.getStudentStats,
    getLessonAttendance: serverActions.getLessonAttendance,
    updateStatus: serverActions.updateAttendanceStatus,
    getByDate: serverActions.getAttendanceByDate,
    getByDateAndLesson: serverActions.getAttendanceByDateAndLesson,
    getByStudent: serverActions.getAttendanceByStudent,
    getByDateAndStudent: serverActions.getAttendanceByDateAndStudent,
    getByDateAndStudentAndLesson: serverActions.getAttendanceByDateStudentLesson,
    getByDateAndStudentAndLessonAndStatus:
      serverActions.getAttendanceByDateStudentLessonStatus,
  };
  
// ?? Notification APIs
export const notificationApi = {
    getAll: serverActions.getAllNotifications,
    getAllByUserId: serverActions.getNotificationsByUserId,
    getUnread: serverActions.getUnreadNotifications,
    markAsRead: serverActions.markNotificationAsRead,
    markAllAsRead: serverActions.markAllNotificationsAsRead,
    create: serverActions.createNotification,
    update: serverActions.updateNotification,
    delete: serverActions.deleteNotification,
    getSettings: serverActions.getNotificationSettings,
    getSettingsByUserId: serverActions.getNotificationSettingsByUserId,
    updateSettings: serverActions.updateNotificationSettings,
    createSettings: serverActions.createNotificationSettings,
  };
  
// ?? File APIs
export const fileApi = {
    create: serverActions.createFile,
    getAll: serverActions.getAllFiles,
    upload: serverActions.uploadFile,
    update: serverActions.updateFile,
    delete: serverActions.deleteFile,
    getByLesson: serverActions.getFilesByLesson,
    download: serverActions.downloadFile,
  };
  
// ?? Group APIs
export const groupApi = {
    getAll: serverActions.getAllGroups,
    getById: serverActions.getGroupById,
    create: serverActions.createGroup,
    update: serverActions.updateGroup,
    delete: serverActions.deleteGroup,
    addMember: serverActions.addGroupMember,
    removeMember: serverActions.removeGroupMember,
    getPosts: serverActions.getGroupPosts,
  };
  

// ?? Channel APIs
export const channelApi = {
    getAll: serverActions.getAllChannels,
    getById: serverActions.getChannelById,
    create: serverActions.createChannel,
    update: serverActions.updateChannel,
    delete: serverActions.deleteChannel,
    addMember: serverActions.addChannelMember,
    removeMember: serverActions.removeChannelMember,
  };
  

// ?? Message APIs
export const messageApi = {
    getByChannel: serverActions.getMessagesByChannel,
    create: serverActions.createMessage,
    update: serverActions.updateMessage,
    delete: serverActions.deleteMessage,
  };
  

// ?? Post APIs
export const postApi = {
    getAll: serverActions.getAllPosts,
    getById: serverActions.getPostById,
    create: serverActions.createPost,
    update: serverActions.updatePost,
    delete: serverActions.deletePost,
    like: serverActions.likePost,
    unlike: serverActions.unlikePost,
    createComment: serverActions.createComment,
    getComments: serverActions.getComments,
    updateComment: serverActions.updateComment,
    deleteComment: serverActions.deleteComment,
    createBlogPost: serverActions.createBlogPost,
    getPublicPosts: serverActions.getPublicPosts,
    updateBlogPost: serverActions.updateBlogPost,
    getBlogPostById: serverActions.getBlogPostById,
  };
  

// ?? Bookmark APIs
export const bookmarkApi = {
    getAll: serverActions.getAllBookmarks,
    create: serverActions.createBookmark,
    delete: serverActions.deleteBookmark,
  };
  

// ?? Event APIs
export const eventApi = {
    getAll: serverActions.getAllEvents,
    getById: serverActions.getEventById,
    create: serverActions.createEvent,
    update: serverActions.updateEvent,
    delete: serverActions.deleteEvent,
  };
  

// ?? Academy APIs
export const academyApi = {
    getAll: serverActions.getAllAcademies,
    getById: serverActions.getAcademyById,
    create: serverActions.createAcademy,
    update: serverActions.updateAcademy,
    delete: serverActions.deleteAcademy,
  };
  
// ?? Achievement APIs
export const achievementApi = {
    getAll: serverActions.getAllAchievements,
    getByUser: serverActions.getAchievementsByUser,
    create: serverActions.createAchievement,
    delete: serverActions.deleteAchievement,
  };
  

// ?? Enrollment APIs
export const enrollmentApi = {
    getAll: serverActions.getAllEnrollments,
    getByUser: serverActions.getEnrollmentsByUser,
    getByCourse: serverActions.getEnrollmentsByCourse,
    create: serverActions.createEnrollment,
    update: serverActions.updateEnrollments,
    delete: serverActions.deleteEnrollment,
    createEnrollmentCode: serverActions.createEnrollmentCode,
    updateEnrollmentCode: serverActions.updateEnrollmentCode,
    getAllEnrollmentCodes: serverActions.getAllEnrollmentCodes,
  };
  
// ?? Question APIs
export const questionApi = {
    getByQuiz: serverActions.getQuestionsByQuiz,
    getById: serverActions.getQuestionById,
    create: serverActions.createQuestion,
    update: serverActions.updateQuestion,
    delete: serverActions.deleteQuestion,
    createOption: serverActions.createOption,
    updateOption: serverActions.updateOption,
    deleteOption: serverActions.deleteOption,
    getOptionById: serverActions.getOptionById,
  };
  

// ?? Submission APIs
export const submissionApi = {
    getByQuiz: serverActions.getSubmissionsByQuiz,
    getByUser: serverActions.getSubmissionsByUser,
    getById: serverActions.getSubmissionById,
    create: serverActions.createSubmission,
    update: serverActions.updateSubmission,
    delete: serverActions.deleteSubmission,
  };
  
// ?? Profile APIs
export const profileApi = {
    getByUser: serverActions.getProfileByUser,
    update: serverActions.updateMyProfile,
  };
  

// ?? WebSocket APIs
export const websocketApi = {
    connect: () => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'}/ws`);
        return ws;
    },
};

// ?? Badge APIs
export const badgeApi = {
    getAll: serverActions.getAllBadges,
    getById: serverActions.getBadgeById,
    getByStudent: serverActions.getBadgesByStudent,
    create: serverActions.createBadge,
    update: serverActions.updateBadge,
    delete: serverActions.deleteBadge,
  };
  
// ?? Certificate APIs
export const certificateApi = {
    getAll: serverActions.getAllCertificates,
    getById: serverActions.getCertificateById,
    getByStudent: serverActions.getCertificatesByStudent,
    create: serverActions.createCertificate,
    update: serverActions.updateCertificate,
    delete: serverActions.deleteCertificate,
    download: serverActions.downloadCertificate,
    share: serverActions.shareCertificate,
  };
  

// ?? Community APIs
export const communityApi = {
    getAll: serverActions.getAllCommunities,
    getById: serverActions.getCommunityById,
    create: serverActions.createCommunity,
    update: serverActions.updateCommunity,
    delete: serverActions.deleteCommunity,
    getDiscussions: serverActions.getDiscussions,
    getDiscussionsByCommunityId: serverActions.getDiscussionsByCommunityId,
    getDiscussionById: serverActions.getDiscussionById,
    createDiscussion: serverActions.createDiscussion,
    updateDiscussion: serverActions.updateDiscussion,
    deleteDiscussion: serverActions.deleteDiscussion,
    getLiveRooms: serverActions.getLiveRooms,
    getLiveRoomById: serverActions.getLiveRoomById,
    createLiveRoom: serverActions.createLiveRoom,
    updateLiveRoom: serverActions.updateLiveRoom,
    deleteLiveRoom: serverActions.deleteLiveRoom,
    getGroups: serverActions.getGroups,
    getGroupById: serverActions.getCommunityGroupById,
    addGroup: serverActions.addGroup,
    removeGroup: serverActions.removeGroup,
    getPosts: serverActions.getCommunityPosts,
    getEvents: serverActions.getEvents,
    getEventsByUser: serverActions.getEventsByUser,
    getEventById: serverActions.getCommunityEventById,
    createEvent: serverActions.createCommunityEvent,
    updateEvent: serverActions.updateCommunityEvent,
    deleteEvent: serverActions.deleteCommunityEvent,
    addParticipant: serverActions.addParticipant,
    removeParticipant: serverActions.removeParticipant,
  };
  

// ?? Path APIs
// !! Path APIs
export const pathApi = {
    getAll: serverActions.getAllPaths,
    getById: serverActions.getPathById,
    getByCourse: serverActions.getPathsByCourse,
    create: serverActions.createPath,
    update: serverActions.updatePath,
    delete: serverActions.deletePath,
  };
  

// ?? Instructor APIs
// !! Instructor APIs
export const instructorApi = {
    getAll: serverActions.getAllInstructors,
    getById: serverActions.getInstructorById,
    create: serverActions.createInstructor,
    update: serverActions.updateInstructor,
    getCourses: serverActions.getInstructorCourses,
    delete: serverActions.deleteInstructor,
    getAllForStudents: serverActions.getAllForStudents,
    getDashboardData: serverActions.getInstructorDashboardData,
  };
  

// ?? Contact APIs
// !! Contact APIs
export const contactApi = {
    getAll: serverActions.getAllContacts,
    getById: serverActions.getContactById,
    create: serverActions.createContact,
    update: serverActions.updateContact,
    delete: serverActions.deleteContact,
  };
  

// ?? Support APIs
export const supportApi = {
    getAll: serverActions.getAllSupports,
    getById: serverActions.getSupportById,
    create: serverActions.createSupport,
    update: serverActions.updateSupport,
    delete: serverActions.deleteSupport,
  };

// ?? Landing APIs
export const landingApi = {
  getCourses: serverActions.getCourses,
  getInstructors: serverActions.getInstructors,
  getEventsPublic: serverActions.getEventsPublic,
  getBlogs: serverActions.getBlogs,
  getCourse: serverActions.getCourse,
  getInstructor: serverActions.getInstructor,
};
// ?? Export auth service for direct access
export { authService };

// ?? Export default api instance
export default api; 