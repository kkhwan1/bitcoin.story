import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';

const UploadContainer = styled.div`
  margin-bottom: 1rem;
`;

const DropZone = styled.div`
  border: 2px dashed var(--border-color);
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragging ? 'var(--background-light)' : 'var(--background-dark)'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--background-light);
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  padding: 0.25rem;
  line-height: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const CropModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 2rem;
`;

const CropButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const CropButton = styled.button`
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

function ImageUploader({ images, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 16 / 9 });
  const [imageRef, setImageRef] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = [...e.dataTransfer.files].filter(file => file.type.startsWith('image/'));
    handleFiles(files);
  }, []);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('이미지 압축 실패:', error);
      return file;
    }
  };

  const handleFiles = async (files) => {
    if (images.length + files.length > 4) {
      alert('이미지는 최대 4장까지 업로드할 수 있습니다.');
      return;
    }

    const newImages = [];
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert('각 이미지는 10MB 이하여야 합니다.');
        continue;
      }

      try {
        // 이미지 압축 처리
        const compressedFile = await compressImage(file);
        
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = () => {
            newImages.push(reader.result);
            resolve();
          };
          reader.readAsDataURL(compressedFile);
        });
      } catch (error) {
        console.error('이미지 처리 실패:', error);
      }
    }

    onChange([...images, ...newImages].slice(0, 4));
  };

  const handleCrop = () => {
    if (!imageRef || !crop.width || !crop.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const croppedImage = canvas.toDataURL('image/jpeg');
    onChange(images.map(img => img === cropImage ? croppedImage : img));
    setCropImage(null);
  };

  return (
    <UploadContainer>
      <input
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        onChange={(e) => handleFiles([...e.target.files])}
        style={{ display: 'none' }}
      />
      
      <DropZone
        isDragging={isDragging}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => images.length >= 4 ? alert('이미지는 최대 4장까지 업로드할 수 있습니다.') : document.getElementById('image-upload').click()}
      >
        <PhotoIcon className="w-8 h-8 mx-auto mb-2" />
        <p>클릭하거나 이미지를 드래그하여 업로드</p>
        <p className="text-sm text-secondary">최대 4장, 각 10MB 이하</p>
        {images.length > 0 && (
          <p className="text-sm text-primary">{images.length}/4장 업로드됨</p>
        )}
      </DropZone>

      {images.length > 0 && (
        <ImageGrid>
          {images.map((image, index) => (
            <ImagePreview key={index}>
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                onClick={() => setCropImage(image)}
              />
              <RemoveButton
                onClick={() => onChange(images.filter((_, i) => i !== index))}
              >
                <XMarkIcon className="w-4 h-4" />
              </RemoveButton>
            </ImagePreview>
          ))}
        </ImageGrid>
      )}

      {cropImage && (
        <CropModal onClick={() => setCropImage(null)}>
          <div onClick={e => e.stopPropagation()}>
            <ReactCrop
              src={cropImage}
              onImageLoaded={setImageRef}
              crop={crop}
              onChange={setCrop}
              keepSelection
            />
            <CropButtons>
              <CropButton className="primary" onClick={handleCrop}>
                적용
              </CropButton>
              <CropButton className="secondary" onClick={() => setCropImage(null)}>
                취소
              </CropButton>
            </CropButtons>
          </div>
        </CropModal>
      )}
    </UploadContainer>
  );
}

export default ImageUploader; 