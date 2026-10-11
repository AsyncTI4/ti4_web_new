import type { ComponentType } from "react";
import { IconLayoutGrid, IconMap, IconTarget, IconUsers } from "@tabler/icons-react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

type MainTabValue = "map" | "objectives" | "general" | "players";

type MainTabConfig = {
  value: MainTabValue;
  label: string;
  Icon: ComponentType<{ size?: number }>;
  visibleFrom?: Breakpoint;
  hideOnMobile?: boolean;
};

export const MAIN_TAB_CONFIGS: MainTabConfig[] = [
  {
    value: "map",
    label: "Map",
    Icon: IconMap,
    visibleFrom: "sm",
  },
  {
    value: "objectives",
    label: "Objectives",
    Icon: IconTarget,
    visibleFrom: "sm",
  },
  {
    value: "general",
    label: "General",
    Icon: IconLayoutGrid,
    visibleFrom: "sm",
  },
  {
    value: "players",
    label: "Player",
    Icon: IconUsers,
    visibleFrom: "sm",
  },
];
