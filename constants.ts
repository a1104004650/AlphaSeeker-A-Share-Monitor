import { MarketIndex, StockData } from './types';

export const INITIAL_INDICES: MarketIndex[] = [
  { name: '上证指数', code: '000001', value: 3050.23, change: 12.4, changePercent: 0.41, volume: 4500 },
  { name: '深证成指', code: '399001', value: 9680.55, change: -15.2, changePercent: -0.16, volume: 5800 },
  { name: '创业板指', code: '399006', value: 1890.12, change: 5.6, changePercent: 0.30, volume: 2100 },
  { name: '科创50', code: '000688', value: 850.33, change: 8.1, changePercent: 0.96, volume: 980 },
];

export const MOCK_WATCHLIST: StockData[] = [
  { code: '600519', name: '贵州茅台', price: 1750.00, changePercent: 0.5, changeAmount: 8.75, rateOfChange: 0.02, volume: 25000, turnover: 4375000000, turnoverRate: 0.3, volumeRatio: 1.1, marketCap: 22000, sector: '白酒', sectorChange: 0.4 },
  { code: '300750', name: '宁德时代', price: 185.60, changePercent: -1.2, changeAmount: -2.25, rateOfChange: -0.1, volume: 450000, turnover: 8352000000, turnoverRate: 1.5, volumeRatio: 0.8, marketCap: 8500, sector: '电池', sectorChange: -0.8 },
  { code: '000001', name: '平安银行', price: 10.45, changePercent: 1.2, changeAmount: 0.12, rateOfChange: 0.1, volume: 1200000, turnover: 1254000000, turnoverRate: 0.8, volumeRatio: 1.5, marketCap: 2000, sector: '银行', sectorChange: 0.9 },
  { code: '601138', name: '工业富联', price: 25.88, changePercent: 3.5, changeAmount: 0.88, rateOfChange: 0.5, volume: 890000, turnover: 2303320000, turnoverRate: 3.2, volumeRatio: 2.5, marketCap: 5100, sector: '电子元件', sectorChange: 2.1 },
];

export const TABS = {
  OVERVIEW: 'overview',
  WATCHLIST: 'watchlist',
  NEWS: 'news',
  REVIEW: 'review',
  TOMORROW: 'tomorrow',
};
