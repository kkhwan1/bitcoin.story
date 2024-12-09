import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../../../components/search/SearchBar';

const HeaderWrapper = styled.header`
  background-color: var(--background-dark);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: var(--text-primary);
    font-weight: 500;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const NavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

function Header() {
  return (
    <HeaderWrapper>
      <Nav>
        <Logo to="/">CryptoInfo</Logo>
        <NavCenter>
          <SearchBar />
          <NavLinks>
            <Link to="/">시세</Link>
            <Link to="/chart">차트</Link>
            <Link to="/news">뉴스</Link>
            <Link to="/community">커뮤니티</Link>
          </NavLinks>
        </NavCenter>
      </Nav>
    </HeaderWrapper>
  );
}

export default Header; 