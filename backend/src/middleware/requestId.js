import { v4 as uuidv4 } from 'uuid';

// Assign a correlation ID to every request and expose it via response header
export const assignRequestId = (req, res, next) => {
  const inboundId = req.headers['x-request-id'];
  const requestId = typeof inboundId === 'string' && inboundId.length > 0 ? inboundId : uuidv4();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

export default assignRequestId;


