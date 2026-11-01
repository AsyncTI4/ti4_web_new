import { AppShell, Text } from "@/ds";
import { VersionBadge } from "@/shared/ui/VersionBadge";
import classes from "./Footer.module.css";

const DISCLAIMER =
  "This website is an unofficial fan creation and is not affiliated with, sponsored by, or endorsed by Fantasy Flight Games or Asmodee North America. Twilight Imperium and all related trademarks and copyrights are the property of Fantasy Flight Games. This tool is for personal, non-commercial use only.";

export function Footer() {
  return (
    <AppShell.Footer className={classes.footer} p="xs">
      <div className={classes.row}>
        <VersionBadge />
        <Text className={classes.text}>{DISCLAIMER}</Text>
      </div>
    </AppShell.Footer>
  );
}
