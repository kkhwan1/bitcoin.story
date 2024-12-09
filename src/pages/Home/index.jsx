import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CryptoTable from '../../components/crypto/CryptoTable';
import TradingViewWidget from '../../components/chart/TradingViewWidget';
import VolumeRanking from '../../components/crypto/VolumeRanking';
import ErrorBoundary from '../../components/ErrorBoundary';
import MarketAnalysis from '../../components/analysis/MarketAnalysis';
import { useCrypto } from '../../contexts/CryptoContext';
import NewsFeed from '../../components/news/NewsFeed';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HomeContainer = styled.div`
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// 메인 섹션 스타일
const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  height: 400px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const ChartSection = styled(Section)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
  position: relative;
`;

const ChartTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const CoinSelector = styled.select`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 4px;
  background: var(--background-light);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;
  min-width: 200px;

  // Custom dropdown arrow
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;

  &:hover {
    border-color: var(--primary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }

  option {
    padding: 0.5rem;
    background: var(--background-secondary);
  }
`;

const ChartSource = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: right;
  width: 100%;
  padding-right: 1rem;
  font-style: italic;
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: var(--primary);
    border-radius: 2px;
  }
`;

const TimeInfo = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: normal;
  margin-left: 1rem;
`;

// 분석 섹션 스타일
const AnalysisContainer = styled.div`
  margin-top: 6rem;  // 상단 여백 더 증가
  padding-top: 4rem;  // 상단 패딩 더 증가
  border-top: 2px solid var(--border-color);  // 구분선 두께 증가
  background: var(--background-primary);  // 배경색 변경
  padding-bottom: 4rem;  // 하단 패딩 추가
`;

const AnalysisTitle = styled(SectionTitle)`
  font-size: 2rem;  // 제목 크기 증가
  margin-bottom: 2rem;
  
  &::before {
    height: 32px;  // 구분선 높이 증가
  }
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AnalysisCard = styled(Section)`
  h3 {
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

function Home() {
  const { selectedCoin, setSelectedCoin, availableCoins } = useCrypto();

  const handleCoinSelect = (marketCode) => {
    const symbol = marketCode.split('-')[1] + 'KRW';
    setSelectedCoin(symbol);
  };

  return (
    <>
      <PageContainer>
        <MainSection>
          <HomeContainer>
            <Section>
              <SectionTitle>실시간 시세</SectionTitle>
              <ErrorBoundary>
                <CryptoTable onCoinSelect={handleCoinSelect} />
              </ErrorBoundary>
            </Section>

            <ChartGrid>
              <ChartSection>
                <ChartHeader>
                  <ChartTitle>
                    <SectionTitle>차트</SectionTitle>
                  </ChartTitle>
                  <CoinSelector 
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                  >
                    {availableCoins.map(coin => (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.name} ({coin.symbol.replace('KRW', '')})
                      </option>
                    ))}
                  </CoinSelector>
                  <ChartSource>
                    Data provided by TradingView
                  </ChartSource>
                </ChartHeader>
                <ChartContainer>
                  <ErrorBoundary>
                    <TradingViewWidget symbol={selectedCoin} />
                  </ErrorBoundary>
                </ChartContainer>
              </ChartSection>

              <Section>
                <SectionTitle>
                  실시간 거래량 순위
                  <TimeInfo>(24시간 거래량)</TimeInfo>
                </SectionTitle>
                <ErrorBoundary>
                  <VolumeRanking onCoinSelect={handleCoinSelect} />
                </ErrorBoundary>
              </Section>
            </ChartGrid>

            <Section>
              <ErrorBoundary>
                <NewsFeed />
              </ErrorBoundary>
            </Section>
          </HomeContainer>
        </MainSection>
      </PageContainer>

      <AnalysisContainer>
        <PageContainer>
          <Section>
            <AnalysisTitle>
              주요 코인 시장 분석
              <TimeInfo>(실시간)</TimeInfo>
            </AnalysisTitle>
            <ErrorBoundary>
              <MarketAnalysis />
            </ErrorBoundary>
          </Section>
        </PageContainer>
      </AnalysisContainer>
    </>
  );
}

export default Home; 