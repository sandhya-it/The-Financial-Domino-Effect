import React, { useState, useRef, useEffect } from 'react';
import { TabType } from '../types';
import { Language, LANGUAGES, translations } from '../i18n';

interface TopAppBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenVoiceAssistant: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenVoiceAssistant,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);
  const t = translations[language] || translations.en;

  const profileAvatar =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAl0gkU27OhsOkmAV04M2thpXsFDEd1XRKrb7i3zxp9caYDDf_3C_tSPaoGjr-JsCPNhiP2cXp4b6AhDrCXecsi4Xd5osS2802AIV3SZHtTmcoF_3n-x-ttuDmXE37AacGaFPa4P8me65_QAtI9_xeVztZC1dmiUfupgjQ9sHx_u7vnGG9FREo3IQMg3jg0ImExkUWffXeaML-muy2njvPuqX8-j5TJHKOHAzik1dLa3xUBoU9hWHu8NQ';

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 md:px-8 py-3 bg-[#0A0E17]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40">
      {/* Brand Logo & Title */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setActiveTab('dashboard')}
      >
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform ring-2 ring-indigo-400/20">
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_tree
          </span>
        </div>
        <div>
          <h1 className="font-bold text-base md:text-lg text-white tracking-tight leading-none font-geist">
            {t.appTitle}
          </h1>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 font-mono-custom">
            {t.appSubtitle}
          </span>
        </div>
      </div>

      {/* Desktop Navigation Links (Black Theme Bento Pills) */}
      <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#0E1424] rounded-full border border-white/10 shadow-inner">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'dashboard'
              ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.nav.dashboard}
        </button>
        <button
          onClick={() => setActiveTab('domino-map')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'domino-map'
              ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.nav.dominoMap}
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'simulator'
              ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.nav.simulator}
        </button>
        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'copilot'
              ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.nav.copilot}
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
            activeTab === 'actions'
              ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {t.nav.actions}
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'alerts'
              ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.nav.alerts}
        </button>
      </nav>

      {/* Right Actions: AI Voice Assistant CTA + Language Selector + User Avatar */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* AI Voice Assistant Button */}
        <button
          onClick={onOpenVoiceAssistant}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-full text-xs font-semibold transition-all shadow-lg shadow-indigo-500/25 ring-2 ring-cyan-400/30 group"
          title={t.voiceAssistant.openVoice}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-base group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              mic
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline font-geist">{t.voiceAssistant.openVoice}</span>
        </button>

        {/* Multi-Language Dropdown */}
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1424] hover:bg-[#141C33] text-gray-200 border border-white/10 rounded-full text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-sm text-cyan-400">translate</span>
            <span className="font-medium">{currentLangObj.nativeName}</span>
            <span className="material-symbols-outlined text-xs text-gray-400">
              {langMenuOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#0A0E17] border border-white/10 rounded-2xl shadow-2xl shadow-black overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono-custom text-gray-500 border-b border-white/5">
                Select Language
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    language === l.code
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{l.nativeName}</span>
                    <span className="text-[10px] text-gray-400 font-mono-custom">({l.name})</span>
                  </div>
                  {language === l.code && (
                    <span className="material-symbols-outlined text-sm">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#141C33] flex items-center justify-center border border-white/10 overflow-hidden shadow-sm ring-2 ring-indigo-500/30">
          <img
            src={profileAvatar}
            alt="User Profile"
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};
