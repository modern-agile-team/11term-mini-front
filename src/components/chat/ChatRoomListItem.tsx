import type { ChatRoom } from '../../types/chat';
import { formatRoomTime } from '../../utils/chatFormat';

/**
 * ChatRoomListItem
 *
 * ✅ 원리: "채팅방 1줄" UI만 담당
 * - 클릭/선택 상태는 props로 받음
 */
const ChatRoomListItem = ({
  room,
  isSelected,
  onClick,
}: {
  room: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={
        'flex cursor-pointer items-center gap-2.5 px-4 py-2.5 hover:bg-[#fafafa] ' +
        (isSelected ? 'bg-[#f3f3f3]' : '')
      }
    >
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200" />

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 truncate text-[15px] font-bold leading-tight text-[#222]">{room.title}</div>
        <p className="truncate text-[12px] text-gray-500">
          {room.lastMessage} · {formatRoomTime(room.lastMessageAt)}
        </p>
      </div>

      <div className="ml-2 flex flex-col items-end gap-1.5">
        {room.unreadCount > 0 && (
          <span className="rounded-full bg-[#d6001c] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {room.unreadCount}
          </span>
        )}
        <div className="h-6 w-6 rounded bg-gray-300" />
      </div>
    </div>
  );
};

export default ChatRoomListItem;
