import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyPage } from '../hooks/useMyPage';
import { Store, Users, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import type { Product, SaleStatus } from '../types/Product';

interface ProductsResponse {
  products?: Product[];
  data?: Product[];
}

const MyPage = () => {
  const navigate = useNavigate();
  const {
    userInfo,
    activeTab,
    setActiveTab,
    myProducts,
    isNicknameEditing,
    setIsNicknameEditing,
    isIntroEditing,
    setIsIntroEditing,
    tempNickname,
    setTempNickname,
    tempIntro,
    setTempIntro,
    fileInputRef,
    getOpenDays,
    saveNickname,
    saveIntro,
    handleImageChange,
    updateProductStatus,
    deleteProduct,
    startEditingNickname,
    startEditingIntro,
  } = useMyPage();

  const [wishProducts, setWishProducts] = useState<Product[]>([]);

  useEffect(() => {
    let ignore = false;

    const loadWishes = async () => {
      try {
        const savedWishesRaw = localStorage.getItem('wish_list');
        const savedWishes: (number | string)[] = savedWishesRaw ? JSON.parse(savedWishesRaw) : [];

        if (!Array.isArray(savedWishes) || savedWishes.length === 0) {
          if (!ignore) setWishProducts([]);
          return;
        }

        const response = await api.get<Product[] | ProductsResponse>('/products');
        const responseData = response.data;
        const data: Product[] = Array.isArray(responseData)
          ? responseData
          : responseData.products || responseData.data || [];

        const wished = data.filter((p) => savedWishes.map(String).includes(String(p.id)));

        if (!ignore) {
          setWishProducts(wished);
        }
      } catch (error: unknown) {
        console.error('찜 목록 로딩 실패:', error);
      }
    };

    if (activeTab === '찜') {
      loadWishes();
    }

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  const handleDeleteClick = (productId: number) => {
    deleteProduct(productId);
  };

  const handleStatusChange = (productId: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as SaleStatus;
    updateProductStatus(productId, newStatus);
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1024px] mx-auto px-4 py-8">
          <div className="flex gap-8 items-start">
            <div
              className="flex-shrink-0 relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {userInfo.imageUrl ? (
                <img
                  src={userInfo.imageUrl}
                  alt="프로필"
                  className="w-[120px] h-[120px] rounded-full object-cover border border-gray-100"
                />
              ) : (
                <div className="w-[120px] h-[120px] bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                  <Store className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">사진 변경</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {isNicknameEditing ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={tempNickname}
                      onChange={(e) => setTempNickname(e.target.value)}
                      className="border border-gray-300 px-3 py-1.5 text-lg font-bold rounded-sm outline-none focus:border-black"
                      placeholder="상점명 입력"
                      autoFocus
                    />
                    <button
                      onClick={saveNickname}
                      className="px-4 py-1.5 bg-black text-white text-sm font-bold rounded-sm"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setIsNicknameEditing(false)}
                      className="px-4 py-1.5 border border-gray-300 text-sm font-bold rounded-sm"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{userInfo.nickname}</h1>
                    <button
                      onClick={startEditingNickname}
                      className="px-3 py-1 border border-gray-300 text-xs text-gray-600 rounded-sm hover:bg-gray-50 transition-colors"
                    >
                      상점명 수정
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6 text-[13px] text-gray-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  <span>
                    상점오픈{' '}
                    <strong className="text-black">D+{getOpenDays(userInfo.createdAt)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>
                    상점방문 <strong className="text-black">{userInfo.visitCount || 0}명</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    상품판매 <strong className="text-black">{myProducts.length}회</strong>
                  </span>
                </div>
              </div>

              <div className="bg-[#fafafa] p-4 rounded-sm border border-gray-100">
                {isIntroEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={tempIntro}
                      onChange={(e) => setTempIntro(e.target.value)}
                      className="w-full h-24 p-3 border border-gray-300 rounded-sm outline-none focus:border-black resize-none text-sm"
                      placeholder="상점 소개를 입력해주세요."
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsIntroEditing(false)}
                        className="px-4 py-1.5 border border-gray-300 text-sm font-bold rounded-sm"
                      >
                        취소
                      </button>
                      <button
                        onClick={saveIntro}
                        className="px-4 py-1.5 bg-black text-white text-sm font-bold rounded-sm"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative pr-10">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap min-h-[20px]">
                      {userInfo.shopIntro || '상점 소개를 등록해보세요.'}
                    </p>
                    <button
                      onClick={startEditingIntro}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 px-3 py-1 bg-white border border-gray-200 text-xs text-gray-600 rounded-sm hover:bg-gray-50 transition-all"
                    >
                      수정
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1024px] mx-auto px-4 py-8">
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {['상품', '상점후기', '찜'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[15px] font-bold relative ${
                activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {tab === '상품' && <span className="ml-1 text-[#ff5058]">{myProducts.length}</span>}
              {tab === '찜' && <span className="ml-1 text-[#ff5058]">{wishProducts.length}</span>}
              {tab === '상점후기' && <span className="ml-1 text-[#ff5058]">0</span>}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {activeTab === '찜' ? (
          wishProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {wishProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-b border-gray-100 text-gray-300">
              <p className="text-sm">찜한 상품이 없습니다.</p>
            </div>
          )
        ) : activeTab === '상품' ? (
          myProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {myProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />
                  <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                    <select
                      value={product.saleStatus}
                      onChange={(e) => handleStatusChange(product.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-bold px-2 py-1 rounded shadow-sm border outline-none ${
                        product.saleStatus === 'ON_SALE'
                          ? 'bg-[#ff5058] text-white border-[#ff5058]'
                          : product.saleStatus === 'RESERVED'
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-gray-500 text-white border-gray-500'
                      }`}
                    >
                      <option value="ON_SALE" className="bg-white text-black">
                        판매중
                      </option>
                      <option value="RESERVED" className="bg-white text-black">
                        예약중
                      </option>
                      <option value="SOLD_OUT" className="bg-white text-black">
                        판매완료
                      </option>
                    </select>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 gap-2 z-20 pointer-events-none group-hover:pointer-events-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit/${product.id}`)}
                        className="flex-1 border border-gray-300 bg-white py-2 px-4 text-sm rounded-sm hover:bg-gray-50 font-medium transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="flex-1 border border-gray-300 bg-white py-2 px-4 text-sm rounded-sm hover:bg-gray-50 font-medium transition-colors text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-b border-gray-100 text-gray-300">
              <p className="text-sm">등록된 상품이 없습니다.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-b border-gray-100 text-gray-300">
            <p className="text-sm">등록된 후기가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
