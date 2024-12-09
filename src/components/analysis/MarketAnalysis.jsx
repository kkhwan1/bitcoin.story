import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatNumber } from '../../utils/formatters';

const AnalysisTable = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--background-secondary);
  border-radius: 12px;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: center;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  text-align: right;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  white-space: nowrap;

  &:first-child {
    text-align: left;
  }
`;

const Value = styled.span`
  color: ${props => props.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};
  font-weight: ${props => props.highlight ? '600' : '400'};
`;

const TopCoins = ['BTC', 'ETH', 'XRP', 'SOL', 'ADA'];

const CoinInfoSection = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
`;

const CoinDescription = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const CoinCard = styled.div`
  background: var(--background-light);
  border-radius: 8px;
  padding: 1.5rem;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 0.9rem;
  }
`;

const InfoHeader = styled.p`
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
`;

const CoinInfoTooltip = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 0.5rem;
  
  .info-icon {
    cursor: help;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
`;

const TooltipContent = styled.div`
  position: absolute;
  z-index: 1000;
  width: 250px;
  padding: 0.8rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease;

  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;

  @media (max-width: 768px) {
    left: 0;
    transform: none;
    
    &::before {
      left: 10px;
      transform: none;
    }
  }

  ${props => props.alignRight && `
    left: auto;
    right: 0;
    transform: none;
    
    &::before {
      left: auto;
      right: 10px;
      transform: none;
    }
  `}

  ${CoinInfoTooltip}:hover & {
    visibility: visible;
    opacity: 1;
  }

  h3 {
    font-size: 0.9rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--border-color);
  }
`;

const InfoText = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 1rem;
  font-style: italic;
`;

const InfoIcon = styled.span`
  cursor: help;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-left: 0.5rem;
  padding: 8px 15px;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
  backdrop-filter: blur(3px);
`;

const PopupContent = styled.div`
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);

  h3 {
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.7;
    font-size: 1rem;
  }
`;

const coinInfo = {
  BTC: {
    name: '비트코인 (Bitcoin)',
    description: '2009년 사토시 나카모토가 개발한 최초의 암호화폐입니다. 분산화된 디지털 화폐의 기준이 되며, 시가총액 기준 가장 큰 암호화폐입니다. 한정된 공급량(2,100만 개)을 특징으로 하는 디지털 금(Digital Gold)으로 여겨집니다.'
  },
  ETH: {
    name: '이더리움 (Ethereum)',
    description: '비탈릭 부테린이 개발한 스마트 컨트랙트 플랫폼입니다. DeFi, NFT, DAO 등 다양한 분산 애플리케이션(dApps)을 지원하며, 최근 지속가능성을 위해 PoS(지분증명) 방식으로 전환했습니다. Web3의 핵심 인프라로 자리잡고 있습니다.'
  },
  XRP: {
    name: '리플 (Ripple)',
    description: '리플랩스가 개발한 글로벌 결제 네트워크용 디지털 자산입니다. 3-5초의 빠른 거래 속도와 낮은 수수료가 특징이며, 전 세계 수백 개의 금융기관이 리플의 기술을 도입하고 있습니다. 특히 국제 송금 시장에서 강점을 보입니다.'
  },
  SOL: {
    name: '솔라나 (Solana)',
    description: '초당 65,000개 이상의 트랜잭션을 처리할 수 있는 고성능 블록체인입니다. 혁신적인 지분증명(PoS)과 작업증명(PoH) 하이브리드 방식을 사용하며, 낮은 수수료로 DeFi와 NFT 생태계에서 급성장하고 있습니다.'
  },
  ADA: {
    name: '에이다 (Cardano)',
    description: '이더리움 공동창업자 찰스 호스킨슨이 설립한 블록체인 플랫폼입니다. 학계의 피어 리뷰를 거친 과학적 접근방식과 단계적 개발 철학이 특징입니다. 지속가능성, 상호운용성, 확장성에 중점을 두고 있습니다.'
  },
  DOGE: {
    name: '도지코인 (Dogecoin)',
    description: '2013년에 만들어진 밈(meme) 코인의 시초입니다. 시바이누 강아지를 마스코트로 사용하며, 친근하고 재미있는 이미지로 큰 커뮤니티를 형성하고 있습니다. 일론 머스크의 지지로도 유명합니다.'
  },
  MATIC: {
    name: '폴리곤 (Polygon)',
    description: '이더리움의 확장성 문제를 해결하기 위한 레이어2 솔루션입니다. 빠른 처리 속도와 낮은 수수료로 이더리움 생태계를 보완하며, 독자적인 dApp 생태계도 구축하고 있습니다.'
  },
  DOT: {
    name: '폴카닷 (Polkadot)',
    description: '이더리움 공동창업자 개빈 우드가 개발한 멀티체인 네트워크입니다. 서로 다른 블록체인 간의 상호운용성을 제공하며, 패러체인을 통해 확장성과 커스터마이징이 가능한 것이 특징입니다.'
  }
};

function MarketAnalysis() {
  const [marketData, setMarketData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  // 단일 useEffect로 데이터 가져오기
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // 모든 마켓 정보 가져오기
        const marketResponse = await fetch('https://api.upbit.com/v1/market/all?isDetails=false');
        const markets = await marketResponse.json();
        const krwMarkets = markets
          .filter(market => market.market.startsWith('KRW-'))
          .map(market => market.market)
          .join(',');

        // 티커 정보 가져오기
        const tickerResponse = await fetch(`https://api.upbit.com/v1/ticker?markets=${krwMarkets}`);
        const tickers = await tickerResponse.json();

        // 거래대금 기준으로 정렬하고 상위 7개 선택
        const sortedData = tickers
          .sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
          .slice(0, 7)
          .map(ticker => ({
            ...ticker,
            korean_name: markets.find(m => m.market === ticker.market)?.korean_name
          }));

        setMarketData(sortedData);
      } catch (error) {
        console.error('Market data fetch error:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000); // 5초마다 갱신

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (coin) => {
    setSelectedCoin(coin);
  };

  const handleMouseLeave = () => {
    setSelectedCoin(null);
  };

  const handleOverlayClick = () => {
    setSelectedCoin(null);
  };

  return (
    <>
      <AnalysisTable>
        <Table>
          <thead>
            <tr>
              <Th>
                코인
                <InfoIcon
                  onMouseEnter={() => handleMouseEnter({ symbol: 'INFO', name: '주요 코인', description: '실시간 거래량 기준 상위 7개 코인들입니다.' })}
                  onMouseLeave={handleMouseLeave}
                >
                  ⓘ
                </InfoIcon>
              </Th>
              <Th>현재가(KRW)</Th>
              <Th>24시간 변동률</Th>
              <Th>고가(KRW)</Th>
              <Th>저가(KRW)</Th>
              <Th>변동성</Th>
              <Th>거래대금(KRW)</Th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((coin) => {
              const priceChange = coin.change_rate * 100;
              const volatility = ((coin.high_price - coin.low_price) / coin.trade_price * 100);
              const symbol = coin.market.split('-')[1];
              const info = coinInfo[symbol] || {
                name: `${symbol}`,
                description: '해당 코인의 상세 정보를 준비 중입니다.'
              };

              return (
                <tr key={coin.market}>
                  <Td>
                    {symbol}
                    <InfoIcon
                      onMouseEnter={() => handleMouseEnter({ symbol, ...info })}
                      onMouseLeave={handleMouseLeave}
                    >
                      ⓘ
                    </InfoIcon>
                  </Td>
                  <Td>
                    <Value isPositive={coin.change_rate >= 0} highlight>
                      {formatNumber(coin.trade_price)}
                    </Value>
                  </Td>
                  <Td>
                    <Value isPositive={priceChange >= 0}>
                      {priceChange.toFixed(2)}%
                    </Value>
                  </Td>
                  <Td>{formatNumber(coin.high_price)}</Td>
                  <Td>{formatNumber(coin.low_price)}</Td>
                  <Td>
                    <Value isPositive={true}>
                      {volatility.toFixed(2)}%
                    </Value>
                  </Td>
                  <Td>{formatNumber(coin.acc_trade_price_24h)}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </AnalysisTable>

      <PopupOverlay show={!!selectedCoin} onClick={handleOverlayClick}>
        {selectedCoin && (
          <PopupContent onClick={e => e.stopPropagation()}>
            <h3>
              <span role="img" aria-label="coin">💎</span>
              {selectedCoin.name}
            </h3>
            <p>{selectedCoin.description}</p>
          </PopupContent>
        )}
      </PopupOverlay>

      <InfoText>
        * 코인 이름 옆의 ⓘ 아이콘에 마우스를 올리면 상세 정보를 확인할 수 있습니다.
      </InfoText>
    </>
  );
}

export default MarketAnalysis; 