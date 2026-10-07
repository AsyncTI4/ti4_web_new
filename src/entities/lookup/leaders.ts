import { leaders } from "@/entities/data/leaders";
import { indexBy } from "@/entities/lookup/indexBy";
import type { Leader, LeaderData } from "@/entities/data/types";

const leadersMap = indexBy(leaders, (leader) => leader.id);

export function getLeaderById(leaderId: string): LeaderData | undefined {
  return leadersMap.get(leaderId);
}

function getFactionLeader(
  faction: string,
  type: LeaderData["type"]
): LeaderData | undefined {
  const leader = getLeaderById(`${faction}${type}`);
  return leader?.homebrewReplacesID ? undefined : leader;
}

export function getAllianceCommander(
  faction: string,
  playerLeaders?: Leader[]
): LeaderData | undefined {
  const playerCommanderId = playerLeaders?.find(
    (leader) => leader.type === "commander"
  )?.id;

  if (playerCommanderId) {
    return getLeaderById(playerCommanderId);
  }

  return (
    getFactionLeader(faction, "commander") ||
    leaders.find(
      (leader) =>
        leader.faction === faction &&
        leader.type === "commander" &&
        !leader.homebrewReplacesID
    )
  );
}
