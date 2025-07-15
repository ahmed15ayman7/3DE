'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  instructorApi, 
  courseApi, 
  userApi, 
  quizApi, 
  attendanceApi, 
  badgeApi, 
  certificateApi,
  notificationApi,
  communityApi,
  postApi
} from '@3de/apis';

// Query Keys
export const instructorKeys = {
  all: ['instructor'] as const,
  courses: (instructorId?: string) => [...instructorKeys.all, 'courses', instructorId] as const,
  students: (courseId: string) => [...instructorKeys.all, 'students', courseId] as const,
  quizzes: (instructorId: string) => [...instructorKeys.all, 'quizzes', instructorId] as const,
  attendance: () => [...instructorKeys.all, 'attendance'] as const,
  badges: () => [...instructorKeys.all, 'badges'] as const,
  certificates: () => [...instructorKeys.all, 'certificates'] as const,
  notifications: (userId: string) => [...instructorKeys.all, 'notifications', userId] as const,
  communities: () => [...instructorKeys.all, 'communities'] as const,
  posts: () => [...instructorKeys.all, 'posts'] as const,
  quizResults: (quizId: string) => [...instructorKeys.all, 'quizResults', quizId] as const,
};

// Instructor Courses
export const useInstructorCourses = (instructorId: string) => {
  return useQuery({
    queryKey: instructorKeys.courses(instructorId),
    queryFn: () => instructorApi.getCourses(instructorId),
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Course Students
export const useCourseStudents = (courseId: string) => {
  return useQuery({
    queryKey: instructorKeys.students(courseId),
    queryFn: () => courseApi.getStudents(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Instructor Quizzes
export const useInstructorQuizzes = (instructorId: string) => {
  return useQuery({
    queryKey: instructorKeys.quizzes(instructorId),
    queryFn: () => quizApi.getByInstructor(instructorId),
    enabled: !!instructorId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// All Attendance
export const useAttendance = () => {
  return useQuery({
    queryKey: instructorKeys.attendance(),
    queryFn: () => attendanceApi.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// All Badges
export const useBadges = () => {
  return useQuery({
    queryKey: instructorKeys.badges(),
    queryFn: () => badgeApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// All Certificates
export const useCertificates = () => {
  return useQuery({
    queryKey: instructorKeys.certificates(),
    queryFn: () => certificateApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User Notifications
export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: instructorKeys.notifications(userId),
    queryFn: () => notificationApi.getAllByUserId(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Communities with infinite scroll
export const useCommunities = () => {
  return useQuery({
    queryKey: instructorKeys.communities(),
    queryFn: () => communityApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Posts with infinite scroll
export const usePosts = () => {
  return useQuery({
    queryKey: instructorKeys.posts(),
    queryFn: () => postApi.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseData, instructorId }: { courseData: any; instructorId?: string }) => 
      courseApi.create(courseData, instructorId),
    onSuccess: (data, variables) => {
      // Invalidate instructor courses
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.courses(variables.instructorId || '') 
      });
    },
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (quizData: any) => quizApi.create(quizData),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.quizzes(variables.instructorId) 
      });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      attendanceApi.update(id, data),
    onSuccess: () => {
      // Invalidate attendance queries
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.attendance() 
      });
    },
  });
};

export const useCreateBadge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (badgeData: any) => badgeApi.create(badgeData),
    onSuccess: () => {
      // Invalidate badges queries
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.badges() 
      });
    },
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (certificateData: any) => certificateApi.create(certificateData),
    onSuccess: () => {
      // Invalidate certificates queries
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.certificates() 
      });
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: (data, variables, context) => {
      // Optimistic update or invalidate
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.notifications(context as string) 
      });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData: any) => postApi.create(postData),
    onSuccess: () => {
      // Invalidate posts queries
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.posts() 
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => postApi.like(postId),
    onSuccess: () => {
      // Invalidate posts queries
      queryClient.invalidateQueries({ 
        queryKey: instructorKeys.posts() 
      });
    },
  });
}; 

export const useQuizResults = (quizId: string) => {
  return useQuery({
    queryKey: instructorKeys.quizResults(quizId),
    queryFn: () => quizApi.getResults(quizId),
  });
};