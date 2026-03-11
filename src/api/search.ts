import api from './axios';
import type { SearchSuggestion } from '../types/search';

export const getSearchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  const response = await api.get<SearchSuggestion[]>('/api/search/suggestions', {
    params: { q: query },
  });

  return response.data;
};
