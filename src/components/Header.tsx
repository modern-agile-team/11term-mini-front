import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryMenu from './CategoryMenu';
import SearchDropdown from './SearchDropdown';
import type { Account } from '../types/Account';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 유저 정보 상태 관리
  const [user, setUser] = useState<Account | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('유저 데이터 파싱 오류:', error);
      return null;
    }
  });

  // 인증 상태 확인 함수
  const checkAuth = useCallback(() => {
    const savedUser = localStorage.getItem('currentUser');
    const userData = savedUser ? JSON.parse(savedUser) : null;

    setUser((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(userData)) {
        return userData;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    alert('로그아웃 되었습니다.');
    navigate('/');
    window.dispatchEvent(new Event('auth-change'));
  };

  const executeSearch = (term: string) => {
    if (term.trim() === '') return;
    const saved = localStorage.getItem('recentSearches');
    const prevSearches = saved ? JSON.parse(saved) : [];
    const updatedPrevSearches = [term, ...prevSearches.filter((t: string) => t !== term)].slice(
      0,
      12,
    );
    localStorage.setItem('recentSearches', JSON.stringify(updatedPrevSearches));
    setIsSearchOpen(false);
    setSearchValue('');
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* 최상단 메뉴바 */}
      <div className="border-b border-gray-100">
        <div className="flex justify-end max-w-[1024px] mx-auto py-2 px-4 text-xs text-gray-500 gap-4 items-center h-10">
          {user ? (
            <>
              {/* 닉네임 표시 및 마이페이지 이동 */}
              <div
                className="flex items-center gap-1 cursor-pointer group"
                onClick={() => navigate('/mypage')}
              >
                <span className="text-black font-bold group-hover:underline">
                  {user.nickname || user.name}님
                </span>
                <span className="text-[8px] text-gray-400 group-hover:text-black">▼</span>
              </div>

              <div className="w-[1px] h-3 bg-gray-200" />

              <button onClick={handleLogout} className="hover:text-black cursor-pointer">
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className="hover:text-black cursor-pointer">
              로그인/회원가입
            </button>
          )}
          <button className="hover:text-black cursor-pointer">내단체</button>
        </div>
      </div>

      {/* 메인 헤더 영역 */}
      <div className="max-w-[1024px] mx-auto flex items-center justify-between py-6 px-4 gap-8">
        <Link to="/">
          <h1 className="text-3xl font-bold text-[#ff5058] cursor-pointer flex-shrink-0">
            번개장터
          </h1>
        </Link>

        <div className="flex-1 max-w-[460px] relative" ref={searchRef}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchValue)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="상품명, 지역명, @상점명 입력"
            className="w-full border-2 border-[#ff5058] px-4 py-2 outline-none text-sm"
          />
          <span
            onClick={() => executeSearch(searchValue)}
            className="absolute right-4 top-2 text-[#ff5058] cursor-pointer font-bold text-lg select-none"
          >
            🔍
          </span>
          {isSearchOpen && (
            <SearchDropdown onClose={() => setIsSearchOpen(false)} onSearch={executeSearch} />
          )}
        </div>

        <div className="flex items-center gap-4 text-[14px] font-medium flex-shrink-0">
          {/* 판매하기 */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-60 transition-opacity">
            <span className="text-xl">💰</span>
            <span className="text-gray-800">판매하기</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-300 mx-0.5" />

          {/* 내상점 (마이페이지 이동) */}
          <div
            onClick={() => navigate('/mypage')}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-60 transition-opacity"
          >
            <span className="text-xl">👤</span>
            <span className="text-gray-800">내상점</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-300 mx-0.5" />

          {/* 번개톡 */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-60 transition-opacity">
            <span className="text-xl">💬</span>
            <span className="text-gray-800">번개톡</span>
          </div>
        </div>
      </div>

      {/* 하단 카테고리 메뉴바 */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1024px] mx-auto px-4 flex items-center gap-6">
          <CategoryMenu />
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <button
            onClick={() => navigate('/seller-center')}
            className="text-[14px] font-semibold hover:text-[#ff5058] py-4 cursor-pointer"
          >
            번개장터 판매자센터
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
