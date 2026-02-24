import { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { CreateProductInput, Product } from '../types/Product';

export const useSellerForm = (initialData?: Product | null) => {
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>('');

  const [formData, setFormData] = useState<
    CreateProductInput & {
      shippingFee: 'include' | 'exclude';
      directTrade: boolean;
      quantity: number;
    }
  >({
    title: '',
    sellerId: '',
    price: 0,
    location: '전국',
    image: '',
    images: [],
    category: '',
    description: '',
    status: 'NEW',
    isThunderPay: false,
    tags: [],
    shippingFee: 'include',
    directTrade: false,
    quantity: 1,
  });

  // ✅ 초기 데이터 주입 로직 (useEffect 경고 방지)
  useEffect(() => {
    if (!initialData) return;

    setFormData((prev) => ({
      ...prev,
      title: initialData.title || '',
      price: initialData.price || 0,
      location: initialData.location || '전국',
      image: initialData.image || '',
      // Product에는 단일 image만 있으므로 배열로 변환해서 처리
      images: initialData.image ? [initialData.image] : [],
      category: initialData.category || '',
      description: initialData.description || '',
      status: initialData.status || 'NEW',
      isThunderPay: initialData.isThunderPay || false,
      tags: initialData.tags || [],
    }));
  }, [initialData]); // initialData가 변경될 때만 실행됨

  const handleImageUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;

      const totalCount = formData.images.length + selectedFiles.length;
      if (totalCount <= 12) {
        const newImageUrls = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImageUrls],
        }));
      } else {
        alert('최대 12장까지 등록 가능합니다.');
      }
    },
    [formData.images.length],
  );

  const removeImage = useCallback((index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const val = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
      setFormData((prev) => ({ ...prev, [name]: val }));
    },
    [],
  );

  const handleTagKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim() && formData.tags.length < 5) {
        e.preventDefault();
        if (!formData.tags.includes(tagInput.trim())) {
          setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
        }
        setTagInput('');
      }
    },
    [tagInput, formData.tags],
  );

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  }, []);

  return {
    formData,
    setFormData,
    selectedMainId,
    setSelectedMainId,
    tagInput,
    setTagInput,
    handleImageUpload,
    removeImage,
    handleInputChange,
    handleTagKeyDown,
    removeTag,
  };
};
