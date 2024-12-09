import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../utils/formatters';
import Comment from './Comment';
import { useBookmarks } from '../../../contexts/BookmarkContext';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import ShareModal from './ShareModal';
import { FlagIcon } from '@heroicons/react/24/outline';
import ReportModal from './ReportModal';
import { PhotoIcon } from '@heroicons/react/24/outline';

const DetailOverlay = styled.div`
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

const DetailContainer = styled.div`
  background: var(--background-light);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const PostHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const PostContent = styled.div`
  margin-bottom: 2rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const CommentSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const CommentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const DeleteModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background-light);
  padding: 2rem;
  border-radius: 8px;
  z-index: 1100;
  width: 90%;
  max-width: 400px;
  text-align: center;

  p {
    margin-bottom: 1.5rem;
    color: var(--text-secondary);
  }
`;

const PostImage = styled.div`
  margin: 1rem 0;
  
  img {
    max-width: 100%;
    border-radius: 8px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const ImageUploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  background: var(--background-dark);
  color: var(--text-primary);
  cursor: pointer;
`;

const ImagePreview = styled.div`
  position: relative;
  margin-bottom: 1rem;

  img {
    max-width: 100%;
    border-radius: 8px;
  }
`;

const ImageRemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
  }
`;

const FullImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 2rem;

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: var(--background-dark);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  min-height: 200px;
  resize: vertical;
`;

function PostDetail({ post, onClose, onUpdate, onDelete }) {
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    title: post.title,
    content: post.content,
    image: post.image
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(post.image);
  const [selectedImage, setSelectedImage] = useState(null);

  const currentUser = localStorage.getItem('currentUser');
  const isAuthor = post.author === currentUser;
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!commentText.trim() || !currentUser) return;

    const newComment = {
      id: Date.now(),
      content: commentText,
      author: currentUser,
      timestamp: new Date().toISOString()
    };

    // 로컬 스토리지에서 게시글 업데이트
    const savedPosts = JSON.parse(localStorage.getItem('community_posts'));
    const updatedPosts = savedPosts.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    });

    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
    onUpdate(updatedPosts.find(p => p.id === post.id));
    
    setCommentText('');
  };

  const handleLike = () => {
    const savedPosts = JSON.parse(localStorage.getItem('community_posts'));
    const updatedPosts = savedPosts.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          likes: (p.likes || 0) + 1
        };
      }
      return p;
    });

    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
    onUpdate(updatedPosts.find(p => p.id === post.id));
  };

  const handleEdit = () => {
    // 게시글 수정 로직
  };

  const handleDelete = () => {
    // 로컬 스토리지에서 삭제
    const savedPosts = JSON.parse(localStorage.getItem('community_posts'));
    const filteredPosts = savedPosts.filter(p => p.id !== post.id);
    localStorage.setItem('community_posts', JSON.stringify(filteredPosts));

    onDelete(post.id);
    onClose();
  };

  const handleCommentUpdate = (updatedComment) => {
    const updatedPost = {
      ...post,
      comments: post.comments.map(comment =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    };

    // 로컬 스토리지 업데이트
    const savedPosts = JSON.parse(localStorage.getItem('community_posts'));
    const updatedPosts = savedPosts.map(p => 
      p.id === post.id ? updatedPost : p
    );
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));

    onUpdate(updatedPost);
  };

  const handleCommentDelete = (commentId) => {
    const updatedPost = {
      ...post,
      comments: post.comments.filter(comment => comment.id !== commentId)
    };

    // 로컬 스토리지 업데이트
    const savedPosts = JSON.parse(localStorage.getItem('community_posts'));
    const updatedPosts = savedPosts.map(p => 
      p.id === post.id ? updatedPost : p
    );
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));

    onUpdate(updatedPost);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 이미지 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('이미지 크기는 10MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DetailOverlay onClick={onClose}>
      <DetailContainer onClick={e => e.stopPropagation()}>
        {!isEditing ? (
          <>
            <PostHeader>
              <PostTitle>{post.title}</PostTitle>
              <PostInfo>
                <span>작성자: {post.author}</span>
                <span>{formatDate(post.timestamp)}</span>
                {post.edited && (
                  <span>(수정됨: {formatDate(post.editedAt)})</span>
                )}
              </PostInfo>
            </PostHeader>

            <PostContent>{post.content}</PostContent>
            
            {post.images?.length > 0 && (
              <ImageGrid>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`게시글 이미 ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </ImageGrid>
            )}

            <ActionButtons>
              <Button onClick={handleLike} className="secondary">
                👍 추천 {post.likes || 0}
              </Button>
              <Button 
                onClick={() => toggleBookmark(post)} 
                className="secondary"
              >
                {isBookmarked(post.id) ? (
                  <BookmarkSolid className="w-5 h-5" />
                ) : (
                  <BookmarkOutline className="w-5 h-5" />
                )}
                북마크
              </Button>
              <Button 
                onClick={() => setShowShareModal(true)} 
                className="secondary"
              >
                <ShareIcon className="w-5 h-5" />
                공유
              </Button>
              {isAuthor && (
                <>
                  <Button onClick={() => setIsEditing(true)} className="secondary">
                    수정
                  </Button>
                  <Button 
                    onClick={() => setShowDeleteModal(true)} 
                    className="danger"
                  >
                    삭제
                  </Button>
                </>
              )}
              {!isAuthor && (
                <Button 
                  onClick={() => setShowReportModal(true)} 
                  className="secondary"
                >
                  <FlagIcon className="w-5 h-5" />
                  신고
                </Button>
              )}
            </ActionButtons>
          </>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleEdit(); }}>
            <FormGroup>
              <label>제목</label>
              <Input
                type="text"
                value={editData.title}
                onChange={e => setEditData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <label>내용</label>
              <TextArea
                value={editData.content}
                onChange={e => setEditData(prev => ({
                  ...prev,
                  content: e.target.value
                }))}
                required
              />
            </FormGroup>

            <ActionButtons>
              <Button type="submit" className="primary">
                저���
              </Button>
              <Button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="secondary"
              >
                취소
              </Button>
            </ActionButtons>
          </form>
        )}

        <CommentSection>
          <h3>댓글 {post.comments?.length || 0}개</h3>
          
          {currentUser ? (
            <CommentForm onSubmit={handleSubmitComment}>
              <CommentInput
                type="text"
                placeholder="댓글을 입력하세요"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                required
              />
              <Button type="submit" className="primary">
                작성
              </Button>
            </CommentForm>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem',
              color: 'var(--text-secondary)',
              background: 'var(--background-dark)',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              댓글을 작성하려면 닉네임을 입력하세요.
            </div>
          )}

          <CommentList>
            {post.comments?.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
                currentUser={currentUser}
              />
            ))}
          </CommentList>
        </CommentSection>
      </DetailContainer>

      {selectedImage && (
        <FullImageModal onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="전체 크기 이미지" />
        </FullImageModal>
      )}

      {showShareModal && (
        <ShareModal 
          post={post} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
      {showDeleteModal && (
        <DeleteModal>
          <p>정말로 이 게시글을 삭제하시겠습니까?</p>
          <ActionButtons>
            <Button onClick={handleDelete} className="danger">
              삭제
            </Button>
            <Button 
              onClick={() => setShowDeleteModal(false)}
              className="secondary"
            >
              취소
            </Button>
          </ActionButtons>
        </DeleteModal>
      )}
      {showReportModal && (
        <ReportModal 
          post={post} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </DetailOverlay>
  );
}

export default PostDetail; 