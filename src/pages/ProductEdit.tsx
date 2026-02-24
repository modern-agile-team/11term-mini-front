import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useSellerForm } from '../hooks/useSellerForm';
import { Camera, X } from 'lucide-react';
import type { Product } from '../types/Product';

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoaded = useRef(false);

  // 폼 훅 (초기값 없이 시작 후 useEffect에서 채움)
  const {
    formData,
    setFormData,
    tagInput,
    setTagInput,
    handleInputChange,
    handleImageUpload,
    removeImage,
    handleTagKeyDown,
    removeTag,
  } = useSellerForm();

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    if (isLoaded.current) return;
    const fetchOriginal = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        const p = res.data as Product;
        setFormData({
          title: p.title,
          price: p.price,
          location: p.location,
          image: p.image,
          images: p.tags.length > 0 ? [p.image] : [p.image],
          category: p.category,
          description: p.description,
          status: p.status,
          isThunderPay: p.isThunderPay || false,
          tags: p.tags,
        });
        isLoaded.current = true;
      } catch (e) {
        alert('상품 정보를 불러올 수 없습니다.');
        navigate(-1);
      }
    };
    fetchOriginal();
  }, [id, navigate, setFormData]);

  // 2. 수정 제출
  const handleUpdate = async () => {
    try {
      await api.patch(`/api/products/${id}`, formData);
      alert('수정이 완료되었습니다.');
      navigate(`/product/${id}`);
    } catch (e) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  if (!isLoaded.current) return <div className="py-20 text-center">불러오는 중...</div>;

  return (
    <div className="max-w-[1024px] mx-auto py-10 px-4 bg-white">
      <h1 className="text-2xl font-bold border-b-2 border-black pb-4 mb-8">상품 수정</h1>
      <div className="space-y-10">
        <section className="flex gap-4">
          <label className="w-24 text-sm font-semibold">상품명</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="flex-1 border p-3 text-sm outline-none focus:border-black"
          />
        </section>

        <section className="flex gap-4">
          <label className="w-24 text-sm font-semibold">가격</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="border p-3 text-sm w-48 outline-none focus:border-black"
            />
            <span>원</span>
          </div>
        </section>

        <section className="flex gap-4">
          <label className="w-24 text-sm font-semibold">설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="flex-1 border p-3 text-sm h-40 resize-none outline-none focus:border-black"
          />
        </section>
      </div>

      <div className="flex justify-end gap-4 mt-12 pt-8 border-t">
        <button onClick={() => navigate(-1)} className="px-10 py-4 bg-gray-100 font-bold">
          취소
        </button>
        <button onClick={handleUpdate} className="px-10 py-4 bg-[#ff5058] text-white font-bold">
          수정완료
        </button>
      </div>
    </div>
  );
};

export default ProductEdit;
