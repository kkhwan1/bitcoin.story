import React from 'react';
import styled from 'styled-components';
import { useBookmarks } from '../../../contexts/BookmarkContext';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-dark)'};
  color: var(--text-primary);
  font-size: 0.875rem;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--background-light)'};
  }
`;

function PostFilter({ currentFilter, onFilterChange }) {
  const { bookmarks } = useBookmarks();
  const currentUser = localStorage.getItem('currentUser');

  return (
    <FilterContainer>
      <FilterButton
        active={currentFilter === 'all'}
        onClick={() => onFilterChange('all')}
      >
        전체 글
      </FilterButton>
      {currentUser && (
        <FilterButton
          active={currentFilter === 'my'}
          onClick={() => onFilterChange('my')}
        >
          내가 쓴 글
        </FilterButton>
      )}
      <FilterButton
        active={currentFilter === 'bookmarks'}
        onClick={() => onFilterChange('bookmarks')}
      >
        북마크 ({bookmarks.length})
      </FilterButton>
      <FilterButton
        active={currentFilter === 'popular'}
        onClick={() => onFilterChange('popular')}
      >
        인기 글
      </FilterButton>
    </FilterContainer>
  );
}

export default PostFilter; 