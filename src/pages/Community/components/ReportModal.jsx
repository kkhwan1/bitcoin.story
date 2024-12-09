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
  z-index: 1100;
`;

const ModalContainer = styled.div`
  background: var(--background-light);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const ReportForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReportOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--background-dark);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: var(--background-light);
  }

  input {
    cursor: pointer;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  min-height: 100px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  
  &.primary {
    background: var(--danger-color);
    color: white;
  }
  
  &.secondary {
    background: var(--background-dark);
    color: var(--text-primary);
  }
`;

const reportReasons = [
  '스팸 또는 광고성 게시물',
  '욕설 또는 혐오 발언',
  '허위 정보 유포',
  '개인정보 노출',
  '기타'
];

function ReportModal({ post, onClose }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 신고 데이터 저장
    const reportData = {
      id: Date.now(),
      postId: post.id,
      postTitle: post.title,
      author: post.author,
      reason,
      details,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // 로컬 스토리지에 신고 내역 저장
    const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    savedReports.push(reportData);
    localStorage.setItem('reports', JSON.stringify(savedReports));

    alert('신고가 접수되었습니다.');
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1rem' }}>게시글 신고하기</h3>
        
        <ReportForm onSubmit={handleSubmit}>
          {reportReasons.map((reportReason) => (
            <ReportOption key={reportReason}>
              <input
                type="radio"
                name="reason"
                value={reportReason}
                checked={reason === reportReason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              {reportReason}
            </ReportOption>
          ))}

          <TextArea
            placeholder="추가 설명을 입력해주세요..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />

          <ButtonGroup>
            <Button type="submit" className="primary">
              신고하기
            </Button>
            <Button type="button" className="secondary" onClick={onClose}>
              취소
            </Button>
          </ButtonGroup>
        </ReportForm>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default ReportModal; 