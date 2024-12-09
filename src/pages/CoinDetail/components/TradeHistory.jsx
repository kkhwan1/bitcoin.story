import React from 'react';
import styled from 'styled-components';
import { formatNumber, formatDate } from '../../../utils/formatters';

const TradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 0.75rem;
  text-align: right;
  color: var(--text-secondary);
  font-weight: 500;
  
  &:first-child {
    text-align: left;
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  text-align: right;
  border-bottom: 1px solid var(--border-color);
  
  &:first-child {
    text-align: left;
  }
`;

const Price = styled.span`
  color: ${props => props.type === 'ASK' ? 'var(--danger-color)' : 'var(--success-color)'};
`;

function TradeHistory({ data }) {
  if (!Array.isArray(data)) return <div>거래 내역 로딩중...</div>;

  return (
    <TradeTable>
      <thead>
        <tr>
          <Th>시간</Th>
          <Th>가격</Th>
          <Th>수량</Th>
          <Th>체결금액</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((trade, index) => (
          <tr key={index}>
            <Td>{formatDate(trade.trade_time_utc)}</Td>
            <Td>
              <Price type={trade.ask_bid}>
                {formatNumber(trade.trade_price)}
              </Price>
            </Td>
            <Td>{formatNumber(trade.trade_volume)}</Td>
            <Td>{formatNumber(trade.trade_price * trade.trade_volume)}</Td>
          </tr>
        ))}
      </tbody>
    </TradeTable>
  );
}

export default TradeHistory; 