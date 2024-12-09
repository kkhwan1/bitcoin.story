import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 100개 요청
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 5, // IP당 5번의 로그인 시도
  message: '로그인 시도가 너무 많습니다. 1시간 후에 다시 시도해주세요.'
}); 