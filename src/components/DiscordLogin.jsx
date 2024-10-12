import { Button, Group, Text } from "@mantine/core";
import { useUser } from "../hooks/useUser";
import { IconBrandDiscordFilled } from "@tabler/icons-react";

export function DiscordLogin() {
  const { user, resetUser } = useUser();
  return (
    <>
      <a href="https://discord.com/oauth2/authorize?client_id=1286176779643654175&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flogin&scope=identify%20guilds%20guilds.members.read">
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
