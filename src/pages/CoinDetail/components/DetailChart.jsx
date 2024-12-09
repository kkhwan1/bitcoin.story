import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  height: 600px;
  position: relative;
`;

const ChartControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-dark)'};
  color: var(--text-primary);
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-light)'};
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  background: var(--background-dark);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

function DetailChart({ symbol }) {
  const container = useRef();
  const [timeframe, setTimeframe] = useState('30');
  const [selectedIndicators, setSelectedIndicators] = useState(['RSI', 'MACD']);
  const [chartStyle, setChartStyle] = useState('1'); // Candles

  const indicators = {
    RSI: {
      name: 'RSI',
      script: 'RSI@tv-basicstudies'
    },
    MACD: {
      name: 'MACD',
      script: 'MACD@tv-basicstudies'
    },
    BB: {
      name: '볼린저 밴드',
      script: 'BB@tv-basicstudies'
    },
    MA: {
      name: '이동평균선',
      script: 'MASimple@tv-basicstudies'
    },
    Volume: {
      name: '거래량',
      script: 'Volume@tv-basicstudies'
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "UPBIT:${symbol}KRW",
        "interval": "${timeframe}",
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "${chartStyle}",
        "locale": "kr",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "allow_symbol_change": true,
        "save_image": true,
        "studies": ${JSON.stringify(selectedIndicators.map(ind => indicators[ind].script))},
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650",
        "hide_volume": false,
        "support_host": "https://www.tradingview.com",
        "toolbar_bg": "#1C1C1E",
        "drawings": {
          "enable_tools": true,
          "default_tool": "cursor"
        }
      }`;
    
    container.current.innerHTML = '';
    container.current.appendChild(script);

    return () => {
      container.current.innerHTML = '';
    };
  }, [symbol, timeframe, selectedIndicators, chartStyle]);

  const timeframes = [
    { label: '1분', value: '1' },
    { label: '5분', value: '5' },
    { label: '15분', value: '15' },
    { label: '30분', value: '30' },
    { label: '1시간', value: '60' },
    { label: '4시간', value: '240' },
    { label: '1일', value: 'D' },
    { label: '1주', value: 'W' },
  ];

  const chartStyles = [
    { label: '캔들', value: '1' },
    { label: '헤이킨 아시', value: '8' },
    { label: '라인', value: '2' },
    { label: '영역', value: '3' },
    { label: '바', value: '0' },
  ];

  const handleIndicatorChange = (indicator) => {
    setSelectedIndicators(prev => {
      if (prev.includes(indicator)) {
        return prev.filter(ind => ind !== indicator);
      }
      return [...prev, indicator];
    });
  };

  return (
    <div>
      <ChartControls>
        <ControlGroup>
          <Label>시간 단위</Label>
          <TimeframeSelector>
            {timeframes.map(tf => (
              <Button
                key={tf.value}
                active={timeframe === tf.value}
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </Button>
            ))}
          </TimeframeSelector>
        </ControlGroup>

        <ControlGroup>
          <Label>차트 스타일</Label>
          <Select value={chartStyle} onChange={(e) => setChartStyle(e.target.value)}>
            {chartStyles.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </Select>
        </ControlGroup>

        <ControlGroup>
          <Label>지표</Label>
          <TimeframeSelector>
            {Object.entries(indicators).map(([key, indicator]) => (
              <Button
                key={key}
                active={selectedIndicators.includes(key)}
                onClick={() => handleIndicatorChange(key)}
              >
                {indicator.name}
              </Button>
            ))}
          </TimeframeSelector>
        </ControlGroup>
      </ChartControls>

      <ChartContainer>
        <div className="tradingview-widget-container" ref={container}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </ChartContainer>
    </div>
  );
}

export default DetailChart; 