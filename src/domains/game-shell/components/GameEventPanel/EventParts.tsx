import { useState } from "react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { prettifyId, resolveUnitName } from "./eventFormatting";
import { pluralize } from "./eventPayload";
import classes from "./GameEventPanel.module.css";

export function TypeBadge({ label, hue }: { label: string; hue: string }) {
  return (
    <span
      className={classes.badge}
      style={{ "--badge-hue": hue } as React.CSSProperties}
    >
      {label}
    </span>
  );
}

export function EventDescription({ children }: { children?: string }) {
  if (!children) return null;
  return <div className={classes.description}>{children}</div>;
}

export function Headline({
  title,
  meta,
  beforeTitle,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  beforeTitle?: React.ReactNode;
}) {
  return (
    <div className={classes.headline}>
      {meta && <div className={classes.metaLine}>{meta}</div>}
      <div className={classes.titleLine}>
        {beforeTitle}
        <span className={classes.primary}>{title}</span>
      </div>
    </div>
  );
}

export function EventPopover({
  children,
  details,
  buttonClassName = classes.cardEventButton,
}: {
  children: React.ReactNode;
  details: React.ReactNode;
  buttonClassName?: string;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <button
          type="button"
          className={buttonClassName}
          onClick={() => setOpened(true)}
        >
          {children}
        </button>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown>{details}</SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}

export function SubFaction({ faction }: { faction: string }) {
  if (!faction) return null;
  return (
    <span className={classes.subFaction}>
      <CircularFactionIcon faction={faction} size={13} />
      {prettifyId(faction)}
    </span>
  );
}

export function ProductionSummary({
  units,
  cost,
}: {
  units: Record<string, number> | null;
  cost: number | null;
}) {
  const breakdown =
    units && Object.keys(units).length > 0
      ? Object.entries(units)
          .map(([id, count]) => `${count}× ${resolveUnitName(id)}`)
          .join(", ")
      : null;
  return (
    <>
      {breakdown && <span>{breakdown}</span>}
      {typeof cost === "number" && (
        <span className={classes.subMuted}>
          {breakdown ? "· " : ""}
          {pluralize(cost, "resource")}
        </span>
      )}
    </>
  );
}
