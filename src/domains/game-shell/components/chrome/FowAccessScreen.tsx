import { AppShell, Center, Stack, Title, Text, Group } from "@mantine/core";
import { IconCloudFog, IconLock } from "@tabler/icons-react";
import { HeaderMenuNew } from "./HeaderMenuNew";
import { Surface } from "@/domains/player/components/Surface";
import { DiscordLogin } from "@/domains/auth/DiscordLogin";
import classes from "./FowAccessScreen.module.css";
import { APP_HEADER_HEIGHT, AppHeader } from "@/shared/ui/AppHeader";
import type { EnrichedTab } from "@/app/providers/context/types";
import type { PlayerDataError } from "@/hooks/usePlayerData";

type FowAccessScreenProps = {
  gameId: string;
  error: PlayerDataError;
  activeTabs: EnrichedTab[];
  changeTab: (tab: string) => void;
  removeTab: (tab: string) => void;
};

export function FowAccessScreen({
  gameId,
  error,
  activeTabs,
  changeTab,
  removeTab,
}: FowAccessScreenProps) {
  const requiresAuth = error.requiresAuth;
  // A 403 isn't always "you aren't in this game" - the backend also refuses participants and GMs
  // for other reasons (e.g. a rollout restricted to certain roles), and says why. Prefer its
  // explanation over guessing, and only fall back to the not-a-participant wording when it's silent.
  const deniedMessage =
    error.message?.trim() ||
    "This is a Fog of War game, and you're not one of its players. Only participants can see through the fog.";

  return (
    <AppShell header={{ height: APP_HEADER_HEIGHT }}>
      <AppHeader
        showDivider={false}
        groupProps={{ className: classes.headerGroup }}
      >
        <div className={classes.logoDivider} />
        <HeaderMenuNew
          mapId={gameId}
          activeTabs={activeTabs}
          changeTab={changeTab}
          removeTab={removeTab}
        />
      </AppHeader>

      <AppShell.Main>
        <Center className={classes.container}>
          <div className={classes.fogLayer1} />
          <div className={classes.fogLayer2} />
          <div className={classes.fogLayer3} />

          <Surface
            pattern="grid"
            cornerAccents={true}
            className={classes.card}
            p="xl"
            style={{ maxWidth: 500 }}
          >
            <Stack className={classes.contentStack}>
              {requiresAuth ? (
                <IconCloudFog size={64} className={classes.fogIcon} />
              ) : (
                <IconLock size={64} className={classes.lockIcon} />
              )}

              <Title order={2} className={classes.title}>
                {requiresAuth ? "Fog of War" : "Access Restricted"}
              </Title>

              <Text size="lg" className={classes.description}>
                {requiresAuth
                  ? "This game is shrouded in Fog of War. Log in with Discord to reveal your view of the map."
                  : deniedMessage}
              </Text>

              {requiresAuth && (
                <Group justify="center" className={classes.loginGroup}>
                  <DiscordLogin />
                </Group>
              )}
            </Stack>
          </Surface>
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}
