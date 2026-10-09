import type { GameState, PlayerData } from "@/entities/data/types";
import type { Tile, TilePlanet } from "@/entities/game/types";
import { summarizeZone, type UnitRow } from "./fleetMath";

const BATTLE_CALC_URL = "https://ti4battle.com/";

/** Unit types ti4battle.com knows, which share their names with our base types. */
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

/** Our faction ids mapped to the faction names ti4battle.com expects. */
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
};

/**
 * Technologies ti4battle.com models, keyed by our tech id and mapped to its
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

/** Effects the calculator would apply to an attacker but the rules do not. */
const DEFENDER_ONLY_EFFECTS = new Set(["Magen Defense Grid"]);

/**
 * The calculator effects a player can bring to a battle right now: every
 * modelled technology they have researched and not exhausted. The calculator
 * itself drops the ones that do not apply to the battle being run.
 */
function techEffects(player: PlayerData | undefined, side: Side): string[] {
  if (!player) return [];
  const exhausted = new Set(player.exhaustedTechs ?? []);
  const effects = (player.techs ?? [])
    .filter((tech) => !exhausted.has(tech))
    .map((tech) => CALC_TECH_EFFECTS[tech])
    .filter(Boolean)
    .filter(
      (effect) => side === "defender" || !DEFENDER_ONLY_EFFECTS.has(effect),
    );
  return [...new Set(effects)];
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
const isShip = (row: UnitRow) => !!row.unit.isShip;
const isGroundForce = (row: UnitRow) => !!row.unit.isGroundForce;

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
): boolean {
  const counts: Record<string, number> = {};
  const damaged: Record<string, number> = {};
  const upgraded = new Set<string>();

  for (const { unit, count, sustained } of rows) {
    const type = unit.baseType;
    if (!CALC_UNIT_TYPES.has(type)) continue;
    counts[type] = (counts[type] ?? 0) + count;
    damaged[type] = (damaged[type] ?? 0) + sustained;
    if (unit.upgradesFromUnitId !== undefined) upgraded.add(type);
  }

  if (Object.keys(counts).length === 0) return false;

  /* An unmapped faction (homebrew) still gets its units; the calculator then
     keeps whichever faction it last used on that side. */
  const calcFaction = CALC_FACTIONS[faction.toLowerCase()];
  if (calcFaction) params.set(`${side}-faction`, calcFaction);
  for (const [type, count] of Object.entries(counts)) {
    params.set(`${side}-unit-${type}`, String(count));
    if (damaged[type] > 0) {
      params.set(`${side}-damaged-${type}`, String(damaged[type]));
    }
  }
  for (const type of upgraded) params.set(`${side}-upgrade-${type}`, "true");
  for (const effect of techEffects(playerFor(faction), side)) {
    params.set(`${side}-effect-${effect}`, "1");
  }
  return true;
}

/**
 * Builds a ti4battle.com link with the defender filled in and, when the
 * battle has one, the attacker on the other side of the table. Returns null
 * when the defender has nothing the calculator can use.
 */
function buildBattleUrl(
  defender: Force,
  attacker: Force | null,
  place: BattlePlace,
  playerFor: PlayerFor,
): string | null {
  const params = new URLSearchParams();
  if (attacker) writeSide(params, "attacker", attacker, playerFor);
  if (!writeSide(params, "defender", defender, playerFor)) return null;
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
 * Space battle for this system: each side's ships in the space area, plus
 * its PDS on the system's planets, which fire space cannon.
 */
export function buildSpaceBattleUrl(
  tile: Tile,
  faction: string,
  playerFor: PlayerFor,
  attacker: string | null = null,
): string | null {
  const shipsOf = (side: string) =>
    factionRows(tile.unitsByFaction, side, playerFor).filter(isShip);
  const rowsFor = (side: string) => [
    ...shipsOf(side),
    ...Object.values(tile.planets)
      .flatMap((planet) => factionRows(planet.unitsByFaction, side, playerFor))
      .filter(isPds),
  ];
  if (shipsOf(faction).length === 0) return null;

  const contenders = Object.keys(tile.unitsByFaction ?? {}).filter(
    (side) => shipsOf(side).length > 0,
  );
  const fight = matchUp(faction, attacker, contenders, rowsFor);
  return buildBattleUrl(fight.defender, fight.attacker, "space", playerFor);
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
  return buildBattleUrl(fight.defender, fight.attacker, "ground", playerFor);
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
): string | null {
  const rowsFor = (side: string) => [
    ...factionRows(tile.unitsByFaction, side, playerFor).filter(
      (row) => isShip(row) || isGroundForce(row),
    ),
    ...Object.values(tile.planets)
      .flatMap((planet) => factionRows(planet.unitsByFaction, side, playerFor))
      .filter((row) => isGroundForce(row) || isPds(row)),
  ];

  const fight = matchUp(faction, attacker, factionsInSystem(tile), rowsFor);
  return buildBattleUrl(fight.defender, fight.attacker, "space", playerFor);
}
