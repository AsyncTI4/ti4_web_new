import type { ReactNode } from "react";
import cx from "clsx";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import { DiscordAuthButton } from "./DiscordLogin";
import classes from "./AuthPrompt.module.css";

export type AuthPromptItem = { icon: ReactNode; label: string };

type Props = {
  title: string;
  body: string;
  kicker?: string;
  items?: AuthPromptItem[];
  error?: string;
  buttonLabel?: string;
  withBrand?: boolean;
  compact?: boolean;
};

export const AUTH_SCOPE_NOTE =
  "Discord shares your username and user ID with us. We can't read or post messages.";

/** Centred sign-in card used wherever a page needs a Discord account. */
export function AuthPrompt({
  title,
  body,
  kicker,
  items,
  error,
  buttonLabel = "Continue with Discord",
  withBrand = false,
  compact = false,
}: Props) {
  return (
    <div className={cx(classes.wrap, compact && classes.compact)}>
      <section className={classes.card} aria-label={title}>
        {withBrand && (
          <span className={classes.brand}>
            async<b>TI4</b>
          </span>
        )}
        {kicker && <span className={classes.kicker}>{kicker}</span>}
        <h1 className={classes.title}>{title}</h1>
        <p className={classes.body}>{body}</p>
        {items && items.length > 0 && (
          <ul className={classes.list}>
            {items.map((item) => (
              <li key={item.label}>
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        )}
        {error && (
          <div className={classes.error} role="alert">
            {error}
          </div>
        )}
        <DiscordAuthButton
          variant="filled"
          color="var(--ds-discord)"
          size={compact ? "md" : "lg"}
          className={classes.button}
          leftSection={<IconBrandDiscordFilled size={16} />}
        >
          {buttonLabel}
        </DiscordAuthButton>
        {!compact && <small className={classes.note}>{AUTH_SCOPE_NOTE}</small>}
      </section>
    </div>
  );
}
