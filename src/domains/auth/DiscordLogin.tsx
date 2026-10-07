import { Button, Group, Text, type ButtonProps } from "@mantine/core";
import { useUser } from "@/api/auth/useUser";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import { config } from "@/config";
import cx from "clsx";
import hud from "@/shared/ui/hudChrome.module.css";

const DISCORD_CLIENT_ID = "1428383113158856724";

const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(config.api.discordRedirectUri)}&scope=identify`;

/** A link-styled button that starts the Discord OAuth flow. */
export function DiscordAuthButton(props: ButtonProps) {
  return <Button component="a" href={DISCORD_OAUTH_URL} {...props} />;
}

export function DiscordLogin() {
  const { user, resetUser } = useUser();

  if (!user?.authenticated) {
    return (
      <DiscordAuthButton
        size="xs"
        variant="default"
        className={cx(hud.hudButton, hud.hudButtonDiscord)}
        leftSection={<IconBrandDiscordFilled size={14} />}
      >
        Discord Login
      </DiscordAuthButton>
    );
  }

  return (
    <Group>
      <Text size="xs">{user.name}</Text>
      <Button
        size="xs"
        variant="default"
        className={hud.hudButton}
        onClick={resetUser}
      >
        Logout
      </Button>
    </Group>
  );
}
