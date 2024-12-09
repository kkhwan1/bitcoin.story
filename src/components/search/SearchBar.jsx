import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--background-light);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const SearchItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: var(--background-dark);
  }

  .coin-name {
    font-weight: 500;
  }

  .coin-symbol {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;

const RecentSearches = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-color);

  .title {
    padding: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 최근 검색어 불러오기
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // 검색창 외부 클릭 시 결과 숨기기
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCoins = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      try {
        const response = await axios.get('https://api.upbit.com/v1/market/all');
        const markets = response.data.filter(market => 
          market.market.startsWith('KRW-') && 
          (market.korean_name.toLowerCase().includes(query.toLowerCase()) ||
           market.market.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(markets);
      } catch (error) {
        console.error('Failed to search coins:', error);
      }
    };

    const debounceTimer = setTimeout(searchCoins, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (market) => {
    const symbol = market.market.replace('KRW-', '');
    
    // 최근 검색어 저장
    const newRecentSearches = [
      { symbol, name: market.korean_name },
      ...recentSearches.filter(item => item.symbol !== symbol)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    navigate(`/coin/${symbol}`);
    setQuery('');
    setShowResults(false);
  };

  return (
    <SearchContainer ref={searchRef}>
      <SearchInput
        type="text"
        placeholder="코인 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
      />
      {showResults && (
        <SearchResults>
          {!query && recentSearches.length > 0 && (
            <RecentSearches>
              <div className="title">최근 검색</div>
              {recentSearches.map((item, index) => (
                <SearchItem
                  key={index}
                  onClick={() => handleSearch({ market: `KRW-${item.symbol}`, korean_name: item.name })}
                >
                  <span className="coin-name">{item.name}</span>
                  <span className="coin-symbol">{item.symbol}</span>
                </SearchItem>
              ))}
            </RecentSearches>
          )}
          {results.map((market) => (
            <SearchItem
              key={market.market}
              onClick={() => handleSearch(market)}
            >
              <span className="coin-name">{market.korean_name}</span>
              <span className="coin-symbol">{market.market.replace('KRW-', '')}</span>
            </SearchItem>
          ))}
        </SearchResults>
      )}
    </SearchContainer>
  );
}

export default SearchBar; 