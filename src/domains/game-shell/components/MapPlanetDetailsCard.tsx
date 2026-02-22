import { PlanetDetailsCard } from "@/domains/player/components/PlanetDetailsCard";
import { usePlanet } from "@/hooks/usePlanet";
import {
  type MapLayout,
} from "@/domains/map/components/mapLayout";
import { MapTooltipPositioner } from "@/domains/map/components/MapTooltipPositioner";

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

  const planetTile = usePlanet(tooltipPlanet.planetId);

  return (
    <MapTooltipPositioner
      key="planet-tooltip"
      coords={tooltipPlanet.coords}
      mapPadding={mapPadding}
      mapZoom={mapZoom}
      mapLayout={mapLayout}
      zIndexVar="var(--z-map-planet-details)"
      applyBrowserScale
    >
      <PlanetDetailsCard
        planetId={tooltipPlanet.planetId}
        planetTile={planetTile}
      />
    </MapTooltipPositioner>
  );
}
