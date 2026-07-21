import { useState, type KeyboardEvent } from "react";
import { Box, Group, Text } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LawDetailsCard } from "@/domains/player/components/LawDetailsCard";
import { UnidentifiedPlayerDot } from "@/shared/ui/UnidentifiedPlayerDot";
import { resolveFactionIdentity } from "@/utils/fowIdentity";
import styles from "./LawCard.module.css";

type Props = {
  law: LawInPlay;
};

function LawCard({ law }: Props) {
  // electedFaction may be a "fow:<color>" sentinel when the viewer can't identify the elected
  // player - the color is public, so fall back to a colored dot rather than dropping the marker.
  const elected = law.electedFaction
    ? resolveFactionIdentity(law.electedFaction)
    : undefined;
  const hasFactionIcon = law.displaysElectedFaction && elected;
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
          className={styles.lawCard}
          role="button"
          tabIndex={0}
          onClick={toggleOpened}
          onKeyDown={handleKeyDown}
        >
          <Group gap={6} wrap="nowrap" align="center">
            <Box className={styles.lawIcon}>
              <IconScale size={14} stroke={2.4} />
            </Box>
            <Box className={styles.lawText}>
              <Text className={styles.lawTitle}>{law.name}</Text>
              {law.mapText && law.mapText.trim() && (
                <Text className={styles.mapText}>{law.mapText}</Text>
              )}
            </Box>
            {hasFactionIcon &&
              (elected.faction ? (
                <CircularFactionIcon
                  faction={elected.faction}
                  size={20}
                  className={styles.factionIcon}
                />
              ) : (
                <UnidentifiedPlayerDot
                  color={elected.rawColor!}
                  size={20}
                  className={styles.factionIcon}
                />
              ))}
          </Group>
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LawDetailsCard law={law} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

export { LawCard };
