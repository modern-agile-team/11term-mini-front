import { useEffect } from 'react';
import { MoreHorizontal, Search } from 'lucide-react';

import { useChatRooms } from '../hooks/useChatRooms';
import { useChatMessages } from '../hooks/useChatMessages';
import ChatTabBar from './ChatTabBar';
import ChatRoomList from './ChatRoomList';
import ChatThread from './ChatThread';
import ChatComposer from './ChatComposer';

/**
 * ChatPageView
 *
 * ✅ 원리: 이 컴포넌트는 "레이아웃 조립"만 담당
 * - 상태/로직: hooks (useChatRooms, useChatMessages)
 * - 보여주기: 아래 자식 컴포넌트들
 *
 * 이렇게 나누면:
 * - UI 디자인 바꿀 때: components만 수정
 * - 데이터/API 붙일 때: hooks만 수정
 */
const ChatPageView = () => {
  const {
    activeTab,
    setActiveTab,
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    syncRoomPreview,
    markRoomAsRead,
  } = useChatRooms();

  const { messages, draft, setDraft, sendMessage } = useChatMessages(selectedRoomId);

  useEffect(() => {
    if (!selectedRoomId || messages.length === 0) return;
    const latest = messages[messages.length - 1];
    syncRoomPreview(selectedRoomId, {
      lastMessage: latest.content,
      lastMessageAt: latest.createdAt,
    });
    markRoomAsRead(selectedRoomId);
  }, [markRoomAsRead, messages, selectedRoomId, syncRoomPreview]);

  return (
    // App.tsx에서 Header가 위에 있으니, 여기서는 화면 높이에서 Footer와 겹치지 않게
    // "min-h" 대신 "h"를 사용해 스크롤은 내부 영역에서만 나게 함.
    <div className="mx-4 my-2 flex h-[calc(100vh-140px)] overflow-hidden rounded-lg border bg-white">
      {/* 좌측: 목록 */}
      <aside className="flex w-80 flex-col border-r">
        <div className="p-4">
          <h2 className="mb-4 text-xl font-bold">전체 대화</h2>
          <ChatTabBar activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <ChatRoomList
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
        />
      </aside>

      {/* 우측: 대화 상세 */}
      <section className="flex flex-1 flex-col bg-gray-50">
        {selectedRoom ? (
          <>
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between border-b bg-white p-4">
              <div className="min-w-0">
                <div className="truncate font-bold">{selectedRoom.title}</div>
                {/* 나중에 linkedInquiries 같은 정보도 여기서 노출 가능 */}
              </div>
              <MoreHorizontal className="cursor-pointer text-gray-400" />
            </div>

            {/* 메시지 영역 */}
            <ChatThread messages={messages} />

            {/* 입력 영역 */}
            <ChatComposer
              key={selectedRoomId ?? 'no-room'}
              value={draft}
              onChange={setDraft}
              onSend={sendMessage}
              disabled={!selectedRoomId}
            />
          </>
        ) : (
          // 아무 방도 선택 안 했을 때
          <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <Search size={32} />
            </div>
            <p>대화방을 선택해주세요</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPageView;
