import React, { useState } from 'react';
import OverviewModule from './components/OverviewModule';
import WatchlistModule from './components/WatchlistModule';
import NewsModule from './components/NewsModule';
import DailyReviewModule from './components/DailyReviewModule';
import TomorrowTracker from './components/TomorrowTracker';
import { TABS } from './constants';
import { LayoutDashboard, List, Newspaper, PieChart, Radar } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS.WATCHLIST);

  const renderContent = () => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return <div className="p-6"><OverviewModule /><div className="text-slate-400 text-center mt-10">请选择其他模块查看详细数据</div></div>;
      case TABS.WATCHLIST:
        return (
          <div className="flex flex-col h-full p-6 gap-6">
            <OverviewModule />
            <div className="flex-1 min-h-0 flex gap-6">
               <div className="flex-[2] min-w-0 h-full"><WatchlistModule /></div>
               <div className="flex-1 min-w-0 h-full hidden xl:block"><NewsModule /></div>
            </div>
          </div>
        );
      case TABS.NEWS:
        return <div className="p-6 h-full"><NewsModule /></div>;
      case TABS.REVIEW:
        return <div className="p-6 h-full"><DailyReviewModule /></div>;
      case TABS.TOMORROW:
        return <div className="p-6 h-full"><TomorrowTracker /></div>;
      default:
        return <OverviewModule />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
        activeTab === tab 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-850 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AlphaSeeker
          </h1>
          <p className="text-xs text-slate-500 mt-1">A股智能监控复盘系统</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <NavButton tab={TABS.WATCHLIST} icon={List} label="行情监控" />
          <NavButton tab={TABS.REVIEW} icon={PieChart} label="每日复盘" />
          <NavButton tab={TABS.TOMORROW} icon={Radar} label="明日追踪" />
          <NavButton tab={TABS.NEWS} icon={Newspaper} label="情报中心" />
          <NavButton tab={TABS.OVERVIEW} icon={LayoutDashboard} label="市场概览" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 p-3 rounded text-xs text-slate-400">
            <div className="font-bold text-slate-300 mb-1">API Status</div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${process.env.API_KEY ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {process.env.API_KEY ? 'Gemini Connected' : 'API Key Missing'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden relative">
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;