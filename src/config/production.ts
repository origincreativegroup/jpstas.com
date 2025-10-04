// Production configuration
export const PRODUCTION_CONFIG = {
  // Debug mode - should be false in production
  DEBUG_ENABLED: import.meta.env.VITE_DEBUG !== 'false',
  
  // API endpoints
  API_BASE_URL: import.meta.env.PROD ? '' : '',
  
  // Admin credentials
  ADMIN_USERNAME: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
  
  // Feature flags
  FEATURES: {
    MOCK_API: import.meta.env.DEV,
    DEBUG_LOGS: import.meta.env.DEV,
    CONSOLE_LOGS: import.meta.env.DEV,
  }
};

// Production-safe console logging
export const safeLog = {
  log: (...args: any[]) => {
    if (PRODUCTION_CONFIG.FEATURES.CONSOLE_LOGS) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (PRODUCTION_CONFIG.FEATURES.CONSOLE_LOGS) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (PRODUCTION_CONFIG.FEATURES.CONSOLE_LOGS) {
      console.warn(...args);
    }
  }
};
