import runLoadTest from '../__tests__/load/loadTest.js';
import logger from '../config/logger.js';
import { trackPerformance } from '../services/errorTracking.js';

async function main() {
  try {
    logger.info('Starting load test suite');
    
    const startTime = Date.now();
    const results = await runLoadTest();
    const duration = Date.now() - startTime;

    // 성능 메트릭 기록
    trackPerformance('load_test', duration, {
      totalRequests: Object.values(results).reduce((sum, r) => sum + r.requestsPerSecond * r.duration, 0),
      averageLatency: Object.values(results).reduce((sum, r) => sum + r.averageLatency, 0) / Object.keys(results).length
    });

    logger.info('Load test completed successfully', { duration: `${duration}ms` });
    process.exit(0);
  } catch (error) {
    logger.error('Load test failed:', error);
    process.exit(1);
  }
}

main(); 