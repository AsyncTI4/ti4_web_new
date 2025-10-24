import { Group, Text, Image, Stack, Flex } from "@mantine/core";
import { PlayerData, Objectives, EntryType } from "@/data/types";
import { PlayerColor } from "@/components/PlayerArea/PlayerColor";
import styles from "./PlayerScoreSummary.module.css";
import legendStyles from "./PlayerScoreSummaryLegend.module.css";
import styxStyles from "./StyxIcon.module.css";
import { useFactionImages } from "@/hooks/useFactionImages";
import { ObjectiveChip } from "./ObjectiveChip";
import { cdnImage } from "@/data/cdnImage";
import { IconAlertTriangle, IconBook2, IconDiamond } from "@tabler/icons-react";
import { useGameData } from "@/hooks/useGameContext";
import cx from "clsx";
import type { ReactNode } from "react";
import cornerBadgeStyles from "./CornerBadgeIcon.module.css";
import vpTokenStyles from "./VPTokenIcon.module.css";
import { OBJECTIVE_IMAGE_MAP } from "./constants/objectiveImageMap";
import { calculateBorderVisibility } from "./utils/borderVisibility";
import Caption from "@/components/shared/Caption/Caption";

type Props = {
  playerData: PlayerData[];
  objectives: Objectives;
};

function StyxIcon() {
  return (
    <div className={styxStyles.styxIcon}>
      <img
        src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
        alt="legendary ready"
        className={styxStyles.legendaryIcon}
      />
    </div>
  );
}

function getObjectiveIcon(
  entryType: EntryType,
  invertAgenda = false
): ReactNode {
  if (entryType === "STYX") {
    return <StyxIcon />;
  }

  if (entryType === "CUSTODIAN") {
    return (
      <div className={vpTokenStyles.token}>
        <div className={vpTokenStyles.content}>
          <div className={vpTokenStyles.number}>1</div>
          <div className={vpTokenStyles.label}>VP</div>
        </div>
      </div>
    );
  }

  if (entryType === "IMPERIAL") {
    return (
      <div className={vpTokenStyles.imperialToken}>
        <div className={vpTokenStyles.content}>
          <div className={vpTokenStyles.imperialNumber}>8</div>
        </div>
      </div>
    );
  }

  const imageSrc = OBJECTIVE_IMAGE_MAP[entryType];

  if (entryType === "LATVINIA") {
    return (
      <div className={cornerBadgeStyles.container}>
        <img
          src={imageSrc}
          alt="Relic"
          className={cornerBadgeStyles.baseImage}
        />
        <div className={cornerBadgeStyles.badge}>
          <IconBook2 size={12} className={cornerBadgeStyles.bookIcon} />
        </div>
      </div>
    );
  }

  if (entryType === "SHARD") {
    return (
      <div className={cornerBadgeStyles.container}>
        <img
          src={imageSrc}
          alt="Relic"
          className={cornerBadgeStyles.baseImage}
        />
        <div className={cornerBadgeStyles.badge}>
          <IconDiamond size={12} className={cornerBadgeStyles.diamondIcon} />
        </div>
      </div>
    );
  }
  return (
    <img
      src={imageSrc}
      alt={`${entryType} icon`}
      style={
        entryType === "AGENDA" && invertAgenda
          ? { filter: "invert(100%)" }
          : entryType === "SFTT"
            ? { filter: "invert(100%)" }
            : undefined
      }
    />
  );
}

export function PlayerScoreSummary({ playerData, objectives }: Props) {
  const gameData = useGameData();
  const playerScoreBreakdowns = gameData?.playerScoreBreakdowns;

  if (!playerData || !objectives) return null;

  const factionImages = useFactionImages();

  const sortedPlayers = [...playerData].sort((a, b) => {
    const aInit = a.scs[0] || 99;
    const bInit = b.scs[0] || 99;
    return aInit - bInit;
  });

  const maxGridColumns = Math.max(
    ...sortedPlayers.map((player) => {
      const breakdown = playerScoreBreakdowns?.[player.faction];
      if (!breakdown) return 10;
      return breakdown.entries.reduce(
        (sum, entry) => sum + entry.pointValue,
        0
      );
    }),
    10
  );

  return (
    <div className={styles.themedContainer}>
      <Stack gap={10}>
        {/* Title */}
        <Caption size="md">Score Breakdown</Caption>

        {/* Legend/Rubric */}
        <div className={legendStyles.legendContainer}>
          <div className={legendStyles.legendItem}>
            <div className={cx(legendStyles.legendBox, legendStyles.scored)} />
            <Text size="xs" c="dimmed">
              Scored
            </Text>
          </div>
          <div className={legendStyles.legendItem}>
            <div
              className={cx(legendStyles.legendBox, legendStyles.qualifies)}
            />
            <Text size="xs" c="dimmed">
              Qualifies
            </Text>
          </div>
          <div className={legendStyles.legendItem}>
            <div
              className={cx(legendStyles.legendBox, legendStyles.potential)}
            />
            <Text size="xs" c="dimmed">
              Potential
            </Text>
          </div>
          <div className={legendStyles.legendItem}>
            <IconAlertTriangle
              size={18}
              color="var(--mantine-color-yellow-6)"
            />
            <Text size="xs" c="dimmed">
              Losable
            </Text>
          </div>
        </div>

        {/* Number track - shown once above all players */}
        <div className={styles.rowContainer}>
          <div className={styles.playerInfoColumn} />
          <div
            className={styles.objectivesGrid}
            style={{ gridTemplateColumns: `repeat(${maxGridColumns}, 1fr)` }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <div key={`number-${num}`} className={styles.numberCell}>
                <Text
                  ff="heading"
                  size="sm"
                  c="dimmed"
                  style={{ opacity: 0.7 }}
                >
                  {num}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {sortedPlayers.map((player) => {
          const breakdown = playerScoreBreakdowns?.[player.faction];

          if (!breakdown) {
            return null;
          }

          const totalVPs = player.totalVps;
          const potentialVPs = breakdown.entries.reduce(
            (sum, entry) => sum + entry.pointValue,
            0
          );

          return (
            <div key={player.faction} className={styles.rowContainer}>
              <div className={cx(styles.nameBody, styles.playerInfoColumn)}>
                <Image
                  src={factionImages[player.faction!]?.image}
                  alt={player.faction}
                  w={24}
                  h={24}
                />
                <Text
                  size="md"
                  fw={700}
                  c="white"
                  ff="heading"
                  className={cx(styles.playerName, styles.playerNameText)}
                >
                  {player.userName}
                </Text>
                <PlayerColor color={player.color} size="sm" />
                <Text
                  ff={"text"}
                  className={cx(styles.initiativeBody, styles.initiativeText)}
                  size="md"
                  fw={600}
                >
                  {player.scs[0]}
                </Text>
                <Text
                  ff={"heading"}
                  className={cx(styles.vp, styles.vpText)}
                  size="sm"
                >
                  {totalVPs}/{potentialVPs} VP
                </Text>
              </div>

              <div
                className={styles.objectivesGrid}
                style={{
                  gridTemplateColumns: `repeat(${maxGridColumns}, 1fr)`,
                }}
              >
                {breakdown.entries.map((entry, idx) => {
                  const { hideLeftBorder, hideRightBorder } =
                    calculateBorderVisibility(idx, breakdown.entries);

                  const icon = getObjectiveIcon(
                    entry.type,
                    entry.type === "AGENDA"
                  );

                  return (
                    <ObjectiveChip
                      key={`${player.faction}-entry-${idx}`}
                      icon={
                        entry.type === "IMPERIAL" && entry.canDrawSecret ? (
                          <div className={vpTokenStyles.imperialContainer}>
                            {getObjectiveIcon("IMPERIAL")}
                            <img
                              className={vpTokenStyles.secretIcon}
                              src={OBJECTIVE_IMAGE_MAP.SECRET}
                              alt="Secret objective"
                            />
                          </div>
                        ) : (
                          icon
                        )
                      }
                      entryType={entry.type}
                      state={entry.state}
                      span={entry.pointValue}
                      warningIcon={
                        entry.losable ? <IconAlertTriangle size={20} /> : null
                      }
                      hideLeftBorder={hideLeftBorder}
                      hideRightBorder={hideRightBorder}
                      losable={entry.losable}
                      currentProgress={entry.currentProgress}
                      totalProgress={entry.totalProgress}
                      description={entry.description}
                      zIndex={1000 - idx}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Note about potential points */}
        <Text
          size="sm"
          c="gray.6"
          fs="italic"
          className={styles.noteText}
          mt="sm"
        >
          NOTE: Potential points (not filled) are a heuristic that do not
          account for action cards such as overrule, impersonation, and others.
          TI4 has a lot of nonsense that is hard to expect, so this only tracks
          above the board information.
        </Text>
      </Stack>
    </div>
  );
}

const fakeScoreBreakdown = {
  versionSchema: 5,
  lawsInPlay: [],

  statTilePositions: { sol: ["413", "412", "414"] },
  scoreBreakdowns: {
    sol: {
      entries: [
        {
          type: "PO_1",
          objectiveKey: "outer_rim",
          agendaKey: null,
          description: "Populate the Outer Rim",
          state: "SCORED",
          losable: false,
          currentProgress: null,
          totalProgress: null,
          pointValue: 1,
          tombInPlay: null,
          canDrawSecret: null,
        },
        {
          type: "PO_2",
          objectiveKey: "become_legend",
          agendaKey: null,
          description: "Become a Legend (status phase or imperial)",
          state: "POTENTIAL",
          losable: false,
          currentProgress: 0,
          totalProgress: 4,
          pointValue: 2,
          tombInPlay: null,
          canDrawSecret: null,
        },
        {
          type: "PO_1",
          objectiveKey: "push_boundaries",
          agendaKey: null,
          description: "Push Boundaries (status phase or imperial)",
          state: "POTENTIAL",
          losable: false,
          currentProgress: 0,
          totalProgress: 2,
          pointValue: 1,
          tombInPlay: null,
          canDrawSecret: null,
        },
        {
          type: "IMPERIAL",
          objectiveKey: null,
          agendaKey: null,
          description: "Imperial Point (or draw secret)",
          state: "POTENTIAL",
          losable: false,
          currentProgress: null,
          totalProgress: null,
          pointValue: 1,
          tombInPlay: null,
          canDrawSecret: true,
        },
        {
          type: "SECRET",
          objectiveKey: null,
          agendaKey: null,
          description: "Drawn Secret",
          state: "POTENTIAL",
          losable: false,
          currentProgress: null,
          totalProgress: null,
          pointValue: 1,
          tombInPlay: null,
          canDrawSecret: null,
        },
      ],
    },
  },
  tableTalkJumpLink:
    "https://discord.com/channels/1286175868896542761/1408460778205348002",
  strategyCards: [
    {
      initiative: 1,
      name: "Leadership",
      id: "pok1leadership",
      picked: false,
      played: false,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: null,
    },
    {
      initiative: 2,
      name: "Diplomacy",
      id: "pok2diplomacy",
      picked: false,
      played: false,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: null,
    },
    {
      initiative: 3,
      name: "Politics",
      id: "pok3politics",
      picked: false,
      played: true,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: null,
    },
    {
      initiative: 4,
      name: "Construction",
      id: "pok4construction",
      picked: false,
      played: false,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: null,
    },
    {
      initiative: 5,
      name: "Trade",
      id: "pok5trade",
      picked: false,
      played: false,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: null,
    },
    {
      initiative: 6,
      name: "Warfare",
      id: "pok6warfare",
      picked: false,
      played: false,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: null,
    },
    {
      initiative: 7,
      name: "Technology",
      id: "pok7technology",
      picked: false,
      played: false,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: null,
    },
    {
      initiative: 8,
      name: "Imperial",
      id: "pok8imperial",
      picked: true,
      played: false,
      exhausted: false,
      tradeGoods: 0,
      pickedByFaction: "sol",
    },
  ],
  gameCustomName: "sources test",
  cardPool: {
    secretObjectiveDeck: [],
    secretObjectiveFullDeckSize: 40,
    actionCardDeck: [
      "nav_suite",
      "impersonation",
      "bribery",
      "lead_rider",
      "lost_star",
      "professional_archeologists",
      "micrometeoroid_storm_ds",
      "war_machine3",
      "courageous",
      "free_trade_network",
      "dp1",
      "contagion",
      "dh1",
      "forbidden_knowledge",
      "rally",
      "sabo4",
      "renegotiation",
      "insub",
      "fs1",
      "s_retreat3",
      "messiah",
      "deadly_plot",
      "hostile_world_ds",
      "confusing",
      "intercept",
      "sh1",
      "unstable",
      "reverse_engineer",
      "fire_team",
      "tactical",
      "remnant_collection",
      "preparation",
      "bunker",
      "imp_rider",
      "safety_overrides_ds",
      "f_prototype",
      "war_machine2",
      "diplo_rider",
      "fsb",
      "s_retreat4",
      "scuttle",
      "refit",
      "divert_funding",
      "dh2",
      "distinguished",
      "meltdown",
      "parley",
      "emergency_meeting",
      "blitz",
      "emergency",
      "mb1",
      "tech_rider",
      "repeal",
      "reparations",
      "confounding",
      "carapace_plating",
      "confused_sage",
      "escape_clause",
      "sabo1",
      "fulfillment_protocols_ds",
      "s_retreat2",
      "mb3",
      "mb4",
      "abs",
      "const_rider",
      "sh3",
      "psionic_hammer",
      "master_plan",
      "plague",
      "sabo2",
      "harness",
      "trade_rider",
      "experimental",
      "cripple",
      "stability",
      "disgrace",
      "dp3",
      "dp4",
      "war_machine1",
      "mjets3",
      "classified_weapons",
      "echo_shielding",
      "sabo3",
      "illusory_duplication_ds",
      "sh2",
      "silence_space",
      "dp2",
      "f_conscription",
      "mining_initiative",
      "mjets2",
      "special_session",
      "fs4",
      "probe",
      "uprising",
      "arbitrage",
      "fs3",
      "waylay",
      "fs2",
      "aggressive_broker",
      "dh3",
      "lucky",
      "secured_trove",
      "upgrade",
      "scramble",
      "coup",
      "unexpected",
      "ghost_squad",
      "seize",
      "personnel_writ",
      "disable",
      "solar_flare",
      "jamming",
      "reveal_prototype",
      "industrial_initiative",
      "sh4",
      "economic_initiative",
      "summit",
      "counterstroke",
      "insider",
      "war_rider",
      "dh4",
      "salvage",
      "mb2",
      "mjets1",
      "war_effort",
      "war_machine4",
      "f_deployment",
      "planetary_rigs",
      "ai_augury",
      "abyssal_starpaths",
      "arch_expedition",
      "infiltrate",
      "decoy",
      "mjets4",
      "politic_rider",
      "assassin",
      "ghost_ship",
      "rout",
      "bounty_contracts",
      "reflective",
      "singularity_charge_ds",
      "spy",
      "s_retreat1",
      "investments",
      "plagiarize",
      "veto",
      "sanction",
      "freedom_fighters_ds",
    ],
    actionCardDiscard: [],
    actionCardFullDeckSize: 150,
    culturalExploreDeck: [
      "crf8",
      "crf4",
      "distinguishedadmiral",
      "mo2",
      "pw",
      "crf6",
      "mo3",
      "crf1",
      "dmz",
      "frln3",
      "crf7",
      "crf2",
      "crf3",
      "gw",
      "frln1",
      "councilpreserve",
      "frln2",
      "crf9",
      "starchartcultural",
      "mo1",
      "ds",
      "forgottentradestation",
      "toe",
      "crf5",
    ],
    culturalExploreDiscard: [],
    culturalExploreFullDeckSize: 24,
    industrialExploreDeck: [
      "irf5",
      "aw3",
      "irf4",
      "fb4",
      "fb2",
      "lf2",
      "fb1",
      "hiddenlaboratory",
      "lf1",
      "lf3",
      "irf3",
      "starchartindustrial",
      "irf2",
      "aw2",
      "aw4",
      "biotic",
      "fb3",
      "propulsion",
      "lf4",
      "cybernetic",
      "aw1",
      "irf1",
      "orbitalfoundries",
      "ancientshipyard",
    ],
    industrialExploreDiscard: [],
    industrialExploreFullDeckSize: 24,
    hazardousExploreDeck: [
      "starcharthazardous",
      "ls",
      "exp3",
      "cm3",
      "cm1",
      "exp1",
      "scorcheddepot",
      "seedyspaceport",
      "vfs2",
      "hrf4",
      "hrf5",
      "hrf3",
      "hrf2",
      "exp2",
      "hrf7",
      "vfs3",
      "cm2",
      "mw",
      "warfare",
      "hrf6",
      "arcanecitadel",
      "rw",
      "hrf1",
      "vfs1",
    ],
    hazardousExploreDiscard: [],
    hazardousExploreFullDeckSize: 24,
    frontierExploreDeck: [
      "urf2",
      "ed1",
      "ms2",
      "suspiciouswreckage",
      "lc1",
      "dv2",
      "urf1",
      "mirage",
      "minent",
      "majent",
      "ion",
      "kel2",
      "folderspace",
      "darkvisions",
      "gamma",
      "urf3",
      "ms1",
      "kel1",
      "ent",
      "dv1",
      "dw",
      "lc2",
      "ed2",
      "starchartfrontier",
    ],
    frontierExploreDiscard: [],
    frontierExploreFullDeckSize: 24,
    relicDeck: [
      "dominusorb",
      "dynamiscore",
      "eye_of_vogul",
      "obsidian",
      "mawofworlds",
      "starfall_array",
      "throne_of_the_false_emperor",
      "boon_of_the_cerulean_god",
      "titanprototype",
      "bookoflatvinia",
      "stellarconverter",
      "emelpar",
      "thalnos",
      "neuraloop",
      "e6-g0_network",
      "nanoforge",
      "shard",
      "twilight_mirror",
      "codex",
      "prophetstears",
      "emphidia",
      "circletofthevoid",
      "decrypted_cartoglyph",
    ],
    relicFullDeckSize: 23,
    agendaDeck: [
      "arms_reduction",
      "shared_research",
      "standardization",
      "censure",
      "incentive",
      "warrant",
      "minister_commrece",
      "cladenstine",
      "rearmament",
      "disarmamament",
      "minister_industry",
      "artifact",
      "seed_empire",
      "conscription",
      "unconventional",
      "articles_war",
      "constitution",
      "checks",
      "arbiter",
      "prophecy",
      "revolution",
      "minister_antiquities",
      "nexus",
      "minister_sciences",
      "miscount",
      "abolishment",
      "minister_policy",
      "redistribution",
      "defense_act",
      "travel_ban",
      "conventions",
      "regulations",
      "secret",
      "minister_war",
      "classified",
      "wormhole_research",
      "committee",
      "rep_govt",
      "execution",
      "mutiny",
      "minister_exploration",
      "sanctions",
      "crisis",
      "economic_equality",
      "wormhole_recon",
      "grant_reallocation",
      "schematics",
      "covert",
      "plowshares",
      "minister_peace",
    ],
    agendaDiscard: [],
    agendaFullDeckSize: 50,
  },
  playerData: [
    {
      userName: "Meme Philosopher",
      faction: "sol",
      factionImage: "https://images.asyncti4.com/factions/sol.webp",
      factionImageType: "IMAGE",
      color: "red",
      displayName: "null",
      discordId: "139760548471504897",
      cardsInfoThreadLink:
        "https://discord.com/channels/1286175868896542761/1408460782194397359",
      passed: false,
      eliminated: false,
      active: true,
      hasZeroToken: false,
      tacticalCC: 3,
      fleetCC: 3,
      strategicCC: 2,
      ccReinf: 8,
      tg: 0,
      commodities: 0,
      commoditiesTotal: 4,
      resources: 4,
      influence: 2,
      totResources: 4,
      totInfluence: 2,
      optimalResources: 4,
      optimalInfluence: 0,
      flexValue: 0,
      totOptimalResources: 4,
      totOptimalInfluence: 0,
      totFlexValue: 0,
      crf: 0,
      hrf: 0,
      irf: 0,
      urf: 0,
      stasisInfantry: 0,
      actualHits: 0,
      expectedHitsTimes10: 0,
      unitsOwned: [
        "sol_flagship",
        "sol_carrier",
        "sol_infantry",
        "spacedock",
        "sol_mech",
        "fighter",
        "dreadnought",
        "destroyer",
        "cruiser",
        "pds",
      ],
      followedSCs: [3],
      unfollowedSCs: [],
      exhaustedSCs: [],
      promissoryNotesInPlayArea: [],
      techs: ["amd", "nm"],
      exhaustedTechs: [],
      factionTechs: ["so2", "ac2"],
      notResearchedFactionTechs: ["so2", "ac2"],
      planets: ["jord"],
      exhaustedPlanets: [],
      exhaustedPlanetAbilities: [],
      fragments: [],
      relics: [],
      exhaustedRelics: [],
      leaders: [
        {
          id: "solagent",
          type: "agent",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
        {
          id: "solcommander",
          type: "commander",
          tgCount: 0,
          exhausted: false,
          locked: true,
          active: false,
        },
        {
          id: "solhero",
          type: "hero",
          tgCount: 0,
          exhausted: false,
          locked: true,
          active: false,
        },
      ],
      leaderIDs: ["solagent", "solcommander", "solhero"],
      secretsScored: {},
      knownUnscoredSecrets: {},
      numUnscoredSecrets: 1,
      flexibleDisplayName: "Sol",
      scs: [8],
      isSpeaker: true,
      neighbors: [],
      spaceArmyRes: 8.5,
      groundArmyRes: 2.5,
      spaceArmyHealth: 6.0,
      groundArmyHealth: 5.0,
      spaceArmyCombat: 1.2,
      groundArmyCombat: 2.0,
      soCount: 1,
      acCount: 2,
      pnCount: 6,
      totalVps: 1,
      numScoreableSecrets: 3,
      unitCounts: {
        dd: { unitCap: 8, deployedCount: 1 },
        ff: { unitCap: 10, deployedCount: 1 },
        dn: { unitCap: 5, deployedCount: 0 },
        plenaryorbital: { unitCap: 0, deployedCount: 0 },
        monument: { unitCap: 0, deployedCount: 0 },
        fs: { unitCap: 1, deployedCount: 0 },
        sd: { unitCap: 3, deployedCount: 1 },
        cavalry: { unitCap: 0, deployedCount: 0 },
        cv: { unitCap: 4, deployedCount: 2 },
        pd: { unitCap: 6, deployedCount: 0 },
        lady: { unitCap: 0, deployedCount: 0 },
        mf: { unitCap: 4, deployedCount: 0 },
        ws: { unitCap: 2, deployedCount: 0 },
        ca: { unitCap: 8, deployedCount: 0 },
        gf: { unitCap: 12, deployedCount: 1 },
        tyrantslament: { unitCap: 0, deployedCount: 0 },
      },
      nombox: {},
      sleeperTokensReinf: 0,
      ghostWormholesReinf: [],
      mahactEdict: [],
      debtTokens: {},
      abilities: ["versatile", "orbital_drop"],
    },
  ],
  gameRound: 1,
  gameName: "pbd12140",
  tileUnitData: {
    "210": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "211": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "310": {
      space: {
        sol: [
          { entityId: "ff", entityType: "unit", count: 3, sustained: null },
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 2, sustained: null },
        ],
      },
      planets: {
        jord: {
          controlledBy: "sol",
          entities: {
            sol: [
              { entityId: "gf", entityType: "unit", count: 5, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
            ],
          },
          commodities: null,
          planetaryShield: false,
        },
      },
      ccs: [],
      production: { red: 6 },
      pds: null,
      anomaly: false,
    },
    "212": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "311": {
      space: {},
      planets: {
        lliot: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
        detic: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
      },
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "312": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "313": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "314": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "315": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "316": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "317": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "318": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "000": {
      space: {},
      planets: {
        mr: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
      },
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "101": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "102": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "201": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "103": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "202": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "301": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "104": {
      space: {},
      planets: {
        wellon: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
      },
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "203": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "302": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "105": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "204": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "303": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "106": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "205": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "304": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "206": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "305": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    tl: {
      space: {},
      planets: {
        lockedmallice: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
      },
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "207": {
      space: {},
      planets: {
        mellon: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
        zohbat: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
      },
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "306": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "208": {
      space: {},
      planets: {
        domna: {
          controlledBy: null,
          entities: {},
          commodities: null,
          planetaryShield: false,
        },
      },
      ccs: [],
      production: {},
      pds: null,
      anomaly: true,
    },
    "307": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "209": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "308": {
      space: {},
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: false,
    },
    "309": {
      space: {
        neutral: [
          {
            entityId: "frontier",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
      production: {},
      pds: null,
      anomaly: true,
    },
  },
  ringCount: 3,
  objectives: {
    stage1Objectives: [
      {
        key: "outer_rim",
        name: "Populate the Outer Rim",
        pointValue: 1,
        revealed: true,
        scoredFactions: ["sol"],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 3,
        multiScoring: false,
      },
      {
        key: "push_boundaries",
        name: "Push Boundaries",
        pointValue: 1,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 2,
        multiScoring: false,
      },
      {
        key: "diversify",
        name: "Diversify Research",
        pointValue: 1,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 2,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_3100",
        name: "UNREVEALED",
        pointValue: 1,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_7870",
        name: "UNREVEALED",
        pointValue: 1,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
    ],
    stage2Objectives: [
      {
        key: "become_legend",
        name: "Become a Legend",
        pointValue: 2,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 4,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_1884",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_6253",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_3839",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_1765",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
    ],
    customObjectives: [
      {
        key: "Custodian/Imperial",
        name: "Custodian/Imperial",
        pointValue: 1,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 0,
        multiScoring: true,
      },
    ],
    allObjectives: [
      {
        key: "outer_rim",
        name: "Populate the Outer Rim",
        pointValue: 1,
        revealed: true,
        scoredFactions: ["sol"],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 3,
        multiScoring: false,
      },
      {
        key: "push_boundaries",
        name: "Push Boundaries",
        pointValue: 1,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 2,
        multiScoring: false,
      },
      {
        key: "diversify",
        name: "Diversify Research",
        pointValue: 1,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 2,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_3100",
        name: "UNREVEALED",
        pointValue: 1,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_7870",
        name: "UNREVEALED",
        pointValue: 1,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "become_legend",
        name: "Become a Legend",
        pointValue: 2,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 4,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_1884",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_6253",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_3839",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "UNREVEALED_1765",
        name: "UNREVEALED",
        pointValue: 2,
        revealed: false,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: {},
        progressThreshold: 0,
        multiScoring: false,
      },
      {
        key: "Custodian/Imperial",
        name: "Custodian/Imperial",
        pointValue: 1,
        revealed: true,
        scoredFactions: [],
        peekingFactions: [],
        factionProgress: { sol: 0 },
        progressThreshold: 0,
        multiScoring: true,
      },
    ],
  },
  vpsToWin: 10,
  actionsJumpLink:
    "https://discord.com/channels/1286175868896542761/1408460779258249376",
  tilePositions: [
    "000:18",
    "101:85a180",
    "102:85a240",
    "103:85a300",
    "104:19",
    "105:85a60",
    "106:85a120",
    "201:85a180",
    "202:84a",
    "203:85a240",
    "204:84a60",
    "205:85a300",
    "206:87a300",
    "207:30",
    "208:d104",
    "209:85a60",
    "210:84a240",
    "211:85a120",
    "212:84a300",
    "301:85a180",
    "302:84a",
    "303:84a",
    "304:85a240",
    "305:84a60",
    "306:84a60",
    "307:85a300",
    "308:84a120",
    "309:42",
    "310:01",
    "311:d114",
    "312:84a180",
    "313:85a60",
    "314:84a240",
    "315:84a240",
    "316:85a120",
    "317:84a300",
    "318:84a300",
    "tl:82a",
  ],
};
