import { AppShell, Box } from "@mantine/core";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { usePageThemeClass } from "@/hooks/usePageThemeClass";
import { SiteHeader } from "@/shared/ui/SiteHeader";
import { DashboardSettingsPanel } from "./DashboardSettingsPanel";
import classes from "./DashboardPage.module.css";
import { APP_HEADER_HEIGHT } from "@/shared/ui/AppHeader";

export default function DashboardSettingsPage() {
  useDocumentTitle("Dashboard Settings");
  const themeClassName = usePageThemeClass();

  return (
    <div className={themeClassName}>
      <AppShell header={{ height: APP_HEADER_HEIGHT }}>
        <SiteHeader />
        <AppShell.Main className={classes.main}>
          <Box className={classes.wrap}>
            <DashboardSettingsPanel />
          </Box>
        </AppShell.Main>
      </AppShell>
    </div>
  );
}
