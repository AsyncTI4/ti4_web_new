import { useEffect, useState } from "react";
import cx from "clsx";
import { APP_VERSION } from "@/shared/version";
import {
  buildBasicDebugReport,
  copyToClipboard,
} from "@/shared/debug/environmentReport";
import classes from "./VersionBadge.module.css";

type Props = {
  /** Builds the text copied on click; defaults to the environment-only report. */
  getReport?: () => string;
  /** Pins the badge to the bottom-left corner of the viewport. */
  floating?: boolean;
  className?: string;
};

type CopyState = "idle" | "copied" | "failed";

/** Shows the app version; clicking it copies a human-readable debug report. */
export function VersionBadge({ getReport, floating = false, className }: Props) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timeout = window.setTimeout(() => setCopyState("idle"), 2000);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const handleClick = async () => {
    try {
      const report = (getReport ?? buildBasicDebugReport)();
      await copyToClipboard(report);
      setCopyState("copied");
    } catch (error) {
      console.error("Failed to copy debug report", error);
      setCopyState("failed");
    }
  };

  const label =
    copyState === "copied"
      ? "Debug info copied"
      : copyState === "failed"
        ? "Copy failed"
        : `v${APP_VERSION}`;

  return (
    <button
      type="button"
      className={cx(classes.badge, floating && classes.floating, className)}
      onClick={() => void handleClick()}
      title="Copy debug info to clipboard"
      aria-label={`Version ${APP_VERSION}. Copy debug info to clipboard`}
      data-state={copyState}
    >
      {label}
    </button>
  );
}
