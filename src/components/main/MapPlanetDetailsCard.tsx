import { Box } from "@mantine/core";
import { PlanetDetailsCard } from "../PlayerArea/PlanetDetailsCard";

type TooltipPlanet = {
  systemId: string;
  planetId: string;
  coords: { x: number; y: number };
};

type Props = {
  tooltipPlanet: TooltipPlanet | null;
  zoom: number;
  mapPadding: number;
  planetAttachments: Record<string, string[]>;
};

export function MapPlanetDetailsCard({
  tooltipPlanet,
  zoom,
  mapPadding,
  planetAttachments,
}: Props) {
  if (!tooltipPlanet || !tooltipPlanet.planetId) return null;

  const scaledX = tooltipPlanet.coords.x * zoom;
  const scaledY = tooltipPlanet.coords.y * zoom;

  const planetAttachmentIds = planetAttachments[tooltipPlanet.planetId] || [];

  return (
    <Box
      key="planet-tooltip"
      style={{
        position: "absolute",
        left: `${scaledX + mapPadding}px`,
        top: `${scaledY + mapPadding - 25}px`,
        zIndex: 10000000,
        pointerEvents: "none",
        transform: "translate(-50%, -100%)",
      }}
    >
      <PlanetDetailsCard
        planetId={tooltipPlanet.planetId}
        attachments={planetAttachmentIds}
      />
    </Box>
  );
}
