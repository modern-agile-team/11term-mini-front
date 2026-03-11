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

        const response = await api.get('/api/products');
        const data: Product[] = Array.isArray(response.data)
          ? response.data
          : response.data?.products || [];

        if (!ignore) {
          const wishes = data.filter((p) => savedWishes.includes(String(p.id)));

          const sortedWishes = wishes.sort((a, b) => {
            if (a.saleStatus === 'SOLD_OUT' && b.saleStatus !== 'SOLD_OUT') return 1;
            if (a.saleStatus !== 'SOLD_OUT' && b.saleStatus === 'SOLD_OUT') return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setWishProducts(sortedWishes);
        }
      } catch (error) {
        console.error('찜 목록 로딩 실패:', error);
      }
    };

    loadWishes();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDeleteClick = (productId: number) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
      deleteProduct(productId);
    }
  };

  if (!userInfo) return null;

  const handleOpenFollowers = async () => {
    await openFollowListModal(userInfo.id, 'followers');
  };

  const handleOpenFollowing = async () => {
    await openFollowListModal(userInfo.id, 'following');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 프로필 섹션 */}
      <div className="flex gap-8 mb-8 bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
        <div
          className="relative group cursor-pointer w-37.5 h-37.5 shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={userInfo.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'}
            alt="프로필"
            className="w-full h-full rounded-full object-cover border border-gray-200"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">사진 변경</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              {isNicknameEditing ? (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    className="text-2xl font-bold border-b-2 border-red-500 focus:outline-none px-1"
                  />
                  <button
                    onClick={saveNickname}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setIsNicknameEditing(false)}
                    className="px-3 py-1 bg-gray-200 text-sm rounded"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2 group">
                  <h1 className="text-2xl font-bold">{userInfo.nickname}</h1>
                  <button
                    onClick={() => setIsNicknameEditing(true)}
                    className="text-sm border border-gray-200 px-2 py-1 rounded text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    수정
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Store size={16} /> 상점오픈 {getOpenDays(userInfo.createdAt || '')}일째
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} /> 상점방문 0명
                </span>
                <button type="button" onClick={handleOpenFollowers} className="hover:text-gray-700">
                  팔로워 {userInfo.followers?.length || 0}
                </button>
                <button type="button" onClick={handleOpenFollowing} className="hover:text-gray-700">
                  팔로잉 {userInfo.following?.length || 0}
                </button>
                <span className="flex items-center gap-1">
                  <ShoppingBag size={16} /> 상품판매 0회
                </span>
              </div>
            </div>

            <button className="px-4 py-2 border border-gray-300 rounded font-medium text-sm hover:bg-gray-50 transition-colors">
              상점 공유하기
            </button>
          </div>

          <div className="relative group">
            {isIntroEditing ? (
              <div className="space-y-2">
                <textarea
                  value={tempIntro}
                  onChange={(e) => setTempIntro(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-red-500 min-h-25 resize-none"
                  placeholder="상점 소개글을 입력해주세요."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsIntroEditing(false)}
                    className="px-3 py-1.5 bg-gray-100 text-sm rounded"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveIntro}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="bg-gray-50 p-4 rounded text-sm text-gray-600 min-h-25 whitespace-pre-wrap flex justify-between items-start cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsIntroEditing(true)}
              >
                <span>{userInfo.shopIntro || '상점 소개글을 입력해주세요.'}</span>
                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  클릭하여 수정
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        {['상품', '찜', '후기'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 font-bold text-[15px] transition-colors relative ${
              activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.75 bg-gray-900" />
            )}
            <span className="ml-1 text-sm font-normal">
              {tab === '찜' ? wishProducts.length : tab === '상품' ? myProducts.length : '0'}
            </span>
          </button>
        ))}
      </div>

      <div className="min-h-100">
        {activeTab === '찜' ? (
          wishProducts.length > 0 ? (
            <div className="grid grid-cols-5 gap-4">
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
            <div className="flex flex-col border-t-2 border-black">
              {myProducts.map((product) => (
                <div key={`manage-${product.id}`} className="flex py-6 border-b border-gray-100">
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

                  <div className="flex flex-col gap-2 justify-center w-40">
                    <select
                      value={product.saleStatus || 'ON_SALE'}
                      onChange={(e) =>
                        updateProductStatus(product.id, e.target.value as SaleStatus)
                      }
                      className="w-full border border-gray-300 py-2.5 px-3 text-sm rounded-sm focus:outline-none focus:border-red-500 cursor-pointer font-medium"
                    >
                      <option value="ON_SALE">판매중</option>
                      <option value="RESERVED">예약중</option>
                      <option value="SOLD_OUT">판매완료</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit/${product.id}`)}
                        className="flex-1 border border-gray-300 py-2.5 text-sm rounded-sm hover:bg-gray-50 font-medium transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="flex-1 border border-gray-300 py-2.5 text-sm rounded-sm hover:bg-gray-50 font-medium transition-colors text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                    <button className="w-full border border-gray-300 py-2 text-sm rounded-sm hover:bg-gray-50 font-medium text-gray-600 transition-colors mt-1">
                      UP 하기
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
