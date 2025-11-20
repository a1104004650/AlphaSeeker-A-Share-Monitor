import React, { useEffect, useState, useCallback } from 'react';
import { StockData } from '../types';
import { getWatchlistData } from '../services/marketDataService';
import { MOCK_WATCHLIST } from '../constants';
import { Plus, Trash2, RefreshCw, Search, AlertCircle } from 'lucide-react';

const WatchlistModule: React.FC = () => {
  const [watchlist, setWatchlist] = useState<StockData[]>(MOCK_WATCHLIST);
  const [newStockInput, setNewStockInput] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real data
  const refreshData = useCallback(async () => {
    if (watchlist.length === 0) return;
    setIsRefreshing(true);
    const updated = await getWatchlistData(watchlist);
    setWatchlist(updated);
    setIsRefreshing(false);
  }, [watchlist]);

  useEffect(() => {
    if (!autoRefresh) return;
    // Increased interval to 10s to accommodate search grounding latency
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshData]);

  // Initial load
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddStock = () => {
    if (!newStockInput) return;
    
    // Add placeholder immediately, data will fill on next refresh
    const newStock: StockData = {
      code: newStockInput,
      name: newStockInput, // Will be updated by API
      price: 0,
      changePercent: 0,
      changeAmount: 0,
      rateOfChange: 0,
      volume: 0,
      turnover: 0,
      turnoverRate: 0,
      volumeRatio: 0,
      marketCap: 0,
      sector: '加载中...',
      sectorChange: 0
    };
    
    setWatchlist(prev => [...prev, newStock]);
    setNewStockInput('');
    // Trigger refresh to fetch real data for new stock
    setTimeout(() => refreshData(), 500); 
  };

  const handleRemove = (code: string) => {
    setWatchlist(watchlist.filter(s => s.code !== code));
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="text-blue-400" size={24}/>
          自选股监控 (Live)
          {autoRefresh && (
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${isRefreshing ? 'duration-500' : 'duration-1000'}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <div className="relative group">
            <input
              type="text"
              value={newStockInput}
              onChange={(e) => setNewStockInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddStock()}
              placeholder="输入代码/名称"
              className="bg-slate-900 border border-slate-600 text-sm rounded-l px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 w-36 transition-all"
            />
            <button 
              onClick={handleAddStock}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-r text-sm border-t border-b border-r border-blue-600"
            >
              <Plus size={16} />
            </button>
          </div>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-1.5 rounded border transition-colors ${autoRefresh ? 'bg-green-900/30 border-green-600 text-green-400' : 'bg-slate-700 border-slate-600 text-slate-400'}`}
            title={autoRefresh ? "暂停自动刷新" : "开启自动刷新"}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
           <AlertCircle size={48} className="mb-2 opacity-50"/>
           <p>暂无自选股，请添加监控代码</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3 font-medium whitespace-nowrap">代码/名称</th>
                <th className="p-3 font-medium text-right whitespace-nowrap">最新价</th>
                <th className="p-3 font-medium text-right whitespace-nowrap">涨幅%</th>
                <th className="p-3 font-medium text-right whitespace-nowrap">涨跌额</th>
                <th className="p-3 font-medium text-right whitespace-nowrap hidden md:table-cell">换手%</th>
                <th className="p-3 font-medium text-right whitespace-nowrap hidden lg:table-cell">量比</th>
                <th className="p-3 font-medium text-right whitespace-nowrap hidden xl:table-cell">成交额</th>
                <th className="p-3 font-medium text-right whitespace-nowrap">板块</th>
                <th className="p-3 font-medium text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {watchlist.map((stock) => (
                <tr key={stock.code} className="hover:bg-slate-700/50 transition-colors group">
                  <td className="p-3">
                    <div className="font-bold text-white group-hover:text-blue-300 transition-colors">{stock.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{stock.code}</div>
                  </td>
                  <td className={`p-3 text-right font-mono font-bold text-base ${stock.changePercent >= 0 ? 'text-up-red' : 'text-down-green'}`}>
                    {stock.price > 0 ? stock.price.toFixed(2) : '-'}
                  </td>
                  <td className={`p-3 text-right font-mono font-medium ${stock.changePercent >= 0 ? 'text-up-red' : 'text-down-green'}`}>
                    <div className={`inline-block px-2 py-0.5 rounded ${stock.changePercent >= 0 ? 'bg-red-900/20' : 'bg-green-900/20'}`}>
                      {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%
                    </div>
                  </td>
                   <td className={`p-3 text-right font-mono ${stock.changeAmount >= 0 ? 'text-up-red' : 'text-down-green'}`}>
                    {stock.changeAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono text-yellow-500 hidden md:table-cell">{stock.turnoverRate}%</td>
                  <td className="p-3 text-right font-mono hidden lg:table-cell">{stock.volumeRatio}</td>
                  <td className="p-3 text-right font-mono text-slate-400 hidden xl:table-cell">
                    {(stock.turnover / 100000000).toFixed(2)}亿
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-1 rounded bg-slate-700 text-xs whitespace-nowrap">
                      {stock.sector}
                      {stock.sectorChange !== 0 && (
                        <span className={`ml-1 ${stock.sectorChange >= 0 ? 'text-up-red' : 'text-down-green'}`}>
                          {stock.sectorChange}%
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleRemove(stock.code)} className="text-slate-600 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-2 text-xs text-slate-600 flex justify-end items-center">
         Live data via Google Search Grounding
      </div>
    </div>
  );
};

export default WatchlistModule;
