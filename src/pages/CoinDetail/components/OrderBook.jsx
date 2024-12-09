import React from 'react';
import styled from 'styled-components';
import { formatNumber } from '../../../utils/formatters';

const OrderBookContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const OrderSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.5rem;
  font-size: 0.875rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.type === 'ask' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)'};
    width: ${props => props.ratio}%;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

const Price = styled.span`
  color: ${props => props.type === 'ask' ? 'var(--danger-color)' : 'var(--success-color)'};
`;

const Size = styled.span`
  text-align: right;
`;

function OrderBook({ data }) {
  if (!data) return <div>로딩중...</div>;

  const maxSize = Math.max(...data.orderbook_units.map(unit => unit.ask_size + unit.bid_size));

  return (
    <OrderBookContainer>
      <OrderSide>
        {data.orderbook_units.map((unit, index) => (
          <OrderItem 
            key={`ask-${index}`}
            type="ask"
            ratio={(unit.ask_size / maxSize) * 100}
          >
            <Price type="ask">{formatNumber(unit.ask_price)}</Price>
            <Size>{formatNumber(unit.ask_size)}</Size>
          </OrderItem>
        ))}
      </OrderSide>
      <OrderSide>
        {data.orderbook_units.map((unit, index) => (
          <OrderItem 
            key={`bid-${index}`}
            type="bid"
            ratio={(unit.bid_size / maxSize) * 100}
          >
            <Price type="bid">{formatNumber(unit.bid_price)}</Price>
            <Size>{formatNumber(unit.bid_size)}</Size>
          </OrderItem>
        ))}
      </OrderSide>
    </OrderBookContainer>
  );
}

export default OrderBook; 