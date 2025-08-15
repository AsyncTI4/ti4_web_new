import { Box } from "@mantine/core";
import { PlanetDetailsCard } from "../PlayerArea/PlanetDetailsCard";
const MAP_PADDING = 200;

import { usePlanet } from "@/hooks/usePlanet";

type TooltipPlanet = {
  planetId: string;
  coords: { x: number; y: number };
};

type Props = {
  tooltipPlanet: TooltipPlanet | null;
  zoom: number;
};

export function MapPlanetDetailsCard({ tooltipPlanet, zoom }: Props) {
  if (!tooltipPlanet || !tooltipPlanet.planetId) return null;

  const planetTile = usePlanet(tooltipPlanet.planetId);

  const scaledX = tooltipPlanet.coords.x * zoom;
  const scaledY = tooltipPlanet.coords.y * zoom;

  return (
    <Box
      key="planet-tooltip"
      style={{
        position: "absolute",
        left: `${scaledX + MAP_PADDING}px`,
        top: `${scaledY + MAP_PADDING - 25}px`,
        zIndex: 10000000,
        pointerEvents: "none",
        transform: "translate(-50%, -100%)",
      }}
    >
      <PlanetDetailsCard
        planetId={tooltipPlanet.planetId}
        planetTile={planetTile!}
      />
    </Box>
  );
}
