import React from 'react';
import styled from 'styled-components';

const OptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--background-light);
  color: var(--text-primary);
  cursor: pointer;

  &:hover {
    border-color: var(--primary-color);
  }
`;

const ChartOptions = ({ onOptionsChange }) => {
  return (
    <OptionsContainer>
      <Select onChange={(e) => onOptionsChange('interval', e.target.value)}>
        <option value="1m">1분</option>
        <option value="5m">5분</option>
        <option value="15m">15분</option>
        <option value="1h">1시간</option>
        <option value="4h">4시간</option>
        <option value="1d">1일</option>
      </Select>
      <Select onChange={(e) => onOptionsChange('indicator', e.target.value)}>
        <option value="none">지표 없음</option>
        <option value="MA">이동평균선</option>
        <option value="MACD">MACD</option>
        <option value="RSI">RSI</option>
      </Select>
    </OptionsContainer>
  );
};

export default ChartOptions; 