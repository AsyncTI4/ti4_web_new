import { Button, Group, Text } from "@mantine/core";
import {
  IconZoomCancel,
  IconZoomIn,
  IconZoomOut,
  IconScreenShare,
  IconScreenShareOff,
} from "@tabler/icons-react";

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomScreenSize,
  zoomFitToScreen,
  zoomClass,
}) {
  return (
    <Group className={zoomClass ?? "zoomContainer"} gap="xs">
      {!zoomFitToScreen && <Text>{zoom.toFixed(2) * 100}%</Text>}
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
        disabled={zoom <= 0.5 || zoomFitToScreen}
      >
        <IconZoomOut size={18} />
      </Button>
      <Button onClick={onZoomReset} size="compact-md">
        <IconZoomCancel size={18} />
      </Button>
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
    </Group>
  );
}
