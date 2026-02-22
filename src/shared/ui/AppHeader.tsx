import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { AppShell, Group, type GroupProps } from "@mantine/core";
import Logo from "@/shared/ui/Logo";

const defaultGroupStyle: CSSProperties = {
  flexWrap: "nowrap",
  maxWidth: "100vw",
};

export type AppHeaderProps = ComponentProps<typeof AppShell.Header> & {
  children?: ReactNode;
  groupProps?: GroupProps;
  showDivider?: boolean;
};

export function AppHeader({
  children,
  groupProps,
  showDivider = true,
  ...headerProps
}: AppHeaderProps) {
  const { style: userGroupStyle, ...restGroupProps } = groupProps ?? {};

  return (
    <AppShell.Header {...headerProps}>
      <Group
        align="center"
        h="100%"
        px="sm"
        gap="sm"
        style={{ ...defaultGroupStyle, ...(userGroupStyle ?? {}) }}
        {...restGroupProps}
      >
        <Logo />
        {showDivider && <div className="logo-divider" />}
        {children}
      </Group>
    </AppShell.Header>
  );
}
