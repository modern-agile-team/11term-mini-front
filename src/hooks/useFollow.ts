import { useCallback, useEffect, useState } from 'react';
import { followApi } from '../api/follow';
import { useAuth } from './useAuth';
import type { Account, UserProfile } from '../types/Account';

const normalizeAccount = (user: Account): Account => ({
  ...user,
  avatar: user.avatar || '',
  shopIntro: user.shopIntro || '',
  wishList: Array.isArray(user.wishList) ? user.wishList : [],
  followers: Array.isArray(user.followers) ? user.followers : [],
  following: Array.isArray(user.following) ? user.following : [],
  createdAt: user.createdAt || new Date().toISOString(),
});

export const useFollow = (sellerId?: string) => {
  const { userInfo, requireAuth } = useAuth();

  const [sellerProfile, setSellerProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isFollowPending, setIsFollowPending] = useState(false);

  useEffect(() => {
    let isCanceled = false;

    const fetchProfile = async () => {
      if (!sellerId) {
        if (!isCanceled) setSellerProfile(null);
        return;
      }

      try {
        setIsProfileLoading(true);
        const profile = await followApi.getUserProfile(sellerId);
        if (!isCanceled) setSellerProfile(profile);
      } catch {
        if (!isCanceled) setSellerProfile(null);
      } finally {
        if (!isCanceled) setIsProfileLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isCanceled = true;
    };
  }, [sellerId, userInfo?.id]);

  const toggleSellerFollow = useCallback(async () => {
    if (!sellerProfile?.id) return;
    if (!requireAuth()) return;

    try {
      setIsFollowPending(true);
      const response = await followApi.toggleFollow(sellerProfile.id);

      if (response.currentUser) {
        const normalizedCurrentUser = normalizeAccount(response.currentUser);
        localStorage.setItem('currentUser', JSON.stringify(normalizedCurrentUser));
        window.dispatchEvent(new Event('auth-change'));
      }

      setSellerProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: response.isFollowing,
              followerCount: response.followerCount,
              followingCount: response.followingCount,
            }
          : prev,
      );
    } finally {
      setIsFollowPending(false);
    }
  }, [requireAuth, sellerProfile]);

  const canFollow = !userInfo || !sellerProfile || userInfo.id !== sellerProfile.id;

  return {
    sellerProfile,
    isProfileLoading,
    isFollowPending,
    canFollow,
    toggleSellerFollow,
  };
};
