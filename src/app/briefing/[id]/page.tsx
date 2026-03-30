import { getBriefingById } from "@/lib/redis";
import PipelineSummary from "@/components/PipelineSummary";
import SocialContent from "@/components/SocialContent";
import DailyPriority from "@/components/DailyPriority";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BriefingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const briefing = await getBriefingById(id);

  if (!briefing) notFound();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-6">
        <Link href="/history" className="text-accent text-sm mb-2 inline-block">
          &larr; Back
        </Link>
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
