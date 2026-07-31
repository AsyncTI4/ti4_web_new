export const DEFAULT_PLANET_RADIUS = 60;

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
  rimClearance: {
    unit: 0,
    // Tokens paint around their anchor; keep that footprint inside one system.
    token: DEFAULT_PLANET_RADIUS,
    attachment: 0,
    actioncard: 0,
  },
} as const;

export const MAX_HEAT = SPACE_HEAT_CONFIG.maxHeat;

export const HEX_GRID_WIDTH = 345;
export const HEX_GRID_HEIGHT = 299;
export const HEX_GRID_SIZE = 30;
export const HEX_SQUARE_WIDTH = HEX_GRID_WIDTH / HEX_GRID_SIZE;
export const HEX_SQUARE_HEIGHT = HEX_GRID_HEIGHT / HEX_GRID_SIZE;

export const PLANET_INFO_OFFSET = 15;
export const PLANET_INFO_HEAT_STACK_SIZE = 0.1;
export const PLANET_NAME_HALF_WIDTH = 45;
export const PLANET_NAME_INSET = 25;
export const SPACE_PLANET_NAME_HEAT_STRENGTH = 0.15;
export const INFANTRY_BADGE_CLEARANCE = 24;
export const FIGHTER_OFFSET_COLUMNS = 2;
export const PRODUCTION_INDICATOR_SIZE = 48;
export const CAPACITY_INDICATOR_WIDTH = 44;
export const CAPACITY_INDICATOR_HEIGHT = 52;
export const CROWDED_RIM_INDICATOR_INSET = 14;
export const INDICATOR_DIAGONAL_OFFSET_X = 24;
export const INDICATOR_VERTICAL_OFFSET_Y = 50;

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
