import React from 'react';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  padding: 1rem;
  background: var(--danger-light);
  border: 1px solid var(--danger);
  border-radius: 8px;
  color: var(--danger);
  text-align: center;
  margin: 1rem 0;
`;

const RetryButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--danger);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: var(--danger-dark);
  }
`;

function ErrorMessage({ error, onRetry }) {
  return (
    <ErrorWrapper>
      <p>{error.message || '데이터를 불러오는데 실패했습니다.'}</p>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          다시 시도
        </RetryButton>
      )}
    </ErrorWrapper>
  );
}

export default ErrorMessage; 