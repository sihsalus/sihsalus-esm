import { type SearchHistoryItem } from '../../types';

export const getSearchHistory = () => {
  const history = JSON.parse(globalThis.sessionStorage.getItem('openmrsHistory'));
  const searchHistory: SearchHistoryItem[] = [];
  history?.map((historyItem, index) =>
    searchHistory.push({
      ...historyItem,
      id: (index + 1).toString(),
      results: historyItem.patients.length,
    }),
  );
  return searchHistory;
};
