import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useSellerForm } from '../hooks/useSellerForm';
import { SellerFormSection } from '../components/seller/SellerFormSection';
import type { Product } from '../types/Product';
import { X } from 'lucide-react';

interface DetailResponse {
  data?: Product;
}

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetched = useRef(false);

  const { formData, handleInputChange, tagInput, setTagInput, handleTagKeyDown, removeTag } =
    useSellerForm(originalData);

  useEffect(() => {
    if (!id || isFetched.current) return;
    isFetched.current = true;

    const fetchOriginal = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<Product | DetailResponse>(`/products/${id}`);
        const data = 'data' in res.data && res.data.data ? res.data.data : (res.data as Product);

        if (data && data.id) {
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

  const handleUpdate = async () => {
    try {
      await api.patch(`/products/${id}`, formData);
      alert('상품이 수정되었습니다.');
      navigate(`/product/${id}`, { replace: true });
    } catch (e) {
      console.error(e);
      alert('수정에 실패했습니다.');
    }
  };

  if (isLoading) return <div className="p-20 text-center">로딩 중...</div>;
  if (!originalData) return null;

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-black">기본정보 수정</h1>

      <div className="flex flex-col gap-6">
        <SellerFormSection label="상품명 *">
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-sm"
            placeholder="상품명을 입력해 주세요."
          />
        </SellerFormSection>

        <SellerFormSection label="가격 *">
          <input
            name="price"
            type="number"
            value={formData.price || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-sm"
            placeholder="가격을 입력해 주세요."
          />
        </SellerFormSection>

        <SellerFormSection label="설명 *">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full h-40 border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-sm resize-none"
            placeholder="상품 설명을 입력해 주세요."
          />
        </SellerFormSection>

        <SellerFormSection label="태그">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 text-xs rounded-full flex items-center gap-1"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
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
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-sm"
            placeholder="태그 입력 후 Enter"
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
            className="px-10 py-3 text-sm font-bold bg-[#ff5058] text-white shadow-md hover:bg-[#e64951] transition-colors"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
