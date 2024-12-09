import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../utils/formatters';

const CommentContainer = styled.div`
  padding: 1rem;
  background: var(--background-dark);
  border-radius: 4px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const CommentContent = styled.div`
  margin-bottom: ${props => props.isEditing ? '1rem' : '0'};
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &.primary {
    background: var(--primary-color);
    color: white;
  }
  
  &.secondary {
    background: var(--background-light);
    color: var(--text-primary);
  }
  
  &.danger {
    background: var(--danger-color);
    color: white;
  }
`;

const EditInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: var(--background-light);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

function Comment({ comment, onUpdate, onDelete, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    onUpdate({
      ...comment,
      content: editedContent,
      edited: true,
      editedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const isAuthor = comment.author === currentUser;

  return (
    <CommentContainer>
      <CommentHeader>
        <span>{comment.author}</span>
        <span>
          {formatDate(comment.timestamp)}
          {comment.edited && ` (수정됨: ${formatDate(comment.editedAt)})`}
        </span>
      </CommentHeader>

      {isEditing ? (
        <>
          <EditInput
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            autoFocus
          />
          <CommentActions>
            <Button className="primary" onClick={handleEdit}>
              저장
            </Button>
            <Button className="secondary" onClick={() => setIsEditing(false)}>
              취소
            </Button>
          </CommentActions>
        </>
      ) : (
        <>
          <CommentContent>{comment.content}</CommentContent>
          {isAuthor && (
            <CommentActions>
              <Button className="secondary" onClick={() => setIsEditing(true)}>
                수정
              </Button>
              {showDeleteConfirm ? (
                <>
                  <Button className="danger" onClick={() => onDelete(comment.id)}>
                    확인
                  </Button>
                  <Button className="secondary" onClick={() => setShowDeleteConfirm(false)}>
                    취소
                  </Button>
                </>
              ) : (
                <Button className="danger" onClick={() => setShowDeleteConfirm(true)}>
                  삭제
                </Button>
              )}
            </CommentActions>
          )}
        </>
      )}
    </CommentContainer>
  );
}

export default Comment; 