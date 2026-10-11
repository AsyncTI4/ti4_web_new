import type { ReactNode } from "react";
import cx from "clsx";
import classes from "./DashboardPage.module.css";

/** Flat data box with an engraved label and an optional mono readout. */
export function DashBox({
  label,
  meta,
  className,
  children,
}: {
  label: string;
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cx(classes.box, className)} aria-label={label}>
      <header className={classes.boxHead}>
        <span className={classes.label}>{label}</span>
        {meta != null && <span className={classes.boxMeta}>{meta}</span>}
      </header>
      {children}
    </section>
  );
}

/** Section title in display caps with a right-aligned mono note. */
export function SectionHead({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={classes.sectionHead}>
      <span className={classes.sectionTitle}>
        <h2 className={classes.cap}>{title}</h2>
        {children}
      </span>
      {meta != null && <span className={classes.meta}>{meta}</span>}
    </div>
  );
}
