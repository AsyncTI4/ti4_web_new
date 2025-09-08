import { cdnImage } from "@/data/cdnImage";
import type { LeaderData } from "@/data/types";

function capitalizeFirst(text: string) {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
}

export function getLeaderEmojiUrl(leader: LeaderData): string | null {
  const isEmojiSource = leader.source === "pok" || leader.source === "ds";
  if (!isEmojiSource) return null;

  let fileName = `${capitalizeFirst(leader.faction)}${capitalizeFirst(
    leader.type
  )}.webp`;

  if (leader.faction === "nomad" && leader.type === "agent") {
    if (leader.id === "nomadagentartuno") fileName = "NomadAgentArtuno.webp";
    else if (leader.id === "nomadagentmercer")
      fileName = "NomadAgentMercer.webp";
    else if (leader.id === "nomadagentthundarian")
      fileName = "NomadAgentThundarian.webp";
  }

  return cdnImage(`/emojis/leaders/${leader.source}/${fileName}`);
}
