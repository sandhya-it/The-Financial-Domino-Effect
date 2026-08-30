import React, { useState } from 'react';
import { TabType, NodeData } from '../types';
import { Language, translations } from '../i18n';

interface DominoMapViewProps {
  onNavigate: (tab: TabType) => void;
  language: Language;
}

export const DominoMapView: React.FC<DominoMapViewProps> = ({ onNavigate, language }) => {
  const [filter, setFilter] = useState<'all' | 'high-risk'>('all');
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [showContingencySuccess, setShowContingencySuccess] = useState(false);
  const t = translations[language] || translations.en;
  const mt = t.dominoMap;

  const nodes: NodeData[] = [
    {
      id: 'customer-alpha',
      name: 'Customer\nAlpha',
      category: 'customer',
      riskLevel: 'stable',
      exposure: '₹12.8L',
      details: 'Primary tier enterprise contract. Invoice delay in review cycle.',
      downstreamImpact: 'Cash flow delay triggers liquidity reserve squeeze within 18 days.',
      icon: 'group',
      x: 120,
      y: 200,
      size: 90,
    },
    {
      id: 'account-bravo',
      name: 'Key Account\nBravo',
      category: 'account',
      riskLevel: 'elevated',
      exposure: '₹24.0L',
      details: 'Q3 renewal pending audit sign-off. Payment risk elevated to 65%.',
      downstreamImpact: 'May disrupt working capital pipeline if delayed beyond 30 days.',
      icon: 'account_balance',
      x: 120,
      y: 380,
      size: 100,
    },
    {
      id: 'cash-reserves',
      name: 'CASH\nRESERVES',
      category: 'cash',
      riskLevel: 'stable',
      exposure: '₹42.5L Total',
      details: 'Central treasury buffer. Current operational runway is 45 days.',
      downstreamImpact: 'Buffer sustains operations before triggering supplier delay cascades.',
      icon: 'account_balance_wallet',
      x: 360,
      y: 280,
      size: 120,
    },
    {
      id: 'production-core',
      name: 'Production\nCore',
      category: 'production',
      riskLevel: 'critical',
      exposure: '$4.2M / day',
      details: 'Central manufacturing line dependent on prompt parts delivery.',
      downstreamImpact: 'Supplier Beta failure is constricting material inflow, projecting a 40% drop in Q3 delivery capacity.',
      icon: 'precision_manufacturing',
      x: 600,
      y: 280,
      size: 96,
    },
    {
      id: 'supplier-beta',
      name: 'Supplier\nBeta',
      category: 'supplier',
      riskLevel: 'critical',
      exposure: '₹8.5L Invoiced',
      details: 'Reduced terms from 45 to 30 days; 48hr delivery delay logged.',
      downstreamImpact: 'Direct stop-work risk for Production Core if cash clearance is not posted.',
      icon: 'local_shipping',
      x: 780,
      y: 160,
      size: 92,
    },
    {
      id: 'logistics-delta',
      name: 'Logistics\nDelta',
      category: 'logistics',
      riskLevel: 'stable',
      exposure: '₹3.2L',
      details: 'Secondary freight partner operating at standard turnaround parameters.',
      downstreamImpact: 'Stable alternate routes available in case of regional bottlenecks.',
      icon: 'inventory_2',
      x: 780,
      y: 400,
      size: 84,
    },
  ];

  const filteredNodes = filter === 'high-risk'
    ? nodes.filter((n) => n.riskLevel === 'critical' || n.riskLevel === 'elevated')
    : nodes;

  const handleInitiateContingency = () => {
    setShowContingencySuccess(true);
    setTimeout(() => {
      setShowContingencySuccess(false);
      setSelectedNode(null);
    }, 2000);
  };

  return (
    <div className="pt-20 pb-28 md:pb-8 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen flex flex-col md:pr-84">
      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 z-20 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono-custom">
              {mt.badge}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-geist">
            {mt.title}
          </h1>
          <p className="text-sm text-gray-400">
            {mt.desc}
          </p>
        </div>

        <div className="flex gap-2 bg-[#0D121F] p-1.5 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full font-mono-custom text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {mt.allNodes}
          </button>
          <button
            onClick={() => setFilter('high-risk')}
            className={`px-5 py-2 rounded-full font-mono-custom text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'high-risk'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">warning</span>
            {mt.highRisk}
          </button>
        </div>
      </div>

      {/* Network Graph Stage Bento Card (Black Theme) */}
      <div className="flex-1 relative bg-[#0D121F] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center min-h-[580px]">
        {/* Subtle dark matrix dot grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Legend Bento Chip */}
        <div className="absolute top-5 left-5 p-4 bg-[#0A0E17]/90 backdrop-blur-md rounded-2xl z-20 border border-white/10 shadow-xl">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono-custom">
            {mt.riskTopology}
          </h3>
          <div className="flex flex-col gap-2 font-mono-custom text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20 shadow-[0_0_8px_#F43F5E]" />
              <span className="text-gray-200 font-medium">{mt.criticalRisk}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20 shadow-[0_0_8px_#F59E0B]" />
              <span className="text-gray-200 font-medium">{mt.elevatedRisk}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 shadow-[0_0_8px_#6366F1]" />
              <span className="text-gray-200 font-medium">{mt.stable}</span>
            </div>
          </div>
        </div>

        {/* SVG Connectors / Flow Lines (Glowing in Black Theme) */}
        <svg
          className="absolute inset-0 z-10 pointer-events-none w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Customer Alpha to Cash Flow */}
          <path
            className="flow-line"
            d="M 170 200 Q 280 180 360 280"
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            opacity="0.8"
          />

          {/* Account Bravo to Cash Flow */}
          <path
            className="flow-line"
            d="M 170 380 Q 280 380 360 280"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            opacity="0.9"
          />

          {/* Cash Flow to Production Core */}
          <path
            className="flow-line"
            d="M 420 280 L 600 280"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="4"
            opacity="0.8"
          />

          {/* Production Core to Supplier Beta (Critical Hazard) */}
          <path
            className="flow-line"
            d="M 650 280 Q 720 180 780 160"
            fill="none"
            stroke="#F43F5E"
            strokeWidth="4"
            opacity="0.9"
          />

          {/* Production Core to Logistics Delta */}
          <path
            className="flow-line"
            d="M 650 280 Q 720 380 780 400"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2"
            opacity="0.5"
          />
        </svg>

        {/* Interactive Nodes */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {filteredNodes.map((node) => {
            let borderClass = 'border-indigo-500/40 bg-[#0A0E17] text-cyan-400 hover:border-cyan-400 shadow-lg';
            let iconColor = 'text-cyan-400';
            let badgeColor = 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';

            if (node.riskLevel === 'critical') {
              borderClass = 'border-rose-500/60 bg-[#160B12] text-rose-400 hover:border-rose-400 shadow-lg shadow-rose-950/40 ring-4 ring-rose-500/10';
              iconColor = 'text-rose-400';
              badgeColor = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
            } else if (node.riskLevel === 'elevated') {
              borderClass = 'border-amber-500/60 bg-[#17120B] text-amber-400 hover:border-amber-400 shadow-lg shadow-amber-950/40 ring-4 ring-amber-500/10';
              iconColor = 'text-amber-400';
              badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
            }

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  top: `${(node.y / 600) * 100}%`,
                  left: `${(node.x / 1000) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute rounded-2xl border-2 ${borderClass} flex flex-col items-center justify-center p-3.5 cursor-pointer hover:scale-105 transition-all duration-200 group`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <span className={`material-symbols-outlined ${iconColor} text-2xl`}>
                    {node.icon}
                  </span>
                </div>
                <span className="font-mono-custom text-[11px] md:text-xs text-center font-bold leading-tight text-white whitespace-pre-line">
                  {node.name}
                </span>
                <span className={`text-[9px] font-mono-custom font-bold mt-1 px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {node.exposure}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interactive Node Detail Overlay Modal (Black Theme) */}
        {selectedNode && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-84 md:w-96 bg-[#0A0E17] border border-white/15 p-7 rounded-[32px] z-40 shadow-2xl shadow-black animate-[scaleIn_0.2s_ease]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-white font-geist">
                  {selectedNode.name.replace('\n', ' ')}
                </h4>
                <span
                  className={`text-[10px] font-bold font-mono-custom px-2.5 py-0.5 rounded-full uppercase mt-1.5 inline-block ${
                    selectedNode.riskLevel === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedNode.riskLevel === 'elevated'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {selectedNode.riskLevel === 'critical' ? mt.criticalRisk : selectedNode.riskLevel === 'elevated' ? mt.elevatedRisk : mt.stable}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#111626] p-3.5 rounded-2xl border border-white/10">
                <div className="text-[10px] text-gray-400 font-mono-custom uppercase mb-0.5">
                  {mt.financialExposure}
                </div>
                <div className="font-mono-custom text-xl text-white font-bold">
                  {selectedNode.exposure}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-400 font-mono-custom uppercase mb-1">
                  {mt.operationalStatus}
                </div>
                <div className="text-xs text-gray-300 leading-relaxed bg-[#111626] p-3 rounded-xl border border-white/10">
                  {selectedNode.details}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-rose-400 font-mono-custom uppercase font-bold mb-1">
                  {mt.downstreamImpact}
                </div>
                <div className="text-xs text-rose-300 leading-relaxed bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {selectedNode.downstreamImpact}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleInitiateContingency}
                className="flex-1 bg-white hover:bg-gray-200 text-black font-semibold text-xs py-3 rounded-full transition-all shadow-md"
              >
                {mt.initiateContingency}
              </button>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  onNavigate('copilot');
                }}
                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                title={mt.askAiCopilot}
              >
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </button>
            </div>
          </div>
        )}

        {/* Contingency Notification */}
        {showContingencySuccess && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-bounce border border-indigo-400/40">
            <span className="material-symbols-outlined text-emerald-300 text-lg">check_circle</span>
            <span className="text-xs font-mono-custom font-medium">
              {mt.contingencyActivated} {selectedNode?.name.replace('\n', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Desktop Fixed Side Drawer Navigation (Obsidian Black Style) */}
      <aside className="hidden md:flex fixed top-0 right-0 h-screen z-30 pt-20 bg-[#0A0E17]/95 backdrop-blur-2xl w-80 border-l border-white/10 shadow-2xl flex-col text-gray-300">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 font-mono-custom">
            {mt.simulationEngine}
          </h2>
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => onNavigate('simulator')}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors text-left text-sm font-medium text-gray-300"
            >
              <span className="material-symbols-outlined text-lg text-gray-400">science</span>
              {mt.scenarios}
            </button>
            <button
              onClick={() => setFilter('all')}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-cyan-300 font-bold bg-indigo-500/20 border border-indigo-500/30 text-left text-sm"
            >
              <span className="material-symbols-outlined text-cyan-400 text-lg">adjust</span>
              {mt.riskNodes}
            </button>
            <button
              onClick={() => onNavigate('copilot')}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors text-left text-sm font-medium text-gray-300"
            >
              <span className="material-symbols-outlined text-lg text-gray-400">timeline</span>
              {mt.flowAnalysis}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors text-left text-sm font-medium text-gray-300"
            >
              <span className="material-symbols-outlined text-lg text-gray-400">history</span>
              {mt.historicalData}
            </button>
          </nav>
        </div>

        {/* Active Anomalies Box in Drawer */}
        <div className="mt-auto p-6 border-t border-white/10 bg-[#07090E]">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono-custom mb-3">
            {mt.activeAnomalies}
          </h3>
          <div className="space-y-2.5">
            <div className="p-3.5 bg-[#121829] border border-rose-500/30 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-rose-400 font-mono-custom">
                  SUPPLY CHAIN
                </span>
                <span className="font-mono-custom text-[10px] text-gray-500">2m ago</span>
              </div>
              <p className="text-xs text-gray-300">
                {mt.anomalySupply}
              </p>
            </div>
            <div className="p-3.5 bg-[#121829] border border-amber-500/30 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-400 font-mono-custom">
                  RECEIVABLES
                </span>
                <span className="font-mono-custom text-[10px] text-gray-500">14m ago</span>
              </div>
              <p className="text-xs text-gray-300">
                {mt.anomalyReceivables}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
