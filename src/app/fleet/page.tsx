"use client";

import { useEffect, useRef, useState } from "react";
import type { FleetCheck, FleetStatus } from "@/lib/types";

const EREG_RED = "#7a1320";
const EREG_RED_DIM = "#5a0e18";
const EREG_RED_LIGHT = "#a01e2e";

function greeting(name: string): string {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function KpiTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: accent ? EREG_RED_DIM : "#0a0a0a",
        borderColor: accent ? EREG_RED_LIGHT : "#1f1f1f",
      }}
    >
      <div className="text-xs uppercase tracking-wider text-neutral-400">
        {label}
      </div>
      <div className="text-3xl font-bold mt-1 text-white">{value}</div>
    </div>
  );
}

function HealthFooter({ status }: { status: FleetStatus }) {
  const [expanded, setExpanded] = useState(false);
  const checks: FleetCheck[] = [
    ...status.agents,
    ...status.mcp_servers,
    ...status.oauth,
    status.disk,
  ];
  const total = checks.length;
  const failing = checks.filter((c) => !c.ok);
  const allGreen = failing.length === 0;

  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a",
        borderColor: allGreen ? "#1f1f1f" : EREG_RED,
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm"
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: allGreen ? "#22c55e" : EREG_RED_LIGHT }}
          />
          <span className="text-neutral-300">
            {allGreen
              ? `All ${total} systems green`
              : `${failing.length} / ${total} failing`}
          </span>
        </div>
        <span className="text-xs text-neutral-500">
          {expanded ? "hide" : "details"}
        </span>
      </button>
      {expanded && (
        <ul className="px-4 pb-3 space-y-1 text-xs border-t border-neutral-900 pt-3">
          {checks.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.ok ? "#22c55e" : EREG_RED_LIGHT }}
                />
                <span className="truncate text-neutral-400">{c.name}</span>
              </span>
              {!c.ok && c.detail && (
                <span className="text-neutral-600 truncate max-w-[10rem]">
                  {c.detail}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function FleetPage() {
  const [status, setStatus] = useState<FleetStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastTsRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const r = await fetch("/api/fleet", { cache: "no-store" });
        if (!r.ok) {
          if (!cancelled) setError(`API ${r.status}`);
          return;
        }
        const next = (await r.json()) as FleetStatus;
        if (cancelled) return;
        if (next.ts === lastTsRef.current) return;
        lastTsRef.current = next.ts;
        setStatus(next);
        setError(null);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "unknown error");
      }
    }

    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!status) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-white">
        <h1 className="text-2xl font-bold">Command Center</h1>
        <p className="text-sm text-neutral-400 mt-2">
          {error ? "Waiting for first fleet-medic tick…" : "Loading…"}
        </p>
      </div>
    );
  }

  const owner = status.owner ?? "Nathaniel";
  const k = status.kpis;
  const stalled = k?.stalled_deals ?? [];

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <header
          className="rounded-2xl p-5 border"
          style={{
            background: `linear-gradient(135deg, ${EREG_RED} 0%, ${EREG_RED_DIM} 100%)`,
            borderColor: EREG_RED_LIGHT,
          }}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-white/70">
            Estrada Real Estate Group
          </div>
          <h1 className="text-2xl font-bold mt-1">{greeting(owner)}</h1>
          <p className="text-xs text-white/60 mt-1">
            {new Date(status.ts).toLocaleString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </header>

        {k ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <KpiTile label="Pipeline" value={money(k.pipeline_value)} accent />
              <KpiTile label="Open Deals" value={k.open_deals} />
              <KpiTile label="New Leads Today" value={k.new_leads_today} />
              <KpiTile label="Appts Today" value={k.appointments_today} />
            </div>

            {k.upcoming_today.length > 0 && (
              <section
                className="rounded-xl p-4 border"
                style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
              >
                <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
                  Today's Schedule
                </h2>
                <ul className="space-y-1 text-sm">
                  {k.upcoming_today.map((ev, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span className="truncate">
                        {ev.title}
                        {ev.contact ? ` · ${ev.contact}` : ""}
                      </span>
                      {ev.start && (
                        <span className="text-neutral-500 shrink-0">
                          {new Date(ev.start).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: "#0a0a0a",
                borderColor: stalled.length > 0 ? EREG_RED : "#1f1f1f",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs uppercase tracking-wider text-neutral-400">
                  Needs Your Attention
                </h2>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      stalled.length > 0 ? EREG_RED_DIM : "#1a1a1a",
                    color: stalled.length > 0 ? "white" : "#737373",
                  }}
                >
                  {stalled.length} stalled
                </span>
              </div>
              {stalled.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No stalled deals. Every open lead has moved in the last 14 days.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {stalled.slice(0, 5).map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start justify-between gap-3"
                    >
                      <span className="min-w-0 truncate">{s.name}</span>
                      <span className="text-xs text-neutral-500 shrink-0">
                        {s.days_stale}d · {money(s.value)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section
              className="rounded-xl p-4 border"
              style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
            >
              <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
                AI Employees
              </h2>
              <ul className="space-y-1 text-sm">
                {status.agents.map((a) => (
                  <li
                    key={a.name}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: a.ok ? "#22c55e" : EREG_RED_LIGHT,
                        }}
                      />
                      {a.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {a.ok ? "online" : "offline"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <section
            className="rounded-xl p-4 border text-sm text-neutral-400"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
          >
            KPIs not available yet — next fleet-medic tick will fetch them.
          </section>
        )}

        <HealthFooter status={status} />

        <p className="text-[10px] text-neutral-600 text-center pt-2">
          Last sync {new Date(status.ts).toLocaleTimeString()} · fleet-medic
        </p>
      </div>
    </div>
  );
}
