import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChatRoom, ChatTab } from '../types/chat';
import { fetchTalkRooms, markTalkRoomAsRead } from '../api/chatApi';

type ReadRoomState = Record<string, string>;

const readRoomStateCache: ReadRoomState = {};

const normalizeRoomKey = (roomId: string): string => {
  const match = roomId.match(/^room-(\d+)$/);
  return match?.[1] ?? roomId;
};

const applyReadState = (roomList: ChatRoom[]): ChatRoom[] => {
  return roomList.map((room) => {
    const roomKey = normalizeRoomKey(room.id);
    const readAt = readRoomStateCache[roomKey];
    if (!readAt) return room;

    const roomTs = new Date(room.lastMessageAt).getTime();
    const readTs = new Date(readAt).getTime();
    if (Number.isNaN(roomTs) || Number.isNaN(readTs)) return room;

    if (roomTs <= readTs) {
      return { ...room, unreadCount: 0 };
    }

    return room;
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
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

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
    const nextReadAt = readAt ?? new Date().toISOString();
    readRoomStateCache[normalized] = nextReadAt;
    const nextReadTs = new Date(nextReadAt).getTime();

    setRooms((prev) =>
      prev.map((room) => {
        if (normalizeRoomKey(room.id) !== normalized) return room;
        const roomTs = new Date(room.lastMessageAt).getTime();
        if (Number.isNaN(roomTs) || roomTs <= nextReadTs) {
          return { ...room, unreadCount: 0 };
        }
        return room;
      })
    );
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
        setRooms([]);
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
