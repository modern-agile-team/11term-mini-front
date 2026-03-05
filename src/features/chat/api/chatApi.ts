import axios from 'axios';
import type { ChatMessage, ChatRoom, ChatTab, SenderType } from '../types';

const chatApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.samgakmarket.shop',
});

chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type TalkRoomResponse = {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  updatedAt: string;
  productTitle: string;
  productPrice: number;
  lastMessage: string;
  unreadCount: number;
};

type TalkMessageResponse = {
  id: string;
  uid: number;
  content: string;
  createdAt: string;
};

type TalkMessageListResponse = {
  data: TalkMessageResponse[];
  cursor: string | null;
};

const getCurrentUserId = (): number | null => {
  const raw = localStorage.getItem('currentUser');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { id?: number; userId?: number };
    return parsed.id ?? parsed.userId ?? null;
  } catch {
    return null;
  }
};

const mapRoomToTab = (room: TalkRoomResponse): ChatTab => {
  if (room.unreadCount > 0) return 'CONTACTING';
  return 'IN_PROGRESS';
};

const mapSenderType = (uid: number): SenderType => {
  const me = getCurrentUserId();
  if (me === null) return 'other';
  return uid === me ? 'me' : 'other';
};

export const fetchTalkRooms = async (): Promise<ChatRoom[]> => {
  const { data } = await chatApi.get<TalkRoomResponse[]>('/talks/rooms');

  return data.map((room) => ({
    id: String(room.id),
    channel: 'BUNGGAETALK',
    title: room.productTitle,
    tab: mapRoomToTab(room),
    lastMessage: room.lastMessage ?? '',
    lastMessageAt: room.updatedAt,
    unreadCount: room.unreadCount ?? 0,
  }));
};

export const fetchRoomMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const { data } = await chatApi.get<TalkMessageListResponse>(`/talks/rooms/${roomId}/messages`);
  const messages = Array.isArray(data?.data) ? data.data : [];

  return messages.map((message) => ({
    id: message.id,
    roomId,
    senderType: mapSenderType(message.uid),
    content: message.content,
    createdAt: message.createdAt,
  }));
};

export const sendRoomMessage = async (roomId: string, content: string): Promise<void> => {
  await chatApi.post(`/talks/rooms/${roomId}/messages`, {
    content,
    messageType: 0,
    extra: '{}',
  });
};
