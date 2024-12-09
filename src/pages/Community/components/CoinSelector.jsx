import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectorContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CoinButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-dark)'};
  color: var(--text-primary);
  font-size: 0.875rem;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-light)'};
  }
`;

function CoinSelector({ selectedCoin, onSelect }) {
  const [coins, setCoins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('https://api.upbit.com/v1/market/all');
        const krwMarkets = response.data
          .filter(market => market.market.startsWith('KRW-'))
          .map(market => ({
            symbol: market.market.replace('KRW-', ''),
            name: market.korean_name
          }));
        setCoins(krwMarkets);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };

    fetchCoins();
  }, []);

  const handleSelect = (symbol) => {
    onSelect(symbol);
    navigate(symbol === 'ALL' ? '/community' : `/community/${symbol}`);
  };

  return (
    <SelectorContainer>
      <CoinButton
        active={selectedCoin === 'ALL'}
        onClick={() => handleSelect('ALL')}
      >
        전체
      </CoinButton>
      {coins.map(coin => (
        <CoinButton
          key={coin.symbol}
          active={selectedCoin === coin.symbol}
          onClick={() => handleSelect(coin.symbol)}
        >
          {coin.name}
        </CoinButton>
      ))}
    </SelectorContainer>
  );
}

export default CoinSelector; 