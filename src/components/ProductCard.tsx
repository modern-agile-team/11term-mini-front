import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { timeAgo } from '../utils/timeAgo';

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-full border border-gray-200 cursor-pointer bg-white group"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isThunderPay && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-[10px] font-bold px-1 py-0.5 rounded-sm">
            ⚡ 번개페이
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-3">
        <h3 className="text-[14px] text-gray-800 line-clamp-2 h-[40px] mb-2 group-hover:underline">
          {product.title}
        </h3>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-[16px] font-bold">
              {product.price.toLocaleString()}
              <span className="text-sm font-normal ml-0.5">원</span>
            </span>
            <span className="text-[12px] text-gray-400">{timeAgo(product.createdAt)}</span>
          </div>
          <div className="text-[11px] text-gray-400 truncate">{product.location}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
