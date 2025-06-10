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

export type FactionUnits = {
  [factionName: string]: EntityData[];
};

export type PlanetEntityData = {
  controlledBy: string;
  entities: {
    [factionName: string]: EntityData[];
  };
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

export type CapturedUnitsData = {
  [factionColor: string]: string[];
};

export type TileUnitData = {
  space: {
    [factionName: string]: EntityData[];
  };
  planets: PlanetData;
  ccs: string[];
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
  forEmoji: string;
  againstEmoji: string;
  source: string;
  electedInfo: string | null;
  electedFaction: string | null;
  electedColor: string | null;
  electedDisplayName: string | null;
  electedType: string;
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
  actionCardDeckSize: number;
  actionCardFullDeckSize: number;
  actionCardDiscardSize: number;
  actionCardPurgedSize: number;
  culturalExploreDeckSize: number;
  culturalExploreDiscardSize: number;
  culturalExploreFullDeckSize: number;
  industrialExploreDeckSize: number;
  industrialExploreDiscardSize: number;
  industrialExploreFullDeckSize: number;
  hazardousExploreDeckSize: number;
  hazardousExploreDiscardSize: number;
  hazardousExploreFullDeckSize: number;
  frontierExploreDeckSize: number;
  frontierExploreDiscardSize: number;
  frontierExploreFullDeckSize: number;
  relicDeckSize: number;
  relicFullDeckSize: number;
  agendaDeckSize: number;
  agendaFullDeckSize: number;
  agendaDiscardSize: number;
};

export type { CardPoolData };

export type PlayerDataResponse = {
  playerData: PlayerData[];
  tileUnitData: Record<string, TileUnitData>;
  tilePositions: string[];
  statTilePositions: Record<string, string[]>;
  lawsInPlay: LawInPlay[];
  strategyCards: StrategyCard[];
  vpsToWin: number;
  objectives: Objectives;
  cardPool: CardPoolData;
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
  numScoreableSecrets: number;
  flexibleDisplayName: string;
  scs: number[];
  exhaustedSCs: number[];
  totalVps: number;
  neighbors: string[];
  debtTokens?: Record<string, number>;
  nombox?: CapturedUnitsData;

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
};

export type Planet = {
  id: string;
  tileId: string | null;
  name: string;
  shortName?: string;
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
  flavourText?: string;
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
};

export type Objectives = {
  stage1Objectives: Objective[];
  stage2Objectives: Objective[];
  customObjectives: Objective[];
  allObjectives: Objective[];
};
