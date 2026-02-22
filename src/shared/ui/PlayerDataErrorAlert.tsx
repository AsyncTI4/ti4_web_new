import { Alert, type AlertProps } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface PlayerDataErrorAlertProps
  extends Omit<AlertProps, "title" | "color" | "variant" | "icon"> {
  gameId: string;
  /**
   * Override the default message. Default: "Could not load player data for game {gameId}. Please try again later."
   */
  message?: string;
}

export function PlayerDataErrorAlert({
  gameId,
  message = `Could not load player data for game ${gameId}. Please try again later.`,
  ...alertProps
}: PlayerDataErrorAlertProps) {
  return (
    <Alert
      variant="light"
      color="red"
      title="Error loading player data"
      icon={<IconAlertCircle />}
      {...alertProps}
    >
      {message}
    </Alert>
  );
}
