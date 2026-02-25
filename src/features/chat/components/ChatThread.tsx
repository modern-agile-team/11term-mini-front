import type { ChatMessage } from '../types';
import ChatMessageBubble from './ChatMessageBubble';

/**
 * ChatThread
 *
 * ✅ 원리: 메시지 목록 스크롤 영역
 * - 메시지 1개 UI는 Bubble로 분리
 */
export default function ChatThread({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {messages.map((msg) => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}

      {messages.length === 0 && (
        <div className="mt-10 text-center text-sm text-gray-400">
          아직 메시지가 없어요. 첫 메시지를 보내보세요.
        </div>
      )}
    </div>
  );
}
