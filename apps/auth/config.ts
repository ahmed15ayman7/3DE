// Configuration file for testing
export const config = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-3de-school-2024',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-jwt-key-for-3de-school-2024',
  
  // Cookie Configuration
  COOKIE_DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
  COOKIE_SECURE: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Test Credentials
  TEST_EMAIL: 'st@st.st',
  TEST_PASSWORD: '123456789',
  
  // Ports
  AUTH_PORT: 3002,
  API_PORT: 3000,
};

// Test user data
export const testUser = {
  email: config.TEST_EMAIL,
  password: config.TEST_PASSWORD,
  role: 'STUDENT' as const,
};

console.log('🔧 Auth Configuration Loaded:', {
  API_URL: config.API_URL,
  COOKIE_DOMAIN: config.COOKIE_DOMAIN,
  COOKIE_SECURE: config.COOKIE_SECURE,
  NODE_ENV: config.NODE_ENV,
}); 