import { useState, useRef, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryMenu from './CategoryMenu';
import SearchDropdown from './SearchDropdown';
import { useAuth } from '../hooks/useAuth';
import { SEARCH_CONFIG, HEADER_TEXT, HEADER_ACTIONS } from '../constants/header';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMyStoreOpen, setIsMyStoreOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { userInfo: user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (term: string) => {
    if (term.trim() === '') return;
    const saved = localStorage.getItem(SEARCH_CONFIG.STORAGE_KEY);
    const prevSearches = saved ? JSON.parse(saved) : [];
    const updatedPrevSearches = [term, ...prevSearches.filter((t: string) => t !== term)].slice(
      0,
      SEARCH_CONFIG.MAX_RECENT_SEARCHES,
    );
    localStorage.setItem(SEARCH_CONFIG.STORAGE_KEY, JSON.stringify(updatedPrevSearches));
    setIsSearchOpen(false);
    setSearchValue('');
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="border-b border-gray-100">
        <div className="flex justify-end max-w-[1024px] mx-auto py-2 px-4 text-xs text-gray-500 gap-4 items-center h-10">
          {user ? (
            <>
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
              <button onClick={logout} className="hover:text-black cursor-pointer">
                {HEADER_TEXT.LOGOUT}
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className="hover:text-black cursor-pointer">
              {HEADER_TEXT.LOGIN_SIGNUP}
            </button>
          )}

          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsMyStoreOpen(true)}
            onMouseLeave={() => setIsMyStoreOpen(false)}
          >
            <button
              className="hover:text-black cursor-pointer flex items-center gap-1 h-full px-1"
              onClick={() => navigate('/mypage')}
            >
              {HEADER_TEXT.MY_GROUP}
              <span
                className={`text-[7px] transition-transform ${isMyStoreOpen ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </button>

            {isMyStoreOpen && (
              <div className="absolute right-0 top-full pt-3 z-[60]">
                <div className="w-[100px] bg-white border border-gray-200 shadow-lg py-1 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      navigate('/mypage');
                      setIsMyStoreOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-600 hover:text-black transition-colors"
                  >
                    내 상품
                  </button>
                  <button
                    onClick={() => {
                      navigate('/mypage', { state: { activeTab: '찜' } });
                      setIsMyStoreOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-600 hover:text-black transition-colors"
                  >
                    찜한상품
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsMyStoreOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-600 hover:text-black border-t border-gray-50 transition-colors"
                  >
                    계정설정
                  </button>
                  <button
                    onClick={() => {
                      navigate('/cs');
                      setIsMyStoreOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-600 hover:text-black transition-colors"
                  >
                    고객센터
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1024px] mx-auto flex items-center justify-between py-6 px-4 gap-8">
        <Link to="/">
          <h1 className="text-3xl font-bold text-[#ff5058] cursor-pointer flex-shrink-0">
            {HEADER_TEXT.LOGO_TITLE}
          </h1>
        </Link>
        <div className="flex-1 max-w-[460px] relative" ref={searchRef}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchValue)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={SEARCH_CONFIG.PLACEHOLDER}
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
          {HEADER_ACTIONS.map((action, index) => (
            <Fragment key={action.id}>
              <div
                onClick={() => navigate(action.path)}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-60 transition-opacity"
              >
                <span className="text-xl">{action.icon}</span>
                <span className="text-gray-800">{action.label}</span>
              </div>
              {index < HEADER_ACTIONS.length - 1 && (
                <div className="w-[1px] h-3 bg-gray-300 mx-0.5" />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-[1024px] mx-auto px-4 flex items-center gap-6">
          <CategoryMenu />
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <button
            onClick={() => navigate('/seller-center')}
            className="text-[14px] font-semibold hover:text-[#ff5058] py-4 cursor-pointer"
          >
            {HEADER_TEXT.SELLER_CENTER}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
