export type TileData = {
  id: string;
  name?: string;
  aliases?: string[];
  imagePath: string;
  planets?: string[];
  shipPositionsType?: string;
  spaceTokenLocations?: Array<{ x: number; y: number }>;
  wormholes?: string[];
  isHyperlane?: boolean;
  isAsteroidField?: boolean;
  isSupernova?: boolean;
  isNebula?: boolean;
  isGravityRift?: boolean;
  imageURL?: string;
  source: string;
  tileBack?: string;
};

export type EntityData = {
  entityId: string;
  entityType: "unit" | "token" | "attachment";
  count: number;
  sustained?: number | null;
};

export type Unit = {
  id: string;
  baseType: string;
  asyncId: string;
  name: string;
  source: string;
  upgradesToUnitId?: string;
  upgradesFromUnitId?: string;
  requiredTechId?: string;
  faction?: string;
  subtitle?: string;
  moveValue?: number;
  capacityValue?: number;
  capacityUsed?: number;
  cost?: number;
  combatHitsOn?: number;
  combatDieCount?: number;
  afbHitsOn?: number;
  afbDieCount?: number;
  bombardHitsOn?: number;
  bombardDieCount?: number;
  spaceCannonHitsOn?: number;
  spaceCannonDieCount?: number;
  sustainDamage?: boolean;
  canBeDirectHit?: boolean;
  planetaryShield?: boolean;
  deepSpaceCannon?: boolean;
  disablesPlanetaryShield?: boolean;
  isShip?: boolean;
  isGroundForce?: boolean;
  isStructure?: boolean;
  isMonument?: boolean;
  isPlanetOnly?: boolean;
  isSpaceOnly?: boolean;
  productionValue?: string | number;
  basicProduction?: string;
  ability?: string;
  imageURL?: string;
  bgDecalPath?: string;
  homebrewReplacesID?: string;
  fleetSupplyBonus?: number;
  eligiblePlanetTypes?: string[];
  unlock?: string;
};

export type Token = {
  id: string;
  imagePath: string;
  spaceOrPlanet: "space" | "planet";
  aliasList: string[];
  source: string;
  attachmentID?: string;
  wormholes?: string[];
  isAnomaly?: boolean;
  isRift?: boolean;
  isNebula?: boolean;
  tokenPlanetName?: string;
  isPlanet?: boolean;
  scale?: number;
};

export type Tech = {
  alias: string;
  name: string;
  types: string[];
  source: string;
  text: string;
  imageURL?: string;
  requirements?: string;
  faction?: string;
  baseUpgrade?: string;
  initials?: string;
  shortName?: string;
  shrinkName?: boolean;
  homebrewReplacesID?: string;
};

export type Relic = {
  alias: string;
  name: string;
  text: string;
  imageURL?: string;
  source: string;
  flavourText?: string;
  shrinkName?: boolean;
  shortName?: string;
  homebrewReplacesID?: string;
  isFakeRelic?: boolean;
  actual_source?: string;
};

export type FactionUnits = {
  [factionName: string]: EntityData[];
};

export type PlanetEntityData = {
  controlledBy: string;
  entities: {
    [factionName: string]: EntityData[];
  };
  commodities: number | null;
};

type PlanetData = {
  [planetName: string]: PlanetEntityData;
};

export type Leader = {
  id: string;
  type: string;
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

export type LeaderData = {
  id: string;
  faction: string;
  type: string;
  name: string;
  title: string;
  abilityWindow: string;
  abilityText: string;
  unlockCondition: string;
  source: string;
  shortName?: string;
  abilityName?: string;
  shrinkName?: boolean;
  searchTags?: string[];
  homebrewReplacesID?: string;
};

export type CapturedUnitsData = {
  [factionColor: string]: string[];
};

export type TileUnitData = {
  space: {
    [factionName: string]: EntityData[];
  };
  planets: PlanetData;
  ccs: string[];
  anomaly: boolean;
  production: { [factionColor: string]: number };
  capacity?: {
    [factionColor: string]: { total: number; used: number; ignored: number };
  };
};

export type LawInPlay = {
  id: string;
  name: string;
  uniqueId: number;
  type: string;
  target: string;
  text1: string;
  text2: string;
  mapText: string;
  electedInfo: string | null;
  electedFaction: string | null;
  electedType: string | null;
  controlTokens: string[];
  displaysElectedFaction: boolean;
};

export type StrategyCard = {
  initiative: number;
  name: string;
  id: string;
  picked: boolean;
  played: boolean;
  exhausted: boolean;
  tradeGoods: number;
  pickedByFaction: string | null;
};

type CardPoolData = {
  secretObjectiveDeckSize: number;
  secretObjectiveFullDeckSize: number;
  secretObjectiveDeck: string[];
  secretObjectiveDiscard: string[];
  actionCardDeckSize: number;
  actionCardFullDeckSize: number;
  actionCardDiscardSize: number;
  actionCardPurgedSize: number;
  culturalExploreDeck: string[];
  culturalExploreDiscard: string[];
  industrialExploreDeck: string[];
  industrialExploreDiscard: string[];
  hazardousExploreDeck: string[];
  hazardousExploreDiscard: string[];
  frontierExploreDeck: string[];
  frontierExploreDiscard: string[];
  relicDeckSize: number;
  relicFullDeckSize: number;
  relicDeck: string[];
  relicDiscard: string[];
  agendaDeckSize: number;
  agendaFullDeckSize: number;
  agendaDiscardSize: number;
};

export type { CardPoolData };

export type PlayerDataResponse = {
  ringCount: number;
  playerData: PlayerData[];
  tileUnitData: Record<string, TileUnitData>;
  tilePositions: string[];
  statTilePositions: Record<string, string[]>;
  lawsInPlay: LawInPlay[];
  strategyCards: StrategyCard[];
  vpsToWin: number;
  objectives: Objectives;
  cardPool: CardPoolData;
  versionSchema?: number;
  gameRound: number;
  gameName: string;
  gameCustomName?: string;
};

export type PlayerData = {
  userName: string;
  faction: string;
  color: string;
  displayName: string;
  isSpeaker: boolean;
  passed: boolean;
  eliminated: boolean;
  active: boolean;
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  ccReinf: number;
  tg: number;
  commodities: number;
  commoditiesTotal: number;
  crf: number;
  hrf: number;
  irf: number;
  urf: number;
  stasisInfantry: number;
  actualHits: number;
  expectedHitsTimes10: number;
  spaceArmyRes: number;
  groundArmyRes: number;
  spaceArmyHealth: number;
  groundArmyHealth: number;
  spaceArmyCombat: number;
  groundArmyCombat: number;
  // Pre-calculated planet economics
  resources: number;
  influence: number;
  totResources: number;
  totInfluence: number;
  optimalResources: number;
  optimalInfluence: number;
  flexValue: number;
  totOptimalResources: number;
  totOptimalInfluence: number;
  totFlexValue: number;
  unitsOwned: string[];
  followedSCs: number[];
  unfollowedSCs: number[];
  promissoryNotesInPlayArea: string[];
  techs: string[];
  exhaustedTechs: string[];
  factionTechs: string[];
  notResearchedFactionTechs: string[];
  planets: string[];
  exhaustedPlanets: string[];
  exhaustedPlanetAbilities: string[];
  fragments: string[];
  relics: string[];
  exhaustedRelics: string[];
  leaders: Leader[];
  leaderIDs: string[];
  secretsScored: Record<string, number>;
  knownUnscoredSecrets: Record<string, number>;
  numUnscoredSecrets: number;
  numScoreableSecrets: number;
  flexibleDisplayName: string;
  scs: number[];
  exhaustedSCs: number[];
  totalVps: number;
  neighbors: string[];
  debtTokens?: Record<string, number>;
  nombox?: CapturedUnitsData;
  abilities?: string[];

  // card counts
  soCount: number;
  pnCount: number;
  acCount: number;

  // unit counts (to get reinforcements total)
  unitCounts: Record<
    string,
    {
      unitCap: number;
      deployedCount: number;
    }
  >;

  // ghost-specific properties
  sleeperTokensReinf?: number;
  ghostWormholesReinf?: string[];

  // mahact-specific properties
  mahactEdict?: string[];
};

export type Planet = {
  id: string;
  tileId: string | null;
  name: string;
  shortName?: string;
  shrinkName?: boolean;
  shortNamePNAttach?: any;
  shrinkNamePNAttach?: any;
  aliases: string[];
  positionInTile?: { x: number; y: number } | null;
  resources: number;
  influence: number;
  factionHomeworld?: string | null;

  planetType?:
  | "FACTION"
  | "CULTURAL"
  | "INDUSTRIAL"
  | "HAZARDOUS"
  | "NONE"
  | "MR";
  planetTypes?: ("CULTURAL" | "INDUSTRIAL" | "HAZARDOUS")[];
  cardImagePath?: string | null;
  techSpecialties?: string[] | null;
  legendaryAbilityName?: string | null;
  legendaryAbilityText?: string | null;
  legendaryAbilityFlavourText?: string | null;
  planetLayout?: {
    unitHolderName: string;
    resourcesLocation: "TopRight" | "BottomLeft" | "TopLeft" | "BottomRight";
    centerPosition: {
      x: number;
      y: number;
    };
  };
  contrastColor?: string;
  flavourText?: string | null;
  source: string;
  spaceCannonDieCount?: number;
  spaceCannonHitsOn?: number;
  searchTags?: string[];
};

export type Objective = {
  key: string;
  name: string;
  pointValue: number;
  revealed: boolean;
  scoredFactions: string[];
  peekingFactions: string[];
  multiScoring: boolean;
  progressThreshold: number;
  factionProgress: Record<string, number>;
};

export type Objectives = {
  stage1Objectives: Objective[];
  stage2Objectives: Objective[];
  customObjectives: Objective[];
  allObjectives: Objective[];
};

export type Agenda = {
  alias: string;
  name: string;
  type: "Directive" | "Law";
  target: string;
  text1: string;
  text2: string;
  source: "pok" | "base";
  forEmoji?: string;
  againstEmoji?: string;
  mapText?: string;
};

export type Agendas = Agenda[];

export type Ability = {
  id: string;
  name: string;
  faction: string;
  window?: string;
  windowEffect?: string;
  permanentEffect?: string;
  source: string;
  shortName?: string;
  homebrewReplacesID?: string;
};

export type PromissoryNote = {
  alias: string;
  name: string;
  color?: string;
  faction?: string;
  playArea: boolean;
  playImmediately?: boolean;
  source: string;
  text: string;
  shortName?: string;
  shrinkName?: boolean;
  attachment?: string | boolean;
  homebrewReplacesID?: string;
};

export type SecretObjective = {
  alias: string;
  name: string;
  phase: string;
  text: string;
  points: number;
  source: string;
  homebrewReplacesID?: string;
};

export type PublicObjective = {
  alias: string;
  name: string;
  phase: string;
  text: string;
  points: number;
  source: string;
  homebrewReplacesID?: string;
};

export type Color = {
  alias: string;
  name: string;
  displayName?: string;
  aliases: string[];
  textColor: string;
  primaryColor?: {
    red: number;
    green: number;
    blue: number;
  };
  secondaryColor?: {
    red: number;
    green: number;
    blue: number;
  };
  primaryColorRef?: string;
  secondaryColorRef?: string;
  hue?: string;
};

export type Exploration = {
  alias: string;
  name: string;
  text: string;
  source: string;
};

export type SpaceCannon = {
    diceCount: number;
    hitOn: number;
    deepSpace?: boolean;
}