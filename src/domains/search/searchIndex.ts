import type { GameData } from "@/entities/game/types";
import type { PlayerData } from "@/entities/data/types";
import { getPlanetData } from "@/entities/lookup/planets";
import { getTechData } from "@/entities/lookup/tech";
import { getRelicData } from "@/entities/lookup/relics";
import { getLeaderById } from "@/entities/lookup/leaders";
import { getPromissoryNoteData } from "@/entities/lookup/promissoryNotes";
import { getSecretObjectiveData } from "@/entities/lookup/secretObjectives";
import { getTileById } from "@/entities/lookup/systems";
import { getPlayerFactionDisplayName } from "@/entities/game/playerUtils";
import { searchKey, type SearchKey, type SearchKind } from "./searchKeys";
import { buildCategoryEntries } from "./searchCategories";
import { normalizeSearchText, toTerms } from "./searchText";

/** Results that stand for a group of things rather than one named item. */
export type CategoryKind =
  | "role"
  | "token"
  | "anomaly"
  | "trait"
  | "specialty"
  | "attachment"
  | "unit";

export type EntryKind = SearchKind | CategoryKind;

export type SearchEntry = {
  id: string;
  kind: EntryKind;
  label: string;
  detail: string;
  /** Normalized names this entry answers to. */
  terms: string[];
  /** Every tagged element that belongs to this result: one item, or a whole category. */
  targets: SearchKey[];
  /** Only the board's copies of the targets count, e.g. units: a planet card says nothing about them. */
  boardOnly?: boolean;
};

export const SEARCH_KIND_LABELS: Record<EntryKind, string> = {
  faction: "Player",
  role: "Player",
  token: "Token",
  anomaly: "Anomaly",
  trait: "Trait",
  specialty: "Specialty",
  attachment: "Attachment",
  unit: "Unit",
  planet: "Planet",
  system: "System",
  tech: "Tech",
  leader: "Leader",
  relic: "Relic",
  promissory: "Note",
  objective: "Objective",
  secret: "Secret",
  law: "Law",
};

/** Breaks ties between equally good matches: the board before the cards. */
const KIND_PRIORITY: EntryKind[] = [
  "faction",
  "role",
  "planet",
  "system",
  "anomaly",
  "token",
  "trait",
  "specialty",
  "attachment",
  "unit",
  "tech",
  "leader",
  "relic",
  "promissory",
  "objective",
  "secret",
  "law",
];

const MAX_RESULTS = 8;

type ItemEntry = Pick<SearchEntry, "kind" | "label" | "detail"> & {
  key: SearchKey;
};

type IndexBuilder = {
  add: (entry: ItemEntry, terms: (string | null | undefined)[]) => void;
  owners: (key: SearchKey, faction: string) => void;
  entries: () => SearchEntry[];
};

/**
 * Collects entries by key, so an item several players hold (a common tech, a
 * shared relic) is one result whose detail lists every holder.
 */
function createIndexBuilder(factionNames: Map<string, string>): IndexBuilder {
  const entries = new Map<SearchKey, SearchEntry>();
  const holders = new Map<SearchKey, string[]>();

  return {
    add: (entry, terms) => {
      if (entries.has(entry.key)) return;
      const { key, ...rest } = entry;
      entries.set(key, { ...rest, id: key, targets: [key], terms: toTerms(terms) });
    },
    owners: (key, faction) => {
      const name = factionNames.get(faction) ?? faction;
      const current = holders.get(key) ?? [];
      if (!current.includes(name)) holders.set(key, [...current, name]);
    },
    entries: () =>
      [...entries.values()].map((entry) => {
        const names = holders.get(entry.id as SearchKey);
        if (!names?.length || entry.detail) return entry;
        return { ...entry, detail: names.join(", ") };
      }),
  };
}

/** Everything on the board and in the player areas that search can point at. */
export function buildSearchIndex(gameData: GameData): SearchEntry[] {
  const players = gameData.playerData.filter((player) => player.faction);
  const factionNames = new Map(
    players.map((player) => [player.faction, getPlayerFactionDisplayName(player)]),
  );
  const builder = createIndexBuilder(factionNames);

  addPlanets(builder, gameData, players, factionNames);
  addSystems(builder, gameData);
  players.forEach((player) => addPlayerHoldings(builder, gameData, player));
  addPublicCards(builder, gameData);

  return [...builder.entries(), ...buildCategoryEntries(gameData, players, factionNames)];
}

function addPlanets(
  builder: IndexBuilder,
  gameData: GameData,
  players: PlayerData[],
  factionNames: Map<string, string>,
) {
  const planetIds = new Set<string>();
  Object.values(gameData.tiles).forEach((tile) =>
    Object.keys(tile.planets).forEach((planetId) => planetIds.add(planetId)),
  );
  players.forEach((player) =>
    player.planets.forEach((planetId) => planetIds.add(planetId)),
  );

  planetIds.forEach((planetId) => {
    const planet = getPlanetData(planetId);
    if (!planet) return;

    const owner =
      gameData.planetIdToPlanetTile[planetId]?.controlledBy ??
      players.find((player) => player.planets.includes(planetId))?.faction;

    builder.add(
      {
        key: searchKey("planet", planetId),
        kind: "planet",
        label: planet.shortName ?? planet.name,
        detail: owner ? factionNames.get(owner) ?? owner : "Uncontrolled",
      },
      [planet.name, planet.shortName, planetId, ...(planet.aliases ?? [])],
    );
  });
}

/**
 * Systems answer to their tile number and board position. A system named after
 * its only planet doesn't also answer to that name, or every planet search
 * would return the same place twice.
 */
function addSystems(builder: IndexBuilder, gameData: GameData) {
  Object.values(gameData.tiles).forEach((tile) => {
    const tileData = getTileById(tile.systemId);
    if (!tileData || tileData.isHyperlane) return;

    const planetNames = new Set(
      Object.keys(tile.planets).flatMap((planetId) => {
        const planet = getPlanetData(planetId);
        return planet ? toTerms([planet.name, planet.shortName]) : [];
      }),
    );
    const name = tileData.name ?? undefined;
    const nameIsPlanet = !!name && planetNames.has(normalizeSearchText(name));

    builder.add(
      {
        key: searchKey("system", tile.position),
        kind: "system",
        label: name || `Tile ${tile.systemId}`,
        detail: `Position ${tile.position} · Tile ${tile.systemId}`,
      },
      [nameIsPlanet ? undefined : name, tile.systemId, tile.position],
    );
  });
}

function addPlayerHoldings(
  builder: IndexBuilder,
  gameData: GameData,
  player: PlayerData,
) {
  const factionName = getPlayerFactionDisplayName(player);

  builder.add(
    {
      key: searchKey("faction", player.faction),
      kind: "faction",
      label: factionName,
      detail: player.userName,
    },
    [factionName, player.faction, player.userName, player.color],
  );

  player.techs.forEach((techId) => {
    const tech = getTechData(techId);
    if (!tech) return;
    const key = searchKey("tech", techId);
    builder.add({ key, kind: "tech", label: tech.name, detail: "" }, [
      tech.name,
      tech.shortName,
      techId,
    ]);
    builder.owners(key, player.faction);
  });

  player.relics.forEach((relicId) => {
    const relic = getRelicData(relicId);
    if (!relic) return;
    const key = searchKey("relic", relicId);
    builder.add({ key, kind: "relic", label: relic.name, detail: "" }, [
      relic.name,
      relic.shortName,
    ]);
    builder.owners(key, player.faction);
  });

  player.leaders.forEach((leader) => {
    const leaderData = getLeaderById(leader.id);
    if (!leaderData) return;
    builder.add(
      {
        key: searchKey("leader", leader.id),
        kind: "leader",
        label: leaderData.name,
        detail: `${factionName} ${leader.type}`,
      },
      [leaderData.name, leaderData.shortName, leaderData.title],
    );
  });

  player.promissoryNotesInPlayArea.forEach((noteId) => {
    const note = getPromissoryNoteData(noteId, gameData.factionColorMap);
    if (!note) return;
    const key = searchKey("promissory", noteId);
    builder.add({ key, kind: "promissory", label: note.displayName, detail: "" }, [
      note.displayName,
      note.noteData.shortName,
    ]);
    builder.owners(key, player.faction);
  });

  const secretIds = [
    ...Object.keys(player.secretsScored ?? {}),
    ...Object.keys(player.knownUnscoredSecrets ?? {}),
  ];
  secretIds.forEach((secretId) => {
    const secret = getSecretObjectiveData(secretId);
    if (!secret) return;
    const key = searchKey("secret", secretId);
    builder.add({ key, kind: "secret", label: secret.name, detail: "" }, [
      secret.name,
    ]);
    builder.owners(key, player.faction);
  });
}

function addPublicCards(builder: IndexBuilder, gameData: GameData) {
  gameData.objectives.allObjectives
    .filter((objective) => objective.revealed)
    .forEach((objective) =>
      builder.add(
        {
          key: searchKey("objective", objective.key),
          kind: "objective",
          label: objective.name,
          detail: `${objective.pointValue} VP · scored by ${objective.scoredFactions.length}`,
        },
        [objective.name],
      ),
    );

  gameData.lawsInPlay.forEach((law) =>
    builder.add(
      {
        key: searchKey("law", law.id),
        kind: "law",
        label: law.name,
        detail: law.electedInfo ?? "In play",
      },
      [law.name],
    ),
  );
}

/** How well one normalized term answers the query; lower is better. */
function scoreTerm(term: string, query: string): number | null {
  if (term === query) return 0;
  if (term.startsWith(query)) return 1;
  if (term.includes(` ${query}`)) return 2;
  if (term.replaceAll(" ", "").includes(query.replaceAll(" ", ""))) return 3;
  return null;
}

function scoreEntry(entry: SearchEntry, query: string): number | null {
  const scores = entry.terms
    .map((term) => scoreTerm(term, query))
    .filter((score): score is number => score !== null);
  return scores.length ? Math.min(...scores) : null;
}

/** The best few entries for a query, best first. */
export function findSearchEntries(
  entries: SearchEntry[],
  rawQuery: string,
): SearchEntry[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter(
      (match): match is { entry: SearchEntry; score: number } =>
        match.score !== null,
    )
    .sort(
      (a, b) =>
        a.score - b.score ||
        KIND_PRIORITY.indexOf(a.entry.kind) -
          KIND_PRIORITY.indexOf(b.entry.kind) ||
        a.entry.label.length - b.entry.label.length ||
        a.entry.label.localeCompare(b.entry.label),
    )
    .slice(0, MAX_RESULTS)
    .map((match) => match.entry);
}
