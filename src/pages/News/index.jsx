import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NewsContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--text-primary);
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const NewsCard = styled.a`
  display: block;
  background: var(--background-secondary);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s;
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateY(-4px);
  }
`;

const NewsContent = styled.div`
  padding: 1.5rem;
`;

const NewsTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-tertiary);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-top: auto;
`;

const RefreshButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background-light);
  color: var(--text-primary);
  margin-right: 1rem;
  width: 200px;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNews = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/news');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch news');
      }
      const data = await response.json();
      setNews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 120000); // 2분마다 갱신
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <NewsContainer>
      <Header>
        <Title>암호화폐 뉴스</Title>
        <div>
          <SearchInput
            type="text"
            placeholder="뉴스 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <RefreshButton onClick={fetchNews} disabled={refreshing}>
            {refreshing ? '새로고침 중...' : '새로고침'}
          </RefreshButton>
        </div>
      </Header>
      <NewsGrid>
        {filteredNews.map((item) => (
          <NewsCard key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
            <NewsContent>
              <NewsTitle>{item.title}</NewsTitle>
              <NewsSummary>{item.summary}</NewsSummary>
              <NewsInfo>
                <span>{item.source}</span>
                <span>{item.date}</span>
              </NewsInfo>
            </NewsContent>
          </NewsCard>
        ))}
      </NewsGrid>
    </NewsContainer>
  );
}

export default News; 