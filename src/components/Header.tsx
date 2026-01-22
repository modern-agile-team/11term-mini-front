import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryMenu from './CategoryMenu';
import SearchDropdown from './SearchDropdown';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  //  공통 검색 실행 함수 (엔터 & 돋보기 클릭 & 드롭다운 클릭 공용)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch(searchValue);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="border-b border-gray-100">
        <div className="flex justify-end max-w-[1024px] mx-auto py-2 px-4 text-xs text-gray-500 gap-4">
          <button className="hover:text-black">로그인/회원가입</button>
          <button className="hover:text-black">내단체</button>
        </div>
      </div>

      <div className="max-w-[1024px] mx-auto flex items-center justify-between py-6 px-4 gap-8">
        <Link to="/">
          <h1 className="text-3xl font-bold text-[#ff5058] cursor-pointer flex-shrink-0">
            번개장터
          </h1>
        </Link>

        {/* 검색창 영역 */}
        <div className="flex-1 max-w-[460px] relative" ref={searchRef}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsSearchOpen(true)}
            onClick={() => setIsSearchOpen(true)}
            placeholder="상품명, 지역명, @상점명 입력"
            className="w-full border-2 border-[#ff5058] px-4 py-2 outline-none text-sm"
          />
          <span
            onClick={() => executeSearch(searchValue)}
            className="absolute right-4 top-2.5 text-[#ff5058] cursor-pointer font-bold text-lg select-none"
          >
            🔍
          </span>

          {/* 📍 드롭다운 컴포넌트 호출 */}
          {isSearchOpen && (
            <SearchDropdown onClose={() => setIsSearchOpen(false)} onSearch={executeSearch} />
          )}
        </div>

        <div className="flex items-center gap-6 text-[14px] font-medium flex-shrink-0">
          <div className="flex flex-col items-center cursor-pointer hover:text-[#ff5058]">
            <span className="text-xl">📦</span>
            <span className="text-[12px] mt-1">내폰</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-[#ff5058]">
            <span className="text-xl">💰</span>
            <span className="text-[12px] mt-1">판매하기</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-[#ff5058]">
            <span className="text-xl">💬</span>
            <span className="text-[12px] mt-1">번개톡</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-[1024px] mx-auto px-4 flex items-center gap-6">
          <CategoryMenu />
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <button className="text-[14px] font-semibold hover:text-[#ff5058] py-4 cursor-pointer">
            번개장터 판매자센터
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
