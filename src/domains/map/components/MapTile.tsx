import React from "react";
import { Tile } from "./Tile";
import classes from "./MapTile.module.css";
import { useSettingsStore, useAppStore } from "@/utils/appStore";
import { useGameData, useMapReplay } from "@/hooks/useGameContext";
import { UnitImagesLayer } from "./layers/UnitImagesLayer";
import { ControlTokensLayer } from "./layers/ControlTokensLayer";
import { PlanetCirclesLayer } from "./layers/PlanetCirclesLayer";
import { CommodityIndicatorsLayer } from "./layers/CommodityIndicatorsLayer";
import { SystemIndicatorsLayer } from "./layers/SystemIndicatorsLayer";
import { CommandCounterLayer } from "./layers/CommandCounterLayer";
import { PdsOverlayLayer } from "./layers/PdsOverlayLayer";
import { PlanetaryShieldOverlayLayer } from "./layers/PlanetaryShieldOverlayLayer";
import { AnomalyOverlay } from "./layers/AnomalyOverlay";
import { BorderAnomalyLayer } from "./layers/BorderAnomalyLayer";
import { TILE_HEIGHT, TILE_WIDTH } from "@/domains/map/model/mapgen/tilePositioning";
import { Tile as TileType } from "@/app/providers/context/types";
import { TechSkipIconsLayer } from "./layers/TechSkipIconsLayer";
import { AttachmentsLayer } from "./layers/AttachmentsLayer";
import { PlanetTraitIconsLayer } from "./layers/PlanetTraitIconsLayer";
import { WormholeBlockedLayer } from "./layers/WormholeBlockedLayer";
import { FactionColorOverlay } from "./FactionColorOverlay";
import { FactionControlBorderOverlay } from "./FactionControlBorderOverlay";
import { SystemHexTarget } from "./SystemHexTarget";
import { getTileById } from "@/domains/map/model/mapgen/systems";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { HEX_VERTICES } from "@/utils/unitPositioning";

const ACTIVATION_HEX_PATH = `${HEX_VERTICES.map(
  ({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`,
).join(" ")} Z`;

type Props = {
  mapTile: TileType;
  style?: React.CSSProperties;
  className?: string;
  onUnitMouseOver?: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void;
  onUnitMouseLeave?: () => void;
  onUnitSelect?: (faction: string) => void;
  onPlanetMouseEnter?: (planetId: string, x: number, y: number) => void;
  onPlanetMouseLeave?: () => void;
  controlOpenSides?: number[];
  embedded?: boolean; // Render as self-contained preview without map offsets
  isA11ySelected?: boolean; // Accessibility selection highlight
};

export const MapTile = React.memo<Props>(
  ({
    mapTile,
    style,
    className,
    onUnitMouseOver,
    onUnitMouseLeave,
    onUnitSelect,
    onPlanetMouseEnter,
    onPlanetMouseLeave,
    controlOpenSides,
    embedded = false,
    isA11ySelected = false,
  }) => {
    const gameData = useGameData();
    const mapReplay = useMapReplay();

    const ringPosition = mapTile.position;
    const systemId = mapTile.systemId;
    const position = {
      x: mapTile.properties.x,
      y: mapTile.properties.y,
    };
    const isSelected = useAppStore((state) => state.selectedArea);
    const techSkipsMode = useSettingsStore(
      (state) => state.settings.techSkipsMode
    );
    const overlaysEnabled = useSettingsStore(
      (state) => state.settings.overlaysEnabled
    );
    const planetTypesMode = useSettingsStore(
      (state) => state.settings.planetTypesMode
    );
    const attachmentsMode = useSettingsStore(
      (state) => state.settings.attachmentsMode
    );
    const isHovered = useAppStore((state) => state.hoveredTile);
    const pdsMode = useSettingsStore((state) => state.settings.showPDSLayer);
    const openSystemDossier = useAppStore((state) => state.openSystemDossier);

    /* Hyperlanes have nothing to report, and touch devices keep the map
       gesture-only. Hover feedback is pure CSS so the tile never re-renders
       under a moving cursor; the static-data lookup is memoized off the
       render path. */
    const isHyperlane = React.useMemo(
      () => !!getTileById(mapTile.systemId)?.isHyperlane,
      [mapTile.systemId]
    );
    const dossierEligible =
      !embedded &&
      !isMobileDevice() &&
      !isHyperlane;
    const handleDossierOpen = () =>
      openSystemDossier(mapTile.position, mapTile.systemId);

    const controllingFaction = mapTile.controlledBy;
    const showSystemHighlight =
      mapReplay.active &&
      ((mapReplay.showTacticalActivation &&
        mapReplay.tacticalTargetPosition === ringPosition) ||
        mapReplay.changedPositions.has(ringPosition));

    return (
      <div
        id={`tile-${ringPosition}`}
        className={`${classes.mapTile} ${className || ""} ${
          isSelected ? classes.selected : ""
        } ${isHovered ? classes.hovered : ""} ${
          isA11ySelected ? classes.selected : ""
        }`}
        style={{
          left: embedded ? 0 : `${position.x}px`,
          top: embedded ? 0 : `${position.y}px`,
          position: embedded ? "relative" : undefined,
          opacity: (() => {
            // If both tech skips and attachments modes are enabled, require both conditions
            if (techSkipsMode && attachmentsMode) {
              const hasTech = mapTile.hasTechSkips;
              const hasAttach = mapTile.hasAttachments;
              return (hasTech && hasAttach) ? 1.0 : 0.2;
            }

            // Tech skips mode takes priority (when attachments mode is off)
            if (techSkipsMode) {
              return mapTile.hasTechSkips ? 1.0 : 0.2;
            }

            // Attachments mode (when tech skips mode is off)
            if (attachmentsMode) {
              return mapTile.hasAttachments ? 1.0 : 0.2;
            }

            if (planetTypesMode) {
              return Object.values(mapTile.planets).length > 0 ? 1.0 : 0.2;
            }

            // PDS mode - dim tiles that don't have PDS
            if (pdsMode && gameData!.tilesWithPds) {
              return ringPosition && gameData!.tilesWithPds.has(ringPosition)
                ? 1.0
                : 0.2;
            }

            // Overlay mode - dim tiles without any controller/border
            if (overlaysEnabled && !controllingFaction) {
              return 0.7;
            }

            return 1;
          })(),
          ...style,
        }}
      >
        <div
          className={`${classes.tileContainer} ${
            dossierEligible ? classes.dossierEligible : ""
          }`}
        >
          <Tile
            systemId={systemId}
            className={classes.tile}
            data-map-tile-visual="true"
          />

          {dossierEligible && <SystemHexTarget onOpen={handleDossierOpen} />}

          <AnomalyOverlay
            show={mapTile.hasAnomaly}
            width={TILE_WIDTH}
            height={TILE_HEIGHT}
          />
          <BorderAnomalyLayer mapTile={mapTile} />
          {showSystemHighlight && (
            <svg
              key={`${mapReplay.key}-system-highlight`}
              className={classes.tacticalActivationGlow}
              viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
              aria-hidden="true"
            >
              <path d={ACTIVATION_HEX_PATH} />
            </svg>
          )}
          <PlanetCirclesLayer
            systemId={systemId}
            mapTile={mapTile}
            position={position}
            onPlanetMouseEnter={onPlanetMouseEnter}
            onPlanetMouseLeave={onPlanetMouseLeave}
            onPlanetClick={dossierEligible ? handleDossierOpen : undefined}
          />
          <PlanetaryShieldOverlayLayer systemId={systemId} mapTile={mapTile} />
          <WormholeBlockedLayer systemId={systemId} mapTile={mapTile} />
          {!techSkipsMode && !planetTypesMode && !attachmentsMode && (
            <>
              <ControlTokensLayer systemId={systemId} mapTile={mapTile} />
              <UnitImagesLayer
                systemId={systemId}
                mapTile={mapTile}
                position={position}
                onUnitMouseOver={onUnitMouseOver}
                onUnitMouseLeave={onUnitMouseLeave}
                onUnitSelect={onUnitSelect}
              />
            </>
          )}
          {techSkipsMode && (
            <TechSkipIconsLayer systemId={systemId} mapTile={mapTile} />
          )}
          {attachmentsMode && (
            <AttachmentsLayer systemId={systemId} mapTile={mapTile} />
          )}
          {planetTypesMode && (
            <PlanetTraitIconsLayer systemId={systemId} mapTile={mapTile} />
          )}
          <CommodityIndicatorsLayer systemId={systemId} mapTile={mapTile} />
          <SystemIndicatorsLayer
            systemId={systemId}
            highestProduction={mapTile.highestProduction}
            largestCapacity={mapTile.largestCapacity}
            hasBorderAnomaly={Boolean(mapTile.borderAnomalies?.length)}
          />
          <CommandCounterLayer
            systemId={systemId}
            position={mapTile.position}
            factions={mapTile.commandCounters}
          />
          <div className={classes.ringPosition}>
            {ringPosition}
          </div>

          {controllingFaction && overlaysEnabled && (
            <>
              <FactionColorOverlay
                faction={controllingFaction}
                opacity={0.15}
              />
              <FactionControlBorderOverlay
                faction={controllingFaction}
                openSides={controlOpenSides}
              />
            </>
          )}

          {pdsMode && (
            <PdsOverlayLayer
              ringPosition={ringPosition}
              dominantPdsFaction={gameData?.dominantPdsFaction}
              pdsByTile={gameData?.pdsByTile}
            />
          )}

        </div>
      </div>
    );
  }
);
