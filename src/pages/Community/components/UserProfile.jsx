import React from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../utils/formatters';

const ProfileModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ProfileContainer = styled.div`
  background: var(--background-light);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostItem = styled.div`
  padding: 1rem;
  background: var(--background-dark);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: var(--background-hover);
  }

  .title {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: var(--background-dark);
  color: var(--text-primary);
  border-radius: 4px;
  margin-top: 1rem;
`;

function UserProfile({ username, onClose, onPostClick }) {
  const posts = JSON.parse(localStorage.getItem('community_posts') || '[]')
    .filter(post => post.author === username);

  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

  return (
    <ProfileModal onClick={onClose}>
      <ProfileContainer onClick={e => e.stopPropagation()}>
        <UserInfo>
          <h2>{username}</h2>
          <div className="stats">
            <span>작성글 {posts.length}</span>
            <span>받은 추천 {totalLikes}</span>
            <span>받은 댓글 {totalComments}</span>
          </div>
        </UserInfo>

        <h3>작성한 글</h3>
        <PostList>
          {posts.map(post => (
            <PostItem key={post.id} onClick={() => onPostClick(post)}>
              <div className="title">{post.title}</div>
              <div className="meta">
                <span>{formatDate(post.timestamp)}</span>
                <span>👍 {post.likes || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
                <span>👁️ {post.views || 0}</span>
              </div>
            </PostItem>
          ))}
        </PostList>

        <CloseButton onClick={onClose}>
          닫기
        </CloseButton>
      </ProfileContainer>
    </ProfileModal>
  );
}

export default UserProfile; 