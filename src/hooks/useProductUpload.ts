import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { CreateProductInput } from '../types/Product';

interface UploadResponse {
  urls?: string[];
  imageUrl?: string;
}

export const useProductUpload = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    try {
      setIsUploading(true);
      const response = await api.post<UploadResponse>('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newUrls =
        response.data.urls || (response.data.imageUrl ? [response.data.imageUrl] : []);
      setImages((prev) => [...prev, ...newUrls]);
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitProduct = async (formData: Omit<CreateProductInput, 'images'>) => {
    if (images.length === 0) return alert('이미지를 최소 1장 등록해주세요.');

    try {
      const payload: CreateProductInput = { ...formData, images };
      const response = await api.post('/products', payload);

      if (response.status === 201 || response.status === 200) {
        alert('상품이 등록되었습니다.');
        navigate('/');
      }
    } catch (error) {
      console.error('상품 등록 오류:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return { images, setImages, isUploading, handleImageUpload, removeImage, submitProduct };
};
