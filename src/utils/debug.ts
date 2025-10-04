/**
 * Debug Utility
 *
 * Provides comprehensive debugging tools for tracking operations,
 * especially for file interactions, API calls, and state changes.
 *
 * Usage:
 *   import { debug } from '@/utils/debug';
 *   debug.media.upload('Starting upload', { file });
 *   debug.api.request('POST /api/upload', { body });
 *   debug.error('Upload failed', error);
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
type Category =
  | 'media'
  | 'content'
  | 'upload'
  | 'api'
  | 'state'
  | 'file'
  | 'component'
  | 'general';

interface DebugConfig {
  enabled: boolean;
  categories: Set<Category>;
  logLevel: LogLevel;
  showTimestamp: boolean;
  showStack: boolean;
}

const config: DebugConfig = {
  enabled: import.meta.env.DEV, // Only enable in development
  categories: new Set(['media', 'content', 'upload', 'api', 'state', 'file', 'component']),
  logLevel: 'debug',
  showTimestamp: true,
  showStack: false,
};

// Color codes for different categories
const COLORS: Record<Category, string> = {
  media: '#9333EA', // Purple
  content: '#3B82F6', // Blue
  upload: '#10B981', // Green
  api: '#F59E0B', // Amber
  state: '#EC4899', // Pink
  file: '#8B5CF6', // Violet
  component: '#06B6D4', // Cyan
  general: '#6B7280', // Gray
};

const EMOJI: Record<Category, string> = {
  media: '🎬',
  content: '📝',
  upload: '⬆️',
  api: '🌐',
  state: '🔄',
  file: '📁',
  component: '⚛️',
  general: '📌',
};

/**
 * Format timestamp
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().split('T')[1].slice(0, -1);
}

/**
 * Core logging function
 */
function log(
  category: Category,
  level: LogLevel,
  message: string,
  data?: any,
  error?: Error
): void {
  if (!config.enabled) return;
  if (!config.categories.has(category)) return;

  const emoji = EMOJI[category];
  const color = COLORS[category];
  const timestamp = config.showTimestamp ? `[${getTimestamp()}]` : '';

  // Format the log message
  const prefix = `${emoji} ${timestamp} [${category.toUpperCase()}]`;

  // Use appropriate console method
  const consoleMethod = console[level] || console.log;

  if (data) {
    consoleMethod(
      `%c${prefix} ${message}`,
      `color: ${color}; font-weight: bold;`,
      '\n📦 Data:',
      data
    );
  } else {
    consoleMethod(`%c${prefix} ${message}`, `color: ${color}; font-weight: bold;`);
  }

  // Log error if provided
  if (error) {
    console.error('❌ Error:', error);
    if (config.showStack && error.stack) {
      console.error('📚 Stack:', error.stack);
    }
  }
}

/**
 * Performance timing utility
 */
class PerformanceTracker {
  private timers: Map<string, number> = new Map();

  start(label: string): void {
    this.timers.set(label, performance.now());
    log('general', 'debug', `⏱️  Started: ${label}`);
  }

  end(label: string): number {
    const start = this.timers.get(label);
    if (!start) {
      log('general', 'warn', `⏱️  Timer "${label}" not found`);
      return 0;
    }

    const duration = performance.now() - start;
    this.timers.delete(label);

    const durationMs = duration.toFixed(2);
    log('general', 'info', `⏱️  Completed: ${label} (${durationMs}ms)`);

    return duration;
  }
}

const perf = new PerformanceTracker();

/**
 * Debug API
 */
export const debug = {
  // Media operations
  media: {
    upload: (message: string, data?: any) => log('media', 'info', message, data),
    delete: (message: string, data?: any) => log('media', 'info', message, data),
    update: (message: string, data?: any) => log('media', 'info', message, data),
    select: (message: string, data?: any) => log('media', 'debug', message, data),
    error: (message: string, error: Error, data?: any) => log('media', 'error', message, data, error),
  },

  // Content operations
  content: {
    fetch: (message: string, data?: any) => log('content', 'info', message, data),
    update: (message: string, data?: any) => log('content', 'info', message, data),
    publish: (message: string, data?: any) => log('content', 'info', message, data),
    error: (message: string, error: Error, data?: any) =>
      log('content', 'error', message, data, error),
  },

  // Upload operations
  upload: {
    start: (message: string, data?: any) => log('upload', 'info', message, data),
    progress: (message: string, data?: any) => log('upload', 'debug', message, data),
    complete: (message: string, data?: any) => log('upload', 'info', message, data),
    error: (message: string, error: Error, data?: any) =>
      log('upload', 'error', message, data, error),
  },

  // API requests
  api: {
    request: (message: string, data?: any) => log('api', 'info', message, data),
    response: (message: string, data?: any) => log('api', 'debug', message, data),
    error: (message: string, error: Error, data?: any) => log('api', 'error', message, data, error),
  },

  // State changes
  state: {
    update: (message: string, data?: any) => log('state', 'debug', message, data),
    reset: (message: string, data?: any) => log('state', 'info', message, data),
    error: (message: string, error: Error, data?: any) =>
      log('state', 'error', message, data, error),
  },

  // File operations
  file: {
    read: (message: string, data?: any) => log('file', 'debug', message, data),
    validate: (message: string, data?: any) => log('file', 'debug', message, data),
    error: (message: string, error: Error, data?: any) => log('file', 'error', message, data, error),
  },

  // Component lifecycle
  component: {
    mount: (message: string, data?: any) => log('component', 'debug', message, data),
    unmount: (message: string, data?: any) => log('component', 'debug', message, data),
    render: (message: string, data?: any) => log('component', 'debug', message, data),
    error: (message: string, error: Error, data?: any) =>
      log('component', 'error', message, data, error),
  },

  // General logging
  log: (message: string, data?: any) => log('general', 'log', message, data),
  info: (message: string, data?: any) => log('general', 'info', message, data),
  warn: (message: string, data?: any) => log('general', 'warn', message, data),
  error: (message: string, error?: Error | string, data?: any) => {
    const err = typeof error === 'string' ? new Error(error) : error;
    log('general', 'error', message, data, err);
  },

  // Performance tracking
  perf,

  // Configuration
  config: {
    enable: () => {
      config.enabled = true;
      log('general', 'info', '✅ Debug mode enabled');
    },
    disable: () => {
      config.enabled = false;
    },
    enableCategory: (category: Category) => {
      config.categories.add(category);
      log('general', 'info', `✅ Enabled category: ${category}`);
    },
    disableCategory: (category: Category) => {
      config.categories.delete(category);
      log('general', 'info', `❌ Disabled category: ${category}`);
    },
    showStack: (show: boolean) => {
      config.showStack = show;
    },
  },
};

/**
 * Network request interceptor for debugging
 */
export function debugFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const method = options?.method || 'GET';
  const requestId = Math.random().toString(36).substring(7);

  debug.api.request(`${method} ${url}`, {
    requestId,
    method,
    headers: options?.headers,
    body: options?.body,
  });

  debug.perf.start(`API: ${method} ${url}`);

  return fetch(url, options)
    .then(response => {
      const duration = debug.perf.end(`API: ${method} ${url}`);

      debug.api.response(`${method} ${url} - ${response.status}`, {
        requestId,
        status: response.status,
        statusText: response.statusText,
        duration: `${duration.toFixed(2)}ms`,
      });

      return response;
    })
    .catch(error => {
      debug.perf.end(`API: ${method} ${url}`);
      debug.api.error(`${method} ${url} - Failed`, error, { requestId });
      throw error;
    });
}

// Make debug available globally in dev mode
if (import.meta.env.DEV) {
  (window as any).debug = debug;
  console.log(
    '%c🐛 Debug Mode Active',
    'color: #10B981; font-size: 16px; font-weight: bold; background: #1F2937; padding: 8px 16px; border-radius: 4px;'
  );
  console.log('%cDebug utility available as window.debug', 'color: #9CA3AF;');
  console.log(
    '%cUsage: debug.media.upload("message", data)',
    'color: #9CA3AF; font-style: italic;'
  );
}
