import { Box } from "@mantine/core";
import { PlanetDetailsCard } from "../PlayerArea/PlanetDetailsCard";
const MAP_PADDING = 200;

import { usePlanet } from "@/hooks/usePlanet";
import { useAppStore } from "@/utils/appStore";
import { getBrowserZoomScale } from "@/utils/zoom";

type TooltipPlanet = {
  planetId: string;
  coords: { x: number; y: number };
};

type Props = {
  tooltipPlanet: TooltipPlanet | null;
};

export function MapPlanetDetailsCard({ tooltipPlanet }: Props) {
  if (!tooltipPlanet || !tooltipPlanet.planetId) return null;

  const zoom = useAppStore((state) => state.zoomLevel);
  const planetTile = usePlanet(tooltipPlanet.planetId);

  const browserScale = getBrowserZoomScale();
  const inverse = browserScale ? 1 / browserScale : 1;
  const scaledX = tooltipPlanet.coords.x * zoom;
  const scaledY = tooltipPlanet.coords.y * zoom;

  return (
    <Box
      key="planet-tooltip"
      style={{
        position: "absolute",
        left: `${scaledX + MAP_PADDING}px`,
        top: `${scaledY + MAP_PADDING - 25}px`,
        zIndex: "var(--z-map-planet-details)",
        pointerEvents: "none",
        transform: `translate(-50%, -100%) scale(${inverse})`,
        transformOrigin: "top left",
      }}
    >
      <PlanetDetailsCard
        planetId={tooltipPlanet.planetId}
        planetTile={planetTile}
      />
    </Box>
  );
}
