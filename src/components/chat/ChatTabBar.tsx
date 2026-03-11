import type { ChatTab } from '../../types/chat';
import { CHAT_TAB_LABEL } from '../../utils/chatFormat';

/**
 * ChatTabBar
 *
 * ✅ 원리: "탭 UI"는 재사용 가능한 작은 컴포넌트로 분리
 * - 상태는 부모(ChatPageView)에서 관리
 */
const ChatTabBar = ({
  activeTab,
  onChange,
}: {
  activeTab: ChatTab;
  onChange: (tab: ChatTab) => void;
}) => {
  const tabs: ChatTab[] = ['ALL', 'WAITING', 'IN_PROGRESS', 'CLOSED', 'CONTACTING'];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={
              'whitespace-nowrap rounded-full border px-3 py-1 text-[13px] transition-colors ' +
              (isActive
                ? 'border-[#1f1f1f] bg-[#1f1f1f] font-semibold text-white'
                : 'border-[#dddddd] bg-white text-[#555] hover:bg-gray-50')
            }
          >
            {CHAT_TAB_LABEL[tab]}
          </button>
        );
      })}
    </div>
  );
};

export default ChatTabBar;
