import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconLayoutDashboard, IconSettings } from "@tabler/icons-react";
import { Group } from "@mantine/core";
import cx from "clsx";
import classes from "@/domains/game-shell/components/chrome/HeaderMenuNew.module.css";

export type DashboardLinksProps = {
    hideOnMobile?: boolean;
};

export function DashboardLinks({
    hideOnMobile
}: DashboardLinksProps) {
  const { pathname } = useLocation();

  return (
    <Group gap={6} wrap="nowrap" visibleFrom={hideOnMobile ? "sm" : undefined}>
      <NavLink
        to="/dashboard"
        active={pathname === "/dashboard"}
        icon={<IconLayoutDashboard size={12} className={classes.dashboardLinkIcon} />}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/dashboard/settings"
        active={pathname === "/dashboard/settings"}
        icon={<IconSettings size={12} className={classes.dashboardLinkIcon} />}
      >
        Settings
      </NavLink>
    </Group>
  );
}

type NavLinkProps = {
  active: boolean;
  icon: ReactNode;
  to: string;
  children: ReactNode;
};

function NavLink({ active, icon, to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cx(classes.tab, classes.dashboardNavTab)}
      data-active={active || undefined}
    >
      {icon}
      <span className={classes.tabText}>{children}</span>
    </Link>
  );
}
