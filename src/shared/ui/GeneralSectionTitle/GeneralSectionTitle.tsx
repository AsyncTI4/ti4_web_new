import { Text } from "@/ds";
import type { ReactNode } from "react";
import styles from "./GeneralSectionTitle.module.css";

export function GeneralSectionTitle({ children }: { children: ReactNode }) {
  return <Text className={styles.sectionTitle}>{children}</Text>;
}
