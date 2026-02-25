import type { ChatTab } from '../types';
import { CHAT_TAB_LABEL } from '../utils/format';

/**
 * ChatTabBar
 *
 * ✅ 원리: "탭 UI"는 재사용 가능한 작은 컴포넌트로 분리
 * - 상태는 부모(ChatPageView)에서 관리
 */
export default function ChatTabBar({
  activeTab,
  onChange,
}: {
  activeTab: ChatTab;
  onChange: (tab: ChatTab) => void;
}) {
  const tabs: ChatTab[] = ['ALL', 'WAITING', 'IN_PROGRESS', 'CLOSED', 'CONTACTING'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 text-sm">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={
              'whitespace-nowrap rounded-full border px-3 py-1 hover:bg-gray-100 ' +
              (isActive ? 'bg-gray-100 font-semibold' : '')
            }
          >
            {CHAT_TAB_LABEL[tab]}
          </button>
        );
      })}
    </div>
  );
}
