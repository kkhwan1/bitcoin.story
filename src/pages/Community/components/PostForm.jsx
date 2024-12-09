import React, { useState } from 'react';
import styled from 'styled-components';
import { PhotoIcon } from '@heroicons/react/24/outline';
import ImageUploader from './ImageUploader';

const FormOverlay = styled.div`
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

const FormContainer = styled.div`
  background: var(--background-light);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  min-height: 200px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  
  &.primary {
    background: var(--primary-color);
    color: white;
  }
  
  &.secondary {
    background: var(--background-dark);
    color: var(--text-primary);
  }
`;

function PostForm({ onClose, selectedCoin }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: localStorage.getItem('currentUser') || '',
    images: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      id: Date.now(),
      ...formData,
      coinSymbol: selectedCoin,
      timestamp: new Date().toISOString(),
      likes: 0,
      views: 0,
      comments: []
    };

    // 로컬 스토리지에서 기존 게시글 가져오기
    const savedPosts = localStorage.getItem('community_posts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];
    
    // 새 게시글 추가
    posts.unshift(newPost);
    localStorage.setItem('community_posts', JSON.stringify(posts));
    
    onClose();
  };

  return (
    <FormOverlay onClick={onClose}>
      <FormContainer onClick={e => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>제목</label>
            <Input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label>작성자</label>
            <Input
              type="text"
              value={formData.author}
              disabled
            />
          </FormGroup>
          
          <FormGroup>
            <label>내용</label>
            <TextArea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <ImageUploader
              images={formData.images}
              onChange={(newImages) => 
                setFormData(prev => ({ ...prev, images: newImages }))
              }
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="primary">
              작성
            </Button>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </FormOverlay>
  );
}

export default PostForm; 