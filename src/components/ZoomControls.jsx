import { Button, Group, Text } from "@mantine/core";
import { IconZoomCancel, IconZoomIn, IconZoomOut } from "@tabler/icons-react";

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onZoomReset }) {
  return (
    <Group className="zoomContainer" gap="xs">
      <Text>{zoom.toFixed(2) * 100}%</Text>
      <Button
        onClick={onZoomIn}
        size="compact-md"
        color="green"
        disabled={zoom >= 2}
      >
        <IconZoomIn size={18} />
      </Button>
      <Button
        onClick={onZoomOut}
        size="compact-md"
        color="red"
        disabled={zoom <= 0.5}
      >
        <IconZoomOut size={18} />
      </Button>
      <Button onClick={onZoomReset} size="compact-md">
        <IconZoomCancel size={18} />
      </Button>
    </Group>
  );
}
