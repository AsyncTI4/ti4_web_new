import type { ComponentType } from "react";
import { IconMap2, IconTarget, IconUsers } from "@tabler/icons-react";

type MantineBreakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export type MainTabValue = "map" | "objectives" | "general" | "players";

export type MainTabConfig = {
  value: MainTabValue;
  label: string;
  Icon: ComponentType<{ size?: number }>;
  visibleFrom?: MantineBreakpoint;
  hideOnMobile?: boolean;
  includeInDrawer?: boolean;
};

export const MAIN_TAB_CONFIGS: MainTabConfig[] = [
  {
    value: "map",
    label: "Map",
    Icon: IconMap2,
    visibleFrom: "sm",
  },
  {
    value: "objectives",
    label: "Objectives",
    Icon: IconTarget,
    hideOnMobile: true,
    includeInDrawer: false,
  },
  {
    value: "general",
    label: "General",
    Icon: IconTarget,
    visibleFrom: "sm",
  },
  {
    value: "players",
    label: "Player",
    Icon: IconUsers,
    visibleFrom: "sm",
  },
];
