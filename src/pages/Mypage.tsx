import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyPage } from '../hooks/useMyPage';
import { Store, Users, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import type { Product, SaleStatus } from '../types/Product';
import { timeAgo } from '../utils/timeAgo';
import { useFollowList } from '../hooks/useFollowList';
import FollowListModal from '../components/seller/FollowListModal';

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
  const {
    isModalOpen,
    isListLoading,
    listType,
    followUsers,
    openFollowListModal,
    closeFollowListModal,
  } = useFollowList();

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
        console.error('관심상품 로딩 실패:', error);
      }
    };

    if (activeTab === '관심상품') {
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

  const handleOpenFollowers = async () => {
    await openFollowListModal(userInfo.id, 'followers');
  };

  const handleOpenFollowing = async () => {
    await openFollowListModal(userInfo.id, 'following');
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1024px] mx-auto px-4 py-8">
          <div className="flex gap-8 items-start">
            <div
              className="flex-shrink-0 relative group cursor-pointer w-[120px] h-[120px]"
              onClick={() => fileInputRef.current?.click()}
            >
              {userInfo.imageUrl || userInfo.avatar ? (
                <img
                  src={userInfo.imageUrl || userInfo.avatar}
                  alt="프로필"
                  className="w-full h-full rounded-full object-cover border border-gray-100"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
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

              {/* 팔로우 버튼과 상점 정보 통합 */}
              <div className="flex items-center gap-6 text-[13px] text-gray-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  <span>
                    상점오픈{' '}
                    <strong className="text-black">
                      D+{getOpenDays(userInfo.createdAt || '')}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>
                    상점방문 <strong className="text-black">{userInfo.visitCount || 0}명</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenFollowers}
                  className="hover:text-black transition-colors"
                >
                  팔로워 <strong className="text-black">{userInfo.followers?.length || 0}</strong>
                </button>
                <button
                  type="button"
                  onClick={handleOpenFollowing}
                  className="hover:text-black transition-colors"
                >
                  팔로잉 <strong className="text-black">{userInfo.following?.length || 0}</strong>
                </button>
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
          {['상품', '상점후기', '관심상품'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[15px] font-bold relative ${
                activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {tab === '상품' && <span className="ml-1 text-[#ff5058]">{myProducts.length}</span>}
              {tab === '관심상품' && (
                <span className="ml-1 text-[#ff5058]">{wishProducts.length}</span>
              )}
              {tab === '상점후기' && <span className="ml-1 text-[#ff5058]">0</span>}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {activeTab === '관심상품' ? (
          wishProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {wishProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-b border-gray-100 text-gray-300">
              <p className="text-sm">관심상품이 없습니다.</p>
            </div>
          )
        ) : activeTab === '상품' ? (
          myProducts.length > 0 ? (
            <div className="flex flex-col">
              {myProducts.map((product) => (
                <div
                  key={`manage-${product.id}`}
                  className="flex py-6 border-b border-gray-100 bg-white px-4 rounded-sm"
                >
                  {/* 상품 이미지 */}
                  <div
                    className="relative w-35 h-35 shrink-0 border border-gray-200 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className={`w-full h-full object-cover transition-all ${
                        product.saleStatus === 'SOLD_OUT' ? 'grayscale opacity-70' : ''
                      }`}
                    />
                    {product.saleStatus === 'RESERVED' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                        <span className="text-white font-bold border-2 border-white px-3 py-1 rounded-sm tracking-widest text-sm">
                          예약중
                        </span>
                      </div>
                    )}
                    {product.saleStatus === 'SOLD_OUT' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <span className="text-gray-300 font-bold border-2 border-gray-300 px-3 py-1 rounded-sm tracking-widest text-sm">
                          판매완료
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 px-6 flex flex-col justify-center">
                    <div className="text-sm font-bold text-gray-500 mb-1">
                      {product.saleStatus === 'ON_SALE'
                        ? '판매중'
                        : product.saleStatus === 'RESERVED'
                          ? '예약중'
                          : '판매완료'}
                    </div>
                    <h3
                      className="text-lg text-gray-800 line-clamp-1 mb-2 hover:underline cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.title}
                    </h3>
                    <div className="font-bold text-xl mb-3">{product.price.toLocaleString()}원</div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <span>{timeAgo(product.createdAt)}</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]">{product.location}</span>
                    </div>
                  </div>

                  {/* 상태 변경 및 액션 버튼 통합 */}
                  <div className="flex flex-col gap-2 justify-center w-32 border-l border-gray-100 pl-6">
                    <select
                      value={product.saleStatus}
                      onChange={(e) => handleStatusChange(product.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-bold px-2 py-2 rounded shadow-sm border outline-none text-center ${
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

                    <button
                      onClick={() => navigate(`/edit/${product.id}`)}
                      className="w-full border border-gray-300 bg-white py-1.5 px-4 text-xs rounded-sm hover:bg-gray-50 font-medium transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="w-full border border-gray-300 bg-white py-1.5 px-4 text-xs rounded-sm hover:bg-gray-50 font-medium transition-colors text-red-500"
                    >
                      삭제
                    </button>
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

      <FollowListModal
        isOpen={isModalOpen}
        listType={listType}
        isLoading={isListLoading}
        followUsers={followUsers}
        onClose={closeFollowListModal}
      />
    </div>
  );
};

export default MyPage;
