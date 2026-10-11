import { Image } from "@/ds";
import { IconCheck } from "@tabler/icons-react";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { PlayerData } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import classes from "./ObjectiveDetailsCard.module.css";
import { getPlayerFactionDisplayName } from "@/entities/game/playerUtils";

type ObjectiveColor = "orange" | "blue" | "gray";

const CARD_COLORS = { orange: "orange", blue: "sky", gray: "none" } as const;
const STAGE_GLYPH = { orange: "I", blue: "II", gray: "" } as const;

type Props = {
  objectiveKey: string;
  playerData: PlayerData[];
  hasRedTape?: boolean;
  scoredFactions?: string[];
  color?: ObjectiveColor;
  factionProgress?: Record<string, number>;
  progressThreshold?: number;
  showFactionProgress?: boolean;
};

type ProgressRow = { player: PlayerData; progress: number; isScored: boolean };

function FactionProgress({
  rows,
  threshold,
}: {
  rows: ProgressRow[];
  threshold: number;
}) {
  return (
    <div className={classes.progress}>
      {rows.map(({ player, progress, isScored }) => (
        <div key={player.faction} className={classes.row} data-scored={isScored || undefined}>
          <CircularFactionIcon
            faction={player.faction}
            factionImageOverride={player.factionImage}
            factionImageTypeOverride={player.factionImageType}
            size={20}
          />
          <span className={classes.factionName}>
            {getPlayerFactionDisplayName(player)}
          </span>
          <span className={classes.playerName}>{player.userName}</span>
          <span className={classes.value}>
            {isScored ? (
              <IconCheck size={15} aria-label="Scored" />
            ) : (
              `${progress}/${threshold}`
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ObjectiveDetailsCard({
  objectiveKey,
  playerData,
  hasRedTape,
  scoredFactions = [],
  color = "blue",
  factionProgress = {},
  progressThreshold = 0,
  showFactionProgress = true,
}: Props) {
  const objectiveData = publicObjectives.find(
    (obj) => obj.alias === objectiveKey
  );

  if (!objectiveData) return null;

  const scoredFactionsSet = new Set(scoredFactions);

  const rows = playerData.map((player) => ({
    player,
    progress: factionProgress[player.faction] || 0,
    isScored: scoredFactionsSet.has(player.faction),
  }));

  // Scored first, then unscored by highest progress
  rows.sort((a, b) => {
    if (a.isScored !== b.isScored) return a.isScored ? -1 : 1;
    if (a.isScored) return 0;
    return b.progress - a.progress;
  });

  const glyph = hasRedTape ? (
    <Image src="/redTape.png" alt="" />
  ) : (
    STAGE_GLYPH[color]
  );

  return (
    <DetailsCard width={340} color={CARD_COLORS[color]}>
      <DetailsCard.Title
        title={objectiveData.name}
        type={
          color === "gray" ? "Objective" : `Stage ${STAGE_GLYPH[color]} objective`
        }
        meta={[`${objectiveData.phase} phase`, `${objectiveData.points} VP`]}
        icon={
          glyph ? <DetailsCard.Icon shape="round" icon={glyph} /> : undefined
        }
      />
      <DetailsCard.Section title="Requirement" content={objectiveData.text} />
      {showFactionProgress && (
        <DetailsCard.Section
          title="Progress"
          content={<FactionProgress rows={rows} threshold={progressThreshold} />}
        />
      )}
    </DetailsCard>
  );
}
