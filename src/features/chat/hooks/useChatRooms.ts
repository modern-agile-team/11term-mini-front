import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChatRoom, ChatTab } from '../types';
import { fetchTalkRooms, markTalkRoomAsRead } from '../api/chatApi';

const READ_ROOM_STATE_KEY = 'chatReadRoomState';
const CHAT_ROOMS_STORAGE_KEY = 'chatRoomsState';
const CHAT_ACTIVE_TAB_STORAGE_KEY = 'chatActiveTab';
const CHAT_SELECTED_ROOM_STORAGE_KEY = 'chatSelectedRoomId';

const normalizeRoomKey = (roomId: string): string => {
  const match = roomId.match(/^room-(\d+)$/);
  return match?.[1] ?? roomId;
};

type ReadRoomState = Record<string, string>;

const isChatTab = (value: unknown): value is ChatTab => {
  return (
    value === 'ALL' ||
    value === 'WAITING' ||
    value === 'IN_PROGRESS' ||
    value === 'CLOSED' ||
    value === 'CONTACTING'
  );
};

const isChatRoom = (value: unknown): value is ChatRoom => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ChatRoom>;

  return (
    typeof candidate.id === 'string' &&
    candidate.channel === 'BUNGGAETALK' &&
    typeof candidate.title === 'string' &&
    isChatTab(candidate.tab) &&
    typeof candidate.lastMessage === 'string' &&
    typeof candidate.lastMessageAt === 'string' &&
    typeof candidate.unreadCount === 'number'
  );
};

const isPersistableRoomId = (roomId: string): boolean => !roomId.startsWith('room-');

const getStoredReadRoomState = (): ReadRoomState => {
  const raw = localStorage.getItem(READ_ROOM_STATE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const entries = Object.entries(parsed as Record<string, unknown>)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [normalizeRoomKey(key), String(value)]);

    return Object.fromEntries(entries);
  } catch {
    return {};
  }
};

const persistReadRoomState = (state: ReadRoomState) => {
  localStorage.setItem(READ_ROOM_STATE_KEY, JSON.stringify(state));
};

const readStoredRooms = (): ChatRoom[] | null => {
  const raw = localStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const rooms = parsed.filter(isChatRoom).filter((room) => isPersistableRoomId(room.id));
    return rooms.length > 0 ? rooms : null;
  } catch {
    return null;
  }
};

const readStoredActiveTab = (): ChatTab => {
  const raw = localStorage.getItem(CHAT_ACTIVE_TAB_STORAGE_KEY);
  return isChatTab(raw) ? raw : 'ALL';
};

const readStoredSelectedRoomId = (): string | null => {
  const raw = localStorage.getItem(CHAT_SELECTED_ROOM_STORAGE_KEY);
  if (typeof raw !== 'string' || raw.trim() === '' || !isPersistableRoomId(raw)) return null;
  return raw;
};

const applyReadState = (roomList: ChatRoom[]): ChatRoom[] => {
  const readRoomState = getStoredReadRoomState();
  return roomList.map((room) => {
    const roomKey = normalizeRoomKey(room.id);
    const readAt = readRoomState[roomKey];
    if (!readAt) return room;

    const roomTs = new Date(room.lastMessageAt).getTime();
    const readTs = new Date(readAt).getTime();
    if (Number.isNaN(roomTs) || Number.isNaN(readTs)) return room;

    // 마지막 읽은 시각 이후 새 메시지가 있으면 배지를 다시 노출
    if (roomTs > readTs) {
      return {
        ...room,
        unreadCount: room.unreadCount > 0 ? room.unreadCount : 1,
      };
    }

    return { ...room, unreadCount: 0 };
  });
};

/**
 * useChatRooms
 *
 * ✅ 원리: "채팅방 목록"에 필요한 상태/로직을 UI에서 분리
 * - UI 컴포넌트는 rooms / selectedRoom 같은 결과만 받아서 그리기만 함
 * - 나중에 서버 붙일 때도 이 훅만 바꾸면 UI는 거의 그대로 유지 가능
 */
export const useChatRooms = () => {
  const [activeTab, setActiveTab] = useState<ChatTab>(() => readStoredActiveTab());
  const [rooms, setRooms] = useState<ChatRoom[]>(() => applyReadState(readStoredRooms() ?? []));

  // 첫 화면은 방 선택 없이 "대화방을 선택해주세요" 상태로 시작
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(() => readStoredSelectedRoomId());

  // 탭 필터링 결과(rooms가 커지면 매 렌더마다 필터링하지 않게 useMemo)
  const filteredRooms = useMemo(() => {
    if (activeTab === 'ALL') return rooms;
    return rooms.filter((r) => r.tab === activeTab);
  }, [rooms, activeTab]);

  // 선택된 방(우측 헤더/메시지에 사용)
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) ?? null;
  }, [rooms, selectedRoomId]);

  const markRoomAsRead = useCallback((roomId: string, readAt?: string) => {
    const normalized = normalizeRoomKey(roomId);
    const current = getStoredReadRoomState();
    current[normalized] = readAt ?? new Date().toISOString();
    persistReadRoomState(current);
  }, []);

  const enterRoom = (roomId: string) => {
    const normalized = normalizeRoomKey(roomId);
    markRoomAsRead(normalized);
    markTalkRoomAsRead(roomId);

    setSelectedRoomId(roomId);

    // 들어가는 순간 안읽음 제거
    setRooms((prev) =>
      prev.map((r) =>
        normalizeRoomKey(r.id) === normalized ? { ...r, unreadCount: 0 } : r
      )
    );
  };

  const syncRoomPreview = useCallback(
    (roomId: string, payload: { lastMessage: string; lastMessageAt: string }) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                lastMessage: payload.lastMessage,
                lastMessageAt: payload.lastMessageAt,
              }
            : room
        )
      );
    },
    []
  );

  useEffect(() => {
    localStorage.setItem(CHAT_ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(CHAT_ACTIVE_TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!selectedRoomId) {
      localStorage.removeItem(CHAT_SELECTED_ROOM_STORAGE_KEY);
      return;
    }
    localStorage.setItem(CHAT_SELECTED_ROOM_STORAGE_KEY, selectedRoomId);
  }, [selectedRoomId]);

  useEffect(() => {
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const serverRooms = await fetchTalkRooms();
        if (cancelled) return;

        setRooms(applyReadState(serverRooms));
        setSelectedRoomId((prev) => {
          if (!prev) return null;
          if (serverRooms.some((room) => room.id === prev)) return prev;
          return null;
        });
      } catch {
        if (cancelled) return;
        setRooms((prev) => applyReadState(prev.filter((room) => isPersistableRoomId(room.id))));
      }
    };

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    rooms: filteredRooms,
    selectedRoomId,
    setSelectedRoomId: enterRoom,
    selectedRoom,
    syncRoomPreview,
    markRoomAsRead,
  };
};
