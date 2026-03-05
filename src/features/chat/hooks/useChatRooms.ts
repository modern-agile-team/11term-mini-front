import { useEffect, useMemo, useState } from 'react';
import type { ChatRoom, ChatTab } from '../types';
import { MOCK_ROOMS } from '../mock';
import { fetchTalkRooms } from '../api/chatApi';

const CHAT_ROOMS_STORAGE_KEY = 'chat_rooms_state';

const getInitialRooms = (): ChatRoom[] => {
  if (typeof window === 'undefined') return MOCK_ROOMS;

  const raw = window.localStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
  if (!raw) return MOCK_ROOMS;

  try {
    const parsed = JSON.parse(raw) as ChatRoom[];
    return Array.isArray(parsed) ? parsed : MOCK_ROOMS;
  } catch {
    return MOCK_ROOMS;
  }
};

/**
 * useChatRooms
 *
 * ✅ 원리: "채팅방 목록"에 필요한 상태/로직을 UI에서 분리
 * - UI 컴포넌트는 rooms / selectedRoom 같은 결과만 받아서 그리기만 함
 * - 나중에 서버 붙일 때도 이 훅만 바꾸면 UI는 거의 그대로 유지 가능
 */
export function useChatRooms() {
  const [activeTab, setActiveTab] = useState<ChatTab>('ALL');
  const [rooms, setRooms] = useState<ChatRoom[]>(() => getInitialRooms());

  // 첫 화면에서 첫 방을 기본 선택(없으면 null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    () => getInitialRooms()[0]?.id ?? null
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CHAT_ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const serverRooms = await fetchTalkRooms();
        if (cancelled) return;

        setRooms(serverRooms);
        if (serverRooms.length > 0) {
          setSelectedRoomId((prev) => prev ?? serverRooms[0].id);
        }
      } catch {
        // 서버 실패 시 기존 mock/localStorage 데이터 사용
      }
    };

    loadRooms();
    const timer = window.setInterval(loadRooms, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const selectRoom = (id: string) => {
    setSelectedRoomId(id);
    setRooms((prev) =>
      prev.map((room) => (room.id === id ? { ...room, unreadCount: 0 } : room))
    );
  };

  // 탭 필터링 결과(rooms가 커지면 매 렌더마다 필터링하지 않게 useMemo)
  const filteredRooms = useMemo(() => {
    if (activeTab === 'ALL') return rooms;
    return rooms.filter((r) => r.tab === activeTab);
  }, [rooms, activeTab]);

  // 선택된 방(우측 헤더/메시지에 사용)
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) ?? null;
  }, [rooms, selectedRoomId]);

  return {
    activeTab,
    setActiveTab,
    rooms: filteredRooms,
    selectedRoomId,
    setSelectedRoomId: selectRoom,
    selectedRoom,
  };
}
