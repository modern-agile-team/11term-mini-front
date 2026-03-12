import type { FollowUserItem } from '../../types/Account';

interface FollowListModalProps {
  isOpen: boolean;
  listType: 'followers' | 'following';
  isLoading: boolean;
  followUsers: FollowUserItem[];
  onClose: () => void;
}

const FollowListModal = ({
  isOpen,
  listType,
  isLoading,
  followUsers,
  onClose,
}: FollowListModalProps) => {
  if (!isOpen) return null;

  const title = listType === 'followers' ? '팔로워' : '팔로잉';
  const emptyText =
    listType === 'followers' ? '아직 팔로워가 없습니다.' : '아직 팔로잉한 상점이 없습니다.';

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[420px] bg-white border border-gray-200 rounded-sm shadow-2xl">
        <div className="h-14 border-b border-gray-100 px-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-gray-400">불러오는 중...</div>
          ) : followUsers.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {followUsers.map((user) => (
                <li key={user.id} className="px-5 py-3 flex items-center gap-3">
                  <img
                    src={user.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'}
                    alt={`${user.nickname} 프로필`}
                    className="w-11 h-11 rounded-full border border-gray-200 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.nickname}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.shopIntro || '상점 소개글이 없습니다.'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center text-sm text-gray-400">{emptyText}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
