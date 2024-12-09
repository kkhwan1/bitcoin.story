import request from 'supertest';
import app from '../server.js';
import { getMarketData, getCoinPrice } from '../services/upbitService.js';

// Mock upbitService
jest.mock('../services/upbitService.js');

describe('Coins API', () => {
  describe('GET /api/coins/markets', () => {
    it('should fetch all markets', async () => {
      const mockMarkets = [
        { market: 'KRW-BTC', korean_name: '비트코인' },
        { market: 'KRW-ETH', korean_name: '이더리움' }
      ];

      getMarketData.mockResolvedValue(mockMarkets);

      const res = await request(app).get('/api/coins/markets');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('market', 'KRW-BTC');
    });

    it('should handle errors', async () => {
      getMarketData.mockRejectedValue(new Error('API Error'));

      const res = await request(app).get('/api/coins/markets');

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/coins/price/:symbol', () => {
    it('should fetch price for specific coin', async () => {
      const mockPrice = {
        market: 'KRW-BTC',
        trade_price: 50000000,
        change_rate: 0.05
      };

      getCoinPrice.mockResolvedValue(mockPrice);

      const res = await request(app).get('/api/coins/price/BTC');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('trade_price');
      expect(res.body.market).toBe('KRW-BTC');
    });
  });
}); 