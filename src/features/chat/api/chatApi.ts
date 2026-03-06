import type { ChatMessage, ChatRoom, ChatTab, SenderType } from '../types';
import api from '../../../api/axios';

interface TalkRoomResponse {
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

interface TalkMessageResponse  {
  id: string;
  uid: number;
  content: string;
  createdAt: string;
};

interface TalkMessageListResponse  {
  data: TalkMessageResponse[];
  cursor: string | null;
};

interface ApiEnvelope<T> {
  data: T;
}

const ANON_CHAT_USER_KEY = 'anonChatUserId';

const unwrapApiData = <T>(payload: T | ApiEnvelope<T>): T => {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    (payload as ApiEnvelope<T>).data !== undefined
  ) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

const normalizeMessageList = (
  payload: TalkMessageListResponse | ApiEnvelope<TalkMessageListResponse>
): TalkMessageListResponse => {
  if (Array.isArray((payload as TalkMessageListResponse).data)) {
    return payload as TalkMessageListResponse;
  }

  const wrapped = payload as ApiEnvelope<TalkMessageListResponse>;
  if (wrapped.data && Array.isArray(wrapped.data.data)) {
    return wrapped.data;
  }

  return { data: [], cursor: null };
};

const parseUserId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const getOrCreateAnonymousUserId = (): number => {
  const existing = localStorage.getItem(ANON_CHAT_USER_KEY);
  const parsedExisting = parseUserId(existing);
  if (parsedExisting !== null) return parsedExisting;

  const generated = Date.now();
  localStorage.setItem(ANON_CHAT_USER_KEY, String(generated));
  return generated;
};

const getCurrentUserId = (): number | null => {
  const raw = localStorage.getItem('currentUser');
  if (!raw) return getOrCreateAnonymousUserId();

  try {
    const parsed = JSON.parse(raw) as { id?: unknown; userId?: unknown };
    return parseUserId(parsed.id) ?? parseUserId(parsed.userId) ?? getOrCreateAnonymousUserId();
  } catch {
    return getOrCreateAnonymousUserId();
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
  const { data } = await api.get<TalkRoomResponse[] | ApiEnvelope<TalkRoomResponse[]>>(
    '/talks/rooms'
  );
  const rooms = unwrapApiData<TalkRoomResponse[]>(data);

  return rooms.map((room) => ({
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
  const { data } = await api.get<
    TalkMessageListResponse | ApiEnvelope<TalkMessageListResponse>
  >(`/talks/rooms/${roomId}/messages`);
  const normalized = normalizeMessageList(data);
  const messages = Array.isArray(normalized?.data) ? normalized.data : [];

  return messages.map((message) => ({
    id: message.id,
    roomId,
    senderType: mapSenderType(message.uid),
    content: message.content,
    createdAt: message.createdAt,
  }));
};

export const sendRoomMessage = async (roomId: string, content: string): Promise<void> => {
  await api.post(`/talks/rooms/${roomId}/messages`, {
    content,
    messageType: 0,
    extra: '{}',
  });
};
