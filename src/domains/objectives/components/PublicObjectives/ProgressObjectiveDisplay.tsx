import { PlayerData } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { IconCheck } from "@tabler/icons-react";
import styles from "./ExpandedObjectiveCard.module.css";

type FactionProgressData = {
  player: PlayerData;
  progress: number;
  isScored: boolean;
  isAtThreshold: boolean;
};

type ProgressObjectiveDisplayProps = {
  factionProgressData: FactionProgressData[];
  progressThreshold: number;
};

function pillState({ isScored, isAtThreshold }: FactionProgressData) {
  if (isScored) return "scored";
  if (isAtThreshold) return "qual";
  return undefined;
}

function pillValue(data: FactionProgressData, threshold: number) {
  if (data.isScored) return <IconCheck size={12} stroke={2.5} />;
  if (threshold > 0) return `${data.progress}/${threshold}`;
  return "–";
}

function pillTitle(data: FactionProgressData, threshold: number) {
  if (data.isScored) return `${data.player.faction}: scored`;
  if (threshold > 0) return `${data.player.faction}: ${data.progress} of ${threshold}`;
  return `${data.player.faction}: not scored`;
}

/** One progress pill per seat, in seat order: scored, qualifies, or n/threshold. */
function ProgressObjectiveDisplay({
  factionProgressData,
  progressThreshold,
}: ProgressObjectiveDisplayProps) {
  return (
    <>
      {factionProgressData.map((data) => (
        <span
          key={data.player.faction}
          className={styles.pill}
          data-s={pillState(data)}
          title={pillTitle(data, progressThreshold)}
        >
          <FactionIcon
            faction={data.player.faction}
            factionImageOverride={data.player.factionImage}
            factionImageTypeOverride={data.player.factionImageType}
            alt=""
            w={18}
            h={18}
          />
          <span className={styles.pillValue}>
            {pillValue(data, progressThreshold)}
          </span>
        </span>
      ))}
    </>
  );
}

export default ProgressObjectiveDisplay;
