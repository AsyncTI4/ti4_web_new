import { Text } from "@mantine/core";
import type { ReactNode } from "react";
import styles from "./GeneralSectionTitle.module.css";

export function GeneralSectionTitle({ children }: { children: ReactNode }) {
  return <Text className={styles.sectionTitle}>{children}</Text>;
}
