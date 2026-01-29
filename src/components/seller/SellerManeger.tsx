import { useSellerForm } from '../../hooks/useSellerForm';
import { SellerFormSection } from './SellerFormSection';
import { CATEGORIES } from '../../data/categories';
import { PRODUCT_STATUS } from '../../types/Product';
import { SellerSubNav } from './SellerNav';

const INPUT_STYLE =
  'w-full border border-gray-200 p-2.5 text-sm outline-none hover:border-gray-400 focus:border-black transition-all rounded-sm';

const SellerManager = () => {
  const {
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
  } = useSellerForm();

  const selectedMainCategory = CATEGORIES.find((cat) => cat.id === selectedMainId);

  return (
    <div className="bg-white min-h-screen pb-32 text-gray-800 text-sm">
      <SellerSubNav />

      <form className="max-w-[850px] mx-auto px-4 py-8" onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-xl font-bold mb-6 pb-3 border-b-2 border-black">상품정보</h2>

        {/* 1. 이미지 섹션 */}
        <SellerFormSection label="상품이미지" count={`${formData.images.length}/12`}>
          <div className="flex flex-wrap gap-3">
            <label className="w-32 h-32 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-2xl mb-1">📷</span>
              <span className="text-gray-400 text-xs">이미지 등록</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {formData.images.map((src, i) => (
              <div key={i} className="relative w-32 h-32 border border-gray-100 bg-black">
                <img src={src} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full text-xs flex items-center justify-center border border-white"
                >
                  ×
                </button>
                {i === 0 && (
                  <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-0.5">
                    대표이미지
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-blue-500 text-[11px] mt-4 font-medium">
            * 상품 이미지는 PC 1:1, 모바일 1:1.23 비율로 보여져요.
          </p>
        </SellerFormSection>

        {/* 2. 상품명 */}
        <SellerFormSection label="상품명">
          <div className="relative">
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="상품명을 입력해 주세요."
              className={INPUT_STYLE}
              maxLength={40}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              {formData.title.length}/40
            </span>
          </div>
        </SellerFormSection>

        {/* 3. 카테고리 */}
        <SellerFormSection label="카테고리">
          <div className="border border-gray-200 h-60 flex text-[13px] mb-3 bg-white">
            <div className="w-1/3 border-r overflow-y-auto custom-scrollbar">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-2.5 px-3 hover:bg-gray-50 cursor-pointer ${selectedMainId === cat.id ? 'bg-gray-50 text-[#ff5058] font-bold' : ''}`}
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
                  className={`p-2.5 px-3 hover:bg-gray-50 cursor-pointer ${formData.category === sub.name ? 'text-[#ff5058] font-bold bg-white' : ''}`}
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
                  onChange={() => setFormData({ ...formData, status: status.id })}
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
        <SellerFormSection label="설명">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="상세 정보를 입력해 주세요."
            className={`${INPUT_STYLE} h-32 text-[13px] mb-4 resize-none leading-relaxed`}
            maxLength={2000}
          />
          <div className="mb-2 text-[13px] font-bold">태그 (선택)</div>
          <div className="flex flex-wrap gap-2 border border-gray-200 p-2 min-h-[42px] bg-white">
            {formData.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 px-2 py-1 text-xs rounded-sm flex items-center gap-1 font-medium"
              >
                #{tag}{' '}
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
        </SellerFormSection>

        {/* --- 가격 섹션 --- */}
        <h2 className="text-xl font-bold mt-12 mb-6 pb-3 border-b-2 border-black">가격</h2>
        <SellerFormSection label="가격">
          <div className="flex flex-col gap-4">
            <div className="relative w-72">
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                placeholder="가격을 입력해 주세요."
                className={INPUT_STYLE}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                원
              </span>
            </div>
            <label className="flex items-center gap-2 text-[13px] cursor-pointer select-none">
              <input type="checkbox" className="w-5 h-5 accent-[#ff5058] rounded-full" />
              <span className="text-gray-700">가격제안 받기</span>
            </label>
          </div>
        </SellerFormSection>

        {/* --- 택배거래 섹션 --- */}
        <h2 className="text-xl font-bold mt-12 mb-6 pb-3 border-b-2 border-black">택배거래</h2>
        <SellerFormSection label="배송비">
          <div className="flex flex-col gap-4">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-[13px] cursor-pointer group">
                <input
                  type="radio"
                  name="shippingFee"
                  checked={formData.shippingFee === 'include'}
                  onChange={() => setFormData({ ...formData, shippingFee: 'include' })}
                  className="w-5 h-5 accent-[#ff5058]"
                />
                <span className="text-gray-700">배송비포함</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] cursor-pointer group">
                <input
                  type="radio"
                  name="shippingFee"
                  checked={formData.shippingFee === 'exclude'}
                  onChange={() => setFormData({ ...formData, shippingFee: 'exclude' })}
                  className="w-5 h-5 accent-[#ff5058]"
                />
                <span className="text-gray-700">배송비별도</span>
              </label>
            </div>
            <label className="flex items-center gap-2 text-[13px] text-gray-400 cursor-not-allowed select-none">
              <div className="w-5 h-5 border border-gray-200 rounded-full flex items-center justify-center bg-gray-50">
                <span className="text-[10px]">✓</span>
              </div>
              <span>다음 등록시에도 사용</span>
            </label>
          </div>
        </SellerFormSection>

        {/* --- 추가정보 섹션 --- */}
        <h2 className="text-xl font-bold mt-12 mb-6 pb-3 border-b-2 border-black">추가정보</h2>
        <SellerFormSection label="직거래">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer group">
              <input
                type="radio"
                name="directTrade"
                checked={formData.directTrade}
                onChange={() => setFormData({ ...formData, directTrade: true })}
                className="w-5 h-5 accent-[#ff5058]"
              />
              <span className="text-gray-700">가능</span>
            </label>
            <label className="flex items-center gap-2 text-[13px] cursor-pointer group">
              <input
                type="radio"
                name="directTrade"
                checked={!formData.directTrade}
                onChange={() => setFormData({ ...formData, directTrade: false })}
                className="w-5 h-5 accent-[#ff5058]"
              />
              <span className="text-gray-700">불가</span>
            </label>
          </div>
        </SellerFormSection>

        <SellerFormSection label="수량" isLast>
          <div className="relative w-72">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`${INPUT_STYLE} pl-4`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              개
            </span>
          </div>
        </SellerFormSection>

        {/* 하단 푸터 */}
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
              className="px-10 py-3 text-sm font-bold bg-[#ff5058] text-white shadow-lg active:scale-95 transition-all hover:bg-[#e64951]"
            >
              등록하기
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default SellerManager;
