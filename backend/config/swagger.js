import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CryptoInfo API',
      version: '1.0.0',
      description: '암호화폐 정보 플랫폼 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: '개발 서버',
      },
    ],
  },
  apis: ['./routes/*.js'], // API 라우트 파일 경로
};

export const specs = swaggerJsdoc(options); 