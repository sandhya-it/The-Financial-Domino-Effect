export type TabType = 'dashboard' | 'domino-map' | 'simulator' | 'copilot' | 'actions' | 'alerts';

export type ActionCategory = 'liquidity' | 'counterparty' | 'supply_chain' | 'cost_freeze' | 'playbooks';

export type ActionStatus = 'ready' | 'executing' | 'active' | 'completed' | 'reverted';

export interface ActionItem {
  id: string;
  category: ActionCategory;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  icon: string;
  riskReductionPct: number;
  financialImpact: string;
  runwayDeltaDays: number;
  cashDeltaLakhs: number;
  exposureDeltaLakhs: number;
  healthDeltaScore: number;
  targetEntity: string;
  difficulty: 'Immediate' | 'Fast' | 'Negotiation';
  status: ActionStatus;
  executedAt?: string;
  txHash?: string;
  configurableParams?: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

export interface ActionExecutionRecord {
  id: string;
  actionId: string;
  title: string;
  category: ActionCategory;
  timestamp: string;
  txHash: string;
  impactSummary: string;
  executedParams: Record<string, any>;
  status: 'enforced' | 'reverted';
  signer: string;
}

export interface SystemState {
  healthScore: number;
  cashAvailableLakhs: number;
  cashRunwayDays: number;
  revenueExposureLakhs: number;
  activeCriticalRisks: number;
  executedActions: string[]; // action IDs
  actionHistory: ActionExecutionRecord[];
  activePlaybooks: Record<string, boolean>;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: string;
  impact?: string;
  actionId?: string;
  resolved?: boolean;
}

export interface NodeData {
  id: string;
  name: string;
  category: 'customer' | 'account' | 'cash' | 'production' | 'supplier' | 'logistics';
  riskLevel: 'stable' | 'elevated' | 'critical';
  exposure: string;
  details: string;
  downstreamImpact: string;
  icon: string;
  x: number;
  y: number;
  size: number;
  mitigated?: boolean;
}
