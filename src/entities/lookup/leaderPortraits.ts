import { cdnImage } from "@/entities/data/cdnImage";
import { leaderPortraitPaths } from "@/entities/data/leaderPortraits";

const portraitPaths = new Map(Object.entries(leaderPortraitPaths));

export function getLeaderPortraitUrl(leaderId: string): string | undefined {
  const path = portraitPaths.get(leaderId);
  return path ? cdnImage(path) : undefined;
}
