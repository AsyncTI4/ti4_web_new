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
};

export type PlayerInsights = {
  activity: PlayerActivity;
  badges: BadgeAward[];
  imperialDoctrine: ImperialDoctrine;
  favoredHouses: FavoredHouse[];
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

export type FavoredHouse = {
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

export type DashboardGame = {
  gameId: string;
  title: string;
  status: "ACTIVE" | "FINISHED" | "ABANDONED" | "INACTIVE";
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
