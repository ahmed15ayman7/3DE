// // Custom types for the student app

// declare module '@3de/ui' {
//   export interface ButtonProps {
//     variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
//     size?: 'sm' | 'md' | 'lg';
//     loading?: boolean;
//     disabled?: boolean;
//     children: React.ReactNode;
//     onClick?: () => void;
//     className?: string;
//   }

//   export interface CardProps {
//     children: React.ReactNode;
//     className?: string;
//   }

//   export interface AvatarProps {
//     src?: string;
//     alt: string;
//     size?: 'sm' | 'md' | 'lg' | 'xl';
//     className?: string;
//   }

//   export interface ProgressProps {
//     value: number;
//     onChange?: (value: number) => void;
//     className?: string;
//   }

//   export interface BadgeProps {
//     variant?: 'default' | 'outline';
//     children: React.ReactNode;
//     className?: string;
//   }

//   export interface SkeletonProps {
//     className?: string;
//   }

//   export interface SwitchProps {
//     checked: boolean;
//     onChange: (checked: boolean) => void;
//     className?: string;
//   }

//   export interface RadioProps {
//     checked: boolean;
//     onChange: () => void;
//     className?: string;
//   }

//   export interface CheckboxProps {
//     checked: boolean;
//     onChange: (checked: boolean) => void;
//     className?: string;
//   }

//   export interface AlertProps {
//     variant?: 'info' | 'success' | 'warning' | 'error';
//     title?: string;
//     children: React.ReactNode;
//   }

//   export interface DropdownProps {
//     trigger: React.ReactNode;
//     items: Array<{
//       label: string;
//       icon?: React.ComponentType;
//       href?: string;
//       onClick?: () => void;
//     }>;
//   }

//   export const Button: React.FC<ButtonProps>;
//   export const Card: React.FC<CardProps>;
//   export const Avatar: React.FC<AvatarProps>;
//   export const Progress: React.FC<ProgressProps>;
//   export const Badge: React.FC<BadgeProps>;
//   export const Skeleton: React.FC<SkeletonProps>;
//   export const Switch: React.FC<SwitchProps>;
//   export const Radio: React.FC<RadioProps>;
//   export const Checkbox: React.FC<CheckboxProps>;
//   export const Alert: React.FC<AlertProps>;
//   export const Dropdown: React.FC<DropdownProps>;
// }

// declare module '@3de/apis' {
//   export interface Course {
//     id: string;
//     title: string;
//     description: string;
//     thumbnail?: string;
//     duration?: string;
//     instructor?: {
//       id: string;
//       name: string;
//     };
//     category: string;
//     isEnrolled: boolean;
//     progress?: number;
//   }

//   export interface Instructor {
//     id: string;
//     name: string;
//     title: string;
//     bio: string;
//     avatar?: string;
//     email?: string;
//     phone?: string;
//     location?: string;
//     rating: number;
//     studentsCount: number;
//     coursesCount: number;
//     experienceYears: number;
//     satisfactionRate: number;
//     skills?: string[];
//   }

//   export interface Lesson {
//     id: string;
//     title: string;
//     description?: string;
//     progress?: number;
//     files?: File[];
//   }

//   export interface File {
//     id: string;
//     name: string;
//     url: string;
//     type: string;
//     size?: number;
//     isCompleted?: boolean;
//   }

//   export interface QuizQuestion {
//     id: string;
//     text: string;
//     image?: string;
//     type: 'text' | 'image';
//     isMultiple: boolean;
//     points: number;
//     order: number;
//     options?: Array<{
//       id: string;
//       text: string;
//     }>;
//   }

//   export interface Quiz {
//     id: string;
//     title: string;
//     description: string;
//     timeLimit?: number;
//     passingScore?: number;
//     questions?: QuizQuestion[];
//   }

//   export interface Notification {
//     id: string;
//     title: string;
//     message: string;
//     type: string;
//     isRead: boolean;
//     createdAt: string;
//   }

//   export interface UserProfile {
//     id: string;
//     name: string;
//     email: string;
//     phone?: string;
//     bio?: string;
//     location?: string;
//     avatar?: string;
//     createdAt: string;
//     overallProgress: number;
//     enrolledCourses: number;
//     completedCourses: number;
//     earnedPoints: number;
//     recentActivity?: Array<{
//       title: string;
//       date: string;
//     }>;
//   }

//   export interface StudentStats {
//     enrolledCourses: number;
//     completedLessons: number;
//     earnedPoints: number;
//     overallProgress: number;
//     completedCourses: number;
//     studyHours: number;
//     averageScore: number;
//   }

//   export function getCourses(): Promise<Course[]>;
//   export function getCourse(id: string): Promise<Course>;
//   export function getCourseLessons(courseId: string): Promise<Lesson[]>;
//   export function updateLessonProgress(lessonId: string, progress: number): Promise<void>;
  
//   export function getInstructors(): Promise<Instructor[]>;
//   export function getInstructor(id: string): Promise<Instructor>;
//   export function getInstructorCourses(instructorId: string): Promise<Course[]>;
  
//   export function getQuiz(courseId: string): Promise<Quiz>;
//   export function submitQuiz(quizId: string, answers: Record<string, string | string[]>): Promise<void>;
  
//   export function getNotifications(): Promise<Notification[]>;
//   export function markNotificationAsRead(notificationId: string): Promise<void>;
  
//   export function getUserProfile(): Promise<UserProfile>;
//   export function updateUserProfile(data: Partial<UserProfile>): Promise<void>;
  
//   export function getStudentStats(): Promise<StudentStats>;
// }

// declare module '@3de/auth' {
//   export interface User {
//     id: string;
//     name: string;
//     email: string;
//     avatar?: string;
//     role: string;
//     createdAt: string;
//   }

//   export function useAuth(): {
//     user: User | null;
//     login: (email: string, password: string) => Promise<void>;
//     logout: () => void;
//     isLoading: boolean;
//   };

//   export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element;

//   export function withAuth(
//     handler: (req: any) => any,
//     config: {
//       callbacks: {
//         authorized: (params: { token: any; req: any }) => boolean;
//       };
//     }
//   ): any;
// }

// declare module '@3de/interfaces' {
//   export enum FileType {
//     VIDEO = 'VIDEO',
//     PDF = 'PDF',
//     DOCUMENT = 'DOCUMENT',
//     IMAGE = 'IMAGE',
//     AUDIO = 'AUDIO'
//   }

//   export interface Course {
//     id: string;
//     title: string;
//     description: string;
//     thumbnail?: string;
//     duration?: string;
//     instructor?: {
//       id: string;
//       name: string;
//     };
//     category: string;
//     isEnrolled: boolean;
//     progress?: number;
//   }

//   export interface Instructor {
//     id: string;
//     name: string;
//     title: string;
//     bio: string;
//     avatar?: string;
//     email?: string;
//     phone?: string;
//     location?: string;
//     rating: number;
//     studentsCount: number;
//     coursesCount: number;
//     experienceYears: number;
//     satisfactionRate: number;
//     skills?: string[];
//   }

//   export interface Lesson {
//     id: string;
//     title: string;
//     description?: string;
//     progress?: number;
//     files?: File[];
//   }

//   export interface File {
//     id: string;
//     name: string;
//     url: string;
//     type: FileType;
//     size?: number;
//     isCompleted?: boolean;
//   }

//   export interface QuizQuestion {
//     id: string;
//     text: string;
//     image?: string;
//     type: 'text' | 'image';
//     isMultiple: boolean;
//     points: number;
//     order: number;
//     options?: Array<{
//       id: string;
//       text: string;
//     }>;
//   }
// } 