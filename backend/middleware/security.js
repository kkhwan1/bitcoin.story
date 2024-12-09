import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';

export const securityMiddleware = [
  // 기본 보안 헤더
  helmet(),
  
  // XSS 방어
  xss(),
  
  // NoSQL 인젝션 방어
  mongoSanitize(),
  
  // HTTP Parameter Pollution 방지
  hpp(),
  
  // CORS 설정
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
];

// 추가 보안 설정
export const configSecurity = (app) => {
  // HTTP 엄격한 전송 보안
  app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }));

  // 클릭재킹 방지
  app.use(helmet.frameguard({ action: 'deny' }));

  // DNS prefetch 제어
  app.use(helmet.dnsPrefetchControl());

  // 캐시 제어
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
}; 