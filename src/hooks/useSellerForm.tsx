import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { CreateProductInput } from '../types/Product';

export const useSellerForm = () => {
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<
    CreateProductInput & {
      shippingFee: 'include' | 'exclude';
      directTrade: boolean;
      quantity: number;
    }
  >({
    title: '',
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

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && formData.images.length + files.length <= 12) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    } else if (files && formData.images.length + files.length > 12) {
      alert('최대 12장까지 등록 가능합니다.');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleTagKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && formData.tags.length < 5) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

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
  };
};
