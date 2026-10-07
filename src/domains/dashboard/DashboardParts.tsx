import type { ComponentProps, ReactNode } from "react";
import { Group, Text } from "@mantine/core";
import { Chip } from "@/shared/ui/primitives/Chip";
import Caption from "@/shared/ui/Caption/Caption";
import FadedDivider from "@/shared/ui/primitives/FadedDivider/FadedDivider";
import classes from "./DashboardPage.module.css";

type ChipAccent = ComponentProps<typeof Chip>["accent"];

export function LabelChip({
  accent,
  size = "xs",
  leftSection,
  children,
}: {
  accent: ChipAccent;
  size?: "xs" | "sm";
  leftSection?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Chip accent={accent} size={size} leftSection={leftSection}>
      <Text size={size === "xs" ? "10px" : "xs"} fw={700} c="white">
        {children}
      </Text>
    </Chip>
  );
}

export function SectionHeader({
  icon,
  title,
  badge,
  badgeAccent,
}: {
  icon: ReactNode;
  title: string;
  badge: ReactNode;
  badgeAccent: ChipAccent;
}) {
  return (
    <>
      <div className={classes.sectionHeader}>
        <Group gap={6}>
          {icon}
          <Caption size="sm">{title}</Caption>
        </Group>
        <LabelChip accent={badgeAccent}>{badge}</LabelChip>
      </div>
      <FadedDivider orientation="horizontal" />
    </>
  );
}
