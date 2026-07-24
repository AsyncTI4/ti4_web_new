import { Box } from "@mantine/core";
import { IconEyeOff } from "@tabler/icons-react";
import styles from "./AnonymousPlayerToken.module.css";

type Props = {
  size?: number;
  className?: string;
};

/**
 * Stand-in for a player the viewer can't identify at all - unlike UnidentifiedPlayerDot, not even
 * their color is known here, so there's nothing to colour the token with. The crossed-out eye
 * marks it as deliberately withheld rather than as missing/blank data.
 */
export function AnonymousPlayerToken({ size = 24, className }: Props) {
  return (
    <Box
      title="Unidentified player"
      className={className ? `${styles.token} ${className}` : styles.token}
      style={{ width: size, height: size }}
    >
      <IconEyeOff size={Math.round(size * 0.58)} stroke={2} className={styles.icon} />
    </Box>
  );
}
