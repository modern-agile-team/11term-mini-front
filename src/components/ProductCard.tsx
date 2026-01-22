import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-full border border-gray-200 cursor-pointer bg-white"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      {/* 정보 영역 */}
      <div className="p-3">
        <h3 className="text-[14px] text-gray-800 line-clamp-2 h-[40px] mb-2">
          {product.title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-bold">{product.price.toLocaleString()}원</span>
          <span className="text-[12px] text-gray-400">{product.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;