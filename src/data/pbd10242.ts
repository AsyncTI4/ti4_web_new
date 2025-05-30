export interface Leader {
  id: string;
  type: string;
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
}

export interface PlayerData {
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
  flexibleDisplayName: string;
  scs: number[];
  neighbors: string[];

  // card counts
  soCount: number;
  pnCount: number;
  acCount: number;
}
