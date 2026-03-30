import { listBriefingIds, getBriefingById } from "@/lib/redis";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  let ids: string[] = [];
  try {
    ids = await listBriefingIds(30);
  } catch {
    return <EmptyState />;
  }

  if (ids.length === 0) return <EmptyState />;

  const previews = await Promise.all(
    ids.map(async (id) => {
      const b = await getBriefingById(id);
      return b ? { id: b.id, date: b.date, priority: b.dailyPriority.title } : null;
    })
  );

  const items = previews.filter(Boolean);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted text-sm mt-1">Past briefings</p>
      </header>

      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item!.id}
            href={`/briefing/${item!.id}`}
            className="block bg-card rounded-xl p-4 border border-card-border active:bg-card-border transition-colors"
          >
            <div className="text-sm font-semibold">{item!.date}</div>
            <div className="text-sm text-muted mt-1 truncate">{item!.priority}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
