import { useEffect } from 'react';
import { ChevronDown, CircleHelp, MessageCircle, MoreHorizontal } from 'lucide-react';

import { useChatRooms } from '../../hooks/useChatRooms';
import { useChatMessages } from '../../hooks/useChatMessages';
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
    <div className="mx-auto w-full max-w-[1000px] px-0 [font-family:'Apple_SD_Gothic_Neo','Noto_Sans_KR',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      <div className="flex h-[calc(100vh-202px)] overflow-hidden border-x border-[#e5e5e5] bg-white">
        {/* 좌측: 대화 목록 */}
        <aside className="flex w-[420px] flex-col border-r border-[#e8e8e8] bg-white">
          <div className="border-b border-[#efefef] px-4 pb-2.5 pt-3">
            <div className="mb-3 inline-flex items-center gap-1 text-[32px] font-bold text-[#222]">
              <span>전체 대화</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <ChatTabBar activeTab={activeTab} onChange={setActiveTab} />
              <CircleHelp size={14} className="mb-1.5 text-gray-300" />
            </div>
          </div>

          <ChatRoomList
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
          />
        </aside>

        {/* 우측: 대화 상세 */}
        <section className="flex flex-1 flex-col bg-[#f8f8f8]">
          {selectedRoom ? (
            <>
              <div className="flex items-center justify-between border-b border-[#ececec] bg-white px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold text-[#222]">{selectedRoom.title}</div>
                </div>
                <MoreHorizontal size={18} className="cursor-pointer text-gray-400" />
              </div>

              <ChatThread messages={messages} />

              <ChatComposer
                key={selectedRoomId ?? 'no-room'}
                value={draft}
                onChange={setDraft}
                onSend={sendMessage}
                disabled={!selectedRoomId}
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-[#222]">
              <MessageCircle size={66} strokeWidth={1.6} className="mb-5 text-[#cdcdcd]" />
              <p className="text-[32px] font-semibold">대화방을 선택해주세요</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChatPageView;
