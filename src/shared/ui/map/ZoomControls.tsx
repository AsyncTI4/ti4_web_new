import type { ReactNode } from "react";
import cx from "clsx";
import { useAppStore } from "@/state/appStore";
import classes from "./ZoomControls.module.css";
import {
  IconZoomCancel,
  IconZoomIn,
  IconZoomOut,
  IconScreenShare,
  IconScreenShareOff,
  IconMaximize,
} from "@tabler/icons-react";

type Props = {
  zoomClass?: string;
  hideFitToScreen?: boolean;
  /*
   * Fit the board to the viewport and recentre it. Distinct from the store's
   * `handleZoomScreenSize` toggle, which only flips a persisted boolean that
   * the image view reads — in the pannable map it computes nothing, which is why
   * that control is hidden there rather than reused.
   */
  onFitBoard?: () => void;
  /** Renders the buttons without their own frosted float, for embedding. */
  bare?: boolean;
  /** Extra controls seated after a separator, inside the same float. */
  trailing?: ReactNode;
};

const ICON = 15;

function ZoomButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(classes.zoomButton, active && classes.zoomButtonActive)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function ZoomControls({
  zoomClass,
  hideFitToScreen = false,
  onFitBoard,
  bare = false,
  trailing,
}: Props) {
  const zoom = useAppStore((state) => state.zoomLevel);
  const storeZoomFitToScreen = useAppStore((state) => state.zoomFitToScreen);
  const onZoomIn = useAppStore((state) => state.handleZoomIn);
  const onZoomOut = useAppStore((state) => state.handleZoomOut);
  const onZoomReset = useAppStore((state) => state.handleZoomReset);
  const onZoomScreenSize = useAppStore((state) => state.handleZoomScreenSize);

  const zoomFitToScreen = !hideFitToScreen && storeZoomFitToScreen;

  return (
    <div
      className={cx(
        zoomClass ?? "zoomContainer",
        classes.bar,
        !bare && classes.float,
      )}
    >
      {!zoomFitToScreen && (
        <span className={classes.zoomLabel}>{Math.round(zoom * 100)}%</span>
      )}
      <ZoomButton
        label="Zoom out"
        onClick={onZoomOut}
        disabled={zoom <= 0.25 || zoomFitToScreen}
      >
        <IconZoomOut size={ICON} />
      </ZoomButton>
      <ZoomButton
        label="Zoom in"
        onClick={onZoomIn}
        disabled={zoom >= 2 || zoomFitToScreen}
      >
        <IconZoomIn size={ICON} />
      </ZoomButton>
      <ZoomButton label="Reset zoom" onClick={onZoomReset}>
        <IconZoomCancel size={ICON} />
      </ZoomButton>
      {onFitBoard && (
        <ZoomButton label="Fit board to screen" onClick={onFitBoard}>
          <IconMaximize size={ICON} />
        </ZoomButton>
      )}
      {!hideFitToScreen && (
        <ZoomButton
          label="Fit map to screen"
          onClick={onZoomScreenSize}
          active={zoomFitToScreen}
        >
          {zoomFitToScreen ? (
            <IconScreenShareOff size={ICON} />
          ) : (
            <IconScreenShare size={ICON} />
          )}
        </ZoomButton>
      )}
      {trailing && (
        <>
          <span className={classes.sep} aria-hidden="true" />
          {trailing}
        </>
      )}
    </div>
  );
}

export default ZoomControls;
