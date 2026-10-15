import { useState, type KeyboardEvent } from "react";
import { Box } from "@/ds";
import { IconScale } from "@tabler/icons-react";
import type { LawInPlay, PlayerData } from "@/entities/data/types";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LawDetailsCard } from "@/domains/cards/components/LawDetailsCard";
import { searchKey, searchTarget } from "@/domains/search/searchKeys";
import styles from "./LawCard.module.css";

type Props = {
  law: LawInPlay;
  /** Lets an elected player read as their name, not only their faction. */
  playerData?: PlayerData[];
};

function Elected({ law, playerData }: Props) {
  if (law.displaysElectedFaction && law.electedFaction) {
    const player = playerData?.find((p) => p.faction === law.electedFaction);
    return (
      <span className={styles.elected} title={`Elected: ${player?.userName ?? law.electedFaction}`}>
        <FactionIcon
          faction={law.electedFaction}
          factionImageOverride={player?.factionImage}
          factionImageTypeOverride={player?.factionImageType}
          alt=""
          w={18}
          h={18}
        />
        {player && <span>{player.userName}</span>}
      </span>
    );
  }
  if (!law.electedInfo) return null;
  return (
    <span className={styles.elected} title={`Elected: ${law.electedInfo}`}>
      <span>{law.electedInfo}</span>
    </span>
  );
}

/** A law in play as a sealed row: the seal, its name, what it does, and who or what was elected. */
function LawCard({ law, playerData }: Props) {
  const mapText = law.mapText?.trim();
  const [opened, setOpened] = useState(false);
  const toggleOpened = () => setOpened((current) => !current);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOpened();
    }
  };

  return (
    <SmoothPopover opened={opened} onChange={setOpened} position="top-start">
      <SmoothPopover.Target>
        <Box
          className={styles.law}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          {...searchTarget(searchKey("law", law.id))}
          onClick={toggleOpened}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.seal} aria-hidden="true">
            <IconScale size={14} stroke={1.8} />
          </span>
          <span className={styles.head}>
            <span className={styles.name}>{law.name}</span>
            <Elected law={law} playerData={playerData} />
          </span>
          {mapText && <span className={styles.text}>{mapText}</span>}
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LawDetailsCard law={law} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

export { LawCard };
