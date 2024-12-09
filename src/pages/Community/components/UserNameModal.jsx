import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: var(--background-light);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  font-weight: 500;
`;

function UserNameModal({ onSubmit }) {
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('currentUser', userName.trim());
      onSubmit(userName.trim());
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <h2 style={{ marginBottom: '1rem' }}>닉네임을 입력하세요</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="닉네임"
            required
            autoFocus
          />
          <Button type="submit">확인</Button>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default UserNameModal; 