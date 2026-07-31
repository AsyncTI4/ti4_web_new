import {
  PLANET_INFO_OFFSET,
  PLANET_NAME_HALF_WIDTH,
  PLANET_NAME_INSET,
} from "./constants";
import { getResourcesLocationAngle } from "./coordinateUtils";
import type { Bounds, GroundPlanetRequest, Point } from "./groundLayoutTypes";
import {
  getRenderedStackFootprint,
  type RenderedFootprint,
} from "@/entities/renderedStackGeometry";
import type { EntityStack, Planet } from "./types";

const INFO_SIZE = 34;
const INFO_CLEARANCE = 2;

export function createFixedBounds(request: GroundPlanetRequest): Bounds[] {
  return request.fixedPlacements.map(createStackBounds);
}

export function createReservedBounds(planet: Planet): Bounds[] {
  if (!planet.resourcesLocation) return [];

  const vertical = planet.resourcesLocation.startsWith("Top") ? -1 : 1;
  const outerY = planet.y + (planet.radius + PLANET_INFO_OFFSET) * vertical;
  const label = {
    left: planet.x - PLANET_NAME_HALF_WIDTH - INFO_CLEARANCE,
    right: planet.x + PLANET_NAME_HALF_WIDTH + INFO_CLEARANCE,
    top:
      Math.min(outerY, outerY - PLANET_NAME_INSET * vertical) - INFO_CLEARANCE,
    bottom:
      Math.max(outerY, outerY - PLANET_NAME_INSET * vertical) + INFO_CLEARANCE,
  };
  const statsAngle = getResourcesLocationAngle(planet.resourcesLocation);
  const statsDistance = planet.radius + PLANET_INFO_OFFSET;
  const stats = createBounds(
    {
      x: planet.x + statsDistance * Math.cos(statsAngle),
      y: planet.y + statsDistance * Math.sin(statsAngle),
    },
    centeredFootprint(
      INFO_SIZE + INFO_CLEARANCE * 2,
      INFO_SIZE + INFO_CLEARANCE * 2,
    ),
  );

  return [label, stats];
}

export function createStackBounds(stack: EntityStack): Bounds {
  return createBounds(stack, getRenderedStackFootprint(stack));
}

export function createBounds(
  point: Point,
  footprint: RenderedFootprint,
): Bounds {
  return {
    left: point.x + footprint.left,
    right: point.x + footprint.right,
    top: point.y + footprint.top,
    bottom: point.y + footprint.bottom,
  };
}

export function centeredFootprint(
  width: number,
  height: number,
): RenderedFootprint {
  return {
    left: -width / 2,
    right: width / 2,
    top: -height / 2,
    bottom: height / 2,
    width,
    height,
  };
}

export function calculateOverflow(bounds: Bounds, planet: Planet): number {
  return Math.max(
    0,
    distance({ x: bounds.left, y: bounds.top }, planet) - planet.radius,
    distance({ x: bounds.right, y: bounds.top }, planet) - planet.radius,
    distance({ x: bounds.left, y: bounds.bottom }, planet) - planet.radius,
    distance({ x: bounds.right, y: bounds.bottom }, planet) - planet.radius,
  );
}

export function isTowardLabel(point: Point, planet: Planet): boolean {
  if (!planet.resourcesLocation) return false;

  const vertical = planet.resourcesLocation.startsWith("Top") ? -1 : 1;
  const horizontal = planet.resourcesLocation.endsWith("Left") ? -1 : 1;
  return (
    (point.x - planet.x) * horizontal + (point.y - planet.y) * vertical > 0
  );
}

export function unionBounds(bounds: Bounds[]): Bounds {
  let left = bounds[0].left;
  let right = bounds[0].right;
  let top = bounds[0].top;
  let bottom = bounds[0].bottom;

  for (let index = 1; index < bounds.length; index++) {
    left = Math.min(left, bounds[index].left);
    right = Math.max(right, bounds[index].right);
    top = Math.min(top, bounds[index].top);
    bottom = Math.max(bottom, bounds[index].bottom);
  }

  return { left, right, top, bottom };
}

export function centerOf(bounds: Bounds): Point {
  return {
    x: (bounds.left + bounds.right) / 2,
    y: (bounds.top + bounds.bottom) / 2,
  };
}

export function intersectionArea(first: Bounds, second: Bounds): number {
  const width = Math.max(
    0,
    Math.min(first.right, second.right) - Math.max(first.left, second.left),
  );
  const height = Math.max(
    0,
    Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top),
  );
  return width * height;
}

export function area(value: Bounds | RenderedFootprint): number {
  return (value.right - value.left) * (value.bottom - value.top);
}

export function distance(first: Point, second: Point): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

export function squaredDistance(first: Point, second: Point): number {
  return (first.x - second.x) ** 2 + (first.y - second.y) ** 2;
}
