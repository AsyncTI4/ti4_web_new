import { PlayerData, TileUnitData } from "./types";

export const gameState: {
  playerData: PlayerData[];
  tileUnitData: Record<string, TileUnitData>;
  tilePositions: string[];
  statTilePositions: Record<string, string[]>;
  lawsInPlay: string[];
  vpsToWin: number;
} = {
  lawsInPlay: ["classified", "minister_sciences"],
  statTilePositions: {
    sol: ["409", "410", "408"],
    ghost: ["401", "402", "424"],
    letnev: ["405", "404", "406"],
    jolnar: ["413", "412", "414"],
    argent: ["421", "420", "422"],
    mentak: ["417", "416", "418"],
  },
  tileUnitData: {
    "210": {
      space: {},
      planets: {
        everra: {
          controlledBy: "argent",
          entities: {
            neutral: [
              {
                entityId: "token_dmz_large.png",
                entityType: "token",
                count: 1,
                sustained: null,
              },
              {
                entityId: "attachment_dmz.png",
                entityType: "attachment",
                count: 1,
                sustained: null,
              },
            ],
          },
        },
      },
      ccs: [],
    },
    "211": {
      space: {
        argent: [
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 2, sustained: null },
        ],
      },
      planets: {
        vorhal: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "gf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
      },
      ccs: ["argent"],
    },
    "310": {
      space: {
        jolnar: [
          { entityId: "dn", entityType: "unit", count: 1, sustained: null },
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "ca", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        jol: {
          controlledBy: "jolnar",
          entities: {
            jolnar: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        nar: {
          controlledBy: "jolnar",
          entities: {
            jolnar: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "212": {
      space: {
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "311": {
      space: {},
      planets: {
        bereg: {
          controlledBy: "jolnar",
          entities: {
            jolnar: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        lirtaiv: {
          controlledBy: "jolnar",
          entities: {
            jolnar: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
            ],
            neutral: [
              {
                entityId: "attachment_lazaxsurvivors.png",
                entityType: "attachment",
                count: 1,
                sustained: null,
              },
            ],
          },
        },
      },
      ccs: ["jolnar"],
    },
    "312": {
      space: {
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "313": {
      space: {
        letnev: [
          { entityId: "dn", entityType: "unit", count: 2, sustained: 2 },
          { entityId: "ff", entityType: "unit", count: 1, sustained: null },
          { entityId: "fs", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        mollprimus: {
          controlledBy: "mentak",
          entities: {
            mentak: [
              {
                entityId: "gf",
                entityType: "unit",
                count: 10,
                sustained: null,
              },
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
      },
      ccs: ["letnev", "mentak"],
    },
    "314": {
      space: {
        argent: [
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        cealdri: {
          controlledBy: "mentak",
          entities: {
            mentak: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        xanhact: {
          controlledBy: "mentak",
          entities: {
            mentak: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "315": {
      space: {
        argent: [
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {},
      ccs: [],
    },
    "316": {
      space: {
        argent: [
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 4, sustained: null },
          { entityId: "dn", entityType: "unit", count: 3, sustained: null },
        ],
      },
      planets: {
        ylir: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        avar: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        valk: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "gf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
      },
      ccs: ["ghost", "sol", "jolnar", "mentak", "argent"],
    },
    "317": {
      space: {},
      planets: {
        qucenn: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        rarron: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "gf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "318": {
      space: {
        ghost: [
          { entityId: "ff", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        tequran: {
          controlledBy: "ghost",
          entities: {
            ghost: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        torkan: {
          controlledBy: "ghost",
          entities: {
            ghost: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "gf", entityType: "unit", count: 2, sustained: null },
            ],
            neutral: [
              {
                entityId: "attachment_paradiseworld.png",
                entityType: "attachment",
                count: 1,
                sustained: null,
              },
            ],
          },
        },
      },
      ccs: [],
    },
    "000": {
      space: {
        sol: [
          { entityId: "ca", entityType: "unit", count: 1, sustained: null },
          { entityId: "fs", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 2, sustained: 2 },
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        mr: {
          controlledBy: "sol",
          entities: {
            sol: [
              {
                entityId: "gf",
                entityType: "unit",
                count: 11,
                sustained: null,
              },
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
      },
      ccs: ["argent"],
    },
    "101": {
      space: {
        neutral: [
          {
            entityId: "token_creussbeta.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "102": {
      space: {
        argent: [
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        meer: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "mf", entityType: "unit", count: 1, sustained: null },
              { entityId: "gf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
        arinam: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "201": {
      space: {
        ghost: [
          { entityId: "ff", entityType: "unit", count: 2, sustained: null },
          { entityId: "dn", entityType: "unit", count: 2, sustained: null },
        ],
      },
      planets: {
        atlas: {
          controlledBy: "ghost",
          entities: {
            ghost: [
              { entityId: "gf", entityType: "unit", count: 4, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
            ],
            neutral: [
              {
                entityId: "attachment_miningworld.png",
                entityType: "attachment",
                count: 1,
                sustained: null,
              },
            ],
          },
        },
      },
      ccs: ["sol"],
    },
    "103": {
      space: {
        neutral: [
          {
            entityId: "token_ionalpha.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
        mentak: [
          { entityId: "ff", entityType: "unit", count: 1, sustained: null },
          { entityId: "ca", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {},
      ccs: [],
    },
    "202": {
      space: {
        letnev: [
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 2, sustained: null },
        ],
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "301": {
      space: {
        ghost: [
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
        ],
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "104": {
      space: {
        jolnar: [
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        vefutii: {
          controlledBy: "jolnar",
          entities: {
            jolnar: [
              { entityId: "mf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "203": {
      space: {
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "302": {
      space: {
        ghost: [
          { entityId: "ff", entityType: "unit", count: 4, sustained: null },
          { entityId: "dn", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
        ],
        neutral: [
          {
            entityId: "token_creussgamma.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
          {
            entityId: "token_creussalpha.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {
        tarmann: {
          controlledBy: "ghost",
          entities: {
            ghost: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "105": {
      space: {
        mentak: [
          { entityId: "ff", entityType: "unit", count: 12, sustained: null },
          { entityId: "dn", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
          { entityId: "ca", entityType: "unit", count: 2, sustained: null },
        ],
      },
      planets: {
        fria: {
          controlledBy: "mentak",
          entities: {
            mentak: [
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        abyz: {
          controlledBy: "mentak",
          entities: {
            neutral: [
              {
                entityId: "attachment_warfare.png",
                entityType: "attachment",
                count: 1,
                sustained: null,
              },
            ],
            mentak: [
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
      },
      ccs: ["mentak"],
    },
    "204": {
      space: {
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "303": {
      space: {},
      planets: {
        sakulag: {
          controlledBy: "letnev",
          entities: {
            letnev: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "106": {
      space: {
        letnev: [
          { entityId: "dd", entityType: "unit", count: 2, sustained: null },
        ],
      },
      planets: {
        vegamajor: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 3, sustained: null },
              { entityId: "gf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
        vegaminor: {
          controlledBy: "argent",
          entities: {
            argent: [
              { entityId: "gf", entityType: "unit", count: 4, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "205": {
      space: {
        sol: [
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
          { entityId: "dn", entityType: "unit", count: 2, sustained: null },
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 8, sustained: null },
        ],
      },
      planets: {
        semlore: {
          controlledBy: "sol",
          entities: {
            sol: [
              { entityId: "gf", entityType: "unit", count: 4, sustained: null },
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: ["sol"],
    },
    "304": {
      space: {
        letnev: [
          { entityId: "cv", entityType: "unit", count: 2, sustained: null },
          { entityId: "dn", entityType: "unit", count: 2, sustained: null },
          { entityId: "ff", entityType: "unit", count: 11, sustained: null },
        ],
      },
      planets: {
        arcprime: {
          controlledBy: "letnev",
          entities: {
            letnev: [
              { entityId: "gf", entityType: "unit", count: 8, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: ["letnev"],
    },
    "206": {
      space: {},
      planets: {
        accoen: {
          controlledBy: "sol",
          entities: {
            sol: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
        jeolir: {
          controlledBy: "sol",
          entities: {
            sol: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "305": {
      space: {
        letnev: [
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 3, sustained: null },
        ],
      },
      planets: {
        lodor: {
          controlledBy: "letnev",
          entities: {
            letnev: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    tl: {
      space: {
        ghost: [
          { entityId: "ff", entityType: "unit", count: 1, sustained: null },
          { entityId: "dn", entityType: "unit", count: 2, sustained: null },
        ],
      },
      planets: {
        mallice: {
          controlledBy: "ghost",
          entities: {
            ghost: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "207": {
      space: {
        jolnar: [
          { entityId: "ff", entityType: "unit", count: 10, sustained: null },
          { entityId: "ws", entityType: "unit", count: 1, sustained: null },
          { entityId: "dn", entityType: "unit", count: 2, sustained: null },
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        bakal: {
          controlledBy: "jolnar",
          entities: {
            jolnar: [
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 2, sustained: null },
            ],
          },
        },
        alioprima: {
          controlledBy: "jolnar",
          entities: {
            neutral: [
              {
                entityId: "attachment_dysonsphere.png",
                entityType: "attachment",
                count: 1,
                sustained: null,
              },
            ],
          },
        },
      },
      ccs: ["jolnar"],
    },
    "306": {
      space: {
        sol: [
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 2, sustained: null },
        ],
      },
      planets: {
        primor: {
          controlledBy: "sol",
          entities: {
            sol: [
              { entityId: "gf", entityType: "unit", count: 4, sustained: null },
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
    "208": {
      space: {
        jolnar: [
          { entityId: "dn", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {},
      ccs: [],
    },
    "307": {
      space: {
        sol: [
          { entityId: "dn", entityType: "unit", count: 3, sustained: null },
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "ff", entityType: "unit", count: 4, sustained: null },
        ],
      },
      planets: {
        jord: {
          controlledBy: "sol",
          entities: {
            sol: [
              { entityId: "gf", entityType: "unit", count: 8, sustained: null },
              { entityId: "pd", entityType: "unit", count: 1, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: ["sol"],
    },
    "209": {
      space: {
        jolnar: [
          { entityId: "dn", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        quann: {
          controlledBy: "jolnar",
          entities: {
            jolnar: [
              { entityId: "gf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: ["mentak", "jolnar"],
    },
    "308": {
      space: {
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    "309": {
      space: {
        jolnar: [
          { entityId: "ca", entityType: "unit", count: 1, sustained: null },
        ],
        neutral: [
          {
            entityId: "token_frontier.png",
            entityType: "token",
            count: 1,
            sustained: null,
          },
        ],
      },
      planets: {},
      ccs: [],
    },
    tr: {
      space: {
        ghost: [
          { entityId: "ff", entityType: "unit", count: 5, sustained: null },
          { entityId: "dd", entityType: "unit", count: 1, sustained: null },
          { entityId: "cv", entityType: "unit", count: 1, sustained: null },
          { entityId: "ca", entityType: "unit", count: 1, sustained: null },
        ],
      },
      planets: {
        creuss: {
          controlledBy: "ghost",
          entities: {
            ghost: [
              { entityId: "pd", entityType: "unit", count: 2, sustained: null },
              { entityId: "gf", entityType: "unit", count: 5, sustained: null },
              { entityId: "sd", entityType: "unit", count: 1, sustained: null },
              { entityId: "mf", entityType: "unit", count: 1, sustained: null },
            ],
          },
        },
      },
      ccs: [],
    },
  },
  vpsToWin: 10,
  playerData: [
    {
      userName: "Lakesandhills UTC+1",
      faction: "ghost",
      color: "blue",
      displayName: "null",
      passed: true,
      eliminated: false,
      active: false,
      tacticalCC: 0,
      fleetCC: 3,
      strategicCC: 0,
      tg: 3,
      commodities: 0,
      commoditiesTotal: 4,
      crf: 2,
      hrf: 0,
      irf: 0,
      urf: 0,
      stasisInfantry: 0,
      actualHits: 3,
      expectedHitsTimes10: 38,
      unitsOwned: [
        "ghost_mech",
        "spacedock",
        "pds2",
        "dreadnought2",
        "fighter",
        "carrier2",
        "destroyer",
        "infantry",
        "cruiser",
        "ghost_flagship",
      ],
      followedSCs: [2, 3, 4, 6, 8],
      unfollowedSCs: [],
      exhaustedSCs: [],
      promissoryNotesInPlayArea: ["yellow_an", "yellow_sftt"],
      techs: ["gd", "sr", "wg", "lwd", "sdn", "dn2", "cv2", "pds2"],
      exhaustedTechs: ["wg", "sr"],
      factionTechs: ["ds", "wg"],
      notResearchedFactionTechs: ["ds"],
      planets: ["creuss", "torkan", "atlas", "tarmann", "mallice", "tequran"],
      exhaustedPlanets: ["creuss", "atlas", "tequran", "torkan"],
      exhaustedPlanetAbilities: ["mallice"],
      fragments: ["crf6", "crf1"],
      relics: ["obsidian"],
      exhaustedRelics: [],
      leaders: [
        {
          id: "ghostagent",
          type: "agent",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
        {
          id: "ghostcommander",
          type: "commander",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
        {
          id: "ghosthero",
          type: "hero",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
      ],
      leaderIDs: ["ghostagent", "ghostcommander", "ghosthero"],
      secretsScored: { btgk: 940, sai: 0 },
      flexibleDisplayName: "Ghost",
      scs: [4],
      isSpeaker: false,
      neighbors: ["bloodred", "purple", "yellow", "pink"],
      spaceArmyRes: 39.5,
      groundArmyRes: 9.0,
      spaceArmyHealth: 29.0,
      groundArmyHealth: 16.0,
      spaceArmyCombat: 7.0,
      groundArmyCombat: 4.7,
      soCount: 2,
      acCount: 5,
      pnCount: 3,
      totalVps: 7,
      unitCounts: {
        dd: { unitCap: 0, deployedCount: 2 },
        ff: { unitCap: 0, deployedCount: 5 },
        dn: { unitCap: 0, deployedCount: 5 },
        plenaryorbital: { unitCap: 0, deployedCount: 0 },
        monument: { unitCap: 0, deployedCount: 0 },
        fs: { unitCap: 0, deployedCount: 0 },
        sd: { unitCap: 0, deployedCount: 3 },
        cavalry: { unitCap: 0, deployedCount: 0 },
        cv: { unitCap: 0, deployedCount: 3 },
        pd: { unitCap: 0, deployedCount: 3 },
        lady: { unitCap: 0, deployedCount: 0 },
        mf: { unitCap: 0, deployedCount: 1 },
        ws: { unitCap: 0, deployedCount: 0 },
        ca: { unitCap: 0, deployedCount: 1 },
        gf: { unitCap: 0, deployedCount: 6 },
        tyrantslament: { unitCap: 0, deployedCount: 0 },
      },
      nombox: {},
    },
    {
      userName: "Pentaholic",
      faction: "letnev",
      color: "bloodred",
      displayName: "null",
      passed: false,
      eliminated: false,
      active: false,
      tacticalCC: 2,
      fleetCC: 0,
      strategicCC: 0,
      tg: 2,
      commodities: 0,
      commoditiesTotal: 2,
      crf: 0,
      hrf: 0,
      irf: 0,
      urf: 0,
      stasisInfantry: 0,
      actualHits: 15,
      expectedHitsTimes10: 173,
      unitsOwned: [
        "carrier",
        "spacedock",
        "dreadnought2",
        "fighter",
        "destroyer",
        "letnev_flagship",
        "infantry",
        "cruiser",
        "pds",
        "letnev_mech",
      ],
      followedSCs: [2, 3, 4, 6, 8],
      unfollowedSCs: [],
      exhaustedSCs: [],
      promissoryNotesInPlayArea: [],
      techs: ["amd", "ps", "gd", "dn2", "nes", "da", "asc"],
      exhaustedTechs: [],
      factionTechs: ["l4", "nes"],
      notResearchedFactionTechs: ["l4"],
      planets: ["arcprime", "wrenterra", "lodor", "sakulag", "lazar"],
      exhaustedPlanets: ["sakulag", "arcprime", "lodor", "wrenterra"],
      exhaustedPlanetAbilities: [],
      fragments: [],
      relics: ["emelpar"],
      exhaustedRelics: ["emelpar"],
      leaders: [
        {
          id: "letnevagent",
          type: "agent",
          tgCount: 0,
          exhausted: true,
          locked: false,
          active: false,
        },
        {
          id: "letnevcommander",
          type: "commander",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
        {
          id: "letnevhero",
          type: "hero",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: true,
        },
      ],
      leaderIDs: ["letnevagent", "letnevcommander", "letnevhero"],
      secretsScored: { syc: 465, mlp: 901 },
      flexibleDisplayName: "Letnev",
      scs: [6],
      isSpeaker: false,
      neighbors: ["blue", "purple", "yellow", "pink", "navy"],
      spaceArmyRes: 46.5,
      groundArmyRes: 6.5,
      spaceArmyHealth: 34.0,
      groundArmyHealth: 12.0,
      spaceArmyCombat: 8.2,
      groundArmyCombat: 3.2,
      soCount: 1,
      acCount: 2,
      pnCount: 6,
      totalVps: 7,
      unitCounts: {
        dd: { unitCap: 0, deployedCount: 2 },
        ff: { unitCap: 0, deployedCount: 4 },
        dn: { unitCap: 0, deployedCount: 4 },
        plenaryorbital: { unitCap: 0, deployedCount: 0 },
        monument: { unitCap: 0, deployedCount: 0 },
        fs: { unitCap: 0, deployedCount: 1 },
        sd: { unitCap: 0, deployedCount: 2 },
        cavalry: { unitCap: 0, deployedCount: 0 },
        cv: { unitCap: 0, deployedCount: 4 },
        pd: { unitCap: 0, deployedCount: 1 },
        lady: { unitCap: 0, deployedCount: 0 },
        mf: { unitCap: 0, deployedCount: 1 },
        ws: { unitCap: 0, deployedCount: 0 },
        ca: { unitCap: 0, deployedCount: 0 },
        gf: { unitCap: 0, deployedCount: 2 },
        tyrantslament: { unitCap: 0, deployedCount: 0 },
      },
      nombox: {},
    },
    {
      userName: "Rumpsteakinator",
      faction: "sol",
      color: "navy",
      displayName: "null",
      passed: false,
      eliminated: false,
      active: true,
      tacticalCC: 2,
      fleetCC: 5,
      strategicCC: 0,
      tg: 0,
      commodities: 0,
      commoditiesTotal: 4,
      crf: 1,
      hrf: 0,
      irf: 0,
      urf: 0,
      stasisInfantry: 0,
      actualHits: 23,
      expectedHitsTimes10: 201,
      unitsOwned: [
        "sol_flagship",
        "sol_carrier2",
        "spacedock",
        "sol_mech",
        "dreadnought",
        "destroyer",
        "fighter2",
        "cruiser",
        "pds",
        "sol_infantry2",
      ],
      followedSCs: [2, 3, 4, 6, 8],
      unfollowedSCs: [],
      exhaustedSCs: [],
      promissoryNotesInPlayArea: [],
      techs: ["amd", "nm", "gd", "bs", "ac2", "ff2", "so2", "fl", "asc", "lwd"],
      exhaustedTechs: ["bs"],
      factionTechs: ["so2", "ac2"],
      notResearchedFactionTechs: [],
      planets: ["jord", "primor", "accoen", "jeolir", "mr", "semlore"],
      exhaustedPlanets: ["jeolir", "accoen", "mr", "jord", "semlore", "primor"],
      exhaustedPlanetAbilities: ["primor"],
      fragments: ["crf7"],
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
          locked: false,
          active: false,
        },
        {
          id: "solhero",
          type: "hero",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
      ],
      leaderIDs: ["solagent", "solcommander", "solhero"],
      secretsScored: { eap: 887 },
      flexibleDisplayName: "Sol",
      scs: [1],
      isSpeaker: false,
      neighbors: ["bloodred", "purple", "yellow", "pink"],
      spaceArmyRes: 52.5,
      groundArmyRes: 22.5,
      spaceArmyHealth: 37.0,
      groundArmyHealth: 37.0,
      spaceArmyCombat: 10.5,
      groundArmyCombat: 16.5,
      soCount: 2,
      acCount: 2,
      pnCount: 7,
      totalVps: 6,
      unitCounts: {
        dd: { unitCap: 0, deployedCount: 3 },
        ff: { unitCap: 0, deployedCount: 4 },
        dn: { unitCap: 0, deployedCount: 5 },
        plenaryorbital: { unitCap: 0, deployedCount: 0 },
        monument: { unitCap: 0, deployedCount: 0 },
        fs: { unitCap: 0, deployedCount: 1 },
        sd: { unitCap: 0, deployedCount: 2 },
        cavalry: { unitCap: 0, deployedCount: 0 },
        cv: { unitCap: 0, deployedCount: 4 },
        pd: { unitCap: 0, deployedCount: 4 },
        lady: { unitCap: 0, deployedCount: 0 },
        mf: { unitCap: 0, deployedCount: 4 },
        ws: { unitCap: 0, deployedCount: 0 },
        ca: { unitCap: 0, deployedCount: 1 },
        gf: { unitCap: 0, deployedCount: 6 },
        tyrantslament: { unitCap: 0, deployedCount: 0 },
      },
      nombox: {},
    },
    {
      userName: "Flowis",
      faction: "jolnar",
      color: "purple",
      displayName: "null",
      passed: true,
      eliminated: false,
      active: false,
      tacticalCC: 1,
      fleetCC: 5,
      strategicCC: 0,
      tg: 0,
      commodities: 0,
      commoditiesTotal: 4,
      crf: 0,
      hrf: 0,
      irf: 0,
      urf: 0,
      stasisInfantry: 0,
      actualHits: 8,
      expectedHitsTimes10: 71,
      unitsOwned: [
        "carrier",
        "spacedock",
        "pds2",
        "jolnar_mech",
        "dreadnought2",
        "fighter",
        "warsun",
        "infantry",
        "destroyer",
        "cruiser",
        "jolnar_flagship",
      ],
      followedSCs: [2, 3, 4, 6, 8],
      unfollowedSCs: [],
      exhaustedSCs: [],
      promissoryNotesInPlayArea: [],
      techs: [
        "st",
        "ps",
        "hm",
        "gd",
        "ers",
        "pds2",
        "da",
        "dn2",
        "asc",
        "gls",
        "sr",
        "ws",
        "scc",
        "bs",
      ],
      exhaustedTechs: ["bs", "sr"],
      factionTechs: ["ers", "scc"],
      notResearchedFactionTechs: [],
      planets: [
        "jol",
        "nar",
        "bereg",
        "bakal",
        "lirtaiv",
        "vefutii",
        "alioprima",
        "quann",
      ],
      exhaustedPlanets: [
        "bereg",
        "jol",
        "quann",
        "vefutii",
        "bakal",
        "alioprima",
      ],
      exhaustedPlanetAbilities: [],
      fragments: [],
      relics: [],
      exhaustedRelics: [],
      leaders: [
        {
          id: "jolnaragent",
          type: "agent",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
        {
          id: "jolnarcommander",
          type: "commander",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
      ],
      leaderIDs: ["jolnaragent", "jolnarcommander"],
      secretsScored: { ctr: 234, dtgs: 229, ans: 124 },
      flexibleDisplayName: "Jolnar",
      scs: [3],
      isSpeaker: true,
      neighbors: ["blue", "bloodred", "yellow", "navy", "pink"],
      spaceArmyRes: 49.0,
      groundArmyRes: 9.0,
      spaceArmyHealth: 28.0,
      groundArmyHealth: 10.0,
      spaceArmyCombat: 6.6,
      groundArmyCombat: 2.0,
      soCount: 0,
      acCount: 6,
      pnCount: 5,
      totalVps: 7,
      unitCounts: {
        dd: { unitCap: 0, deployedCount: 2 },
        ff: { unitCap: 0, deployedCount: 1 },
        dn: { unitCap: 0, deployedCount: 5 },
        plenaryorbital: { unitCap: 0, deployedCount: 0 },
        monument: { unitCap: 0, deployedCount: 0 },
        fs: { unitCap: 0, deployedCount: 0 },
        sd: { unitCap: 0, deployedCount: 2 },
        cavalry: { unitCap: 0, deployedCount: 0 },
        cv: { unitCap: 0, deployedCount: 2 },
        pd: { unitCap: 0, deployedCount: 5 },
        lady: { unitCap: 0, deployedCount: 0 },
        mf: { unitCap: 0, deployedCount: 4 },
        ws: { unitCap: 0, deployedCount: 1 },
        ca: { unitCap: 0, deployedCount: 2 },
        gf: { unitCap: 0, deployedCount: 2 },
        tyrantslament: { unitCap: 0, deployedCount: 0 },
      },
      nombox: {},
    },
    {
      userName: "iKy's",
      faction: "mentak",
      color: "pink",
      displayName: "null",
      passed: true,
      eliminated: false,
      active: false,
      tacticalCC: 0,
      fleetCC: 4,
      strategicCC: 0,
      tg: 2,
      commodities: 0,
      commoditiesTotal: 2,
      crf: 0,
      hrf: 1,
      irf: 0,
      urf: 0,
      stasisInfantry: 0,
      actualHits: 13,
      expectedHitsTimes10: 139,
      unitsOwned: [
        "carrier",
        "spacedock",
        "mentak_flagship",
        "dreadnought2",
        "fighter",
        "warsun",
        "cruiser2",
        "destroyer",
        "infantry",
        "mentak_mech",
        "pds",
      ],
      followedSCs: [2, 3, 4, 6, 8],
      unfollowedSCs: [],
      exhaustedSCs: [],
      promissoryNotesInPlayArea: ["purple_sftt"],
      techs: [
        "ps",
        "st",
        "hm",
        "cr2",
        "det",
        "gd",
        "dn2",
        "so",
        "asc",
        "mc",
        "ws",
      ],
      exhaustedTechs: [],
      factionTechs: ["mc", "so"],
      notResearchedFactionTechs: [],
      planets: ["mollprimus", "cealdri", "xanhact", "abyz", "fria"],
      exhaustedPlanets: ["abyz", "fria", "mollprimus"],
      exhaustedPlanetAbilities: [],
      fragments: ["hrf1"],
      relics: [],
      exhaustedRelics: [],
      leaders: [
        {
          id: "mentakagent",
          type: "agent",
          tgCount: 0,
          exhausted: true,
          locked: false,
          active: false,
        },
        {
          id: "mentakcommander",
          type: "commander",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
      ],
      leaderIDs: ["mentakagent", "mentakcommander"],
      secretsScored: { hrm: 284, fc: 673 },
      flexibleDisplayName: "Mentak",
      scs: [8],
      isSpeaker: false,
      neighbors: ["bloodred", "purple", "blue", "yellow", "navy"],
      spaceArmyRes: 19.5,
      groundArmyRes: 14.0,
      spaceArmyHealth: 19.0,
      groundArmyHealth: 20.0,
      spaceArmyCombat: 4.9,
      groundArmyCombat: 5.6,
      soCount: 1,
      acCount: 5,
      pnCount: 6,
      totalVps: 7,
      unitCounts: {
        dd: { unitCap: 0, deployedCount: 0 },
        ff: { unitCap: 0, deployedCount: 2 },
        dn: { unitCap: 0, deployedCount: 1 },
        plenaryorbital: { unitCap: 0, deployedCount: 0 },
        monument: { unitCap: 0, deployedCount: 0 },
        fs: { unitCap: 0, deployedCount: 0 },
        sd: { unitCap: 0, deployedCount: 3 },
        cavalry: { unitCap: 0, deployedCount: 0 },
        cv: { unitCap: 0, deployedCount: 1 },
        pd: { unitCap: 0, deployedCount: 2 },
        lady: { unitCap: 0, deployedCount: 0 },
        mf: { unitCap: 0, deployedCount: 4 },
        ws: { unitCap: 0, deployedCount: 0 },
        ca: { unitCap: 0, deployedCount: 3 },
        gf: { unitCap: 0, deployedCount: 3 },
        tyrantslament: { unitCap: 0, deployedCount: 0 },
      },
      nombox: {},
    },
    {
      userName: "Goodlife",
      faction: "argent",
      color: "yellow",
      displayName: "null",
      passed: true,
      eliminated: false,
      active: false,
      tacticalCC: 1,
      fleetCC: 6,
      strategicCC: 0,
      tg: 2,
      commodities: 0,
      commoditiesTotal: 3,
      crf: 0,
      hrf: 0,
      irf: 0,
      urf: 0,
      stasisInfantry: 0,
      actualHits: 25,
      expectedHitsTimes10: 325,
      unitsOwned: [
        "carrier",
        "argent_flagship",
        "spacedock",
        "fighter",
        "dreadnought",
        "infantry",
        "cruiser",
        "pds",
        "argent_destroyer2",
        "argent_mech",
      ],
      followedSCs: [2, 3, 4, 6, 8],
      unfollowedSCs: [],
      exhaustedSCs: [],
      promissoryNotesInPlayArea: ["blue_an", "blue_sftt"],
      techs: ["nm", "st", "aida", "swa2", "gd", "amd"],
      exhaustedTechs: ["aida"],
      factionTechs: ["ah", "swa2"],
      notResearchedFactionTechs: ["ah"],
      planets: [
        "valk",
        "ylir",
        "avar",
        "qucenn",
        "rarron",
        "vegamajor",
        "vegaminor",
        "everra",
        "vorhal",
        "arinam",
        "meer",
      ],
      exhaustedPlanets: [
        "valk",
        "avar",
        "qucenn",
        "vegamajor",
        "vegaminor",
        "everra",
        "arinam",
      ],
      exhaustedPlanetAbilities: [],
      fragments: [],
      relics: ["dominusorb"],
      exhaustedRelics: [],
      leaders: [
        {
          id: "argentagent",
          type: "agent",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
        {
          id: "argentcommander",
          type: "commander",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
        {
          id: "argenthero",
          type: "hero",
          tgCount: 0,
          exhausted: false,
          locked: false,
          active: false,
        },
      ],
      leaderIDs: ["argentagent", "argentcommander", "argenthero"],
      secretsScored: { te: 602 },
      flexibleDisplayName: "Argent",
      scs: [2],
      isSpeaker: false,
      neighbors: ["bloodred", "purple", "blue", "pink", "navy"],
      spaceArmyRes: 26.5,
      groundArmyRes: 17.0,
      spaceArmyHealth: 20.0,
      groundArmyHealth: 26.0,
      spaceArmyCombat: 5.6,
      groundArmyCombat: 7.4,
      soCount: 2,
      acCount: 4,
      pnCount: 4,
      totalVps: 7,
      unitCounts: {
        dd: { unitCap: 0, deployedCount: 5 },
        ff: { unitCap: 0, deployedCount: 3 },
        dn: { unitCap: 0, deployedCount: 3 },
        plenaryorbital: { unitCap: 0, deployedCount: 0 },
        monument: { unitCap: 0, deployedCount: 0 },
        fs: { unitCap: 0, deployedCount: 0 },
        sd: { unitCap: 0, deployedCount: 3 },
        cavalry: { unitCap: 0, deployedCount: 0 },
        cv: { unitCap: 0, deployedCount: 2 },
        pd: { unitCap: 0, deployedCount: 1 },
        lady: { unitCap: 0, deployedCount: 0 },
        mf: { unitCap: 0, deployedCount: 4 },
        ws: { unitCap: 0, deployedCount: 0 },
        ca: { unitCap: 0, deployedCount: 0 },
        gf: { unitCap: 0, deployedCount: 10 },
        tyrantslament: { unitCap: 0, deployedCount: 0 },
      },
      nombox: {},
    },
  ],
  tilePositions: [
    "000:18",
    "101:78",
    "102:37",
    "103:49",
    "104:20",
    "105:38",
    "106:74",
    "201:64",
    "202:46",
    "203:48",
    "204:40",
    "205:62",
    "206:69",
    "207:71",
    "208:50",
    "209:25",
    "210:68",
    "211:63",
    "212:44",
    "301:17",
    "302:22",
    "303:31",
    "304:10",
    "305:26",
    "306:65",
    "307:01",
    "308:43",
    "309:39",
    "310:12",
    "311:35",
    "312:42",
    "313:02",
    "314:73",
    "315:41",
    "316:58",
    "317:29",
    "318:28",
    "tl:82b",
    "tr:51",
  ],
};
