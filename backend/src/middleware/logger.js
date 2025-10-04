import { logger as winstonLogger } from './errorHandler.js';

// Request logging middleware
export const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  winstonLogger.info({
    message: 'Request received',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    winstonLogger.info({
      message: 'Request completed',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id
    });

    originalEnd.call(this, chunk, encoding);
  };

  next();
};
