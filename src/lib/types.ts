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
