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
  entityType: "unit" | "token" | "attachment" | "actioncard";
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
  controlledBy: string | null;
  entities: {
    [factionName: string]: EntityData[];
  };
  commodities: number | null;
  planetaryShield: boolean;
  exhausted?: boolean;
  resources: number | null;
  influence: number | null;
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
  tfName?: string;
  tfTitle?: string;
  tfAbilityWindow?: string;
  tfAbilityText?: string;
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
  /** Hyperlane connection matrix (6x6 binary rows, "i,j,...;..." format); null if not a hyperlane
   * tile or no connection data is configured yet. See the bot's CustomHyperlaneService. */
  hyperlaneMatrix?: string | null;
  /** True if this position is outside current vision and this is a remembered "ghost" snapshot.
   * See the bot's WebTileUnitData#markGhostTiles. */
  ghost?: boolean;
  /** Viewer's last-seen label for this position (e.g. "Rnd 4"); set only when ghost is true. */
  fogLabel?: string;
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
  /** Total VP - always public (score track position), even for players otherwise redacted. */
  totalVps?: number;
};

export type Expedition = {
  /** Player color; null if incomplete. Always the real color when completed - the backend
   * doesn't redact this, since identity is derived client-side from whether that color's
   * player is present in playerData (see ExpeditionTokens.tsx). */
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
  /** Score-track totals for players the viewer can't identify, detached from any faction so they
   * can be placed on the track without revealing who they are. Sorted; empty outside FoW. */
  hiddenPlayerVps?: number[];
  borderAnomalies?: BorderAnomalyInfo[];
  isTwilightsFallMode?: boolean;
  gameState?: GameState;
  /** Increments whenever new game events are available; used to invalidate the events query without polling. */
  eventSequence?: number;
  /** Whether this game has Fog of War enabled. */
  isFowMode?: boolean;
  /** FoW HIDE_PLAYER_INFOS option: true when other players' info panels should be hidden. */
  hidePlayerInfos?: boolean;
  /**
   * Set only on a fogged response: the discord ID of the player whose view this is.
   * Absent when the viewer is the GM/owner seeing the full unfiltered map.
   */
  viewingAsPlayerId?: string;
  /**
   * Whether the authenticated caller is GM/owner of this game. Derived client-side from the
   * `X-Viewer-Is-Gm` response header (not part of the JSON body), since it stays true even
   * while a GM is previewing another player's fogged view via viewingAsPlayerId.
   */
  viewerIsGm?: boolean;
};

export type GameEventArchetype =
  | "TACTICAL_ACTION"
  | "TURN"
  | "CARD_PLAY_ACTION_CARD"
  | "CARD_PLAY_PROMISSORY_NOTE"
  | "CARD_PLAY_AGENT"
  | "CARD_PLAY_HERO"
  | "CARD_PLAY_RELIC"
  | "CARD_PLAY_TECH_EXHAUST"
  | "CARD_PLAY_BREAKTHROUGH"
  | "CARD_PLAY_ABILITY"
  | "TECH_RESEARCHED"
  | "SC_PLAYED"
  | "SC_PICKED"
  | "OBJECTIVE_SCORED"
  | "STATUS_SCORING"
  | "AGENDA_RESOLVED"
  | "TRANSACTION"
  | "PRODUCTION"
  | "MANUAL_COMMAND"
  | "PHASE_STARTED"
  | "ROUND_STARTED"
  | "GAME_ENDED";

/** Structured sub-events embedded in TACTICAL_ACTION payloads (payload.subEvents). */
export type GameSubEvent =
  | {
      type: "COMBAT";
      kind: "space" | "ground";
      tile: string | null;
      planet: string | null;
      vsFaction: string;
    }
  | { type: "CONTROL_ESTABLISHED"; planet: string; faction?: string }
  | {
      type: "ACTION_CARD_PLAYED";
      faction: string;
      cardId: string;
      cardName: string;
    }
  | {
      type: "LEADER_PLAYED";
      faction: string;
      leaderType: "AGENT" | "HERO";
      leaderId: string;
    }
  | { type: "TECH_EXHAUSTED"; faction: string; techId: string }
  | {
      type: "OBJECTIVE_SCORED";
      faction: string;
      objectiveId: string;
      category: "PUBLIC" | "SECRET" | "CUSTODIAN" | (string & {});
    }
  | {
      type: "PRODUCTION";
      tile: string | null;
      units: Record<string, number> | null;
      cost: number | null;
    }
  | {
      type: "RETREAT";
      faction: string;
      fromTile: string;
      fromHolder: string;
      toTile: string;
      toHolder: string;
      units: Record<string, [number, number, number, number]>;
    }
  | { type: "MANUAL_COMMAND"; user: string | null; command: string };

export type GameEvent = {
  seq: number;
  archetype: GameEventArchetype | (string & {});
  round: number;
  phase: string;
  faction: string | null;
  timestamp: number;
  payload: Record<string, unknown>;
  mapState?: string | null;
  movementState?: string | null;
};

export type GamePhase =
  | "unknown"
  | "setup.draft"
  | "setup.players"
  | "strategy"
  | "action"
  | "status.scoring"
  | "status.homework"
  | "agenda.readyToFlip"
  | "agenda.whens"
  | "agenda.afters"
  | "agenda.voting"
  | "agenda.resolving"
  | "finished";

export type GameStateAgenda = {
  id: string;
  startVoteCounts: Record<string, number>;
  castVoteCounts: Record<string, number>;
  outcomeVoteCounts: Record<string, number>;
  resolvedOutcome: string | null;
};

export type GameStateCombat = {
  system: string | null;
  unitHolder: string | null;
  round: number | null;
  participantColors: string[];
};

export type GameState = {
  phase: GamePhase;
  activePlayer: string | null;
  turnStartedAt: number | null;
  winner: string | null;
  agenda: GameStateAgenda | null;
  activeSystem: string | null;
  activeCombat: GameStateCombat | null;
};

export type GameStateMessage = {
  type: "gameState";
  seq: number;
  timestamp: number;
  full: boolean;
  /** Deep-partial merge patch of the full web-data document (PlayerDataResponse); the whole document when full=true. */
  patch: unknown;
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
  isTyrant: boolean;
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

  // nekro-specific properties (Thunder's Edge)
  valefarZTargets?: string[];

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
  /** Only scorers the viewer can identify; see unidentifiedScorerCount for the rest. */
  scoredFactions: string[];
  peekingFactions: string[];
  /** Scorers the viewer can't identify, as a bare count - the backend withholds their factions
   * entirely rather than sending them for the client to hide (see WebObjectives#redactScorers).
   * 0 outside FoW. */
  unidentifiedScorerCount?: number;
  multiScoring: boolean;
  hasRedTape: boolean;
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
