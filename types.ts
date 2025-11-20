
export interface MarketIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  volume: number; // in billions
}

export interface StockData {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  changeAmount: number;
  rateOfChange: number; // 速涨/速跌
  volume: number; // Hands (100 shares)
  turnover: number; // Amount in CN
  turnoverRate: number; // 换手率 %
  volumeRatio: number; // 量比
  marketCap: number; // in Billions
  sector: string;
  sectorChange: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  relatedStocks: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
}

export interface SectorPerformance {
  name: string;
  change: number;
  netInflow: number; // In Millions
}

export interface LimitUpStock {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  sector: string;
  consecutiveDays: number; // 连板天数
  reason: string; // 涨停原因/概念
  isBroken: boolean; // 是否炸板 (optional flag for analysis)
}

export interface DailyReviewData {
  limitUpCount: number;
  limitUpBrokenCount: number;
  limitDownCount: number;
  topSectors: SectorPerformance[];
  bottomSectors: SectorPerformance[];
  inflowSectors: SectorPerformance[];
  outflowSectors: SectorPerformance[];
  limitUpList: LimitUpStock[]; // New field for the table
}

export interface Opportunity {
  id: string;
  type: 'short' | 'pattern' | 'long';
  stockName: string;
  stockCode: string;
  description: string;
  score: number; // 0-100 confidence/similarity
  tags: string[];
}
