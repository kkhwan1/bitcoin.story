import React, { useState } from 'react';
import styled from 'styled-components';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchContainer = styled.div`
  margin-bottom: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchOptions = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
`;

const SearchOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;

const AdvancedOptions = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  background: var(--background-dark);
  border-radius: 4px;
`;

const DateRange = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;

  input {
    padding: 0.5rem;
    border-radius: 4px;
    background: var(--background-light);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
  }
`;

function PostSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  const [searchFields, setSearchFields] = useState({
    title: true,
    content: false,
    author: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, searchFields, dateRange);
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <SearchButton type="submit">
          <MagnifyingGlassIcon className="w-5 h-5" />
          검색
        </SearchButton>
      </SearchForm>

      <SearchOptions>
        <SearchOption>
          <input
            type="checkbox"
            checked={searchFields.title}
            onChange={(e) => setSearchFields(prev => ({ ...prev, title: e.target.checked }))}
          />
          제목
        </SearchOption>
        <SearchOption>
          <input
            type="checkbox"
            checked={searchFields.content}
            onChange={(e) => setSearchFields(prev => ({ ...prev, content: e.target.checked }))}
          />
          내용
        </SearchOption>
        <SearchOption>
          <input
            type="checkbox"
            checked={searchFields.author}
            onChange={(e) => setSearchFields(prev => ({ ...prev, author: e.target.checked }))}
          />
          작성자
        </SearchOption>
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ color: 'var(--text-secondary)' }}
        >
          {showAdvanced ? '기본 검색' : '상세 검색'}
        </button>
      </SearchOptions>

      {showAdvanced && (
        <AdvancedOptions>
          <DateRange>
            <span>기간</span>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span>~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </DateRange>
        </AdvancedOptions>
      )}
    </SearchContainer>
  );
}

export default PostSearch; 