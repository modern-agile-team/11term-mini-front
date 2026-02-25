import { Send } from 'lucide-react';

/**
 * ChatComposer
 *
 * ✅ 원리: 입력창은 "제어 컴포넌트"(value/onChange)로 만들기
 * - 나중에 Enter 전송, 금칙어, 길이 제한 같은 기능을 넣기 쉬움
 */
export default function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2 border-t bg-white p-4">
      <input
        type="text"
        placeholder={disabled ? '대화방을 선택해주세요' : '메시지를 입력하세요'}
        className="flex-1 rounded-md border px-3 py-2 outline-none focus:border-red-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Enter로 전송(Shift+Enter는 줄바꿈 같은 확장은 나중에)
          if (e.key === 'Enter') onSend();
        }}
        disabled={disabled}
      />
      <button
        type="button"
        className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600 disabled:opacity-50"
        onClick={onSend}
        disabled={disabled || value.trim().length === 0}
        aria-label="send"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
