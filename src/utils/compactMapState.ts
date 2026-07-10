import type {
  EntityData,
  PlanetEntityData,
  TileUnitData,
} from "@/entities/data/types";

type JsonArray = unknown[];

const ENTITY_TYPES: Record<string, EntityData["entityType"]> = {
  u: "unit",
  t: "token",
  a: "attachment",
  c: "actioncard",
};

function array(value: unknown, label: string): JsonArray {
  if (!Array.isArray(value)) throw new Error(`Invalid compact map ${label}`);
  return value;
}

function string(value: unknown, label: string): string {
  if (typeof value !== "string")
    throw new Error(`Invalid compact map ${label}`);
  return value;
}

function number(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid compact map ${label}`);
  }
  return value;
}

function nullableString(value: unknown, label: string): string | null {
  return value === null ? null : string(value, label);
}

function nullableNumber(value: unknown, label: string): number | null {
  return value === null ? null : number(value, label);
}

function decodeEntity(value: unknown): EntityData {
  const entity = array(value, "entity");
  const typeCode = string(entity[0], "entity type");
  const entityType = ENTITY_TYPES[typeCode];
  if (!entityType)
    throw new Error(`Unknown compact map entity type: ${typeCode}`);

  if (entityType === "unit") {
    const unitStates: [number, number, number, number] = [
      number(entity[2], "healthy unit count"),
      number(entity[3], "damaged unit count"),
      number(entity[4], "galvanized unit count"),
      number(entity[5], "damaged galvanized unit count"),
    ];
    const sustained = unitStates[1] + unitStates[3];
    return {
      entityType,
      entityId: string(entity[1], "entity id"),
      count: unitStates.reduce((total, count) => total + count, 0),
      sustained: sustained > 0 ? sustained : null,
      unitStates,
    };
  }
  return {
    entityType,
    entityId: string(entity[1], "entity id"),
    count: number(entity[2], "entity count"),
  };
}

function decodeEntityGroups(value: unknown): Record<string, EntityData[]> {
  return Object.fromEntries(
    array(value, "entity groups").map((rawGroup) => {
      const group = array(rawGroup, "entity group");
      return [
        string(group[0], "entity faction"),
        array(group[1], "entities").map(decodeEntity),
      ];
    }),
  );
}

function decodePlanet(value: unknown): [string, PlanetEntityData] {
  const planet = array(value, "planet");
  return [
    string(planet[0], "planet id"),
    {
      controlledBy: nullableString(planet[1], "planet controller"),
      commodities: nullableNumber(planet[2], "planet commodities"),
      planetaryShield: number(planet[3], "planet shield") === 1,
      exhausted: number(planet[4], "planet exhausted") === 1,
      resources: nullableNumber(planet[5], "planet resources"),
      influence: nullableNumber(planet[6], "planet influence"),
      entities: decodeEntityGroups(planet[7]),
    },
  ];
}

function decodeNumberMap(value: unknown): Record<string, number> {
  return Object.fromEntries(
    array(value, "number map").map((rawEntry) => {
      const entry = array(rawEntry, "number map entry");
      return [
        string(entry[0], "number map key"),
        number(entry[1], "number map value"),
      ];
    }),
  );
}

function decodeTile(value: unknown): [string, TileUnitData] {
  const tile = array(value, "tile");
  const pds = Object.fromEntries(
    array(tile[6], "PDS map").map((rawEntry) => {
      const entry = array(rawEntry, "PDS entry");
      return [
        string(entry[0], "PDS faction"),
        {
          count: number(entry[1], "PDS count"),
          expected: number(entry[2], "PDS expected hits"),
        },
      ];
    }),
  );

  return [
    string(tile[0], "tile position"),
    {
      anomaly: number(tile[1], "tile anomaly") === 1,
      space: decodeEntityGroups(tile[2]),
      planets: Object.fromEntries(array(tile[3], "planets").map(decodePlanet)),
      ccs: array(tile[4], "command counters").map((cc) =>
        string(cc, "command counter"),
      ),
      production: decodeNumberMap(tile[5]),
      pds: Object.keys(pds).length === 0 ? null : pds,
    },
  ];
}

/** Decode the versioned positional map-state format emitted by the bot. */
export function deserializeCompactMapState(
  serialized: string,
): Record<string, TileUnitData> {
  const root = array(JSON.parse(serialized), "root");
  if (root[0] !== 1) {
    throw new Error(`Unsupported compact map version: ${String(root[0])}`);
  }
  return Object.fromEntries(root.slice(1).map(decodeTile));
}
