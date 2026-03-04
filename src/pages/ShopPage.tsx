import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import FollowButton from '../components/FollowButton';
import ProductCard from '../components/ProductCard';

import api from '../api/axios';
import { followApi, type ShopSummary } from '../api/follow';
import type { Product } from '../types/Product';

type TabKey = 'products' | 'followers' | 'following';

const getOwnerIdFromProduct = (p: any): string | null => {
  // 프로젝트마다 필드명이 다를 수 있어서 최대한 유연하게
  if (p?.sellerId != null) return String(p.sellerId);
  if (p?.userId != null) return String(p.userId);
  if (p?.ownerId != null) return String(p.ownerId);
  if (p?.seller?.id != null) return String(p.seller.id);
  if (p?.user?.id != null) return String(p.user.id);
  return null;
};

const ShopPage = () => {
  const { id } = useParams();
  const shopId = id ?? '';

  const [tab, setTab] = useState<TabKey>('products');

  const [meId, setMeId] = useState<string | null>(null);

  const [shopNickname, setShopNickname] = useState('');
  const [shopIntro, setShopIntro] = useState('');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [followers, setFollowers] = useState<ShopSummary[]>([]);
  const [following, setFollowing] = useState<ShopSummary[]>([]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const isMyShop = meId != null && shopId !== '' && String(meId) === String(shopId);

  useEffect(() => {
    if (!shopId) return;

    // 내 정보 (로그인 안 했으면 실패해도 OK)
    followApi
      .me()
      .then((me) => setMeId(String(me.id)))
      .catch(() => setMeId(null));

    // 상점 상단 정보
    followApi.getShop(shopId).then((shop) => {
      setShopNickname(shop.nickname || '');
      setShopIntro(shop.shopIntro || '');
      setFollowersCount(shop.followersCount || 0);
      setFollowingCount(shop.followingCount || 0);
    });

    // 목록
    followApi.getFollowers(shopId).then((res) => setFollowers(res.items || []));
    followApi.getFollowing(shopId).then((res) => setFollowing(res.items || []));

    // 상품(전체 불러와서 필터)
    api
      .get('/products')
      .then((res) => setAllProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAllProducts([]));
  }, [shopId]);

  const shopProducts = useMemo(() => {
    if (!shopId) return [];
    return (allProducts as any[]).filter((p) => {
      const ownerId = getOwnerIdFromProduct(p);
      return ownerId != null && String(ownerId) === String(shopId);
    }) as Product[];
  }, [allProducts, shopId]);

  const onUnfollow = async (targetId: string) => {
    await followApi.unfollow(targetId);
    const res = await followApi.getFollowing(shopId);
    setFollowing(res.items || []);
    setFollowingCount(res.total || 0);
  };

  const onRemoveFollower = async (followerId: string) => {
    await followApi.removeFollower(followerId);
    const res = await followApi.getFollowers(shopId);
    setFollowers(res.items || []);
    setFollowersCount(res.total || 0);
  };

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8">
      {/* 상단: 상점 정보 */}
      <section className="border rounded-lg p-5 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {shopNickname ? `${shopNickname} 상점` : '상점'}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {shopIntro || '상점 소개가 아직 없어요.'}
            </p>

            <div className="flex items-center gap-4 mt-4 text-sm">
              <button
                className={`px-2 py-1 rounded border ${tab === 'followers' ? 'bg-gray-100' : ''}`}
                onClick={() => setTab('followers')}
              >
                팔로워 <span className="font-bold">{followersCount}</span>
              </button>
              <button
                className={`px-2 py-1 rounded border ${tab === 'following' ? 'bg-gray-100' : ''}`}
                onClick={() => setTab('following')}
              >
                팔로잉 <span className="font-bold">{followingCount}</span>
              </button>
              <button
                className={`px-2 py-1 rounded border ${tab === 'products' ? 'bg-gray-100' : ''}`}
                onClick={() => setTab('products')}
              >
                상품 <span className="font-bold">{shopProducts.length}</span>
              </button>
            </div>
          </div>

          {/* 내 상점이면 버튼 숨김, 남의 상점이면 팔로우 버튼 */}
          {!isMyShop && shopId && (
            <FollowButton userId={shopId} onChangeFollowersCount={setFollowersCount} />
          )}
        </div>
      </section>

      {/* 탭 내용 */}
      <section className="mt-8">
        {tab === 'products' && (
          <>
            <h2 className="text-lg font-bold mb-4">판매 상품</h2>

            {shopProducts.length === 0 ? (
              <div className="text-sm text-gray-600 border rounded p-4 bg-white">
                이 상점에 등록된 상품이 아직 없어요.
                <div className="mt-2 text-xs text-gray-500">
                  (만약 상품 데이터에 판매자 ID 필드가 없다면, 상품 등록 시 sellerId/userId 등을 넣는 작업이
                  필요해.)
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-4">
                {shopProducts.map((product) => (
                  <ProductCard key={(product as any).id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'followers' && (
          <>
            <h2 className="text-lg font-bold mb-4">팔로워</h2>

            {followers.length === 0 ? (
              <div className="text-sm text-gray-600 border rounded p-4 bg-white">
                아직 팔로워가 없어요.
              </div>
            ) : (
              <div className="space-y-2">
                {followers.map((u) => (
                  <div key={u.id} className="border rounded p-3 bg-white flex items-center justify-between">
                    <Link className="text-sm font-medium hover:underline" to={`/shop/${u.id}`}>
                      {u.nickname}
                    </Link>

                    {/* 내 상점일 때만: 팔로워 관리(삭제) */}
                    {isMyShop && (
                      <button
                        className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                        onClick={() => onRemoveFollower(u.id)}
                      >
                        팔로워 삭제
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'following' && (
          <>
            <h2 className="text-lg font-bold mb-4">팔로잉</h2>

            {following.length === 0 ? (
              <div className="text-sm text-gray-600 border rounded p-4 bg-white">
                아직 팔로잉이 없어요.
              </div>
            ) : (
              <div className="space-y-2">
                {following.map((u) => (
                  <div key={u.id} className="border rounded p-3 bg-white flex items-center justify-between">
                    <Link className="text-sm font-medium hover:underline" to={`/shop/${u.id}`}>
                      {u.nickname}
                    </Link>

                    {/* 관리: 언팔 */}
                    <button
                      className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                      onClick={() => onUnfollow(u.id)}
                    >
                      언팔
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ShopPage;