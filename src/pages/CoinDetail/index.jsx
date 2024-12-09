import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import DetailChart from './components/DetailChart';
import OrderBook from './components/OrderBook';
import TradeHistory from './components/TradeHistory';
import CoinInfo from './components/CoinInfo';
import MarketAnalysis from './components/MarketAnalysis';

const DetailContainer = styled.div`
  padding: 2rem 0;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
  background: var(--background-light);
  border-radius: 8px;
  padding: 1rem;
`;

function CoinDetail() {
  const { symbol } = useParams();
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');

    ws.onopen = () => {
      const subscription = [
        { ticket: "UNIQUE_TICKET" },
        {
          type: "ticker",
          codes: [`KRW-${symbol}`],
        },
        {
          type: "orderbook",
          codes: [`KRW-${symbol}`],
        },
        {
          type: "trade",
          codes: [`KRW-${symbol}`],
        }
      ];
      ws.send(JSON.stringify(subscription));
    };

    ws.onmessage = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result);
        setCoinData(prevData => ({
          ...prevData,
          [data.type]: data,
        }));
      };
      reader.readAsText(event.data);
    };

    return () => ws.close();
  }, [symbol]);

  return (
    <DetailContainer>
      <CoinInfo data={coinData?.ticker} />
      <GridLayout>
        <Section>
          <DetailChart symbol={symbol} />
        </Section>
        <Section>
          <OrderBook data={coinData?.orderbook} />
        </Section>
      </GridLayout>
      <Section>
        <h2>시장 분석</h2>
        <MarketAnalysis symbol={symbol} />
      </Section>
      <Section>
        <TradeHistory data={coinData?.trade} />
      </Section>
    </DetailContainer>
  );
}

export default CoinDetail; 