import { useCallback, useState } from 'react';
import { followApi } from '../api/follow';
import type { FollowUserItem } from '../types/Account';

type FollowListType = 'followers' | 'following';

export const useFollowList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [listType, setListType] = useState<FollowListType>('followers');
  const [followUsers, setFollowUsers] = useState<FollowUserItem[]>([]);

  const closeFollowListModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openFollowListModal = useCallback(async (userId: string, nextListType: FollowListType) => {
    try {
      setIsListLoading(true);
      setListType(nextListType);
      setIsModalOpen(true);
      const users = await followApi.getFollowList(userId, nextListType);
      setFollowUsers(users);
    } catch {
      setFollowUsers([]);
      alert('목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsListLoading(false);
    }
  }, []);

  return {
    isModalOpen,
    isListLoading,
    listType,
    followUsers,
    openFollowListModal,
    closeFollowListModal,
  };
};
