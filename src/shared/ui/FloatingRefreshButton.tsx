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
 * pill-radiused, brand-blue button in the product — a web control floating over a
 * machined board — and it is now the same plate as every other action.
 *
 * `loading` deliberately does not become Mantine's `loading` prop: that slides the
 * label out of the plate behind a blurred wash, which at 28px reads as the button
 * breaking rather than as work in flight. The glyph turns instead, and the plate
 * goes quiet because it is genuinely not pressable until the attempt resolves.
 */
export function FloatingRefreshButton({
  label = "Refresh",
  loading = false,
  disabled = false,
  style,
  onClick,
}: FloatingRefreshButtonProps) {
  return (
    <div className={classes.anchor}>
      <Button
        variant="default"
        size="xs"
        className={cx(hud.hudButton, hud.hudButtonFloating)}
        leftSection={
          <IconRefresh
            size={13}
            className={loading ? hud.hudButtonSpin : undefined}
          />
        }
        disabled={disabled || loading}
        onClick={onClick}
        style={style}
      >
        {label}
      </Button>
    </div>
  );
}
