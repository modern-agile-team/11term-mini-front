import React, { useState } from 'react';
import type { CreateProductInput } from '../../types/Product';

const SellerManager = () => {
  const [formData, setFormData] = useState<CreateProductInput>({
    title: '',
    price: 0,
    location: '전국',
    image: '',
    images: [],
    category: '',
    description: '',
    status: '신규',
    isThunderPay: false,
    tags: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('최종 등록 데이터:', formData);
    alert('상품 등록 프로세스가 시작되었습니다.');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 서브 네비게이션 (이미지 6번 상단 참고) */}
      <div className="border-b">
        <div className="max-w-[1024px] mx-auto flex gap-10 py-4 text-sm font-semibold">
          <span className="text-red-500 border-b-2 border-red-500 pb-4 -mb-4 cursor-pointer">
            상품등록
          </span>
          <span className="text-gray-400 cursor-pointer">상품관리</span>
          <span className="text-gray-400 cursor-pointer">구매/판매 내역</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[1024px] mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-black">상품정보</h2>

        {/* 1. 이미지 등록 섹션 */}
        <div className="flex border-b pb-10 mb-10">
          <label className="w-1/4 text-lg">
            상품이미지 <span className="text-gray-400 text-sm">({formData.images.length}/12)</span>
          </label>
          <div className="w-3/4">
            <div className="w-40 h-40 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-3xl mb-2">📷</span>
              <span className="text-gray-400 text-sm">이미지 등록</span>
            </div>
            <p className="text-blue-500 text-xs mt-4">
              * 상품 이미지는 PC에서는 1:1, 모바일에서는 1:1.23 비율로 보여져요.
            </p>
          </div>
        </div>

        {/* 2. 상품명 섹션 */}
        <div className="flex border-b pb-10 mb-10">
          <label className="w-1/4 text-lg">상품명</label>
          <div className="w-3/4">
            <div className="flex border border-gray-200 p-3 items-center focus-within:border-black">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="상품명을 입력해 주세요."
                className="w-full outline-none"
                maxLength={40}
              />
              <span className="text-gray-400 ml-2">{formData.title.length}/40</span>
            </div>
          </div>
        </div>

        {/* 3. 카테고리 섹션 (이미지 6번 하단) */}
        <div className="flex border-b pb-10 mb-10">
          <label className="w-1/4 text-lg">카테고리</label>
          <div className="w-3/4">
            <div className="border border-gray-200 h-64 flex text-sm">
              <div className="w-1/3 border-r overflow-y-auto p-2">
                <div className="p-2 bg-gray-50 text-red-500 font-bold">여성의류</div>
                <div className="p-2 hover:bg-gray-50 cursor-pointer">남성의류</div>
                <div className="p-2 hover:bg-gray-50 cursor-pointer">신발</div>
                {/* ... 더 많은 카테고리 */}
              </div>
              <div className="w-1/3 border-r flex items-center justify-center text-gray-400">
                중분류 선택
              </div>
              <div className="w-1/3 flex items-center justify-center text-gray-400">
                소분류 선택
              </div>
            </div>
            <p className="text-red-500 mt-4 text-sm">선택한 카테고리 : </p>
          </div>
        </div>

        {/* 하단 버튼 바 (이미지 8번 참고) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          <div className="max-w-[1024px] mx-auto flex justify-end gap-3">
            <button type="button" className="px-12 py-4 bg-gray-100 font-bold">
              임시저장
            </button>
            <button type="submit" className="px-12 py-4 bg-[#ff5058] text-white font-bold">
              등록하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellerManager;
