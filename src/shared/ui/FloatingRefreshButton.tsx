import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import cx from "clsx";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import hud from "./hudChrome.module.css";
import classes from "./FloatingRefreshButton.module.css";

/* Written out rather than picked off Mantine's ButtonProps, which does not carry
   onClick — that lives on the element props, so the Pick never typechecked. */
type FloatingRefreshButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  style?: CSSProperties;
};

/**
 * The prompt shown when the game socket drops. It was the last filled,
 * pill-radiused, brand-blue button in the product — a web control floating over
 * a machined board. It is now the deck's own plate wearing the alert hue, which
 * is how the rest of the system says "act on this".
 */
export function FloatingRefreshButton({
  label = "Refresh",
  style,
  ...buttonProps
}: FloatingRefreshButtonProps) {
  return (
    <Button
      variant="default"
      size="xs"
      className={cx(hud.hudButton, hud.hudButtonAlert, classes.floating)}
      leftSection={<IconRefresh size={13} />}
      style={style}
      {...buttonProps}
    >
      {label}
    </Button>
  );
}
