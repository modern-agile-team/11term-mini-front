import { useSearchAutocomplete } from '../hooks/useSearchAutocomplete';
import type { SearchSuggestion } from '../types/search';

interface SearchDropdownProps {
  query: string;
  recentSearches: string[];
  onDeleteRecentSearch: (searchTerm: string) => void;
  onClearRecentSearches: () => void;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
}

const SearchDropdown = ({
  query,
  recentSearches,
  onDeleteRecentSearch,
  onClearRecentSearches,
  onClose,
  onSearch,
}: SearchDropdownProps) => {
  const { suggestions, isLoading } = useSearchAutocomplete(query);

  const handleDeleteRecentSearch = (
    event: React.MouseEvent<HTMLButtonElement>,
    searchTerm: string,
  ) => {
    event.stopPropagation();
    onDeleteRecentSearch(searchTerm);
  };

  const getSuggestionLabel = (suggestion: SearchSuggestion) => {
    switch (suggestion.matchedBy) {
      case 'tag':
        return '태그';
      case 'category':
        return '카테고리';
      case 'title':
      default:
        return '상품';
    }
  };

  return (
    <div className="absolute top-[calc(100%+1px)] left-0 z-50 w-full border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-100 px-5 py-4">
        <p className="text-sm font-semibold text-gray-900">검색 자동완성</p>
      </div>

      <div className="p-5">
        {query.trim() ? (
          <div className="min-h-40">
            {isLoading ? (
              <div className="py-10 text-center text-sm text-gray-400">
                추천 검색어를 불러오는 중입니다.
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="space-y-4">
                {suggestions.map((suggestion) => (
                  <li
                    key={`${suggestion.matchedBy}-${suggestion.keyword}`}
                    onClick={() => onSearch(suggestion.keyword)}
                    className="flex cursor-pointer items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 text-xs font-semibold text-[#ff5058]">
                        {getSuggestionLabel(suggestion)}
                      </span>
                      <span className="truncate text-sm text-gray-800">{suggestion.keyword}</span>
                    </div>
                    <span className="text-xs text-gray-300">↗</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-sm text-gray-400">
                일치하는 추천 검색어가 없습니다.
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-gray-400">
            검색어를 입력하면 자동완성 추천이 표시됩니다.
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">최근 검색어</p>
          <button
            onClick={onClearRecentSearches}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            전체삭제
          </button>
        </div>

        {recentSearches.length > 0 ? (
          <ul className="space-y-4">
            {recentSearches.map((searchTerm) => (
              <li
                key={searchTerm}
                className="group flex cursor-pointer items-center justify-between"
                onClick={() => onSearch(searchTerm)}
              >
                <span className="text-sm text-gray-700">{searchTerm}</span>
                <button
                  onClick={(event) => handleDeleteRecentSearch(event, searchTerm)}
                  className="p-1 text-gray-300 hover:text-gray-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center text-sm text-gray-400">최근 검색어가 없습니다.</div>
        )}
      </div>

      <div className="flex items-center justify-end border-t border-gray-100 bg-[#f9f9f9] px-4 py-2">
        <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:underline">
          닫기
        </button>
      </div>
    </div>
  );
};

export default SearchDropdown;
