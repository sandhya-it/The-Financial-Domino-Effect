import React, { useState } from 'react';
import { TabType, ActionCategory, ActionItem, ActionExecutionRecord, SystemState } from '../types';
import { Language, translations } from '../i18n';

interface ActionCenterViewProps {
  onNavigate: (tab: TabType) => void;
  language: Language;
  systemState: SystemState;
  onExecuteAction: (actionId: string, customParams?: Record<string, any>) => void;
  onRevertAction: (actionId: string) => void;
  onTogglePlaybook: (playbookId: string) => void;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({
  onNavigate,
  language,
  systemState,
  onExecuteAction,
  onRevertAction,
  onTogglePlaybook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'all' | 'history'>('all');
  const [activeModalAction, setActiveModalAction] = useState<ActionItem | null>(null);
  const [executingStep, setExecutingStep] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [showReceiptRecord, setShowReceiptRecord] = useState<ActionExecutionRecord | null>(null);
  const [configuredValue, setConfiguredValue] = useState<number>(0);
  const [filterQuery, setFilterQuery] = useState('');

  const t = translations[language] || translations.en;
  const at = t.actions;

  // Master Action Catalog
  const actionCatalog: ActionItem[] = [
    // ⚡ Working Capital & Liquidity
    {
      id: 'act-bridge-credit',
      category: 'liquidity',
      title: 'Drawdown Secured Working Capital Facility',
      shortDesc: 'Inject ₹15.0L immediately from sanctioned corporate credit line to insulate working cash.',
      detailedDesc: 'Executes an automated drawdown from the pre-approved institutional credit facility at 7.2% APR. Instantly increases liquidity buffer and extends total cash runway by +22 days.',
      icon: 'account_balance',
      riskReductionPct: 78,
      financialImpact: '+₹15.0L Instant Liquidity',
      runwayDeltaDays: 22,
      cashDeltaLakhs: 15.0,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 12,
      targetEntity: 'HDFC / State Bank Credit Line',
      difficulty: 'Immediate',
      status: systemState.executedActions.includes('act-bridge-credit') ? 'active' : 'ready',
      configurableParams: {
        label: 'Drawdown Amount',
        value: 15.0,
        min: 5.0,
        max: 25.0,
        step: 2.5,
        unit: 'Lakhs (₹)',
      },
    },
    {
      id: 'act-invoice-factoring',
      category: 'liquidity',
      title: 'Dynamic Invoice Factoring & Early Settlement',
      shortDesc: 'Liquidate ₹12.8L in pending receivables through TReDS at a 2.8% discount.',
      detailedDesc: 'Dispatches high-rated receivables to auction pool for immediate settlement within 24 hours. Guarantees working capital without taking balance sheet debt.',
      icon: 'receipt_long',
      riskReductionPct: 65,
      financialImpact: '+₹11.2L Cash Inflow',
      runwayDeltaDays: 16,
      cashDeltaLakhs: 11.2,
      exposureDeltaLakhs: -12.8,
      healthDeltaScore: 9,
      targetEntity: 'KredX / TReDS Receivable Exchange',
      difficulty: 'Fast',
      status: systemState.executedActions.includes('act-invoice-factoring') ? 'active' : 'ready',
      configurableParams: {
        label: 'Discount Rate Allocation',
        value: 2.8,
        min: 1.5,
        max: 5.0,
        step: 0.1,
        unit: '%',
      },
    },
    {
      id: 'act-treasury-sweep',
      category: 'liquidity',
      title: 'Strategic Treasury Reserve Sweeping',
      shortDesc: 'Sweep ₹6.5L from overnight liquid debt funds into the primary operational account.',
      detailedDesc: 'Automated treasury rebalancing protocol that pulls surplus collateral into main operating disbursement channels to neutralize immediate payroll and supplier stress.',
      icon: 'swap_horiz',
      riskReductionPct: 40,
      financialImpact: '+₹6.5L Dispersed',
      runwayDeltaDays: 9,
      cashDeltaLakhs: 6.5,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 6,
      targetEntity: 'Corporate Treasury Vault',
      difficulty: 'Immediate',
      status: systemState.executedActions.includes('act-treasury-sweep') ? 'active' : 'ready',
      configurableParams: {
        label: 'Sweep Amount',
        value: 6.5,
        min: 2.0,
        max: 10.0,
        step: 0.5,
        unit: 'Lakhs (₹)',
      },
    },

    // 🤝 Counterparty & Receivables
    {
      id: 'act-customer-accord',
      category: 'counterparty',
      title: 'Customer Alpha Restructuring Accord (50% Upfront)',
      shortDesc: 'Enforce an immediate 50% upfront settlement with a 2% early-close incentive.',
      detailedDesc: 'Direct intervention with Customer Alpha finance controllers. Injects ₹6.4L cash in 48 hours and structures the remainder into 2 bi-weekly guaranteed tranches.',
      icon: 'handshake',
      riskReductionPct: 85,
      financialImpact: '+₹6.4L Recovered',
      runwayDeltaDays: 14,
      cashDeltaLakhs: 6.4,
      exposureDeltaLakhs: -12.8,
      healthDeltaScore: 14,
      targetEntity: 'Customer Alpha Enterprise',
      difficulty: 'Negotiation',
      status: systemState.executedActions.includes('act-customer-accord') ? 'active' : 'ready',
      configurableParams: {
        label: 'Upfront Recovery Target',
        value: 50,
        min: 25,
        max: 80,
        step: 5,
        unit: '%',
      },
    },
    {
      id: 'act-legal-escrow',
      category: 'counterparty',
      title: 'Issue Formal Legal Demand & Escrow Freeze Notice',
      shortDesc: 'Dispatch formal legal summons and invoke MSME 45-day statutory interest penalty.',
      detailedDesc: 'Generates automated legal notice via registered counsel, triggering institutional priority processing for past-due receivables and freezing customer credit status.',
      icon: 'gavel',
      riskReductionPct: 52,
      financialImpact: 'Legal Protection Enforced',
      runwayDeltaDays: 8,
      cashDeltaLakhs: 3.2,
      exposureDeltaLakhs: -6.4,
      healthDeltaScore: 7,
      targetEntity: 'Customer Alpha Legal & Compliance',
      difficulty: 'Fast',
      status: systemState.executedActions.includes('act-legal-escrow') ? 'active' : 'ready',
    },
    {
      id: 'act-credit-insurance',
      category: 'counterparty',
      title: 'File Trade Credit Insurance Underwriting Claim',
      shortDesc: 'File expedited insurer claim for 85% default indemnity coverage on invoice #INV-8902.',
      detailedDesc: 'Initiates institutional trade credit insurer claim workflow. Covers ₹10.88L against default risk, mitigating contagion impact to zero on core operations.',
      icon: 'verified_user',
      riskReductionPct: 92,
      financialImpact: '+₹10.88L Insured Claim',
      runwayDeltaDays: 18,
      cashDeltaLakhs: 10.88,
      exposureDeltaLakhs: -12.8,
      healthDeltaScore: 11,
      targetEntity: 'Allianz / ECGC Trade Credit',
      difficulty: 'Fast',
      status: systemState.executedActions.includes('act-credit-insurance') ? 'active' : 'ready',
    },

    // 🏭 Supply Chain & Operations
    {
      id: 'act-supplier-moratorium',
      category: 'supply_chain',
      title: 'Supplier Beta 20-Day Moratorium & Credit Extension',
      shortDesc: 'Send formal restructuring accord extending payable term from 30 to 50 days.',
      detailedDesc: 'Proposes an amicable term extension backed by corporate purchase order collateral. Eliminates immediate default pressure and protects production slot.',
      icon: 'hourglass_top',
      riskReductionPct: 70,
      financialImpact: 'Payable Deferred (+20 Days)',
      runwayDeltaDays: 15,
      cashDeltaLakhs: 0,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 8,
      targetEntity: 'Supplier Beta Microelectronics',
      difficulty: 'Negotiation',
      status: systemState.executedActions.includes('act-supplier-moratorium') ? 'active' : 'ready',
      configurableParams: {
        label: 'Extended Days Requested',
        value: 20,
        min: 10,
        max: 45,
        step: 5,
        unit: 'Days',
      },
    },
    {
      id: 'act-switch-supplier',
      category: 'supply_chain',
      title: 'Switch Assembly Line to Secondary Supplier Gamma',
      shortDesc: 'Route microcontroller procurement to pre-qualified secondary vendor with 48h SLA.',
      detailedDesc: 'Bypasses the Supplier Beta delivery bottleneck by activating secondary supply chain agreement with Supplier Gamma at an index-linked price parity.',
      icon: 'alt_route',
      riskReductionPct: 88,
      financialImpact: 'Zero Production Downtime',
      runwayDeltaDays: 10,
      cashDeltaLakhs: -1.2,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 10,
      targetEntity: 'Supplier Gamma Tech Components',
      difficulty: 'Immediate',
      status: systemState.executedActions.includes('act-switch-supplier') ? 'active' : 'ready',
    },
    {
      id: 'act-bonded-buffer',
      category: 'supply_chain',
      title: 'Release Strategic Bonded Warehouse Inventory Buffer',
      shortDesc: 'Unlock 3 weeks of emergency raw material reserves stored in customs bonded zone.',
      detailedDesc: 'Dispatches digital customs clearance token to release pre-purchased buffer parts, ensuring continuous plant operations for 25 production shifts.',
      icon: 'warehouse',
      riskReductionPct: 62,
      financialImpact: '25 Shifts Guaranteed',
      runwayDeltaDays: 12,
      cashDeltaLakhs: -0.8,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 7,
      targetEntity: 'Customs Logistics Zone B',
      difficulty: 'Fast',
      status: systemState.executedActions.includes('act-bonded-buffer') ? 'active' : 'ready',
    },

    // 🛡️ Cost Freezes & Spend Controls
    {
      id: 'act-freeze-spend',
      category: 'cost_freeze',
      title: 'Emergency Discretionary Spend & Contractor Freeze',
      shortDesc: 'Pause marketing ad-spends, non-critical SaaS subscriptions, and travel budgets.',
      detailedDesc: 'Applies instant rule-based cap on corporate credit cards and procurement POs. Reduces monthly cash burn by ₹3.8L, buying immediate working runway.',
      icon: 'block',
      riskReductionPct: 50,
      financialImpact: 'Saves ₹3.8L/Month',
      runwayDeltaDays: 11,
      cashDeltaLakhs: 3.8,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 8,
      targetEntity: 'Enterprise OpEx & Vendor Accounts',
      difficulty: 'Immediate',
      status: systemState.executedActions.includes('act-freeze-spend') ? 'active' : 'ready',
    },
    {
      id: 'act-exec-deferral',
      category: 'cost_freeze',
      title: 'Executive Incentive & Discretionary Payroll Deferral',
      shortDesc: 'Temporarily stagger senior management bonuses into Q4 deferred equity instruments.',
      detailedDesc: 'Conserves ₹5.2L in immediate cash while ringfencing 100% of factory and assembly worker base wages.',
      icon: 'shield_person',
      riskReductionPct: 45,
      financialImpact: 'Preserves ₹5.2L Cash',
      runwayDeltaDays: 8,
      cashDeltaLakhs: 5.2,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 6,
      targetEntity: 'Executive Compensation Committee',
      difficulty: 'Immediate',
      status: systemState.executedActions.includes('act-exec-deferral') ? 'active' : 'ready',
    },

    // 🤖 Automated AI Playbooks
    {
      id: 'pb-contagion-breaker',
      category: 'playbooks',
      title: 'Contagion Circuit Breaker (Auto-Freeze)',
      shortDesc: 'Automatically suspend credit sales if buyer health score drops below 40.',
      detailedDesc: 'Autonomous risk watchdog monitors daily banking feeds and credit bureau APIs. Automatically places orders on 100% advance terms when systemic risk spikes.',
      icon: 'electric_bolt',
      riskReductionPct: 80,
      financialImpact: 'Autonomous Protection',
      runwayDeltaDays: 14,
      cashDeltaLakhs: 0,
      exposureDeltaLakhs: -8.0,
      healthDeltaScore: 9,
      targetEntity: 'Autonomous Credit Risk Gateway',
      difficulty: 'Immediate',
      status: systemState.activePlaybooks['pb-contagion-breaker'] ? 'active' : 'ready',
    },
    {
      id: 'pb-supplier-prefund',
      category: 'playbooks',
      title: 'Predictive Supplier Milestone Pre-funding',
      shortDesc: 'Automatically release 25% milestone advances when transit sensors report delay > 48h.',
      detailedDesc: 'Integrates IoT transit telemetry with smart banking contracts to release milestone bonuses, preventing vendor delivery disputes before they escalate.',
      icon: 'auto_mode',
      riskReductionPct: 75,
      financialImpact: 'Preventative Automation',
      runwayDeltaDays: 10,
      cashDeltaLakhs: -1.5,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 7,
      targetEntity: 'Smart Escrow Smart Contract',
      difficulty: 'Immediate',
      status: systemState.activePlaybooks['pb-supplier-prefund'] ? 'active' : 'ready',
    },
    {
      id: 'pb-fx-hedge',
      category: 'playbooks',
      title: 'Dynamic Currency & Component Price Hedging',
      shortDesc: 'Auto-hedges foreign exchange exposure when INR/USD 30-day volatility exceeds 1.8%.',
      detailedDesc: 'Executes automated forward currency contracts through corporate treasury API, locking component import costs and eliminating price shock risk.',
      icon: 'currency_exchange',
      riskReductionPct: 68,
      financialImpact: 'FX Exposure Insulated',
      runwayDeltaDays: 7,
      cashDeltaLakhs: 0,
      exposureDeltaLakhs: 0,
      healthDeltaScore: 6,
      targetEntity: 'Treasury FX Engine',
      difficulty: 'Immediate',
      status: systemState.activePlaybooks['pb-fx-hedge'] ? 'active' : 'ready',
    },
  ];

  // Filtering Logic
  const filteredActions = actionCatalog.filter((item) => {
    if (selectedCategory !== 'all' && selectedCategory !== 'history') {
      if (item.category !== selectedCategory) return false;
    }
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.targetEntity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Aggregated Metrics
  const activeCount = systemState.executedActions.length + Object.values(systemState.activePlaybooks).filter(Boolean).length;
  const totalInjected = systemState.executedActions.reduce((acc, actId) => {
    const found = actionCatalog.find((a) => a.id === actId);
    return acc + (found && found.cashDeltaLakhs > 0 ? found.cashDeltaLakhs : 0);
  }, 0);
  const totalRunwayExtended = systemState.executedActions.reduce((acc, actId) => {
    const found = actionCatalog.find((a) => a.id === actId);
    return acc + (found ? found.runwayDeltaDays : 0);
  }, 0);
  const avgRiskCut = systemState.executedActions.length > 0 ? Math.min(88, 35 + systemState.executedActions.length * 15) : 0;

  const handleOpenActionModal = (action: ActionItem) => {
    setActiveModalAction(action);
    setConfiguredValue(action.configurableParams ? action.configurableParams.value : 0);
    setExecutingStep(0);
    setIsExecuting(false);
  };

  const handleTriggerExecution = () => {
    if (!activeModalAction) return;

    if (activeModalAction.category === 'playbooks') {
      onTogglePlaybook(activeModalAction.id);
      setActiveModalAction(null);
      return;
    }

    setIsExecuting(true);
    setExecutingStep(1);

    setTimeout(() => {
      setExecutingStep(2);
      setTimeout(() => {
        setExecutingStep(3);
        setTimeout(() => {
          setIsExecuting(false);
          onExecuteAction(activeModalAction.id, {
            configuredValue: configuredValue,
            paramName: activeModalAction.configurableParams?.label,
          });
          setActiveModalAction(null);
        }, 600);
      }, 700);
    }, 600);
  };

  const downloadReceiptJSON = (record: ActionExecutionRecord) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AUDIT_CERTIFICATE_${record.txHash}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen flex flex-col gap-6">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono-custom flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {at.badge}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-geist">
            {at.title}
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mt-1">
            {at.desc}
          </p>
        </div>

        {/* Global Impact Summary Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-[#0D121F] hover:bg-[#141C33] text-gray-300 hover:text-white rounded-full text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>View Dashboard Impact</span>
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">analytics</span>
            <span>Stress Test Actions</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Bento Bar (Obsidian Theme) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D121F] rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono-custom">
            {at.statActive}
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white font-geist">
              {activeCount}
            </span>
            <span className="text-xs text-emerald-400 font-mono-custom font-semibold">
              / {actionCatalog.length} Enforced
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 mt-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#10B981]"
              style={{ width: `${Math.min(100, (activeCount / actionCatalog.length) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0D121F] rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between group hover:border-cyan-500/40 transition-all">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono-custom">
            {at.statCapital}
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-cyan-400 font-geist">
              ₹{totalInjected.toFixed(1)}L
            </span>
            <span className="text-xs text-gray-400 font-mono-custom">Injected</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 mt-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#22D3EE]"
              style={{ width: `${Math.min(100, (totalInjected / 35) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0D121F] rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between group hover:border-amber-500/40 transition-all">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono-custom">
            {at.statRunway}
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-amber-400 font-geist">
              +{totalRunwayExtended}
            </span>
            <span className="text-xs text-gray-400 font-mono-custom">Days Gained</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 mt-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#F59E0B]"
              style={{ width: `${Math.min(100, (totalRunwayExtended / 50) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0D121F] rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between group hover:border-rose-500/40 transition-all">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono-custom">
            {at.statRiskCut}
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-indigo-300 font-geist">
              {avgRiskCut}%
            </span>
            <span className="text-xs text-gray-400 font-mono-custom">Contagion Nullified</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 mt-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#818CF8]"
              style={{ width: `${avgRiskCut}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Section Navigation Tabs (Horizontal Bento Bar) */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#0A0E17] p-2 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(
            [
              { id: 'all', label: at.tabs.all, icon: 'grid_view' },
              { id: 'liquidity', label: at.tabs.liquidity, icon: 'bolt' },
              { id: 'counterparty', label: at.tabs.counterparty, icon: 'handshake' },
              { id: 'supply_chain', label: at.tabs.supply_chain, icon: 'precision_manufacturing' },
              { id: 'cost_freeze', label: at.tabs.cost_freeze, icon: 'shield' },
              { id: 'playbooks', label: at.tabs.playbooks, icon: 'smart_toy' },
              { id: 'history', label: at.tabs.history, icon: 'history' },
            ] as const
          ).map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Search Input */}
        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search actions or entities..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-[#07090E] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {selectedCategory === 'history' ? (
        /* Live Execution Audit Stream */
        <div className="bg-[#0D121F] rounded-[32px] p-6 md:p-8 border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white font-geist">
                Live Action Execution Ledger & Audit Trail
              </h2>
              <p className="text-xs text-gray-400 font-mono-custom mt-0.5">
                Cryptographically hashed record of all deployed interventions and liquidity shifts.
              </p>
            </div>
            <span className="text-xs font-mono-custom text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
              LEDGER VERIFIED
            </span>
          </div>

          {systemState.actionHistory.length === 0 ? (
            <div className="py-16 text-center text-gray-500 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-5xl mb-3 text-gray-600">
                receipt_long
              </span>
              <p className="text-sm font-semibold text-gray-400">No actions executed yet</p>
              <p className="text-xs text-gray-500 max-w-sm mt-1">
                Select any action from the categories above to execute real-time systemic interventions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {systemState.actionHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-[#080C14] rounded-2xl p-4 md:p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                      <span className="material-symbols-outlined text-xl">verified</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white font-geist">{rec.title}</h4>
                        <span className="text-[10px] font-mono-custom bg-white/10 text-cyan-300 px-2 py-0.5 rounded-full">
                          {rec.txHash}
                        </span>
                        <span className="text-[10px] font-mono-custom text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {rec.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Impact: <span className="text-emerald-300 font-semibold">{rec.impactSummary}</span>
                      </p>
                      <div className="flex items-center gap-4 text-[11px] font-mono-custom text-gray-500 mt-1">
                        <span>Time: {rec.timestamp}</span>
                        <span>Signer: {rec.signer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowReceiptRecord(rec)}
                      className="px-3.5 py-1.5 bg-[#121829] hover:bg-[#1A2238] text-cyan-300 text-xs font-semibold rounded-full border border-cyan-500/30 flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>Certificate</span>
                    </button>
                    <button
                      onClick={() => downloadReceiptJSON(rec)}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-full border border-white/10 flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={() => onRevertAction(rec.actionId)}
                      className="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold rounded-full border border-rose-500/30 flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">undo</span>
                      <span>Rollback</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Action Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action) => {
            const isEnforced = action.status === 'active';
            const isPlaybook = action.category === 'playbooks';

            let categoryColor = 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10';
            if (action.category === 'liquidity') categoryColor = 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10';
            if (action.category === 'counterparty') categoryColor = 'border-amber-500/30 text-amber-400 bg-amber-500/10';
            if (action.category === 'supply_chain') categoryColor = 'border-purple-500/30 text-purple-400 bg-purple-500/10';
            if (action.category === 'cost_freeze') categoryColor = 'border-rose-500/30 text-rose-400 bg-rose-500/10';
            if (action.category === 'playbooks') categoryColor = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';

            return (
              <div
                key={action.id}
                className={`bg-[#0D121F] rounded-[28px] p-6 border transition-all flex flex-col justify-between relative overflow-hidden group shadow-xl ${
                  isEnforced
                    ? 'border-emerald-500/50 bg-gradient-to-b from-[#0D121F] to-[#0A1616] shadow-emerald-950/20'
                    : 'border-white/10 hover:border-indigo-500/40 hover:shadow-2xl'
                }`}
              >
                {/* Status Indicator Glow */}
                {isEnforced && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-black text-[10px] font-bold font-mono-custom uppercase tracking-wider rounded-bl-2xl shadow-md">
                    ✓ ACTIVE & ENFORCED
                  </div>
                )}

                <div>
                  {/* Top Bar: Icon + Category Badge + Target */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${categoryColor} shadow-md`}>
                      <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                    </div>
                    {!isEnforced && (
                      <span className="text-[10px] font-mono-custom font-bold text-gray-400 bg-[#121829] px-3 py-1 rounded-full border border-white/10">
                        {action.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug font-geist mb-2">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4">
                    {action.shortDesc}
                  </p>

                  {/* Impact Highlights Box */}
                  <div className="bg-[#080C14] rounded-2xl p-3.5 border border-white/5 space-y-2 mb-6">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Financial Impact:</span>
                      <span className="font-bold text-cyan-300 font-mono-custom">{action.financialImpact}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Runway Extension:</span>
                      <span className="font-bold text-amber-400 font-mono-custom">+{action.runwayDeltaDays} Days</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Contagion Cut:</span>
                      <span className="font-bold text-emerald-400 font-mono-custom">{action.riskReductionPct}%</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Execution Bar */}
                <div className="pt-2 border-t border-white/5">
                  <div className="text-[11px] text-gray-400 mb-3 flex items-center gap-1.5 font-mono-custom truncate">
                    <span className="material-symbols-outlined text-xs text-gray-500">corporate_fare</span>
                    <span className="truncate">{action.targetEntity}</span>
                  </div>

                  {isPlaybook ? (
                    <button
                      onClick={() => onTogglePlaybook(action.id)}
                      className={`w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isEnforced
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isEnforced ? 'toggle_on' : 'toggle_off'}
                      </span>
                      <span>{isEnforced ? at.playbookActive : at.togglePlaybook}</span>
                    </button>
                  ) : isEnforced ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const rec = systemState.actionHistory.find((r) => r.actionId === action.id);
                          if (rec) setShowReceiptRecord(rec);
                        }}
                        className="flex-1 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        <span>{at.viewReceiptBtn}</span>
                      </button>
                      <button
                        onClick={() => onRevertAction(action.id)}
                        className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-full text-xs font-semibold transition-all"
                        title={at.revertBtn}
                      >
                        <span className="material-symbols-outlined text-sm">undo</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenActionModal(action)}
                      className="w-full py-3 bg-white hover:bg-gray-200 text-black rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 group-hover:scale-[1.02]"
                    >
                      <span className="material-symbols-outlined text-base text-indigo-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                        bolt
                      </span>
                      <span>{action.configurableParams ? at.configureBtn : at.executeBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Execution & Parameter Customization Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0A0E17] border border-white/15 rounded-[32px] max-w-xl w-full p-8 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <span className="material-symbols-outlined text-xl">{activeModalAction.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-geist">
                    {at.modalTitle}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono-custom">
                    {activeModalAction.targetEntity}
                  </p>
                </div>
              </div>
              {!isExecuting && (
                <button
                  onClick={() => setActiveModalAction(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            {/* Action Body */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-1.5">{activeModalAction.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed bg-[#121829] p-4 rounded-2xl border border-white/10">
                  {activeModalAction.detailedDesc}
                </p>
              </div>

              {/* Dynamic Parameter Slider (if configurable) */}
              {activeModalAction.configurableParams && (
                <div className="bg-[#0D121F] p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-300">
                    <span>{activeModalAction.configurableParams.label}:</span>
                    <span className="text-cyan-400 font-mono-custom font-bold text-sm">
                      {configuredValue} {activeModalAction.configurableParams.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activeModalAction.configurableParams.min}
                    max={activeModalAction.configurableParams.max}
                    step={activeModalAction.configurableParams.step}
                    value={configuredValue}
                    onChange={(e) => setConfiguredValue(Number(e.target.value))}
                    disabled={isExecuting}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-custom text-gray-500">
                    <span>Min: {activeModalAction.configurableParams.min}</span>
                    <span>Max: {activeModalAction.configurableParams.max}</span>
                  </div>
                </div>
              )}

              {/* Forecasted Impact Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#121829] p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] font-mono-custom text-gray-400 uppercase">Liquidity Shift</span>
                  <p className="text-sm font-bold text-cyan-400 mt-0.5">{activeModalAction.financialImpact}</p>
                </div>
                <div className="bg-[#121829] p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] font-mono-custom text-gray-400 uppercase">Runway Extension</span>
                  <p className="text-sm font-bold text-amber-400 mt-0.5">+{activeModalAction.runwayDeltaDays} Days</p>
                </div>
                <div className="bg-[#121829] p-3 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] font-mono-custom text-gray-400 uppercase">Contagion Drop</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">-{activeModalAction.riskReductionPct}%</p>
                </div>
              </div>

              {/* Real-time Execution Steps Animation */}
              {isExecuting && (
                <div className="bg-[#07090E] p-4 rounded-2xl border border-indigo-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2.5 text-xs text-indigo-300 font-mono-custom font-semibold">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    <span>Executing Protocol Sequence...</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className={`flex items-center gap-2 ${executingStep >= 1 ? 'text-emerald-400' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-sm">
                        {executingStep > 1 ? 'check_circle' : 'radio_button_checked'}
                      </span>
                      <span>{at.step1}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${executingStep >= 2 ? 'text-emerald-400' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-sm">
                        {executingStep > 2 ? 'check_circle' : executingStep === 2 ? 'sync' : 'radio_button_unchecked'}
                      </span>
                      <span>{at.step2}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${executingStep >= 3 ? 'text-emerald-400' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-sm">
                        {executingStep >= 3 ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>{at.step3}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            {!isExecuting && (
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={() => setActiveModalAction(null)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white rounded-full transition-colors"
                >
                  {at.cancel}
                </button>
                <button
                  onClick={handleTriggerExecution}
                  className="px-6 py-2.5 bg-white hover:bg-gray-200 text-black rounded-full text-xs font-bold shadow-lg shadow-white/10 flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-base text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    task_alt
                  </span>
                  <span>{at.confirmAuthorization}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Execution Certificate Modal */}
      {showReceiptRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0A0E17] border border-emerald-500/40 rounded-[32px] max-w-lg w-full p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-geist">
                    {at.auditCertificate}
                  </h3>
                  <p className="text-[10px] font-mono-custom text-emerald-400">
                    STATUS: ENFORCED & VERIFIED
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptRecord(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono-custom">
              <div className="bg-[#121829] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">{at.certId}:</span>
                  <span className="text-cyan-300 font-bold">{showReceiptRecord.txHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{at.certTimestamp}:</span>
                  <span className="text-white">{showReceiptRecord.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{at.certSigner}:</span>
                  <span className="text-indigo-300">{showReceiptRecord.signer}</span>
                </div>
              </div>

              <div className="bg-[#121829] p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <span className="text-gray-400 block text-[10px] uppercase">Action Name</span>
                <p className="text-white font-bold font-geist text-sm">{showReceiptRecord.title}</p>
                <p className="text-emerald-400 text-xs mt-1">Impact: {showReceiptRecord.impactSummary}</p>
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => downloadReceiptJSON(showReceiptRecord)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>{at.downloadPdf}</span>
              </button>
              <button
                onClick={() => setShowReceiptRecord(null)}
                className="px-6 py-2 bg-white hover:bg-gray-200 text-black rounded-full text-xs font-bold transition-all"
              >
                {at.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
