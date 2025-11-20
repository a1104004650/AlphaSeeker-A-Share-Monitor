
import React, { useEffect, useState } from 'react';
import { Opportunity } from '../types';
import { fetchTomorrowStrategies } from '../services/geminiService';
import { Zap, Activity, Anchor, Loader2, RefreshCw, Target } from 'lucide-react';

const TomorrowTracker: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    const data = await fetchTomorrowStrategies();
    const mapped = data.map((d, i) => ({ ...d, id: `opp-${i}` }));
    setOpportunities(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const renderSection = (title: string, icon: React.ReactNode, type: 'short' | 'pattern' | 'long', colorClass: string, borderColor: string) => {
    const items = opportunities.filter(o => o.type === type);
    
    return (
      <div className={`bg-slate-800/40 rounded-xl border ${borderColor} flex flex-col h-full overflow-hidden`}>
        <div className="p-3 border-b border-slate-700/50 bg-slate-800/80 rounded-t-xl sticky top-0 z-10 backdrop-blur-sm">
          <h3 className={`text-lg font-bold ${colorClass} flex items-center gap-2`}>
            {icon} {title}
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full ml-auto">{items.length}</span>
          </h3>
        </div>
        <div className="p-3 grid gap-3 auto-rows-min content-start overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]">
          {items.length > 0 ? items.map(opp => (
            <div key={opp.id} className="bg-slate-700/30 p-3 rounded-lg border border-slate-600 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-center mb-1">
                <div className="font-bold text-slate-200 text-base group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  {opp.stockName}
                  <span className="text-[10px] font-mono text-slate-500 border border-slate-600 px-1 rounded">{opp.stockCode}</span>
                </div>
                <div className="text-[10px] font-bold text-yellow-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  {opp.score}%
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-2 line-clamp-2 leading-relaxed">{opp.description}</p>
              <div className="flex flex-wrap gap-1">
                {opp.tags.map(tag => (
                  <span key={tag} className="text-[9px] bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded border border-slate-700/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )) : (
             <div className="text-slate-500 text-sm text-center py-10 italic">暂无相关策略推荐</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-4 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
         <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <Target className="text-red-500" /> 明日追踪雷达
             </h2>
             <p className="text-xs text-slate-500 mt-1 ml-8">AI Analysis based on Dragon Tiger List & Technical Breakouts</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-xs text-slate-600 hidden md:block">
                共发现 <span className="text-blue-400 font-bold text-sm">{opportunities.length}</span> 个机会
            </div>
            <button 
                onClick={fetchOpportunities} 
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20"
            >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            刷新策略
            </button>
         </div>
      </div>

      {loading && opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
             <Loader2 className="animate-spin mb-4 relative z-10" size={64} />
          </div>
          <p className="text-lg font-light">AI 正在深度扫描龙虎榜与技术形态...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
            {renderSection("短线爆发 (Speculative)", <Zap size={18}/>, 'short', 'text-up-red', 'border-red-900/30')}
            {renderSection("形态机会 (Technical)", <Activity size={18}/>, 'pattern', 'text-blue-400', 'border-blue-900/30')}
            {renderSection("长线埋伏 (Value)", <Anchor size={18}/>, 'long', 'text-green-400', 'border-green-900/30')}
        </div>
      )}
    </div>
  );
};

export default TomorrowTracker;
