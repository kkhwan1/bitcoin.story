import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // MongoDB 연결 상태 확인
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Redis 연결 상태 확인
    let redisStatus = 'disconnected';
    try {
      const redis = req.app.get('redis');
      await redis.ping();
      redisStatus = 'connected';
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    res.json({
      status: 'ok',
      timestamp: new Date(),
      services: {
        database: dbStatus,
        redis: redisStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router; 