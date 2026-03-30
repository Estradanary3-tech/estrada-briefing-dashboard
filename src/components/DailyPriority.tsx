import { Briefing } from "@/lib/types";

export default function DailyPriority({ priority }: { priority: Briefing["dailyPriority"] }) {
  return (
    <section className="bg-card rounded-2xl p-5 border border-card-border border-l-4 border-l-accent">
      <h2 className="text-lg font-semibold text-accent mb-3">#1 Priority</h2>

      <h3 className="text-xl font-bold mb-3">{priority.title}</h3>

      <p className="text-sm leading-relaxed text-foreground/80 mb-4">{priority.details}</p>

      <div className="flex flex-wrap gap-3">
        <div className="bg-background rounded-lg px-3 py-2">
          <div className="text-xs text-muted">Time Block</div>
          <div className="text-sm font-semibold">{priority.suggestedTimeBlock}</div>
        </div>

        {priority.relatedDeal && (
          <div className="bg-background rounded-lg px-3 py-2">
            <div className="text-xs text-muted">Related Deal</div>
            <div className="text-sm font-semibold">{priority.relatedDeal}</div>
          </div>
        )}
      </div>
    </section>
  );
}
