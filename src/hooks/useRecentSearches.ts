import { useCallback, useState } from 'react';
import { SEARCH_CONFIG } from '../constants/header';

const getStoredRecentSearches = (): string[] => {
  const savedSearches = localStorage.getItem(SEARCH_CONFIG.STORAGE_KEY);
  if (!savedSearches) {
    return [];
  }

  try {
    return JSON.parse(savedSearches) as string[];
  } catch {
    return [];
  }
};

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>(getStoredRecentSearches);

  const updateRecentSearches = useCallback((nextRecentSearches: string[]) => {
    setRecentSearches(nextRecentSearches);
    localStorage.setItem(SEARCH_CONFIG.STORAGE_KEY, JSON.stringify(nextRecentSearches));
  }, []);

  const addRecentSearch = useCallback(
    (searchTerm: string) => {
      const normalizedSearchTerm = searchTerm.trim();

      if (!normalizedSearchTerm) {
        return;
      }

      const nextRecentSearches = [
        normalizedSearchTerm,
        ...recentSearches.filter((recentSearch) => recentSearch !== normalizedSearchTerm),
      ].slice(0, SEARCH_CONFIG.MAX_RECENT_SEARCHES);

      updateRecentSearches(nextRecentSearches);
    },
    [recentSearches, updateRecentSearches],
  );

  const removeRecentSearch = useCallback(
    (searchTerm: string) => {
      const nextRecentSearches = recentSearches.filter(
        (recentSearch) => recentSearch !== searchTerm,
      );
      updateRecentSearches(nextRecentSearches);
    },
    [recentSearches, updateRecentSearches],
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_CONFIG.STORAGE_KEY);
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
};
