import { useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url, options = {}) {
  const {
    onMessage,
    onError,
    onClose,
    onOpen,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    protocols
  } = options;

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const attemptRef = useRef(0);

  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url, protocols);

      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
        attemptRef.current = 0;
        if (onOpen) onOpen();
      };

      wsRef.current.onmessage = (event) => {
        if (onMessage) onMessage(event);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        if (onError) onError(error);
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket Closed');
        if (onClose) onClose(event);

        // 재연결 시도
        if (attemptRef.current < reconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            attemptRef.current += 1;
            connect();
          }, reconnectInterval * Math.pow(2, attemptRef.current));
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      if (onError) onError(error);
    }
  }, [url, protocols, onMessage, onError, onClose, onOpen, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }, []);

  return { sendMessage };
} 