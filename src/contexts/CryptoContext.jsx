import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const CryptoContext = createContext();

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000; // 기본 1초

// 캐시 관련 상수
const CACHE_KEY = {
  MARKET_DATA: 'crypto_market_data',
  AVAILABLE_COINS: 'crypto_available_coins',
  LAST_UPDATED: 'crypto_last_updated'
};

const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 캐시 유틸리티 함수들
const cacheUtils = {
  saveToCache: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Cache save error:', error);
    }
  },

  loadFromCache: (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      return isExpired ? null : data;
    } catch (error) {
      console.error('Cache load error:', error);
      return null;
    }
  },

  clearCache: () => {
    Object.values(CACHE_KEY).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

class WebSocketManager {
  constructor(url, onMessage, onError) {
    this.url = url;
    this.onMessage = onMessage;
    this.onError = onError;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = null;
  }

  connect(message) {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      this.reconnectAttempts = 0;
      if (message) {
        this.ws.send(message);
      }
    };

    this.ws.onmessage = this.onMessage;

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      if (this.onError) {
        this.onError(error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket Closed');
      this.attemptReconnect();
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts);
      console.log(`Attempting to reconnect in ${delay}ms...`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      if (this.onError) {
        this.onError(new Error('WebSocket connection failed'));
      }
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }
}

export function CryptoProvider({ children }) {
  const [marketData, setMarketData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('BTCKRW');
  const [availableCoins, setAvailableCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsManager, setWsManager] = useState(null);

  // 캐시된 데이터 초기 로드
  useEffect(() => {
    const cachedCoins = cacheUtils.loadFromCache(CACHE_KEY.AVAILABLE_COINS);
    const cachedMarketData = cacheUtils.loadFromCache(CACHE_KEY.MARKET_DATA);

    if (cachedCoins) {
      setAvailableCoins(cachedCoins);
      setIsLoading(false);
    }

    if (cachedMarketData) {
      setMarketData(cachedMarketData);
    }
  }, []);

  // 데이터 fetch 함수 수정
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://api.upbit.com/v1/market/all?isDetails=false');
      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }
      
      const markets = await response.json();
      const krwMarkets = markets
        .filter(market => market.market.startsWith('KRW-'))
        .map(market => ({
          symbol: market.market.split('-')[1] + 'KRW',
          name: market.korean_name,
          market: market.market
        }));

      setAvailableCoins(krwMarkets);
      cacheUtils.saveToCache(CACHE_KEY.AVAILABLE_COINS, krwMarkets);
    } catch (err) {
      setError(err);
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 실시간 시세 데이터 fetch 함수 수정
  const fetchMarketData = useCallback(async () => {
    try {
      const markets = availableCoins.map(coin => coin.market).join(',');
      if (!markets) return;

      const response = await fetch(`https://api.upbit.com/v1/ticker?markets=${markets}`);
      const data = await response.json();
      setMarketData(data);
      cacheUtils.saveToCache(CACHE_KEY.MARKET_DATA, data);
    } catch (error) {
      console.error('Market data fetch error:', error);
    }
  }, [availableCoins]);

  // WebSocket 메시지 핸들러
  const handleWebSocketMessage = useCallback((event) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.type === 'ticker') {
          setMarketData(prev => 
            prev.map(item => 
              item.market === data.code ? { ...item, ...data } : item
            )
          );
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };
    reader.readAsText(event.data);
  }, []);

  // WebSocket 에러 핸들러
  const handleWebSocketError = useCallback((error) => {
    console.error('WebSocket error:', error);
    setError(error);
  }, []);

  // WebSocket 연결 관리
  useEffect(() => {
    if (!selectedCoin) return;

    const manager = new WebSocketManager(
      'wss://api.upbit.com/websocket/v1',
      handleWebSocketMessage,
      handleWebSocketError
    );

    const message = JSON.stringify([
      { ticket: "UNIQUE_TICKET" },
      { type: "ticker", codes: [`KRW-${selectedCoin.replace('KRW', '')}`] }
    ]);

    manager.connect(message);
    setWsManager(manager);

    return () => {
      manager.disconnect();
    };
  }, [selectedCoin, handleWebSocketMessage, handleWebSocketError]);

  // 캐시 초기화 함수
  const clearCache = useCallback(() => {
    cacheUtils.clearCache();
    fetchData();
  }, [fetchData]);

  // Context value에 clearCache 추가
  const value = useMemo(() => ({
    marketData,
    selectedCoin,
    setSelectedCoin,
    availableCoins,
    isLoading,
    error,
    refetch: fetchData,
    clearCache
  }), [marketData, selectedCoin, availableCoins, isLoading, error, fetchData, clearCache]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 실시간 시세 데이터 업데이트
  useEffect(() => {
    if (availableCoins.length > 0) {
      fetchMarketData();
      const interval = setInterval(fetchMarketData, 5000);
      return () => clearInterval(interval);
    }
  }, [availableCoins, fetchMarketData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchData} />;

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
}

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}; 