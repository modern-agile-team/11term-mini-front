import { useState, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { CreateProductInput, Product } from '../types/Product';

export const useSellerForm = (initialData?: Product | null) => {
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<CreateProductInput>(() => {
    if (initialData) {
      return {
        title: initialData.title || '',
        price: initialData.price || 0,
        location: initialData.location || '전국',
        description: initialData.description || '',
        category: initialData.category || '',
        status: initialData.status || 'NEW',
        tags: initialData.tags || [],
        images: initialData.images || (initialData.image ? [initialData.image] : []),
      };
    }
    return {
      title: '',
      price: 0,
      location: '전국',
      description: '',
      category: '',
      status: 'NEW',
      tags: [],
      images: [],
    };
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const val = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
      setFormData((prev) => ({ ...prev, [name]: val }));
    },
    [],
  );

  const handleTagKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();

      const trimmedInput = tagInput.trim();
      if (!trimmedInput) return;
      if (formData.tags.length >= 5) {
        alert('태그는 최대 5개까지 가능합니다.');
        return;
      }
      if (formData.tags.includes(trimmedInput)) {
        setTagInput('');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedInput],
      }));
      setTagInput('');
    },
    [tagInput, formData.tags],
  );

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  }, []);

  return {
    formData,
    setFormData,
    handleInputChange,
    selectedMainId,
    setSelectedMainId,
    tagInput,
    setTagInput,
    handleTagKeyDown,
    removeTag,
  };
};
