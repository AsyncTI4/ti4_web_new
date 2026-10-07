import type { Leader, BreakthroughData } from "@/entities/data/types";

/**
 * Determines if the Xxcha faction has the flex spend ability unlocked.
 * This occurs when either:
 * - Their breakthrough (Archon's Gift, id: xxchabt) is unlocked
 * - Their PoK hero (Political Data Nexus, id: xxchahero) is unlocked
 *
 * Note: xxchahero-te (Tesseract Empowerment hero) has a different ability and does NOT grant flex spend.
 */
export function hasXxchaFlexSpendAbility(
  faction: string,
  breakthrough: BreakthroughData | undefined,
  leaders: Leader[]
): boolean {
  if (faction !== "xxcha") {
    return false;
  }

  const hasBreakthroughUnlocked =
    breakthrough?.breakthroughId === "xxchabt" && breakthrough?.unlocked;

  const hasHeroUnlocked = leaders.some(
    (leader) => leader.id === "xxchahero" && !leader.locked
  );

  return hasBreakthroughUnlocked || hasHeroUnlocked;
}
