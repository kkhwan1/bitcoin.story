import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatNumber } from '../../utils/formatters';
import axios from 'axios';

const RankingContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const RankingList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  padding: 1rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-primary);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
  }
`;

const RankingItem = styled.li`
  display: grid;
  grid-template-columns: 40px 120px 1fr;
  align-items: center;
  padding: 0.75rem;
  background: var(--background-light);
  border-radius: 4px;
  border-bottom: 1px solid var(--border-color);

  &:hover {
    background: var(--background-hover);
  }

  > * {
    border-right: 1px solid var(--border-color);
    padding: 0 0.5rem;
    
    &:last-child {
      border-right: none;
    }
  }
`;

const Rank = styled.span`
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CoinName = styled.span`
  font-weight: 500;
  color: var(--text-primary);
`;

const CoinSymbol = styled.span`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const Volume = styled.span`
  text-align: right;
  color: var(--text-primary);
  font-family: 'Roboto Mono', monospace;
`;

const RankingHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 120px 1fr;
  align-items: center;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);

  > div {
    text-align: center;
    border-right: 1px solid var(--border-color);
    padding: 0 0.5rem;
    
    &:last-child {
      border-right: none;
      text-align: right;
    }
  }

  .sub-text {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    font-weight: normal;
    display: block;
    margin-top: 0.25rem;
  }
`;

function VolumeRanking() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('https://api.upbit.com/v1/market/all');
        const markets = response.data
          .filter(market => market.market.startsWith('KRW-'))
          .map(market => ({
            market: market.market,
            korean_name: market.korean_name
          }));

        const tickers = await axios.get(`https://api.upbit.com/v1/ticker?markets=${markets.map(m => m.market).join(',')}`);
        
        const sortedByVolume = tickers.data
          .map(ticker => ({
            ...ticker,
            korean_name: markets.find(m => m.market === ticker.market).korean_name
          }))
          .sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
          .slice(0, 7);

        setRankings(sortedByVolume);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
      }
    };

    fetchRankings();
    const interval = setInterval(fetchRankings, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <RankingContainer>
      <RankingHeader>
        <div>순위</div>
        <div>코인</div>
        <div>
          거래량
          <span className="sub-text">(24H / KRW)</span>
        </div>
      </RankingHeader>
      <RankingList>
        {rankings.map((coin, index) => (
          <RankingItem key={coin.market}>
            <Rank>{index + 1}</Rank>
            <CoinInfo>
              <CoinName>{coin.market.split('-')[1]}</CoinName>
            </CoinInfo>
            <Volume>{formatNumber(coin.acc_trade_price_24h)}</Volume>
          </RankingItem>
        ))}
      </RankingList>
    </RankingContainer>
  );
}

export default VolumeRanking; 