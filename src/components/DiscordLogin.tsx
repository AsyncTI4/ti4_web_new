import { Button, Group, Text } from "@mantine/core";
import { useUser } from "../hooks/useUser";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import { config } from "../config";

const DISCORD_CLIENT_ID = "1428383113158856724";

export const getDiscordOauthUrl = () =>
  `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(config.api.discordRedirectUri)}&scope=identify`;

export function DiscordLogin() {
  const { user, resetUser } = useUser();
  return (
    <>
      <a href={getDiscordOauthUrl()}>
        {!user?.authenticated ? (
          <Button size="xs" leftSection={<IconBrandDiscordFilled />}>
            Discord Login
          </Button>
        ) : undefined}
      </a>
      {user?.authenticated ? (
        <Group>
          <Text size="xs">{user.name}</Text>
          <Button size="xs" onClick={resetUser}>
            Logout
          </Button>
        </Group>
      ) : undefined}
    </>
  );
}
