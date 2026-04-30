import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { getFleetStatus } from "@/lib/redis";
import type { FleetStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

async function readFromFile(): Promise<FleetStatus | null> {
  try {
    const raw = await readFile(
      join(homedir(), ".claude", "fleet-status.json"),
      "utf-8",
    );
    return JSON.parse(raw) as FleetStatus;
  } catch {
    return null;
  }
}

export async function GET() {
  const status =
    (await getFleetStatus<FleetStatus>()) ?? (await readFromFile());
  if (!status) {
    return NextResponse.json(
      { error: "No fleet status available yet" },
      { status: 404 },
    );
  }
  return NextResponse.json(status);
}
