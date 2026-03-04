import api from './axios';

export type ShopSummary = { id: string; nickname: string; avatar?: string };
export type FollowListResponse = { items: ShopSummary[]; total: number };
export type ShopInfoResponse = {
  id: string;
  nickname: string;
  avatar?: string;
  shopIntro?: string;
  followersCount: number;
  followingCount: number;
};
export type FollowStatusResponse = { isFollowing: boolean };
export type FollowActionResponse = {
  isFollowing: boolean;
  followersCount?: number;
  followingCount?: number;
};

export const followApi = {
  me: () => api.get('/users/me').then((r) => r.data as ShopInfoResponse),

  getShop: (userId: string) =>
    api.get(`/users/${userId}/shop`).then((r) => r.data as ShopInfoResponse),

  findByNickname: (nickname: string) =>
    api.get(`/users/by-nickname?nickname=${encodeURIComponent(nickname)}`).then(
      (r) => r.data as ShopInfoResponse,
    ),

  getFollowers: (userId: string) =>
    api.get(`/users/${userId}/followers`).then((r) => r.data as FollowListResponse),

  getFollowing: (userId: string) =>
    api.get(`/users/${userId}/following`).then((r) => r.data as FollowListResponse),

  getFollowStatus: (userId: string) =>
    api.get(`/users/${userId}/follow-status`).then((r) => r.data as FollowStatusResponse),

  follow: (userId: string) =>
    api.post(`/users/${userId}/follow`).then((r) => r.data as FollowActionResponse),

  unfollow: (userId: string) =>
    api.delete(`/users/${userId}/follow`).then((r) => r.data as FollowActionResponse),

  removeFollower: (followerId: string) =>
    api.delete(`/users/${followerId}/remove-follower`).then(
      (r) => r.data as { success: boolean; followersCount: number },
    ),
};