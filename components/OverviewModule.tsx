import React, { useEffect, useState } from 'react';
import { MarketIndex } from '../types';
import { getIndices } from '../services/marketDataService';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';

const OverviewModule: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getIndices();
    setIndices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Refresh every 15 seconds to be polite to the API while keeping data relatively fresh
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3 px-1">
         <h2 className="text-slate-400 text-sm uppercase font-bold tracking-wider">核心指数 (Real-time)</h2>
         <button onClick={fetchData} className="text-slate-500 hover:text-blue-400 transition-colors" title="刷新数据">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
         </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <div key={index.code} className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-slate-200">{index.name}</h3>
              <span className="text-xs text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded">{index.code}</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className={`text-2xl font-bold tracking-tight ${index.change >= 0 ? 'text-up-red' : 'text-down-green'}`}>
                {index.value ? index.value.toFixed(2) : '--'}
              </span>
              <div className={`flex items-center text-sm font-medium ${index.changePercent >= 0 ? 'text-up-red' : 'text-down-green'}`}>
                {index.changePercent >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {index.changePercent > 0 ? '+' : ''}{index.changePercent}%
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-2">
              <span className="flex items-center"><Activity size={12} className="mr-1 text-slate-500"/> Vol: {index.volume}亿</span>
              <span>{index.change > 0 ? '+' : ''}{index.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewModule;
