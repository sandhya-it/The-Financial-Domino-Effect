import React from 'react';
import { TabType } from '../types';
import { Language, translations } from '../i18n';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  onOpenVoiceAssistant: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  language,
  onOpenVoiceAssistant,
}) => {
  const t = translations[language] || translations.en;

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: 'dashboard' },
    { id: 'domino-map', label: t.nav.dominoMap, icon: 'hub' },
    { id: 'simulator', label: t.nav.simulator, icon: 'analytics' },
    { id: 'copilot', label: t.nav.copilot, icon: 'smart_toy' },
    { id: 'actions', label: t.nav.actions, icon: 'bolt' },
    { id: 'alerts', label: t.nav.alerts, icon: 'notifications_active' },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 flex justify-around items-center px-2 py-2 bg-[#0A0E17]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all py-1 px-2.5 rounded-2xl ${
              isActive
                ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg mb-0.5"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[9px] font-semibold tracking-wide truncate max-w-[60px]">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Floating Voice Mic on Mobile */}
      <button
        onClick={onOpenVoiceAssistant}
        className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20"
        title={t.voiceAssistant.openVoice}
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
          mic
        </span>
        <span className="text-[9px] font-semibold tracking-wide">
          Voice
        </span>
      </button>
    </nav>
  );
};
