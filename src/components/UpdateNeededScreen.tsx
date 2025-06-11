import {
  AppShell,
  Center,
  Stack,
  Title,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
// @ts-ignore
import Logo from "./Logo";
import { HeaderMenuNew } from "./HeaderMenuNew";
import { Surface } from "./PlayerArea/Surface";
import classes from "./UpdateNeededScreen.module.css";

type UpdateNeededScreenProps = {
  gameId: string;
  activeTabs: string[];
  changeTab: (tab: string) => void;
  removeTab: (tab: string) => void;
};

export function UpdateNeededScreen({
  gameId,
  activeTabs,
  changeTab,
  removeTab,
}: UpdateNeededScreenProps) {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group className={classes.headerGroup}>
          <Logo />
          <div className={classes.logoDivider} />
          <HeaderMenuNew
            mapId={gameId}
            activeTabs={activeTabs}
            changeTab={changeTab}
            removeTab={removeTab}
          />
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Center className={classes.container}>
          <Surface
            pattern="grid"
            cornerAccents={true}
            className={classes.updateCard}
            p="xl"
            style={{
              maxWidth: 500,
              boxShadow: "0 0 20px rgba(234, 179, 8, 0.15)",
            }}
          >
            <Stack className={classes.contentStack}>
              <IconAlertTriangle size={64} className={classes.warningIcon} />

              <Title order={2} className={classes.title}>
                Update Needed
              </Title>

              <Text size="lg" className={classes.description}>
                Please hit 'refresh map' in your map-info thread to update the
                UI
              </Text>

              <Button
                size="lg"
                radius="md"
                onClick={() => window.location.reload()}
                leftSection={<IconRefresh size={18} />}
                className={classes.reloadButton}
              >
                Reload Page
              </Button>
            </Stack>
          </Surface>
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}
