import { Box } from "@mantine/core";
import { PlanetDetailsCard } from "../PlayerArea/PlanetDetailsCard";
import { usePlanet } from "@/hooks/usePlanet";
import { useAppStore } from "@/utils/appStore";
import { getBrowserZoomScale } from "@/utils/zoom";
import {
  getMapLayoutConfig,
  mapCoordsToScreen,
  type MapLayout,
} from "./MapView/mapLayout";

type TooltipPlanet = {
  planetId: string;
  coords: { x: number; y: number };
};

type Props = {
  tooltipPlanet: TooltipPlanet | null;
  mapPadding?: number;
  mapZoom?: number;
  mapLayout?: MapLayout;
};

export function MapPlanetDetailsCard({
  tooltipPlanet,
  mapPadding,
  mapZoom,
  mapLayout = "panels",
}: Props) {
  if (!tooltipPlanet || !tooltipPlanet.planetId) return null;

  const zoom = mapZoom ?? useAppStore((state) => state.zoomLevel);
  const planetTile = usePlanet(tooltipPlanet.planetId);
  const resolvedPadding =
    mapPadding ?? getMapLayoutConfig(mapLayout).mapPadding;

  const browserScale = getBrowserZoomScale();
  const inverse = browserScale ? 1 / browserScale : 1;
  const { x, y } = mapCoordsToScreen(
    tooltipPlanet.coords,
    zoom,
    resolvedPadding
  );

  return (
    <Box
      key="planet-tooltip"
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y - 25}px`,
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
