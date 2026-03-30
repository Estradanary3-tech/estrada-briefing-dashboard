export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-xl font-bold mb-2">No Briefing Yet</h2>
      <p className="text-muted text-sm max-w-xs">
        Your daily briefing arrives at 8:00 AM MDT. Check back soon.
      </p>
    </div>
  );
}
