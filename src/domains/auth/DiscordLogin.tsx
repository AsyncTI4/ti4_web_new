import { Button, Group, Text } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";
import { useUser } from "@/hooks/useUser";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import { config } from "@/config";
import cx from "clsx";
import hud from "@/shared/ui/hudChrome.module.css";

const DISCORD_CLIENT_ID = "1428383113158856724";

export const getDiscordOauthUrl = () =>
  `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(config.api.discordRedirectUri)}&scope=identify`;

type DiscordAuthButtonProps = Omit<ButtonProps, "component" | "href"> & {
  target?: string;
  rel?: string;
};

export function DiscordAuthButton({
  children,
  target,
  rel,
  ...buttonProps
}: DiscordAuthButtonProps) {
  return (
    <Button
      component="a"
      href={getDiscordOauthUrl()}
      target={target}
      rel={rel}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

export function DiscordLogin() {
  const { user, resetUser } = useUser();
  return (
    <>
      {!user?.authenticated ? (
        <DiscordAuthButton
          size="xs"
          variant="default"
          className={cx(hud.hudButton, hud.hudButtonDiscord)}
          leftSection={<IconBrandDiscordFilled size={14} />}
        >
          Discord Login
        </DiscordAuthButton>
      ) : undefined}
      {user?.authenticated ? (
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
      ) : undefined}
    </>
  );
}
