import { Button, Group, Text } from "@mantine/core";
import { useAppStore } from "@/utils/appStore";
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
    <Group className={zoomClass ?? "zoomContainer"} gap="xs">
      {!zoomFitToScreen && <Text>{Number(zoom.toFixed(2)) * 100}%</Text>}
      <Button
        onClick={onZoomIn}
        size="compact-md"
        color="green"
        disabled={zoom >= 2 || zoomFitToScreen}
      >
        <IconZoomIn size={18} />
      </Button>
      <Button
        onClick={onZoomOut}
        size="compact-md"
        color="red"
        disabled={zoom <= 0.25 || zoomFitToScreen}
      >
        <IconZoomOut size={18} />
      </Button>
      <Button onClick={onZoomReset} size="compact-md">
        <IconZoomCancel size={18} />
      </Button>
      {!hideFitToScreen && (
        <Button
          onClick={onZoomScreenSize}
          size="compact-md"
          color={zoomFitToScreen ? "red" : "purple"}
        >
          {zoomFitToScreen ? (
            <IconScreenShareOff size={18} />
          ) : (
            <IconScreenShare size={18} />
          )}
        </Button>
      )}
    </Group>
  );
}

export default ZoomControls;
