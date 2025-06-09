import { Paper, Box, Image } from "@mantine/core";
import { generateColorGradient } from "../PlayerArea/HeaderAccent";
import { getPrimaryColorWithOpacity } from "@/lookup/colors";
import { cdnImage } from "../../data/cdnImage";
import styles from "./PlayerCardBox.module.css";

type PlayerCardBoxProps = {
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
}: PlayerCardBoxProps) {
  return (
    <Box
      className={styles.wrapper}
      style={{
        background: generateColorGradient(color, 0.6),
      }}
    >
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
        <Box className={styles.innerGlow} />

        <Box className={styles.content}>{children}</Box>

        {showFactionBackground && (
          <Box className={styles.factionBackground}>
            <Image
              src={cdnImage(`/factions/${faction}.png`)}
              alt="faction"
              w="100%"
              h="100%"
              style={{ objectFit: "contain" }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
