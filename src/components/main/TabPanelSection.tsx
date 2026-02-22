import { Box, type BoxProps, Tabs, type TabsPanelProps } from "@mantine/core";
import type { ReactNode } from "react";

type TabPanelSectionProps = {
  value: string;
  children: ReactNode;
  /**
   * Height passed directly to Mantine Tabs.Panel. Defaults to the content panel height used
   * across the NewMapUI tabbed sections.
   */
  height?: TabsPanelProps["h"];
  /**
   * Optional className applied to the Box that wraps the panel content so callers
   * can keep their existing CSS modules.
   */
  className?: string;
  /**
   * Additional props spread into the Box wrapper when extra styling is needed.
   */
  boxProps?: BoxProps;
};

export function TabPanelSection({
  value,
  height = "calc(100% - 60px)",
  children,
  className,
  boxProps,
}: TabPanelSectionProps) {
  return (
    <Tabs.Panel value={value} h={height}>
      <Box className={className} {...boxProps}>
        {children}
      </Box>
    </Tabs.Panel>
  );
}

export default TabPanelSection;
