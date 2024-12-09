import autocannon from 'autocannon';
import { writeFileSync } from 'fs';
import logger from '../../config/logger.js';

const DURATION = 30; // 30초 동안 테스트
const CONNECTIONS = 100; // 동시 연결 수

const scenarios = {
  getMarkets: {
    url: 'http://localhost:5000/api/coins/markets',
    method: 'GET'
  },
  getPrices: {
    url: 'http://localhost:5000/api/coins/price/BTC',
    method: 'GET'
  },
  getPosts: {
    url: 'http://localhost:5000/api/posts',
    method: 'GET'
  }
};

async function runLoadTest() {
  const results = {};

  for (const [name, config] of Object.entries(scenarios)) {
    logger.info(`Starting load test for ${name}`);

    const result = await autocannon({
      ...config,
      connections: CONNECTIONS,
      duration: DURATION,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    results[name] = {
      averageLatency: result.latency.average,
      requestsPerSecond: result.requests.average,
      throughput: result.throughput.average,
      errors: result.errors,
      timeouts: result.timeouts,
      duration: DURATION,
      connections: CONNECTIONS
    };

    logger.info(`Completed load test for ${name}`, results[name]);
  }

  // 결과 저장
  writeFileSync(
    `./logs/loadtest-${new Date().toISOString()}.json`,
    JSON.stringify(results, null, 2)
  );

  return results;
}

export default runLoadTest; 