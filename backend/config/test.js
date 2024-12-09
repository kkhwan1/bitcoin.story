export default {
  env: 'test',
  mongoose: {
    url: process.env.MONGODB_URI_TEST
  },
  jwt: {
    secret: 'test-jwt-secret',
    accessExpirationMinutes: 30,
    refreshExpirationDays: 30
  },
  email: {
    smtp: {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'test@ethereal.email',
        pass: 'testpass'
      }
    },
    from: 'test@example.com'
  }
}; 