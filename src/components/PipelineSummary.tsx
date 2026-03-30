import { Briefing } from "@/lib/types";

export default function PipelineSummary({ pipeline }: { pipeline: Briefing["pipeline"] }) {
  return (
    <section className="bg-card rounded-2xl p-5 border border-card-border">
      <h2 className="text-lg font-semibold text-accent mb-4">Pipeline</h2>

      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-background rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{pipeline.totalOpenDeals}</div>
          <div className="text-sm text-muted mt-1">Open Deals</div>
        </div>
        <div className="flex-1 bg-background rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-success">
            ${pipeline.totalValue >= 1000000
              ? `${(pipeline.totalValue / 1000000).toFixed(1)}M`
              : pipeline.totalValue >= 1000
              ? `${(pipeline.totalValue / 1000).toFixed(0)}K`
              : pipeline.totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-muted mt-1">Total Value</div>
        </div>
      </div>

      {Object.keys(pipeline.dealsByStage).length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted mb-2">By Stage</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(pipeline.dealsByStage).map(([stage, count]) => (
              <span key={stage} className="bg-background px-3 py-1 rounded-full text-sm">
                {stage}: <span className="font-semibold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {pipeline.quickWins.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-success mb-2">Quick Wins</h3>
          <ul className="space-y-1">
            {pipeline.quickWins.map((win, i) => (
              <li key={i} className="text-sm pl-3 border-l-2 border-success">{win}</li>
            ))}
          </ul>
        </div>
      )}

      {pipeline.stalledDeals.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-warning mb-2">Stalled (14+ days)</h3>
          <ul className="space-y-1">
            {pipeline.stalledDeals.map((deal, i) => (
              <li key={i} className="text-sm pl-3 border-l-2 border-warning">{deal}</li>
            ))}
          </ul>
        </div>
      )}

      {pipeline.recentChanges.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted mb-2">Recent Changes</h3>
          <ul className="space-y-1">
            {pipeline.recentChanges.map((change, i) => (
              <li key={i} className="text-sm text-muted pl-3 border-l-2 border-card-border">{change}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
