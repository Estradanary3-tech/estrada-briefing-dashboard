export interface Briefing {
  id: string; // ISO date: "2026-03-30"
  date: string; // Human-readable: "March 30, 2026"
  createdAt: string; // ISO timestamp

  pipeline: {
    totalOpenDeals: number;
    totalValue: number;
    dealsByStage: Record<string, number>;
    recentChanges: string[];
    stalledDeals: string[];
    quickWins: string[];
  };

  socialContent: {
    dayTheme: string;
    caption: string;
    visualDescription: string;
    bestPostingTime: string;
    storyIdeas: string[];
    canvaDesignUrl?: string;
  };

  dailyPriority: {
    title: string;
    details: string;
    suggestedTimeBlock: string;
    relatedDeal?: string;
  };

  gammaUrl?: string;
}

export interface FleetCheck {
  name: string;
  ok: boolean;
  status_code?: number;
  latency_ms?: number;
  age_days?: number;
  free_gb?: number;
  detail?: string;
}

export interface FleetRemediation {
  target: string;
  action: string;
  ok?: boolean;
  detail?: string;
  freed_mb?: number;
  code?: number;
}

export interface FleetKpis {
  pipeline_value: number;
  open_deals: number;
  deals_by_pipeline: Record<string, number>;
  new_leads_today: number;
  appointments_today: number;
  upcoming_today: Array<{ title: string; start?: string; contact?: string }>;
  stalled_deals: Array<{ name: string; value: number; days_stale: number }>;
  stalled_count: number;
  fetched_at: string;
}

export interface FleetStatus {
  ts: string;
  owner?: string;
  overall_ok: boolean;
  kpis?: FleetKpis;
  agents: FleetCheck[];
  mcp_servers: FleetCheck[];
  oauth: FleetCheck[];
  disk: FleetCheck;
  failures: FleetCheck[];
  remediations: FleetRemediation[];
}
