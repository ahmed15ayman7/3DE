// Auth Debug Utilities
import { config, testUser } from '../../config';

export class AuthDebugger {
  private static instance: AuthDebugger;
  private logs: Array<{ timestamp: string; type: string; message: string; data?: any }> = [];

  private constructor() {
    this.log('🔧 CONFIG', 'AuthDebugger initialized');
  }

  public static getInstance(): AuthDebugger {
    if (!AuthDebugger.instance) {
      AuthDebugger.instance = new AuthDebugger();
    }
    return AuthDebugger.instance;
  }

  public log(type: string, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
    };
    
    this.logs.push(logEntry);
    
    // Console output with styling
    const style = this.getStyle(type);
    console.log(`%c[${logEntry.timestamp}] ${type}: ${message}`, style, data || '');
    
    // Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-debug-logs', JSON.stringify(this.logs.slice(-50))); // Keep last 50 logs
    }
  }

  private getStyle(type: string): string {
    switch (type) {
      case '🔧 CONFIG':
        return 'color: #4CAF50; font-weight: bold;';
      case '🔐 LOGIN':
        return 'color: #2196F3; font-weight: bold;';
      case '🍪 COOKIE':
        return 'color: #FF9800; font-weight: bold;';
      case '❌ ERROR':
        return 'color: #F44336; font-weight: bold;';
      case '✅ SUCCESS':
        return 'color: #4CAF50; font-weight: bold;';
      case '🔄 REFRESH':
        return 'color: #9C27B0; font-weight: bold;';
      default:
        return 'color: #607D8B; font-weight: bold;';
    }
  }

  public getLogs() {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-debug-logs');
    }
  }

  public exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  // Specific debug methods
  public debugConfig() {
    this.log('🔧 CONFIG', 'Current configuration', config);
  }

  public debugTestCredentials() {
    this.log('🔧 CONFIG', 'Test credentials', testUser);
  }

  public debugCookieCheck() {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie;
      this.log('🍪 COOKIE', 'Current cookies', cookies);
      
      // Check specific cookies
      const accessToken = this.getCookie('accessToken');
      const refreshToken = this.getCookie('refreshToken');
      
      this.log('🍪 COOKIE', 'Access Token exists', !!accessToken);
      this.log('🍪 COOKIE', 'Refresh Token exists', !!refreshToken);
    }
  }

  private getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  public debugLoginAttempt(email: string) {
    this.log('🔐 LOGIN', `Login attempt for: ${email}`);
    this.debugCookieCheck();
  }

  public debugLoginSuccess(userData: any) {
    this.log('✅ SUCCESS', 'Login successful', userData);
    this.debugCookieCheck();
  }

  public debugLoginError(error: any) {
    this.log('❌ ERROR', 'Login failed', error);
  }

  public debugTokenRefresh() {
    this.log('🔄 REFRESH', 'Token refresh attempt');
    this.debugCookieCheck();
  }
}

// Global debugger instance
export const authDebugger = AuthDebugger.getInstance();

// Auto-initialize debug info
if (typeof window !== 'undefined') {
  // Load previous logs from localStorage
  const savedLogs = localStorage.getItem('auth-debug-logs');
  if (savedLogs) {
    try {
      const logs = JSON.parse(savedLogs);
      authDebugger['logs'] = logs;
    } catch (error) {
      console.error('Failed to load saved logs:', error);
    }
  }
  
  // Debug initial state
  authDebugger.debugConfig();
  authDebugger.debugTestCredentials();
  authDebugger.debugCookieCheck();
  
  // Add to window for easy access
  (window as any).authDebugger = authDebugger;
} 