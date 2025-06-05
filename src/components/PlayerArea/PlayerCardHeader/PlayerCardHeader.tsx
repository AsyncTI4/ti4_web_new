import { Box } from "@mantine/core";
import { HeaderAccent } from "../HeaderAccent";
import styles from "./PlayerCardHeader.module.css";

type Props = {
  color: string;
  passed?: boolean;
  children: React.ReactNode;
};

export function PlayerCardHeader({ color, passed = false, children }: Props) {
  return (
    <Box className={`${styles.header} ${passed ? styles.passed : ""}`}>
      {/* Header bottom border accent */}
      <HeaderAccent color={color} />

      {children}
    </Box>
  );
}
