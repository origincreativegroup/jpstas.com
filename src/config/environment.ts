// Environment configuration for development vs production
export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
  enableDebug: boolean;
  enableMockApi: boolean;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  retryAttempts: number;
  timeoutMs: number;
}

const developmentConfig: EnvironmentConfig = {
  isDevelopment: true,
  isProduction: false,
  apiBaseUrl: 'http://localhost:5173/api',
  enableDebug: true,
  enableMockApi: true,
  enableAnalytics: false,
  enableErrorReporting: false,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
  retryAttempts: 3,
  timeoutMs: 30000, // 30 seconds
};

const productionConfig: EnvironmentConfig = {
  isDevelopment: false,
  isProduction: true,
  apiBaseUrl: 'https://jpstas.com/api',
  enableDebug: false,
  enableMockApi: false,
  enableAnalytics: true,
  enableErrorReporting: true,
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
  retryAttempts: 5,
  timeoutMs: 60000, // 60 seconds
};

// Determine environment based on Vite's mode
const isDev = import.meta.env.DEV;

export const config: EnvironmentConfig = isDev ? developmentConfig : productionConfig;

// Environment-specific utilities
export const isDevelopment = () => config.isDevelopment;
export const isProduction = () => config.isProduction;
export const shouldUseMockApi = () => config.enableMockApi;
export const shouldEnableDebug = () => config.enableDebug;

// API URL helpers
export const getApiUrl = (endpoint: string) => {
  const baseUrl = config.apiBaseUrl.endsWith('/') ? config.apiBaseUrl.slice(0, -1) : config.apiBaseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// File validation helpers
export const validateFileSize = (file: File): boolean => {
  return file.size <= config.maxFileSize;
};

export const validateFileType = (file: File): boolean => {
  return config.allowedFileTypes.includes(file.type);
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!validateFileSize(file)) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${Math.round(config.maxFileSize / 1024 / 1024)}MB`,
    };
  }
  
  if (!validateFileType(file)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported. Allowed types: ${config.allowedFileTypes.join(', ')}`,
    };
  }
  
  return { valid: true };
};

// Retry helper with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = config.retryAttempts,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, etc.
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Timeout wrapper
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = config.timeoutMs
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

// Console logging that respects environment
export const envLog = {
  debug: (...args: any[]) => {
    if (config.enableDebug) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (config.enableDebug) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};
