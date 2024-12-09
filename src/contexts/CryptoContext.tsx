import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  MarketData,
  CoinInfo,
  WebSocketMessage,
  CryptoContextValue,
  WebSocketManagerConfig
} from '../types/crypto';
import { errorMonitor } from '../utils/errorMonitor';

const CryptoContext = createContext<CryptoContextValue | null>(null);

// 환경 변수 상수화
const CONFIG = {
  API_URL: process.env.REACT_APP_API_URL,
  WS_URL: process.env.REACT_APP_WS_URL,
  CACHE_DURATION: Number(process.env.REACT_APP_CACHE_DURATION),
  WS_RECONNECT_ATTEMPTS: Number(process.env.REACT_APP_WS_RECONNECT_ATTEMPTS),
  WS_RECONNECT_DELAY: Number(process.env.REACT_APP_WS_RECONNECT_DELAY),
  DATA_REFRESH_INTERVAL: Number(process.env.REACT_APP_DATA_REFRESH_INTERVAL)
};

class WebSocketManager {
  private url: string;
  private onMessage: (event: MessageEvent) => void;
  private onError: (error: Error) => void;
  private ws: WebSocket | null;
  private reconnectAttempts: number;
  private reconnectTimeout: NodeJS.Timeout | null;

  constructor({ url, onMessage, onError }: WebSocketManagerConfig) {
    this.url = url;
    this.onMessage = onMessage;
    this.onError = onError;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = null;
  }

  // ... 기존 메서드들 유지 (타입 추가) ...
}

export function CryptoProvider({ children }: { children: React.ReactNode }) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('BTCKRW');
  const [availableCoins, setAvailableCoins] = useState<CoinInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null);

  // ... 기존 로직 유지 (타입 추가) ...

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as WebSocketMessage;
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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${CONFIG.API_URL}/market/all?isDetails=false`);
      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }
      
      // ... 기존 로직 ...
    } catch (err) {
      const error = err as Error;
      setError(error);
      errorMonitor.logError(error, 'medium', { 
        component: 'CryptoProvider',
        action: 'fetchData'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // WebSocket 에러 핸들러 수정
  const handleWebSocketError = useCallback((error: Error) => {
    errorMonitor.logError(error, 'high', {
      component: 'CryptoProvider',
      action: 'WebSocket'
    });
    setError(error);
  }, []);

  // ... 나머지 코드 유지 (타입 추가) ...

  const value = useMemo((): CryptoContextValue => ({
    marketData,
    selectedCoin,
    setSelectedCoin,
    availableCoins,
    isLoading,
    error,
    refetch: fetchData,
    clearCache
  }), [marketData, selectedCoin, availableCoins, isLoading, error, fetchData, clearCache]);

  // ... 나머지 코드 유지 ...
}

export const useCrypto = (): CryptoContextValue => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}; 