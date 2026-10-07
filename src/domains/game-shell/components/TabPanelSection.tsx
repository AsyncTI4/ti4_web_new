import { Box, Tabs, type TabsPanelProps } from "@mantine/core";
import type { ReactNode } from "react";

type TabPanelSectionProps = {
  value: string;
  children: ReactNode;
  /**
   * Height passed directly to Mantine Tabs.Panel. Defaults to the content panel height used
   * across the GameMapPage tabbed sections.
   */
  height?: TabsPanelProps["h"];
  /**
   * Optional className applied to the Box that wraps the panel content so callers
   * can keep their existing CSS modules.
   */
  className?: string;
};

export function TabPanelSection({
  value,
  height = "calc(100% - 60px)",
  children,
  className,
}: TabPanelSectionProps) {
  return (
    <Tabs.Panel value={value} h={height}>
      <Box className={className}>
        {children}
      </Box>
    </Tabs.Panel>
  );
}
