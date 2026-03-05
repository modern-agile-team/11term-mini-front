import api from './axios';
import type { Account, FollowUserItem, UserProfile } from '../types/Account';

interface ToggleFollowResponse {
  currentUser: Account;
  targetUserId: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

type FollowListType = 'followers' | 'following';

interface FollowListResponse {
  users: FollowUserItem[];
}

export const followApi = {
  getUserProfile: async (userId: string) => {
    const { data } = await api.get<UserProfile>(`/api/users/${userId}`);
    return data;
  },
  toggleFollow: async (targetUserId: string) => {
    const { data } = await api.post<ToggleFollowResponse>('/api/auth/follow', { targetUserId });
    return data;
  },
  getFollowList: async (userId: string, listType: FollowListType) => {
    const { data } = await api.get<FollowListResponse>(`/api/users/${userId}/${listType}`);
    return data.users || [];
  },
};
