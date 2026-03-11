import type { ChatMessage } from '../../types/chat';

/**
 * ChatMessageBubble
 *
 * ✅ 원리: "말풍선"은 좌/우 정렬만 신경 쓰면 됨
 * - senderType으로 me/other 구분
 */
const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  const isMe = message.senderType === 'me';

  return (
    <div className={'flex ' + (isMe ? 'justify-end' : 'justify-start')}>
      <div
        className={
          'max-w-[70%] rounded-lg px-3 py-2 text-[13px] ' +
          (isMe
            ? 'rounded-br-none bg-red-500 text-white'
            : 'rounded-bl-none border bg-white')
        }
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessageBubble;
