'use client';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { User, UserRole } from '@3de/interfaces';

// React Hooks
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { adminAuthApi, userApi } from '@3de/apis';

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  sub: string;
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

// تم إزالة JWT_SECRET و JWT_REFRESH_SECRET لأنها لا تستخدم في client-side

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
  refetchUser: () => Promise<void>;
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
  // ملاحظة: هذه الدوال لا تعمل في المتصفح، يجب استخدامها في server-side فقط
  public generateAccessToken(user: User): string {
    console.warn('generateAccessToken: This function should only be used on server-side');
    return '';
  }

  public generateRefreshToken(user: User): string {
    console.warn('generateRefreshToken: This function should only be used on server-side');
    return '';
  }

  public verifyToken(token: string): JWTPayload | null {
    try {
      // استخدام jwtDecode للقراءة فقط في المتصفح
      const payload = jwtDecode<JWTPayload>(token);
      
      // التحقق من انتهاء الصلاحية
      if (payload.exp * 1000 <= Date.now()) {
        return null;
      }
      
      return payload;
    } catch (error) {
      return null;
    }
  }

  public verifyRefreshToken(token: string): JWTPayload | null {
    try {
      // استخدام jwtDecode للقراءة فقط في المتصفح
      const payload = jwtDecode<JWTPayload>(token);
      
      // التحقق من انتهاء الصلاحية
      if (payload.exp * 1000 <= Date.now()) {
        return null;
      }
      
      return payload;
    } catch (error) {
      return null;
    }
  }

  // دالة مستقلة لحفظ التوكنات في cookies
  public saveTokens(accessToken: string, refreshToken: string,isSession:boolean=false): void {
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
    setCookie(isSession?'sessionAccessToken':'accessToken', accessToken, {
      ...COOKIE_CONFIG,
      maxAge: 60 * 60, // 1 hour in seconds
    });

    // حفظ refresh token لمدة 30 يوم
    setCookie(isSession?'sessionRefreshToken':'refreshToken', refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    });

    console.log('✅ SUCCESS: Tokens saved successfully to cookies');
    
    // Debug: Check if cookies were actually set
    setTimeout(() => {
      const savedAccessToken = getCookie(isSession?'sessionAccessToken':'accessToken');
      const savedRefreshToken = getCookie(isSession?'sessionRefreshToken':'refreshToken');
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
  public getAccessTokenFromCookie(isSession:boolean=false): string {
    const token = getCookie(isSession?'sessionAccessToken':'accessToken') as string;
    return token || '';
  }

  // الحصول على refresh token من cookies
  public getRefreshTokenFromCookie(isSession:boolean=false): string {
    const token = getCookie(isSession?'sessionRefreshToken':'refreshToken') as string;
    return token || '';
  }

  // التحقق من حالة تسجيل الدخول
  public async isAuthenticated(): Promise<boolean> {
    const token = this.getAccessTokenFromCookie(true);
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
      const accessToken = this.getAccessTokenFromCookie(true);
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
      const refreshToken = this.getRefreshTokenFromCookie(true);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(` https://api.3de.school/auth/refresh-token`, {
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
  public async logout(setUser?: (user: User | null) => void) {
    this.clearSession();
    setUser?.(null);
   await this.clearTokens();
    
    
    // إيقاف المؤقت
    this.stopRefreshTokenTimer();
    
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    if (typeof window !== 'undefined') {
      if (typeof window !== 'undefined') {
        if(!window.location.href.includes('/auth/signin') && !window.location.href.includes('/auth/signup') && !window.location.href.includes('/auth/reset-password') && !window.location.href.includes('/auth/forgot-password') ){
          window.location.href = '/auth/signin';
        }
      }
    }
  }

  public async clearTokens() {
    deleteCookie('sessionAccessToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    deleteCookie('sessionRefreshToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    deleteCookie('accessToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    deleteCookie('refreshToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    this.stopRefreshTokenTimer();    
  }

  // Session Management
  public async getSession(): Promise<Session | null> {
    try {
      const accessToken = this.getAccessTokenFromCookie(true);
      const refreshToken = this.getRefreshTokenFromCookie(true);
      
      if (!accessToken || !refreshToken) {
        return null;
      }

      // استخدام jwtDecode للقراءة فقط بدلاً من التحقق من الصحة
      try {
        const payload = jwtDecode<JWTPayload>(accessToken);
        
        // التحقق من انتهاء صلاحية التوكن
        if (payload.exp * 1000 <= Date.now()) {
          // التوكن منتهي الصلاحية، نحاول استخدام refresh token
          const refreshPayload = jwtDecode<JWTPayload>(refreshToken);
          
          if (refreshPayload.exp * 1000 <= Date.now()) {
            // refresh token أيضاً منتهي الصلاحية
            return null;
          }
          
          // إنشاء مستخدم من refresh token
          const user=await userApi.getById(payload.sub)
          const admin=user.data.role==='ADMIN'?await adminAuthApi.getAdminByUserId(user.data.id):null
          
          return {
            user:{...user.data,Admin:admin?[admin.data]:[]},
            accessToken,
            refreshToken,
          };
        }

        const user = await userApi.getById(payload.sub)

        return {
          user:user.data,
          accessToken,
          refreshToken,
        };
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        return null;
      }
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  public setSession(user: User, accessToken?: string, refreshToken?: string): void {
    // إذا لم يتم تمرير التوكنات، نحاول الحصول عليها من الكوكيز
    if (!accessToken || !refreshToken) {
      accessToken = this.getAccessTokenFromCookie(true);
      refreshToken = this.getRefreshTokenFromCookie(true);
    }
    
    // إذا كانت التوكنات متوفرة، نحفظها في الكوكيز
    if (accessToken && refreshToken) {
      this.saveTokens(accessToken, refreshToken, true);
    }
  }

  public clearSession(): void {
    deleteCookie('sessionAccessToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
    deleteCookie('sessionRefreshToken', { domain: COOKIE_CONFIG.domain, path: COOKIE_CONFIG.path });
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
  // ملاحظة: هذه الدوال لا تعمل في المتصفح، يجب استخدامها في server-side فقط
  public async hashPassword(password: string): Promise<string> {
    console.warn('hashPassword: This function should only be used on server-side');
    return '';
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    console.warn('comparePassword: This function should only be used on server-side');
    return false;
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
    return async (Component: React.ComponentType<any>) => {
      return async (props: any) => {
        const session = await this.getSession();
        
        if (!session) {
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin';
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
  public async isAuthenticatedSync(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  public async getCurrentUser(): Promise<User | null> {
    const session = await this.getSession();
    return session?.user || null;
  }

  public async getCurrentUserRole(): Promise<UserRole | null> {
    const session = await this.getSession();
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
const refetchUser =async()=>{
  const session = await authService.getSession();
  if(session){
    let {data:user}= await userApi.getById(session.user.id)
    setUser(user);
  }
}
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticatedSync();
        console.log('🔐 isAuth', isAuth);
        if (isAuth) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          console.log('🔐 currentUser', currentUser);
        }else{
          if(typeof window !== 'undefined'){
           if(window.location.href !== '/auth/signin'){
             authService.logout(setUser);
           }

          }
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
      
      authService.setSession(data.user, data.access_token, data.refreshToken);
      
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
    await authService.logout(setUser);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refetchUser }}>
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
export const formatTime = (sec: number) => {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

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