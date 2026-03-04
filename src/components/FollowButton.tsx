import { useEffect, useState } from 'react';
import { followApi } from '../api/follow';

type Props = {
  userId: string; // 팔로우 대상(상점 주인)
  onChangeFollowersCount?: (count: number) => void; // 상단 카운트 갱신용(선택)
};

const FollowButton = ({ userId, onChangeFollowersCount }: Props) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    followApi
      .getFollowStatus(userId)
      .then((res) => {
        if (!alive) return;
        setIsFollowing(res.isFollowing);
      })
      .catch(() => {
        // 로그인 안했으면 401일 수 있음 -> 버튼은 기본 팔로우로 두되 클릭 시 처리
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [userId]);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = isFollowing ? await followApi.unfollow(userId) : await followApi.follow(userId);
      setIsFollowing(res.isFollowing);

      if (typeof res.followersCount === 'number') {
        onChangeFollowersCount?.(res.followersCount);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm border ${
        isFollowing ? 'bg-white text-gray-800' : 'bg-black text-white'
      }`}
    >
      {loading ? '...' : isFollowing ? '팔로잉' : '팔로우'}
    </button>
  );
};

export default FollowButton;