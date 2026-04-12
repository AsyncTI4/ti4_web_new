import { leaders } from "@/entities/data/leaders";
import type { Leader, LeaderData } from "@/entities/data/types";

export function getLeaderById(leaderId: string): LeaderData | undefined {
  return leaders.find((leader) => leader.id === leaderId);
}

export function getFactionLeader(
  faction: string,
  type: LeaderData["type"]
): LeaderData | undefined {
  return leaders.find(
    (leader) =>
      leader.id === `${faction}${type}` && !leader.homebrewReplacesID
  );
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
