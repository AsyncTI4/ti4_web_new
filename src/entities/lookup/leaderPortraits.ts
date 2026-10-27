import { cdnImage } from "@/entities/data/cdnImage";
import {
  leaderPortraitAliases,
  leaderPortraitPaths,
} from "@/entities/data/leaderPortraits";
import { getLeaderById } from "@/entities/lookup/leaders";

const portraitPaths = new Map(Object.entries(leaderPortraitPaths));
const portraitAliases = new Map(Object.entries(leaderPortraitAliases));

export function getLeaderPortraitUrl(leaderId: string): string | undefined {
  const visited = new Set<string>();
  let currentId = leaderId.toLowerCase();

  while (!visited.has(currentId)) {
    visited.add(currentId);
    const path = portraitPaths.get(currentId);
    if (path) return cdnImage(path);

    const replacement =
      portraitAliases.get(currentId) ??
      getLeaderById(currentId)?.homebrewReplacesID;
    if (!replacement) return undefined;
    currentId = replacement.toLowerCase();
  }

  return undefined;
}
