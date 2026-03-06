import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChatRoom, ChatTab } from '../types';
import { MOCK_ROOMS } from '../mock';
import { fetchTalkRooms } from '../api/chatApi';

const READ_ROOM_STATE_KEY = 'chatReadRoomState';

const normalizeRoomKey = (roomId: string): string => {
  const match = roomId.match(/^room-(\d+)$/);
  return match?.[1] ?? roomId;
};

type ReadRoomState = Record<string, string>;

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
  const [activeTab, setActiveTab] = useState<ChatTab>('ALL');
  const [rooms, setRooms] = useState<ChatRoom[]>(() => applyReadState(MOCK_ROOMS));

  // 첫 화면에서 첫 방을 기본 선택(없으면 null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    rooms[0]?.id ?? null
  );

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
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const serverRooms = await fetchTalkRooms();
        if (cancelled || serverRooms.length === 0) return;

        setRooms(applyReadState(serverRooms));
        setSelectedRoomId((prev) => {
          if (prev && serverRooms.some((room) => room.id === prev)) return prev;
          return serverRooms[0].id;
        });
      } catch {
        // 서버 로드 실패 시 mock 상태 유지
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
