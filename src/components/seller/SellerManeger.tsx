import React, { useState } from 'react';
import type { CreateProductInput } from '../../types/Product';
import { CATEGORIES } from '../../data/categories';
import { SELLER_NAV_MENU } from '../../constants/seller';
import { PRODUCT_STATUS } from '../../types/Product';

// 스타일 상수화로 JSX 가독성 향상
const STYLES = {
  container: 'max-w-[1024px] mx-auto px-4 py-10',
  section: 'flex border-b pb-10 mb-10',
  label: 'w-1/4 text-lg font-bold pt-2',
  input: 'w-full border border-gray-200 p-3 outline-none focus:border-black transition-all',
  categoryBox: 'border border-gray-200 h-72 flex text-sm mb-4 bg-white',
  categoryList: 'w-1/3 border-r overflow-y-auto custom-scrollbar',
  categoryItem: 'p-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors',
  activeItem: 'bg-gray-50 text-[#ff5058] font-bold',
  footer:
    'fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]',
  submitBtn: 'px-14 py-4 font-bold transition-all active:scale-95',
};

const SellerManager = () => {
  // 1. 상태 관리
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProductInput>({
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
  });

  // 2. 핸들러 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleMainCategoryClick = (id: string) => {
    setSelectedMainId(id);
    setFormData((prev) => ({ ...prev, category: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || formData.price <= 0) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }
    console.log('최종 등록 데이터:', formData);
    alert('상품 등록이 완료되었습니다!');
  };

  const selectedMainCategory = CATEGORIES.find((cat) => cat.id === selectedMainId);

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* 서브 네비게이션 */}
      <nav className="border-b sticky top-0 bg-white z-40">
        <div className="max-w-[1024px] mx-auto flex gap-10 py-4 text-sm font-semibold px-4">
          {SELLER_NAV_MENU.map((menu) => (
            <span
              key={menu.id}
              className={`${menu.active ? 'text-[#ff5058] border-b-2 border-[#ff5058]' : 'text-gray-400'} pb-4 -mb-4 cursor-pointer`}
            >
              {menu.label}
            </span>
          ))}
        </div>
      </nav>

      <form onSubmit={handleSubmit} className={STYLES.container}>
        <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-black">상품정보</h2>

        {/* 1. 이미지 섹션 */}
        <section className={STYLES.section}>
          <label className={STYLES.label}>
            상품이미지{' '}
            <span className="text-gray-400 text-sm font-normal">({formData.images.length}/12)</span>
          </label>
          <div className="w-3/4">
            <div className="w-40 h-40 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 group transition-colors">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📷</span>
              <span className="text-gray-400 text-sm">이미지 등록</span>
            </div>
            <p className="text-blue-500 text-xs mt-4 font-medium">
              * 상품 이미지는 PC 1:1, 모바일 1:1.23 비율로 보여져요.
            </p>
          </div>
        </section>

        {/* 2. 상품명 섹션 */}
        <section className={STYLES.section}>
          <label className={STYLES.label}>상품명</label>
          <div className="w-3/4">
            <div className="relative">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="상품명을 입력해 주세요."
                className={STYLES.input}
                maxLength={40}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {formData.title.length}/40
              </span>
            </div>
          </div>
        </section>

        {/* 3. 카테고리 섹션 (제공된 데이터 기반 2단 선택) */}
        <section className={STYLES.section}>
          <label className={STYLES.label}>카테고리</label>
          <div className="w-3/4">
            <div className={STYLES.categoryBox}>
              {/* 대분류 */}
              <div className={STYLES.categoryList}>
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className={`${STYLES.categoryItem} ${selectedMainId === cat.id ? STYLES.activeItem : 'text-gray-700'}`}
                    onClick={() => handleMainCategoryClick(cat.id)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
              {/* 중분류 */}
              <div className={`${STYLES.categoryList} bg-gray-50/30`}>
                {selectedMainCategory?.subCategories ? (
                  selectedMainCategory.subCategories.map((sub) => (
                    <div
                      key={sub.id}
                      className={`${STYLES.categoryItem} ${formData.category === sub.name ? 'text-[#ff5058] font-bold bg-white' : 'text-gray-600'}`}
                      onClick={() => setFormData((prev) => ({ ...prev, category: sub.name }))}
                    >
                      {sub.name}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm p-6 text-center">
                    {selectedMainId ? '하위 카테고리가 없습니다.' : '대분류를 먼저 선택해주세요.'}
                  </div>
                )}
              </div>
              {/* 소분류 가이드 (디자인 유지용) */}
              <div className="w-1/3 flex items-center justify-center text-gray-300 text-sm bg-gray-50/50">
                소분류 없음
              </div>
            </div>
            <p className="text-[#ff5058] text-[15px] font-bold">
              선택한 카테고리 :{' '}
              <span className="text-gray-800 ml-1">
                {selectedMainCategory?.name} {formData.category && `> ${formData.category}`}
              </span>
            </p>
          </div>
        </section>

        {/* 4. 상품상태 섹션 */}
        <section className={STYLES.section}>
          <label className={STYLES.label}>상품상태</label>
          <div className="w-3/4 flex flex-col gap-6">
            {PRODUCT_STATUS.map((status) => (
              <label key={status.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  className="w-5 h-5 accent-[#ff5058] mt-1"
                  checked={formData.status === status.id}
                  onChange={() => setFormData({ ...formData, status: status.id })}
                />
                <div>
                  <div className="font-bold text-gray-800 group-hover:text-black">
                    {status.label}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{status.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* 5. 설명 섹션 */}
        <section className={STYLES.section}>
          <label className={STYLES.label}>설명</label>
          <div className="w-3/4">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="여러 장의 상품 사진과 구입 연도, 브랜드, 사용감, 하자 유무 등 상세 정보를 입력해 주세요."
              className={`${STYLES.input} h-44 resize-none leading-relaxed`}
              maxLength={2000}
            />
            <div className="text-right text-gray-400 text-sm mt-2">
              {formData.description.length}/2000
            </div>
          </div>
        </section>

        {/* 6. 가격 섹션 */}
        <h2 className="text-2xl font-bold mt-20 mb-8 pb-4 border-b-2 border-black">가격</h2>
        <section className={STYLES.section}>
          <label className={STYLES.label}>가격</label>
          <div className="w-3/4 flex items-center gap-8">
            <div className="relative w-72">
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                placeholder="가격을 입력해 주세요."
                className={`${STYLES.input} text-lg`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium">원</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
              <input type="checkbox" className="w-6 h-6 accent-[#ff5058]" />
              <span>가격제안 받기</span>
            </label>
          </div>
        </section>

        {/* 하단 고정 푸터 */}
        <footer className={STYLES.footer}>
          <div className="max-w-[1024px] mx-auto flex justify-end gap-3 px-4">
            <button
              type="button"
              className={`${STYLES.submitBtn} bg-gray-100 text-gray-700 hover:bg-gray-200`}
            >
              임시저장
            </button>
            <button
              type="submit"
              className={`${STYLES.submitBtn} bg-[#ff5058] text-white shadow-md hover:bg-[#e64951]`}
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
