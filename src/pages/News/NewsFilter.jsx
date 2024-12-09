import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--background-light);
  color: var(--text-primary);
  min-width: 200px;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
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

const StyledDatePicker = styled(DatePicker)`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--background-light);
  color: var(--text-primary);
  cursor: pointer;
`;

const NewsFilter = ({ onFilterChange }) => {
  return (
    <FilterContainer>
      <SearchInput
        placeholder="뉴스 검색..."
        onChange={(e) => onFilterChange('search', e.target.value)}
      />
      <Select onChange={(e) => onFilterChange('source', e.target.value)}>
        <option value="all">전체 소스</option>
        <option value="investing">Investing.com</option>
        <option value="upbit">Upbit</option>
      </Select>
      <StyledDatePicker
        onChange={(date) => onFilterChange('date', date)}
        placeholderText="날짜 선택"
        dateFormat="yyyy-MM-dd"
        isClearable
      />
    </FilterContainer>
  );
};

export default NewsFilter; 