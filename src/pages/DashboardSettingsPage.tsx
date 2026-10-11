import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageShell } from "@/layout/PageShell";
import { DashboardSettingsPanel } from "@/domains/dashboard/DashboardSettingsPanel";
import classes from "@/domains/dashboard/DashboardPage.module.css";

export default function DashboardSettingsPage() {
  useDocumentTitle("Dashboard Settings");

  return (
    <PageShell footer mainClassName={classes.main}>
      <div className={classes.wrap}>
        <DashboardSettingsPanel />
      </div>
    </PageShell>
  );
}
