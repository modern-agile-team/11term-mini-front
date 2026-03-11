import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import type { Product } from '../types/Product';
import { useProductActions } from '../hooks/useProductActions';
import { Heart } from 'lucide-react';

interface DetailResponse {
  data?: Product;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchedIdRef = useRef<string | null>(null);
  const { isWished, toggleWish } = useProductActions(product || undefined);

  useEffect(() => {
    if (!id) return;
    if (fetchedIdRef.current === id) return;
    fetchedIdRef.current = id;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get<Product | DetailResponse>(`/products/${id}`);
        const responseData = response.data;
        const data: Product =
          'data' in responseData && responseData.data
            ? responseData.data
            : (responseData as Product);

        if (data?.id) {
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('상품 상세 정보 로딩 실패:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleWishClick = () => {
    toggleWish();
    setProduct((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        wishCount: isWished ? prev.wishCount - 1 : prev.wishCount + 1,
      };
    });
  };

  if (loading) return <div className="py-20 text-center">불러오는 중...</div>;
  if (!product) return <div className="py-20 text-center">상품을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full aspect-square object-cover bg-gray-100"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
            <p className="text-3xl font-bold mb-6">{product.price.toLocaleString()}원</p>
            <div className="flex flex-col gap-3 text-sm border-t border-b py-6 border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-24">• 조회수</span>
                <span className="text-gray-800 font-medium">{product.views || 0}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-24">• 거래지역</span>
                <span className="text-gray-800 font-medium">📍 {product.location || '전국'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-8 relative">
            <button
              onClick={handleWishClick}
              className={`flex-1 h-14 font-bold rounded flex items-center justify-center gap-2 transition-all ${
                isWished ? 'bg-[#ff5058] text-white' : 'bg-[#b2b2b2] text-white hover:bg-gray-400'
              }`}
            >
              <Heart size={20} className={isWished ? 'fill-white text-white' : 'text-white'} />찜{' '}
              {product.wishCount || 0}
            </button>
            <button className="flex-1 h-14 bg-[#ffa800] text-white font-bold rounded hover:brightness-95 transition">
              번개톡
            </button>
            <div className="flex-[1.2] relative group">
              <button className="w-full h-14 bg-[#ff5058] text-white font-bold rounded hover:brightness-95 transition">
                바로구매
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-12 mt-12">
        <h2 className="text-xl font-bold mb-8">상품정보</h2>
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
