export const SPLAY_OFFSET_X = 10;
export const SPLAY_OFFSET_Y = 10;

export const SPACE_HEAT_CONFIG = {
  maxHeat: 2000,
  planetDecayRate: 0.035,
  rimMaxHeat: 400,
  rimDecayRate: 0.08,
  unitHeat: 400,
  unitDecayRate: 0.055,
  factionRepulsionHeat: 600,
  factionDecayRate: 0.02,
  stackSizeMultiplier: 0.15,
} as const;

export const GROUND_HEAT_CONFIG = {
  maxHeat: 2000,
  planetDecayRate: 0.035,
  rimMaxHeat: 100,
  rimDecayRate: 0.06,
  unitHeat: 400,
  unitDecayRate: 0.08,
  factionRepulsionHeat: 500,
  factionDecayRate: 0.03,
  stackSizeMultiplier: 0.15,
} as const;

export const MAX_HEAT = SPACE_HEAT_CONFIG.maxHeat;

export const HEX_GRID_WIDTH = 345;
export const HEX_GRID_HEIGHT = 299;
export const HEX_GRID_SIZE = 30;
export const HEX_SQUARE_WIDTH = HEX_GRID_WIDTH / HEX_GRID_SIZE;
export const HEX_SQUARE_HEIGHT = HEX_GRID_HEIGHT / HEX_GRID_SIZE;

export const DEFAULT_PLANET_RADIUS = 60;
export const STATS_HEAT_OFFSET = 15;
export const STATS_HEAT_STACK_SIZE = 0.1;
export const FIGHTER_OFFSET_COLUMNS = 2;

export const HEX_VERTICES = [
  { x: 86.25, y: 0 },
  { x: 258.75, y: 0 },
  { x: 345, y: 149.5 },
  { x: 258.75, y: 299 },
  { x: 86.25, y: 299 },
  { x: 0, y: 149.5 },
];

export const entityIdPriority = [
  "ws",
  "fs",
  "dn",
  "ff",
  "ca",
  "cv",
  "dd",
  "ff",
  "gf",
  "mf",
  "sd",
  "pd",
];

export const entityZStackPriority = [
  "gf",
  "ff",
  "mf",
  "sd",
  "pd",
  "dd",
  "cv",
  "ca",
  "dn",
  "fs",
  "ws",
  "gledge_core",
  "sleeper",
  "custodiavigilia1",
  "custodiavigilia2",
  "mirage",
];
