import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatNumber } from '../../../utils/formatters';
import { fetchHistoricalData, calculateTechnicalIndicators, predictPrice } from '../../../services/analysisService';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalysisContainer = styled.div`
  padding: 1rem;
  background: var(--background-light);
  border-radius: 8px;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AnalysisCard = styled.div`
  padding: 1rem;
  background: var(--background-dark);
  border-radius: 4px;

  h3 {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 500;
  }

  .prediction {
    color: ${props => props.trend === 'up' ? 'var(--success-color)' : 'var(--danger-color)'};
  }
`;

const ChartContainer = styled.div`
  margin-top: 2rem;
  height: 300px;
`;

function MarketAnalysis({ symbol }) {
  const [analysis, setAnalysis] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHistoricalData(symbol);
      setHistoricalData(data);

      const indicators = calculateTechnicalIndicators(data);
      setAnalysis(indicators);

      const pricePredictions = await predictPrice(data);
      setPredictions(pricePredictions);
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // 5분마다 갱신

    return () => clearInterval(interval);
  }, [symbol]);

  if (!analysis || !predictions) return <div>분석 데이터 로딩중...</div>;

  const currentPrice = historicalData[0]?.trade_price;
  const predictedTrend = predictions.mlPrediction > currentPrice ? 'up' : 'down';

  const chartData = {
    labels: historicalData.map((_, index) => index),
    datasets: [
      {
        label: '실제 가격',
        data: historicalData.map(d => d.trade_price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: '예측 가격',
        data: historicalData.map((_, index) => predictions.linearPrediction),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  return (
    <AnalysisContainer>
      <AnalysisGrid>
        <AnalysisCard trend={predictedTrend}>
          <h3>AI 가격 예측 (24시간)</h3>
          <div className="value prediction">
            {formatNumber(predictions.mlPrediction)} KRW
            ({((predictions.mlPrediction - currentPrice) / currentPrice * 100).toFixed(2)}%)
          </div>
        </AnalysisCard>
        
        <AnalysisCard>
          <h3>RSI (14)</h3>
          <div className="value">
            {analysis.rsi[analysis.rsi.length - 1].toFixed(2)}
          </div>
        </AnalysisCard>

        <AnalysisCard>
          <h3>MACD</h3>
          <div className="value">
            {analysis.macd[analysis.macd.length - 1].MACD.toFixed(2)}
          </div>
        </AnalysisCard>

        <AnalysisCard>
          <h3>볼린저 밴드</h3>
          <div className="value">
            상단: {formatNumber(analysis.bollingerBands[analysis.bollingerBands.length - 1].upper)}
            <br />
            하단: {formatNumber(analysis.bollingerBands[analysis.bollingerBands.length - 1].lower)}
          </div>
        </AnalysisCard>
      </AnalysisGrid>

      <ChartContainer>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }}
        />
      </ChartContainer>
    </AnalysisContainer>
  );
}

export default MarketAnalysis; 