import { systems as baseSystems } from "./systems";
import { planets as basePlanets } from "./planets";
import {
  expandedFractureSystems,
  expandedFracturePlanets,
} from "./expandedFracture";

// Generated catalogs take precedence when they gain these definitions upstream.
const systemIds = new Set(baseSystems.map((system) => system.id));
const planetIds = new Set(basePlanets.map((planet) => planet.id));

export const systems = [
  ...baseSystems,
  ...expandedFractureSystems.filter((system) => !systemIds.has(system.id)),
];

export const planets = [
  ...basePlanets,
  ...expandedFracturePlanets.filter((planet) => !planetIds.has(planet.id)),
];
