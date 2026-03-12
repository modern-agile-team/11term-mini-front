import { useEffect, useState } from 'react';
import { getSearchSuggestions } from '../api/search';
import type { SearchSuggestion } from '../types/search';

const AUTOCOMPLETE_DEBOUNCE_MS = 200;

export const useSearchAutocomplete = (query: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const debounceTimer = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const nextSuggestions = await getSearchSuggestions(trimmedQuery);
        setSuggestions(nextSuggestions);
      } catch (error) {
        console.error('검색 자동완성 조회 실패:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [query]);

  return {
    suggestions,
    isLoading,
  };
};
