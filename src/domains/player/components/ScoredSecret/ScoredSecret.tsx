import { useState } from "react";
import { getSecretObjectiveData } from "@/entities/lookup/secretObjectives";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { SecretObjectiveCard } from "@/domains/cards/components/SecretObjectiveCard";
import {
  ObjectGlyph,
  ObjectLabel,
  ObjectShell,
} from "@/domains/player/components/silhouettes/ObjectShell";
import styles from "./ScoredSecret.module.css";

type Props = {
  secretId: string;
  onClick?: () => void;
  variant?: "scored" | "unscored";
  showDetails?: boolean;
};

/** File-folder silhouette: a tab off the top-left edge, a hazard stripe down the spine. */
export function ScoredSecret({
  secretId,
  onClick,
  variant = "scored",
  showDetails = true,
}: Props) {
  const [opened, setOpened] = useState(false);
  const secretData = getSecretObjectiveData(secretId);
  const secretName = secretData?.name || secretId;
  const handleClick = () => {
    if (showDetails) setOpened((o) => !o);
    onClick?.();
  };

  const shell = (
    <ObjectShell
      className={styles.secret}
      state={variant === "scored" ? undefined : "unscored"}
      label={variant === "scored" ? secretName : `${secretName} (not scored)`}
      onClick={handleClick}
    >
      <ObjectGlyph src="/so_icon.png" />
      <ObjectLabel>{secretName}</ObjectLabel>
      {variant === "scored" && (
        <span className={styles.stamp} aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <path d="m2.5 6.4 2.3 2.2 4.7-5" />
          </svg>
        </span>
      )}
    </ObjectShell>
  );

  if (!showDetails) return shell;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>{shell}</SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <SecretObjectiveCard secretId={secretId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
