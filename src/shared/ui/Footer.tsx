import { AppShell, Text } from "@mantine/core";
import classes from "./Footer.module.css";

const DISCLAIMER =
  "This website is an unofficial fan creation and is not affiliated with, sponsored by, or endorsed by Fantasy Flight Games or Asmodee North America. Twilight Imperium and all related trademarks and copyrights are the property of Fantasy Flight Games. This tool is for personal, non-commercial use only.";

export function Footer() {
  return (
    <AppShell.Footer className={classes.footer} p="xs">
      <Text className={classes.text}>{DISCLAIMER}</Text>
    </AppShell.Footer>
  );
}
