import React, { useState } from 'react';
import { TabType, SystemState } from '../types';
import { Language, translations } from '../i18n';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
  language: Language;
  systemState?: SystemState;
  onOpenVoiceAssistant?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  language,
  systemState,
  onOpenVoiceAssistant,
}) => {
  const [selectedOutlook, setSelectedOutlook] = useState<'30' | '60' | '90'>('90');
  const t = translations[language] || translations.en;
  const dt = t.dashboard;

  const sparklineImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuADeNx6O0DpjCEE6D8ZYhsguMnuYASlr-3jM8h7UPGjhzCmF_0LR6eOSLjPftSHyQtgj8DhUs5-sCdnpKjwPaVE6MH07ifyMUl_maxU4bHTDI_KID53d0XRORVVfHmLa6ABL7konXfQWmTD4ykrgi29-R2tusDTPH0w0ZL_DD317E376phWd33_Ak3W2CI3k6zISy4V4trqQhgGF-OUJhU10LNcmiecpOJ4geYQGPwwgSkc_e8ipC9MZQ';

  const healthScore = systemState ? systemState.healthScore : 72;
  const cashAvailable = systemState ? `₹${systemState.cashAvailableLakhs.toFixed(1)}L` : '₹42.5L';
  const cashRunway = systemState ? systemState.cashRunwayDays : 45;
  const revenueExposure = systemState ? `₹${systemState.revenueExposureLakhs.toFixed(1)}L` : '₹12.8L';
  const activeRisks = systemState ? systemState.activeCriticalRisks : 3;
  const executedCount = systemState ? systemState.executedActions.length : 0;

  // SVG dash calculation for ring (circumference is 2 * pi * 44 ≈ 276.46)
  const ringOffset = Math.max(0, 276 - (276 * healthScore) / 100);

  return (
    <div className="relative z-10 pt-20 pb-28 md:pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen flex flex-col gap-6">
      {/* Top Row: Health Score & Risk Brief Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Health Score Card (Black Bento) */}
        <div className="col-span-1 md:col-span-4 bg-[#0D121F] rounded-[32px] p-8 border border-white/10 shadow-xl flex flex-col items-center justify-between relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="w-full flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono-custom">
              {dt.healthScore}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-mono-custom">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {dt.liveTelemetry}
            </span>
          </div>

          <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center my-4">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-950/60" />
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold text-white tracking-tight font-geist">
                {healthScore}
              </span>
              <span className="text-xs font-semibold text-gray-400 font-mono-custom mt-0.5">
                / 100
              </span>
            </div>
            {/* SVG Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="44"
                stroke={healthScore > 75 ? '#10B981' : healthScore > 50 ? '#6366F1' : '#F43F5E'}
                strokeDasharray="276"
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                strokeWidth="6"
                className="transition-all duration-700"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2 bg-[#121829] px-4 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
            <span className="text-xs font-semibold text-gray-200">
              {healthScore >= 70 ? dt.stableCondition : 'Contagion Vulnerability'}
            </span>
          </div>
        </div>

        {/* Risk Brief Card (Signature Obsidian-Indigo Gradient Bento) */}
        <div className="col-span-1 md:col-span-8 bg-gradient-to-br from-indigo-900/90 via-[#131836] to-[#0A0D1A] border border-indigo-500/30 rounded-[32px] p-8 md:p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-indigo-500/10 pointer-events-none blur-3xl" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300 flex items-center gap-2 font-mono-custom">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {dt.riskBriefTitle}
              </span>
              <div className="flex items-center gap-2">
                {executedCount > 0 && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30 font-mono-custom flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    {executedCount} Actions Active
                  </span>
                )}
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white font-medium backdrop-blur-sm border border-white/10 font-mono-custom">
                  {dt.day18Impact}
                </span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold text-white leading-snug tracking-tight max-w-3xl font-geist">
              "{dt.riskBriefQuote}"
            </h2>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
              {dt.predictedBottleneck}
            </div>
            <div className="flex items-center gap-2.5">
              {onOpenVoiceAssistant && (
                <button
                  onClick={onOpenVoiceAssistant}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-xs flex items-center gap-2 transition-all border border-white/15"
                >
                  <span className="material-symbols-outlined text-sm text-cyan-400">mic</span>
                  <span>{t.voiceAssistant.openVoice}</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('actions')}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 group"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span>Action Center</span>
              </button>
              <button
                onClick={() => onNavigate('copilot')}
                className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-semibold text-xs flex items-center gap-2 transition-all shadow-lg group"
              >
                {dt.analyzeFlow}
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Bento Metrics Grid (Black Theme) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Cash Available */}
        <div className="bg-[#0D121F] rounded-[28px] p-6 border border-white/10 shadow-lg flex flex-col justify-between h-38 hover:border-indigo-500/40 transition-all">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono-custom">
            {dt.cashAvailable}
          </span>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white tracking-tight font-geist">
                {cashAvailable}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 w-[70%] rounded-full shadow-[0_0_8px_#22D3EE]" />
            </div>
          </div>
        </div>

        {/* Cash Runway */}
        <div className="bg-[#0A0E17] rounded-[28px] p-6 border border-white/10 text-white shadow-lg flex flex-col justify-between h-38 hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono-custom">
              {dt.cashRunway}
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono-custom">
              {dt.burnRate}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-400 tracking-tight font-geist">
                {cashRunway}
              </span>
              <span className="text-xs text-gray-400 font-mono-custom">{dt.daysRemaining}</span>
            </div>
            <div
              className="h-4 w-full mt-2 opacity-60 bg-contain bg-no-repeat bg-left"
              style={{ backgroundImage: `url('${sparklineImg}')` }}
            />
          </div>
        </div>

        {/* Revenue Exposure */}
        <div className="bg-[#0D121F] rounded-[28px] p-6 border border-white/10 shadow-lg flex flex-col justify-between h-38 hover:border-rose-500/40 transition-all">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest font-mono-custom">
            {dt.revenueExposure}
          </span>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-rose-400 tracking-tight font-geist">
                {revenueExposure}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-[40%] rounded-full shadow-[0_0_8px_#F43F5E]" />
            </div>
          </div>
        </div>

        {/* Active Risks */}
        <div className="bg-gradient-to-br from-amber-600/30 to-rose-600/30 border border-rose-500/40 rounded-[28px] p-6 text-white shadow-lg flex flex-col justify-between h-38 hover:shadow-rose-900/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-widest font-mono-custom">
              {dt.activeRisks}
            </span>
            <span className="material-symbols-outlined text-base text-rose-400">warning</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight font-geist">
              {activeRisks}
            </span>
            <span className="text-xs text-rose-300 font-mono-custom font-bold">
              {dt.nodesCritical}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Risk Horizon Outlook & Recent Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow">
        {/* Outlook Chart Bento Card */}
        <div className="col-span-1 md:col-span-7 bg-[#0D121F] rounded-[32px] p-8 border border-white/10 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight font-geist">
                {dt.riskHorizonOutlook}
              </h3>
              <p className="text-xs text-gray-400 font-mono-custom">
                {dt.dynamicProbability}
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30 font-mono-custom">
              {dt.predictiveAi}
            </span>
          </div>

          <div className="flex items-end gap-6 md:gap-8 pb-2 px-4 h-48 relative border-b border-white/10">
            {/* Bar 30 */}
            <div
              onClick={() => setSelectedOutlook('30')}
              className={`flex-1 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                selectedOutlook === '30' ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-full bg-indigo-500 rounded-2xl h-20 flex items-center justify-center shadow-lg relative overflow-hidden border border-indigo-400/30">
                <span className="text-xs font-bold text-white font-mono-custom">30%</span>
              </div>
              <span className="font-semibold text-gray-300 text-xs">{dt.days30}</span>
            </div>

            {/* Bar 60 */}
            <div
              onClick={() => setSelectedOutlook('60')}
              className={`flex-1 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                selectedOutlook === '60' ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-full bg-amber-500 rounded-2xl h-32 flex items-center justify-center shadow-lg relative overflow-hidden border border-amber-400/30">
                <span className="text-xs font-bold text-white font-mono-custom">65%</span>
              </div>
              <span className="font-semibold text-gray-300 text-xs">{dt.days60}</span>
            </div>

            {/* Bar 90 */}
            <div
              onClick={() => setSelectedOutlook('90')}
              className={`flex-1 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                selectedOutlook === '90' ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-full bg-rose-500 rounded-2xl h-40 flex items-center justify-center shadow-lg relative overflow-hidden border border-rose-400/30">
                <span className="text-xs font-bold text-white font-mono-custom">85%</span>
              </div>
              <span className="font-semibold text-gray-300 text-xs">{dt.days90}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity / Alerts Bento Card */}
        <div className="col-span-1 md:col-span-5 bg-[#0D121F] rounded-[32px] p-8 border border-white/10 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white tracking-tight font-geist">
              {dt.recentAlerts}
            </h3>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {dt.seeAll}
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
            {/* Alert Item (Critical) */}
            <div
              onClick={() => onNavigate('domino-map')}
              className="p-4 bg-[#121829] rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition-all flex gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 border border-rose-500/30">
                <span className="material-symbols-outlined text-base">error</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide font-mono-custom">
                    CRITICAL
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono-custom">10m ago</span>
                </div>
                <p className="text-xs font-bold text-white mb-0.5 font-geist">
                  {dt.alert1Title}
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {dt.alert1Desc}
                </p>
              </div>
            </div>

            {/* Alert Item (Warning) */}
            <div
              onClick={() => onNavigate('simulator')}
              className="p-4 bg-[#121829] rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all flex gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30">
                <span className="material-symbols-outlined text-base">warning</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide font-mono-custom">
                    WARNING
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono-custom">1h ago</span>
                </div>
                <p className="text-xs font-bold text-white mb-0.5 font-geist">
                  {dt.alert2Title}
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {dt.alert2Desc}
                </p>
              </div>
            </div>

            {/* Alert Item (Info) */}
            <div
              onClick={() => onNavigate('copilot')}
              className="p-4 bg-[#121829] rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-cyan-400 shrink-0 border border-indigo-500/30">
                <span className="material-symbols-outlined text-base">info</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide font-mono-custom">
                    MODEL
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono-custom">5h ago</span>
                </div>
                <p className="text-xs font-bold text-white mb-0.5 font-geist">
                  {dt.alert3Title}
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {dt.alert3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Financial Crisis Simulation Bento Pill CTA */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={() => onNavigate('simulator')}
          className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-sm md:text-base flex items-center gap-3 transition-all shadow-xl shadow-white/10 group font-geist"
        >
          <span
            className="material-symbols-outlined text-xl text-indigo-600 group-hover:scale-110 transition-transform"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
          {dt.startSimulation}
        </button>
      </div>
    </div>
  );
};
