import React, { useState } from 'react';
import styled from 'styled-components';
import CoinSelector from './components/CoinSelector';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

const CommunityContainer = styled.div`
  padding: 2rem;
  background-color: var(--background-light);
  min-height: 100vh;
  color: var(--text-primary);
`;

const AddPostButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-weight: 500;
  margin-bottom: 2rem;
  cursor: pointer;

  &:hover {
    background: var(--secondary-color);
  }
`;

function Community() {
  const [selectedCoin, setSelectedCoin] = useState('ALL');
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <CommunityContainer>
      <CoinSelector 
        selectedCoin={selectedCoin} 
        onSelect={setSelectedCoin} 
      />
      <AddPostButton onClick={() => setShowPostForm(true)}>
        글쓰기
      </AddPostButton>
      <PostList selectedCoin={selectedCoin} />
      {showPostForm && (
        <PostForm 
          onClose={() => setShowPostForm(false)} 
          selectedCoin={selectedCoin}
        />
      )}
    </CommunityContainer>
  );
}

export default Community; 