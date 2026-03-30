import { Redis } from "@upstash/redis";
import { Briefing } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function saveBriefing(briefing: Briefing): Promise<void> {
  const pipeline = redis.pipeline();
  pipeline.set(`briefing:${briefing.id}`, JSON.stringify(briefing));
  pipeline.set("briefing:latest", briefing.id);
  pipeline.lpush("briefing:index", briefing.id);
  pipeline.ltrim("briefing:index", 0, 89);
  await pipeline.exec();
}

export async function getLatestBriefing(): Promise<Briefing | null> {
  const latestId = await redis.get<string>("briefing:latest");
  if (!latestId) return null;
  return getBriefingById(latestId);
}

export async function getBriefingById(id: string): Promise<Briefing | null> {
  const data = await redis.get<string>(`briefing:${id}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function listBriefingIds(limit = 30): Promise<string[]> {
  return redis.lrange("briefing:index", 0, limit - 1);
}
