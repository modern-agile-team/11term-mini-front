import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-full border border-gray-200 cursor-pointer bg-white group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            product.saleStatus === 'SOLD_OUT' ? 'grayscale opacity-70' : ''
          }`}
        />

        {product.saleStatus === 'RESERVED' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <span className="text-white font-bold text-lg border-2 border-white px-4 py-1.5 rounded-sm shadow-sm tracking-widest">
              예약중
            </span>
          </div>
        )}
        {product.saleStatus === 'SOLD_OUT' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-gray-300 font-bold text-lg border-2 border-gray-300 px-4 py-1.5 rounded-sm shadow-sm tracking-widest">
              판매완료
            </span>
          </div>
        )}

        {product.isThunderPay && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-[10px] font-bold px-1 py-0.5 rounded-sm z-20">
            ⚡ 번개페이
          </div>
        )}
      </div>

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
            <span className="text-xs text-gray-400">{product.createdAt ? '최근' : ''}</span>
          </div>
          <span className="text-[11px] text-gray-500 truncate">{product.location || '전국'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
