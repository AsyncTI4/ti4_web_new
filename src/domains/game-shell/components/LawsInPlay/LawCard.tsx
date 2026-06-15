import { useState, type KeyboardEvent } from "react";
import { Box, Group, Text } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LawDetailsCard } from "@/domains/player/components/LawDetailsCard";
import styles from "./LawCard.module.css";

type Props = {
  law: LawInPlay;
};

function LawCard({ law }: Props) {
  const hasFactionIcon = law.displaysElectedFaction && law.electedFaction;
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
            {hasFactionIcon && (
              <CircularFactionIcon
                faction={law.electedFaction!}
                size={20}
                className={styles.factionIcon}
              />
            )}
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
