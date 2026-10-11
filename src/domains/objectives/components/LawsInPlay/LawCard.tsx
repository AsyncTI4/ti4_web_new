import { useState, type KeyboardEvent } from "react";
import { Box } from "@/ds";
import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LawDetailsCard } from "@/domains/cards/components/LawDetailsCard";
import styles from "./LawCard.module.css";

type Props = {
  law: LawInPlay;
};

/** A law in play as a sealed row: wax seal, engraved name, one line of text. */
function LawCard({ law }: Props) {
  const electedFaction = law.displaysElectedFaction
    ? law.electedFaction
    : undefined;
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
          onClick={toggleOpened}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.seal} aria-hidden="true">
            <IconScale size={13} stroke={2} />
          </span>
          <span className={styles.name}>{law.name}</span>
          {mapText && <span className={styles.text}>{mapText}</span>}
          {electedFaction && (
            <CircularFactionIcon
              faction={electedFaction}
              size={20}
              className={styles.elect}
            />
          )}
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LawDetailsCard law={law} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

export { LawCard };
