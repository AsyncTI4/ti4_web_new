import type { TilePlanet } from "@/app/providers/context/types";
import { DEFAULT_PLANET_RADIUS } from "./constants";
import {
  placeGroundEntityGroupsForTile,
  type GroundPlanetRequest,
} from "./groundGroupPlacement";
import {
  createPlacementFromCoords,
  tokenToEntityStack,
} from "./placementHelpers";
import type { EntityStack, EntityStackBase, Planet } from "./types";

type PreparedPlanet = {
  fixedPlacements: EntityStack[];
  groundRequest: GroundPlanetRequest;
};

const calculateAttachmentAngle = (
  index: number,
  totalAttachments: number,
): number => {
  const ATTACHMENT_ANGLE_STEP = 0.5;
  const startAngle = (-ATTACHMENT_ANGLE_STEP * (totalAttachments - 1)) / 2;
  return startAngle + index * ATTACHMENT_ANGLE_STEP;
};

export const placeAttachmentsOnRim = (
  planetX: number,
  planetY: number,
  planetRadius: number,
  attachmentEntities: EntityStackBase[],
): EntityStack[] => {
  if (attachmentEntities.length === 0) return [];

  return attachmentEntities.map((attachment, index) => {
    const angle =
      attachmentEntities.length === 1
        ? 0
        : calculateAttachmentAngle(index, attachmentEntities.length);
    return createPlacementFromCoords(
      planetX + planetRadius * Math.cos(angle),
      planetY + planetRadius * Math.sin(angle),
      attachment,
    );
  });
};

export function placePlanetEntitiesForTile(
  planets: Planet[],
  planetDataByName: Record<string, TilePlanet>,
): EntityStack[] {
  const preparedPlanets = planets.flatMap((planet) => {
    const planetData = planetDataByName[planet.name];
    return planetData ? [preparePlanet(planet, planetData)] : [];
  });
  const groundResult = placeGroundEntityGroupsForTile(
    preparedPlanets.map(({ groundRequest }) => groundRequest),
    planets,
  );

  return [
    ...preparedPlanets.flatMap(({ fixedPlacements }) => fixedPlacements),
    ...groundResult.placements,
  ];
}

function preparePlanet(planet: Planet, planetData: TilePlanet): PreparedPlanet {
  const controller = planetData.controlledBy ?? "neutral";
  const attachments = planetData.attachments.map((attachment) =>
    tokenToEntityStack(attachment, controller),
  );
  const tokens = planetData.tokens.map((token) =>
    tokenToEntityStack(token, controller),
  );
  const attachmentPlacements = placeAttachmentsOnRim(
    planet.x,
    planet.y,
    DEFAULT_PLANET_RADIUS,
    attachments,
  );
  const centerTokenPlacements = placeCenterTokens(planet, tokens);
  const fixedPlacements = [
    ...centerTokenPlacements,
    ...attachmentPlacements,
  ].map((placement) => ({ ...placement, planetName: planet.name }));
  return {
    fixedPlacements,
    groundRequest: {
      planet,
      factionEntities: planetData.unitsByFaction,
      fixedPlacements,
      controller: planetData.controlledBy ?? undefined,
    },
  };
}

function placeCenterTokens(
  planet: Planet,
  tokens: EntityStackBase[],
): EntityStack[] {
  const movableTokens = tokens.filter(
    ({ entityId }) => entityId !== "dmz_large",
  );

  return tokens.map((token) => {
    if (token.entityId === "dmz_large" || movableTokens.length <= 1) {
      return createPlacementFromCoords(planet.x, planet.y, token);
    }

    const index = movableTokens.findIndex(
      ({ entityId }) => entityId === token.entityId,
    );
    const angle = (index * 2 * Math.PI) / movableTokens.length;
    return createPlacementFromCoords(
      planet.x + 30 * Math.cos(angle),
      planet.y + 30 * Math.sin(angle),
      token,
    );
  });
}
