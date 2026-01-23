import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VALIDATION_PATTERNS, type Account } from '../types/Account';

const MyPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('상품');
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [isIntroEditing, setIsIntroEditing] = useState(false);

  const [userInfo, setUserInfo] = useState<Account | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [tempNickname, setTempNickname] = useState(userInfo?.nickname || '');
  const [tempIntro, setTempIntro] = useState(userInfo?.shopIntro || '');

  useEffect(() => {
    if (!userInfo) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/');
    }
  }, [userInfo, navigate]);

  if (!userInfo) return null;

  const getOpenDays = (joinDate: string) => {
    if (!joinDate) return 1;
    const startDate = new Date(joinDate.replace(/\./g, '-'));
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleUpdateAccount = (updateData: Partial<Account>) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUserFullData = users.find((u: Account) => u.email === userInfo.email);

    if (!currentUserFullData) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    const updatedUser = { ...currentUserFullData, ...updateData };
    const updatedUsers = users.map((u: Account) => (u.email === userInfo.email ? updatedUser : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    setUserInfo(updatedUser);
    window.dispatchEvent(new Event('auth-change'));
  };

  const saveNickname = () => {
    if (!VALIDATION_PATTERNS.nickname.test(tempNickname)) {
      alert('닉네임은 한글, 영문, 숫자 조합 2~10자로 입력해주세요.');
      return;
    }
    handleUpdateAccount({ nickname: tempNickname });
    setIsNicknameEditing(false);
  };

  const saveIntro = () => {
    if (tempIntro.length > 1000) {
      alert('소개글은 최대 1000자까지 작성 가능합니다.');
      return;
    }
    handleUpdateAccount({ shopIntro: tempIntro });
    setIsIntroEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateAccount({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto py-10 px-4">
      <div className="flex border border-gray-200 h-[310px] mb-12 bg-white shadow-sm">
        <div className="w-[310px] bg-[#fafafa] flex flex-col items-center justify-center border-r border-gray-200">
          <div
            className="group relative w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center text-5xl border border-gray-200 shadow-sm mb-4 overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              '👤'
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
              변경
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="text-center mb-6">
            <div className="font-bold text-lg mb-1">{userInfo.nickname}</div>
            <div className="flex justify-center text-[#ffcc00] text-sm italic">★★★★★</div>
          </div>
          <div className="flex gap-2 w-full px-6 text-xs">
            <button className="flex-1 py-2 border border-gray-300 bg-white text-gray-600 font-medium hover:bg-gray-50">
              내 상점 관리
            </button>
            <button className="flex-1 py-2 border border-gray-300 bg-white text-gray-600 font-medium hover:bg-gray-50">
              번개머니
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            {isNicknameEditing ? (
              <div className="flex items-center gap-2">
                <input
                  className="text-xl font-bold border-b-2 border-black outline-none pb-1"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={saveNickname}
                  className="text-xs bg-black text-white px-2 py-1 rounded"
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setIsNicknameEditing(false);
                    setTempNickname(userInfo.nickname);
                  }}
                  className="text-xs border px-2 py-1 rounded text-gray-400"
                >
                  취소
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{userInfo.nickname}</h2>
                <button
                  onClick={() => setIsNicknameEditing(true)}
                  className="px-2 py-1 text-[11px] border border-gray-200 text-gray-400 rounded hover:bg-gray-50"
                >
                  상점명 수정
                </button>
              </>
            )}
            <span className="ml-auto text-[11px] bg-[#ffc300] px-2 py-1 rounded-sm font-bold text-white shadow-sm">
              ✔ 본인인증 완료
            </span>
          </div>

          <div className="flex gap-10 text-sm text-gray-400 mb-6 border-t border-b border-gray-50 py-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[#ff5058]">🏪</span> 상점오픈일{' '}
              <span className="text-gray-900 font-semibold">
                {getOpenDays(userInfo.joinDate)}일 전
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#3498db]">👤</span> 상점방문수{' '}
              <span className="text-gray-900 font-semibold">0 명</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#2ecc71]">🛍️</span> 상품판매{' '}
              <span className="text-gray-900 font-semibold">0 회</span>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {isIntroEditing ? (
              <div className="flex flex-col h-full">
                <textarea
                  className="w-full border p-3 text-sm outline-none resize-none flex-1 mb-1 border-gray-300 focus:border-black"
                  value={tempIntro}
                  onChange={(e) => setTempIntro(e.target.value.slice(0, 1000))}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">{tempIntro.length} / 1000자</span>
                  <div className="flex gap-2">
                    <button
                      onClick={saveIntro}
                      className="text-[11px] bg-gray-800 text-white px-3 py-1 rounded"
                    >
                      확인
                    </button>
                    <button
                      onClick={() => {
                        setIsIntroEditing(false);
                        setTempIntro(userInfo.shopIntro || '');
                      }}
                      className="text-[11px] border px-3 py-1 rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="text-sm text-gray-600 leading-relaxed pr-2 overflow-y-auto max-h-[100px] whitespace-pre-wrap scrollbar-thin">
                  {userInfo.shopIntro || '소개글이 없습니다.'}
                </div>
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => setIsIntroEditing(true)}
                    className="text-[11px] text-gray-400 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50"
                  >
                    소개글 수정
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-900 flex mb-8">
        {['상품', '상점후기', '찜', '팔로잉', '팔로워'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[15px] font-semibold border-r border-b border-gray-200 last:border-r-0 transition-colors ${
              activeTab === tab
                ? 'bg-white border-b-white text-black'
                : 'bg-[#fafafa] text-gray-500 hover:text-black'
            }`}
          >
            {tab} <span className="ml-1 text-sm font-normal">{tab === '찜' ? '1' : '0'}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-32 border-b border-gray-100 text-gray-300">
        <p className="text-sm">등록된 {activeTab}이 없습니다.</p>
      </div>
    </div>
  );
};

export default MyPage;
