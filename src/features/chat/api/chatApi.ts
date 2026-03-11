import type { ChatMessage, ChatRoom, ChatTab, SenderType } from '../types';
import api from '../../../api/axios';

export interface TalkRoomResponse {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  updatedAt: string;
  productTitle: string;
  productPrice: number;
  lastMessage: string;
  unreadCount: number;
}

export interface TalkMessageResponse {
  id: string;
  uid: number;
  content: string;
  extra: string;
  messageType: number;
  additionalInfo: unknown;
  createdAt: string;
  visibility: 'ALL' | 'ME' | 'OTHER';
}

export interface TalkMessageListResponse {
  readableStartAt: string;
  otherLastMsgCreatedAt: string;
  minMessageDateGuide: string | null;
  minMessageDate: string;
  data: TalkMessageResponse[];
  cursor: string | null;
}

interface ApiEnvelope<T> {
  data: T;
}

export interface ChatMessageListResult {
  messages: ChatMessage[];
  cursor: string | null;
  readableStartAt: string;
  otherLastMsgCreatedAt: string;
  minMessageDateGuide: string | null;
  minMessageDate: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  sub?: CategoryResponse[];
}

interface SendMessagePayload {
  roomId: number;
  content: string;
  messageType: number;
  extra: string;
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
  const fallback: TalkMessageListResponse = {
    readableStartAt: new Date(0).toISOString(),
    otherLastMsgCreatedAt: new Date(0).toISOString(),
    minMessageDateGuide: null,
    minMessageDate: new Date(0).toISOString(),
    data: [],
    cursor: null,
  };

  const direct = payload as TalkMessageListResponse;
  if (direct && Array.isArray(direct.data)) {
    return { ...fallback, ...direct };
  }

  const wrapped = payload as ApiEnvelope<TalkMessageListResponse>;
  if (wrapped.data && Array.isArray(wrapped.data.data)) {
    return { ...fallback, ...wrapped.data };
  }

  return fallback;
};

const parseUserId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const parseRoomId = (roomId: string): number | null => {
  if (/^\d+$/.test(roomId)) return Number(roomId);
  const match = roomId.match(/^room-(\d+)$/);
  if (!match) return null;
  return Number(match[1]);
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

type TalkSocketLike = {
  emit: (event: string, payload: unknown) => void;
  on: (event: string, handler: (payload: unknown) => void) => void;
  off: (event: string, handler: (payload: unknown) => void) => void;
};

const getTalkSocket = (): TalkSocketLike | null => {
  if (typeof window === 'undefined') return null;
  const socketCandidate = (window as Window & { __talkSocket?: unknown }).__talkSocket;
  if (
    socketCandidate &&
    typeof socketCandidate === 'object' &&
    'emit' in socketCandidate &&
    'on' in socketCandidate &&
    'off' in socketCandidate &&
    typeof (socketCandidate as { emit?: unknown }).emit === 'function' &&
    typeof (socketCandidate as { on?: unknown }).on === 'function' &&
    typeof (socketCandidate as { off?: unknown }).off === 'function'
  ) {
    return socketCandidate as TalkSocketLike;
  }
  return null;
};

const parseMessageFromSocketPayload = (payload: unknown, roomId: string): ChatMessage | null => {
  const obj =
    payload && typeof payload === 'object' && 'message' in payload
      ? (payload as { message?: unknown }).message
      : payload;

  if (!obj || typeof obj !== 'object') return null;
  const record = obj as Record<string, unknown>;
  const content = typeof record.content === 'string' ? record.content : null;
  if (!content) return null;

  const idRaw = record.id;
  const uidRaw = record.uid;
  const createdAtRaw = record.createdAt;
  const extraRaw = record.extra;
  const messageTypeRaw = record.messageType;
  const visibilityRaw = record.visibility;

  const parsedUid = parseUserId(uidRaw);
  const messageId =
    typeof idRaw === 'string' && idRaw.trim() !== '' ? idRaw : `socket-${Date.now()}-${content}`;

  return {
    id: messageId,
    roomId,
    senderType: parsedUid !== null ? mapSenderType(parsedUid) : 'other',
    content,
    createdAt: typeof createdAtRaw === 'string' ? createdAtRaw : new Date().toISOString(),
    uid: parsedUid ?? undefined,
    extra: typeof extraRaw === 'string' ? extraRaw : '{}',
    messageType: typeof messageTypeRaw === 'number' ? messageTypeRaw : 0,
    additionalInfo: record.additionalInfo ?? null,
    visibility:
      visibilityRaw === 'ALL' || visibilityRaw === 'ME' || visibilityRaw === 'OTHER'
        ? visibilityRaw
        : 'ALL',
  };
};

const emitTalkEvent = (event: 'join_room' | 'send_message' | 'read_messages', payload: unknown): boolean => {
  const socket = getTalkSocket();
  if (socket) {
    socket.emit(event, payload);
    return true;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`talk:${event}`, { detail: payload }));
  }

  return false;
};

export const fetchTalkRooms = async (): Promise<ChatRoom[]> => {
  const { data } = await api.get<TalkRoomResponse[] | ApiEnvelope<TalkRoomResponse[]>>('/talks/rooms');
  const rooms = unwrapApiData<TalkRoomResponse[]>(data);

  return rooms.map((room) => ({
    id: String(room.id),
    channel: 'BUNGGAETALK',
    title: room.productTitle,
    tab: mapRoomToTab(room),
    productId: room.productId,
    productPrice: room.productPrice,
    buyerId: room.buyerId,
    sellerId: room.sellerId,
    lastMessage: room.lastMessage ?? '',
    lastMessageAt: room.updatedAt,
    unreadCount: room.unreadCount ?? 0,
  }));
};

export const createTalkRoom = async (productId: number): Promise<number | null> => {
  const { data } = await api.post('/talks/rooms', { productId });
  const unwrapped = unwrapApiData<unknown>(data as unknown);

  if (unwrapped && typeof unwrapped === 'object' && 'id' in unwrapped) {
    const maybeId = parseUserId((unwrapped as { id?: unknown }).id);
    return maybeId;
  }

  return null;
};

export const fetchRoomMessages = async (
  roomId: string,
  cursor?: string | null
): Promise<ChatMessageListResult> => {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;

  const { data } = await api.get<TalkMessageListResponse | ApiEnvelope<TalkMessageListResponse>>(
    `/talks/rooms/${roomId}/messages`,
    { params }
  );

  const normalized = normalizeMessageList(data);
  const messages = Array.isArray(normalized.data) ? normalized.data : [];

  return {
    messages: messages.map((message) => ({
      id: message.id,
      roomId,
      senderType: mapSenderType(message.uid),
      content: message.content,
      createdAt: message.createdAt,
      uid: message.uid,
      extra: message.extra,
      messageType: message.messageType,
      additionalInfo: message.additionalInfo,
      visibility: message.visibility,
    })),
    cursor: normalized.cursor,
    readableStartAt: normalized.readableStartAt,
    otherLastMsgCreatedAt: normalized.otherLastMsgCreatedAt,
    minMessageDateGuide: normalized.minMessageDateGuide,
    minMessageDate: normalized.minMessageDate,
  };
};

export const joinTalkRoom = (roomId: string): void => {
  const parsed = parseRoomId(roomId);
  if (parsed === null) return;
  emitTalkEvent('join_room', { roomId: parsed });
};

export const markTalkRoomAsRead = (roomId: string): void => {
  const parsed = parseRoomId(roomId);
  if (parsed === null) return;
  emitTalkEvent('read_messages', { roomId: parsed });
};

export const sendRoomMessage = async (
  roomId: string,
  content: string,
  options?: { messageType?: number; extra?: string }
): Promise<void> => {
  const parsed = parseRoomId(roomId);
  const payload: SendMessagePayload = {
    roomId: parsed ?? Number(roomId),
    content,
    messageType: options?.messageType ?? 0,
    extra: options?.extra ?? '{}',
  };

  const emitted = Number.isFinite(payload.roomId) ? emitTalkEvent('send_message', payload) : false;
  if (emitted) return;

  // 소켓이 없는 개발/테스트 환경에서는 REST fallback을 사용한다.
  await api.post(`/talks/rooms/${roomId}/messages`, {
    content: payload.content,
    messageType: payload.messageType,
    extra: payload.extra,
  });
};

export const uploadTalkImage = async (imageUrl: string): Promise<string> => {
  const { data } = await api.post<{ imageUrl?: string } | ApiEnvelope<{ imageUrl?: string }>>(
    '/talks/upload',
    { imageUrl }
  );
  const unwrapped = unwrapApiData<{ imageUrl?: string }>(data);
  return unwrapped.imageUrl ?? imageUrl;
};

export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  const { data } = await api.get<CategoryResponse[] | ApiEnvelope<CategoryResponse[]>>('/categories');
  return unwrapApiData<CategoryResponse[]>(data);
};

export const subscribeRoomMessages = (
  roomId: string,
  onMessage: (message: ChatMessage) => void
): (() => void) => {
  const socket = getTalkSocket();
  const eventNames = ['new_message', 'message', 'talk_message'];
  const parseRoom = parseRoomId(roomId);

  const handler = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return;

    const payloadRoomRaw = (payload as { roomId?: unknown }).roomId;
    const payloadRoomId = parseUserId(payloadRoomRaw);
    if (parseRoom !== null && payloadRoomId !== null && payloadRoomId !== parseRoom) return;

    const parsed = parseMessageFromSocketPayload(payload, roomId);
    if (!parsed) return;
    onMessage(parsed);
  };

  if (socket) {
    eventNames.forEach((eventName) => socket.on(eventName, handler));
    return () => {
      eventNames.forEach((eventName) => socket.off(eventName, handler));
    };
  }

  if (typeof window === 'undefined') return () => {};

  const fallbackEvent = 'talk:new_message';
  const fallbackHandler = (event: Event) => {
    const custom = event as CustomEvent<unknown>;
    handler(custom.detail);
  };
  window.addEventListener(fallbackEvent, fallbackHandler);

  return () => {
    window.removeEventListener(fallbackEvent, fallbackHandler);
  };
};
