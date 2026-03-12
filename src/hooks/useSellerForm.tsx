import { useState, useCallback, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CreateProductInput, Product } from '../types/Product';
import { findCategoryPathById } from '../utils/productCategory';

export type SellerFormData = CreateProductInput & {
  shippingFee: 'include' | 'exclude';
  directTrade: boolean;
  quantity: number;
};

interface UseSellerFormResult {
  formData: SellerFormData;
  setFormData: Dispatch<SetStateAction<SellerFormData>>;
  selectedMainId: string | null;
  setSelectedMainId: Dispatch<SetStateAction<string | null>>;
  selectedSubId: string | null;
  setSelectedSubId: Dispatch<SetStateAction<string | null>>;
  tagInput: string;
  setTagInput: Dispatch<SetStateAction<string>>;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTagKeyDown: (e: KeyboardEvent) => void;
  removeTag: (tagToRemove: string) => void;
}

const DEFAULT_FORM_DATA: SellerFormData = {
  title: '',
  sellerId: '',
  price: 0,
  location: '전국',
  image: '',
  images: [],
  category: '',
  categoryId: '',
  description: '',
  status: 'NEW',
  isThunderPay: false,
  tags: [],
  shippingFee: 'include',
  directTrade: false,
  quantity: 1,
};

const transformProductToForm = (data: Product): SellerFormData => ({
  title: data.title || '',
  sellerId: data.sellerId || '',
  price: data.price || 0,
  location: data.location || '전국',
  image: data.image || '',
  images: data.image ? [data.image] : [],
  category: data.category || '',
  categoryId: data.categoryId || '',
  description: data.description || '',
  status: data.status || 'NEW',
  isThunderPay: data.isThunderPay || false,
  tags: data.tags || [],
  shippingFee: 'include' as const,
  directTrade: false,
  quantity: 1,
});

export const useSellerForm = (initialData?: Product | null): UseSellerFormResult => {
  const initialCategoryPath = initialData?.categoryId
    ? findCategoryPathById(initialData.categoryId)
    : [];

  const [selectedMainId, setSelectedMainId] = useState<string | null>(initialCategoryPath[0]?.id ?? null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(initialCategoryPath[1]?.id ?? null);
  const [tagInput, setTagInput] = useState<string>('');
  const [formData, setFormData] = useState<SellerFormData>(() => {
    if (initialData) return transformProductToForm(initialData);
    return DEFAULT_FORM_DATA;
  });

  useEffect(() => {
    if (!initialData) return;

    const categoryPath = initialData.categoryId ? findCategoryPathById(initialData.categoryId) : [];
    setSelectedMainId(categoryPath[0]?.id ?? null);
    setSelectedSubId(categoryPath[1]?.id ?? null);
    setFormData(transformProductToForm(initialData));
  }, [initialData]);

  const handleImageUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;

      const newImagesCount = selectedFiles.length;
      const totalCount = formData.images.length + newImagesCount;

      if (totalCount > 12) {
        alert('최대 12장까지 등록 가능합니다.');
        return;
      }

      const newImageUrls = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }));
    },
    [formData.images.length],
  );

  const removeImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      const isNumberType = type === 'number';
      const val = isNumberType ? (value === '' ? 0 : Number(value)) : value;

      setFormData((prev) => ({ ...prev, [name]: val }));
    },
    [],
  );

  const handleTagKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
    selectedMainId,
    setSelectedMainId,
    selectedSubId,
    setSelectedSubId,
    tagInput,
    setTagInput,
    handleImageUpload,
    removeImage,
    handleInputChange,
    handleTagKeyDown,
    removeTag,
  };
};
