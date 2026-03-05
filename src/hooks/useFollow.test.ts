import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFollow } from './useFollow';
import { followApi } from '../api/follow';
import { useAuth } from './useAuth';

vi.mock('../api/follow', () => ({
  followApi: {
    getUserProfile: vi.fn(),
    toggleFollow: vi.fn(),
  },
}));

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useFollow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(useAuth).mockReturnValue({
      userInfo: { id: 'viewer-1' },
      requireAuth: vi.fn(() => true),
    } as unknown as ReturnType<typeof useAuth>);
  });

  it('loads seller profile and computes canFollow', async () => {
    vi.mocked(followApi.getUserProfile).mockResolvedValueOnce({
      id: 'seller-1',
      nickname: '판매자',
      avatar: '',
      shopIntro: '',
      followerCount: 3,
      followingCount: 2,
      isFollowing: false,
    });

    const { result } = renderHook(() => useFollow('seller-1'));

    await waitFor(() => {
      expect(result.current.sellerProfile?.id).toBe('seller-1');
    });

    expect(result.current.canFollow).toBe(true);
    expect(result.current.isProfileLoading).toBe(false);
  });

  it('toggles follow and syncs current user storage', async () => {
    const requireAuthMock = vi.fn(() => true);
    vi.mocked(useAuth).mockReturnValue({
      userInfo: { id: 'viewer-1' },
      requireAuth: requireAuthMock,
    } as unknown as ReturnType<typeof useAuth>);

    vi.mocked(followApi.getUserProfile).mockResolvedValueOnce({
      id: 'seller-1',
      nickname: '판매자',
      avatar: '',
      shopIntro: '',
      followerCount: 1,
      followingCount: 0,
      isFollowing: false,
    });

    vi.mocked(followApi.toggleFollow).mockResolvedValueOnce({
      currentUser: {
        id: 'viewer-1',
        email: 'viewer@test.com',
        name: 'viewer',
        phone: '01012345678',
        avatar: '',
        joinDate: '2026. 3. 5.',
        birth: '19990101',
        nickname: 'viewer',
        shopIntro: '',
        wishList: [],
        followers: [],
        following: ['seller-1'],
        createdAt: new Date().toISOString(),
      },
      targetUserId: 'seller-1',
      isFollowing: true,
      followerCount: 2,
      followingCount: 0,
    });

    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
    const { result } = renderHook(() => useFollow('seller-1'));

    await waitFor(() => {
      expect(result.current.sellerProfile?.id).toBe('seller-1');
    });

    await act(async () => {
      await result.current.toggleSellerFollow();
    });

    expect(requireAuthMock).toHaveBeenCalledTimes(1);
    expect(followApi.toggleFollow).toHaveBeenCalledWith('seller-1');
    expect(result.current.sellerProfile?.isFollowing).toBe(true);
    expect(result.current.sellerProfile?.followerCount).toBe(2);
    expect(localStorage.getItem('currentUser')).toContain('"viewer-1"');
    expect(dispatchEventSpy).toHaveBeenCalled();
  });
});
