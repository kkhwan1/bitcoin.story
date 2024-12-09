import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../utils/formatters';
import PostDetail from './PostDetail';
import PostSearch from './PostSearch';
import PostSort from './PostSort';
import PostFilter from './PostFilter';
import { useInView } from 'react-intersection-observer';
import { useBookmarks } from '../../../contexts/BookmarkContext';
import UserProfile from './UserProfile';

const PostListContainer = styled.div`
  margin-top: 2rem;
`;

const PostTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background: var(--background-light);
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    background-color: var(--background-dark);
    color: var(--text-secondary);
    font-weight: 500;
    white-space: nowrap;
  }

  td {
    vertical-align: middle;
  }

  tbody tr {
    transition: background-color 0.2s;

    &:nth-child(even) {
      background-color: var(--background-dark);
    }

    &:hover {
      background-color: var(--background-hover);
    }
  }

  .date-column {
    width: 150px;
  }

  .author-column {
    width: 120px;
  }

  .likes-column {
    width: 80px;
    text-align: center;
  }

  .thumbnail-column {
    width: 100px;
    padding: 0.5rem;
  }
`;

const ThumbnailPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background: var(--background-dark);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-count {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-bottom-left-radius: 4px;
  }
`;

const PostTitle = styled.div`
  cursor: pointer;
  
  .title-text {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      color: var(--primary-color);
    }

    .category {
      font-size: 0.875rem;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      background: var(--primary-color);
      color: white;
    }
  }

  .new-badge {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.75rem;
    margin-left: 0.5rem;
    vertical-align: middle;
  }
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);

  .divider {
    width: 1px;
    height: 12px;
    background: var(--border-color);
  }
`;

const PopularPostsSection = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: var(--background-dark);
  border-radius: 8px;
`;

const PopularPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PopularPostCard = styled.div`
  background: var(--background-light);
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;

  &:hover {
    background: var(--background-dark);
  }

  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  .meta {
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: flex;
    justify-content: space-between;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const POSTS_PER_LOAD = 10;

function PostList({ selectedCoin }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortType, setSortType] = useState('latest');
  const [currentFilter, setCurrentFilter] = useState('all');
  const { bookmarks } = useBookmarks();
  const currentUser = localStorage.getItem('currentUser');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
  });

  const sortPosts = (posts, type) => {
    const sorted = [...posts];
    switch (type) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'views':
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'likes':
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'comments':
        return sorted.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      default:
        return sorted;
    }
  };

  useEffect(() => {
    const savedPosts = localStorage.getItem('community_posts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      const coinPosts = selectedCoin === 'ALL' 
        ? allPosts 
        : allPosts.filter(post => post.coinSymbol === selectedCoin);
      const sortedPosts = sortPosts(coinPosts, sortType);
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
    }
  }, [selectedCoin, sortType]);

  const popularPosts = posts.filter(post => (post.likes || 0) >= 5);

  const getFilteredPosts = (posts, filter) => {
    switch (filter) {
      case 'my':
        return posts.filter(post => post.author === currentUser);
      case 'bookmarks':
        return posts.filter(post => bookmarks.some(b => b.id === post.id));
      case 'popular':
        return posts.filter(post => (post.likes || 0) >= 5);
      default:
        return posts;
    }
  };

  const handleSearch = (query, searchFields, dateRange) => {
    if (!query.trim() && !dateRange.start && !dateRange.end) {
      setFilteredPosts(getFilteredPosts(posts, currentFilter));
      return;
    }

    let filtered = posts;

    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(post => {
        return (
          (searchFields.title && post.title.toLowerCase().includes(searchQuery)) ||
          (searchFields.content && post.content.toLowerCase().includes(searchQuery)) ||
          (searchFields.author && post.author.toLowerCase().includes(searchQuery))
        );
      });
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(post => {
        const postDate = new Date(post.timestamp);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;

        if (start && end) {
          return postDate >= start && postDate <= end;
        } else if (start) {
          return postDate >= start;
        } else if (end) {
          return postDate <= end;
        }
        return true;
      });
    }

    setFilteredPosts(getFilteredPosts(filtered, currentFilter));
    setDisplayPosts(filtered.slice(0, POSTS_PER_LOAD));
    setHasMore(filtered.length > POSTS_PER_LOAD);
  };

  const handlePostClick = (post) => {
    const updatedPost = {
      ...post,
      views: (post.views || 0) + 1
    };

    const savedPosts = JSON.parse(localStorage.getItem('community_posts'));
    const updatedPosts = savedPosts.map(p => 
      p.id === post.id ? updatedPost : p
    );
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));

    setPosts(prevPosts => 
      prevPosts.map(p => p.id === post.id ? updatedPost : p)
    );
    setFilteredPosts(prevPosts => 
      prevPosts.map(p => p.id === post.id ? updatedPost : p)
    );
    setSelectedPost(updatedPost);
  };

  const handlePostUpdate = (updatedPost) => {
    const updatedPosts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
    setPosts(updatedPosts);
    setFilteredPosts(updatedPosts);
    setSelectedPost(null);
  };

  const handlePostDelete = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    setFilteredPosts(updatedPosts);
  };

  const handleSort = (type) => {
    setSortType(type);
    const sorted = sortPosts(filteredPosts, type);
    setFilteredPosts(sorted);
    setDisplayPosts(sorted.slice(0, POSTS_PER_LOAD));
    setHasMore(sorted.length > POSTS_PER_LOAD);
  };

  useEffect(() => {
    setDisplayPosts(filteredPosts.slice(0, POSTS_PER_LOAD));
    setHasMore(filteredPosts.length > POSTS_PER_LOAD);
  }, [filteredPosts]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [inView]);

  const loadMorePosts = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentLength = displayPosts.length;
    const nextPosts = filteredPosts.slice(
      currentLength,
      currentLength + POSTS_PER_LOAD
    );

    setDisplayPosts(prev => [...prev, ...nextPosts]);
    setHasMore(currentLength + nextPosts.length < filteredPosts.length);
    setIsLoading(false);
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    const filtered = getFilteredPosts(posts, filter);
    setFilteredPosts(filtered);
    setDisplayPosts(filtered.slice(0, POSTS_PER_LOAD));
    setHasMore(filtered.length > POSTS_PER_LOAD);
  };

  const isNewPost = (timestamp) => {
    const postDate = new Date(timestamp);
    const now = new Date();
    const diff = now - postDate;
    return diff < 24 * 60 * 60 * 1000;
  };

  return (
    <PostListContainer>
      <PostFilter 
        currentFilter={currentFilter} 
        onFilterChange={handleFilterChange}
      />
      <PostSearch onSearch={handleSearch} />
      <PostSort currentSort={sortType} onSort={handleSort} />

      {currentFilter === 'all' && popularPosts.length > 0 && (
        <PopularPostsSection>
          <h2>인기 게시글</h2>
          <PopularPostsGrid>
            {popularPosts.slice(0, 4).map(post => (
              <PopularPostCard 
                key={post.id}
                onClick={() => handlePostClick(post)}
              >
                <h3>{post.title}</h3>
                <div className="meta">
                  <span>{post.author}</span>
                  <span>👍 {post.likes || 0}</span>
                </div>
              </PopularPostCard>
            ))}
          </PopularPostsGrid>
        </PopularPostsSection>
      )}
      
      <PostTable>
        <thead>
          <tr>
            <th className="thumbnail-column"></th>
            <th className="date-column">작성일</th>
            <th className="author-column">작성자</th>
            <th>제목</th>
            <th className="likes-column">추천</th>
          </tr>
        </thead>
        <tbody>
          {displayPosts.map(post => (
            <tr key={post.id}>
              <td className="thumbnail-column">
                {post.images?.length > 0 && (
                  <ThumbnailPreview>
                    <img src={post.images[0]} alt="썸네일" />
                    {post.images.length > 1 && (
                      <div className="image-count">+{post.images.length - 1}</div>
                    )}
                  </ThumbnailPreview>
                )}
              </td>
              <td className="date-column">{formatDate(post.timestamp)}</td>
              <td 
                className="author-column" 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUser(post.author);
                }}
                style={{ cursor: 'pointer' }}
              >
                {post.author}
              </td>
              <td>
                <PostTitle onClick={() => handlePostClick(post)}>
                  <div className="title-text">
                    {post.coinSymbol !== 'ALL' && (
                      <span className="category">{post.coinSymbol}</span>
                    )}
                    {post.title}
                    {isNewPost(post.timestamp) && (
                      <span className="new-badge">NEW</span>
                    )}
                  </div>
                  <PostInfo>
                    <span>댓글 {post.comments?.length || 0}</span>
                    <div className="divider" />
                    <span>조회 {post.views || 0}</span>
                    {post.edited && (
                      <>
                        <div className="divider" />
                        <span>수정됨</span>
                      </>
                    )}
                    {post.images?.length > 0 && (
                      <>
                        <div className="divider" />
                        <span>📷 {post.images.length}</span>
                      </>
                    )}
                  </PostInfo>
                </PostTitle>
              </td>
              <td className="likes-column">
                <span style={{ 
                  color: post.likes > 0 ? 'var(--primary-color)' : 'inherit',
                  fontWeight: post.likes > 0 ? '500' : 'normal'
                }}>
                  {post.likes || 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </PostTable>

      {filteredPosts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--text-secondary)',
          background: 'var(--background-dark)',
          borderRadius: '8px',
          margin: '2rem 0'
        }}>
          검색 결과가 없습니다.
        </div>
      ) : (
        <>
          {isLoading && (
            <LoadingSpinner>
              로딩 중...
            </LoadingSpinner>
          )}
          {hasMore && <div ref={loadMoreRef} style={{ height: '20px' }} />}
        </>
      )}

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      )}

      {selectedUser && (
        <UserProfile
          username={selectedUser}
          onClose={() => setSelectedUser(null)}
          onPostClick={(post) => {
            setSelectedUser(null);
            handlePostClick(post);
          }}
        />
      )}
    </PostListContainer>
  );
}

export default PostList; 