import { Box, Tabs, type BoxProps } from "@/ds";
import type { ReactNode } from "react";

type TabPanelSectionProps = {
  value: string;
  children: ReactNode;
  /**
   * Height of the tab panel. Defaults to the content panel height used
   * across the GameMapPage tabbed sections.
   */
  height?: BoxProps["h"];
  /**
   * Optional className applied to the Box that wraps the panel content so callers
   * can keep their existing CSS modules.
   */
  className?: string;
  /** Content renders only once the tab has been opened, then stays mounted while hidden. */
  visited?: boolean;
};

export function TabPanelSection({
  value,
  height = "calc(100% - 60px)",
  children,
  className,
  visited = true,
}: TabPanelSectionProps) {
  return (
    <Tabs.Panel value={value} h={height}>
      {visited && <Box className={className}>{children}</Box>}
    </Tabs.Panel>
  );
}
