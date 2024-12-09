import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import { CryptoProvider, useCrypto } from '../contexts/CryptoContext';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock 데이터
const mockMarketData = [
  {
    market: 'KRW-BTC',
    korean_name: '비트코인',
    trade_price: 50000000,
    change_rate: 0.05,
    acc_trade_price_24h: 1000000000,
    high_price: 51000000,
    low_price: 49000000,
    timestamp: Date.now(),
  }
];

// API Mocking
const server = setupServer(
  rest.get(`${process.env.REACT_APP_API_URL}/market/all`, (req, res, ctx) => {
    return res(ctx.json([{ market: 'KRW-BTC', korean_name: '비트코인' }]));
  }),
  rest.get(`${process.env.REACT_APP_API_URL}/ticker`, (req, res, ctx) => {
    return res(ctx.json(mockMarketData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test Component
const TestComponent = () => {
  const { marketData, isLoading, error } = useCrypto();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{marketData.length} coins loaded</div>;
};

describe('CryptoContext', () => {
  it('provides market data to children', async () => {
    render(
      <CryptoProvider>
        <TestComponent />
      </CryptoProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('1 coins loaded')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get(`${process.env.REACT_APP_API_URL}/market/all`, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <CryptoProvider>
        <TestComponent />
      </CryptoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('caches market data', async () => {
    const { rerender } = render(
      <CryptoProvider>
        <TestComponent />
      </CryptoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('1 coins loaded')).toBeInTheDocument();
    });

    // Force re-render
    rerender(
      <CryptoProvider>
        <TestComponent />
      </CryptoProvider>
    );

    // Should use cached data (no loading state)
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
}); 