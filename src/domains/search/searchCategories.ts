import type { GameData, Tile } from "@/entities/game/types";
import type { PlayerData } from "@/entities/data/types";
import { getPlanetData } from "@/entities/lookup/planets";
import { getTileById } from "@/entities/lookup/systems";
import { getTokenData } from "@/entities/lookup/tokens";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getGenericUnitDataByAsyncId } from "@/entities/lookup/units";
import { mergePlanetTraits } from "@/entities/game/planetTraits";
import { searchKey, type SearchKey } from "./searchKeys";
import type { CategoryKind, SearchEntry } from "./searchIndex";
import { toTerms } from "./searchText";

type Category = {
  kind: CategoryKind;
  label: string;
  terms: string[];
  targets: Set<SearchKey>;
  /** What the detail line counts, e.g. "4 systems". */
  noun: string;
  counted: Set<string>;
};

type CategoryInput = {
  id: string;
  kind: CategoryKind;
  label: string;
  terms: string[];
  noun: "system" | "planet";
};

/**
 * Collects category results as the board is walked: each category is created
 * on first sight and gathers every system or planet that belongs to it, so a
 * category with nothing on the board never appears.
 */
function createCategories() {
  const categories = new Map<string, Category>();

  return {
    add: (input: CategoryInput, target: SearchKey, counted: string) => {
      const existing = categories.get(input.id);
      const category = existing ?? {
        ...input,
        targets: new Set<SearchKey>(),
        counted: new Set<string>(),
      };
      category.targets.add(target);
      category.counted.add(counted);
      if (!existing) categories.set(input.id, category);
    },
    entries: (): SearchEntry[] =>
      [...categories.entries()].map(([id, category]) => {
        const count = category.counted.size;
        return {
          id: `category:${id}`,
          kind: category.kind,
          label: category.label,
          detail: `${count} ${category.noun}${count === 1 ? "" : "s"}`,
          terms: toTerms([category.label, ...category.terms]),
          targets: [...category.targets],
          boardOnly: category.kind === "unit",
        };
      }),
  };
}

type Categories = ReturnType<typeof createCategories>;

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const ANOMALY_LABELS: Record<string, string> = {
  asteroids: "Asteroid field",
  nova: "Supernova",
  nebula: "Nebula",
  rift: "Gravity rift",
  scar: "Entropic scar",
};

const ANOMALY_TERMS: Record<string, string[]> = {
  asteroids: ["asteroids", "asteroid"],
  nova: ["nova"],
  nebula: [],
  rift: ["rift"],
  scar: ["scar"],
};

const TECH_SPECIALTIES = ["biotic", "cybernetic", "propulsion", "warfare"];

/** Generic unit names; a faction's own unit name would mislabel the type. */
const UNIT_NAMES: Record<string, string> = {
  ws: "War sun",
  fs: "Flagship",
  dn: "Dreadnought",
  ca: "Cruiser",
  cv: "Carrier",
  dd: "Destroyer",
  ff: "Fighter",
  gf: "Infantry",
  mf: "Mech",
  pd: "PDS",
  sd: "Space dock",
};

const UNIT_TERMS: Record<string, string[]> = {
  gf: ["ground force", "ground forces"],
  sd: ["dock"],
  ws: ["warsun"],
};

/** Wormhole, anomaly and other systems-level facts, from the tile and its tokens. */
function addSystemCategories(categories: Categories, tile: Tile) {
  const tileData = getTileById(tile.systemId);
  if (!tileData || tileData.isHyperlane) return;

  const system = searchKey("system", tile.position);
  const add = (input: Omit<CategoryInput, "noun">) =>
    categories.add({ ...input, noun: "system" }, system, tile.position);

  const tokens = tile.tokens.map((tokenId) => ({
    tokenId,
    data: getTokenData(tokenId),
  }));

  const tokenWormholes = tokens.flatMap(({ data }) => data?.wormholes ?? []);
  const wormholes = new Set(
    [...(tileData.wormholes ?? []), ...tokenWormholes]
      .filter((type): type is string => !!type)
      .map((type) => type.toLowerCase()),
  );
  wormholes.forEach((type) =>
    add({
      id: `wormhole:${type}`,
      kind: "token",
      label: `${capitalize(type)} wormhole`,
      terms: [type],
    }),
  );
  if (wormholes.size > 0) {
    add({ id: "wormhole", kind: "token", label: "Wormhole", terms: ["wormholes"] });
  }
  if (tokenWormholes.length > 0) {
    add({
      id: "wormhole-token",
      kind: "token",
      label: "Wormhole token",
      terms: ["wormhole tokens"],
    });
  }

  tokens.forEach(({ tokenId }) => {
    if (tokenId === "frontier") {
      add({ id: "frontier", kind: "token", label: "Frontier token", terms: ["frontier"] });
    }
    if (tokenId === "ingress") {
      add({ id: "ingress", kind: "token", label: "Ingress token", terms: ["ingress"] });
    }
  });

  const anomalies = new Set<string>();
  if (tileData.isAsteroidField) anomalies.add("asteroids");
  if (tileData.isSupernova) anomalies.add("nova");
  if (tileData.isNebula) anomalies.add("nebula");
  if (tileData.isGravityRift) anomalies.add("rift");
  if (tileData.isScar) anomalies.add("scar");
  tokens.forEach(({ data }) => {
    if (data?.isAsteroids) anomalies.add("asteroids");
    if (data?.isNova) anomalies.add("nova");
    if (data?.isNebula) anomalies.add("nebula");
    if (data?.isRift) anomalies.add("rift");
    if (data?.isScar) anomalies.add("scar");
  });

  anomalies.forEach((type) =>
    add({
      id: `anomaly:${type}`,
      kind: "anomaly",
      label: ANOMALY_LABELS[type],
      terms: ANOMALY_TERMS[type],
    }),
  );
  const tokenAnomaly = tokens.some(({ data }) => data?.isAnomaly);
  if (anomalies.size > 0 || tile.hasAnomaly || tokenAnomaly) {
    add({ id: "anomaly", kind: "anomaly", label: "Anomaly", terms: ["anomalies"] });
  }
}

/**
 * Units by type. A unit on a planet points at the planet, one in space at the
 * system, so a PDS search rings the planet it actually sits on.
 */
function addUnitCategories(categories: Categories, tile: Tile) {
  const addUnits = (
    unitsByFaction: Tile["unitsByFaction"],
    target: SearchKey,
  ) =>
    Object.values(unitsByFaction).forEach((entities) =>
      entities.forEach(({ entityId }) => {
        const name =
          UNIT_NAMES[entityId] ??
          getGenericUnitDataByAsyncId(entityId)?.name ??
          entityId;
        categories.add(
          {
            id: `unit:${entityId}`,
            kind: "unit",
            label: name,
            terms: [entityId, `${name}s`, ...(UNIT_TERMS[entityId] ?? [])],
            noun: "system",
          },
          target,
          tile.position,
        );
      }),
    );

  addUnits(tile.unitsByFaction, searchKey("system", tile.position));
  Object.entries(tile.planets).forEach(([planetId, planet]) =>
    addUnits(planet.unitsByFaction, searchKey("planet", planetId)),
  );
}

/** Planet traits, tech specialties and attachments, with attachments counted in. */
function addPlanetCategories(
  categories: Categories,
  gameData: GameData,
  planetId: string,
) {
  const planet = getPlanetData(planetId);
  if (!planet) return;

  const target = searchKey("planet", planetId);
  const add = (input: Omit<CategoryInput, "noun">) =>
    categories.add({ ...input, noun: "planet" }, target, planetId);

  const attachments = gameData.planetIdToPlanetTile[planetId]?.attachments ?? [];
  const attachmentData = attachments.map((id) => ({
    id,
    data: getAttachmentData(id),
  }));

  const traits = mergePlanetTraits(
    planet.planetTypes ?? (planet.planetType ? [planet.planetType] : []),
    ...attachmentData.map(({ data }) => data?.planetTypes),
  );
  traits.forEach((trait) =>
    add({
      id: `trait:${trait}`,
      kind: "trait",
      label: capitalize(trait),
      terms: [`${trait} planet`, `${trait} planets`],
    }),
  );

  const specialties = new Set(
    [
      ...(planet.techSpecialties ?? []),
      ...(gameData.planetIdToPlanetTile[planetId]?.techSpecialties ?? []),
      ...attachmentData.flatMap(({ data }) => data?.techSpeciality ?? []),
    ]
      .map((specialty) => specialty.toLowerCase())
      .filter((specialty) => TECH_SPECIALTIES.includes(specialty)),
  );
  specialties.forEach((specialty) =>
    add({
      id: `specialty:${specialty}`,
      kind: "specialty",
      label: `${capitalize(specialty)} specialty`,
      terms: [`${specialty} skip`, `${specialty} tech skip`],
    }),
  );
  if (specialties.size > 0) {
    add({
      id: "specialty",
      kind: "specialty",
      label: "Tech specialty",
      terms: ["tech skip", "tech skips", "specialties", "skip"],
    });
  }

  attachmentData.forEach(({ id, data }) =>
    add({
      id: `attachment:${id}`,
      kind: "attachment",
      label: data?.name ?? id,
      terms: [id, data?.token ?? ""],
    }),
  );
  if (attachments.length > 0) {
    add({ id: "attachment", kind: "attachment", label: "Attachment", terms: ["attachments"] });
  }
}

/** Seat roles, which point at the holder's player areas like a faction search. */
function addRoleEntries(
  players: PlayerData[],
  factionNames: Map<string, string>,
): SearchEntry[] {
  const roles = [
    { id: "speaker", label: "Speaker", holder: players.find((p) => p.isSpeaker) },
    { id: "tyrant", label: "Tyrant", holder: players.find((p) => p.isTyrant) },
  ];

  return roles.flatMap(({ id, label, holder }) =>
    holder
      ? [
          {
            id: `role:${id}`,
            kind: "role" as const,
            label,
            detail: factionNames.get(holder.faction) ?? holder.faction,
            terms: toTerms([label]),
            targets: [searchKey("faction", holder.faction)],
          },
        ]
      : [],
  );
}

/** Results that gather many systems or planets under one name. */
export function buildCategoryEntries(
  gameData: GameData,
  players: PlayerData[],
  factionNames: Map<string, string>,
): SearchEntry[] {
  const categories = createCategories();
  const planetIds = new Set<string>(
    players.flatMap((player) => player.planets),
  );

  Object.values(gameData.tiles).forEach((tile) => {
    addSystemCategories(categories, tile);
    addUnitCategories(categories, tile);
    Object.keys(tile.planets).forEach((planetId) => planetIds.add(planetId));
  });
  planetIds.forEach((planetId) =>
    addPlanetCategories(categories, gameData, planetId),
  );

  return [...addRoleEntries(players, factionNames), ...categories.entries()];
}
