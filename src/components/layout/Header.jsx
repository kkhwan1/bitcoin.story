import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background: var(--background-secondary);
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
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
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-family: 'Pretendard', sans-serif;

  &:hover {
    color: var(--primary-light);
  }

  .dot {
    color: var(--primary);
  }

  span {
    color: var(--text-primary);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;

  &:hover {
    color: var(--primary);
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          Sion<span className="dot">.</span><span>Node</span>
        </Logo>
        <Nav>
          <NavLink to="/">홈</NavLink>
          <NavLink to="/market">시장</NavLink>
          <NavLink to="/news">뉴스</NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header; 