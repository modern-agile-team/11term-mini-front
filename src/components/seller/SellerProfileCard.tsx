import type { UserProfile } from '../../types/Account';

interface SellerProfileCardProps {
  sellerProfile: UserProfile;
  canFollow: boolean;
  isFollowPending: boolean;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  onFollowClick: () => void;
}

const SellerProfileCard = ({
  sellerProfile,
  canFollow,
  isFollowPending,
  onOpenFollowers,
  onOpenFollowing,
  onFollowClick,
}: SellerProfileCardProps) => {
  return (
    <div className="border-t border-gray-200 pt-12 mt-12">
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-sm p-6">
        <div className="flex items-center gap-4">
          <img
            src={sellerProfile.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'}
            alt={`${sellerProfile.nickname} 프로필`}
            className="w-14 h-14 rounded-full border border-gray-200 object-cover"
          />
          <div>
            <p className="text-lg font-bold text-gray-900">{sellerProfile.nickname}</p>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <button type="button" onClick={onOpenFollowers} className="hover:text-gray-800">
                팔로워 {sellerProfile.followerCount}
              </button>
              <span>·</span>
              <button type="button" onClick={onOpenFollowing} className="hover:text-gray-800">
                팔로잉 {sellerProfile.followingCount}
              </button>
            </div>
          </div>
        </div>

        {canFollow && (
          <button
            type="button"
            onClick={onFollowClick}
            disabled={isFollowPending}
            className={`h-10 px-5 rounded text-sm font-bold transition-colors ${
              sellerProfile.isFollowing
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-[#ff5058] text-white hover:bg-[#e64951]'
            } ${isFollowPending ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {sellerProfile.isFollowing ? '팔로잉' : '팔로우'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SellerProfileCard;
