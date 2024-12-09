import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const NewsContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
`;

const RefreshButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--primary-dark);
  }

  &:disabled {
    background: var(--background-light);
    cursor: not-allowed;
  }
`;

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-light);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
  }
`;

const NewsItem = styled.article`
  padding: 1rem;
  background: var(--background-light);
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  transition: transform 0.2s;

  &:hover {
    transform: translateX(4px);
  }
`;

const NewsTitle = styled.h3`
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: var(--primary);
    }
  }
`;

const NewsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const NewsSource = styled.span`
  background: var(--background-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const NewsTime = styled.time`
  font-style: italic;
`;

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const fetchNews = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('http://localhost:5001/api/news', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setNews(data);
        setError(null);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error('News fetch error:', err);
      setNews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5분마다 갱신
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <NewsContainer>
      <NewsHeader>
        <Title>암호화폐 뉴스</Title>
        <RefreshButton 
          onClick={fetchNews} 
          disabled={refreshing}
        >
          {refreshing ? '새로고침 중...' : '새로고침'}
        </RefreshButton>
      </NewsHeader>
      {loading ? (
        <div>뉴스를 불러오는 중...</div>
      ) : news.length > 0 ? (
        <NewsList>
          {news.map((item) => (
            <NewsItem key={item.id}>
              <NewsTitle>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </NewsTitle>
              <NewsInfo>
                <NewsSource>{item.source}</NewsSource>
                <NewsTime>
                  {formatDate(item.publishedAt)}
                </NewsTime>
              </NewsInfo>
            </NewsItem>
          ))}
        </NewsList>
      ) : (
        <div>표시할 뉴스가 없습니다.</div>
      )}
    </NewsContainer>
  );
}

export default NewsFeed; 