export type DashboardResponse = {
  profile: PlayerProfile;
  summary: DashboardSummary;
  games: DashboardGame[];
};

export type PlayerProfile = {
  userId: string;
  userName: string | null;
  tiglCurrentRank: string | null;
  tiglLatestRankAtGameStart: string | null;
  titles: TitleSummary;
  diceLuck: DiceLuckSummary;
  insights: PlayerInsights;
  aggregates: PlayerAggregates;
};

export type PlayerInsights = {
  activity: PlayerActivity;
  badges: BadgeAward[];
  imperialDoctrine?: ImperialDoctrine;
  favoredFactions: FavoredFaction[];
};

export type PlayerActivity = {
  totalTurns: number;
  averageTurnTimeSeconds: number | null;
};

export type BadgeAward = {
  key: string;
  name: string;
  tier: "SILVER" | "GOLD" | "LEGENDARY";
  description: string;
  primaryMetric: BadgeMetric;
  requirements: BadgeRequirement[];
  summary: string;
  tierRuleText: string;
};

export type BadgeMetric = {
  label: string;
  value: number;
  unit: "seconds" | "count" | "ratio" | string;
};

export type BadgeRequirement = {
  label: string;
  current: number;
  target: number;
  unit: "seconds" | "count" | "ratio" | string;
  met: boolean;
};

export type ImperialDoctrine = {
  archetype: string;
  traits: string[];
};

export type FavoredFaction = {
  faction: string;
  gamesPlayed: number;
  wins: number;
  winPercent: number | null;
};

export type TitleSummary = {
  totalCount: number;
  items: TitleItem[];
};

export type TitleItem = {
  title: string;
  count: number;
  gameIds: string[];
};

export type DiceLuckSummary = {
  actualHits: number;
  expectedHits: number;
  ratio: number | null;
};

export type DashboardSummary = {
  gamesPlayed: number;
  activeGames: number;
  finishedGames: number;
  abandonedGames: number;
  wins: number;
  winPercent: number | null;
};

/* ─── Aggregates ─── */

export type PlayerAggregates = {
  ready: boolean;
  completedGamesHash: string;
  completedGameCount: number;
  eligibleGameCount: number;
  aggregatesVersion: number;
  computedAtEpochMs: number | null;
  completedGameIds: string[];
  techStats: TechStatsAggregate;
  factionWinStats: FactionWinStatsAggregate;
  strategyCardStats?: StrategyCardStats;
  combatProfile?: CombatProfile;
  economyProfile?: EconomyProfile;
  factionTechSynergy?: FactionTechSynergy;
  speakerImpact?: SpeakerImpact;
  aggressionProfile?: AggressionProfile;
};

export type TechStatsAggregate = {
  byTech: Record<string, TechAggregateStat>;
};

export type TechAggregateStat = {
  gamesWithTech: number;
  percentInEligibleGames: number;
};

export type FactionWinStatsAggregate = {
  byFaction: Record<string, number>;
};

/* ── Strategy Card Stats ── */

export type ScStat = {
  totalPicks: number;
  gamesPicked: number;
  winsInGamesPicked: number;
  winRateWhenPicked: number;
};

export type StrategyCardStats = {
  bySc: Record<string, ScStat>;
  meta: {
    completedGamesConsidered: number;
    gamesWithRoundStats: number;
  };
};

/* ── Combat Profile ── */

export type CombatTotals = {
  combatsInitiated: number;
  tacticalsWithCombat: number;
  planetsTaken: number;
  planetsStolen: number;
  diceRolled: number;
};

export type CombatProfile = {
  totals: CombatTotals;
  averagesPerCompletedGame: CombatTotals;
  coverage: AggregateCoverage;
};

export type AggregateCoverage = {
  completedGamesConsidered: number;
  gamesWithRoundStats: number;
};

/* ── Economy Profile ── */

export type EconomyProfile = {
  totalExpensesSum: number;
  avgTotalExpenses: number;
  completedGamesConsidered: number;
};

/* ── Faction-Tech Synergy ── */

export type FactionTechSynergyStat = {
  gamesWithTech: number;
  winsWithTech: number;
  nonWinsWithTech: number;
  winRateWhenTech: number;
};

export type FactionSynergyEntry = {
  games: number;
  wins: number;
  nonWins: number;
  byTech: Record<string, FactionTechSynergyStat>;
};

export type FactionTechSynergy = {
  byFaction: Record<string, FactionSynergyEntry>;
};

/* ── Speaker Impact ── */

export type SpeakerBucket = {
  games: number;
  wins: number;
  winRate: number;
};

export type SpeakerImpact = {
  speaker: SpeakerBucket;
  nonSpeaker: SpeakerBucket;
  deltaWinRate: number;
};

/* ── Aggression Profile ── */

export type AggressionProfile = {
  weights: {
    combatsInitiated: number;
    planetsStolen: number;
    tacticalsWithCombat: number;
  };
  byGame: Record<string, number>;
  summary: {
    avgScore: number;
    medianScore: number;
    maxScore: number;
    minScore: number;
    mostAggressiveGameId: string;
  };
  coverage: AggregateCoverage;
};

/* ─── Game Types ─── */

export type DashboardGame = {
  gameId: string;
  title: string;
  status: string;
  isActive: boolean;
  isFinished: boolean;
  isAbandoned: boolean;
  createdAtEpochMs: number;
  lastUpdatedEpochMs: number;
  endedAtEpochMs: number | null;
  vpTarget: number;
  round: number;
  isTiglGame: boolean;
  tiglMinimumRankAtStart: string | null;
  packs: GamePacks;
  gameModes: string[];
  galacticEvents: GalacticEvents;
  yourSeat: YourSeat;
  participatingFactionIds: string[];
  participatingPlayerNames: string[];
  participants: GameParticipant[];
  actionsJumpUrl: string | null;
  tableTalkJumpUrl: string | null;
};

export type GamePacks = {
  baseGame: boolean;
  prophecyOfKings: boolean;
  discordantStars: boolean;
  thundersEdge: boolean;
  thundersEdgeDemo: boolean;
  twilightsFall: boolean;
  absol: boolean;
  miltyMod: boolean;
  franken: boolean;
  votc: boolean;
};

export type GalacticEvents = {
  eventDeckId: string | null;
  inEffect: GalacticEvent[];
};

export type GalacticEvent = {
  eventId: string;
  name: string;
  instanceId: number | null;
};

export type YourSeat = {
  userId: string;
  userName: string;
  faction: string | null;
  color: string | null;
  score: number;
  eliminated: boolean;
  passed: boolean;
  isWinner: boolean;
  isActivePlayer: boolean;
  tiglRankAtGameStart: string | null;
  diceLuck: DiceLuckSummary;
};

export type GameParticipant = {
  userId: string;
  userName: string;
  faction: string | null;
  color: string | null;
  score: number;
  eliminated: boolean;
  isWinner: boolean;
};
