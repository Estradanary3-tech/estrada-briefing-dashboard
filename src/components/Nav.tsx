"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isToday = pathname === "/";
  const isHistory = pathname.startsWith("/history") || pathname.startsWith("/briefing");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border">
      <div className="max-w-lg mx-auto flex">
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center py-3 text-sm ${
            isToday ? "text-accent" : "text-muted"
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Today
        </Link>
        <Link
          href="/history"
          className={`flex-1 flex flex-col items-center py-3 text-sm ${
            isHistory ? "text-accent" : "text-muted"
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </Link>
      </div>
    </nav>
  );
}
