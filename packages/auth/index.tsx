'use client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { User, UserRole } from '@3de/interfaces';

// React Hooks
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

interface TokenPayload {
  exp: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // JWT Token Management
  public generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  public generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  public verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  public verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshT || this.refresh_token || ''
        }),
      });

      const data = await response.json();
      const { access_Token } = data;
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

  // Session Management
  public getSession(): Session | null {
    try {
      const accessToken = getCookie('accessToken') as string;
      const refreshToken = getCookie('refreshToken') as string;
      
      if (!accessToken || !refreshToken) {
        return null;
      }

      const payload = this.verifyToken(accessToken);
      if (!payload) {
        // Try to refresh the token
        const refreshPayload = this.verifyRefreshToken(refreshToken);
        if (!refreshPayload) {
          return null;
        }
        
        // Generate new tokens
        const user: User = {
          id: refreshPayload.userId,
          email: refreshPayload.email,
          firstName: '',
          Comment: [],
          lastName: '',
          role: refreshPayload.role,
          password: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          isOnline: false,
          isVerified: false,
          enrollments: [],
          achievements: [],
          notifications: [],
          messages: [],
          posts: [],
          groups: [],
          channels: [],
          bookmarks: [],
          Submission: [],
          Attendance: [],
          payments: [],
          installments: [],
          Instructor: [],
          Owner: [],
          Admin: [],
          Lesson: [],
          Report: [],
          Badge: [],
          Certificate: [],
          Community: [],
          LiveRoom: [],
          NotificationSettings: [],
          Path: [],
          LoginHistory: [],
          TwoFactor: [],
          UserAcademyCEO: [],
          SalaryPayment: [],
          MeetingParticipant: [],
          LegalCase: [],
          traineeManagement: [],
          trainingSchedules: [],
          employeeAttendanceLogs: [],
        };
        
        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken(user);
        
        setCookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
        setCookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
        
        return {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      }

      const user: User = {
        id: payload.userId,
        email: payload.email,
        firstName: '',
        Comment: [],
        lastName: '',
        role: payload.role,
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isOnline: false,
        isVerified: false,
        enrollments: [],
        achievements: [],
        notifications: [],
        messages: [],
        posts: [],
        groups: [],
        channels: [],
        bookmarks: [],
        Submission: [],
        Attendance: [],
        payments: [],
        installments: [],
        Instructor: [],
        Owner: [],
        Admin: [],
        Lesson: [],
        Report: [],
        Badge: [],
        Certificate: [],
        Community: [],
        LiveRoom: [],
        NotificationSettings: [],
        Path: [],
        LoginHistory: [],
        TwoFactor: [],
        UserAcademyCEO: [],
        SalaryPayment: [],
        MeetingParticipant: [],
        LegalCase: [],
        traineeManagement: [],
        trainingSchedules: [],
        employeeAttendanceLogs: [],
      };

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return null;
    }
  }

  public setSession(user: User): void {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
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
  }

  public clearSession(): void {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
  }

  // Role-based Authorization
  public withRole(allowedRoles: UserRole[]) {
    return (session: Session | null): boolean => {
      if (!session || !session.user) {
        return false;
      }
      
      return allowedRoles.includes(session.user.role);
    };
  }

  public hasRole(session: Session | null, role: UserRole): boolean {
    return session?.user?.role === role;
  }

  public hasAnyRole(session: Session | null, roles: UserRole[]): boolean {
    return session?.user ? roles.includes(session.user.role) : false;
  }

  // Password Management
  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Middleware for Next.js
  public createAuthMiddleware(allowedRoles: UserRole[]) {
    return (req: any, res: any, next: any) => {
      const accessToken = req.cookies?.accessToken;
      
      if (!accessToken) {
        return res.status(401).json({ error: 'No access token provided' });
      }
      
      const payload = this.verifyToken(accessToken);
      if (!payload) {
        return res.status(401).json({ error: 'Invalid access token' });
      }
      
      if (!allowedRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      req.user = payload;
      next();
    };
  }

  // Route Protection HOC
  public withAuth(allowedRoles: UserRole[]) {
    return (Component: React.ComponentType<any>) => {
      return (props: any) => {
        const session = this.getSession();
        
        if (!session) {
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return null;
        }
        
        if (!allowedRoles.includes(session.user.role)) {
          // Redirect to unauthorized page
          if (typeof window !== 'undefined') {
            window.location.href = '/unauthorized';
          }
          return null;
        }
        
        return <Component {...props} session={session} />;
      };
    };
  }

  // API Route Protection
  public protectApiRoute(allowedRoles: UserRole[]) {
    return (handler: Function) => {
      return async (req: any, res: any) => {
        const accessToken = req.cookies?.accessToken;
        
        if (!accessToken) {
          return res.status(401).json({ error: 'No access token provided' });
        }
        
        const payload = this.verifyToken(accessToken);
        if (!payload) {
          return res.status(401).json({ error: 'Invalid access token' });
        }
        
        if (!allowedRoles.includes(payload.role)) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        req.user = payload;
        return handler(req, res);
      };
    };
  }

  // Utility Functions
  public isAuthenticatedSync(): boolean {
    const session = this.getSession();
    return !!session;
  }

  public getCurrentUser(): User | null {
    const session = this.getSession();
    return session?.user || null;
  }

  public getCurrentUserRole(): UserRole | null {
    const session = this.getSession();
    return session?.user?.role || null;
  }

  // Role-specific helpers
  public isStudent(session: Session | null): boolean { return this.hasRole(session, 'STUDENT'); }
  public isInstructor(session: Session | null): boolean { return this.hasRole(session, 'INSTRUCTOR'); }
  public isAdmin(session: Session | null): boolean { return this.hasRole(session, 'ADMIN'); }
  public isAcademy(session: Session | null): boolean { return this.hasRole(session, 'ACADEMY'); }
  public isParent(session: Session | null): boolean { return this.hasRole(session, 'PARENT'); }

  // Permission-based helpers
  public canAccessStudentFeatures(session: Session | null): boolean { 
    return this.hasAnyRole(session, ['STUDENT', 'INSTRUCTOR', 'ADMIN']); 
  }

  public canAccessInstructorFeatures(session: Session | null): boolean { 
    return this.hasAnyRole(session, ['INSTRUCTOR', 'ADMIN']); 
  }

  public canAccessAdminFeatures(session: Session | null): boolean { 
    return this.hasRole(session, 'ADMIN'); 
  }

  public canAccessAcademyFeatures(session: Session | null): boolean { 
    return this.hasAnyRole(session, ['ACADEMY', 'ADMIN']); 
  }

  public canAccessParentFeatures(session: Session | null): boolean { 
    return this.hasAnyRole(session, ['PARENT', 'ADMIN']); 
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      await authService.setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export individual functions for convenience
export const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  getSession,
  setSession,
  clearSession,
  withRole,
  hasRole,
  hasAnyRole,
  hashPassword,
  comparePassword,
  createAuthMiddleware,
  withAuth,
  protectApiRoute,
  isAuthenticatedSync,
  getCurrentUser,
  getCurrentUserRole,
  isStudent,
  isInstructor,
  isAdmin,
  isAcademy,
  isParent,
  canAccessStudentFeatures,
  canAccessInstructorFeatures,
  canAccessAdminFeatures,
  canAccessAcademyFeatures,
  canAccessParentFeatures,
} = authService; 