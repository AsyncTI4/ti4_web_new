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

function samePick(a: BattleAttackerPick | null, b: BattleAttackerPick) {
  return (
    !!a &&
    a.position === b.position &&
    a.planetId === b.planetId &&
    a.faction === b.faction
  );
}

/**
 * A force row's battle actions: pick its force as the attacker, and, once an
 * attacker from any zone or system is picked, open the calculator with that
 * attacker against this force.
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
  const pick = useAppStore((state) => state.battleAttacker);
  const setPick = useAppStore((state) => state.setBattleAttacker);
  const gameData = useGameData();
  const self = { position: tile.position, planetId, faction };
  const picked = samePick(pick, self);

  const attackerTile = pick ? gameData?.tiles?.[pick.position] : undefined;
  const url =
    pick && attackerTile && pick.faction !== faction
      ? buildPickedBattleUrl(
          attackerTile,
          pick,
          tile,
          planetId,
          faction,
          helpers.playerFor,
        )
      : null;

  const pickTitle = picked
    ? "Picked as attacker. Click to clear"
    : `Pick ${helpers.displayName(faction)} here as the attacker, then open the battle calculator from the defender's row in any system`;
  const calcTitle = pick
    ? `${helpers.displayName(pick.faction)} from ${zoneName(pick)} attacking ${helpers.displayName(faction)} here, in the battle calculator`
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
          onClick={() => setPick(picked ? null : self)}
        >
          <IconSword size={14} aria-hidden />
        </button>
      </Tooltip>
    </span>
  );
}

/** Names the picked attacker in the dossier's footer, with a way to clear it. */
export function PickedAttackerNote({ helpers }: { helpers: FactionHelpers }) {
  const pick = useAppStore((state) => state.battleAttacker);
  const setPick = useAppStore((state) => state.setBattleAttacker);
  if (!pick) return null;

  return (
    <span className={styles.pickNote}>
      <IconSword size={13} aria-hidden />
      Attacker
      <FactionIcon faction={pick.faction} w={14} h={14} />
      <b>{helpers.displayName(pick.faction)}</b>
      <span>from {zoneName(pick)}</span>
      <button
        type="button"
        className={styles.pickClear}
        onClick={() => setPick(null)}
        aria-label="Clear the picked attacker"
      >
        <IconX size={12} aria-hidden />
      </button>
    </span>
  );
}
