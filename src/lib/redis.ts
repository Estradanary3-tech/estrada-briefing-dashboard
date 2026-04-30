import { Redis } from "@upstash/redis";
import { Briefing } from "./types";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token || !url.startsWith("http")) {
    return null;
  }
  return new Redis({ url, token });
}

export async function saveBriefing(briefing: Briefing): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const pipe = redis.pipeline();
  pipe.set(`briefing:${briefing.id}`, JSON.stringify(briefing));
  pipe.set("briefing:latest", briefing.id);
  pipe.lpush("briefing:index", briefing.id);
  pipe.ltrim("briefing:index", 0, 89);
  await pipe.exec();
}

export async function getLatestBriefing(): Promise<Briefing | null> {
  const redis = getRedis();
  if (!redis) return null;
  const latestId = await redis.get<string>("briefing:latest");
  if (!latestId) return null;
  return getBriefingById(latestId);
}

export async function getBriefingById(id: string): Promise<Briefing | null> {
  const redis = getRedis();
  if (!redis) return null;
  const data = await redis.get<string>(`briefing:${id}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function listBriefingIds(limit = 30): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];
  return redis.lrange("briefing:index", 0, limit - 1);
}

export async function getFleetStatus<T = unknown>(): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  const data = await redis.get<string>("fleet:status");
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : (data as T);
}
