import { useState } from 'react';

interface SearchDropdownProps {
  onClose: () => void;
  onSearch: (term: string) => void;
}

const SearchDropdown = ({ onClose, onSearch }: SearchDropdownProps) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');

  //로컬 스트리지에서 읽어오기
  const [recent, setRecent] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  // 최근 검색어 개별 삭제
  const handleDelete = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recent.filter((t) => t !== term);
    setRecent(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // 최근 검색어 전체 삭제
  const handleDeleteAll = () => {
    setRecent([]);
    localStorage.removeItem('recentSearches');
  };

  const popular = [
    { rank: 1, term: '엔진11' },
    { rank: 2, term: 'RTX 4060' },
    { rank: 3, term: '픽시' },
    { rank: 4, term: '아이폰 15' },
    { rank: 5, term: '패딩' },
    { rank: 6, term: '에어팟' },
  ];

  return (
    <div className="absolute top-[calc(100%+1px)] left-0 w-full bg-white border border-gray-200 shadow-xl z-50">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-4 text-sm font-medium ${activeTab === 'recent' ? 'text-[#ff5058] border-b-2 border-[#ff5058]' : 'text-gray-900'}`}
        >
          최근검색어
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`flex-1 py-4 text-sm font-medium ${activeTab === 'popular' ? 'text-[#ff5058] border-b-2 border-[#ff5058]' : 'text-gray-900'}`}
        >
          인기검색어
        </button>
      </div>

      <div className="p-5 min-h-[300px]">
        {activeTab === 'recent' ? (
          recent.length > 0 ? (
            <ul className="space-y-4">
              {recent.map((term, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center cursor-pointer group"
                  onClick={() => onSearch(term)}
                >
                  <span className="text-sm text-gray-700">{term}</span>
                  <button
                    onClick={(event) => handleDelete(event, term)}
                    className="text-gray-300 hover:text-gray-500 p-1"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">최근 검색어가 없습니다.</div>
          )
        ) : (
          <ul className="space-y-4">
            {popular.map((item) => (
              <li
                key={item.rank}
                onClick={() => onSearch(item.term)}
                className="flex items-center gap-4 cursor-pointer"
              >
                <span
                  className={`text-sm font-bold w-4 ${item.rank <= 3 ? 'text-[#ff5058]' : 'text-gray-800'}`}
                >
                  {item.rank}
                </span>
                <span className="text-sm text-gray-700">{item.term}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-[#f9f9f9] px-4 py-2 flex justify-between items-center border-t border-gray-100">
        <button
          onClick={handleDeleteAll}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          🗑 검색어 전체삭제
        </button>
        <button onClick={onClose} className="text-xs text-gray-400 font-bold hover:underline">
          닫기
        </button>
      </div>
    </div>
  );
};

export default SearchDropdown;
