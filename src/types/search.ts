export type SearchSuggestionType = 'title' | 'tag' | 'category';

export interface SearchSuggestion {
  keyword: string;
  matchedBy: SearchSuggestionType;
}
