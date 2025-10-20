import { Paper, Box } from "@mantine/core";
import { generateColorGradient } from "@/lookup/colors";
import { getPrimaryColorWithOpacity } from "@/lookup/colors";
import "../../styles/theme.css";
import styles from "./PlayerCardBox.module.css";
import { FactionIcon } from "../shared/FactionIcon";

type Props = {
  color: string;
  faction: string;
  children: React.ReactNode;
  showFactionBackground?: boolean;
  paperProps?: Record<string, any>;
};

export function PlayerCardBox({
  color,
  faction,
  children,
  showFactionBackground = true,
  paperProps = {},
}: Props) {
  return (
    <Box className={styles.wrapper}>
      <Box
        className={`${styles.edgeBar} ${styles.edgeBarTop}`}
        style={{ background: generateColorGradient(color, 0.6) }}
      />
      <Box
        className={`${styles.edgeBar} ${styles.edgeBarBottom}`}
        style={{ background: generateColorGradient(color, 0.6) }}
      />
      <Paper
        p="sm"
        radius="md"
        className={styles.paper}
        style={{
          border: `1px solid ${getPrimaryColorWithOpacity(color, 0.3)}`,
          ...paperProps.style,
        }}
        {...paperProps}
      >
        <Box className={styles.content}>{children}</Box>
        <Box className={styles.innerGlow} />
        <Box className={styles.factionClip}>
          {showFactionBackground && (
            <Box className={styles.factionBackground}>
              <FactionIcon
                faction={faction}
                fw="100%"
                h="100%"
                style={{ objectFit: "contain" }}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
