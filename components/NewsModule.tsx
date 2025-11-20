import React, { useEffect, useState } from 'react';
import { NewsItem } from '../types';
import { MOCK_WATCHLIST } from '../constants';
import { fetchRealTimeNews } from '../services/geminiService';
import { Newspaper, Loader2, RefreshCw } from 'lucide-react';

const NewsModule: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    // Use names for better search results
    const stockNames = MOCK_WATCHLIST.map(s => s.name); 
    const data = await fetchRealTimeNews(stockNames);
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Newspaper size={20} className="text-blue-400"/>
          智能情报摘要 (Live)
        </h2>
        <button onClick={fetchNews} disabled={loading} className="text-slate-400 hover:text-white transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      {loading && news.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
          <span className="text-slate-400 text-sm">正在实时搜索全网财经资讯...</span>
        </div>
      ) : news.length === 0 ? (
         <div className="flex-1 flex justify-center items-center text-slate-500">暂无相关情报</div>
      ) : (
        <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
          {news.map((item) => (
            <div key={item.id} className="bg-slate-900/50 p-4 rounded border-l-4 border-slate-700 hover:border-blue-500 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-200 text-md leading-tight group-hover:text-blue-300 transition-colors">{item.title}</h3>
                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded border ml-2 ${
                  item.sentiment === 'positive' ? 'border-red-900 text-up-red bg-red-900/20' :
                  item.sentiment === 'negative' ? 'border-green-900 text-down-green bg-green-900/20' :
                  'border-slate-600 text-slate-400'
                }`}>
                  {item.sentiment === 'positive' ? '利好' : item.sentiment === 'negative' ? '利空' : '中性'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-3 leading-relaxed border-b border-slate-800 pb-2">{item.summary}</p>
              <div className="flex justify-between items-center text-xs">
                <div className="flex gap-2 flex-wrap">
                  {item.relatedStocks.map((stock, idx) => (
                    <span key={idx} className="text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded">
                      {stock}
                    </span>
                  ))}
                </div>
                <span className="text-slate-600 italic">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsModule;
