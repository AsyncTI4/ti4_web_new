import { Paper, Box, type PaperProps } from "@mantine/core";
import { generateColorGradient } from "@/entities/lookup/colors";
import { getPrimaryColorWithOpacity } from "@/entities/lookup/colors";
import "@/styles/theme.css";
import styles from "./PlayerCardBox.module.css";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import cx from "clsx";

type Props = {
  color: string;
  faction: string;
  children: React.ReactNode;
  showFactionBackground?: boolean;
  paperProps?: PaperProps;
  /** Skip the gradient edge bars and use a single subtle 1px border */
  subtleBorder?: boolean;
  /** Breathing faction-colored glow while this player holds the turn */
  isActive?: boolean;
};

export function PlayerCardBox({
  color,
  faction,
  children,
  showFactionBackground = true,
  paperProps = {},
  subtleBorder = false,
  isActive = false,
}: Props) {
  const { style: paperStyle, ...restPaperProps } = paperProps;

  return (
    <Box
      className={cx(
        styles.wrapper,
        subtleBorder && styles.wrapperTight,
        isActive && styles.activeCard,
      )}
      style={
        isActive
          ? ({
              "--active-glow": getPrimaryColorWithOpacity(color, 0.4),
              "--active-glow-weak": getPrimaryColorWithOpacity(color, 0.14),
            } as React.CSSProperties)
          : undefined
      }
    >
      {!subtleBorder && (
        <>
          <Box
            className={`${styles.edgeBar} ${styles.edgeBarTop}`}
            style={{ background: generateColorGradient(color, 0.6) }}
          />
          <Box
            className={`${styles.edgeBar} ${styles.edgeBarBottom}`}
            style={{ background: generateColorGradient(color, 0.6) }}
          />
        </>
      )}
      <Paper
        p="sm"
        radius="md"
        className={styles.paper}
        {...restPaperProps}
        style={{
          border: `1px solid ${getPrimaryColorWithOpacity(color, subtleBorder ? 0.25 : 0.3)}`,
          ...paperStyle,
        }}
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
