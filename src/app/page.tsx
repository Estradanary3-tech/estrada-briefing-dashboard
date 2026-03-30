import { getLatestBriefing } from "@/lib/redis";
import PipelineSummary from "@/components/PipelineSummary";
import SocialContent from "@/components/SocialContent";
import DailyPriority from "@/components/DailyPriority";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function Home() {
  let briefing = null;
  try {
    briefing = await getLatestBriefing();
  } catch {
    return <EmptyState />;
  }

  if (!briefing) return <EmptyState />;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Daily Briefing</h1>
        <p className="text-muted text-sm mt-1">{briefing.date}</p>
        {briefing.gammaUrl && (
          <a
            href={briefing.gammaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-accent text-sm underline underline-offset-2"
          >
            View Gamma Doc
          </a>
        )}
      </header>

      <div className="space-y-4">
        <DailyPriority priority={briefing.dailyPriority} />
        <PipelineSummary pipeline={briefing.pipeline} />
        <SocialContent social={briefing.socialContent} />
      </div>
    </div>
  );
}
