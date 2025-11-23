export type Breakthrough = {
  alias: string;
  name: string;
  displayName?: string;
  faction: string;
  synergy: string[];
  text: string;
  source: string;
};
export type TileData = {
  id: string;
  name?: string | null;
  aliases?: string[];
  imagePath: string;
  planets?: string[];
  shipPositionsType?: string | null;
  spaceTokenLocations?: Array<{ x: number; y: number }>;
  wormholes?: string[] | null;
  isHyperlane?: boolean;
  isAsteroidField?: boolean;
  isSupernova?: boolean;
  isNebula?: boolean;
  isGravityRift?: boolean;
  imageURL?: string;
  source: string;
  tileBack?: string;
  valid?: boolean;
};

export type EntityData = {
  entityId: string;
  entityType: "unit" | "token" | "attachment";
  count: number;
  unitStates?: [number, number, number, number];
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
  spaceOrPlanet?: string;
  aliasList?: string[];
  source: string;
  attachmentID?: string;
  wormholes?: string[];
  isAnomaly?: boolean;
  isRift?: boolean;
  isNebula?: boolean;
  tokenPlanetName?: string;
  isPlanet?: boolean;
  scale?: number;
  placement?: "rim" | "center";
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
  actualSource?: string;
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
  planetaryShield: boolean;
  resources: number;
  influence: number;
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
  pds: {
    [factionName: string]: { count: number; expected: number };
  } | null;
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

export type EntryType =
  | "PO_1"
  | "PO_2"
  | "SECRET"
  | "CUSTODIAN"
  | "IMPERIAL"
  | "CROWN"
  | "LATVINIA"
  | "SFTT"
  | "SHARD"
  | "STYX"
  | "AGENDA";

export type EntryState = "SCORED" | "QUALIFIES" | "POTENTIAL" | "UNSCORED";

export type ScoreBreakdownEntry = {
  type: EntryType;
  objectiveKey?: string;
  agendaKey?: string;
  description: string;
  state: EntryState;
  losable: boolean;
  currentProgress?: number;
  totalProgress?: number;
  pointValue: number;
  tombInPlay?: boolean;
  canDrawSecret?: boolean;
};

export type WebScoreBreakdown = {
  entries: ScoreBreakdownEntry[];
};

export type Expedition = {
  completedBy: string | null;
};

export type Expeditions = {
  techSkip: Expedition;
  tradeGoods: Expedition;
  fiveRes: Expedition;
  fiveInf: Expedition;
  secret: Expedition;
  actionCards: Expedition;
};

export type BorderAnomalyInfo = {
  tile: string;
  direction: number;
  type: string; // e.g., "void_tether", "spatial_tear", etc.
};

export type PlayerDataResponse = {
  expeditions: Expeditions;
  ringCount: number;
  playerData: PlayerData[];
  tileUnitData: Record<string, TileUnitData>;
  tilePositions: string[];
  statTilePositions: Record<string, string[]>;
  lawsInPlay: LawInPlay[];
  strategyCards: StrategyCard[];
  strategyCardIdMap?: Record<number, string>; // Map of initiative -> strategy card ID
  vpsToWin: number;
  objectives: Objectives;
  cardPool: CardPoolData;
  versionSchema?: number;
  gameRound: number;
  gameName: string;
  gameCustomName?: string;
  tableTalkJumpLink?: string;
  actionsJumpLink?: string;
  scoreBreakdowns?: Record<string, WebScoreBreakdown>;
  borderAnomalies?: BorderAnomalyInfo[];
};

export type BreakthroughData = {
  breakthroughId: string;
  unlocked: boolean;
  exhausted: boolean;
  tradeGoodsStored: number;
};

export type PlotCardInfo = {
  identifier: number;
  name: string;
  text: string;
  source: string;
};

export type PlotCard = {
  plotAlias?: string;
  identifier: number;
  factions: string[];
};

export type PlayerData = {
  breakthrough?: BreakthroughData;
  plotCards?: PlotCard[];
  discordId: string;
  userName: string;
  faction: string;
  factionImage?: string;
  factionImageType?: string;

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
  customPromissoryNotes?: string[];
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
  decalId?: string;

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
  breachTokensReinf?: number;
  galvanizeTokensReinf?: number;

  // mahact-specific properties
  mahactEdict?: string[];

  hasZeroToken?: boolean;
};

export type Planet = {
  id: string;
  tileId?: string | null;
  name: string;
  shortName?: string;
  shrinkName?: boolean;
  shortNamePNAttach?: string | null;
  shrinkNamePNAttach?: boolean | null;
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
    extraIcons?: number | null;
    planetRadius?: number | null;
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
  type: string;
  target: string;
  text1: string;
  text2?: string;
  category?: string;
  categoryDescription?: string;
  source:
    | "pok"
    | "base"
    | "absol"
    | "mahact"
    | "ignis_aurora"
    | "byz_agendas"
    | "voices_of_the_council"
    | "little_omega"
    | "miltymod"
    | "project_pi"
    | "sigma"
    | "omega_phase"
    | "riftset";
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
  id: string;
  type?: string;
  resolution?: string;
  attachmentId?: string;
  flavorText?: string;
  name: string;
  text: string;
  source: string;
};

export type AttachmentData = {
  id: string;
  name?: string;
  imagePath: string;
  techSpeciality?: string[];
  resourcesModifier?: number;
  influenceModifier?: number;
  token?: string;
  isLegendary?: boolean;
  isFakeAttachment?: boolean;
  planetTypes?: string[];
  spaceCannonHitsOn?: number;
  spaceCannonDieCount?: number;
  source: string;
};

export type ActionCard = {
  alias: string;
  name: string;
  phase: string;
  window: string;
  text: string;
  automationID?: string;
  actual_source?: string;
  flavorText?: string;
  source: string;
};

export type StrategyCardDefinition = {
  id: string;
  initiative: number;
  name: string;
  primaryTexts: string[];
  secondaryTexts: string[];
  imageFileName?: string;
  colourHexCode?: string;
  source: string;
  imageURL: string;
};
