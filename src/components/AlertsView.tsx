import React, { useState } from 'react';
import { TabType, AlertItem } from '../types';
import { Language, translations } from '../i18n';

interface AlertsViewProps {
  onNavigate: (tab: TabType) => void;
  language: Language;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onNavigate, language }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const t = translations[language] || translations.en;
  const at = t.alerts;

  const alerts: AlertItem[] = [
    {
      id: 'alt-1',
      title: at.alert1Title,
      description: at.alert1Desc,
      type: 'critical',
      timestamp: '10 mins ago',
      impact: 'High Severity • Affects Production Core',
    },
    {
      id: 'alt-2',
      title: at.alert2Title,
      description: at.alert2Desc,
      type: 'critical',
      timestamp: '25 mins ago',
      impact: 'Critical • Liquidity Shortage Risk',
    },
    {
      id: 'alt-3',
      title: at.alert3Title,
      description: at.alert3Desc,
      type: 'warning',
      timestamp: '1 hour ago',
      impact: 'Medium • +₹42,000 monthly burn',
    },
    {
      id: 'alt-4',
      title: at.alert4Title,
      description: at.alert4Desc,
      type: 'warning',
      timestamp: '3 hours ago',
      impact: 'Pending Review',
    },
    {
      id: 'alt-5',
      title: at.alert5Title,
      description: at.alert5Desc,
      type: 'info',
      timestamp: '5 hours ago',
      impact: 'Model Accuracy: 98.4%',
    },
  ];

  const filtered = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono-custom">
              {at.badge}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-geist">
            {at.title}
          </h1>
          <p className="text-sm text-gray-400">
            {at.desc}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 bg-[#0D121F] p-1.5 rounded-full border border-white/10 shadow-lg font-mono-custom text-xs">
          {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full uppercase font-bold transition-all ${
                filter === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {type === 'all' ? at.all : type === 'critical' ? at.critical : type === 'warning' ? at.warning : at.info}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => {
          let iconBg = 'bg-indigo-500/20 text-cyan-400 border border-indigo-500/30';
          let icon = 'info';
          let borderStyle = 'border-white/10 hover:border-indigo-500/40';
          let badgeBg = 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';

          if (item.type === 'critical') {
            iconBg = 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
            icon = 'error';
            borderStyle = 'border-rose-500/30 bg-[#140B10] hover:border-rose-500/60';
            badgeBg = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
          } else if (item.type === 'warning') {
            iconBg = 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
            icon = 'warning';
            borderStyle = 'border-amber-500/30 bg-[#14100B] hover:border-amber-500/60';
            badgeBg = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
          }

          return (
            <div
              key={item.id}
              className={`bg-[#0D121F] p-6 rounded-2xl border ${borderStyle} shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-2xl`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-xl">
                    {icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-white font-geist">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-mono-custom text-gray-400">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                    {item.description}
                  </p>
                  {item.impact && (
                    <span className={`inline-block text-[10px] font-mono-custom font-bold mt-2 px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                      {item.impact}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto justify-end shrink-0">
                <button
                  onClick={() => onNavigate('copilot')}
                  className="px-5 py-2.5 bg-white hover:bg-gray-200 text-black rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-indigo-600">smart_toy</span>
                  {at.mitigateViaAi}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
