import logger from '../config/logger.js';
import compression from 'compression';
import { cacheMiddleware } from './cache.js';

export const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();

  // 응답 크기 측정
  let originalWrite = res.write;
  let originalEnd = res.end;
  let chunks = [];

  res.write = (...args) => {
    chunks.push(Buffer.from(args[0]));
    originalWrite.apply(res, args);
  };

  res.end = (...args) => {
    if (args[0]) {
      chunks.push(Buffer.from(args[0]));
    }
    
    const responseBody = Buffer.concat(chunks);
    const responseSize = responseBody.length;

    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    logger.info('Performance metrics', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      responseSize: `${(responseSize / 1024).toFixed(2)}KB`,
      userAgent: req.get('user-agent')
    });

    originalEnd.apply(res, args);
  };

  next();
};

export const performanceMiddleware = [
  // 응답 압축
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6 // 압축 레벨 (0-9)
  }),

  // 정적 파일 캐싱
  (req, res, next) => {
    if (req.url.startsWith('/static/') || req.url.startsWith('/uploads/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
  },

  // API 응답 캐싱
  cacheMiddleware({
    '/api/coins/markets': 60, // 1분
    '/api/coins/price': 30,   // 30초
    '/api/posts': 300         // 5분
  })
];

// 데이터베이스 쿼리 최적화
export const optimizeQuery = (query) => {
  return query
    .lean()              // POJO 반환
    .select('-__v')      // 불필요한 필드 제외
    .cache(300);         // 캐시 적용
}; 