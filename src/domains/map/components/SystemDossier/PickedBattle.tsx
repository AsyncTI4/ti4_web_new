import { IconCalculator, IconSword, IconX } from "@tabler/icons-react";
import cx from "clsx";
import { Tooltip } from "@/ds";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { getPlanetData } from "@/entities/lookup/planets";
import { useAppStore, type BattleAttackerPick } from "@/state/appStore";
import { useGameData } from "@/state/useGameContext";
import type { Tile } from "@/entities/game/types";
import { buildPickedBattleUrl } from "./battleCalcLink";
import type { FactionHelpers } from "./useFactionHelpers";
import styles from "./SystemDossier.module.css";

function zoneName(pick: BattleAttackerPick): string {
  const planet = pick.planetId ? getPlanetData(pick.planetId)?.name : null;
  return planet
    ? `${planet} (${pick.position})`
    : `space area of ${pick.position}`;
}

function samePick(a: BattleAttackerPick, b: BattleAttackerPick) {
  return (
    a.position === b.position &&
    a.planetId === b.planetId &&
    a.faction === b.faction
  );
}

/** The picked zones in a sentence: "A", "A and B", "A, B and C". */
function zoneNames(picks: BattleAttackerPick[]): string {
  const names = picks.map(zoneName);
  return names.length < 2
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * A force row's battle actions: add its force to the attacker, and, once an
 * attacker is gathered from any zones or systems, open the calculator with
 * that attacker against this force.
 */
export function PickedBattleActions({
  tile,
  planetId,
  faction,
  helpers,
}: {
  tile: Tile;
  planetId: string | null;
  faction: string;
  helpers: FactionHelpers;
}) {
  const picks = useAppStore((state) => state.battleAttackers);
  const togglePick = useAppStore((state) => state.toggleBattleAttacker);
  const gameData = useGameData();
  const self = { position: tile.position, planetId, faction };
  const picked = picks.some((pick) => samePick(pick, self));
  const attacker = picks[0]?.faction;

  const url =
    attacker && attacker !== faction
      ? buildPickedBattleUrl(
          (position) => gameData?.tiles?.[position],
          picks,
          tile,
          planetId,
          faction,
          helpers.playerFor,
        )
      : null;

  const name = helpers.displayName(faction);
  const pickTitle = picked
    ? "Part of the attacker. Click to drop it"
    : attacker === faction
      ? `Add ${name}'s forces here to the attacker`
      : attacker
        ? `Pick ${name} here as the attacker instead of ${helpers.displayName(attacker)}`
        : `Pick ${name} here as the attacker, add more of its forces from other zones or systems, then open the battle calculator from the defender's row in any system`;
  const calcTitle = attacker
    ? `${helpers.displayName(attacker)} from ${zoneNames(picks)} attacking ${name} here, in the battle calculator`
    : "";

  return (
    <span className={styles.pickActions}>
      {url && (
        <Tooltip label={calcTitle} multiline maw={260}>
          <a
            className={cx(styles.calcLink, styles.pickCalc)}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={calcTitle}
          >
            <IconCalculator size={14} aria-hidden />
          </a>
        </Tooltip>
      )}
      <Tooltip label={pickTitle} multiline maw={260}>
        <button
          type="button"
          className={cx(styles.calcLink, picked && styles.pickOn)}
          aria-pressed={picked}
          aria-label={pickTitle}
          onClick={() => togglePick(self)}
        >
          <IconSword size={14} aria-hidden />
        </button>
      </Tooltip>
    </span>
  );
}

/** Names the picked attacker in the dossier's footer, with a way to clear it. */
export function PickedAttackerNote({ helpers }: { helpers: FactionHelpers }) {
  const picks = useAppStore((state) => state.battleAttackers);
  const clearPicks = useAppStore((state) => state.clearBattleAttackers);
  const pick = picks[0];
  if (!pick) return null;

  return (
    <span className={styles.pickNote}>
      <IconSword size={13} aria-hidden />
      Attacker
      <FactionIcon faction={pick.faction} w={14} h={14} />
      <b>{helpers.displayName(pick.faction)}</b>
      <span>from {zoneNames(picks)}</span>
      <button
        type="button"
        className={styles.pickClear}
        onClick={clearPicks}
        aria-label="Clear the picked attacker"
      >
        <IconX size={12} aria-hidden />
      </button>
    </span>
  );
}
