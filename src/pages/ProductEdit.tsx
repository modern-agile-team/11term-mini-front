import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useSellerForm } from '../hooks/useSellerForm';
import { SellerFormSection } from '../components/seller/SellerFormSection';
import { SellerSubNav } from '../components/seller/SellerNav';
import { PRODUCT_STATUS } from '../types/Product';
import type { Product } from '../types/Product';
import { X } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { fetchProductByIdWithFallback } from '../utils/productSource';

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetched = useRef(false);

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    if (!id || isFetched.current) return;
    isFetched.current = true;

    const fetchOriginal = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProductByIdWithFallback(id);
        if (data?.id) {
          setOriginalData(data);
        } else {
          alert('상품 정보를 찾을 수 없습니다.');
          navigate(-1);
        }
      } catch (e) {
        console.error(e);
        alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOriginal();
  }, [id, navigate]);

  // 2. 폼 훅 초기화
  const {
    formData,
    setFormData,
    selectedMainId,
    setSelectedMainId,
    selectedSubId,
    setSelectedSubId,
    tagInput,
    setTagInput,
    handleInputChange,
    handleImageUpload,
    removeImage,
    handleTagKeyDown,
    removeTag,
  } = useSellerForm(originalData);

  const selectedMainCategory = CATEGORIES.find((cat) => cat.id === selectedMainId);
  const selectedSubCategory =
    selectedMainCategory?.subCategories?.find((sub) => sub.id === selectedSubId) ?? null;
  const leafCategories = selectedSubCategory?.subCategories ?? [];

  const handleSelectMain = (mainId: string) => {
    setSelectedMainId(mainId);
    setSelectedSubId(null);

    const mainCategory = CATEGORIES.find((category) => category.id === mainId);
    if (!mainCategory?.subCategories?.length) {
      setFormData((prev) => ({ ...prev, category: mainCategory?.name ?? '', categoryId: mainId }));
      return;
    }

    setFormData((prev) => ({ ...prev, category: '', categoryId: '' }));
  };

  const handleSelectSub = (subId: string) => {
    setSelectedSubId(subId);

    const subCategory = selectedMainCategory?.subCategories?.find((sub) => sub.id === subId);
    if (!subCategory?.subCategories?.length) {
      setFormData((prev) => ({
        ...prev,
        category: subCategory?.name ?? '',
        categoryId: subId,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, category: '', categoryId: '' }));
  };

  const handleSelectLeaf = (leafId: string, leafName: string) => {
    setFormData((prev) => ({
      ...prev,
      category: leafName,
      categoryId: leafId,
    }));
  };

  const selectedPathText = [
    selectedMainCategory?.name,
    selectedSubCategory?.name,
    formData.category === selectedSubCategory?.id ? undefined : formData.category || undefined,
  ]
    .filter(Boolean)
    .join(' > ');

  // 3. 수정 완료 처리
  const handleUpdate = async () => {
    if (!formData.title.trim()) return alert('상품명을 입력해주세요.');
    if (!formData.category) return alert('카테고리를 선택해주세요.');
    if (formData.price <= 0) return alert('올바른 가격을 입력해주세요.');

    try {
      await api.patch(`/api/products/${id}`, formData);
      alert('상품이 수정되었습니다!');
      navigate(`/product/${id}`);
    } catch (error) {
      console.error('수정 실패:', error);
      alert('상품 수정 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <p className="text-gray-500 font-bold">데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!originalData) return null;

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-20">
      <SellerSubNav />

      <main className="max-w-[850px] mx-auto mt-8 px-4 bg-white border border-gray-200 shadow-sm p-10">
        <h2 className="text-2xl font-bold pb-6 border-b-2 border-black mb-8">상품 정보 수정</h2>

        {/* 1. 이미지 */}
        <SellerFormSection
          label="상품이미지"
          type="image"
          images={formData.images}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
          count={`${formData.images.length}/12`}
          required
        />

        {/* 2. 상품명 */}
        <SellerFormSection
          label="상품명"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="상품명을 입력해 주세요."
          maxLength={40}
          required
        />

        {/* 3. 카테고리 */}
        <SellerFormSection label="카테고리" required>
          <div className="border border-gray-200 h-60 flex text-[13px] mb-3 bg-white">
            <div className="w-1/3 border-r overflow-y-auto custom-scrollbar">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-2.5 px-3 hover:bg-gray-50 cursor-pointer ${selectedMainId === cat.id ? 'bg-gray-50 text-[#ff5058] font-bold' : ''}`}
                  onClick={() => handleSelectMain(cat.id)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
            <div className="w-1/3 border-r overflow-y-auto custom-scrollbar bg-gray-50/30">
              {selectedMainCategory?.subCategories?.map((sub) => (
                <div
                  key={sub.id}
                  className={`p-2.5 px-3 hover:bg-gray-50 cursor-pointer ${selectedSubId === sub.id ? 'text-[#ff5058] font-bold bg-white' : ''}`}
                  onClick={() => handleSelectSub(sub.id)}
                >
                  {sub.name}
                </div>
              )) || <div className="p-10 text-center text-gray-400">대분류 선택</div>}
            </div>
            <div className="w-1/3 overflow-y-auto custom-scrollbar bg-gray-50/50">
              {leafCategories.length > 0 ? (
                leafCategories.map((leaf) => (
                  <div
                    key={leaf.id}
                    className={`p-2.5 px-3 hover:bg-gray-50 cursor-pointer ${formData.category === leaf.name ? 'text-[#ff5058] font-bold bg-white' : ''}`}
                    onClick={() => handleSelectLeaf(leaf.id, leaf.name)}
                  >
                    {leaf.name}
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300 italic">
                  소분류 없음
                </div>
              )}
            </div>
          </div>
          <p className="text-[#ff5058] text-xs font-bold italic">
            선택한 카테고리 :{' '}
            <span className="text-gray-800 not-italic">{selectedPathText || '선택 없음'}</span>
          </p>
        </SellerFormSection>

        {/* 4. 거래지역 */}
        <SellerFormSection
          label="거래지역"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />

        {/* 5. 상태 */}
        <SellerFormSection label="상품상태" required>
          <div className="flex gap-4">
            {PRODUCT_STATUS.map((status) => (
              <label key={status.id} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status.id}
                  checked={formData.status === status.id}
                  onChange={handleInputChange}
                  className="accent-[#ff5058] w-4 h-4"
                />
                <span className="text-sm text-gray-700">{status.label}</span>
              </label>
            ))}
          </div>
        </SellerFormSection>

        {/* 6. 가격 */}
        <SellerFormSection
          label="가격"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="숫자만 입력해주세요."
          unit="원"
          required
        />

        {/* 7. 설명 */}
        <SellerFormSection
          label="상품설명"
          type="textarea"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="상품에 대한 자세한 설명을 적어주세요."
          maxLength={2000}
          required
        />

        {/* 8. 태그 */}
        <SellerFormSection
          label="연관태그"
          description="태그를 입력하고 엔터를 누르세요 (최대 5개)"
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 text-xs rounded-full flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="w-full border border-gray-200 p-2.5 text-sm outline-none focus:border-black rounded-sm"
            placeholder="태그 입력"
          />
        </SellerFormSection>

        <div className="flex justify-end gap-3 mt-10 pt-6 border-t">
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-3 text-sm font-bold bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleUpdate}
            className="px-10 py-3 text-sm font-bold bg-[#ff5058] text-white shadow-md hover:bg-[#ff3038] transition-colors"
          >
            수정 완료
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductEdit;
