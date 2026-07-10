import { UnitStack } from "@/domains/map/components/UnitStack";
import { getColorAlias } from "@/entities/lookup/colors";
import { useFactionColors } from "@/hooks/useFactionColors";
import {
  useColorOverrides,
  useGameData,
  useMapReplay,
} from "@/hooks/useGameContext";
import classes from "./MapUnitTransitionLayer.module.css";
import { CommandCounter } from "@/domains/map/components/CommandCounter";
import { ControlToken } from "@/domains/map/components/ControlToken";

export function MapUnitTransitionLayer() {
  const mapReplay = useMapReplay();
  const { transitions, lasers } = mapReplay;
  const factionColorMap = useFactionColors();
  const lawsInPlay = useGameData()?.lawsInPlay;
  const { colorOverrides } = useColorOverrides();

  if (
    !mapReplay.active ||
    (transitions.length === 0 &&
      lasers.length === 0 &&
      mapReplay.commandTokens.length === 0 &&
      mapReplay.controlTokens.length === 0)
  )
    return null;

  return (
    <div className={classes.layer} aria-hidden="true">
      {mapReplay.commandTokens.map((token) => {
        const overrideColorAlias = colorOverrides[token.faction];
        const colorAlias = overrideColorAlias
          ? overrideColorAlias
          : getColorAlias(factionColorMap?.[token.faction]?.color);
        return (
          <div
            key={`${mapReplay.key}-command-${token.position}-${token.faction}-${token.index}`}
            className={
              token.kind === "activation"
                ? classes.commandTokenPlacement
                : token.kind === "added"
                  ? classes.commandTokenAdded
                  : classes.commandTokenRemoved
            }
            style={
              {
                left: token.x,
                top: token.y,
                "--command-delay": `${token.delayMs}ms`,
                "--command-duration": `${token.durationMs}ms`,
              } as React.CSSProperties
            }
          >
            <CommandCounter colorAlias={colorAlias} faction={token.faction} />
          </div>
        );
      })}
      {mapReplay.controlTokens.map((token) => {
        const overrideColorAlias = colorOverrides[token.faction];
        const colorAlias = overrideColorAlias
          ? overrideColorAlias
          : getColorAlias(factionColorMap?.[token.faction]?.color);
        return (
          <div
            key={`${mapReplay.key}-control-${token.position}-${token.planet}-${token.faction}-${token.kind}`}
            className={
              token.kind === "added"
                ? classes.commandTokenAdded
                : classes.commandTokenRemoved
            }
            style={
              {
                left: token.x,
                top: token.y,
                "--command-delay": `${token.delayMs}ms`,
                "--command-duration": `${token.durationMs}ms`,
              } as React.CSSProperties
            }
          >
            <ControlToken
              colorAlias={colorAlias}
              faction={token.faction}
              style={{ transform: "translate(-50%, -50%)" }}
            />
          </div>
        );
      })}
      {lasers.map((laser, index) => {
        const deltaX = laser.toX - laser.fromX;
        const deltaY = laser.toY - laser.fromY;
        const distance = Math.hypot(deltaX, deltaY);
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        return (
          <span
            key={`${mapReplay.key}-laser-${index}`}
            className={classes.laserPath}
            style={
              {
                left: laser.fromX,
                top: laser.fromY,
                width: distance,
                transform: `rotate(${angle}deg)`,
                "--laser-distance": `${distance}px`,
                "--laser-delay": `${laser.delayMs}ms`,
                "--laser-duration": `${laser.durationMs}ms`,
                "--laser-color":
                  laser.color === "attacker" ? "#67e8f9" : "#fb7185",
              } as React.CSSProperties
            }
          >
            <span className={classes.laserBolt} />
          </span>
        );
      })}
      {transitions.map((transition, index) => {
        const { stack } = transition;
        const overrideColorAlias = colorOverrides[stack.faction];
        const colorAlias = overrideColorAlias
          ? overrideColorAlias
          : getColorAlias(factionColorMap?.[stack.faction]?.color);

        return (
          <UnitStack
            key={`${mapReplay.key}-${transition.kind}-${stack.faction}-${stack.entityId}-${index}`}
            stack={stack}
            stackKey={`map-transition-${index}`}
            colorAlias={colorAlias}
            lawsInPlay={lawsInPlay}
            mapTransition={transition}
          />
        );
      })}
    </div>
  );
}
