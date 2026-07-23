import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'sgu-super-secret-change-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'sgu-refresh-secret-change',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Encryption
  encryptionKey: process.env.ENCRYPTION_KEY,
  
  // 2FA
  twoFactorEnabled: process.env.TWO_FACTOR_ENABLED === 'true',
  twoFactorIssuer: 'SGU ERP',
  
  // OAuth2
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackUrl: process.env.MICROSOFT_CALLBACK_URL,
    },
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10) || 100,
    skipSuccessfulRequests: false,
  },
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  
  // Password Policy
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // days
  },
  
  // Session
  sessionSecret: process.env.SESSION_SECRET || 'sgu-session-secret',
  
  // API Keys
  apiKeyHeader: 'X-API-Key',
  
  // Audit
  auditLogRetention: parseInt(process.env.AUDIT_LOG_RETENTION || '2555', 10) || 2555, // 7 years
}));
