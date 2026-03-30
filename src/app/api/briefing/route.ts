import { NextRequest, NextResponse } from "next/server";
import { saveBriefing, getLatestBriefing, getBriefingById, listBriefingIds } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.BRIEFING_API_KEY;

  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const now = new Date();
  const denver = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [month, day, year] = denver.split("/");
  const dateId = `${year}-${month}-${day}`;

  const briefing = {
    ...body,
    id: body.id || dateId,
    createdAt: body.createdAt || now.toISOString(),
  };

  await saveBriefing(briefing);

  return NextResponse.json({ success: true, id: briefing.id }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("list") === "true") {
    const limit = parseInt(searchParams.get("limit") || "30");
    const ids = await listBriefingIds(limit);
    return NextResponse.json({ ids });
  }

  const date = searchParams.get("date");
  if (date) {
    const briefing = await getBriefingById(date);
    if (!briefing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(briefing);
  }

  const briefing = await getLatestBriefing();
  if (!briefing) return NextResponse.json({ error: "No briefings yet" }, { status: 404 });
  return NextResponse.json(briefing);
}
