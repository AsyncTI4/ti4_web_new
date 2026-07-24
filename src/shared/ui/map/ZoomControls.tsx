import { Group, Text } from "@mantine/core";
import cx from "clsx";
import { useAppStore } from "@/utils/appStore";
import classes from "./ZoomControls.module.css";
import {
  IconZoomCancel,
  IconZoomIn,
  IconZoomOut,
  IconScreenShare,
  IconScreenShareOff,
} from "@tabler/icons-react";

type Props = {
  zoomClass?: string;
  // Back-compat props for legacy MapUI/ScrollMap
  zoom?: number;
  zoomFitToScreen?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onZoomScreenSize?: () => void;
  hideFitToScreen?: boolean;
};

function ZoomControls({
  zoomClass,
  zoom: zoomProp,
  zoomFitToScreen: zoomFitToScreenProp,
  onZoomIn: onZoomInProp,
  onZoomOut: onZoomOutProp,
  onZoomReset: onZoomResetProp,
  onZoomScreenSize: onZoomScreenSizeProp,
  hideFitToScreen = false,
}: Props) {
  // Store values (used by new MapView)
  const storeZoom = useAppStore((state) => state.zoomLevel);
  const storeZoomFitToScreen = useAppStore((state) => state.zoomFitToScreen);
  const storeOnZoomIn = useAppStore((state) => state.handleZoomIn);
  const storeOnZoomOut = useAppStore((state) => state.handleZoomOut);
  const storeOnZoomReset = useAppStore((state) => state.handleZoomReset);
  const storeOnZoomScreenSize = useAppStore(
    (state) => state.handleZoomScreenSize
  );

  // Prefer explicit props when provided (legacy), otherwise fall back to store
  const zoom = typeof zoomProp === "number" ? zoomProp : storeZoom;
  // When hidden, treat fit-to-screen as off for control rendering
  const zoomFitToScreen = hideFitToScreen
    ? false
    : typeof zoomFitToScreenProp === "boolean"
      ? zoomFitToScreenProp
      : storeZoomFitToScreen;
  const onZoomIn = onZoomInProp ?? storeOnZoomIn;
  const onZoomOut = onZoomOutProp ?? storeOnZoomOut;
  const onZoomReset = onZoomResetProp ?? storeOnZoomReset;
  const onZoomScreenSize = onZoomScreenSizeProp ?? storeOnZoomScreenSize;

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
