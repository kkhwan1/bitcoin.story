import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { formatNumber } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoriteContext.jsx';
import { useWebSocket } from '../../hooks/useWebSocket';

const TableWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  height: 400px;
  margin-top: 1rem;
`;

const TableContainer = styled.div`
  overflow-y: auto;
  height: calc(100% - 40px); // 헤더 높이만큼 뺌
  
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

const TableHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--background-secondary);
  border-bottom: 2px solid var(--border-color);
  display: grid;
  grid-template-columns: 80px minmax(120px, 1fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(150px, 1.5fr);
  padding: 1rem;
  font-weight: 600;
  color: var(--text-secondary);

  > div {
    text-align: center;
    padding: 0 1rem;
    white-space: nowrap;
  }
`;

const HeaderCell = styled.div`
  text-align: center;
  padding: 0 1rem;
  white-space: nowrap;

  .sub-text {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    font-weight: normal;
    display: block;
    margin-top: 0.25rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px minmax(120px, 1fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(150px, 1.5fr);
  border-bottom: 1px solid var(--border-color);
  
  &:hover {
    background: var(--background-hover);
  }

  > div {
    border-right: 1px solid var(--border-color);
    
    &:last-child {
      border-right: none;
    }
  }
`;

const TableCell = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  text-align: right;
  background: var(--background-secondary);

  &:first-child {
    justify-content: center;
  }

  &:nth-child(2) {
    text-align: left;
  }

  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    justify-content: flex-end;
  }
`;

const PriceChange = styled.span`
  color: ${props => props.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};
`;

const CoinLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const FilterControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;

  .left-controls {
    display: flex;
    gap: 1rem;
  }
`;

const SortButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: var(--background-dark);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &:hover {
    background: var(--background-light);
  }

  &.active {
    background: var(--primary-color);
  }

  &::after {
    content: '${props => props.direction === 'asc' ? '↑' : '↓'}';
    opacity: ${props => props.isActive ? 1 : 0};
  }
`;

const FavoriteButton = styled.button`
  padding: 0.5rem;
  background: none;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StarButton = styled(FavoriteButton)`
  padding: 0.25rem;
`;

const StarIcon = styled.span`
  cursor: pointer;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`;

function CryptoTable({ onCoinSelect }) {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleWebSocketMessage = useCallback((event) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        setCryptoData(prev => {
          const index = prev.findIndex(item => item.market === data.code);
          if (index === -1) return prev;
          
          // 불필요한 업데이트 방지
          const updated = [...prev];
          const newData = {
            ...updated[index],
            trade_price: data.trade_price,
            change_rate: data.change_rate,
            acc_trade_volume_24h: data.acc_trade_volume_24h
          };
          
          if (JSON.stringify(updated[index]) === JSON.stringify(newData)) {
            return prev;
          }
          
          updated[index] = newData;
          return updated;
        });
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };
    reader.readAsText(event.data);
  }, []);

  const { sendMessage } = useWebSocket('wss://api.upbit.com/websocket/v1', {
    onOpen: () => {
      const subscription = [
        { ticket: "UNIQUE_TICKET" },
        {
          type: "ticker",
          codes: cryptoData.map(coin => coin.market_code),
          isOnlyRealtime: true
        }
      ];
      sendMessage(subscription);
    },
    onMessage: handleWebSocketMessage,
    onError: (error) => console.error('WebSocket error:', error),
    reconnectAttempts: 5,
    reconnectInterval: 3000
  });

  useEffect(() => {
    // 초기 데이터 로딩
    const fetchInitialData = async () => {
      try {
        // 마켓 코드 조회
        const marketResponse = await fetch('https://api.upbit.com/v1/market/all?isDetails=false');
        if (!marketResponse.ok) throw new Error('Failed to fetch market data');
        const markets = await marketResponse.json();
        
        // KRW 마켓만 필터링
        const krwMarkets = markets
          .filter(market => market.market.startsWith('KRW-'))
          .map(market => market.market)
          .join(',');

        // 티커 정보 조회
        const tickerResponse = await fetch(`https://api.upbit.com/v1/ticker?markets=${krwMarkets}`);
        if (!tickerResponse.ok) throw new Error('Failed to fetch ticker data');
        const tickers = await tickerResponse.json();

        // 마켓 정보와 티커 정보 결합
        const combinedData = tickers.map(ticker => {
          const marketInfo = markets.find(market => market.market === ticker.market);
          return {
            ...ticker,
            korean_name: marketInfo.korean_name,
            market_code: ticker.market
          };
        });

        setCryptoData(combinedData);
        setLoading(false);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError('Failed to fetch initial data');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cryptoData.length) return <div>No data available</div>;

  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (sortConfig.key) {
        case 'name':
          comparison = a.korean_name.localeCompare(b.korean_name);
          break;
        case 'price':
          comparison = a.trade_price - b.trade_price;
          break;
        case 'change':
          comparison = a.change_rate - b.change_rate;
          break;
        case 'volume':
          comparison = a.acc_trade_volume_24h - b.acc_trade_volume_24h;
          break;
        default:
          return 0;
      }
      
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredData = showFavorites
    ? cryptoData.filter(coin => favorites.includes(coin.market_code))
    : cryptoData;

  const sortedData = sortData(filteredData);

  const handleCoinClick = (marketCode) => {
    if (onCoinSelect) {
      onCoinSelect(marketCode);
    }
  };

  const handleStarClick = (e, market) => {
    e.stopPropagation();
    if (isFavorite(market)) {
      removeFavorite(market);
    } else {
      addFavorite(market);
    }
  };

  return (
    <div>
      <FilterControls>
        <div className="left-controls">
          <SortButton
            onClick={() => handleSort('name')}
            className={sortConfig.key === 'name' ? 'active' : ''}
            direction={sortConfig.direction}
            isActive={sortConfig.key === 'name'}
          >
            이름순
          </SortButton>
          <SortButton
            onClick={() => handleSort('price')}
            className={sortConfig.key === 'price' ? 'active' : ''}
            direction={sortConfig.direction}
            isActive={sortConfig.key === 'price'}
          >
            가격순
          </SortButton>
          <SortButton
            onClick={() => handleSort('change')}
            className={sortConfig.key === 'change' ? 'active' : ''}
            direction={sortConfig.direction}
            isActive={sortConfig.key === 'change'}
          >
            변동률
          </SortButton>
          <SortButton
            onClick={() => handleSort('volume')}
            className={sortConfig.key === 'volume' ? 'active' : ''}
            direction={sortConfig.direction}
            isActive={sortConfig.key === 'volume'}
          >
            거래량
          </SortButton>
        </div>
        <FavoriteButton
          active={showFavorites}
          onClick={() => setShowFavorites(!showFavorites)}
          title={showFavorites ? '전체 코인 보기' : '즐겨찾기만 보기'}
        >
          {showFavorites ? '★' : '☆'}
        </FavoriteButton>
      </FilterControls>
      
      <TableWrapper>
        <TableHeader>
          <HeaderCell>★</HeaderCell>
          <HeaderCell>이름</HeaderCell>
          <HeaderCell>
            현재가
            <span className="sub-text">(KRW)</span>
          </HeaderCell>
          <HeaderCell>
            전일대비
            <span className="sub-text">(00:00 기준)</span>
          </HeaderCell>
          <HeaderCell>
            거래량
            <span className="sub-text">(24H)</span>
          </HeaderCell>
        </TableHeader>
        
        <TableContainer>
          {sortedData.map((crypto) => (
            <TableRow key={crypto.market_code}>
              <TableCell>
                <StarIcon
                  active={favorites.includes(crypto.market_code)}
                  onClick={(e) => handleStarClick(e, crypto.market_code)}
                >
                  {favorites.includes(crypto.market_code) ? '★' : '☆'}
                </StarIcon>
              </TableCell>
              <TableCell onClick={() => handleCoinClick(crypto.market_code)} style={{ cursor: 'pointer' }}>
                <CoinLink to={`/coin/${crypto.market_code.split('-')[1]}`}>
                  {crypto.korean_name}
                </CoinLink>
              </TableCell>
              <TableCell>{formatNumber(crypto.trade_price)}</TableCell>
              <TableCell>
                <PriceChange isPositive={crypto.change_rate >= 0}>
                  {(crypto.change_rate * 100).toFixed(2)}%
                </PriceChange>
              </TableCell>
              <TableCell>{formatNumber(crypto.acc_trade_volume_24h)}</TableCell>
            </TableRow>
          ))}
        </TableContainer>
      </TableWrapper>
    </div>
  );
}

export default CryptoTable; 