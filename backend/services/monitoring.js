import os from 'os';
import logger from '../config/logger.js';

export const startMonitoring = (interval = 5 * 60 * 1000) => { // 5분마다 체크
  setInterval(() => {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = process.memoryUsage();

    logger.info('System metrics', {
      cpu: {
        loadAvg: os.loadavg(),
        cores: os.cpus().length
      },
      memory: {
        total: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB`,
        free: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)}GB`,
        used: `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB`,
        percentage: `${((usedMemory / totalMemory) * 100).toFixed(2)}%`
      },
      process: {
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`
      }
    });
  }, interval);
}; 