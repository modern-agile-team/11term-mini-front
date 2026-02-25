import { useMemo, useState } from 'react';
import type { ChatRoom, ChatTab } from '../types';
import { MOCK_ROOMS } from '../mock';

/**
 * useChatRooms
 *
 * ✅ 원리: "채팅방 목록"에 필요한 상태/로직을 UI에서 분리
 * - UI 컴포넌트는 rooms / selectedRoom 같은 결과만 받아서 그리기만 함
 * - 나중에 서버 붙일 때도 이 훅만 바꾸면 UI는 거의 그대로 유지 가능
 */
export function useChatRooms() {
  const [activeTab, setActiveTab] = useState<ChatTab>('ALL');

  // 첫 화면에서 첫 방을 기본 선택(없으면 null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    MOCK_ROOMS[0]?.id ?? null
  );

  // 지금은 mock, 나중에 API 붙이면 여기서 받아오게 바뀜
  const rooms: ChatRoom[] = MOCK_ROOMS;

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
    setSelectedRoomId,
    selectedRoom,
  };
}
