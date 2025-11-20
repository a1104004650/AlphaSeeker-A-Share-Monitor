
import React, { useEffect, useState } from 'react';
import { DailyReviewData } from '../types';
import { getDailyReviewData } from '../services/marketDataService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, ArrowRightLeft, Loader2, AlertTriangle, Flame } from 'lucide-react';

const DailyReviewModule: React.FC = () => {
  const [data, setData] = useState<DailyReviewData | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getDailyReviewData();
      setData(result.data);
      setAnalysis(result.analysis);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p>AI 正在深度扫描全市场数据...</p>
    </div>
  );

  if (!data) return (
     <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <AlertTriangle size={48} className="mb-2" />
        <p>数据加载失败，请稍后重试</p>
     </div>
  );

  return (
    <div className="space-y-6 p-4 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold text-white mb-4">今日市场复盘 (Real-time)</h2>
      
      {/* Limit Up/Down Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-900/30 to-slate-800 border border-red-900/50 p-4 rounded-lg text-center shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-red-500/10"><Flame size={80}/></div>
          <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider">涨停家数</div>
          <div className="text-4xl font-bold text-up-red relative z-10">{data.limitUpCount}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg text-center shadow-lg">
           <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider">炸板率</div>
           <div className="text-4xl font-bold text-slate-200">
             {data.limitUpCount > 0 ? Math.round((data.limitUpBrokenCount / (data.limitUpCount + data.limitUpBrokenCount)) * 100) : 0}%
           </div>
           <div className="text-xs text-slate-500 mt-1">{data.limitUpBrokenCount} 家炸板</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 to-slate-800 border border-green-900/50 p-4 rounded-lg text-center shadow-lg">
          <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider">跌停家数</div>
          <div className="text-4xl font-bold text-down-green">{data.limitDownCount}</div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-lg border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain size={100} />
        </div>
        <h3 className="text-indigo-400 font-bold mb-3 flex items-center gap-2 text-lg relative z-10">
          <Brain size={24} /> AI 核心复盘
        </h3>
        <p className="text-slate-300 text-sm leading-7 whitespace-pre-line relative z-10 font-light">
          {analysis || "暂无分析数据"}
        </p>
      </div>

      {/* Limit Up Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Flame className="text-up-red" size={18} /> 今日涨停梯队
          </h3>
          <span className="text-xs text-slate-500">按连板高度排序</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="p-3 font-medium">名称/代码</th>
                <th className="p-3 font-medium text-right">现价</th>
                <th className="p-3 font-medium">所属板块</th>
                <th className="p-3 font-medium text-center">连板数</th>
                <th className="p-3 font-medium">涨停原因/概念</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.limitUpList && data.limitUpList.length > 0 ? (
                data.limitUpList.sort((a, b) => b.consecutiveDays - a.consecutiveDays).map((stock) => (
                  <tr key={stock.code} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{stock.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{stock.code}</div>
                    </td>
                    <td className="p-3 text-right font-mono text-up-red font-bold">
                      {stock.price}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-700 px-2 py-0.5 rounded text-xs">{stock.sector}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        stock.consecutiveDays >= 3 ? 'bg-red-600 text-white' : 
                        stock.consecutiveDays === 2 ? 'bg-orange-600/80 text-white' : 
                        'bg-slate-600 text-slate-200'
                      }`}>
                        {stock.consecutiveDays}板
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-400 max-w-xs truncate" title={stock.reason}>
                      {stock.reason}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">暂无详细涨停数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sector Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
             <TrendingUp className="text-up-red" size={18}/> 领涨板块 Top 5
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topSectors} layout="vertical" margin={{ left: 40 }}>
                 <XAxis type="number" hide />
                 <YAxis type="category" dataKey="name" width={80} tick={{fill: '#cbd5e1', fontSize: 12}} axisLine={false} tickLine={false} />
                 <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px'}} 
                 />
                 <Bar dataKey="change" name="涨幅%" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
             <ArrowRightLeft className="text-yellow-500" size={18}/> 资金流入 Top 5 (百万)
          </h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.inflowSectors} layout="vertical" margin={{ left: 40 }}>
                 <XAxis type="number" hide />
                 <YAxis type="category" dataKey="name" width={80} tick={{fill: '#cbd5e1', fontSize: 12}} axisLine={false} tickLine={false} />
                 <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px'}} 
                 />
                 <Bar dataKey="netInflow" name="净流入" fill="#eab308" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReviewModule;
