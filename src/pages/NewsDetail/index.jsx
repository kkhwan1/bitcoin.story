import React from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';

const NewsDetailContainer = styled.article`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const NewsHeader = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
`;

const Content = styled.div`
  line-height: 1.8;
  color: var(--text-primary);
  
  img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
  }

  a {
    color: var(--primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NewsDetail = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');

  React.useEffect(() => {
    if (url) {
      window.location.href = decodeURIComponent(url);
    }
  }, [url]);

  return (
    <NewsDetailContainer>
      <div>원본 페이지로 이동중입니다...</div>
    </NewsDetailContainer>
  );
};

export default NewsDetail; 