
import { GoogleGenAI } from "@google/genai";
import { MarketIndex, StockData, DailyReviewData, NewsItem, Opportunity } from '../types';

const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });
const modelId = 'gemini-2.5-flash';

// Helper to clean and parse JSON from LLM response
const parseJSON = (text: string): any => {
  try {
    // Remove markdown code blocks and any leading/trailing text
    const cleaned = text.replace(/```json|```/g, '').trim();
    // Find the first '{' or '[' and the last '}' or ']' to ensure we just get the JSON part
    const firstChar = cleaned.search(/[{[]/);
    const lastChar = cleaned.search(/[}\]]$/);
    if (firstChar !== -1 && lastChar !== -1) {
        const jsonString = cleaned.substring(firstChar, cleaned.length);
        return JSON.parse(jsonString);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e, text);
    return null;
  }
};

// 1. Real-time Market Indices
export const fetchRealTimeIndices = async (): Promise<MarketIndex[]> => {
  if (!API_KEY) return [];
  
  // Simplified prompt for speed and accuracy
  const prompt = `Get the absolute latest REAL-TIME quotes for: 上证指数, 深证成指, 创业板指, 科创50.
  Return JSON array: [{ "name": "string", "code": "string", "value": number, "change": number, "changePercent": number, "volume": number (billions) }]`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1 // Lower temperature for factual data
      }
    });

    const data = parseJSON(response.text || '');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch Indices Error:", error);
    return [];
  }
};

// 2. Real-time Watchlist Data
export const fetchRealTimeStocks = async (stocks: {name: string, code: string}[]): Promise<StockData[]> => {
  if (!API_KEY || stocks.length === 0) return [];

  const stockList = stocks.map(s => `${s.name}`).join(', ');
  
  // Focused prompt on "Latest" data
  const prompt = `Find the LATEST REAL-TIME trading data (Price, Change%, Volume, Turnover Rate, Sector) for: ${stockList}.
  
  Return strictly a JSON array:
  [{
    "code": "string (stock code)",
    "name": "string",
    "price": number,
    "changePercent": number,
    "changeAmount": number,
    "rateOfChange": number (estimated speed),
    "volume": number (hands),
    "turnover": number (amount),
    "turnoverRate": number (percent),
    "volumeRatio": number,
    "marketCap": number (billions),
    "sector": "string (main industry)",
    "sectorChange": number (sector change %)
  }]`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1
      }
    });

    const data = parseJSON(response.text || '');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch Stocks Error:", error);
    return [];
  }
};

// 3. Real-time News Analysis
export const fetchRealTimeNews = async (stockNames: string[]): Promise<NewsItem[]> => {
  if (!API_KEY) return [];
  
  const prompt = `Find the latest breaking news for A-Share market and these stocks: ${stockNames.join(', ')}.
  Return JSON array (max 6 items):
  [{ "id": "unique_id", "title": "string", "summary": "string", "relatedStocks": ["string"], "sentiment": "positive"|"negative"|"neutral", "timestamp": "HH:MM" }]`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    
    const data = parseJSON(response.text || '');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("News Error:", error);
    return [];
  }
};

// 4. Daily Market Review
export const fetchDailyReview = async (): Promise<{data: DailyReviewData, analysis: string}> => {
  if (!API_KEY) return { 
    data: { limitUpCount: 0, limitUpBrokenCount: 0, limitDownCount: 0, topSectors: [], bottomSectors: [], inflowSectors: [], outflowSectors: [], limitUpList: [] }, 
    analysis: "API Unavailable" 
  };

  // Enhanced prompt to get detailed Limit Up Table
  const prompt = `Review today's A-Share market data.
  
  1. Statistics: Limit Up Count, Limit Down Count, Limit Up Broken Count.
  2. Sectors: Top 5 Gainers, Top 5 Losers, Top 5 Net Inflow.
  3. **IMPORTANT**: List at least 15 significant Limit Up (ZhangTing) stocks today. Include their Name, Code, Price, Sector, Consecutive Limit Ups (连板数), and Reason (Concept).
  
  Return JSON structure:
  {
    "stats": {
      "limitUpCount": number,
      "limitUpBrokenCount": number,
      "limitDownCount": number,
      "topSectors": [{"name": "string", "change": number, "netInflow": number}],
      "bottomSectors": [{"name": "string", "change": number, "netInflow": number}],
      "inflowSectors": [{"name": "string", "change": number, "netInflow": number}],
      "limitUpList": [
        {
          "name": "string",
          "code": "string",
          "price": number,
          "changePercent": number (usually 10 or 20),
          "sector": "string",
          "consecutiveDays": number (e.g., 1, 2, 3...),
          "reason": "string (e.g. AI, Low Altitude)"
        }
      ]
    },
    "analysis": "Brief market analysis summary (max 150 words)."
  }`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2
      }
    });

    const result = parseJSON(response.text || '');
    if (result && result.stats) {
      // Ensure limitUpList exists
      if (!result.stats.limitUpList) result.stats.limitUpList = [];
      return { data: result.stats, analysis: result.analysis };
    }
    throw new Error("Invalid structure");
  } catch (error) {
    console.error("Daily Review Error:", error);
    return { 
      data: { limitUpCount: 0, limitUpBrokenCount: 0, limitDownCount: 0, topSectors: [], bottomSectors: [], inflowSectors: [], outflowSectors: [], limitUpList: [] }, 
      analysis: "无法获取市场复盘数据。" 
    };
  }
};

// 5. Tomorrow Opportunities
export const fetchTomorrowStrategies = async (): Promise<Opportunity[]> => {
  if (!API_KEY) return [];

  // Increased count to 10+
  const prompt = `Analyze the A-Share market for TOMORROW's trading opportunities.
  
  Identify at least 10-12 specific stock opportunities across these categories:
  1. Short-term (Short): Hot concepts, recent limit-ups, active funds.
  2. Pattern (Pattern): Technical breakouts (e.g. Cup and Handle, Moving Average Support).
  3. Long-term (Long): Undervalued, high dividend, or policy support.
  
  Return strictly a JSON array:
  [{
    "type": "short" | "pattern" | "long",
    "stockName": "string",
    "stockCode": "string",
    "description": "string (reason)",
    "score": number (0-100 confidence),
    "tags": ["string"]
  }]`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3
      }
    });

    const data = parseJSON(response.text || '');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Strategy Error:", error);
    return [];
  }
};
