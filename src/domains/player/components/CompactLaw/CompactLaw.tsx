import { Box, Text, Group } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { LawInPlay } from "@/entities/data/types";
import { Chip } from "@/shared/ui/primitives/Chip";
import { UnidentifiedPlayerDot } from "@/shared/ui/UnidentifiedPlayerDot";
import { resolveFactionIdentity } from "@/utils/fowIdentity";
import styles from "./CompactLaw.module.css";

type Props = {
  law: LawInPlay;
  onClick?: () => void;
};

export function CompactLaw({ law, onClick }: Props) {
  // electedFaction may be a "fow:<color>" sentinel when the viewer can't identify the elected
  // player - the color is public, so fall back to a colored dot rather than dropping the marker.
  const elected = law.electedFaction
    ? resolveFactionIdentity(law.electedFaction)
    : undefined;

  return (
    <Chip accent="purple" onClick={onClick}>
      <Box className={styles.contentContainer}>
        <IconScale size={14} className={styles.lawIcon} />
        <Text size="xs" fw={700} c="white" className={styles.textContainer}>
          {law.name}
        </Text>

        {law.displaysElectedFaction && elected && (
          <Group gap={2} className={styles.factionIcon}>
            {elected.faction ? (
              <CircularFactionIcon faction={elected.faction} size={16} />
            ) : (
              <UnidentifiedPlayerDot color={elected.rawColor!} size={16} />
            )}
          </Group>
        )}
      </Box>
    </Chip>
  );
}
