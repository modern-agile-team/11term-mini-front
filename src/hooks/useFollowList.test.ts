import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useFollowList } from './useFollowList';
import { followApi } from '../api/follow';

vi.mock('../api/follow', () => ({
  followApi: {
    getFollowList: vi.fn(),
  },
}));

describe('useFollowList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens modal and loads follower list', async () => {
    vi.mocked(followApi.getFollowList).mockResolvedValueOnce([
      { id: 'user-1', nickname: '팔로워1', avatar: '', shopIntro: '' },
    ]);

    const { result } = renderHook(() => useFollowList());

    await act(async () => {
      await result.current.openFollowListModal('seller-1', 'followers');
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.listType).toBe('followers');
    expect(result.current.followUsers).toHaveLength(1);
    expect(result.current.followUsers[0].id).toBe('user-1');
  });

  it('handles list load failure and keeps modal open with empty users', async () => {
    vi.mocked(followApi.getFollowList).mockRejectedValueOnce(new Error('network'));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    const { result } = renderHook(() => useFollowList());

    await act(async () => {
      await result.current.openFollowListModal('seller-2', 'following');
    });

    await waitFor(() => {
      expect(result.current.isListLoading).toBe(false);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.followUsers).toEqual([]);
    expect(alertSpy).toHaveBeenCalledTimes(1);
  });
});
