import type { PlayerData } from "@/entities/data/types";
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

/**
 * The calculator effects a player can bring to a battle right now: every
 * modelled technology they have researched and not exhausted. The calculator
 * itself drops the ones that do not apply to the battle being run.
 */
function techEffects(player: PlayerData | undefined): string[] {
  if (!player) return [];
  const exhausted = new Set(player.exhaustedTechs ?? []);
  const effects = (player.techs ?? [])
    .filter((tech) => !exhausted.has(tech))
    .map((tech) => CALC_TECH_EFFECTS[tech])
    .filter(Boolean);
  return [...new Set(effects)];
}

type PlayerFor = (faction: string) => PlayerData | undefined;
type BattlePlace = "space" | "ground";

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

/**
 * Builds a ti4battle.com link with the given force set as the defender: unit
 * counts, damage already sustained, unit upgrades and the owner's combat
 * technologies. Returns null when the force has nothing the calculator can
 * use.
 */
function buildDefenderUrl(
  faction: string,
  rows: UnitRow[],
  place: BattlePlace,
  player: PlayerData | undefined,
): string | null {
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

  if (Object.keys(counts).length === 0) return null;

  /* An unmapped faction (homebrew) still gets its units; the calculator then
     keeps whichever defender faction it last used. */
  const params = new URLSearchParams();
  const calcFaction = CALC_FACTIONS[faction.toLowerCase()];
  if (calcFaction) params.set("defender-faction", calcFaction);
  for (const [type, count] of Object.entries(counts)) {
    params.set(`defender-unit-${type}`, String(count));
    if (damaged[type] > 0) {
      params.set(`defender-damaged-${type}`, String(damaged[type]));
    }
  }
  for (const type of upgraded) params.set(`defender-upgrade-${type}`, "true");
  for (const effect of techEffects(player)) {
    params.set(`defender-effect-${effect}`, "1");
  }
  if (place === "ground") params.set("place", "ground");

  return `${BATTLE_CALC_URL}?${params}`;
}

/**
 * Space battle for this system: the faction's ships in the space area plus
 * its PDS on the system's planets, which fire space cannon.
 */
export function buildSpaceBattleUrl(
  tile: Tile,
  faction: string,
  playerFor: PlayerFor,
): string | null {
  const ships = factionRows(tile.unitsByFaction, faction, playerFor).filter(
    (row) => row.unit.isShip,
  );
  const pds = Object.values(tile.planets)
    .flatMap((planet) => factionRows(planet.unitsByFaction, faction, playerFor))
    .filter(isPds);

  if (ships.length === 0) return null;
  return buildDefenderUrl(
    faction,
    [...ships, ...pds],
    "space",
    playerFor(faction),
  );
}

/**
 * Ground battle for one planet: the faction's ground forces there plus its
 * PDS on that planet, which fire space cannon at the landing troops.
 */
export function buildGroundBattleUrl(
  planet: TilePlanet,
  faction: string,
  playerFor: PlayerFor,
): string | null {
  const rows = factionRows(planet.unitsByFaction, faction, playerFor);
  const groundForces = rows.filter((row) => row.unit.isGroundForce);

  if (groundForces.length === 0) return null;
  return buildDefenderUrl(
    faction,
    [...groundForces, ...rows.filter(isPds)],
    "ground",
    playerFor(faction),
  );
}

/** Every faction with units anywhere in the system, space area first. */
export function factionsInSystem(tile: Tile): string[] {
  const zones = [tile, ...Object.values(tile.planets)];
  return [
    ...new Set(zones.flatMap((zone) => Object.keys(zone.unitsByFaction ?? {}))),
  ];
}

/**
 * The faction's whole presence in the system in one link: ships, PDS and the
 * ground forces of every planet summed. It opens on the space battle; the
 * calculator's own space/ground switch then reuses the same force.
 */
export function buildSystemBattleUrl(
  tile: Tile,
  faction: string,
  playerFor: PlayerFor,
): string | null {
  const ships = factionRows(tile.unitsByFaction, faction, playerFor).filter(
    (row) => row.unit.isShip,
  );
  const planetside = Object.values(tile.planets)
    .flatMap((planet) => factionRows(planet.unitsByFaction, faction, playerFor))
    .filter((row) => row.unit.isGroundForce || isPds(row));

  return buildDefenderUrl(
    faction,
    [...ships, ...planetside],
    "space",
    playerFor(faction),
  );
}
