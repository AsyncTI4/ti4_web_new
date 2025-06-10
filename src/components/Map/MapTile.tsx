import React from "react";
import { Tile } from "./Tile";
import { UnitStack } from "./UnitStack";
import { ControlToken } from "./ControlToken";
import { CommandCounterStack } from "./CommandCounterStack";
import { getAllEntityPlacementsForTile } from "../../utils/unitPositioning";
import { getColorAlias } from "@/lookup/colors";
import { getPlanetCoordsBySystemId } from "@/lookup/planets";
import classes from "./MapTile.module.css";
import { TileUnitData } from "@/data/types";

type Props = {
  systemId: string;
  position: { x: number; y: number };
  ringPosition: string;
  tileUnitData?: TileUnitData;
  factionToColor: Record<string, string>;
  style?: React.CSSProperties;
  className?: string;
  onTileSelect?: (systemId: string) => void;
  onTileHover?: (systemId: string, isHovered: boolean) => void;
  onUnitMouseOver?: (
    faction: string,
    unitId: string,
    x: number,
    y: number
  ) => void;
  onUnitMouseLeave?: () => void;
  onUnitSelect?: (faction: string) => void;
  onPlanetHover?: (
    systemId: string,
    planetId: string,
    x: number,
    y: number
  ) => void;
  onPlanetMouseLeave?: () => void;
  isSelected?: boolean;
  isHovered?: boolean;
};

export const MapTile = React.memo<Props>(
  ({
    systemId,
    position,
    tileUnitData,
    factionToColor,
    style,
    className,
    onTileSelect,
    onTileHover,
    onUnitMouseOver,
    onUnitMouseLeave,
    onUnitSelect,
    onPlanetHover,
    onPlanetMouseLeave,
    isSelected,
    isHovered,
    ringPosition,
  }) => {
    const hoverTimeoutRef = React.useRef<Record<string, number>>({});

    const handlePlanetMouseEnter = React.useCallback(
      (planetId: string, x: number, y: number) => {
        if (!onPlanetHover) return;

        hoverTimeoutRef.current[planetId] = setTimeout(() => {
          // Convert relative planet position to world coordinates
          const worldX = position.x + x;
          const worldY = position.y + y;
          onPlanetHover(systemId, planetId, worldX, worldY);
        }, 1000);
      },
      [systemId, onPlanetHover, position.x, position.y]
    );

    const handlePlanetMouseLeave = React.useCallback(
      (planetId: string) => {
        if (hoverTimeoutRef.current[planetId]) {
          clearTimeout(hoverTimeoutRef.current[planetId]);
          delete hoverTimeoutRef.current[planetId];
        }
        if (onPlanetMouseLeave) {
          onPlanetMouseLeave();
        }
      },
      [onPlanetMouseLeave]
    );

    // Cleanup timeouts on unmount
    React.useEffect(() => {
      return () => {
        Object.values(hoverTimeoutRef.current).forEach(clearTimeout);
      };
    }, []);

    const unitImages: React.ReactElement[] = React.useMemo(() => {
      const allEntityPlacements = getAllEntityPlacementsForTile(
        systemId,
        tileUnitData
      );

      return Object.entries(allEntityPlacements).flatMap(([key, stack]) => {
        return [
          <UnitStack
            key={`${systemId}-${key}-stack`}
            unitType={stack.entityId}
            colorAlias={getColorAlias(factionToColor[stack.faction])}
            faction={stack.faction}
            count={stack.count}
            x={stack.x}
            y={stack.y}
            stackKey={key}
            entityType={stack.entityType}
            onUnitMouseOver={
              onUnitMouseOver
                ? () => {
                    // Convert relative unit position to world coordinates
                    const worldX = position.x + stack.x;
                    const worldY = position.y + stack.y;
                    onUnitMouseOver(
                      stack.faction,
                      stack.entityId,
                      worldX,
                      worldY
                    );
                  }
                : undefined
            }
            onUnitMouseLeave={
              onUnitMouseLeave ? () => onUnitMouseLeave() : undefined
            }
            onUnitSelect={
              onUnitSelect ? () => onUnitSelect(stack.faction) : undefined
            }
          />,
        ];
      });
    }, [
      systemId,
      tileUnitData,
      factionToColor,
      onUnitMouseOver,
      onUnitMouseLeave,
      onUnitSelect,
    ]);

    const controlTokens: React.ReactElement[] = React.useMemo(() => {
      if (!tileUnitData?.planets) {
        return [];
      }

      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return Object.entries(tileUnitData.planets).flatMap(
        ([planetId, planetData]) => {
          if (!planetData.controlledBy || !planetCoords[planetId]) return [];
          const [x, y] = planetCoords[planetId].split(",").map(Number);
          const colorAlias = getColorAlias(
            factionToColor[planetData.controlledBy]
          );

          return [
            <ControlToken
              key={`${systemId}-${planetId}-control`}
              colorAlias={colorAlias}
              faction={planetData.controlledBy}
              style={{
                position: "absolute",
                left: `${x - 10}px`,
                top: `${y + 15}px`, // 20px offset downward
                transform: "translate(-50%, -50%)",
              }}
            />,
          ];
        }
      );
    }, [systemId, tileUnitData, factionToColor]);

    const planetCircles: React.ReactElement[] = React.useMemo(() => {
      if (!tileUnitData?.planets) {
        return [];
      }

      const planetCoords = getPlanetCoordsBySystemId(systemId);

      return Object.entries(tileUnitData.planets).flatMap(([planetId, _]) => {
        if (!planetCoords[planetId]) return [];
        const [x, y] = planetCoords[planetId].split(",").map(Number);

        return [
          <div
            key={`${systemId}-${planetId}-circle`}
            className={classes.planetCircle}
            style={{
              left: `${x}px`,
              top: `${y}px`,
            }}
            onMouseEnter={() => handlePlanetMouseEnter(planetId, x, y)}
            onMouseLeave={() => handlePlanetMouseLeave(planetId)}
          />,
        ];
      });
    }, [
      systemId,
      tileUnitData,
      handlePlanetMouseEnter,
      handlePlanetMouseLeave,
    ]);

    const commandCounterStack: React.ReactElement | null = React.useMemo(() => {
      if (!tileUnitData?.ccs || tileUnitData.ccs.length === 0) {
        return null;
      }

      return (
        <CommandCounterStack
          key={`${systemId}-command-stack`}
          factions={tileUnitData.ccs}
          factionToColor={factionToColor}
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
          }}
        />
      );
    }, [systemId, tileUnitData, factionToColor]);

    return (
      <div
        className={`${classes.mapTile} ${className || ""} ${
          isSelected ? classes.selected : ""
        } ${isHovered ? classes.hovered : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          ...style,
        }}
        onClick={onTileSelect ? () => onTileSelect(systemId) : undefined}
        onMouseEnter={
          onTileHover ? () => onTileHover(systemId, true) : undefined
        }
        onMouseLeave={
          onTileHover ? () => onTileHover(systemId, false) : undefined
        }
      >
        <div className={classes.tileContainer}>
          <Tile systemId={systemId} className={classes.tile} />
          {planetCircles}
          {controlTokens}
          {unitImages}
          {commandCounterStack}
          <div className={classes.ringPosition}>{ringPosition}</div>
        </div>
      </div>
    );
  }
);
