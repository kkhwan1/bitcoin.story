import React from 'react';
import styled from 'styled-components';
import { formatNumber } from '../../../utils/formatters';

const InfoContainer = styled.div`
  background: var(--background-light);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const MainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CoinName = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  span {
    color: var(--text-secondary);
  }
`;

const PriceInfo = styled.div`
  text-align: right;
  
  .current-price {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .price-change {
    color: ${props => props.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  padding: 1rem;
  background: var(--background-dark);
  border-radius: 4px;
  
  .label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 1.125rem;
    font-weight: 500;
  }
`;

function CoinInfo({ data }) {
  if (!data) return <div>로딩중...</div>;

  const isPositive = data.change_rate >= 0;

  return (
    <InfoContainer>
      <MainInfo>
        <CoinName>
          <h1>{data.code.replace('KRW-', '')}</h1>
          <span>{data.code}</span>
        </CoinName>
        <PriceInfo isPositive={isPositive}>
          <div className="current-price">
            {formatNumber(data.trade_price)} KRW
          </div>
          <div className="price-change">
            {isPositive ? '+' : ''}{(data.change_rate * 100).toFixed(2)}%
            ({formatNumber(data.change_price)} KRW)
          </div>
        </PriceInfo>
      </MainInfo>
      
      <StatsGrid>
        <StatItem>
          <div className="label">24시간 거래량</div>
          <div className="value">{formatNumber(data.acc_trade_volume_24h)}</div>
        </StatItem>
        <StatItem>
          <div className="label">24시간 거래대금</div>
          <div className="value">{formatNumber(data.acc_trade_price_24h)} KRW</div>
        </StatItem>
        <StatItem>
          <div className="label">52주 최고가</div>
          <div className="value">{formatNumber(data.highest_52_week_price)} KRW</div>
        </StatItem>
        <StatItem>
          <div className="label">52주 최저가</div>
          <div className="value">{formatNumber(data.lowest_52_week_price)} KRW</div>
        </StatItem>
      </StatsGrid>
    </InfoContainer>
  );
}

export default CoinInfo; 