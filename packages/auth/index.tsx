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

// Cookie configuration constants
const COOKIE_CONFIG = {
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
  path: '/',
  secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
  sameSite: 'lax' as const,
  httpOnly: false, // Set to false for client-side access
};

interface AuthContextType {
  user: User | null;
  login: (data: { access_token: string, refreshToken: string, user: User }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

class AuthService {
  private static instance: AuthService;
  private refreshTokenTimeout?: NodeJS.Timeout;

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
      { expiresIn: '1h' } // Updated to 1 hour
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
      { expiresIn: '30d' } // Updated to 30 days
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

  // دالة مستقلة لحفظ التوكنات في cookies
  public saveTokens(accessToken: string, refreshToken: string): void {
    if (!accessToken || !refreshToken) {
      console.error('Invalid tokens provided for saving');
      return;
    }

    console.log('🍪 COOKIE: Saving tokens to cookies', {
      domain: COOKIE_CONFIG.domain,
      secure: COOKIE_CONFIG.secure,
      sameSite: COOKIE_CONFIG.sameSite,
      accessTokenLength: accessToken.length,
      refreshTokenLength: refreshToken.length
    });

    // حفظ access token لمدة ساعة واحدة
    setCookie('accessToken', accessToken, {
      ...COOKIE_CONFIG,
      maxAge: 60 * 60, // 1 hour in seconds
    });

    // حفظ refresh token لمدة 30 يوم
    setCookie('refreshToken', refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    });

    console.log('✅ SUCCESS: Tokens saved successfully to cookies');
    
    // Debug: Check if cookies were actually set
    setTimeout(() => {
      const savedAccessToken = getCookie('accessToken');
      const savedRefreshToken = getCookie('refreshToken');
      console.log('🍪 COOKIE: Verification - Access Token saved:', !!savedAccessToken);
      console.log('🍪 COOKIE: Verification - Refresh Token saved:', !!savedRefreshToken);
    }, 100);
  }

  // تعيين التوكن عند تسجيل الدخول
  public async setTokens(accessToken: string, refreshToken: string) {
    if (!accessToken || !refreshToken) {
      console.error('Invalid tokens provided');
      return;
    }

    // حفظ التوكنات في cookies
    this.saveTokens(accessToken, refreshToken);

    try {
      this.startRefreshTokenTimer();
    } catch (error) {
      console.error('Error setting up refresh timer:', error);
    }
  }

  // الحصول على التوكن من cookies
  public getAccessTokenFromCookie(): string {
    const token = getCookie('accessToken') as string;
    return token || '';
  }

  // الحصول على refresh token من cookies
  public getRefreshTokenFromCookie(): string {
    const token = getCookie('refreshToken') as string;
    return token || '';
  }

  // التحقق من حالة تسجيل الدخول
  public async isAuthenticated(): Promise<boolean> {
    const token = this.getAccessTokenFromCookie();
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
      const accessToken = this.getAccessTokenFromCookie();
      if (!accessToken) return;

      const decodedToken = jwtDecode<TokenPayload>(accessToken);
      const expires = new Date(decodedToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (5 * 60 * 1000); // تجديد قبل 5 دقائق من الانتهاء

      if (timeout > 0) {
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
      }
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
      const refreshToken = this.getRefreshTokenFromCookie();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.3de.school" || 'https://api.3de.school'}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const { access_token } = data;
      
      // حفظ التوكن الجديد
      this.saveTokens(access_token, refreshToken);
      
      // إعادة تشغيل المؤقت
      this.startRefreshTokenTimer();
      
      return access_token;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      await this.logout();
      throw new Error('Failed to refresh token: ' + error.message);
    }
  }

  // تسجيل الخروج
  public async logout() {
    // حذف التوكنات من cookies
    deleteCookie('accessToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    deleteCookie('refreshToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    
    // إيقاف المؤقت
    this.stopRefreshTokenTimer();
    
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  }

  public async clearTokens() {
    deleteCookie('accessToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    deleteCookie('refreshToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    this.stopRefreshTokenTimer();    
  }

  // Session Management
  public getSession(): Session | null {
    try {
      const accessToken = this.getAccessTokenFromCookie();
      const refreshToken = this.getRefreshTokenFromCookie();
      
      if (!accessToken || !refreshToken) {
        return null;
      }

      const payload = this.verifyToken(accessToken);
      if (!payload) {
        // محاولة تجديد التوكن
        const refreshPayload = this.verifyRefreshToken(refreshToken);
        if (!refreshPayload) {
          return null;
        }
        
        // إنشاء مستخدم جديد من refresh token
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
        
        // حفظ التوكنات الجديدة
        this.saveTokens(newAccessToken, newRefreshToken);
        
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
      console.error('Error getting session:', error);
      return null;
    }
  }

  public setSession(user: User): void {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    // حفظ التوكنات في cookies
    this.saveTokens(accessToken, refreshToken);
  }

  public clearSession(): void {
    deleteCookie('accessToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    deleteCookie('refreshToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
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

  const login = async (data: { access_token: string, refreshToken: string, user: User }) => {
    setIsLoading(true);
    try {
      console.log('🔐 LOGIN: AuthProvider.login() called with data:', {
        userEmail: data.user.email,
        userRole: data.user.role,
        accessTokenLength: data.access_token.length,
        refreshTokenLength: data.refreshToken.length
      });
      
      // حفظ التوكنات في cookies
      authService.saveTokens(data.access_token, data.refreshToken);
      
      // تعيين التوكنات وبدء المؤقت
      await authService.setTokens(data.access_token, data.refreshToken);
      
      // تحديث حالة المستخدم
      setUser(data.user);
      
      console.log('✅ SUCCESS: AuthProvider.login() completed successfully');
    } catch (error) {
      console.error('❌ ERROR: Login error in AuthProvider:', error);
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
  saveTokens,
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