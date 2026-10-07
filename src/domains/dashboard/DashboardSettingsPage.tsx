import { Box } from "@mantine/core";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageShell } from "@/shared/ui/PageShell";
import { DashboardSettingsPanel } from "./DashboardSettingsPanel";
import classes from "./DashboardPage.module.css";

export default function DashboardSettingsPage() {
  useDocumentTitle("Dashboard Settings");

  return (
    <PageShell mainClassName={classes.main}>
      <Box className={classes.wrap}>
        <DashboardSettingsPanel />
      </Box>
    </PageShell>
  );
}
