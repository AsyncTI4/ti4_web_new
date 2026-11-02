import type {
  CardPoolData,
  EntityData,
  FactionUnits,
  GameState,
  PlayerData,
  TileUnitData,
} from "@/entities/data/types";
import type { GameData, Tile, TilePlanet } from "@/entities/game/types";
import type { GameDataState } from "@/state/gameContextTypes";
import type { PlayerHandData } from "@/shared/types/playerHand";
import { environmentReportLines } from "@/shared/debug/environmentReport";
import { getActionCard } from "@/entities/lookup/actionCards";
import { getSecretObjectiveData } from "@/entities/lookup/secretObjectives";
import { getPromissoryNoteData } from "@/entities/lookup/promissoryNotes";
import { getPlanetData } from "@/entities/lookup/planets";
import { getTileById } from "@/entities/lookup/systems";
import { getTechData } from "@/entities/lookup/tech";
import { getRelicData } from "@/entities/lookup/relics";
import { getLeaderById } from "@/entities/lookup/leaders";
import { getTokenData } from "@/entities/lookup/tokens";
import { getAttachmentData } from "@/entities/lookup/attachments";
import { getStrategyCardByInitiative } from "@/entities/lookup/strategyCards";
import {
  getGenericUnitDataByAsyncId,
  getUnitData,
  lookupUnit,
} from "@/entities/lookup/units";
import { getExploration } from "@/entities/lookup/explorations";
import { agendas } from "@/entities/data/agendas";

export type GameDebugReportInput = {
  gameId: string;
  data: GameData | undefined;
  dataState: GameDataState | undefined;
  gameState?: GameState | null;
  /** Only present when the viewer is logged in and seated in this game. */
  hand?: {
    canView: boolean;
    data: PlayerHandData | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  viewerDiscordId?: string | null;
};

const INDENT = "  ";

function section(title: string): string[] {
  return ["", `=== ${title.toUpperCase()} ===`];
}

function list(values: string[] | undefined | null): string {
  return values && values.length > 0 ? values.join(", ") : "-";
}

function yesNo(value: boolean | undefined | null): string {
  return value ? "yes" : "no";
}

function named(id: string, name: string | undefined | null): string {
  return name && name !== id ? `${name} [${id}]` : id;
}

/* Lookups degrade to the raw id: a debug report must never throw on unknown data. */
function safe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

function planetName(id: string): string {
  return named(id, safe(() => getPlanetData(id))?.name);
}

function techName(id: string): string {
  return named(id, safe(() => getTechData(id))?.name);
}

function relicName(id: string): string {
  return named(id, safe(() => getRelicData(id))?.name);
}

function tokenName(id: string): string {
  const token = safe(() => getTokenData(id));
  return named(id, token?.tokenPlanetName ?? undefined);
}

function attachmentName(id: string): string {
  const attachment = safe(() => getAttachmentData(id)) as
    | { name?: string }
    | undefined;
  return named(id, attachment?.name);
}

function systemName(systemId: string): string {
  return named(systemId, safe(() => getTileById(systemId))?.name ?? undefined);
}

function factionLabel(data: GameData, factionOrColor: string): string {
  const entry = data.factionColorMap[factionOrColor];
  if (!entry) return factionOrColor;
  const player = data.playerData.find((p) => p.faction === entry.faction);
  const user = player ? ` / ${player.userName}` : "";
  return `${entry.faction} (${entry.color}${user})`;
}

function promissoryName(data: GameData, id: string): string {
  const note = safe(() => getPromissoryNoteData(id, data.factionColorMap));
  if (!note) return id;
  return `${named(id, note.displayName)} (from ${note.faction})`;
}

function stateSuffix(entity: EntityData): string {
  const states = entity.unitStates;
  const extras: string[] = [];
  if (states) {
    if (states[1]) extras.push(`${states[1]} damaged`);
    if (states[2]) extras.push(`${states[2]} galvanized`);
    if (states[3]) extras.push(`${states[3]} galvanized+damaged`);
  } else if (entity.sustained) {
    extras.push(`${entity.sustained} damaged`);
  }
  return extras.length ? ` (${extras.join(", ")})` : "";
}

function entityLabel(
  data: GameData,
  faction: string,
  entity: EntityData,
): string {
  const count = `${entity.count}x `;
  switch (entity.entityType) {
    case "unit": {
      const player = data.playerData.find((p) => p.faction === faction);
      const unit =
        safe(() => lookupUnit(entity.entityId, faction, player)) ??
        safe(() => getGenericUnitDataByAsyncId(entity.entityId));
      return `${count}${named(entity.entityId, unit?.name)}${stateSuffix(entity)}`;
    }
    case "token":
      return `${count}token ${tokenName(entity.entityId)}`;
    case "attachment":
      return `${count}attachment ${attachmentName(entity.entityId)}`;
    case "actioncard": {
      const card = safe(() => getActionCard(entity.entityId));
      return `${count}action card ${named(entity.entityId, card?.name)}`;
    }
    default:
      return `${count}${entity.entityId}`;
  }
}

function unitsLines(
  data: GameData,
  unitsByFaction: FactionUnits | undefined,
  indent: string,
): string[] {
  if (!unitsByFaction) return [];
  return Object.entries(unitsByFaction)
    .filter(([, entities]) => entities.length > 0)
    .map(
      ([faction, entities]) =>
        `${indent}${factionLabel(data, faction)}: ${entities
          .map((entity) => entityLabel(data, faction, entity))
          .join(", ")}`,
    );
}

function planetLines(
  data: GameData,
  planetId: string,
  planet: TilePlanet,
  indent: string,
): string[] {
  const facts: string[] = [];
  facts.push(
    `owner: ${planet.controlledBy ? factionLabel(data, planet.controlledBy) : "none"}`,
  );
  if (planet.resources != null || planet.influence != null) {
    facts.push(`${planet.resources ?? "?"}R/${planet.influence ?? "?"}I`);
  }
  facts.push(planet.exhausted ? "EXHAUSTED" : "ready");
  if (planet.planetaryShield) facts.push("planetary shield");
  if (planet.commodities) facts.push(`${planet.commodities} commodities`);
  if (planet.techSpecialties.length)
    facts.push(`skips: ${list(planet.techSpecialties)}`);

  const lines = [`${indent}Planet ${planetName(planetId)} — ${facts.join(", ")}`];
  const inner = indent + INDENT;
  if (planet.attachments.length)
    lines.push(`${inner}Attachments: ${planet.attachments.map(attachmentName).join(", ")}`);
  if (planet.tokens.length)
    lines.push(`${inner}Tokens: ${planet.tokens.map(tokenName).join(", ")}`);
  if (planet.actionCards.length)
    lines.push(`${inner}Action cards: ${list(planet.actionCards)}`);
  const units = unitsLines(data, planet.unitsByFaction, inner + INDENT);
  if (units.length) lines.push(`${inner}Units:`, ...units);
  return lines;
}

function tileLines(
  data: GameData,
  tile: Tile,
  activeSystem: string | null,
): string[] {
  const header = [`[${tile.position}] ${systemName(tile.systemId)}`];
  const tags: string[] = [];
  if (tile.hasAnomaly) tags.push("anomaly");
  if (tile.controlledBy) tags.push(`space controlled by ${factionLabel(data, tile.controlledBy)}`);
  if (activeSystem === tile.position) tags.push("ACTIVE SYSTEM");
  if (tags.length) header.push(`(${tags.join("; ")})`);

  const lines = [header.join(" ")];
  if (tile.commandCounters.length)
    lines.push(
      `${INDENT}Command tokens: ${tile.commandCounters
        .map((cc) => factionLabel(data, cc))
        .join(", ")}`,
    );
  if (tile.tokens.length)
    lines.push(`${INDENT}Space tokens: ${tile.tokens.map(tokenName).join(", ")}`);
  if (tile.borderAnomalies?.length)
    lines.push(
      `${INDENT}Border anomalies: ${tile.borderAnomalies
        .map((b) => `${b.type} (side ${b.direction})`)
        .join(", ")}`,
    );
  const pds = data.pdsByTile[tile.position];
  if (pds?.length)
    lines.push(
      `${INDENT}PDS coverage: ${pds
        .map((p) => `${factionLabel(data, p.faction)} ${p.count} dice (exp. ${p.expected})`)
        .join(", ")}`,
    );
  if (tile.largestCapacity && tile.largestCapacity.total > 0)
    lines.push(
      `${INDENT}Capacity: ${tile.largestCapacity.used}/${tile.largestCapacity.total}`,
    );

  const space = unitsLines(data, tile.unitsByFaction, INDENT + INDENT);
  if (space.length) lines.push(`${INDENT}Space:`, ...space);

  for (const [planetId, planet] of Object.entries(tile.planets)) {
    lines.push(...planetLines(data, planetId, planet, INDENT));
  }
  return lines;
}

function unpositionedTileLines(
  data: GameData,
  position: string,
  tile: TileUnitData,
): string[] {
  const lines = [`[${position}] (position not drawable)`];
  if (tile.ccs.length) lines.push(`${INDENT}Command tokens: ${list(tile.ccs)}`);
  const space = unitsLines(data, tile.space, INDENT + INDENT);
  if (space.length) lines.push(`${INDENT}Space:`, ...space);
  for (const [planetId, planet] of Object.entries(tile.planets ?? {})) {
    lines.push(`${INDENT}Planet ${planetName(planetId)} — owner: ${planet.controlledBy ?? "none"}`);
    lines.push(...unitsLines(data, planet.entities, INDENT + INDENT + INDENT));
  }
  return lines;
}

function comparePositions(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.localeCompare(b, undefined, { numeric: true });
}

function playerLines(data: GameData, player: PlayerData): string[] {
  const flags: string[] = [];
  if (player.active) flags.push("ACTIVE");
  if (player.isSpeaker) flags.push("speaker");
  if (player.passed) flags.push("passed");
  if (player.eliminated) flags.push("eliminated");
  if (player.isTyrant) flags.push("tyrant");

  const scs = player.scs.map((sc) => {
    const card = safe(() => getStrategyCardByInitiative(sc, data.strategyCardIdMap));
    const exhausted = player.exhaustedSCs.includes(sc) ? " (played/exhausted)" : "";
    return `${sc} ${card?.name ?? ""}`.trim() + exhausted;
  });

  const leaders = player.leaders.map((leader) => {
    const info = safe(() => getLeaderById(leader.id));
    const state = leader.locked
      ? "locked"
      : leader.exhausted
        ? "exhausted"
        : leader.active
          ? "active"
          : "ready";
    const tg = leader.tgCount ? `, ${leader.tgCount} tg` : "";
    return `${named(leader.id, info?.name)} (${leader.type}, ${state}${tg})`;
  });

  const planets = player.planets.map(
    (p) => planetName(p) + (player.exhaustedPlanets.includes(p) ? " (exhausted)" : ""),
  );
  const techs = player.techs.map(
    (t) => techName(t) + (player.exhaustedTechs.includes(t) ? " (exhausted)" : ""),
  );
  const relics = player.relics.map(
    (r) => relicName(r) + (player.exhaustedRelics.includes(r) ? " (exhausted)" : ""),
  );
  const secretsScored = Object.keys(player.secretsScored ?? {}).map((so) =>
    named(so, safe(() => getSecretObjectiveData(so))?.name),
  );
  const knownSecrets = Object.keys(player.knownUnscoredSecrets ?? {}).map((so) =>
    named(so, safe(() => getSecretObjectiveData(so))?.name),
  );
  const debt = Object.entries(player.debtTokens ?? {}).map(
    ([color, count]) => `${count} from ${factionLabel(data, color)}`,
  );
  const reinforcements = Object.entries(player.unitCounts ?? {}).map(
    ([unit, c]) => `${unit} ${c.deployedCount}/${c.unitCap}`,
  );

  const i = INDENT;
  return [
    "",
    `${player.faction} — ${player.userName} (${player.color})${
      flags.length ? ` [${flags.join(", ")}]` : ""
    }`,
    `${i}VP: ${player.totalVps}/${data.vpsToWin}`,
    `${i}Command tokens: tactic ${player.tacticalCC} / fleet ${player.fleetCC} / strategy ${player.strategicCC} (reinforcements ${player.ccReinf})`,
    `${i}Trade goods: ${player.tg}, commodities: ${player.commodities}/${player.commoditiesTotal}`,
    `${i}Resources: ${player.resources}/${player.totResources} ready, influence: ${player.influence}/${player.totInfluence} ready`,
    `${i}Fragments: cultural ${player.crf}, hazardous ${player.hrf}, industrial ${player.irf}, unknown ${player.urf}`,
    `${i}Hand counts: ${player.acCount} action cards, ${player.pnCount} promissory notes, ${player.soCount} secret objectives (${player.numUnscoredSecrets} unscored)`,
    `${i}Strategy cards: ${list(scs)}`,
    `${i}Followed SCs: ${list(player.followedSCs.map(String))}; unfollowed: ${list(player.unfollowedSCs.map(String))}`,
    `${i}Technologies: ${list(techs)}`,
    `${i}Faction techs not researched: ${list(player.notResearchedFactionTechs.map(techName))}`,
    `${i}Planets: ${list(planets)}`,
    `${i}Relics: ${list(relics)}`,
    `${i}Fragments held: ${list(player.fragments)}`,
    `${i}Leaders: ${list(leaders)}`,
    `${i}Promissory notes in play area: ${list(
      player.promissoryNotesInPlayArea.map((pn) => promissoryName(data, pn)),
    )}`,
    `${i}Secrets scored: ${list(secretsScored)}`,
    `${i}Known unscored secrets: ${list(knownSecrets)}`,
    `${i}Abilities: ${list(player.abilities)}`,
    `${i}Neighbors: ${list(player.neighbors)}`,
    `${i}Debt tokens: ${list(debt)}`,
    `${i}Units deployed/cap: ${list(reinforcements)}`,
    ...(player.breakthrough
      ? [
          `${i}Breakthrough: ${player.breakthrough.breakthroughId} (${
            player.breakthrough.unlocked ? "unlocked" : "locked"
          }${player.breakthrough.exhausted ? ", exhausted" : ""})`,
        ]
      : []),
  ];
}

function handLines(
  data: GameData | undefined,
  input: GameDebugReportInput,
): string[] {
  const lines = section("Your hand (logged-in player)");
  const hand = input.hand;
  if (!hand || !hand.canView) {
    lines.push("Not available (not logged in, or not a player in this game).");
    return lines;
  }
  if (hand.isLoading) {
    lines.push("Still loading.");
    return lines;
  }
  if (hand.error) {
    lines.push(`Failed to load: ${hand.error.message}`);
    return lines;
  }
  if (!hand.data) {
    lines.push("No data.");
    return lines;
  }
  const me = data?.playerData.find((p) => p.discordId === input.viewerDiscordId);
  if (me) lines.push(`Player: ${me.faction} — ${me.userName} (${me.color})`);

  const { actionCards, secretObjectives, promissoryNotes } = hand.data;
  lines.push(`Action cards (${actionCards.length}):`);
  for (const id of actionCards) {
    const card = safe(() => getActionCard(id));
    lines.push(
      `${INDENT}- ${named(id, card?.name)}${card ? ` — ${card.window}: ${card.text}` : ""}`,
    );
  }
  lines.push(`Secret objectives (${secretObjectives.length}):`);
  for (const id of secretObjectives) {
    const so = safe(() => getSecretObjectiveData(id));
    lines.push(
      `${INDENT}- ${named(id, so?.name)}${so ? ` (${so.phase}, ${so.points} VP) — ${so.text}` : ""}`,
    );
  }
  lines.push(`Promissory notes (${promissoryNotes.length}):`);
  for (const id of promissoryNotes) {
    lines.push(`${INDENT}- ${data ? promissoryName(data, id) : id}`);
  }
  return lines;
}

/** Builds a human-readable dump of everything the game page shows, for debugging. */
const agendasByAlias = new Map(agendas.map((agenda) => [agenda.alias, agenda]));

type CardNamer = (id: string) => string;

const agendaName: CardNamer = (id) => named(id, agendasByAlias.get(id)?.name);
const actionCardName: CardNamer = (id) => named(id, safe(() => getActionCard(id))?.name);
const secretName: CardNamer = (id) => named(id, safe(() => getSecretObjectiveData(id))?.name);
const exploreName: CardNamer = (id) => named(id, safe(() => getExploration(id))?.name);
const unitName: CardNamer = (id) => named(id, safe(() => getUnitData(id))?.name);
const tfLeaderName: CardNamer = (id) => {
  const leader = safe(() => getLeaderById(id));
  return named(id, leader?.tfName || leader?.name);
};

function count(cards: string[] | undefined, fullSize: number | undefined): string {
  const size = cards?.length ?? "?";
  return fullSize ? `${size}/${fullSize}` : `${size}`;
}

function cardList(label: string, cards: string[] | undefined, name: CardNamer): string {
  return `${INDENT}${label} (${cards?.length ?? 0}): ${list(cards?.map(name))}`;
}

/** What the General tab's card pool shows, card by card. */
function deckLines(pool: CardPoolData): string[] {
  const lines = section("Decks");
  lines.push(
    `Action cards: deck hidden, ${pool.actionCardFullDeckSize ?? "?"} in the full deck`,
    cardList("Discard", pool.actionCardDiscard, actionCardName),
    `Agendas: ${count(pool.agendaDeck, pool.agendaFullDeckSize)} in deck`,
    cardList("Deck", pool.agendaDeck, agendaName),
    cardList("Discard", pool.agendaDiscard, agendaName),
    `Secret objectives: ${count(pool.secretObjectiveDeck, pool.secretObjectiveFullDeckSize)} unscored (deck and hands)`,
    cardList("Unscored", pool.secretObjectiveDeck, secretName),
    `Relics: ${count(pool.relicDeck, pool.relicFullDeckSize)} in deck`,
    cardList("Deck", pool.relicDeck, relicName),
  );

  const explores = [
    ["Cultural", pool.culturalExploreDeck, pool.culturalExploreDiscard, pool.culturalExploreFullDeckSize],
    ["Industrial", pool.industrialExploreDeck, pool.industrialExploreDiscard, pool.industrialExploreFullDeckSize],
    ["Hazardous", pool.hazardousExploreDeck, pool.hazardousExploreDiscard, pool.hazardousExploreFullDeckSize],
    ["Frontier", pool.frontierExploreDeck, pool.frontierExploreDiscard, pool.frontierExploreFullDeckSize],
  ] as const;
  for (const [type, deck, discard, fullSize] of explores) {
    lines.push(
      `${type} explore: ${count(deck, fullSize)} in deck`,
      cardList("Deck", deck, exploreName),
      cardList("Discard", discard, exploreName),
    );
  }

  const spliceDecks = [
    ["Ability splice", pool.abilitySpliceDeck, pool.abilitySpliceFullDeckSize, techName],
    ["Unit upgrade splice", pool.unitSpliceDeck, pool.unitSpliceFullDeckSize, unitName],
    ["Genome splice", pool.genomeSpliceDeck, pool.genomeSpliceFullDeckSize, tfLeaderName],
    ["Paradigm", pool.paradigmSpliceDeck, pool.paradigmSpliceFullDeckSize, tfLeaderName],
  ] as const;
  for (const [title, deck, fullSize, name] of spliceDecks) {
    if (!deck) continue;
    lines.push(`${title} deck: ${count(deck, fullSize)} in deck`, cardList("Deck", deck, name));
  }
  return lines;
}

export function buildGameDebugReport(input: GameDebugReportInput): string {
  const { data, dataState, gameId } = input;
  const lines: string[] = [
    "=== ASYNC TI4 WEB DEBUG REPORT ===",
    ...environmentReportLines(),
    `Game id: ${gameId}`,
  ];

  if (dataState) {
    lines.push(
      `Data state: loading=${yesNo(dataState.isLoading)}, error=${
        dataState.error ? dataState.error.message : yesNo(dataState.isError)
      }, socket=${String(dataState.readyState)}, reconnecting=${yesNo(dataState.isReconnecting)}`,
    );
  }

  if (!data) {
    lines.push("", "Game data not loaded.");
    lines.push(...handLines(data, input));
    return lines.join("\n");
  }

  const { gameState } = input;

  // Overview -------------------------------------------------------------
  lines.push(...section("Game"));
  lines.push(
    `Name: ${data.gameName}${data.gameCustomName ? ` (${data.gameCustomName})` : ""}`,
    `Round: ${data.gameRound}`,
    `VPs to win: ${data.vpsToWin}`,
    `Version schema: ${data.versionSchema ?? "?"}`,
    `Twilight's Fall mode: ${yesNo(data.isTwilightsFallMode)}`,
    `Ring count: ${data.ringCount}`,
  );
  const active = data.playerData.find((p) => p.active);
  const speaker = data.playerData.find((p) => p.isSpeaker);
  lines.push(
    `Active player: ${active ? `${active.faction} — ${active.userName}` : "-"}`,
    `Speaker: ${speaker ? `${speaker.faction} — ${speaker.userName}` : "-"}`,
  );
  if (gameState) {
    lines.push(
      `Phase: ${gameState.phase}`,
      `Active system: ${gameState.activeSystem ?? "-"}`,
      `Winner: ${gameState.winner ?? "-"}`,
    );
    if (gameState.turnStartedAt)
      lines.push(`Turn started at: ${new Date(gameState.turnStartedAt).toISOString()}`);
    if (gameState.activeCombat) {
      const c = gameState.activeCombat;
      lines.push(
        `Active combat: system ${c.system ?? "?"}, holder ${c.unitHolder ?? "?"}, round ${
          c.round ?? "?"
        }, participants ${list(c.participantColors)}`,
      );
    }
    if (gameState.agenda) {
      const a = gameState.agenda;
      lines.push(
        `Agenda: ${a.id}, resolved: ${a.resolvedOutcome ?? "-"}, votes cast: ${JSON.stringify(
          a.castVoteCounts,
        )}, outcome votes: ${JSON.stringify(a.outcomeVoteCounts)}`,
      );
    }
  }

  // Score ----------------------------------------------------------------
  lines.push(...section("Scoreboard"));
  for (const player of [...data.playerData].sort((a, b) => b.totalVps - a.totalVps)) {
    lines.push(`${player.totalVps} VP — ${player.faction} (${player.userName})`);
  }

  // Players --------------------------------------------------------------
  lines.push(...section("Players"));
  for (const player of data.playerData) lines.push(...playerLines(data, player));

  // Strategy cards -------------------------------------------------------
  lines.push(...section("Strategy cards"));
  for (const sc of data.strategyCards) {
    const state = [
      sc.pickedByFaction ? `picked by ${sc.pickedByFaction}` : "unpicked",
      sc.played ? "played" : null,
      sc.exhausted ? "exhausted" : null,
      sc.tradeGoods ? `${sc.tradeGoods} tg on card` : null,
    ].filter(Boolean);
    lines.push(`${sc.initiative} ${sc.name} [${sc.id}] — ${state.join(", ")}`);
  }

  // Objectives -----------------------------------------------------------
  lines.push(...section("Public objectives"));
  const objectiveGroups: [string, typeof data.objectives.stage1Objectives][] = [
    ["Stage I", data.objectives.stage1Objectives],
    ["Stage II", data.objectives.stage2Objectives],
    ["Other", data.objectives.customObjectives],
  ];
  for (const [label, objectives] of objectiveGroups) {
    if (!objectives?.length) continue;
    lines.push(`${label}:`);
    for (const o of objectives) {
      const status = o.revealed ? "revealed" : "not revealed";
      const progress = Object.entries(o.factionProgress ?? {})
        .filter(([, v]) => v > 0)
        .map(([f, v]) => `${f} ${v}/${o.progressThreshold}`);
      lines.push(
        `${INDENT}- ${o.name} [${o.key}] (${o.pointValue} VP, ${status}) scored by: ${list(
          o.scoredFactions,
        )}${progress.length ? `; progress: ${progress.join(", ")}` : ""}`,
      );
    }
  }

  // Laws -----------------------------------------------------------------
  lines.push(...section("Laws in play"));
  if (!data.lawsInPlay.length) lines.push("-");
  for (const law of data.lawsInPlay) {
    lines.push(
      `- ${law.name} [${law.id}]${law.electedInfo ? ` — elected: ${law.electedInfo}` : ""}${
        law.controlTokens.length ? `; tokens: ${list(law.controlTokens)}` : ""
      }`,
    );
  }

  // Map ------------------------------------------------------------------
  lines.push(...section("Map"));
  lines.push(
    "Each system: [position] name [tile id]; then command tokens, space units, and planets with their units.",
  );
  const tiles = Object.values(data.tiles).sort((a, b) =>
    comparePositions(a.position, b.position),
  );
  for (const tile of tiles) {
    lines.push("", ...tileLines(data, tile, gameState?.activeSystem ?? null));
  }
  const unpositioned = Object.entries(data.unpositionedTileData ?? {});
  if (unpositioned.length) {
    lines.push("", `Unsupported positions: ${list(data.unsupportedPositions)}`);
    for (const [position, tile] of unpositioned) {
      lines.push("", ...unpositionedTileLines(data, position, tile));
    }
  }

  if (data.cardPool) lines.push(...deckLines(data.cardPool));

  lines.push(...handLines(data, input));
  return lines.join("\n");
}
