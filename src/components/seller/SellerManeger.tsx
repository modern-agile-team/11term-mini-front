import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useSellerForm } from '../../hooks/useSellerForm';
import { useProductUpload } from '../../hooks/useProductUpload';
import { SellerFormSection } from './SellerFormSection';
import { CATEGORIES } from '../../data/categories';
import { PRODUCT_STATUS } from '../../types/Product';
import { SellerSubNav } from './SellerNav';

const SellerManager = () => {
  const navigate = useNavigate();

  // 텍스트, 태그, 카테고리 폼 상태 관리 훅
  const {
    formData,
    setFormData,
    selectedMainId,
    setSelectedMainId,
    tagInput,
    setTagInput,
    handleInputChange,
    handleTagKeyDown,
  } = useSellerForm();

  const { images, isUploading, handleImageUpload, removeImage } = useProductUpload();
  const selectedMainCategory = CATEGORIES.find((cat) => cat.id === selectedMainId);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) return alert('상품 이미지를 최소 1장 등록해주세요.');
    if (!formData.title.trim()) return alert('상품명을 입력해주세요.');
    if (!formData.category) return alert('카테고리를 선택해주세요.');
    if (formData.price <= 0) return alert('올바른 가격을 입력해주세요.');

    try {
      const payload = { ...formData, images };

      await api.post('/products', payload);

      alert('상품이 성공적으로 등록되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-32 text-gray-800 text-sm">
      <SellerSubNav />
      <form className="max-w-[850px] mx-auto px-4 py-8" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-6 pb-3 border-b-2 border-black">상품정보</h2>

        {/* 1. 상품이미지 */}
        <SellerFormSection
          label="상품이미지"
          type="image"
          required
          count={`${images.length}/12`}
          images={images}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
          description="* 상품 이미지는 PC 1:1, 모바일 1:1.23 비율로 보여져요."
        />

        {/* 2. 상품명 */}
        <SellerFormSection
          label="상품명"
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleInputChange}
          placeholder="상품명을 입력해 주세요."
          maxLength={40}
        />

        {/* 3. 카테고리 */}
        <SellerFormSection label="카테고리" required>
          <div className="border border-gray-200 h-60 flex text-[13px] mb-3 bg-white">
            <div className="w-1/3 border-r overflow-y-auto custom-scrollbar">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-2.5 px-3 hover:bg-gray-50 cursor-pointer ${
                    selectedMainId === cat.id ? 'bg-gray-50 text-[#ff5058] font-bold' : ''
                  }`}
                  onClick={() => setSelectedMainId(cat.id)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
            <div className="w-1/3 border-r overflow-y-auto custom-scrollbar bg-gray-50/30">
              {selectedMainCategory?.subCategories?.map((sub) => (
                <div
                  key={sub.id}
                  className={`p-2.5 px-3 hover:bg-gray-50 cursor-pointer ${
                    formData.category === sub.name ? 'text-[#ff5058] font-bold bg-white' : ''
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, category: sub.name }))}
                >
                  {sub.name}
                </div>
              )) || <div className="p-10 text-center text-gray-400">대분류 선택</div>}
            </div>
            <div className="w-1/3 flex items-center justify-center text-gray-300 bg-gray-50/50 italic">
              소분류 없음
            </div>
          </div>
          <p className="text-[#ff5058] text-xs font-bold italic">
            선택한 카테고리 :{' '}
            <span className="text-gray-800 not-italic">
              {selectedMainCategory?.name} {formData.category && `> ${formData.category}`}
            </span>
          </p>
        </SellerFormSection>

        {/* 4. 상품상태 */}
        <SellerFormSection label="상품상태">
          <div className="flex flex-col gap-4">
            {PRODUCT_STATUS.map((status) => (
              <label key={status.id} className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  className="w-4 h-4 accent-[#ff5058] mt-0.5"
                  checked={formData.status === status.id}
                  onChange={() => setFormData((prev) => ({ ...prev, status: status.id }))}
                />
                <div className="-mt-0.5">
                  <div className="text-[13px] font-bold text-gray-700 group-hover:text-black">
                    {status.label}
                  </div>
                  <div className="text-[11px] text-gray-400">{status.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </SellerFormSection>

        {/* 5. 설명 & 태그 */}
        <SellerFormSection
          label="설명"
          type="textarea"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="상세 정보를 입력해 주세요."
          maxLength={2000}
        >
          <div className="mt-4">
            <div className="mb-2 text-[13px] font-bold">태그 (선택)</div>
            <div className="flex flex-wrap gap-2 border border-gray-200 p-2 min-h-[42px] bg-white">
              {formData.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-2 py-1 text-xs rounded-sm flex items-center gap-1 font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-gray-400 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="태그를 입력해 주세요 (최대 5개)"
                className="flex-1 outline-none text-xs"
              />
            </div>
          </div>
        </SellerFormSection>

        <h2 className="text-xl font-bold mt-12 mb-6 pb-3 border-b-2 border-black">가격</h2>
        <SellerFormSection
          label="가격"
          type="number"
          name="price"
          value={formData.price || ''}
          onChange={handleInputChange}
          placeholder="가격을 입력해 주세요."
          unit="원"
        >
          <label className="flex items-center gap-2 text-[13px] mt-4 cursor-pointer select-none">
            <input type="checkbox" className="w-5 h-5 accent-[#ff5058] rounded-full" />
            <span className="text-gray-700">가격제안 받기</span>
          </label>
        </SellerFormSection>

        <h2 className="text-xl font-bold mt-12 mb-6 pb-3 border-b-2 border-black">택배거래</h2>
        <SellerFormSection label="배송비">
          <div className="flex flex-col gap-4">
            <div className="flex gap-6">
              {(['include', 'exclude'] as const).map((fee) => (
                <label
                  key={fee}
                  className="flex items-center gap-2 text-[13px] cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="shippingFee"
                    checked={formData.shippingFee === fee}
                    onChange={() => setFormData((prev) => ({ ...prev, shippingFee: fee }))}
                    className="w-5 h-5 accent-[#ff5058]"
                  />
                  <span className="text-gray-700">
                    {fee === 'include' ? '배송비포함' : '배송비별도'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </SellerFormSection>

        <h2 className="text-xl font-bold mt-12 mb-6 pb-3 border-b-2 border-black">추가정보</h2>
        <SellerFormSection label="직거래">
          <div className="flex gap-6">
            {[true, false].map((isDirect) => (
              <label
                key={String(isDirect)}
                className="flex items-center gap-2 text-[13px] cursor-pointer group"
              >
                <input
                  type="radio"
                  name="directTrade"
                  checked={formData.directTrade === isDirect}
                  onChange={() => setFormData((prev) => ({ ...prev, directTrade: isDirect }))}
                  className="w-5 h-5 accent-[#ff5058]"
                />
                <span className="text-gray-700">{isDirect ? '가능' : '불가'}</span>
              </label>
            ))}
          </div>
        </SellerFormSection>

        <SellerFormSection
          label="수량"
          type="number"
          name="quantity"
          value={formData.quantity || 1}
          onChange={handleInputChange}
          unit="개"
          isLast
        />

        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-3.5 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <div className="max-w-[850px] mx-auto flex justify-end gap-3 px-4">
            <button
              type="button"
              className="px-10 py-3 text-sm font-bold bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              임시저장
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-10 py-3 text-sm font-bold text-white shadow-lg transition-all ${
                isUploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#ff5058] active:scale-95 hover:bg-[#e64951]'
              }`}
            >
              {isUploading ? '업로드 중...' : '등록하기'}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default SellerManager;
