import React, { useState, useEffect } from 'react';
import { TabType, SystemState, ActionExecutionRecord } from './types';
import { Language } from './i18n';
import { BackgroundShader } from './components/BackgroundShader';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { InterventionEngineView } from './components/InterventionEngineView';
import { DominoMapView } from './components/DominoMapView';
import { SimulatorView } from './components/SimulatorView';
import { AlertsView } from './components/AlertsView';
import { ActionCenterView } from './components/ActionCenterView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';

const INITIAL_SYSTEM_STATE: SystemState = {
  healthScore: 72,
  cashAvailableLakhs: 42.5,
  cashRunwayDays: 45,
  revenueExposureLakhs: 12.8,
  activeCriticalRisks: 3,
  executedActions: [],
  actionHistory: [],
  activePlaybooks: {
    'pb-contagion-breaker': true,
    'pb-supplier-prefund': false,
    'pb-fx-hedge': false,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language');
      if (saved && ['en', 'ta', 'hi', 'ml', 'te'].includes(saved)) {
        return saved as Language;
      }
    }
    return 'en';
  });

  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [systemState, setSystemState] = useState<SystemState>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('app_system_state');
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch {
          return INITIAL_SYSTEM_STATE;
        }
      }
    }
    return INITIAL_SYSTEM_STATE;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_system_state', JSON.stringify(systemState));
    }
  }, [systemState]);

  // Execute Action Handler
  const handleExecuteAction = (actionId: string, customParams?: Record<string, any>) => {
    setSystemState((prev) => {
      if (prev.executedActions.includes(actionId)) return prev;

      let deltaCash = 0;
      let deltaRunway = 0;
      let deltaExposure = 0;
      let deltaHealth = 0;
      let deltaRisk = 0;
      let actionTitle = 'Action Protocol';
      let category: any = 'liquidity';

      switch (actionId) {
        case 'act-bridge-credit':
          deltaCash = customParams?.configuredValue || 15.0;
          deltaRunway = 22;
          deltaHealth = 12;
          deltaRisk = -1;
          actionTitle = 'Drawdown Secured Working Capital Facility';
          category = 'liquidity';
          break;
        case 'act-invoice-factoring':
          deltaCash = 11.2;
          deltaExposure = -12.8;
          deltaRunway = 16;
          deltaHealth = 9;
          deltaRisk = -1;
          actionTitle = 'Dynamic Invoice Factoring & Early Settlement';
          category = 'liquidity';
          break;
        case 'act-treasury-sweep':
          deltaCash = customParams?.configuredValue || 6.5;
          deltaRunway = 9;
          deltaHealth = 6;
          actionTitle = 'Strategic Treasury Reserve Sweeping';
          category = 'liquidity';
          break;
        case 'act-customer-accord':
          deltaCash = 6.4;
          deltaExposure = -12.8;
          deltaRunway = 14;
          deltaHealth = 14;
          deltaRisk = -1;
          actionTitle = 'Customer Alpha Restructuring Accord (50% Upfront)';
          category = 'counterparty';
          break;
        case 'act-legal-escrow':
          deltaCash = 3.2;
          deltaExposure = -6.4;
          deltaRunway = 8;
          deltaHealth = 7;
          actionTitle = 'Issue Formal Legal Demand & Escrow Freeze Notice';
          category = 'counterparty';
          break;
        case 'act-credit-insurance':
          deltaCash = 10.88;
          deltaExposure = -12.8;
          deltaRunway = 18;
          deltaHealth = 11;
          deltaRisk = -1;
          actionTitle = 'File Trade Credit Insurance Underwriting Claim';
          category = 'counterparty';
          break;
        case 'act-supplier-moratorium':
          deltaRunway = customParams?.configuredValue || 15;
          deltaHealth = 8;
          actionTitle = 'Supplier Beta 20-Day Moratorium & Credit Extension';
          category = 'supply_chain';
          break;
        case 'act-switch-supplier':
          deltaCash = -1.2;
          deltaRunway = 10;
          deltaHealth = 10;
          deltaRisk = -1;
          actionTitle = 'Switch Assembly Line to Secondary Supplier Gamma';
          category = 'supply_chain';
          break;
        case 'act-bonded-buffer':
          deltaCash = -0.8;
          deltaRunway = 12;
          deltaHealth = 7;
          actionTitle = 'Release Strategic Bonded Warehouse Inventory Buffer';
          category = 'supply_chain';
          break;
        case 'act-freeze-spend':
          deltaCash = 3.8;
          deltaRunway = 11;
          deltaHealth = 8;
          actionTitle = 'Emergency Discretionary Spend & Contractor Freeze';
          category = 'cost_freeze';
          break;
        case 'act-exec-deferral':
          deltaCash = 5.2;
          deltaRunway = 8;
          deltaHealth = 6;
          actionTitle = 'Executive Incentive & Discretionary Payroll Deferral';
          category = 'cost_freeze';
          break;
        default:
          deltaHealth = 5;
          deltaRunway = 5;
      }

      const txHash = `ACT-0x${Math.random().toString(36).substring(2, 8).toUpperCase()}-DOMINO`;
      const newRecord: ActionExecutionRecord = {
        id: `rec-${Date.now()}`,
        actionId,
        title: actionTitle,
        category,
        timestamp: new Date().toLocaleString(),
        txHash,
        impactSummary: `+₹${deltaCash.toFixed(1)}L Cash | +${deltaRunway} Days Runway | +${deltaHealth} Health Score`,
        executedParams: customParams || {},
        status: 'enforced',
        signer: 'Autonomous Systemic Guard v4.2 / CFO Mandate',
      };

      return {
        ...prev,
        healthScore: Math.min(99, prev.healthScore + deltaHealth),
        cashAvailableLakhs: Math.max(0, prev.cashAvailableLakhs + deltaCash),
        cashRunwayDays: Math.min(120, prev.cashRunwayDays + deltaRunway),
        revenueExposureLakhs: Math.max(0, prev.revenueExposureLakhs + deltaExposure),
        activeCriticalRisks: Math.max(0, prev.activeCriticalRisks + deltaRisk),
        executedActions: [...prev.executedActions, actionId],
        actionHistory: [newRecord, ...prev.actionHistory],
      };
    });
  };

  // Rollback Action Handler
  const handleRevertAction = (actionId: string) => {
    setSystemState((prev) => {
      const remainingActions = prev.executedActions.filter((id) => id !== actionId);
      const remainingHistory = prev.actionHistory.filter((rec) => rec.actionId !== actionId);

      // Recalculate baseline
      return {
        ...prev,
        healthScore: Math.max(50, prev.healthScore - 10),
        cashRunwayDays: Math.max(25, prev.cashRunwayDays - 12),
        executedActions: remainingActions,
        actionHistory: remainingHistory,
      };
    });
  };

  // Toggle Playbook
  const handleTogglePlaybook = (playbookId: string) => {
    setSystemState((prev) => ({
      ...prev,
      activePlaybooks: {
        ...prev.activePlaybooks,
        [playbookId]: !prev.activePlaybooks[playbookId],
      },
    }));
  };

  return (
    <div className="relative min-h-screen bg-[#05070D] text-[#F1F5F9] font-sans selection:bg-indigo-500/30">
      {/* Background WebGL Shader (Cyber Obsidian Matrix) */}
      <BackgroundShader />

      {/* Top Header Navigation */}
      <TopAppBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

      {/* Main Screen Views */}
      <main className="relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
            systemState={systemState}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          />
        )}
        {activeTab === 'domino-map' && (
          <DominoMapView
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
          />
        )}
        {activeTab === 'simulator' && (
          <SimulatorView
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
          />
        )}
        {activeTab === 'copilot' && (
          <InterventionEngineView
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
            onExecuteAction={handleExecuteAction}
          />
        )}
        {activeTab === 'actions' && (
          <ActionCenterView
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
            systemState={systemState}
            onExecuteAction={handleExecuteAction}
            onRevertAction={handleRevertAction}
            onTogglePlaybook={handleTogglePlaybook}
          />
        )}
        {activeTab === 'alerts' && (
          <AlertsView
            onNavigate={(tab) => setActiveTab(tab)}
            language={language}
          />
        )}
      </main>

      {/* AI Voice Assistant Interactive Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        language={language}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />
    </div>
  );
}
