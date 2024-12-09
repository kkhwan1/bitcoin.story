import React from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  TwitterShareButton,
  FacebookShareButton,
  TwitterIcon,
  FacebookIcon
} from 'react-share';

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
  z-index: 1100;
`;

const ModalContainer = styled.div`
  background: var(--background-light);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
`;

const CopyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  margin-top: 1rem;
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: var(--background-dark);
  color: var(--text-primary);
  border-radius: 4px;
  margin-top: 0.5rem;
`;

function ShareModal({ post, onClose }) {
  const shareUrl = `${window.location.origin}/community/post/${post.id}`;
  const title = post.title;

  const handleCopy = () => {
    alert('링크가 클립보드에 복사되었습니다.');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1rem' }}>게시글 공유하기</h3>
        
        <ShareButtons>
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          
          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </ShareButtons>

        <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
          <CopyButton>링크 복사</CopyButton>
        </CopyToClipboard>

        <CloseButton onClick={onClose}>
          닫기
        </CloseButton>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default ShareModal; 