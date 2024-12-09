import React from 'react';
import styled from 'styled-components';

const SortContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SortButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-dark)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-light)'};
  }
`;

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'views', label: '조회순' },
  { value: 'likes', label: '추천순' },
  { value: 'comments', label: '댓글순' }
];

function PostSort({ currentSort, onSort }) {
  return (
    <SortContainer>
      {sortOptions.map(option => (
        <SortButton
          key={option.value}
          active={currentSort === option.value}
          onClick={() => onSort(option.value)}
        >
          {option.label}
        </SortButton>
      ))}
    </SortContainer>
  );
}

export default PostSort; 