import { Link, useLocation } from "react-router-dom";
import { IconLayoutDashboard } from "@tabler/icons-react";
import classes from "@/domains/game-shell/components/chrome/HeaderMenuNew.module.css";

export function DashboardLink() {
  const { pathname } = useLocation();
  const isActive = pathname === "/dashboard";

  return (
    <Link
      to="/dashboard"
      className={classes.dashboardLink}
      data-active={isActive || undefined}
    >
      <IconLayoutDashboard size={14} className={classes.dashboardLinkIcon} />
      Dashboard
    </Link>
  );
}
