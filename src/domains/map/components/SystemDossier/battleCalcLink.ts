import type { GameState, PlayerData, Unit } from "@/entities/data/types";
import type { Tile, TilePlanet } from "@/entities/game/types";
import type { BattleAttackerPick } from "@/state/appStore";
import { getUnitData } from "@/entities/lookup/units";
import {
  anomaliesInOrNextTo,
  neighbourTiles,
  systemAnomalies,
  type Tiles,
} from "@/entities/game/anomalies";
import { summarizeZone, type UnitRow } from "./fleetMath";
import {
  getUnitModifiers,
  isPlayAreaUnitUpgrade,
  modifiedCombatValue,
  ownedPlayAreaUpgrades,
} from "@/entities/game/unitModifiers";

const BATTLE_CALC_URL = "https://ti4calc.leviatas.com/";

/** Unit types ti4calc.leviatas.com knows, which share their names with our base types. */
const CALC_UNIT_TYPES = new Set([
  "carrier",
  "cruiser",
  "destroyer",
  "dreadnought",
  "fighter",
  "flagship",
  "warsun",
  "infantry",
  "mech",
  "pds",
]);

/** Our faction ids mapped to the faction names ti4calc.leviatas.com expects. */
const CALC_FACTIONS: Record<string, string> = {
  arborec: "Arborec",
  argent: "Argent flight",
  bastion: "Last Bastion",
  cabal: "Vuil'Raith",
  crimson: "Crimson Rebellion",
  deepwrought: "Deepwrought",
  empyrean: "Empyrean",
  firmament: "Firmament",
  ghost: "Creuss",
  hacan: "Hacan",
  jolnar: "Jol-Nar",
  keleresa: "Keleres",
  keleresm: "Keleres",
  keleresx: "Keleres",
  l1z1x: "L1z1x",
  letnev: "Barony of Letnev",
  mahact: "Mahact",
  mentak: "Mentak",
  muaat: "Muaat",
  naalu: "Naalu",
  naaz: "Naaz-Rokha",
  nekro: "Nekro",
  neutral: "Neutral",
  nomad: "Nomad",
  obsidian: "Obsidian",
  ralnel: "Ral Nel Consortium",
  saar: "Clan of Saar",
  sardakk: "Sardakk N'orr",
  sol: "Sol",
  titans: "Titans of Ul",
  winnu: "Winnu",
  xxcha: "Xxcha",
  yin: "Yin",
  yssaril: "Yssaril",
  /* Twilight's Fall: the eight Mad Mahact Kings, named after their colour. */
  redtf: "Ruby Monarch (TF)",
  orangetf: "Radiant Aur (TF)",
  yellowtf: "Avarice Rex (TF)",
  greentf: "Il Sai Lakoe (TF)",
  bluetf: "Saint of Swords (TF)",
  purpletf: "Il Na Viroset (TF)",
  pinktf: "El Nel Janovet (TF)",
  blacktf: "A Sickening Lurch (TF)",
};

/** Whether the calculator faction is one of the Twilight's Fall kings. */
const isTwilightsFallKing = (calcFaction: string | undefined) =>
  !!calcFaction?.endsWith("(TF)");

/**
 * Technologies ti4calc.leviatas.com models, keyed by our tech id and mapped to its
 * effect name. Only the printings whose rules match the calculator are
 * listed: it implements the current Magen Defense Grid and X-89 Bacterial
 * Weapon, and none of the homebrew variants. Faction unit upgrades are not
 * here; they travel as unit upgrades.
 */
const CALC_TECH_EFFECTS: Record<string, string> = {
  amd: "Antimass Deflectors",
  asc: "Assault Cannon",
  da: "Duranium Armor",
  gls: "Graviton Laser System",
  md: "Magen Defense Grid",
  md_c1: "Magen Defense Grid",
  ps: "Plasma Scoring",
  x89c4: "X-89 Bacterial Weapon",
  ds: "Dimensional Splicer",
  ic: "Impulse Core",
  l4: "L4 Disruptors",
  nes: "Non-Euclidean Shielding",
  proxima: "Proxima Targeting VI",
  sc: "Supercharge",
  vpw: "Valkyrie Particle Weave",
};

/**
 * Twilight's Fall abilities ti4calc.leviatas.com models, keyed by our ability
 * id. Only a king can splice them, and the calculator offers them to kings
 * only. Proxima Targeting VI is not here: the calculator implements the Last
 * Bastion printing, whose rules differ. Planesplitter counts only in the
 * Fracture, Smothering Presence only next to the king's structures and
 * Munitions Reserves spends trade goods, so they are written apart.
 */
const CALC_TF_ABILITY_EFFECTS: Record<string, string> = {
  "tf-ambush": "Ambush (TF)",
  "tf-devotion": "Devotion",
  "tf-ds": "Dimensional Splicer",
  "tf-harrow": "Harrow (TF)",
  "tf-nes": "Non-Euclidean Shielding",
  "tf-raidformation": "Raid Formation (TF)",
  "tf-supercharge": "Supercharge (TF)",
  "tf-unrelenting": "Unrelenting (TF)",
  "tf-vpw": "Valkyrie Particle Weave",
};

const TF_MUNITIONS_RESERVES = "tf-munitions";
const TF_PLANESPLITTER = "tf-planesplitter";
const TF_SMOTHERING_PRESENCE = "tf-smotheringpresence";


/**
 * Genomes ti4calc.leviatas.com models, keyed by our leader id and mapped to its
 * agent effect. Each is the king's own to exhaust, so it goes on its side.
 */
const CALC_GENOME_EFFECTS: Record<string, string> = {
  letnevagent: "Barony Agent",
  solagent: "Sol agent",
  titansagent: "Titans agent",
  yinagent: "Yin agent",
};

/** Effects the calculator would apply to an attacker but the rules do not. */
const DEFENDER_ONLY_EFFECTS = new Set(["Magen Defense Grid"]);

/**
 * The calculator effects a player can bring to a battle right now: every
 * modelled technology they have researched and not exhausted. The calculator
 * itself drops the ones that do not apply to the battle being run.
 */
function techEffects(
  player: PlayerData | undefined,
  side: Side,
  king: boolean,
): string[] {
  if (!player) return [];
  const exhausted = new Set(player.exhaustedTechs ?? []);
  const effects = (player.techs ?? [])
    .filter((tech) => !exhausted.has(tech))
    .map(
      (tech) =>
        CALC_TECH_EFFECTS[tech] ??
        (king ? CALC_TF_ABILITY_EFFECTS[tech] : undefined),
    )
    .filter((effect): effect is string => !!effect)
    .filter(
      (effect) => side === "defender" || !DEFENDER_ONLY_EFFECTS.has(effect),
    );
  return [...new Set(effects)];
}

/**
 * Relics ti4calc.leviatas.com models, keyed by our relic id and mapped to its effect
 * name. Lightrail Ordnance is not here: it counts space docks, so it is
 * written apart.
 */
const CALC_RELIC_EFFECTS: Record<string, string> = {
  heartofixth: "Heart of Ixth",
  metalivoidarmaments: "Metali Void Armaments",
  metalivoidshielding: "Metali Void Shielding",
};

const LIGHTRAIL_ORDNANCE = "lightrailordnance";

/** The player's relics that are ready to use: held and not exhausted. */
function readyRelics(player: PlayerData | undefined): string[] {
  if (!player) return [];
  const exhausted = new Set(player.exhaustedRelics ?? []);
  return (player.relics ?? []).filter((relic) => !exhausted.has(relic));
}

/** Whether the system is in the Fracture, whose positions are frac1, frac2… */
const isInFracture = (tile: Tile) => tile.position.startsWith("frac");

/**
 * Whether the faction has a structure (PDS, space dock…) in the battle's
 * system or in a system next to it. Adjacency is by position on the map;
 * wormholes and hyperlanes are not followed.
 */
function hasStructureInOrNextTo(
  faction: string,
  battleTile: Tile,
  tiles: Tiles | undefined,
  playerFor: PlayerFor,
): boolean {
  return [battleTile, ...neighbourTiles(battleTile, tiles)].some((tile) =>
    [tile, ...Object.values(tile.planets)].some((zone) =>
      factionRows(zone.unitsByFaction, faction, playerFor).some(
        (row) => !!row.unit.isStructure,
      ),
    ),
  );
}

const IL_NA_VIROSET = "Il Na Viroset (TF)";

type KingContext = {
  faction: string;
  playerFor: PlayerFor;
  battleTile: Tile;
  tiles: Tiles | undefined;
  /** Whether the side brings mechs to the fight. */
  hasMechs: boolean;
};

/**
 * What a Twilight's Fall king brings beyond its techs: Munitions Reserves,
 * one use per 2 trade goods it holds; Planesplitter in the Fracture;
 * Smothering Presence next to its structures; Il Na Viroset's Starlancer XI
 * bonus, +1 per anomaly its mechs are in or adjacent to; and its genomes that
 * are ready.
 */
function writeTwilightsFall(
  params: URLSearchParams,
  side: Side,
  player: PlayerData | undefined,
  context: KingContext,
) {
  if (!player) return;
  const exhausted = new Set(player.exhaustedTechs ?? []);
  const ready = (tech: string) =>
    !!player.techs?.includes(tech) && !exhausted.has(tech);
  if (ready(TF_MUNITIONS_RESERVES)) {
    const uses = Math.floor((player.tg ?? 0) / 2);
    if (uses > 0) params.set(`${side}-effect-Munitions Reserves`, String(uses));
  }
  if (ready(TF_PLANESPLITTER) && isInFracture(context.battleTile)) {
    params.set(`${side}-effect-Planesplitter (TF)`, "1");
  }
  if (
    ready(TF_SMOTHERING_PRESENCE) &&
    hasStructureInOrNextTo(
      context.faction,
      context.battleTile,
      context.tiles,
      context.playerFor,
    )
  ) {
    params.set(`${side}-effect-Smothering Presence (TF)`, "1");
  }
  if (
    CALC_FACTIONS[context.faction.toLowerCase()] === IL_NA_VIROSET &&
    context.hasMechs
  ) {
    const anomalies = anomaliesInOrNextTo(context.battleTile, context.tiles);
    if (anomalies > 0) {
      params.set(
        `${side}-effect-Starlancer XI anomaly bonus`,
        String(anomalies),
      );
    }
  }
  for (const leader of player.leaders ?? []) {
    const effect = CALC_GENOME_EFFECTS[leader.id];
    if (!effect || leader.type !== "agent") continue;
    if (leader.exhausted || leader.locked) continue;
    params.set(`${side}-effect-${effect}`, "1");
  }
}

/**
 * The printed stats of a Twilight's Fall unit upgrade, in the calculator's
 * compact form: `c5x2` combat, `a`, `b` and `s` for anti-fighter barrage,
 * bombardment and space cannon, `sd` sustain damage, `ps` planetary shield,
 * `dh` safe from Spark (Direct Hit), `nf` hits go to non-fighter ships if
 * able (Justicer Rail). The calculator has no model of these
 * spliced units, so it takes the numbers as they are printed, changed by the
 * modifiers given (from the upgrades kept beside the unit card).
 */
function unitStats(
  unit: Unit,
  combatValueModifier?: number,
  bonusCombatDice?: number,
): string {
  const roll = (token: string, hitsOn?: number, dice?: number) =>
    hitsOn ? [`${token}${hitsOn}x${dice ?? 1}`] : [];
  const combatHitsOn = unit.combatHitsOn
    ? modifiedCombatValue(unit.combatHitsOn, combatValueModifier)
    : undefined;
  const combatDice = (unit.combatDieCount ?? 1) + (bonusCombatDice ?? 0);
  const safeFromSpark =
    unit.canBeDirectHit === false ||
    /cannot be destroyed by "(Spark|Direct Hit)"/i.test(unit.ability ?? "");
  const hitsToNonFighters =
    /hits produced by this unit must be assigned to non-fighter ships/i.test(
      unit.ability ?? "",
    );
  return [
    ...roll("c", combatHitsOn, combatDice),
    ...roll("a", unit.afbHitsOn, unit.afbDieCount),
    ...roll("b", unit.bombardHitsOn, unit.bombardDieCount),
    ...roll("s", unit.spaceCannonHitsOn, unit.spaceCannonDieCount),
    ...(unit.sustainDamage ? ["sd"] : []),
    ...(unit.planetaryShield ? ["ps"] : []),
    ...(unit.sustainDamage && safeFromSpark ? ["dh"] : []),
    ...(hitsToNonFighters ? ["nf"] : []),
  ].join(".");
}

/**
 * Whether the unit is a Twilight's Fall unit upgrade spliced from another
 * faction (tf-…), which the calculator has no model of. The kings' own
 * flagships and mechs (redtf_flagship…) are not: the calculator models them.
 * A spliced flagship or mech only reaches the calculator when it is better
 * than the king's own; the calculator then sets its rolls and keeps the
 * king's abilities.
 */
const isSplicedUnit = (unit: Unit) =>
  unit.source === "twilights_fall" && unit.id.startsWith("tf");

/** Expected hits of one roll of a unit ability, 0 when it has none. */
const expectedHits = (hitsOn?: number, dice?: number) =>
  hitsOn ? (dice ?? 1) * Math.min(Math.max((11 - hitsOn) / 10, 0), 1) : 0;

/**
 * How good a unit card is in a fight: its combat roll first, then sustain
 * damage, then its other rolls. On a tie the upgraded card wins, since its
 * upgrade improves something else (move, capacity, a text ability).
 */
const unitScore = (unit: Unit) =>
  expectedHits(unit.combatHitsOn, unit.combatDieCount) * 100 +
  (unit.sustainDamage ? 10 : 0) +
  expectedHits(unit.afbHitsOn, unit.afbDieCount) +
  expectedHits(unit.bombardHitsOn, unit.bombardDieCount) +
  expectedHits(unit.spaceCannonHitsOn, unit.spaceCannonDieCount) +
  (unit.upgradesFromUnitId ? 0.001 : 0);

/**
 * The best card a Twilight's Fall king owns for a unit type. A king can own
 * several for one type: its own flagship or mech next to a spliced one, or a
 * generic unit next to a spliced upgrade. The best one is what fights.
 * Upgrades kept beside the unit card (Echo of Ascension, Eidolon mechs) do
 * not fight on their own: they change the card that does.
 */
function bestOwnedUnit(
  player: PlayerData | undefined,
  type: string,
): Unit | undefined {
  return (player?.unitsOwned ?? [])
    .map((id) => getUnitData(id))
    .filter(
      (unit): unit is Unit =>
        !!unit && unit.baseType === type && !isPlayAreaUnitUpgrade(unit.id),
    )
    .reduce<Unit | undefined>(
      (best, unit) => (!best || unitScore(unit) > unitScore(best) ? unit : best),
      undefined,
    );
}

type PlayerFor = (faction: string) => PlayerData | undefined;
type BattlePlace = "space" | "ground";
type Side = "attacker" | "defender";
type Force = { faction: string; rows: UnitRow[] };

function factionRows(
  unitsByFaction: Tile["unitsByFaction"] | undefined,
  faction: string,
  playerFor: PlayerFor,
): UnitRow[] {
  return (
    summarizeZone(unitsByFaction, playerFor, () => false).find(
      (summary) => summary.faction === faction,
    )?.rows ?? []
  );
}

const isPds = (row: UnitRow) => row.unit.baseType === "pds";
const isMech = (row: UnitRow) => row.unit.baseType === "mech";
const isShip = (row: UnitRow) => !!row.unit.isShip;
const isGroundForce = (row: UnitRow) => !!row.unit.isGroundForce;

/**
 * The faction's PDS in systems adjacent to the battle whose space cannon
 * reaches it (PDS II, Justicer Rail, Keeper Matrix…). The card checked is
 * the one that fires: for a Twilight's Fall king, its best PDS card, as
 * writeSide sends it. Adjacency follows the map and matching wormholes.
 */
function adjacentPdsRows(
  battleTile: Tile,
  faction: string,
  playerFor: PlayerFor,
  tiles: Tiles | undefined,
): UnitRow[] {
  const player = playerFor(faction);
  const king = isTwilightsFallKing(CALC_FACTIONS[faction.toLowerCase()]);
  const reaches = (row: UnitRow) =>
    !!((king && bestOwnedUnit(player, "pds")) || row.unit).deepSpaceCannon;
  return neighbourTiles(battleTile, tiles)
    .flatMap((tile) => [tile, ...Object.values(tile.planets)])
    .flatMap((zone) => factionRows(zone.unitsByFaction, faction, playerFor))
    .filter((row) => isPds(row) && reaches(row));
}

/**
 * Writes one side of the battle: faction, unit counts, damage already
 * sustained, unit upgrades and the owner's combat technologies. Returns
 * whether the force had anything the calculator can use.
 */
function writeSide(
  params: URLSearchParams,
  side: Side,
  { faction, rows }: Force,
  playerFor: PlayerFor,
  battleTile: Tile,
  tiles?: Tiles,
): boolean {
  const counts: Record<string, number> = {};
  const damaged: Record<string, number> = {};
  const upgraded = new Set<string>();
  const stats: Record<string, string> = {};
  const names: Record<string, string> = {};

  /* An unmapped faction (homebrew) still gets its units; the calculator then
     keeps whichever faction it last used on that side. */
  const calcFaction = CALC_FACTIONS[faction.toLowerCase()];
  const king = isTwilightsFallKing(calcFaction);
  const player = playerFor(faction);

  for (const row of rows) {
    const { count, sustained } = row;
    const type = row.unit.baseType;
    if (!CALC_UNIT_TYPES.has(type)) continue;
    counts[type] = (counts[type] ?? 0) + count;
    damaged[type] = (damaged[type] ?? 0) + sustained;
    const unit = (king && bestOwnedUnit(player, type)) || row.unit;
    /* Upgrades kept beside the card change its rolls (Echo of Ascension,
       Eidolon Terminus, Eidolon Landwaster): the calculator gets the rolls
       the unit really makes, and keeps a king's own unit abilities. The
       Starlancer XI anomaly bonus travels apart, so it is left out here. */
    const { combatValueModifier, bonusCombatDice } = getUnitModifiers(
      unit,
      player?.unitsOwned,
    );
    if (combatValueModifier || bonusCombatDice) {
      const upgrades = ownedPlayAreaUpgrades(type, player?.unitsOwned)
        .filter((id) => id !== unit.id)
        .map((id) => getUnitData(id)?.name)
        .filter((name): name is string => !!name);
      stats[type] = unitStats(unit, combatValueModifier, bonusCombatDice);
      names[type] = [unit.name, ...upgrades].join(" + ");
      continue;
    }
    if (king && unit.faction?.toLowerCase() === faction.toLowerCase()) {
      /* The king's own flagship or mech: the calculator models it. */
      continue;
    }
    if (isSplicedUnit(unit)) {
      const printed = unitStats(unit);
      if (printed) {
        stats[type] = printed;
        names[type] = unit.name;
      }
    } else if (unit.upgradesFromUnitId !== undefined) {
      upgraded.add(type);
    }
  }

  if (Object.keys(counts).length === 0) return false;

  if (calcFaction) params.set(`${side}-faction`, calcFaction);
  for (const [type, count] of Object.entries(counts)) {
    params.set(`${side}-unit-${type}`, String(count));
    if (damaged[type] > 0) {
      params.set(`${side}-damaged-${type}`, String(damaged[type]));
    }
  }
  for (const type of upgraded) params.set(`${side}-upgrade-${type}`, "true");
  for (const [type, printed] of Object.entries(stats)) {
    params.set(`${side}-stats-${type}`, printed);
    /* The calculator lists the card by name, so it is clear which it is. */
    if (names[type]) params.set(`${side}-unitname-${type}`, names[type]);
  }
  for (const effect of techEffects(player, side, king)) {
    params.set(`${side}-effect-${effect}`, "1");
  }
  if (king) {
    writeTwilightsFall(params, side, player, {
      faction,
      playerFor,
      battleTile,
      tiles,
      hasMechs: (counts.mech ?? 0) > 0,
    });
  }
  writeRelics(params, side, faction, playerFor, battleTile);
  return true;
}

/**
 * Writes the combat relics the side's owner has ready. Lightrail Ordnance
 * arms the owner's space docks in the battle's system; docks in adjacent
 * systems, which may also fire, are left to set by hand.
 */
function writeRelics(
  params: URLSearchParams,
  side: Side,
  faction: string,
  playerFor: PlayerFor,
  battleTile: Tile,
) {
  const relics = readyRelics(playerFor(faction));
  for (const relic of relics) {
    const effect = CALC_RELIC_EFFECTS[relic];
    if (effect) params.set(`${side}-effect-${effect}`, "1");
  }
  if (relics.includes(LIGHTRAIL_ORDNANCE)) {
    const docks = Object.values(battleTile.planets)
      .flatMap((planet) =>
        factionRows(planet.unitsByFaction, faction, playerFor),
      )
      .filter((row) => row.unit.baseType === "spacedock")
      .reduce((sum, row) => sum + row.count, 0);
    if (docks > 0) {
      params.set(`${side}-effect-Lightrail Ordnance`, String(docks));
    }
  }
}

/**
 * Writes the anomalies of the system that change a battle fought in it. An
 * entropic scar binds both sides, so the calculator takes it without a side;
 * a nebula favours the defender, and only in space.
 */
function writeTerrain(params: URLSearchParams, tile: Tile, place: BattlePlace) {
  const anomalies = systemAnomalies(tile);
  if (anomalies.includes("entropicScar")) {
    params.set("effect-Entropic Scar", "1");
  }
  if (place === "space" && anomalies.includes("nebula")) {
    params.set("defender-effect-Defending in nebula", "1");
  }
}

/**
 * Builds a ti4calc.leviatas.com link with the defender filled in and, when the
 * battle has one, the attacker on the other side of the table, in the
 * system's terrain. Returns null when the defender has nothing the
 * calculator can use.
 */
function buildBattleUrl(
  tile: Tile,
  defender: Force,
  attacker: Force | null,
  place: BattlePlace,
  playerFor: PlayerFor,
  tiles?: Tiles,
): string | null {
  const params = new URLSearchParams();
  if (attacker) {
    writeSide(params, "attacker", attacker, playerFor, tile, tiles);
  }
  if (!writeSide(params, "defender", defender, playerFor, tile, tiles)) {
    return null;
  }
  writeTerrain(params, tile, place);
  if (place === "ground") params.set("place", "ground");

  return `${BATTLE_CALC_URL}?${params}`;
}

/** Every faction with units anywhere in the system, space area first. */
export function factionsInSystem(tile: Tile): string[] {
  const zones = [tile, ...Object.values(tile.planets)];
  return [
    ...new Set(zones.flatMap((zone) => Object.keys(zone.unitsByFaction ?? {}))),
  ];
}

/**
 * Who is attacking in this system, when more than one faction is in it: the
 * active player if this is the system they activated, otherwise the only
 * faction present with a command token here. Null when the system is not
 * contested or the aggressor cannot be told.
 */
export function findAttacker(
  tile: Tile,
  gameState: GameState | null | undefined,
  players: PlayerData[],
): string | null {
  const present = factionsInSystem(tile);
  if (present.length < 2) return null;

  if (gameState?.activeSystem === tile.position) {
    const active = players.find(
      (player) => player.color === gameState.activePlayer,
    )?.faction;
    if (active && present.includes(active)) return active;
  }

  const activators = present.filter((faction) =>
    tile.commandCounters.includes(faction),
  );
  return activators.length === 1 ? activators[0] : null;
}

/**
 * The two forces of a fight in one zone, seen from one faction's row. With
 * no known attacker, or no one to fight, the faction stands alone as the
 * defender. Otherwise the attacker takes its side against this faction, or,
 * on the attacker's own row, against its single opponent in the zone.
 */
function matchUp(
  faction: string,
  attacker: string | null,
  contenders: string[],
  rowsFor: (faction: string, side: Side) => UnitRow[],
): { defender: Force; attacker: Force | null } {
  const alone = {
    defender: { faction, rows: rowsFor(faction, "defender") },
    attacker: null,
  };
  if (!attacker) return alone;

  const opponents = contenders.filter((other) => other !== attacker);
  const defender = faction === attacker ? opponents[0] : faction;
  if (!defender || (faction === attacker && opponents.length !== 1)) {
    return alone;
  }

  return {
    defender: { faction: defender, rows: rowsFor(defender, "defender") },
    attacker: { faction: attacker, rows: rowsFor(attacker, "attacker") },
  };
}

/**
 * What a side brings to a space combat from the space area: its ships and,
 * for a Twilight's Fall king, its mechs there too. Saint of Swords' mechs
 * (Colada) give a ship extra dice from the space area, and Il Na Viroset's
 * (Starlancer XI) fight as ships; mechs of other kings take no part.
 */
function spaceCombatRows(
  tile: Tile,
  faction: string,
  playerFor: PlayerFor,
): UnitRow[] {
  const king = isTwilightsFallKing(CALC_FACTIONS[faction.toLowerCase()]);
  return factionRows(tile.unitsByFaction, faction, playerFor).filter(
    (row) => isShip(row) || (king && isMech(row)),
  );
}

/**
 * Space battle for this system: each side's ships in the space area, plus
 * its PDS on the system's planets and those in adjacent systems that reach
 * it, which fire space cannon.
 */
export function buildSpaceBattleUrl(
  tile: Tile,
  faction: string,
  playerFor: PlayerFor,
  attacker: string | null = null,
  tiles?: Tiles,
): string | null {
  const shipsOf = (side: string) =>
    factionRows(tile.unitsByFaction, side, playerFor).filter(isShip);
  const rowsFor = (side: string) => [
    ...spaceCombatRows(tile, side, playerFor),
    ...Object.values(tile.planets)
      .flatMap((planet) => factionRows(planet.unitsByFaction, side, playerFor))
      .filter(isPds),
    ...adjacentPdsRows(tile, side, playerFor, tiles),
  ];
  if (shipsOf(faction).length === 0) return null;

  const contenders = Object.keys(tile.unitsByFaction ?? {}).filter(
    (side) => shipsOf(side).length > 0,
  );
  const fight = matchUp(faction, attacker, contenders, rowsFor);
  return buildBattleUrl(
    tile,
    fight.defender,
    fight.attacker,
    "space",
    playerFor,
    tiles,
  );
}

/**
 * Ground battle for one planet. The defender brings its ground forces and
 * PDS there. The attacker brings its ground forces on the planet and those
 * still in the space area, waiting to land, plus its ships, which bombard.
 */
export function buildGroundBattleUrl(
  tile: Tile,
  planet: TilePlanet,
  faction: string,
  playerFor: PlayerFor,
  attacker: string | null = null,
  tiles?: Tiles,
): string | null {
  const onPlanet = (side: string) =>
    factionRows(planet.unitsByFaction, side, playerFor);
  const rowsFor = (side: string, role: Side) => {
    const planetside = onPlanet(side).filter(
      (row) => isGroundForce(row) || isPds(row),
    );
    if (role === "defender") return planetside;
    return [
      ...planetside,
      ...factionRows(tile.unitsByFaction, side, playerFor).filter(
        (row) => isGroundForce(row) || isShip(row),
      ),
    ];
  };
  if (!onPlanet(faction).some(isGroundForce)) return null;

  const contenders = Object.keys(planet.unitsByFaction ?? {}).filter((side) =>
    onPlanet(side).some(isGroundForce),
  );
  const fight = matchUp(faction, attacker, contenders, rowsFor);
  return buildBattleUrl(
    tile,
    fight.defender,
    fight.attacker,
    "ground",
    playerFor,
    tiles,
  );
}

/**
 * A faction's ships and ground forces in the space area and on every planet,
 * plus its PDS there and those in adjacent systems that reach it.
 */
function systemRows(
  tile: Tile,
  faction: string,
  playerFor: PlayerFor,
  tiles: Tiles | undefined,
) {
  return [
    ...factionRows(tile.unitsByFaction, faction, playerFor).filter(
      (row) => isShip(row) || isGroundForce(row),
    ),
    ...Object.values(tile.planets)
      .flatMap((planet) =>
        factionRows(planet.unitsByFaction, faction, playerFor),
      )
      .filter((row) => isGroundForce(row) || isPds(row)),
    ...adjacentPdsRows(tile, faction, playerFor, tiles),
  ];
}

/**
 * A faction's whole presence in the system in one link: ships, PDS and the
 * ground forces of every planet summed, against the attacker's when there is
 * one. It opens on the space battle; the calculator's own space/ground
 * switch then reuses the same forces.
 */
export function buildSystemBattleUrl(
  tile: Tile,
  faction: string,
  playerFor: PlayerFor,
  attacker: string | null = null,
  tiles?: Tiles,
): string | null {
  const rowsFor = (side: string) => systemRows(tile, side, playerFor, tiles);
  const fight = matchUp(faction, attacker, factionsInSystem(tile), rowsFor);
  return buildBattleUrl(
    tile,
    fight.defender,
    fight.attacker,
    "space",
    playerFor,
    tiles,
  );
}

/**
 * The forces a picked attacker brings out of its zones. From a planet, its
 * ground forces there; from any zone of a system, whatever it has in that
 * system's space area, ships and ground forces waiting to land, counted once
 * however many zones of the system are picked.
 */
function pickedAttackerRows(
  tiles: Tiles,
  picks: BattleAttackerPick[],
  playerFor: PlayerFor,
): UnitRow[] {
  const rows: UnitRow[] = [];
  const positions = new Set(picks.map((pick) => pick.position));
  for (const position of positions) {
    const tile = tiles[position];
    if (!tile) continue;
    for (const pick of picks) {
      if (pick.position !== position || !pick.planetId) continue;
      const planet = tile.planets[pick.planetId];
      if (!planet) continue;
      rows.push(
        ...factionRows(planet.unitsByFaction, pick.faction, playerFor).filter(
          isGroundForce,
        ),
      );
    }
    const faction = picks[0].faction;
    rows.push(
      ...factionRows(tile.unitsByFaction, faction, playerFor).filter(
        (row) => isShip(row) || isGroundForce(row),
      ),
    );
  }
  return rows;
}

/**
 * A battle between a picked attacker, gathered from any zones and systems,
 * and one faction's forces in a zone of the defending system: its ships and
 * PDS in space, or its ground forces and PDS on a planet. The defender's
 * system sets the terrain. Null when either side has nothing the calculator
 * can use.
 */
export function buildPickedBattleUrl(
  tiles: Tiles,
  picks: BattleAttackerPick[],
  defenderTile: Tile,
  defenderPlanetId: string | null,
  defenderFaction: string,
  playerFor: PlayerFor,
): string | null {
  const planet = defenderPlanetId
    ? defenderTile.planets[defenderPlanetId]
    : undefined;
  const place: BattlePlace = planet ? "ground" : "space";
  const defenderRows = planet
    ? factionRows(planet.unitsByFaction, defenderFaction, playerFor).filter(
        (row) => isGroundForce(row) || isPds(row),
      )
    : [
        ...spaceCombatRows(defenderTile, defenderFaction, playerFor),
        ...Object.values(defenderTile.planets)
          .flatMap((p) =>
            factionRows(p.unitsByFaction, defenderFaction, playerFor),
          )
          .filter(isPds),
        ...adjacentPdsRows(defenderTile, defenderFaction, playerFor, tiles),
      ];

  return pickedBattleUrl(
    tiles,
    picks,
    defenderTile,
    { faction: defenderFaction, rows: defenderRows },
    place,
    playerFor,
  );
}

/**
 * A picked attacker, gathered from any zones and systems, against one
 * faction's whole presence in the defending system: ships, PDS and the
 * ground forces of every planet. It opens on the space battle; the
 * calculator's own space/ground switch then reuses the same forces.
 */
export function buildPickedSystemBattleUrl(
  tiles: Tiles,
  picks: BattleAttackerPick[],
  defenderTile: Tile,
  defenderFaction: string,
  playerFor: PlayerFor,
): string | null {
  return pickedBattleUrl(
    tiles,
    picks,
    defenderTile,
    {
      faction: defenderFaction,
      rows: systemRows(defenderTile, defenderFaction, playerFor, tiles),
    },
    "space",
    playerFor,
  );
}

/** The picked attacker against a defender's force, in the defender's terrain. */
function pickedBattleUrl(
  tiles: Tiles,
  picks: BattleAttackerPick[],
  defenderTile: Tile,
  defender: Force,
  place: BattlePlace,
  playerFor: PlayerFor,
): string | null {
  if (picks.length === 0) return null;
  const params = new URLSearchParams();
  const attacker = {
    faction: picks[0].faction,
    rows: [
      ...pickedAttackerRows(tiles, picks, playerFor),
      /* Its PDS next to the defending system fire too, in space. */
      ...(place === "space"
        ? adjacentPdsRows(defenderTile, picks[0].faction, playerFor, tiles)
        : []),
    ],
  };
  if (
    !writeSide(params, "attacker", attacker, playerFor, defenderTile, tiles)
  ) {
    return null;
  }
  if (
    !writeSide(params, "defender", defender, playerFor, defenderTile, tiles)
  ) {
    return null;
  }
  writeTerrain(params, defenderTile, place);
  if (place === "ground") params.set("place", "ground");

  return `${BATTLE_CALC_URL}?${params}`;
}
