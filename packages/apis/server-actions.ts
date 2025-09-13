"use server";
import fs from "fs";
import { cookies } from "next/headers";
import api, { API_URL } from "./index"; 
import { authService } from "./index"; 
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
  Admin,
  Parent,
  Child,
} from '@3de/interfaces';
import axios, { AxiosProgressEvent } from "axios";
export async function getAccessTokenFromCookieServer(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value as string;
  return token || '';
}
export async function setAccessTokenToCookieServer(accessToken: string,refreshToken: string) {
  console.log("set refreshToken",refreshToken)
  console.log("set accessToken",accessToken)
  const cookieStore = await cookies();
    // حفظ التوكن في الكوكيز
    cookieStore.set('accessToken', accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 // 15 minutes
    });
    
    
    cookieStore.set('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
}
export async function getRefreshTokenFromCookieServer(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('refreshToken')?.value as string;
  return token || '';
}
export async function refreshTokenServer(): Promise<{access_token:string,refreshToken:string}> {
  try {
    const cookieStore = await cookies();
    const refreshT = cookieStore.get('refreshToken')?.value as string;
    console.log("refreshT",refreshT)
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken: refreshT || ''
    });
    const { access_token } = response.data;
    return {access_token,refreshToken:refreshT};
  } catch (error: any) {
    await logout();
    return {access_token:"",refreshToken:""};
  }
} 
export async function logoutServer() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

export async function login(credentials: { 
  email: string; 
  password: string;
  device?: string;
  ip?: string;
  browser?: string;
  os?: string;
}): Promise<{ access_token: string; refreshToken: string; user: User } | null> {
  try {
    const response = await api.post('/auth/login', credentials);
    const { access_token, refreshToken } = response.data;
    await authService.setTokens(access_token, refreshToken);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function signup(data: { email: string; password: string; name: string }) {
  const response = await api.post('/auth/signup', data);
  const { accessToken, refreshToken } = response.data;
  await authService.setTokens(accessToken, refreshToken);
  return response.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    await authService.logout();
  }
}

export async function refreshToken(refreshToken: string) {
  const response = await api.post('/auth/refresh-token', { refreshToken });
  const { access_token } = response.data;
  await authService.setTokens(access_token, refreshToken);
  return access_token;
}

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  subRole: string;
}): Promise<{ access_token: string; refreshToken: string; user: User } | null> {
  const response = await api.post('/auth/register', data);
  const { access_token, refreshToken } = response.data;
  await authService.setTokens(access_token, refreshToken);
  return response.data;
}

export async function forgotPassword(email: string) {
  let result = await api.post('/auth/forgot-password', { email });
      return {data:result.data,status:result.status};
    }

export async function resetPassword(token: string, password: string) {
  let result = await api.post('/auth/reset-password', { token, password });
  return {data:result.data,status:result.status};
}





//??courseApis
//!!courseApis
export async function getAllCourses(): Promise<{ status: number; data: Course[] }> {
  let response = await api.get('/courses');
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCourseById(id: string): Promise<{
  status: number;
  data: Course & {
    lessons: (Lesson & { files: FileModel[]; quizzes: Quiz[] })[];
    quizzes: Quiz[];
    enrollments: (Enrollment & { user: User })[];
  };
}> {
  let response = await api.get(`/courses/${id}`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function createCourse(data: Partial<Course>, instructorId?: string) {
  try {
    const response = await api.post('/courses', { ...data });
    if (instructorId) {
      await api.post(`/courses/${response.data.id}/add-instructor/${instructorId}`);
    }
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.message ?? "Failed to create course");
  }
}

export async function updateCourse(id: string, data: Partial<Course>) {
  let response = await api.put(`/courses/${id}`, data);
  return {
    status: response.status,
    data: response.data
  };
}

export async function deleteCourse(id: string) {
  let response = await api.delete(`/courses/${id}`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function enrollCourse(courseId: string) {
  let response = await api.post(`/courses/${courseId}/enroll`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function unenrollCourse(courseId: string) {
  let response = await api.post(`/courses/${courseId}/unenroll`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function addInstructor(courseId: string, instructorId: string) {
  let response = await api.post(`/courses/${courseId}/add-instructor/${instructorId}`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function removeInstructor(courseId: string, instructorId: string) {
  let response = await api.post(`/courses/${courseId}/remove-instructor`, { instructorId });
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCourseLessons(courseId: string): Promise<{ status: number; data: (Lesson & { files: FileModel[]; quizzes: Quiz[] })[] }> {
  let response = await api.get(`/courses/${courseId}/lessons`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCourseQuizzes(courseId: string) {
  let response = await api.get(`/courses/${courseId}/quizzes`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCourseStudents(courseId: string): Promise<{ status: number; data: (Enrollment & { user: User })[] }> {
  let response = await api.get(`/courses/${courseId}/students`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCourseInstructors(courseId: string) {
  let response = await api.get(`/courses/${courseId}/instructors`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCoursesByStudentId(studentId: string): Promise<{
  status: number;
  data: (Course & {
    instructors: (Instructor & { user: User })[];
    lessons: (Lesson & { files: FileModel[]; quizzes: Quiz[] })[];
  })[];
}> {
  let response = await api.get(`/courses/by-student/${studentId}`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCoursesByInstructorId(instructorId: string): Promise<{
  status: number;
  data: (Course & {
    instructors: (Instructor & { user: User })[];
    lessons: (Lesson & { files: FileModel[]; quizzes: Quiz[] })[];
  })[];
}> {
  let response = await api.get(`/courses/by-instructor/${instructorId}`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function getCoursesByAcademyId(academyId: string) {
  let response = await api.get(`/courses/by-academy/${academyId}`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function updateEnrollment(courseId: string, enrollmentId: string, data: Partial<Enrollment>) {
  let response = await api.put(`/courses/${courseId}/enrollments/${enrollmentId}`, data);
  return {
    status: response.status,
    data: response.data
  };
}
//??userApis
//!!userApis
export async function getAllUsers(page: number, limit: number, search: string,isStudent?: boolean): Promise<{ status: number; data: User[] }> {
  const response = await api.get(`/users?page=${page}&limit=${limit}&search=${search}&isStudent=${isStudent||""}`);
  return { status: response.status, data: response.data };
}

export async function getUserById(id: string) {
  const response = await api.get(`/users/${id}`);
  return { status: response.status, data: response.data as User & { loginHistory: LoginHistory[]; twoFactor: TwoFactor; createdCourses: Course[]; enrollments: Enrollment[]; achievements: Achievement[]; notifications: Notification[]; lessons: Lesson[] } };
}

export async function createUser(data: Partial<User>) {
  const response = await api.post("/users", data);
  return { status: response.status, data: response.data };
}

export async function updateUser(id: string, data: Partial<User>) {
  const response = await api.patch(`/users/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`);
  return { status: response.status, data: response.data };
}

export async function getLoginHistory(id: string) {
  const response = await api.get(`/users/${id}/login-history`);
  return { status: response.status, data: response.data as { success: boolean; data: LoginHistory[] } };
}

export async function getTwoFactor(id: string) {
  const response = await api.get(`/users/${id}/two-factor`);
  return { status: response.status, data: response.data as { success: boolean; data: TwoFactor } };
}

export async function updateTwoFactor(id: string, data: TwoFactor) {
  const response = await api.post(`/users/${id}/two-factor`, data);
  return { status: response.status, data: response.data };
}

export async function getProfile(id: string) {
  const response = await api.get(`/users/${id}`);
  return { status: response.status, data: response.data as User & { loginHistory: LoginHistory[]; twoFactor: TwoFactor; createdCourses: Course[]; enrollments: Enrollment[]; achievements: Achievement[]; notifications: Notification[]; lessons: Lesson[] } };
}

export async function updateProfile(data: { firstName?: string; lastName?: string; email?: string; avatar?: string }) {
  const response = await api.patch("/users/profile", data);
  return { status: response.status, data: response.data };
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const response = await api.post("/users/change-password", data);
  return { status: response.status, data: response.data };
}

export async function getEnrolledCourses() {
  const response = await api.get("/users/courses");
  return { status: response.status, data: response.data };
}

export async function getAchievements(id: string) {
  const response = await api.get(`/users/achievements/${id}`);
  return { status: response.status, data: response.data as { success: boolean; data: Achievement[] } };
}

export async function getNotifications(id: string, page: number, limit: number, search: string) {
  const response = await api.get(`/notifications/user/${id}?page=${page}&limit=${limit}&search=${search}`);
  return { status: response.status, data: response.data as { success: boolean; data: Notification[] } };
}

export async function getSubmissions() {
  const response = await api.get("/users/submissions");
  return { status: response.status, data: response.data };
}

export async function getAttendance() {
  const response = await api.get("/users/attendance");
  return { status: response.status, data: response.data };
}

export async function getEnrollments(id: string): Promise<{ status: number; data: Enrollment[] }> {
  const response = await api.get(`/users/${id}/enrollments`);
  return { status: response.status, data: response.data };
}
export async function adminLogin(credentials: { email: string; password: string }): Promise<{ access_token: string; refreshToken: string; user: User }> {
  try {
    const response = await api.post("/admin-auth/login", credentials);
    const { access_token, refreshToken } = response.data;


    return {
      access_token,
      refreshToken,
      user: response.data.user
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDashboardStats(timeRange: "day" | "week" | "month" | "year" = "month") {
  const response = await api.get(`/admin-auth/dashboard/stats?timeRange=${timeRange}`);
  return {
    status: response.status,
    data: response.data
  };
}

export async function getAdminByUserId(userId: string): Promise<{ status: number; data: Admin }> {
  const response = await api.get(`/admin-auth/admin-by-user-id?userId=${userId}`);
  return {
    status: response.status,
    data: response.data
  };
}

//??lessonApis
//!!lessonApis
export async function getLessonsByCourse(courseId: string) {
  const response = await api.get(`/lessons/course/${courseId}`);
  return {
    status: response.status,
    data: response.data as (Lesson & {
      files: FileModel[];
      quizzes: (Quiz & { submissions: Submission[]; questions: Question[] })[];
    })[],
  };
}

export async function getLessonById(id: string) {
  const response = await api.get(`/lessons/${id}`);
  return {
    status: response.status,
    data: response.data as Lesson & {
      files: FileModel[];
      quizzes: (Quiz & { submissions: Submission[]; questions: Question[] })[];
    },
  };
}

export async function createLesson(data: {
  title: string;
  content: string;
  videoUrl?: string;
  courseId: string;
}) {
  const response = await api.post("/lessons", data);
  return {
    status: response.status,
    data: response.data,
  };
}

export async function getAllLessons(page: number, limit: number, search: string) {
  const response = await api.get(`/lessons?page=${page}&limit=${limit}&search=${search}`);
  return {
    status: response.status,
    data: response.data as { success: boolean; data: Lesson[] },
  };
}

export async function updateLesson(id: string, data: Partial<Lesson>) {
  const response = await api.put(`/lessons/${id}`, data);
  return {
    status: response.status,
    data: response.data,
  };
}

export async function deleteLesson(id: string) {
  const response = await api.delete(`/lessons/${id}`);
  return {
    status: response.status,
    data: response.data,
  };
}

export async function getLessonFiles(lessonId: string) {
  const response = await api.get(`/lessons/${lessonId}/files`);
  return {
    status: response.status,
    data: response.data,
  };
}

export async function getLessonQuizzes(lessonId: string) {
  const response = await api.get(`/lessons/${lessonId}/quizzes`);
  return {
    status: response.status,
    data: response.data,
  };
}

export async function markLessonAsCompleted(lessonId: string) {
  const response = await api.post(`/lessons/${lessonId}/complete`);
  return {
    status: response.status,
    data: response.data,
  };
}

export async function updateLessonBlockList(lessonId: string, userId: string, isBlocked: boolean) {
  const response = await api.post(`/lessons/block-list`, { lessonId, userId, isBlocked });
  return {
    status: response.status,
    data: response.data,
  };
}

export async function updateWatchedLesson(lessonId: string, userId: string, progress: number) {
  const response = await api.put(`/lessons/watched-lesson/${lessonId}/${userId}`, { progress });
  return {
    status: response.status,
    data: response.data,
  };
}

export async function addWatchedLesson(lessonId: string, userId: string, progress: number) {
  const response = await api.post(`/lessons/watched-lesson`, { lessonId, userId, progress });
  return {
    status: response.status,
    data: response.data,
  };
}

//??quizApis
export async function getQuizzesByLesson(lessonId: string) {
  const response = await api.get(`/quizzes/lesson/${lessonId}`);
  return { status: response.status, data: response.data };
}

export async function getAllQuizzes() {
  const response = await api.get(`/quizzes`);
  return { status: response.status, data: response.data };
}

export async function getQuizById(id: string) {
  const response = await api.get(`/quizzes/${id}`);
  return { status: response.status, data: response.data };
}

export async function createQuiz(data: Partial<Quiz>) {
  const response = await api.post(`/quizzes`, data);
  return { status: response.status, data: response.data };
}

export async function updateQuiz(id: string, data: Partial<Quiz>) {
  const response = await api.put(`/quizzes/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteQuiz(id: string) {
  const response = await api.delete(`/quizzes/${id}`);
  return { status: response.status, data: response.data };
}

export async function submitQuiz(quizId: string, answers: any) {
  const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
  return { status: response.status, data: response.data };
}

export async function getQuizResults(quizId: string) {
  const response = await api.get(`/quizzes/${quizId}/results`);
  return { status: response.status, data: response.data };
}

export async function getQuizStudentResults(quizId: string, studentId: string) {
  const response = await api.get(`/quizzes/${quizId}/student/${studentId}/results`);
  return { status: response.status, data: response.data };
}

export async function getQuizzesByStudent(studentId: string) {
  const response = await api.get(`/quizzes/student/${studentId}`);
  return { status: response.status, data: response.data };
}

export async function getQuizzesByInstructor(instructorId: string) {
  const response = await api.get(`/quizzes/instructor/${instructorId}`);
  return { status: response.status, data: response.data };
}

export async function getQuizzesByCourse(courseId: string) {
  const response = await api.get(`/quizzes/course/${courseId}`);
  return { status: response.status, data: response.data };
}

export async function getQuizzesByDate(date: string) {
  const response = await api.get(`/quizzes/date/${date}`);
  return { status: response.status, data: response.data };
}

export async function getQuizzesByStatus(status: string) {
  const response = await api.get(`/quizzes/status/${status}`);
  return { status: response.status, data: response.data };
}

export async function getActiveQuizzes() {
  const response = await api.get(`/quizzes/active`);
  return { status: response.status, data: response.data };
}

export async function getStudentPerformance(studentId: string) {
  const response = await api.get(`/quizzes/performance/${studentId}`);
  return { status: response.status, data: response.data };
}
//!!quizApis

//??assignmentApis
export async function getAssignmentsByCourse(courseId: string) {
  const response = await api.get(`/assignments/course/${courseId}`);
  return { status: response.status, data: response.data };
}

export async function getAssignmentById(id: string) {
  const response = await api.get(`/assignments/${id}`);
  return { status: response.status, data: response.data };
}

export async function createAssignment(data: any) {
  const response = await api.post(`/assignments`, data);
  return { status: response.status, data: response.data };
}

export async function updateAssignment(id: string, data: any) {
  const response = await api.patch(`/assignments/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteAssignment(id: string) {
  const response = await api.delete(`/assignments/${id}`);
  return { status: response.status, data: response.data };
}

export async function getAssignmentsByStudent(studentId: string) {
  const response = await api.get(`/assignments/student/${studentId}`);
  return { status: response.status, data: response.data };
}

export async function getAssignmentsByInstructor(instructorId: string) {
  const response = await api.get(`/assignments/instructor/${instructorId}`);
  return { status: response.status, data: response.data };
}

export async function getAssignmentsByDate(date: string) {
  const response = await api.get(`/assignments/date/${date}`);
  return { status: response.status, data: response.data };
}

export async function getAssignmentsByStatus(status: string) {
  const response = await api.get(`/assignments/status/${status}`);
  return { status: response.status, data: response.data };
}
//!!assignmentApis

//??attendanceApis
export async function getAllAttendance() {
  const response = await api.get(`/attendance`);
  return { status: response.status, data: response.data };
}

export async function getAttendanceById(id: string) {
  const response = await api.get(`/attendance/${id}`);
  return { status: response.status, data: response.data };
}

export async function createAttendance(data: Partial<Attendance>) {
  const response = await api.post(`/attendance`, data);
  return { status: response.status, data: response.data };
}

export async function updateAttendance(id: string, data: Partial<Attendance>) {
  const response = await api.patch(`/attendance/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteAttendance(id: string) {
  const response = await api.delete(`/attendance/${id}`);
  return { status: response.status, data: response.data };
}

export async function trackAttendance(data: {
  lessonId: string;
  studentId: string;
  method: "FACE_ID" | "QR_CODE";
}) {
  const response = await api.post(`/attendance/track`, data);
  return { status: response.status, data: response.data };
}

export async function getStudentStats(studentId: string) {
  const response = await api.get(`/attendance/student/${studentId}/stats`);
  return { status: response.status, data: response.data };
}

export async function getLessonAttendance(lessonId: string) {
  const response = await api.get(`/attendance/lesson/${lessonId}`);
  return { status: response.status, data: response.data };
}

export async function updateAttendanceStatus(
  id: string,
  status: "PRESENT" | "ABSENT" | "LATE"
) {
  const response = await api.patch(`/attendance/${id}/status`, { status });
  return { status: response.status, data: response.data };
}

export async function getAttendanceByDate(date: string) {
  const response = await api.get(`/attendance/date/${date}`);
  return { status: response.status, data: response.data };
}

export async function getAttendanceByDateAndLesson(date: string, lessonId: string) {
  const response = await api.get(`/attendance/date/${date}/lesson/${lessonId}`);
  return { status: response.status, data: response.data };
}

export async function getAttendanceByStudent(studentId: string) {
  const response = await api.get(`/attendance/student/${studentId}`);
  return { status: response.status, data: response.data };
}

export async function getAttendanceByDateAndStudent(date: string, studentId: string) {
  const response = await api.get(`/attendance/date/${date}/student/${studentId}`);
  return { status: response.status, data: response.data };
}

export async function getAttendanceByDateStudentLesson(
  date: string,
  studentId: string,
  lessonId: string
) {
  const response = await api.get(
    `/attendance/date/${date}/student/${studentId}/lesson/${lessonId}`
  );
  return { status: response.status, data: response.data };
}

export async function getAttendanceByDateStudentLessonStatus(
  date: string,
  studentId: string,
  lessonId: string,
  status: "PRESENT" | "ABSENT" | "LATE"
) {
  const response = await api.get(
    `/attendance/date/${date}/student/${studentId}/lesson/${lessonId}/status/${status}`
  );
  return { status: response.status, data: response.data };
}
//!!attendanceApis

//??notificationApis
export async function getAllNotifications(page: number, limit: number, search: string): Promise<{ status: number, data: {data: Notification[], total: number, totalPages: number} }> {
  const response = await api.get(`/notifications?skip=${page}&take=${limit}&search=${search}`);
  return { status: response.status, data: response.data };
}

export async function getNotificationsByUserId(userId: string, page: number, limit: number, search: string): Promise<{ status: number, data: {data: Notification[], total: number, totalPages: number} }> {
  const response = await api.get(`/notifications/user/${userId}?skip=${page}&take=${limit}&search=${search}`);
  return { status: response.status, data: response.data };
}

export async function getUnreadNotifications(): Promise<{ status: number, data: Notification[] }> {
  const response = await api.get(`/notifications/unread`);
  return { status: response.status, data: response.data };
}

export async function markNotificationAsRead(id: string): Promise<{ status: number, data: Notification[] }> {
  const response = await api.patch(`/notifications/${id}/read`);
  return { status: response.status, data: response.data };
}

export async function markAllNotificationsAsRead(): Promise<{ status: number, data: Notification[] }> {
  const response = await api.patch(`/notifications/read-all`);
  return { status: response.status, data: response.data };
}

export async function createNotification(data: {
  userId: string;
  type: string;
  message: string;
  actionUrl?: string;
  title?: string;
  urgent?: boolean;
  isImportant?: boolean;
}): Promise<{ status: number, data: Notification }> {
  const response = await api.post(`/notifications`, data);
  return { status: response.status, data: response.data };
}

export async function updateNotification(
  id: string,
  data: {
    message?: string;
    actionUrl?: string;
    title?: string;
    urgent?: boolean;
    isImportant?: boolean;
  }
): Promise<{ status: number, data: Notification }> {
  const response = await api.patch(`/notifications/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteNotification(id: string): Promise<{ status: number, data: Notification }> {
  const response = await api.delete(`/notifications/${id}`);
  return { status: response.status, data: response.data };
}

export async function getNotificationSettings(): Promise<{ status: number, data: Notification }> {
  const response = await api.get(`/notifications/settings`);
  return { status: response.status, data: response.data };
}

export async function getNotificationSettingsByUserId(userId: string): Promise<{ status: number, data: Notification }> {
  const response = await api.get(`/notifications/settings/user/${userId}`);
  return { status: response.status, data: response.data };
}

export async function updateNotificationSettings(data: {
  assignments: boolean;
  grades: boolean;
  messages: boolean;
  achievements: boolean;
  urgent: boolean;
  email: boolean;
  push: boolean;
}): Promise<{ status: number, data: Notification }> {
  const response = await api.patch(`/notifications/settings`, data);
  return { status: response.status, data: response.data };
}

export async function createNotificationSettings(data: {
  assignments: boolean;
  grades: boolean;
  messages: boolean;
  achievements: boolean;
  urgent: boolean;
  email: boolean;
  push: boolean;
}): Promise<{ status: number, data: Notification }> {
  const response = await api.post(`/notifications/settings`, data);
  return { status: response.status, data: response.data };
}
//!!notificationApis

//??fileApis
export async function createFile(data: Partial<FileModel>) {
  const response = await api.post(`/files`, data);
  return { status: response.status, data: response.data };
}

export async function getAllFiles() {
  const response = await api.get(`/files`);
  return { status: response.status, data: response.data };
}


export async function uploadFile(
  file: File,
  videoId: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await api.post(`/files/upload/video?videoId=${videoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    onUploadProgress,
  });

  return { status: response.status, data: response.data };
}

export async function getVideoLink(videoId: string) {
  const response = await api.get(`/files/video/${videoId}`);
  return { status: response.status, data: response.data };
}

export async function updateFile(id: string, data: Partial<FileModel>) {
  const response = await api.put(`/files/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteFile(id: string) {
  const response = await api.delete(`/files/${id}`);
  return { status: response.status, data: response.data };
}

export async function getFilesByLesson(lessonId: string) {
  const response = await api.get(`/files/lesson/${lessonId}`);
  return { status: response.status, data: response.data };
}

export async function downloadFile(id: string) {
  const response = await api.get(`/files/${id}/download`, { responseType: "blob" });
  return { status: response.status, data: response.data };
}
//!!fileApis

//??groupApis
export async function getAllGroups() {
  const response = await api.get(`/groups`);
  return { status: response.status, data: response.data };
}

export async function getGroupById(id: string) {
  const response = await api.get(`/groups/${id}`);
  return { status: response.status, data: response.data };
}

export async function createGroup(data: { name: string; members?: string[] }) {
  const response = await api.post(`/groups`, data);
  return { status: response.status, data: response.data };
}

export async function updateGroup(
  id: string,
  data: { name?: string; members?: string[] }
) {
  const response = await api.patch(`/groups/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteGroup(id: string) {
  const response = await api.delete(`/groups/${id}`);
  return { status: response.status, data: response.data };
}

export async function addGroupMember(groupId: string, userId: string) {
  const response = await api.post(`/groups/${groupId}/members/${userId}`);
  return { status: response.status, data: response.data };
}

export async function removeGroupMember(groupId: string, userId: string) {
  const response = await api.delete(`/groups/${groupId}/members/${userId}`);
  return { status: response.status, data: response.data };
}

export async function getGroupPosts(groupId: string) {
  const response = await api.get(`/groups/${groupId}/posts`);
  return { status: response.status, data: response.data };
}
//!!groupApis

//??channelApis
export async function getAllChannels() {
  const response = await api.get(`/channels`);
  return { status: response.status, data: response.data };
}

export async function getChannelById(id: string) {
  const response = await api.get(`/channels/${id}`);
  return { status: response.status, data: response.data };
}

export async function createChannel(data: { name: string; members?: string[] }) {
  const response = await api.post(`/channels`, data);
  return { status: response.status, data: response.data };
}

export async function updateChannel(
  id: string,
  data: { name?: string; members?: string[] }
) {
  const response = await api.patch(`/channels/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteChannel(id: string) {
  const response = await api.delete(`/channels/${id}`);
  return { status: response.status, data: response.data };
}

export async function addChannelMember(channelId: string, userId: string) {
  const response = await api.post(`/channels/${channelId}/members/${userId}`);
  return { status: response.status, data: response.data };
}

export async function removeChannelMember(channelId: string, userId: string) {
  const response = await api.delete(`/channels/${channelId}/members/${userId}`);
  return { status: response.status, data: response.data };
}
//!!channelApis

//??messageApis
export async function getMessagesByChannel(channelId: string) {
  const response = await api.get(`/messages/channel/${channelId}`);
  return { status: response.status, data: response.data };
}

export async function createMessage(data: { content: string; channelId: string }) {
  const response = await api.post(`/messages`, data);
  return { status: response.status, data: response.data };
}

export async function updateMessage(id: string, content: string) {
  const response = await api.patch(`/messages/${id}`, { content });
  return { status: response.status, data: response.data };
}

export async function deleteMessage(id: string) {
  const response = await api.delete(`/messages/${id}`);
  return { status: response.status, data: response.data };
}
//!!messageApis


//??postApis
export async function getAllPosts() {
  const response = await api.get(`/posts`);
  return { status: response.status, data: response.data };
}

export async function getPostById(id: string) {
  const response = await api.get(`/posts/${id}`);
  return { status: response.status, data: response.data };
}

export async function createPost(data: Partial<Post>) {
  const response = await api.post(`/posts`, data);
  return { status: response.status, data: response.data };
}

export async function updatePost(id: string, content: string) {
  const response = await api.patch(`/posts/${id}`, { content });
  return { status: response.status, data: response.data };
}

export async function deletePost(id: string) {
  const response = await api.delete(`/posts/${id}`);
  return { status: response.status, data: response.data };
}

export async function likePost(id: string, userId: string) {
  const response = await api.post(`/posts/${id}/like/${userId}`);
  return { status: response.status, data: response.data };
}

export async function unlikePost(id: string, userId: string) {
  const response = await api.post(`/posts/${id}/unlike/${userId}`);
  return { status: response.status, data: response.data };
}

export async function createComment(id: string, userId: string, content: string) {
  const response = await api.post(`/posts/${id}/comments`, { userId, content });
  return { status: response.status, data: response.data };
}

export async function getComments(id: string) {
  const response = await api.get(`/posts/${id}/comments`);
  return { status: response.status, data: response.data };
}

export async function updateComment(id: string, commentId: string, content: string) {
  const response = await api.put(`/posts/${id}/comments/${commentId}`, { content });
  return { status: response.status, data: response.data };
}

export async function deleteComment(id: string, commentId: string) {
  const response = await api.delete(`/posts/${id}/comments/${commentId}`);
  return { status: response.status, data: response.data };
}

export async function createBlogPost(data: Partial<BlogPost>) {
  const response = await api.post(`/posts/blog`, data);
  return { status: response.status, data: response.data };
}

export async function getPublicPosts(search: string, take: number, skip: number) {
  const response = await api.get(
    `/posts/public-relation/posts?search=${search}&take=${take}&skip=${skip}`
  );
  return { status: response.status, data: response.data };
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  const response = await api.put(`/posts/blog/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function getBlogPostById(id: string) {
  const response = await api.get(`/posts/blog/${id}`);
  return { status: response.status, data: response.data };
}
//!!postApis


//??bookmarkApis
export async function getAllBookmarks() {
  const response = await api.get(`/bookmarks`);
  return { status: response.status, data: response.data };
}

export async function createBookmark(data: { type: string; itemId: string }) {
  const response = await api.post(`/bookmarks`, data);
  return { status: response.status, data: response.data };
}

export async function deleteBookmark(id: string) {
  const response = await api.delete(`/bookmarks/${id}`);
  return { status: response.status, data: response.data };
}
//!!bookmarkApis

//??eventApis
export async function getAllEvents(search: string, take: number, skip: number) {
  const response = await api.get(`/events?search=${search}&take=${take}&skip=${skip}`);
  return { status: response.status, data: response.data };
}

export async function getEventById(id: string) {
  const response = await api.get(`/events/${id}`);
  return { status: response.status, data: response.data };
}

export async function createEvent(data: Partial<Event>) {
  const response = await api.post(`/events`, data);
  return { status: response.status, data: response.data };
}

export async function updateEvent(id: string, data: Partial<Event>) {
  const response = await api.patch(`/events/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteEvent(id: string) {
  const response = await api.delete(`/events/${id}`);
  return { status: response.status, data: response.data };
}
//!!eventApis

//??academyApis
export async function getAllAcademies() {
  const response = await api.get(`/academies`);
  return { status: response.status, data: response.data };
}

export async function getAcademyById(id: string) {
  const response = await api.get(`/academies/${id}`);
  return { status: response.status, data: response.data };
}

export async function createAcademy(data: {
  name: string;
  description?: string;
  logo?: string;
  settings?: any;
}) {
  const response = await api.post(`/academies`, data);
  return { status: response.status, data: response.data };
}

export async function updateAcademy(id: string, data: {
  name?: string;
  description?: string;
  logo?: string;
  settings?: any;
}) {
  const response = await api.patch(`/academies/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteAcademy(id: string) {
  const response = await api.delete(`/academies/${id}`);
  return { status: response.status, data: response.data };
}
//!!academyApis
//??achievementApis
export async function getAllAchievements(): Promise<{ status: number; data: Achievement[] }> {
  const response = await api.get(`/achievements`);
  return { status: response.status, data: response.data };
}

export async function getAchievementsByUser(userId: string): Promise<{ status: number; data: Achievement[] }> {
  const response = await api.get(`/achievements/user/${userId}`);
  return { status: response.status, data: response.data };
}

export async function createAchievement(data: { userId: string; type: string; value: any }) {
  const response = await api.post(`/achievements`, data);
  return { status: response.status, data: response.data };
}

export async function deleteAchievement(id: string) {
  const response = await api.delete(`/achievements/${id}`);
  return { status: response.status, data: response.data };
}
//!!achievementApis

//??enrollmentApis
export async function getAllEnrollments(): Promise<{ status: number; data: Enrollment[] }> {
  const response = await api.get(`/enrollments`);
  return { status: response.status, data: response.data };
}

export async function getEnrollmentsByUser(userId: string): Promise<{ status: number; data: Enrollment[] }> {
  const response = await api.get(`/enrollments/user/${userId}`);
  return { status: response.status, data: response.data };
}

export async function getEnrollmentsByCourse(courseId: string): Promise<{ status: number; data: Enrollment[] }> {
  const response = await api.get(`/enrollments/course/${courseId}`);
  return { status: response.status, data: response.data };
}

export async function createEnrollment(data: Partial<Enrollment>) {
  const response = await api.post(`/enrollments`, data);
  return { status: response.status, data: response.data };
}

export async function updateEnrollments(id: string, data: { progress?: number; status?: string }) {
  const response = await api.put(`/enrollments/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteEnrollment(id: string) {
  const response = await api.delete(`/enrollments/${id}`);
  return { status: response.status, data: response.data };
}

export async function createEnrollmentCode(data: Partial<EnrollmentCode>) {
  const response = await api.post(`/enrollments/code`, data);
  return { status: response.status, data: response.data };
}

export async function updateEnrollmentCode(code: string, data: Partial<EnrollmentCode>) {
  const response = await api.put(`/enrollments/code/${code}`, data);
  return { status: response.status, data: response.data };
}

export async function getAllEnrollmentCodes(search: string, take: number, skip: number, courseId: string): Promise<{ status: number; data: {data: EnrollmentCode[], total: number, totalPages: number} }> {
  const response = await api.get(`/enrollments/codes/all?search=${search}&take=${take}&skip=${skip}&courseId=${courseId}`);
  return { status: response.status, data: response.data };
}
//!!enrollmentApis


//??questionApis
export async function getQuestionsByQuiz(quizId: string) {
  const response = await api.get(`/questions/${quizId}/quiz`);
  return { status: response.status, data: response.data };
}

export async function getQuestionById(id: string) {
  const response = await api.get(`/questions/${id}`);
  return { status: response.status, data: response.data };
}

export async function createQuestion(data: Partial<Question & { options: Partial<Option>[] }>) {
  const response = await api.post(`/questions`, data);
  return { status: response.status, data: response.data };
}

export async function updateQuestion(id: string, data: Partial<Question>) {
  const response = await api.put(`/questions/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteQuestion(id: string) {
  const response = await api.delete(`/questions/${id}`);
  return { status: response.status, data: response.data };
}

export async function createOption(data: Partial<Option>) {
  const response = await api.post(`/questions/option`, data);
  return { status: response.status, data: response.data };
}

export async function updateOption(id: string, data: Partial<Option>) {
  const response = await api.put(`/questions/${id}/option`, data);
  return { status: response.status, data: response.data };
}

export async function deleteOption(id: string) {
  const response = await api.delete(`/questions/option/${id}`);
  return { status: response.status, data: response.data };
}

export async function getOptionById(questionId: string, optionId: string) {
  const response = await api.get(`/questions/${questionId}/option/${optionId}`);
  return { status: response.status, data: response.data };
}
//!!questionApis

//??submissionApis
export async function getSubmissionsByQuiz(quizId: string) {
  const response = await api.get(`/submissions/quiz/${quizId}`);
  return { status: response.status, data: response.data };
}

export async function getSubmissionsByUser(userId: string) {
  const response = await api.get(`/submissions/user/${userId}`);
  return { status: response.status, data: response.data };
}

export async function getSubmissionById(id: string) {
  const response = await api.get(`/submissions/${id}`);
  return { status: response.status, data: response.data };
}

export async function createSubmission(data: Partial<Submission>) {
  const response = await api.post(`/submissions`, data);
  return { status: response.status, data: response.data };
}

export async function updateSubmission(id: string, data: { answers?: any; score?: number }) {
  const response = await api.patch(`/submissions/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteSubmission(id: string) {
  const response = await api.delete(`/submissions/${id}`);
  return { status: response.status, data: response.data };
}
//!!submissionApis

//??profileApis
export async function getProfileByUser(userId: string) {
  const response = await api.get(`/profiles/user/${userId}`);
  return { status: response.status, data: response.data };
}

export async function updateMyProfile(data: { bio?: string; phone?: string; address?: string; preferences?: any }) {
  const response = await api.patch(`/profiles`, data);
  return { status: response.status, data: response.data };
}
//!!profileApis

//??badgeApis
export async function getAllBadges(): Promise<{ status: number; data: Badge[] }> {
  const response = await api.get(`/badges`);
  return { status: response.status, data: response.data };
}

export async function getBadgeById(id: string): Promise<{ status: number; data: Badge }> {
  const response = await api.get(`/badges/${id}`);
  return { status: response.status, data: response.data };
}

export async function getBadgesByStudent(studentId: string): Promise<{ status: number; data: Badge[] }> {
  const response = await api.get(`/badges/student/${studentId}`);
  return { status: response.status, data: response.data };
}

export async function createBadge(data: {
  userId: string;
  title: string;
  description?: string;
  image?: string;
  points: number;
  type: string;
  earnedAt: string;
}) {
  const response = await api.post(`/badges`, data);
  return { status: response.status, data: response.data };
}

export async function updateBadge(id: string, data: {
  title?: string;
  description?: string;
  image?: string;
  points?: number;
  type?: string;
  earnedAt?: string;
}) {
  const response = await api.patch(`/badges/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteBadge(id: string) {
  const response = await api.delete(`/badges/${id}`);
  return { status: response.status, data: response.data };
}
//!!badgeApis

//??certificateApis
export async function getAllCertificates(): Promise<{ status: number; data: Certificate[] }> {
  const response = await api.get(`/certificates`);
  return { status: response.status, data: response.data };
}

export async function getCertificateById(id: string) {
  const response = await api.get(`/certificates/${id}`);
  return { status: response.status, data: response.data };
}

export async function getCertificatesByStudent(studentId: string) {
  const response = await api.get(`/certificates/student?userId=${studentId}`);
  return { status: response.status, data: response.data };
}

export async function createCertificate(data: {
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
}) {
  const response = await api.post(`/certificates`, data);
  return { status: response.status, data: response.data };
}

export async function updateCertificate(id: string, data: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  points?: number;
  type?: string;
  earnedAt?: string;
}) {
  const response = await api.patch(`/certificates/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteCertificate(id: string) {
  const response = await api.delete(`/certificates/${id}`);
  return { status: response.status, data: response.data };
}

export async function downloadCertificate(id: string) {
  const response = await api.get(`/certificates/${id}/download`, {
    responseType: 'blob',
  });
  return { status: response.status, data: response.data };
}

export async function shareCertificate(id: string, platform: string) {
  const response = await api.post(`/certificates/${id}/share`, { platform });
  return { status: response.status, data: response.data };
}
//!!certificateApis

//??communityApis
export async function getAllCommunities(): Promise<{ status: number; data: Community[] }> {
  const response = await api.get(`/communities`);
  return { status: response.status, data: response.data };
}

export async function getCommunityById(id: string) {
  const response = await api.get(`/communities/${id}`);
  return { status: response.status, data: response.data };
}

export async function createCommunity(data: { name: string; description?: string }) {
  const response = await api.post(`/communities`, data);
  return { status: response.status, data: response.data };
}

export async function updateCommunity(id: string, data: { name?: string; description?: string }) {
  const response = await api.patch(`/communities/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteCommunity(id: string) {
  const response = await api.delete(`/communities/${id}`);
  return { status: response.status, data: response.data };
}

// Discussions
export async function getDiscussions(id: string) {
  const response = await api.get(`/communities/${id}/discussions`);
  return { status: response.status, data: response.data };
}
export async function getDiscussionsByCommunityId(id: string) {
  const response = await api.get(`/communities/${id}/discussions/by-community-id`);
  return { status: response.status, data: response.data };
}
export async function getDiscussionById(id: string) {
  const response = await api.get(`/communities/${id}/discussions/${id}`);
  return { status: response.status, data: response.data };
}
export async function createDiscussion(id: string, data: { title: string; content: string }) {
  const response = await api.post(`/communities/${id}/discussions`, data);
  return { status: response.status, data: response.data };
}
export async function updateDiscussion(id: string, discussionId: string, data: { title?: string; content?: string }) {
  const response = await api.patch(`/communities/${id}/discussions/${discussionId}`, data);
  return { status: response.status, data: response.data };
}
export async function deleteDiscussion(id: string, discussionId: string) {
  const response = await api.delete(`/communities/${id}/discussions/${discussionId}`);
  return { status: response.status, data: response.data };
}

// LiveRooms
export async function getLiveRooms(id: string) {
  const response = await api.get(`/communities/${id}/live-rooms`);
  return { status: response.status, data: response.data };
}
export async function getLiveRoomById(id: string, liveRoomId: string) {
  const response = await api.get(`/communities/${id}/live-rooms/${liveRoomId}`);
  return { status: response.status, data: response.data };
}
export async function createLiveRoom(id: string, data: { title: string; description?: string }) {
  const response = await api.post(`/communities/${id}/live-rooms`, data);
  return { status: response.status, data: response.data };
}
export async function updateLiveRoom(id: string, liveRoomId: string, data: { title?: string; description?: string }) {
  const response = await api.patch(`/communities/${id}/live-rooms/${liveRoomId}`, data);
  return { status: response.status, data: response.data };
}
export async function deleteLiveRoom(id: string, liveRoomId: string) {
  const response = await api.delete(`/communities/${id}/live-rooms/${liveRoomId}`);
  return { status: response.status, data: response.data };
}

// Groups
export async function getGroups(id: string) {
  const response = await api.get(`/communities/${id}/groups`);
  return { status: response.status, data: response.data };
}
export async function getCommunityGroupById(id: string, groupId: string) {
  const response = await api.get(`/communities/${id}/groups/${groupId}`);
  return { status: response.status, data: response.data };
}
export async function addGroup(id: string, groupId: string) {
  const response = await api.post(`/communities/${id}/groups`, { groupId });
  return { status: response.status, data: response.data };
}
export async function removeGroup(id: string, groupId: string) {
  const response = await api.delete(`/communities/${id}/groups/${groupId}`);
  return { status: response.status, data: response.data };
}

// Posts
export async function getCommunityPosts(id: string) {
  const response = await api.get(`/communities/${id}/posts`);
  return { status: response.status, data: response.data };
}

// Events
export async function getEvents(id: string) {
  const response = await api.get(`/communities/${id}/events`);
  return { status: response.status, data: response.data };
}
export async function getEventsByUser(userId: string) {
  const response = await api.get(`/communities/events/user/${userId}`);
  return { status: response.status, data: response.data };
}
export async function getCommunityEventById(id: string, eventId: string) {
  const response = await api.get(`/communities/${id}/events/${eventId}`);
  return { status: response.status, data: response.data };
}
export async function createCommunityEvent(id: string, data: { title: string; description?: string }) {
  const response = await api.post(`/communities/${id}/events`, data);
  return { status: response.status, data: response.data };
}
export async function updateCommunityEvent(id: string, eventId: string, data: { title?: string; description?: string }) {
  const response = await api.patch(`/communities/${id}/events/${eventId}`, data);
  return { status: response.status, data: response.data };
}
export async function deleteCommunityEvent(id: string, eventId: string) {
  const response = await api.delete(`/communities/${id}/events/${eventId}`);
  return { status: response.status, data: response.data };
}

// Participants
export async function addParticipant(id: string, userId: string) {
  const response = await api.post(`/communities/${id}/participants/${userId}`);
  return { status: response.status, data: response.data };
}
export async function removeParticipant(id: string, userId: string) {
  const response = await api.delete(`/communities/${id}/participants/${userId}`);
  return { status: response.status, data: response.data };
}
//!!communityApis

//??pathApis
export async function getAllPaths(page: number, limit: number, search: string) {
  const response = await api.get(`/paths?page=${page}&limit=${limit}&search=${search}`);
  return { status: response.status, data: response.data };
}

export async function getPathById(id: string) {
  const response = await api.get(`/paths/${id}`);
  return { status: response.status, data: response.data };
}

export async function getPathsByCourse(courseId: string) {
  const response = await api.get(`/paths/course/${courseId}`);
  return { status: response.status, data: response.data };
}

export async function createPath(data: Path) {
  const response = await api.post(`/paths`, data);
  return { status: response.status, data: response.data };
}

export async function updatePath(id: string, data: Path) {
  const response = await api.patch(`/paths/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deletePath(id: string) {
  const response = await api.delete(`/paths/${id}`);
  return { status: response.status, data: response.data };
}
//!!pathApis

//??instructorApis
export async function getAllInstructors(skip: number, limit: number, search: string): Promise<{ status: number; data: (Instructor & {user: User, courses: Course[]})[] }> {
  const response = await api.get(`/instructors?skip=${skip}&limit=${limit}&search=${search}`);
  return { status: response.status, data: response.data };
}

export async function getInstructorById(id: string): Promise<{ status: number; data: Instructor&{user:User,courses:Course[]} }> {
  const response = await api.get(`/instructors/${id}`);
  return { status: response.status, data: response.data };
}

export async function createInstructor(data: Partial<Instructor>) {
  const response = await api.post(`/instructors`, data);
  return { status: response.status, data: response.data };
}

export async function updateInstructor(id: string, data: Partial<Instructor>) {
  const response = await api.patch(`/instructors/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function getInstructorCourses(id: string) {
  const response = await api.get(`/instructors/${id}/courses`);
  return { status: response.status, data: response.data };
}

export async function deleteInstructor(id: string) {
  const response = await api.delete(`/instructors/${id}`);
  return { status: response.status, data: response.data };
}

export async function getAllForStudents(id: string) {
  const response = await api.get(`/instructors/for-students/${id}`);
  return { status: response.status, data: response.data };
}

export async function getInstructorDashboardData(id: string): Promise<{ status: number, data: {
  statistics: {
    totalCourses: number;
    totalStudents: number;
    activeQuizzes: number;
    averageProgress: number;
  },
  performanceMetrics: {
    assignmentCompletionRate: number;
    attendanceRate: number;
    successRate: number;
    lessonWatchRate: number;
  },
  recentNotifications: Notification[],
  weeklyData: {
    date: string;
    totalStudents: number;
    activeQuizzes: number;
    averageProgress: number;
  }[],
  courseCompletionData: {
    courseId: string;
    courseName: string;
    completionRate: number;
  }[]
} }> {
  const response = await api.get(`/instructors/${id}/dashboard`);
  return { status: response.status, data: response.data };
}
//!!instructorApis

//??contactApis
export async function getAllContacts(search: string, take: number, skip: number) {
  const response = await api.get(`/contact?search=${search}&take=${take}&skip=${skip}`);
  return { status: response.status, data: response.data };
}

export async function getContactById(id: string) {
  const response = await api.get(`/contact/${id}`);
  return { status: response.status, data: response.data };
}

export async function createContact(data: ContactUs) {
  const response = await axios.post('https://api.3de.school/contact', data);
  return { status: response.status, data: response.data };
}

export async function updateContact(id: string, data: Partial<ContactUs>) {
  const response = await api.patch(`/contact/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteContact(id: string) {
  const response = await api.delete(`/contact/${id}`);
  return { status: response.status, data: response.data };
}
//!!contactApis

//??supportApis
export async function getAllSupports() {
  const response = await api.get(`/supports`);
  return { status: response.status, data: response.data };
}

export async function getSupportById(id: string) {
  const response = await api.get(`/supports/${id}`);
  return { status: response.status, data: response.data };
}

export async function createSupport(data: Support) {
  const response = await api.post(`/supports`, data);
  return { status: response.status, data: response.data };
}

export async function updateSupport(id: string, data: Partial<Support>) {
  const response = await api.patch(`/supports/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function deleteSupport(id: string) {
  const response = await api.delete(`/supports/${id}`);
  return { status: response.status, data: response.data };
}
//!!supportApis

//??parentApis
export async function getAllParents(search: string, take: number, skip: number): Promise<{ status: number, data: {data: Parent[], total: number, totalPages: number} }> {
  const response = await api.get(`/parents?search=${search}&take=${take}&skip=${skip}`);
  return { status: response.status, data: response.data };
}

export async function getParentById(id: string) {
  const response = await api.get(`/parents/${id}`);
  return { status: response.status, data: response.data };
}

export async function createParent(data: Partial<Parent>) {
  const response = await api.post(`/parents`, data);
  return { status: response.status, data: response.data };
}

export async function updateParent(id: string, data: Partial<User>) {
  const response = await api.patch(`/parents/${id}`, data);
  return { status: response.status, data: response.data };
}

export async function updateParentUser(id: string, data: Partial<User>) {
  const response = await api.patch(`/parents/${id}/user`, data);
  return { status: response.status, data: response.data };
}
export async function deleteParent(id: string) {
  const response = await api.delete(`/parents/${id}`);
  return { status: response.status, data: response.data };
}
export async function getAllChildren(parentId: string) {
  const response = await api.get(`/parents/${parentId}/children`);
  return { status: response.status, data: response.data };
}
export async function getChildById(parentId: string, childId: string) {
  const response = await api.get(`/parents/${parentId}/children/${childId}`);
  return { status: response.status, data: response.data };
}
export async function createChild(parentId: string, data: Partial<Child>) {
  const response = await api.post(`/parents/${parentId}/children`, data);
  return { status: response.status, data: response.data };
}
export async function updateChild(parentId: string, childId: string, data: Partial<Child>) {
  const response = await api.patch(`/parents/${parentId}/children/${childId}`, data);
  return { status: response.status, data: response.data };
}
export async function deleteChild(parentId: string, childId: string) {
  const response = await api.delete(`/parents/${parentId}/children/${childId}`);
  return { status: response.status, data: response.data };
}
//!!parentApis  

//??landingApis
export async function getCourses(search: string, take: number, skip: number) {
  const response = await axios.get(`https://api.3de.school/public/courses?search=${search}&take=${take}&skip=${skip}`);
  return {status:response.status,data:response.data} as {status:number,data: {courses:Course[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}};
}
export async function getInstructors(search: string, take: number, skip: number) {
  const response = await axios.get(`https://api.3de.school/public/instructors?search=${search}&take=${take}&skip=${skip}`);
  return {status:response.status,data:response.data} as {status:number,data: {instructors:Instructor[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}};
}
  export async function getEventsPublic(search: string, take: number, skip: number) {
    const response = await axios.get(`https://api.3de.school/public/events?search=${search}&take=${take}&skip=${skip}`);
    return {status:response.status,data:response.data} as {status:number,data: {events:Event[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}};
  }
  export async function getBlogs(search: string, take: number, skip: number) {
    const response = await axios.get(`https://api.3de.school/public/posts?search=${search}&take=${take}&skip=${skip}`);
    return {status:response.status,data:response.data} as {status:number,data: {posts:BlogPost[],total:number,totalPages:number,hasNextPage:boolean,hasPreviousPage:boolean}};
  }
  export async function getCourse(id: string) {
    const response = await axios.get(`https://api.3de.school/public/courses/${id}`);
    return {status:response.status,data:response.data} as {status:number,data: Course};
  }
  export async function getInstructor(id: string) {
    const response = await axios.get(`https://api.3de.school/public/instructors/${id}`);
    return {status:response.status,data:response.data} as {status:number,data: Instructor};
  }
  //!!landingApis