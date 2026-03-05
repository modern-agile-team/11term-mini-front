import type { ChatRoom } from '../types';
import ChatRoomListItem from './ChatRoomListItem';

/**
 * ChatRoomList
 *
 * ✅ 원리: "목록 컨테이너"는 스크롤/배치만 담당
 * - 아이템 렌더링은 ChatRoomListItem로 분리
 */
const ChatRoomList = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
}: {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (id: string) => void;
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {rooms.map((room) => (
        <ChatRoomListItem
          key={room.id}
          room={room}
          isSelected={selectedRoomId === room.id}
          onClick={() => onSelectRoom(room.id)}
        />
      ))}

      {rooms.length === 0 && (
        <div className="p-6 text-center text-sm text-gray-400">표시할 대화가 없어요</div>
      )}
    </div>
  );
};

export default ChatRoomList;
