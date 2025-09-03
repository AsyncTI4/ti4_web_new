import { Box, Text, Group } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import { LawInPlay } from "../../../data/types";
import { Chip } from "@/components/shared/primitives/Chip";
import styles from "./CompactLaw.module.css";

type Props = {
  law: LawInPlay;
  onClick?: () => void;
};

export function CompactLaw({ law, onClick }: Props) {
  return (
    <Chip accent="purple" onClick={onClick}>
      <Box className={styles.contentContainer}>
        <IconScale size={14} className={styles.lawIcon} />
        <Text size="xs" fw={700} c="white" className={styles.textContainer}>
          {law.name}
        </Text>

        {law.displaysElectedFaction && law.electedFaction && (
          <Group gap={2} className={styles.factionIcon}>
            <CircularFactionIcon faction={law.electedFaction} size={16} />
          </Group>
        )}
      </Box>
    </Chip>
  );
}
