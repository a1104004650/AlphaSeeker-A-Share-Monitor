
import { MarketIndex, StockData, DailyReviewData } from '../types';
import { INITIAL_INDICES } from '../constants';
import { fetchRealTimeIndices, fetchRealTimeStocks, fetchDailyReview } from './geminiService';

// Indices
export const getIndices = async (): Promise<MarketIndex[]> => {
  try {
    const data = await fetchRealTimeIndices();
    if (data && data.length > 0) return data;
    return INITIAL_INDICES; // Fallback only if API fails completely
  } catch (e) {
    console.error(e);
    return INITIAL_INDICES;
  }
};

// Watchlist
export const getWatchlistData = async (currentList: StockData[]): Promise<StockData[]> => {
  if (currentList.length === 0) return [];
  
  try {
    // Extract code and name to help the search
    const queryList = currentList.map(s => ({ name: s.name, code: s.code }));
    const realData = await fetchRealTimeStocks(queryList);
    
    // Merge real data with existing list to preserve structure if search misses some
    return currentList.map(stock => {
      const updated = realData.find(r => r.code === stock.code || r.name === stock.name);
      if (updated) {
        return { ...stock, ...updated };
      }
      return stock;
    });
  } catch (e) {
    console.error(e);
    return currentList;
  }
};

// Daily Review
export const getDailyReviewData = async (): Promise<{data: DailyReviewData, analysis: string}> => {
  const response = await fetchDailyReview();
  // Ensure limitUpList is initialized if missing from API response (extra safety)
  if (!response.data.limitUpList) {
      response.data.limitUpList = [];
  }
  return response;
};
