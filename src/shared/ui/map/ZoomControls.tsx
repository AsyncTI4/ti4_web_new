import { Group, Text } from "@mantine/core";
import cx from "clsx";
import { useAppStore } from "@/state/appStore";
import classes from "./ZoomControls.module.css";
import {
  IconZoomCancel,
  IconZoomIn,
  IconZoomOut,
  IconScreenShare,
  IconScreenShareOff,
  IconFocusCentered,
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
};

function ZoomControls({
  zoomClass,
  hideFitToScreen = false,
  onFitBoard,
}: Props) {
  const zoom = useAppStore((state) => state.zoomLevel);
  const storeZoomFitToScreen = useAppStore((state) => state.zoomFitToScreen);
  const onZoomIn = useAppStore((state) => state.handleZoomIn);
  const onZoomOut = useAppStore((state) => state.handleZoomOut);
  const onZoomReset = useAppStore((state) => state.handleZoomReset);
  const onZoomScreenSize = useAppStore((state) => state.handleZoomScreenSize);

  const zoomFitToScreen = !hideFitToScreen && storeZoomFitToScreen;

  return (
    <Group className={zoomClass ?? "zoomContainer"} gap={6}>
      {!zoomFitToScreen && (
        <Text span className={classes.zoomLabel}>
          {Math.round(zoom * 100)}%
        </Text>
      )}
      <button
        type="button"
        aria-label="Zoom in"
        className={classes.zoomButton}
        onClick={onZoomIn}
        disabled={zoom >= 2 || zoomFitToScreen}
      >
        <IconZoomIn size={16} />
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        className={classes.zoomButton}
        onClick={onZoomOut}
        disabled={zoom <= 0.25 || zoomFitToScreen}
      >
        <IconZoomOut size={16} />
      </button>
      <button
        type="button"
        aria-label="Reset zoom"
        className={classes.zoomButton}
        onClick={onZoomReset}
      >
        <IconZoomCancel size={16} />
      </button>
      {onFitBoard && (
        <button
          type="button"
          aria-label="Fit board to screen"
          title="Fit board to screen"
          className={classes.zoomButton}
          onClick={onFitBoard}
        >
          <IconFocusCentered size={16} />
        </button>
      )}
      {!hideFitToScreen && (
        <button
          type="button"
          aria-label="Fit map to screen"
          className={cx(
            classes.zoomButton,
            zoomFitToScreen && classes.zoomButtonActive,
          )}
          onClick={onZoomScreenSize}
        >
          {zoomFitToScreen ? (
            <IconScreenShareOff size={16} />
          ) : (
            <IconScreenShare size={16} />
          )}
        </button>
      )}
    </Group>
  );
}

export default ZoomControls;
