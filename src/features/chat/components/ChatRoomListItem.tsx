import type { ChatRoom } from '../types';
import { formatRoomTime } from '../utils/format';

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
        'flex cursor-pointer items-center gap-3 p-4 hover:bg-gray-50 ' +
        (isSelected ? 'bg-gray-100' : '')
      }
    >
      {/* 프로필 이미지가 없으니 우선 placeholder */}
      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate font-bold">{room.title}</span>
          <span className="flex-shrink-0 text-xs text-gray-400">
            {formatRoomTime(room.lastMessageAt)}
          </span>
        </div>
        <p className="truncate text-sm text-gray-500">{room.lastMessage}</p>
      </div>

      {room.unreadCount > 0 && (
        <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
          {room.unreadCount}
        </span>
      )}
    </div>
  );
};

export default ChatRoomListItem;
