import React, { useState } from 'react';
import { TabType } from '../types';
import { Language, translations } from '../i18n';

interface SimulatorViewProps {
  onNavigate: (tab: TabType) => void;
  language: Language;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onNavigate, language }) => {
  const [selectedScenario, setSelectedScenario] = useState<'customer' | 'supplier' | 'revenue' | 'interest'>('customer');
  const [amountExposed, setAmountExposed] = useState<number>(5000000);
  const [delayDays, setDelayDays] = useState<number>(45);
  const [probability, setProbability] = useState<number>(82);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationComplete, setSimulationComplete] = useState<boolean>(false);

  const t = translations[language] || translations.en;
  const st = t.simulator;

  // Dynamic calculations based on sliders
  const calculatedExposureLakhs = (amountExposed * (probability / 100) / 100000 * 0.37).toFixed(1);
  const calculatedRecoveryDays = Math.round(delayDays * 2.6 + (probability * 0.2));
  const simulatedRunwayMonths = Math.max(1, Math.round(14 - (delayDays / 12) - (amountExposed / 1500000)));

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 1200);
  };

  return (
    <div className="pt-20 pb-28 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col md:pr-84">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono-custom">
            {st.badge}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-geist">
          {st.title}
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          {st.desc}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Scenario Initiators Bento Grid */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono-custom mb-3">
              {st.scenarioInitiators}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Customer Delays */}
              <div
                onClick={() => setSelectedScenario('customer')}
                className={`bg-[#0D121F] rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 shadow-lg hover:border-indigo-500/50 ${
                  selectedScenario === 'customer'
                    ? 'ring-2 ring-indigo-500 bg-indigo-950/40 border-indigo-500/50'
                    : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-cyan-400 flex items-center justify-center border border-indigo-500/30">
                  <span className="material-symbols-outlined text-xl">money_off</span>
                </div>
                <span className="text-sm font-bold text-white font-geist">
                  {st.customerDelays}
                </span>
              </div>

              {/* Supplier Fails */}
              <div
                onClick={() => setSelectedScenario('supplier')}
                className={`bg-[#0D121F] rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 shadow-lg hover:border-rose-500/50 ${
                  selectedScenario === 'supplier'
                    ? 'ring-2 ring-rose-500 bg-rose-950/40 border-rose-500/50'
                    : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <span className="material-symbols-outlined text-xl">warning</span>
                </div>
                <span className="text-sm font-bold text-white font-geist">
                  {st.supplierFails}
                </span>
              </div>

              {/* Revenue Drop */}
              <div
                onClick={() => setSelectedScenario('revenue')}
                className={`bg-[#0D121F] rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 shadow-lg hover:border-amber-500/50 ${
                  selectedScenario === 'revenue'
                    ? 'ring-2 ring-amber-500 bg-amber-950/40 border-amber-500/50'
                    : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <span className="material-symbols-outlined text-xl">trending_down</span>
                </div>
                <span className="text-sm font-bold text-white font-geist">
                  {st.revenueDrop}
                </span>
              </div>

              {/* Interest Hike */}
              <div
                onClick={() => setSelectedScenario('interest')}
                className={`bg-[#0D121F] rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between h-32 relative overflow-hidden group border border-white/10 shadow-lg hover:border-purple-500/50 ${
                  selectedScenario === 'interest'
                    ? 'ring-2 ring-purple-500 bg-purple-950/40 border-purple-500/50'
                    : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <span className="material-symbols-outlined text-xl">account_balance</span>
                </div>
                <span className="text-sm font-bold text-white font-geist">
                  {st.interestHike}
                </span>
              </div>
            </div>
          </section>

          {/* Crisis Parameters Controls Bento Card (Black Theme) */}
          <section className="bg-[#0D121F] rounded-[32px] p-8 border border-white/10 shadow-xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono-custom mb-6">
              {st.crisisParameters}
            </h3>

            <div className="space-y-6">
              {/* Amount Exposed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs md:text-sm font-medium text-gray-300">
                    {st.amountExposed}
                  </label>
                  <span className="font-mono-custom text-base font-bold text-cyan-400">
                    ₹ {amountExposed.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={amountExposed}
                  onChange={(e) => setAmountExposed(Number(e.target.value))}
                />
              </div>

              {/* Delay Duration */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs md:text-sm font-medium text-gray-300">
                    {st.delayDuration}
                  </label>
                  <span className="font-mono-custom text-base font-bold text-indigo-400">
                    {delayDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="180"
                  value={delayDays}
                  onChange={(e) => setDelayDays(Number(e.target.value))}
                />
              </div>

              {/* Propagation Probability */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs md:text-sm font-medium text-gray-300">
                    {st.propagationProb}
                  </label>
                  <span className="font-mono-custom text-base font-bold text-rose-400">
                    {probability}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                />
              </div>
            </div>
          </section>

          {/* Simulate Button */}
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold text-sm md:text-base rounded-full shadow-lg shadow-white/10 transition-all flex items-center justify-center gap-3 tracking-wide disabled:opacity-75"
          >
            {isSimulating ? (
              <>
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                {st.calculatingPathways}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl text-indigo-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_circle
                </span>
                {st.simulateCrisisCascade}
              </>
            )}
          </button>
        </div>

        {/* Right Column: Preview & Metrics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Real-time Impact Summary Bento Card */}
          <section className="bg-[#0D121F] rounded-[32px] p-6 border border-white/10 shadow-xl">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono-custom mb-4">
              {st.impactSummary}
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-baseline bg-[#121829] p-3.5 rounded-2xl border border-white/10">
                <span className="text-xs font-medium text-gray-400">{st.totalExposure}</span>
                <span className="font-mono-custom text-xl font-bold text-white">
                  ₹{calculatedExposureLakhs}L
                </span>
              </div>
              <div className="flex justify-between items-baseline bg-[#121829] p-3.5 rounded-2xl border border-white/10">
                <span className="text-xs font-medium text-gray-400">{st.recoveryTime}</span>
                <span className="font-mono-custom text-xl font-bold text-amber-400">
                  {calculatedRecoveryDays} Days
                </span>
              </div>
            </div>
          </section>

          {/* Propagation Preview with Domino Chain (Black Theme) */}
          <section className="bg-[#0D121F] rounded-[32px] p-6 border border-white/10 shadow-xl relative flex-1 min-h-[260px]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono-custom mb-5">
              {st.propagationPreview}
            </h3>

            <div className="relative pl-6">
              {/* Domino vertical connecting line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 via-amber-400 to-rose-500" />

              <div className="flex flex-col gap-3.5">
                {/* Step 1: Payment Delay */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 absolute -left-[23px] ring-4 ring-indigo-500/20 shadow-[0_0_8px_#6366F1]" />
                  <div className="bg-[#121829] px-3.5 py-2.5 rounded-xl flex-1 border border-white/10">
                    <span className="text-xs font-medium text-gray-200">
                      {st.paymentDelay} ({delayDays}d)
                    </span>
                  </div>
                </div>

                {/* Step 2: Cash Shortage */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 absolute -left-[23px] ring-4 ring-amber-500/20 shadow-[0_0_8px_#F59E0B]" />
                  <div className="bg-[#121829] px-3.5 py-2.5 rounded-xl flex-1 border border-white/10">
                    <span className="text-xs font-medium text-gray-200">
                      {st.cashShortage} (-₹{(amountExposed / 100000).toFixed(1)}L)
                    </span>
                  </div>
                </div>

                {/* Step 3: Supplier Default */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400 absolute -left-[23px] ring-4 ring-rose-500/20 shadow-[0_0_8px_#FB7185]" />
                  <div className="bg-[#121829] px-3.5 py-2.5 rounded-xl flex-1 border border-white/10">
                    <span className="text-xs font-medium text-gray-200">
                      {st.supplierDefault} ({probability}%)
                    </span>
                  </div>
                </div>

                {/* Step 4: Inventory Halt */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-600 absolute -left-[23px] ring-4 ring-rose-600/30 shadow-[0_0_8px_#F43F5E]" />
                  <div className="bg-rose-950/40 border border-rose-500/40 px-3.5 py-2.5 rounded-xl flex-1">
                    <span className="text-xs font-bold text-rose-300">
                      {st.inventoryHalt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Before vs After Runway Bento Cards */}
          <section className="grid grid-cols-2 gap-3">
            <div className="bg-[#0D121F] rounded-2xl p-4 flex flex-col justify-between border border-white/10 shadow-lg">
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono-custom">
                {st.currentRunway}
              </span>
              <span className="font-mono-custom text-2xl font-bold text-white my-1">
                14 Mo
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono-custom">
                {st.baseline}
              </span>
            </div>

            <div className="bg-rose-950/40 rounded-2xl p-4 flex flex-col justify-between border border-rose-500/40 shadow-lg">
              <span className="text-[10px] font-bold text-rose-400 uppercase font-mono-custom">
                {st.simulated}
              </span>
              <span className="font-mono-custom text-2xl font-bold text-rose-300 my-1">
                {simulatedRunwayMonths} Mo
              </span>
              <span className="text-[10px] font-bold text-rose-400 uppercase font-mono-custom">
                -{14 - simulatedRunwayMonths} MONTHS
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* Desktop Simulation Engine Nav Drawer (Obsidian Black) */}
      <aside className="hidden md:flex fixed top-0 right-0 h-screen z-30 pt-20 bg-[#0A0E17]/95 backdrop-blur-2xl w-80 border-l border-white/10 shadow-2xl flex-col text-gray-300">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase font-mono-custom">
            {t.dominoMap.simulationEngine}
          </h2>
        </div>
        <ul className="flex-1 py-4 flex flex-col gap-1.5 px-4">
          <li>
            <button
              onClick={() => onNavigate('simulator')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-cyan-300 font-bold bg-indigo-500/20 border border-indigo-500/30 text-left text-sm"
            >
              <span className="material-symbols-outlined text-lg text-cyan-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                science
              </span>
              <span>{t.dominoMap.scenarios}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('domino-map')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors text-left text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg text-gray-400">adjust</span>
              <span>{t.dominoMap.riskNodes}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('copilot')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors text-left text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg text-gray-400">timeline</span>
              <span>{t.dominoMap.flowAnalysis}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-300 hover:bg-white/5 transition-colors text-left text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg text-gray-400">history</span>
              <span>{t.dominoMap.historicalData}</span>
            </button>
          </li>
        </ul>

        {/* Quick Launch Copilot Action in Drawer */}
        <div className="p-6 border-t border-white/10 bg-[#07090E]">
          <button
            onClick={() => onNavigate('copilot')}
            className="w-full py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded-full text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            {t.dominoMap.askAiCopilot}
          </button>
        </div>
      </aside>
    </div>
  );
};
