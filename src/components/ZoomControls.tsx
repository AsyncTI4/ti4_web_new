import { Button, Group, Text } from "@mantine/core";
import { useAppStore } from "@/utils/appStore";
import {
  IconZoomCancel,
  IconZoomIn,
  IconZoomOut,
  IconScreenShare,
  IconScreenShareOff,
} from "@tabler/icons-react";

function ZoomControls() {
  const zoom = useAppStore((state) => state.zoomLevel);
  const zoomFitToScreen = useAppStore((state) => state.zoomFitToScreen);
  const onZoomIn = useAppStore((state) => state.handleZoomIn);
  const onZoomOut = useAppStore((state) => state.handleZoomOut);
  const onZoomReset = useAppStore((state) => state.handleZoomReset);
  const onZoomScreenSize = useAppStore((state) => state.handleZoomScreenSize);

  return (
    <Group className={"zoomContainer"} gap="xs">
      {!zoomFitToScreen && <Text>{Number(zoom.toFixed(2))  * 100}%</Text>}
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

export default ZoomControls;