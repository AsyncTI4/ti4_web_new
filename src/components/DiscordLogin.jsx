import { Button, Group, Text } from "@mantine/core";
import { useUser } from "../hooks/useUser";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import { config } from "../config";

export const getDiscordOauthUrl = () => {
  return import.meta.env.DEV
    ? "https://discord.com/oauth2/authorize?client_id=1286176779643654175&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flogin&scope=identify%20guilds%20guilds.members.read"
    : `https://discord.com/oauth2/authorize?client_id=1084164538053689464&response_type=code&redirect_uri=${config.api.websiteBase}login&scope=identify%20guilds%20guilds.members.read`;
};

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
