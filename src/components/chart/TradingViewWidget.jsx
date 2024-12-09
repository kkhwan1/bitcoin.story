import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const FullscreenButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const FullscreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 9999;
  display: ${props => props.isFullscreen ? 'block' : 'none'};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--background-light);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function TradingViewWidget({ symbol = "BTCKRW", onSymbolChange }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const widgetRef = useRef(null);
  const containerRef = useRef(null);

  const createWidget = useCallback((containerId) => {
    try {
      setIsLoading(true);
      const script = document.createElement('script');
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "UPBIT:${symbol}",
          "interval": "D",
          "timezone": "Asia/Seoul",
          "theme": "dark",
          "style": "1",
          "locale": "kr",
          "enable_publishing": false,
          "backgroundColor": "rgba(0, 0, 0, 1)",
          "gridColor": "rgba(42, 46, 57, 0.06)",
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "calendar": false,
          "studies": [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies"
          ],
          "support_host": "https://www.tradingview.com",
          "width": "100%",
          "height": "100%"
        }`;

      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'tradingview-widget-container';
        
        // 로딩 이벤트 처리
        script.onload = () => {
          setIsLoading(false);
          if (onSymbolChange) {
            widgetRef.current = window.TradingView?.widget;
          }
        };
        
        div.appendChild(script);
        container.appendChild(div);
      }
    } catch (error) {
      console.error('Chart creation error:', error);
      setIsLoading(false);
    }
  }, [symbol, onSymbolChange]);

  useEffect(() => {
    const containerId = isFullscreen ? 'tradingview-widget-container-fullscreen' : 'tradingview-widget-container';
    createWidget(containerId);

    return () => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [createWidget, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, toggleFullscreen]);

  return (
    <>
      <ChartContainer ref={containerRef}>
        {isLoading && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}
        <FullscreenButton onClick={toggleFullscreen}>
          {isFullscreen ? '축소' : '전체화면'}
        </FullscreenButton>
        <div 
          id="tradingview-widget-container"
          style={{ 
            height: '100%', 
            width: '100%',
            display: isFullscreen ? 'none' : 'block',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </ChartContainer>

      <FullscreenContainer isFullscreen={isFullscreen}>
        <FullscreenButton 
          onClick={toggleFullscreen}
          style={{ position: 'fixed', top: '20px', right: '20px' }}
        >
          닫기
        </FullscreenButton>
        <div 
          id="tradingview-widget-container-fullscreen"
          style={{ height: '100%', width: '100%' }}
        />
      </FullscreenContainer>
    </>
  );
}

export default React.memo(TradingViewWidget); 