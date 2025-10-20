// Auto-generated file - Do not edit manually
// Generated from src/main/resources/data/abilities/*.json files

import { Ability } from "./types";

export const abilities: Ability[] = [
  {
    id: "raid_formation",
    name: "Raid Formation",
    faction: "argent",
    window: "When 1 or more of your units uses ANTI-FIGHTER BARRAGE",
    windowEffect:
      "for each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has SUSTAIN DAMAGE to become damaged.",
    source: "pok",
  },
  {
    id: "zeal",
    name: "Zeal",
    faction: "argent",
    permanentEffect: "You always vote first during the agenda phase",
    window: "When you cast at least 1 vote",
    windowEffect:
      "cast 1 additional vote for each player in the game including you.",
    source: "pok",
  },
  {
    id: "amalgamation",
    name: "Amalgamation",
    faction: "cabal",
    window: "When you produce a unit",
    windowEffect:
      "You may return 1 captured unit of that type to produce that unit without spending resources.",
    source: "pok",
    shortName: "Amalga\n-mation",
  },
  {
    id: "devour",
    name: "Devour",
    faction: "cabal",
    permanentEffect:
      "Capture your opponent's non-structure units that are destroyed during combat.",
    source: "pok",
  },
  {
    id: "riftmeld",
    name: "Riftmeld",
    faction: "cabal",
    window: "When you research a unit upgrade technology",
    windowEffect:
      "You may return 1 captured unit of that type to ignore all of the technology's prerequisites.",
    source: "pok",
  },
  {
    id: "aetherpassage",
    name: "Aetherpassage",
    faction: "empyrean",
    window: "After a player activates a system",
    windowEffect:
      "You may allow that player to move their ships through systems that contain your ships.",
    source: "pok",
    shortName: "Aether-\npassage",
  },
  {
    id: "dark_whispers",
    name: "Dark Whispers",
    faction: "empyrean",
    permanentEffect:
      "During setup, take the additional Empyrean faction promissory note; you have 2 faction promissory notes",
    source: "pok",
  },
  {
    id: "voidborn",
    name: "Voidborn",
    faction: "empyrean",
    permanentEffect: "Nebulae do not affect your ships' movement",
    source: "pok",
  },
  {
    id: "edict",
    name: "Edict",
    faction: "mahact",
    permanentEffect:
      "Other player's tokens in your fleet pool increase your fleet limit but cannot be redistributed.",
    window: "When you win a combat",
    windowEffect:
      "Place 1 command token from your opponent's reinforcements in your fleet pool if it does not already contain 1 of that player's tokens.",
    source: "pok",
  },
  {
    id: "hubris",
    name: "Hubris",
    faction: "mahact",
    permanentEffect:
      'During setup, purge your "Alliance" promissory note. Other players cannot give you their \'Alliance" promissory note.',
    source: "pok",
  },
  {
    id: "imperia",
    name: "Imperia",
    faction: "mahact",
    permanentEffect:
      "While another player's command token is in your fleet pool, you can use the ability of that player's commander, if it is unlocked.",
    source: "pok",
  },
  {
    id: "distant_suns",
    name: "Distant Suns",
    faction: "naaz",
    window: "When you explore a planet that contains 1 of your mechs",
    windowEffect:
      "You may draw 1 additional card; choose 1 to resolve and discard the rest.",
    source: "pok",
  },
  {
    id: "fabrication",
    name: "Fabrication",
    faction: "naaz",
    window: "ACTION",
    windowEffect:
      "Either purge 2 of your relic fragments of the same type to gain 1 relic; or purge 1 of your relic fragments to gain 1 command token.",
    source: "pok",
  },
  {
    id: "future_sight",
    name: "Future Sight",
    faction: "nomad",
    window:
      "During the Agenda phase, after an outcome that you voted for or predicted is resolved",
    windowEffect: "Gain 1 trade good",
    source: "pok",
  },
  {
    id: "the_company",
    name: "The Company",
    faction: "nomad",
    permanentEffect:
      "During setup, take the 2 additional Nomad faction agents and place them next to your faction sheet; you have 3 agents",
    source: "pok",
  },
  {
    id: "awaken",
    name: "Awaken",
    faction: "titans",
    window:
      "After you activate a system that contains 1 or more of your sleeper tokens",
    windowEffect:
      "You may replace each of those tokens with 1 PDS from your reinforcements.",
    source: "pok",
  },
  {
    id: "coalescence",
    name: "Coalescence",
    faction: "titans",
    permanentEffect:
      'If your flagship or your AWAKEN faction ability places your units into the same space area or onto the same planet as another player\'s units, your units must participate in combat during "Space Combat" or "Ground Combat" steps.',
    source: "pok",
    shortName: "Coale-\nscence",
  },
  {
    id: "terragenesis",
    name: "Terragenesis",
    faction: "titans",
    window: "After you explore a planet that does not have a sleeper token",
    windowEffect: "You may place or move 1 sleeper token onto that planet.",
    source: "pok",
    shortName: "Terra-\ngenesis",
  },
  {
    id: "redemption",
    name: "Redemption",
    faction: "qulane",
    window: "At the start of your turn",
    windowEffect: "You may play 1 event card from your hand.",
    source: "ignis_aurora",
  },
  {
    id: "revelation",
    name: "Revelation",
    faction: "qulane",
    permanentEffect:
      "During setup, draw 5 event cards. Add 3 to your hand; shuffle the other 2 back into the deck.",
    source: "ignis_aurora",
  },
  {
    id: "interstellar_string_walk",
    name: "Interstellar String Walk",
    faction: "arachian",
    permanentEffect:
      "When you activate a system, apply +1 to the move value of ships that move through a system that contains one of your Command Tokens. ",
    source: "other",
  },
  {
    id: "predatory_ambush",
    name: "Predatory Ambush",
    faction: "arachian",
    permanentEffect:
      "After a player moves ships into a system that contains one of your Command Tokens and your units: Choose up to 2 adjacent systems. Move 1 of your non-fighter ships from each of those systems into the activated system.",
    source: "other",
  },
  {
    id: "strong_webs",
    name: "Strong Webs",
    faction: "arachian",
    permanentEffect:
      "During the status phase, you may choose not to return up to 3 Command Tokens from the board to your reinforcements.",
    source: "other",
  },
  {
    id: "voidmaker",
    name: "Voidmaker",
    faction: "raven",
    permanentEffect:
      "Each system that contains no planets and which contains 1 or more of your units gains the PRODUCTION 4 ability as if it were 1 of your units.",
    source: "ignis_aurora",
  },
  {
    id: "impairment",
    name: "impairment",
    faction: "raven",
    permanentEffect:
      "When spending planets for resources, subtract 1 from the value of each planet that you spend.",
    source: "ignis_aurora",
  },
  {
    id: "tachyonpulse",
    name: "tachyonpulse",
    faction: "raven",
    permanentEffect:
      "After you activate a system, you may choose to ignore 1 or more anomaly effects during the movement step of this tactical action.",
    source: "ignis_aurora",
  },
  {
    id: "council_patronage",
    name: "Council Patronage",
    faction: "keleres",
    window: "At the start of the strategy phase",
    windowEffect: "Replenish your commodities, then gain 1 trade good.",
    source: "codex3",
  },
  {
    id: "laws_order",
    name: "Law's Order",
    faction: "keleres",
    window: "At the start of any player's turn",
    windowEffect:
      "You may spend 1 trade good or 1 commodity to treat all laws as blank until the end of that turn.",
    source: "codex3",
  },
  {
    id: "the_tribuni",
    name: "The Tribuni",
    faction: "keleres",
    permanentEffect:
      "During setup, choose an unplayed faction from among the Mentak, the Xxcha and The Argent Flight; take that faction's home system, command tokens and control markers. Additionally, take the Keleres Hero that corresponds to that faction",
    source: "codex3",
  },
  {
    id: "pi_munitions",
    name: "Munitions Reserves",
    faction: "letnev",
    window: "At the start of a space combat",
    windowEffect:
      "You may spend 2 resources; you may reroll any number of your dice during that combat round.",
    source: "project_pi",
  },
  {
    id: "pi_reclamation",
    name: "Reclamation",
    faction: "winnu",
    window: "After you gain control of Mecatol Rex",
    windowEffect:
      "You may place 1 PDS and 1 Space Dock from your reinforcements on Mecatol Rex",
    source: "project_pi",
  },
  {
    id: "pi_mitosis",
    name: "Mitosis",
    faction: "arborec",
    permanentEffect: "Your space docks cannot produce infantry.",
    window: "When you pass",
    windowEffect:
      "Place 1 ground force from your reinforcements on any planet you control.",
    source: "project_pi",
  },
  {
    id: "pi_galactic_threat",
    name: "Galactic Threat",
    faction: "nekro",
    permanentEffect: "You cannot vote ib agendas.",
    window: "Once per agenda, after an agenda is revealed",
    windowEffect:
      "You may predict aloud the outcome of that agenda. If your prediction is correct, gain 1 technology that is owned by a player who voted how you predicted.",
    source: "project_pi",
  },
  {
    id: "pi_quantum_entanglement",
    name: "Quantum Entanglement",
    faction: "ghost",
    permanentEffect:
      "You treat all system that contain a non-delta wormhole as adjacent to each other. Game effects cannot prevent you from using this ability.",
    source: "project_pi",
  },
  {
    id: "pi_slipstream",
    name: "Slipstream",
    faction: "ghost",
    window: "During your tacticle actions",
    windowEffect:
      "Apply +1 to the move value of each of your ships that starts its movement in a system that contain a wormhole.",
    source: "project_pi",
  },
  {
    id: "pi_ambush",
    name: "Ambush",
    faction: "mentak",
    window: "At the start of a space combat",
    windowEffect:
      "You may roll 1 die for each of up to 3 of your cruisers or destroyers in the system.\\nFor each result equal to or greater than that ship's combat value produce 1 hit; your opponent must assign it to one of their ships.",
    source: "project_pi",
  },
  {
    id: "pi_pillage",
    name: "Pillage",
    faction: "mentak",
    window:
      "After 1 of your neighbors gains trade goods, or resolves a transaction where trade goods, commoditites, or promissory notes are exhanged",
    windowEffect:
      "If that neighbor has 4 or more trade goods, you may take 1 of their trade goods or commodities.",
    source: "project_pi",
  },
  {
    id: "miltymod_mitosis",
    name: "Mitosis",
    faction: "arborec",
    permanentEffect: "Your space docks cannot produce ground forces.",
    window: "At the start of the status phase",
    windowEffect:
      "Place 1 ground force from your reinforcements on any planet you control.",
    source: "miltymod",
    homebrewReplacesID: "mitosis",
  },
  {
    id: "miltymod_quantum_entanglement",
    name: "Quantum Entanglement",
    faction: "ghost",
    permanentEffect:
      "You treat all systems that contain a non-delta wormhole as adjacent to each other. Game effects cannot prevent you from using this ability.",
    source: "miltymod",
    homebrewReplacesID: "quantum_entanglement",
  },
  {
    id: "miltymod_slipstream",
    name: "Slipstream",
    faction: "ghost",
    window: "During your tactical actions",
    windowEffect:
      "Apply +1 to the move value of each of your ships that starts its movement in your home system or in a system that contains a non-delta wormhole.",
    source: "miltymod",
    homebrewReplacesID: "slipstream",
  },
  {
    id: "miltymod_munitions",
    name: "Munitions Reserves",
    faction: "letnev",
    window: "At the start of each round of space combat",
    windowEffect:
      "You may spend 2 resources; you may reroll any number of your dice during that combat round.",
    source: "miltymod",
    homebrewReplacesID: "munitions",
  },
  {
    id: "miltymod_ambush",
    name: "Ambush",
    faction: "mentak",
    window: "At the start of a space combat",
    windowEffect:
      "You may roll 1 die for each of up to 2 of your cruisers or destroyers in the system. For each result equal to or greater than that ship's combat value produce 1 hit; your opponent must assign it to 1 of their non-fighter ships.",
    source: "miltymod",
    homebrewReplacesID: "ambush",
  },
  {
    id: "miltymod_star_forge",
    name: "Star Forge",
    faction: "muaat",
    window: "ACTION",
    windowEffect:
      "Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns or your flagship.",
    source: "miltymod",
    homebrewReplacesID: "star_forge",
  },
  {
    id: "miltymod_galactic_threat",
    name: "Galactic Threat",
    faction: "nekro",
    permanentEffect: "You cannot vote on agendas",
    window: "Once per agenda, after an agenda is revealed",
    windowEffect:
      "You may predict aloud the outcome of that agenda. If your prediction is correct, gain 1 technology that is owned by a player who voted how you predicted.",
    source: "miltymod",
    homebrewReplacesID: "galactic_threat",
  },
  {
    id: "miltymod_reclamation",
    name: "Reclamation",
    faction: "winnu",
    window: "After you gain control of Mecatol Rex",
    windowEffect:
      "You may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.",
    source: "miltymod",
    homebrewReplacesID: "reclamation",
  },
  {
    id: "eternal_watchers",
    name: "Eternal Watchers",
    faction: "netharii",
    window: "Once per combat",
    windowEffect:
      "when a unit is destroyed, you may place it in your home system instead",
    source: "memephilosopher",
  },
  {
    id: "limited_presence",
    name: "Limited Presence",
    faction: "netharii",
    permanentEffect: "You cannot have more than 2 sentinels on a single planet",
    source: "memephilosopher",
  },
  {
    id: "immovable_guardians",
    name: "Immovable Guardians",
    faction: "netharii",
    permanentEffect:
      "Your ground forces cannot be removed or destroyed by action cards or agenda effects",
    source: "memephilosopher",
  },
  {
    id: "eon_beam",
    name: "Eon Beam",
    faction: "netharii",
    permanentEffect:
      "At the end of each round of space combat, your infantry in the active system may use their space cannon abilities",
    source: "memephilosopher",
  },
  {
    id: "enable",
    name: "enable",
    faction: "syndicate",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "disrupt",
    name: "disrupt",
    faction: "syndicate",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "echo1",
    name: "echo1",
    faction: "echoes",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "echo2",
    name: "echo2",
    faction: "echoes",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "durable",
    name: "durable",
    faction: "terminator",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "saturation",
    name: "saturation",
    faction: "enclave",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "restricted",
    name: "restricted",
    faction: "enclave",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "architect",
    name: "architect",
    faction: "enclave",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "constrained",
    name: "constrained",
    faction: "enclave",
    permanentEffect: "Secret Ability Text",
    source: "pbd2000",
  },
  {
    id: "enslave",
    name: "Enslave",
    faction: "canto",
    window: "When you gain control of a planet",
    windowEffect:
      "Place 1 infantry from your reinforcements on that planet. REMOVED",
    source: "eronous",
  },
  {
    id: "dominate",
    name: "Dominate",
    faction: "canto",
    window:
      "After you commit ground forces to a planet controlled by another player",
    windowEffect:
      "That player must destroy 1 of their ground forces on that planet.",
    source: "eronous",
  },
  {
    id: "seamless_integration",
    name: "Seamless Integration",
    faction: "canto",
    window: "At the start of the Status phase",
    windowEffect:
      "you may place 1 infantry from your reinforcements on a non-home planet other than Mecatol Rex that contains no other player's units, resolve invasion on that planet.",
    source: "eronous",
  },
  {
    id: "void_tap",
    name: "Void Tap",
    faction: "eidolon",
    window: "After you activate a system that contains no planets REMOVED",
    windowEffect: "You may gain 1 trade good.",
    source: "eronous",
  },
  {
    id: "dark_weaver",
    name: "Dark Weaver",
    faction: "eidolon",
    window: "When you explore a frontier token",
    windowEffect:
      "You may draw 1 additional card; choose 1 to resolve and discard the rest",
    source: "eronous",
  },
  {
    id: "abyssal_propagation",
    name: "Abyssal Propagation",
    faction: "eidolon",
    window: "After you perform a tactical action,",
    windowEffect:
      "you may place 1 fighter from your reinforcements in a system that contains no other players units.",
    source: "eronous",
  },
  {
    id: "creeping_shades",
    name: "Creeping Shades",
    faction: "shadows",
    window: "At the start of space combat",
    windowEffect:
      "if your opponent has a control token on one of your ships, you may return any number of control tokens from your faction sheet to replace one of their matching ship types with one from your reinforcements.",
    source: "eronous",
  },
  {
    id: "silent_growth",
    name: "Silent Growth",
    faction: "shadows",
    window: "At the start of the agenda phase,",
    windowEffect:
      "For each other player you may spend influence equal to the cost of one non-fighter ship type with a cost of 4 or less to place one of their control tokens onto that ship type on your faction sheet.",
    source: "eronous",
  },
  {
    id: "tomb_worlds",
    name: "Tomb Worlds",
    faction: "shadows",
    permanentEffect:
      "For each planet that contains one of your space docks, increase its influence value by 2.",
    source: "eronous",
  },
  {
    id: "protocols",
    name: "Protocols",
    faction: "mechi",
    window: "At the start of the Strategy phase, ",
    windowEffect:
      "Exhaust all Active Protocols, and remove them from your faction sheet. Then, choose two unexhausted Protocols, and set them Active by placing them face up on your faction sheet.",
    source: "eronous",
  },
  {
    id: "machine_cult",
    name: "Machine Cult",
    faction: "mechi",
    permanentEffect:
      "During setup place the 2 Mechikide mech tokens in your reinforcements. The Mechikide unit tokens are additional units of their type.",
    source: "eronous",
  },
  {
    id: "protocol_distribution",
    name: "(Protocol) Distribution",
    faction: "mechi",
    permanentEffect:
      "Tier 1 - After a player activates a system, you may exhaust this card to increase the movement value of one of their ships by 1. \n\nTier 2 - After you activate a system, you may choose to ignore the moment effects of either asteroid fields, gravity rifts or nebulas. \n\nTier 3 - At the start of a round of space combat: Apply a bonus to each of your non-fighter ships combat rolls equal to their movement value until the end of the combat.",
    source: "eronous",
  },
  {
    id: "protocol_command",
    name: "(Protocol) Command",
    faction: "mechi",
    permanentEffect:
      "Tier 1 - At the end of a player’s turn: You may exhaust this card to allow them to perform the secondary ability of the Leadership strategy card. \n\nTier 2 - Planets that contain your mechs have their influence value increased by +1 \n\nTier 3 - ACTION: Perform the primary ability of the leadership card. Then, refresh all planets you spent during that action.",
    source: "eronous",
  },
  {
    id: "protocol_excavation",
    name: "(Protocol) Excavation",
    faction: "mechi",
    permanentEffect:
      "Tier 1 - At the end of a player’s turn: You may exhaust this card to allow that player to explore a planet that contains one of their mechs. \n\nTier 2 - When you explore a planet: Gain 1tg. \n\nTier 3 - ACTION: Explore each planet that contains one of your mechs. Then, ready each of those planets.",
    source: "eronous",
  },
  {
    id: "protocol_espionage",
    name: "(Protocol) Espionage",
    faction: "mechi",
    permanentEffect:
      "Tier 1 - At the end of a player’s turn: You may exhaust this card to allow a player to discard one unscored secret objective. If they do so, they draw a new one. Then, shuffle the discarded secret objective into the deck. \n\nTier 2 - When you win a combat against another player: That player must show you one of their unscored secret objectives at random, if able. \n\nTier 3 - ACTION: Each of your neighbors must give you one of their unscored secret objectives. Then, give one unscored secret objective you are holding back to each of those players.",
    source: "eronous",
  },
  {
    id: "protocol_conflict",
    name: "(Protocol) Conflict",
    faction: "mechi",
    permanentEffect:
      "Tier 1 - At the end of a round of combat: You may exhaust this card to repair one unit in the active system. \n\nTier 2 - Your space docks and mechs increase their PRODUCTION values by 1. \n\nTier 3 - ACTION: You may use the PRODUCTION values of each of your mechs.",
    source: "eronous",
  },
  {
    id: "angelic_hosts",
    name: "Angelic Hosts",
    faction: "saera",
    permanentEffect:
      "During setup, take the 2 additional Saeraphyme faction agents and place them next to your faction sheet; you have 3 agents.",
    source: "eronous",
  },
  {
    id: "guidance",
    name: "Guidance",
    faction: "saera",
    window: "After an agenda is revealed",
    windowEffect: "Ready one planet you control",
    source: "eronous",
  },
  {
    id: "celestial_being",
    name: "Celestial Being",
    faction: "saera",
    permanentEffect: "Your units ignore the effects of anomalies.",
    source: "eronous",
  },
  {
    id: "limited_vision",
    name: "Limited Vision",
    faction: "augers",
    permanentEffect:
      "You may not place a Stage II objective card on your faction sheet until all Stage I objectives have been revealed.",
    source: "ds",
  },
  {
    id: "oracle_ai",
    name: "Oracle AI",
    faction: "augers",
    window: "After the speaker reveals an unrevealed public objective",
    windowEffect:
      "Choose and look at 1 unrevealed public objective card; place that objective card on your faction sheet. You may look at the card on your faction sheet at any time.",
    source: "ds",
  },
  {
    id: "probability_algorithms",
    name: "Probability Algorithms",
    faction: "augers",
    window: "When the speaker would reveal the next public objective",
    windowEffect:
      "They instead reveal the objective card on your faction sheet and place that objective card near the public objectives as the next public objective.",
    source: "ds",
  },
  {
    id: "arms_dealers",
    name: "Arms Dealers",
    faction: "axis",
    permanentEffect: "You cannot resolve the effects of Axis Order cards.",
    window: "When a player negotiates a transaction",
    windowEffect:
      "They may exchange Axis Order cards in their play area as part of that transaction.",
    source: "ds",
  },
  {
    id: "military_industrial_complex",
    name: "Military Industrial Complex",
    faction: "axis",
    permanentEffect:
      "You may not give your commodities to other players as part of a transaction.",
    window: "After you gain 1 or more commodities",
    windowEffect:
      "You may spend a number of commodities equal to the combined cost listed on any number of Axis Order cards in your reinforcements to place those cards in your play area.",
    source: "ds",
    shortName: "Military Industr'l Cx",
  },
  {
    id: "ancient_blueprints",
    name: "Ancient Blueprints",
    faction: "bentor",
    window:
      "The first time you gain a cultural, hazardous, industrial, or unknown relic fragment",
    windowEffect:
      'Place the corresponding "Fragment" token on your faction sheet. (Async handles this by showing the Blueprint in your player area)',
    source: "ds",
  },
  {
    id: "fortune_seekers",
    name: "Fortune Seekers",
    faction: "bentor",
    window: "Once per action, after you explore a planet or frontier token",
    windowEffect: "You may gain 1 commodity.",
    source: "ds",
  },
  {
    id: "secret_maps",
    name: "Secret Maps",
    faction: "bentor",
    window: "At the end of your tactical actions",
    windowEffect:
      "You may explore 1 planet in the active system that is or contains 1 of your units with PRODUCTION and that you did not explore during that tactical action.",
    source: "ds",
  },
  {
    id: "industrialists",
    name: "Industrialists",
    faction: "celdauri",
    permanentEffect:
      "During setup, place the Celdauri space dock token in your reinforcements, the Celdauri space dock token is a fourth space dock unit.",
    source: "ds",
    shortName: "Indust-\nrialists",
  },
  {
    id: "projection_of_power",
    name: "Projection of Power",
    faction: "celdauri",
    window:
      "At the start of a space combat in a system that is adjacent to or contains 1 or more of your space docks",
    windowEffect:
      "Choose up to 1 ship in that system to gain ANTI-FIGHTER BARRAGE 6 until the end of that combat.",
    source: "ds",
  },
  {
    id: "byssus",
    name: "Byssus",
    faction: "cheiran",
    permanentEffect:
      "You may treat your mechs on planets you control as structures for any purpose other than scoring objectives.",
    source: "ds",
  },
  {
    id: "moult",
    name: "Moult",
    faction: "cheiran",
    window: "After you win a space combat as the defender",
    windowEffect:
      "You may produce 1 ship in the active system, reducing the cost by 1 for each of your non-fighter ships destroyed during that combat.",
    source: "ds",
  },
  {
    id: "teeming",
    name: "Teeming",
    faction: "cheiran",
    permanentEffect:
      "During setup place the 2 Cheiran dreadnought and 1 Cheiran mech tokens in your reinforcements. The Cheiran unit tokens are additional units of their type.",
    source: "ds",
  },
  {
    id: "autonetic_memory",
    name: "Autonetic Memory",
    faction: "cymiae",
    window: "When you draw 1 or more action cards",
    windowEffect:
      "You may draw 1 less card to choose 1 card from the action card discard pile and add it to your hand, or to place 1 infantry on a planet you control.",
    source: "ds",
  },
  {
    id: "cybernetic_madness",
    name: "Cybernetic Madness",
    faction: "cymiae",
    permanentEffect:
      "After you resolve an action card's ability text, purge that card instead of discarding it.",
    window:
      "After you add 1 or more action cards from the discard pile to your hand",
    windowEffect: "Discard 1 action card.",
    source: "ds",
  },
  {
    id: "capital_fleet",
    name: "Capital Fleet",
    faction: "dihmohn",
    permanentEffect:
      "Destroyers count as 1/2 of a ship against your fleet pool.",
    source: "ds",
  },
  {
    id: "flotilla",
    name: "Flotilla",
    faction: "dihmohn",
    permanentEffect:
      "You cannot have more infantry than non-fighter ships in the space area of a system.",
    source: "ds",
  },
  {
    id: "migrant_fleet",
    name: "Migrant Fleet",
    faction: "dihmohn",
    window: "After you explore a frontier token in a system",
    windowEffect:
      "You may explore a planet you control that is adjacent to that system.",
    source: "ds",
  },
  {
    id: "decree",
    name: "Decree",
    faction: "edyn",
    permanentEffect:
      "You may prevent ships from moving through anomalies that contain your ground forces.",
    source: "ds",
  },
  {
    id: "enlightenment",
    name: "Enlightenment (Outdated Ability - please remove this ability and add 'radiance')",
    faction: "edyn",
    permanentEffect:
      'During setup, purge your "Support for the Throne" promissory note. You may score up to 1 public objective a second time.',
    source: "ds",
    shortName: "Enlight\n-enment",
  },
  {
    id: "grace",
    name: "Grace",
    faction: "edyn",
    window:
      "Once per action phase, after you resolve the primary ability of a strategy card",
    windowEffect:
      "You may resolve the secondary ability of 1 unexhausted strategy card with a lower printed initiative number than that strategy card.",
    source: "ds",
  },
  {
    id: "radiance",
    name: "Radiance",
    faction: "edyn",
    window: "After an agenda is revealed",
    windowEffect:
      "You may predict aloud the outcome of that agenda. If your prediction is correct, place 1 command token from another player's reinforcements in a Sigil.",
    source: "ds",
  },
  {
    id: "royal_decree",
    name: "Royal Decree (Outdated - please remove this ability and add 'decree')",
    faction: "edyn",
    window: 'After the "Second Agenda" step of the agenda phase',
    windowEffect:
      "Look at the top card of the agenda deck. Then, you may ready all planets to repeat the Second Agenda step for a third agenda.",
    source: "ds",
    shortName: "Royal\nDecree",
  },
  {
    id: "black_markets",
    name: "Black Markets",
    faction: "florzen",
    window: "When you explore a planet",
    windowEffect:
      "You may treat that planet as if it had the same trait as another planet you control.",
    source: "ds",
  },
  {
    id: "data_leak",
    name: "Data Leak",
    faction: "florzen",
    window: "When you would gain a relic",
    windowEffect:
      "You may draw 1 additional card; choose 1 to gain and return the rest to the relic deck. Then, shuffle the relic deck.",
    source: "ds",
  },
  {
    id: "mercenaries",
    name: "Mercenaries",
    faction: "florzen",
    window: "At the start of a space combat",
    windowEffect:
      "You may remove up to 2 fighters you control in a system adjacent to the active system. Then, choose 1 player participating in that combat; that player places the same number of fighters from their reinforcements in the active system.",
    source: "ds",
    shortName: "Mercen\n-aries",
  },
  {
    id: "diplomats",
    name: "Diplomats",
    faction: "freesystems",
    window: "Once per action",
    windowEffect:
      "You may exhaust 1 uncontrolled planet's planet card that is on the game board to spend its resources or influence.[Note: this can be used during other players actions as well as your own]",
    source: "ds",
  },
  {
    id: "free_people",
    name: "Free People",
    faction: "freesystems",
    permanentEffect:
      "During setup, for each non-home planet other than Mecatol Rex on the game board, place that planet's planet card face up on the game board.",
    source: "ds",
  },
  {
    id: "rally_to_the_cause",
    name: "Rally to the Cause",
    faction: "freesystems",
    window:
      "Once per action, after you produce 1 or more ships in your home system",
    windowEffect:
      "You may produce up to 2 ships in a system that contains a cultural, hazardous, or industrial planet and does not contain a legendary planet or another player's units.",
    source: "ds",
  },
  {
    id: "rule_of_two",
    name: "Rule of Two",
    faction: "ghemina",
    window:
      "During a round of combat in a system that contains exactly 2 of your non-fighter ships",
    windowEffect:
      "If those ships have the same unit type, apply +2 to the result of each of those unit's combat rolls.",
    source: "ds",
  },
  {
    id: "the_lady_and_the_lord",
    name: "The Lady & The Lord",
    faction: "ghemina",
    permanentEffect:
      "During setup, place the Lord flagship token in your reinforcements and place the additional Ghemina Hero next to your faction sheet. The Lord flagship token is a second flagship unit with the abilities and attributes listed on the Lord flagship card. You have 2 Heroes.[Note: In async, this ability has been changed to bestowing the Lady, with the Lord being the default flagship. This only affects franken]",
    source: "ds",
  },
  {
    id: "abyssal_embrace",
    name: "Abyssal Embrace",
    faction: "ghoti",
    window: "When you create the game board",
    windowEffect:
      "Place the Ghoti Space tile where your home system would normally be placed. The Ghoti Space system is not a home system.",
    source: "ds",
  },
  {
    id: "mobile_command",
    name: "Mobile Command",
    faction: "ghoti",
    permanentEffect:
      "The system that contains your flagship is your home system. Your flagship cannot be captured and you cannot score public objectives if your flagship is not on the game board.",
    source: "ds",
  },
  {
    id: "spawning_grounds",
    name: "Spawning Grounds",
    faction: "ghoti",
    window: "During setup",
    windowEffect:
      "Gain and ready the Ghoti planet card and its legendary planet ability card; you cannot lose those cards.",
    source: "ds",
  },
  {
    id: "celestial_reclamation",
    name: "Celestial Reclamation",
    faction: "gledge",
    permanentEffect:
      "Planets that contain Core tokens have a base resource value of 2 and influence value of 0. Core tokens cannot be removed from the planet that contains them.",
    source: "ds",
    shortName: "Celestial Reclamatn",
  },
  {
    id: "deep_mining",
    name: "Deep Mining",
    faction: "gledge",
    window:
      "When you would explore a planet that contains 1 of your mechs or structures",
    windowEffect: "You may instead gain 1 trade good.",
    source: "ds",
  },
  {
    id: "mantle_cracking",
    name: "Mantle Cracking",
    faction: "gledge",
    window: "ACTION",
    windowEffect:
      'Place 1 "Core" token on a non-home planet you control other than Mecatol Rex that does not already contain a Core token to gain up to 4 trade goods.',
    source: "ds",
  },
  {
    id: "garden_worlds",
    name: "Garden Worlds",
    faction: "khrask",
    permanentEffect:
      "Apply +1 to the resource values of planets you control that do not contain 1 or more ground forces.",
    source: "ds",
  },
  {
    id: "lithoids",
    name: "Lithoids",
    faction: "khrask",
    window: "During the agenda phase",
    windowEffect:
      "The number of votes you cast is instead equal to the combined resource value of the planets that you exhaust.",
    source: "ds",
  },
  {
    id: "meteor_slings",
    name: "Meteor Slings",
    faction: "khrask",
    window:
      "When a unit you control produces a hit as part of a BOMBARDMENT roll against a planet another player controls",
    windowEffect:
      "You may instead place 1 infantry from your reinforcements on the planet being bombarded, that infantry unit participates in ground combat, if able.",
    source: "ds",
  },
  {
    id: "for_glory",
    name: "For Glory",
    faction: "kjalengard",
    window: "After you win a combat",
    windowEffect:
      "You may place a Glory token in the active system; if you were the attacker, you may spend 4 trade goods to research a unit upgrade technology of the same type as 1 of your units in the active system.",
    source: "ds",
  },
  {
    id: "glory",
    name: "Glory",
    faction: "kjalengard",
    window: "After you win a combat",
    windowEffect:
      "You may place or move a Glory token into the active system, or spend 1 token from your strategy pool to research a unit upgrade technology of the same type as 1 of your units that participated in that combat.",
    source: "ds",
  },
  {
    id: "heroic_tales",
    name: "Heroic Tales",
    faction: "kjalengard",
    permanentEffect:
      "Capture your infantry and fighters that are destroyed during combat.",
    window: "When you pass",
    windowEffect:
      "You may place up to 2 of your captured units on a planet you control or the space area of a system that contains 1 or more of your ships.",
    source: "ds",
  },
  {
    id: "heroism",
    name: "Heroism",
    faction: "kjalengard",
    permanentEffect:
      "Capture your infantry and fighters that are destroyed during combat.",
    window: "When you pass",
    windowEffect:
      "For each Glory token on the game board, you may return 4 of your captured units to gain 1 command token.",
    source: "ds",
  },
  {
    id: "military_engineers",
    name: "Military Engineers",
    faction: "kjalengard",
    window: "When you research a unit upgrade technology",
    windowEffect:
      "When you research a unit upgrade technology, each of your unit upgrade technologies may satisfy 1 prerequisite it shares with the technology you are researching.",
    source: "ds",
  },
  {
    id: "valor",
    name: "Valor",
    faction: "kjalengard",
    window:
      "When units make a combat roll in a system that contains a Glory token",
    windowEffect:
      "Each result of 10, before applying modifiers, produces 1 additional hit.",
    source: "ds",
  },
  {
    id: "cloaked_fleets",
    name: "Cloaked Fleets",
    faction: "kollecc",
    window: "After you produce 1 or more ships",
    windowEffect:
      "You may place up to 2 of those ships on your faction sheet, those ships are captured.",
    source: "ds",
  },
  {
    id: "shroud_of_lith",
    name: "Shroud of Lith",
    faction: "kollecc",
    window:
      "After movement, if the active system contains 1 or more of your non-fighter ships",
    windowEffect:
      "You may place up to 2 of your captured ships and 2 of your captured ground forces from your faction sheet in that system's space area.",
    source: "ds",
  },
  {
    id: "treasure_hunters",
    name: "Treasure Hunters",
    faction: "kollecc",
    window: "At the start of your turn",
    windowEffect:
      "You may look at the top card of the cultural, hazardous, or industrial exploration deck. Then, look at the top card of the relic deck.",
    source: "ds",
  },
  {
    id: "deliberate_action",
    name: "Deliberate Action",
    faction: "kolume",
    permanentEffect:
      "You cannot redistribute command tokens during the status phase.",
    window: "When you pass",
    windowEffect:
      "You may place 1 command token from your reinforcements in 1 pool on your command sheet that contains no command tokens.",
    source: "ds",
  },
  {
    id: "meditation",
    name: "Meditation",
    faction: "kolume",
    window: "ACTION",
    windowEffect:
      "Spend 1 command token from your strategy pool to ready 1 of your technologies.",
    source: "ds",
  },
  {
    id: "starfall_gunnery",
    name: "Starfall Gunnery",
    faction: "kolume",
    permanentEffect:
      "During each of your actions, up to 3 of your non-fighter ships gain SPACE CANNON 8.",
    window: "During movement, while you are not the active player",
    windowEffect: "You may only use 1 of your unit's SPACE CANNON.",
    source: "ds",
  },
  {
    id: "fervor",
    name: "Fervor",
    faction: "kortali",
    window:
      'When you spend a command token to resolve the secondary ability of the "Warfare" strategy card',
    windowEffect: "You may resolve the primary ability instead.",
    source: "ds",
  },
  {
    id: "zealous",
    name: "Zealous",
    faction: "kortali",
    window:
      'When you spend a command token to resolve the secondary ability of the "Warfare" strategy card',
    windowEffect: "You may resolve the primary ability instead.",
    source: "ds",
  },
  {
    id: "ruthless",
    name: "Ruthless",
    faction: "kortali",
    window:
      "At the start of a ground combat on an exhausted planet you do not control",
    windowEffect:
      "You may produce 1 hit and assign it to 1 of your opponent's ground forces on that planet.",
    source: "ds",
  },
  {
    id: "contagion",
    name: "Contagion",
    faction: "kyro",
    window:
      'After you resolve the primary or secondary ability of the "Politics" strategy card',
    windowEffect:
      "Commit 1 infantry from your reinforcements to a planet that is in or adjacent to a system that contains a planet you control; resolve invasion on that planet.",
    source: "ds",
  },
  {
    id: "plague_reservoir",
    name: "Plague Reservoir",
    faction: "kyro",
    permanentEffect:
      "Once per action, during invasion on a planet that contains your units, you may resolve ground combat on that planet, even if it does not contain another player's ground forces.[Note: designer intent seems to be that during invasion should refer to immediately after the space cannon defense window (this is the same as when ground combat normally starts)]",
    source: "ds",
  },
  {
    id: "subversive",
    name: "Subversive",
    faction: "kyro",
    permanentEffect:
      "When participating in a combat that would end in a draw, you are treated as the winner instead.",
    source: "ds",
  },
  {
    id: "a_new_edifice",
    name: "A New Edifice",
    faction: "lanefir",
    permanentEffect: "You may not use technology specialties.",
    window: "When you would gain a relic",
    windowEffect: "Instead purge it and explore up to 3 planets you control.",
    source: "ds",
  },
  {
    id: "iconoclasm",
    name: "Iconoclasm",
    faction: "lanefir",
    window: "When researching a non-unit upgrade technology",
    windowEffect:
      "You may purge 1 of your relic fragments to ignore 1 prerequisite on the technology you are researching.",
    source: "ds",
  },
  {
    id: "war_stories",
    name: "War Stories",
    faction: "lanefir",
    window: "Once per action, after you win a combat",
    windowEffect:
      "You may explore 1 planet you control, or if the active system does not contain any planets, the frontier exploration deck in the active system.",
    source: "ds",
  },
  {
    id: "cunning",
    name: "Cunning",
    faction: "lizho",
    window: "After you perform a tactical action in a system",
    windowEffect:
      'You may attach 1 "Trap" card from your reinforcements to a planet in that system that contains 1 or more of your infantry units.',
    source: "ds",
  },
  {
    id: "subterfuge",
    name: "Subterfuge",
    faction: "lizho",
    permanentEffect:
      "Trap attachments are attached face-down and remain hidden until revealed; you may look at Trap attachments at any time. You do not count trap attachments toward fulfilling objectives.",
    source: "ds",
  },
  {
    id: "combat_drones",
    name: "Combat Drones",
    faction: "mirveda",
    permanentEffect: "Your space docks cannot produce infantry.",
    window: "At the start of invasion",
    windowEffect:
      "You may replace each of your fighters in the active system with 1 infantry unit. During invasion, your infantry in the space area of the active system do not count against your ships' capacity.",
    source: "ds",
  },
  {
    id: "privileged_citizenry",
    name: "Privileged Citizenry",
    faction: "mirveda",
    permanentEffect:
      "Each system can contain a number of your PDS equal to the number of command tokens in your fleet pool. For the purpose of scoring objectives, you may treat each of your PDS units as though it is a structure on any planet you control.",
    source: "ds",
  },
  {
    id: "facsimile",
    name: "Facsimile",
    faction: "mortheus",
    window: "At the start of a space combat while you are the defender",
    windowEffect:
      "You may spend influence equal to the cost value of 1 of your opponent's ships in the active system to place 1 unit of that type from your reinforcements in that system.",
    source: "ds",
  },
  {
    id: "illusory_presence",
    name: "Illusory Presence",
    faction: "mortheus",
    window: "During the agenda phase, after another player casts votes",
    windowEffect:
      "You may exhaust up to 2 planets you control; that player casts an additional number of votes equal to 1 more than the combined influence values of those planets.",
    source: "ds",
  },
  {
    id: "divination",
    name: "Divination",
    faction: "mykomentori",
    window: "Before you would roll a die",
    windowEffect:
      "You may instead return 1 Omen die near your faction sheet to your reinforcements to resolve that roll as if it had the result of that die.",
    source: "ds",
  },
  {
    id: "necrophage",
    name: "Necrophage",
    faction: "mykomentori",
    permanentEffect:
      "Apply +1 to your commodity value for each space dock you control.",
    window: "After the first round of combat",
    windowEffect:
      "Gain 1 commodity or convert 1 of your commodities to a trade good.",
    source: "ds",
  },
  {
    id: "prescient_memories",
    name: "Prescient Memories",
    faction: "mykomentori",
    permanentEffect: 'You have 4 "Omen" Dice.',
    window: "At the start of the strategy phase",
    windowEffect:
      'Take and roll each of the 4 "Omen" dice, place these dice near your faction sheet.',
    source: "ds",
  },
  {
    id: "celestial_guides",
    name: "Celestial Guides",
    faction: "nivyn",
    permanentEffect:
      "Your units do not roll for gravity rifts. You may ignore the movement effects of anomalies in systems that contain or are adjacent to 1 or more of your structures.",
    source: "ds",
  },
  {
    id: "singularity_point",
    name: "Singularity Point",
    faction: "nivyn",
    permanentEffect:
      'The system that contains the "Wound" token is a nebula and a gravity rift.',
    source: "ds",
  },
  {
    id: "voidsailors",
    name: "Voidsailors",
    faction: "nivyn",
    window: "When you explore a Frontier token",
    windowEffect:
      "You may draw 1 additional card; choose 1 to resolve and return the rest to the frontier exploration deck. Then, shuffle that deck.",
    source: "ds",
  },
  {
    id: "desperados",
    name: "Desperados",
    faction: "nokar",
    window: "When you produce one or more units",
    windowEffect:
      "One destroyer does not count against your PRODUCTION limit. Apply +1 to your destroyers' move values while you are not the active player.",
    source: "ds",
  },
  {
    id: "hired_guns",
    name: "Hired Guns",
    faction: "nokar",
    window: "After system is activated",
    windowEffect:
      "Choose up to 3 of your ships. Those ships are also treated as the active players and participate in combat as their units. At the end of this tactical action, that player may replace each of those ships in the active system with their own of the same unit type. Then, remove the rest from the game board.",
    source: "ds",
  },
  {
    id: "private_fleet",
    name: "Private Fleet",
    faction: "nokar",
    permanentEffect:
      "During setup, place 4 additional destroyers in your reinforcements",
    source: "ds",
  },
  {
    id: "policies",
    name: "Policies",
    faction: "olradin",
    permanentEffect:
      'When you gather your starting components, place the 3 "Policy" cards near your faction sheet, choose which side of each card to place face up.',
    source: "ds",
  },
  {
    id: "policy_the_economy_empower",
    name: "Policy - The Economy: Empower ➕",
    faction: "olradin",
    window:
      "Once per action, after you exhaust an industrial or legendary planet you control",
    windowEffect: "Gain 1 commodity.",
    source: "ds",
  },
  {
    id: "policy_the_economy_exploit",
    name: "Policy - The Economy: Exploit ➖",
    faction: "olradin",
    permanentEffect:
      'Place the "2" commodity token on your faction sheet, your commodity value is 2.',
    window:
      "Once per action, after you exhaust an industrial planet you control",
    windowEffect:
      "Place up to 1 fighter from your reinforcements in a system that contains 1 or more of your ships.",
    source: "ds",
  },
  {
    id: "policy_the_environment_plunder",
    name: "Policy - The Environment: Plunder ➖",
    faction: "olradin",
    window: "When 1 or more of your units use PRODUCTION",
    windowEffect:
      "Reduce the PRODUCTION value of 1 of those units by 2.\\nOnce per action, after you explore a hazardous planet, you may remove 1 unit from that planet to explore that planet.",
    source: "ds",
  },
  {
    id: "policy_the_environment_preserve",
    name: "Policy - The Environment: Preserve ➕",
    faction: "olradin",
    window:
      "Once per action, after you exhaust a hazardous or legendary planet you control",
    windowEffect:
      "You may reveal the top card of the exploration deck that matches 1 of those planets; if it is a relic fragment, gain it, otherwise discard that card.",
    source: "ds",
  },
  {
    id: "policy_the_people_connect",
    name: "Policy - The People: Connect ➕",
    faction: "olradin",
    window:
      "Once per action, after you exhaust a cultural or legendary planet you control",
    windowEffect:
      "You may move 1 infantry on that planet to another planet you control.",
    source: "ds",
  },
  {
    id: "policy_the_people_control",
    name: "Policy - The People: Control ➖",
    faction: "olradin",
    permanentEffect: "You cannot perform transactions during the agenda phase.",
    window: "During the agenda phase, after you cast votes on an agenda",
    windowEffect:
      "Cast 2 additional votes for each cultural planet you exhausted.",
    source: "ds",
  },
  {
    id: "industrious",
    name: "Industrious",
    faction: "rohdhna",
    window:
      "After you place a space dock on a planet in a system that contains no other players' ships",
    windowEffect:
      "You may spend 6 resources and remove that space dock to place 1 war sun in that system's space area.",
    source: "ds",
  },
  {
    id: "orbital_foundries",
    name: "Orbital Foundries",
    faction: "rohdhna",
    permanentEffect:
      "For the purpose of scoring objectives, you may treat each of your war sun units as though it is a structure on any planet you control.",
    source: "ds",
  },
  {
    id: "recycled_materials",
    name: "Recycled Materials",
    faction: "rohdhna",
    window: "After you activate a system",
    windowEffect:
      "You may return 1 cruiser, carrier, or dreadnought you control in that system to your reinforcements to gain a number of trade goods equal to 1 less than that unit's cost value.",
    source: "ds",
  },
  {
    id: "information_brokers",
    name: "Information Brokers",
    faction: "tnelis",
    permanentEffect: "You may have 1 additional unscored secret objective.",
    source: "ds",
  },
  {
    id: "plausible_deniability",
    name: "Plausible Deniability",
    faction: "tnelis",
    window: "When you draw 1 or more secret objective cards",
    windowEffect:
      "Draw 1 additional secret objective card. Then, return 1 secret objective card to the secret objective deck; shuffle that deck.",
    source: "ds",
  },
  {
    id: "stealth_insertion",
    name: "Stealth Insertion",
    faction: "tnelis",
    permanentEffect:
      'If you place units onto the same planet as another player\'s units, your units must participate in combat during the "Ground Combat" step.',
    source: "ds",
  },
  {
    id: "binding_debts",
    name: "Binding Debts",
    faction: "vaden",
    permanentEffect:
      "Other players may place their control tokens on your faction sheet at any time. [Note: when you have this ability, you cannot use normal debt, as this ability utilizes the bot's debt system. Track normal debt manually if at all.]",
    window: "At the start of the status phase",
    windowEffect:
      "Each of your neighbors may give you 1 trade good to remove up to 2 of their control tokens from your faction sheet.",
    source: "ds",
  },
  {
    id: "collateralized_loans",
    name: "Collateralized Loans",
    faction: "vaden",
    window:
      "After 1 of your opponent's ships is destroyed during a round of space combat:",
    windowEffect:
      "You may remove 1 of that player's control tokens from your faction sheet to place 1 ship of that type from your reinforcements in the active system.",
    source: "ds",
    shortName: "Collateral\n-ized Loans",
  },
  {
    id: "fine_print",
    name: "Fine Print",
    faction: "vaden",
    window:
      "After a player resolves the secondary ability of 1 of your strategy cards",
    windowEffect:
      "Place up to 1 of their control tokens on your faction sheet.",
    source: "ds",
  },
  {
    id: "cargo_raiders",
    name: "Cargo Raiders",
    faction: "vaylerian",
    window: "During the first round of a space combat",
    windowEffect:
      "You may prevent your opponent from declaring a retreat unless they spend 1 trade good.",
    source: "ds",
  },
  {
    id: "raze",
    name: "Raze",
    faction: "vaylerian",
    window:
      "After 1 or more of another player's structures are destroyed on a planet that contains your units",
    windowEffect: "You may replenish your commodities.",
    source: "ds",
  },
  {
    id: "scour",
    name: "Scour",
    faction: "vaylerian",
    window: "Once per tactical action, after you gain control of a planet",
    windowEffect: "You may discard 1 action card to ready that planet.",
    source: "ds",
  },
  {
    id: "corporate_entity",
    name: "Corporate Entity",
    faction: "veldyr",
    permanentEffect:
      "During setup, take the additional Veldyr faction promissory notes; you have 4 faction promissory notes. Branch Office attachments do not count toward scoring objectives. [Note: they still count towards strengthen bonds and betray a friend, as they are promissory notes]",
    source: "ds",
  },
  {
    id: "holding_company",
    name: "Holding Company",
    faction: "veldyr",
    window:
      "At the start of the status phase, for each planet that has a Branch Office attachment",
    windowEffect:
      "You may gain 1 commodity or convert 1 of your commodities to a trade good.",
    source: "ds",
  },
  {
    id: "targeted_acquisition",
    name: "Targeted Acquisition",
    faction: "veldyr",
    window: "At the start of the status phase",
    windowEffect:
      "You may give 1 of your faction promissory notes in your hand to 1 of your neighbors.",
    source: "ds",
  },
  {
    id: "ancient_knowledge",
    name: "Ancient Knowledge",
    faction: "zealots",
    window:
      "When you use a technology specialty to ignore a prerequisite on a technology card you are researching",
    windowEffect:
      "You may ignore 1 additional prerequisite of the same color. After you exhaust a planet to use its technology specialty, you may gain 1 commodity.",
    source: "ds",
  },
  {
    id: "conspirators",
    name: "Conspirators",
    faction: "zealots",
    window:
      "Once per agenda phase, after an agenda is revealed, if you are not the speaker",
    windowEffect: "You may choose to vote after the speaker on that agenda.",
    source: "ds",
    shortName: "Conspir\n-ators",
  },
  {
    id: "biophobic",
    name: "Biophobic",
    faction: "zelian",
    window: "During the agenda phase",
    windowEffect:
      "The number of votes you cast is instead equal to the number of planets you exhaust to cast votes.",
    source: "ds",
  },
  {
    id: "obsessive_designs",
    name: "Obsessive Designs",
    faction: "zelian",
    window:
      "During the action phase, after you research a unit upgrade technology",
    windowEffect:
      "You may use the PRODUCTION ability of 1 of your space docks in your home system to produce units of that type, reducing the combined cost of the produced units by 2.",
    source: "ds",
  },
  {
    id: "prescience",
    name: "Prescience",
    faction: "uydai",
    permanentEffect:
      "At the end of your turn,if you have not passed, place 1 of the plan cards on your faction sheet, face down. At the start of your turn, reveal and resolve the plan card on your faction sheet, if able",
    source: "ds",
  },
  {
    id: "the_starlit_path",
    name: "The Starlit Path",
    faction: "uydai",
    window: "At the end of your turn",
    windowEffect:
      "You may return 6 path tokens from your faction sheet to your reinforcements to resolve the secondary ability of any strategy card without spending a command token.",
    source: "ds",
  },
  {
    id: "narrow_way",
    name: "Narrow Way",
    faction: "uydai",
    window: "At any time",
    windowEffect:
      "You may return 1 path token to your reinforcements to redistribute 1 of your command tokens.",
    source: "ds",
  },
  {
    id: "ancient_empire",
    name: "Ancient Empire",
    faction: "pharadn",
    permanentEffect:
      "During setup, place 1 tomb token on each of up to 14 planets. When you gain control of a planet that contains a tomb token, purge that token to capture 2 infantry from the supply. ",
    source: "ds",
  },
  {
    id: "dark_purpose",
    name: "Dark Purpose",
    faction: "pharadn",
    window: "When you score an objective",
    windowEffect: "When you score an objective, gain 1 command token.",
    source: "ds",
  },
  {
    id: "mark_of_pharadn",
    name: "Mark Of Pharadn",
    faction: "pharadn",
    permanentEffect:
      "Abilities that would allow you to place infantry on the game board instead allow you to produce those units. When you produce infantry, you must return 1 of your captured infantry to produce each of those units, instead of spending resources.",
    source: "ds",
  },
  {
    id: "paranoia",
    name: "Paranoia",
    faction: "zelian",
    permanentEffect:
      "Game effects other than your command tokens cannot prevent you from activating, or moving ships into, your home system.",
    source: "ds",
  },
  {
    id: "data_recovery",
    name: "Data Recovery",
    faction: "qhet",
    permanentEffect:
      "Once per action, after 1 or more of your units is destroyed, you may place 1 of the active player’s control tokens on your faction sheet.",
    source: "ds",
  },
  {
    id: "tempest_squads",
    name: "Tempest Squads",
    faction: "qhet",
    permanentEffect:
      "While you are the active player, 2 infantry in the active system do not count against your ships’ capacity. [Note: think of this as sort of like a mild Sardakk hero]",
    source: "ds",
  },
  {
    id: "black_ops",
    name: "Black Ops",
    faction: "qhet",
    window: "After you win a combat as the attacker",
    windowEffect:
      "You may remove 2 of your opponent’s control tokens from your faction sheet to draw 1 secret objective, or 5 of those tokens to gain 1 command token and take 1 of their unscored secret objectives. ",
    source: "ds",
  },
  {
    id: "synthesis",
    name: "Synthesis",
    faction: "atokera",
    permanentEffect:
      "Readied planets you control have PLANETARY SHIELD and PRODUCTION 0 as if they were units. Apply +1 to the PRODUCTION value of each of your units with PRODUCTION. ",
    source: "ds",
  },
  {
    id: "living_metals",
    name: "Living Metals",
    faction: "atokera",
    permanentEffect:
      "Agenda outcomes and action cards that have component actions cannot remove or destroy your units, or place other player’s units on planets you control. [Note: protects against ixthian] ",
    source: "ds",
  },
  {
    id: "classified_developments",
    name: "Classified Developments",
    faction: "belkosea",
    permanentEffect:
      "ACTION: Spend a combined total of 5 resources or influence to place 1 superweapon ability card in your play area, and the corresponding superweapon token on a planet you control.",
    source: "ds",
  },
  {
    id: "superweapon_projects",
    name: "Superweapon Projects",
    faction: "belkosea",
    permanentEffect:
      "Superweapons you control are structures and cannot be destroyed by abilities. Each planet can contain a maximum of 1 superweapon. ",
    source: "ds",
  },
  {
    id: "honor_bound",
    name: "Honor-Bound",
    faction: "toldar",
    permanentEffect:
      "When you gain honor, place or flip 1 code token on your faction sheet face up, if able. When you gain dishonor, instead place or flip 1 code token face down, if able.",
    source: "ds",
  },
  {
    id: "pride",
    name: "Pride",
    faction: "toldar",
    permanentEffect:
      "When you win a combat as the attacker, gain 1 honor if your opponent has more victory points than you, or gain 1 dishonor if they have fewer victory points than you; otherwise, gain 1 honor or 1 dishonor and ignore this ability until the end of your turn.",
    source: "ds",
  },
  {
    id: "the_code",
    name: "The Code",
    faction: "toldar",
    permanentEffect:
      "When you gain—or lose—honor or dishonor, gain or lose the Code cards corresponding with your current honor and dishonor. This faction has the abilities on those Code cards.",
    source: "ds",
  },
  {
    id: "bestow",
    name: "Bestow (2 Honor)",
    faction: "toldar",
    permanentEffect:
      "When you pass, you may allow all of your neighbors to each gain 2 commodities, for each neighbor that does, gain 1 commodity.",
    source: "ds",
  },
  {
    id: "reflect",
    name: "Reflect (5 Honor)",
    faction: "toldar",
    permanentEffect:
      "When you score an objective, if another player has already scored that objective, draw 1 action card.",
    source: "ds",
  },
  {
    id: "ascend",
    name: "Ascend (8 Honor)",
    faction: "toldar",
    permanentEffect:
      "When you gain this card, gain 1 victory point. When you lose this card, lose 1 victory point.",
    source: "ds",
  },
  {
    id: "thwart",
    name: "Thwart (2 Dishonor)",
    faction: "toldar",
    permanentEffect:
      "When you would gain 1 or more commodities or trade goods, instead take them from any combination of your neighbors, if able. [Note: not automated, have your neighbors subtract with /player stats]",
    source: "ds",
  },
  {
    id: "deceive",
    name: "Deceive (5 Dishonor)",
    faction: "toldar",
    permanentEffect:
      "When you would draw 1 or more action cards, instead take 1 at random from 1 of your neighbors. ",
    source: "ds",
  },
  {
    id: "scourge",
    name: "Scourge (8 Dishonor)",
    faction: "toldar",
    permanentEffect:
      "Purge your promissory notes [Note: even ones in other players hands/play areas]; you cannot gain honor. You treat scored secret objectives as public objectives, instead of public objectives.",
    source: "ds",
  },
  {
    id: "mitosis",
    name: "Mitosis",
    faction: "arborec",
    permanentEffect: "Your space docks cannot produce infantry",
    window: "At the start of the status phase",
    windowEffect:
      "Place 1 infantry from your reinforcements on any planet you control.",
    source: "base",
  },
  {
    id: "creuss_gate",
    name: "Creuss Gate",
    faction: "ghost",
    permanentEffect:
      "When you create the game board, place the Creuss Gate (tile 17) where your home system would normally be placed. The Creuss Gate system is not a home system. Then, place your home system (tile 51) in your play area.",
    source: "base",
  },
  {
    id: "quantum_entanglement",
    name: "Quantum Entanglement",
    faction: "ghost",
    permanentEffect:
      "You treat all systems that contain either an alpha or beta wormhole as adjacent to each other. Game effects cannot prevent you from using this ability.",
    source: "base",
    shortName: "Quantum\nEnt'glem'nt",
  },
  {
    id: "slipstream",
    name: "Slipstream",
    faction: "ghost",
    window: "During your tactical actions",
    windowEffect:
      "Apply +1 to the move value of each of your ships that starts its movement in your home system or in a system that contains either an alpha or beta wormhole.",
    source: "base",
  },
  {
    id: "arbiters",
    name: "Arbiters",
    faction: "hacan",
    permanentEffect:
      "When you are negotiating a transaction, action cards can be exchanged as part of that transaction.",
    source: "base",
  },
  {
    id: "guild_ships",
    name: "Guild Ships",
    faction: "hacan",
    permanentEffect:
      "You can negotiate transactions with players who are not your neighbor.",
    source: "base",
  },
  {
    id: "master_of_trade",
    name: "Masters of Trade",
    faction: "hacan",
    permanentEffect:
      'You do not have to spend a command token to resolve the secondary ability of the "Trade" strategy card.',
    source: "base",
  },
  {
    id: "analytical",
    name: "Analytical",
    faction: "jolnar",
    window:
      "When you research a technology that is not a unit upgrade technology",
    windowEffect: "You may ignore 1 prerequisite.",
    source: "base",
  },
  {
    id: "brilliant",
    name: "Brilliant",
    faction: "jolnar",
    window:
      'When you spend a command token to resolve the secondary ability of the "Technology" strategy card',
    windowEffect: "You may resolve the primary ability instead.",
    source: "base",
  },
  {
    id: "fragile",
    name: "Fragile",
    faction: "jolnar",
    permanentEffect:
      "Apply -1 to the result of each of your unit's combat rolls.",
    source: "base",
  },
  {
    id: "assimilate",
    name: "Assimilate",
    faction: "l1z1x",
    window: "When you gain control of a planet",
    windowEffect:
      "Replace each PDS and space dock that is on that planet with a matching unit from your reinforcements.",
    source: "base",
  },
  {
    id: "harrow",
    name: "Harrow",
    faction: "l1z1x",
    window: "At the end of each round of ground combat",
    windowEffect:
      "Your ships in the active system may use their BOMBARDMENT abilities against your opponent's ground forces on the planet.",
    source: "base",
  },
  {
    id: "armada",
    name: "Armada",
    faction: "letnev",
    permanentEffect:
      "The maximum number of non-fighter ships you can have in each system is equal to 2 more than the number of tokens in your fleet pool",
    source: "base",
  },
  {
    id: "munitions",
    name: "Munitions Reserves",
    faction: "letnev",
    window: "At the start of each round of space combat",
    windowEffect:
      "You may spend 2 trade goods to re-roll any number of your dice during that combat round.",
    source: "base",
  },
  {
    id: "ambush",
    name: "Ambush",
    faction: "mentak",
    window: "At the start of a space combat",
    windowEffect:
      "You may roll 1 die for each of up to 2 of your cruisers or destroyers in the system. For each result equal to or greater than that ship's combat value, produce 1 hit; your opponent must assign it to 1 of their ships.",
    source: "base",
  },
  {
    id: "pillage",
    name: "Pillage",
    faction: "mentak",
    window:
      "After 1 of your neighbors gains trade goods or resolves a transaction",
    windowEffect:
      "If they have 3 or more trade goods, you may take 1 of their trade goods or commodities.",
    source: "base",
  },
  {
    id: "gashlai_physiology",
    name: "Gashlai Physiology",
    faction: "muaat",
    permanentEffect: "Your ships can move through supernovas",
    source: "base",
  },
  {
    id: "star_forge",
    name: "Star Forge",
    faction: "muaat",
    window: "ACTION",
    windowEffect:
      "Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns.",
    source: "base",
  },
  {
    id: "foresight",
    name: "Foresight",
    faction: "naalu",
    window:
      "After another player moves ships into a system that contains 1 or more of your ships",
    windowEffect:
      "You may place 1 token from your strategy pool in an adjacent system that does not contain another player's ships; move your ships from the active system into that system.",
    source: "base",
  },
  {
    id: "telepathic",
    name: "Telepathic",
    faction: "naalu",
    window: "At the end of the strategy phase",
    windowEffect:
      'Place the Naalu "0" token on your strategy card; you are first in initiative order.',
    source: "base",
  },
  {
    id: "galactic_threat",
    name: "Galactic Threat",
    faction: "nekro",
    permanentEffect: "You cannot vote on agendas",
    window: "Once per agenda phase, after an agenda is revealed",
    windowEffect:
      "You may predict aloud the outcome of that agenda. If your prediction is correct, gain 1 technology that is owned by a player who voted how you predicted.",
    source: "base",
  },
  {
    id: "propagation",
    name: "Propagation",
    faction: "nekro",
    permanentEffect: "You cannot research technology",
    window: "When you would research a technology",
    windowEffect: "Gain 3 command tokens instead.",
    source: "base",
    shortName: "Propa-\ngation",
  },
  {
    id: "technological_singularity",
    name: "Technological Singularity",
    faction: "nekro",
    window: "Once per combat, after 1 of your opponent's units is destroyed",
    windowEffect: "You may gain 1 technology that is owned by that player.",
    source: "base",
    shortName: "Techno...\nSingularity",
  },
  {
    id: "nomadic",
    name: "Nomadic",
    faction: "saar",
    permanentEffect:
      "You can score objectives even if you do not control the planets in your home system.",
    source: "base",
  },
  {
    id: "scavenge",
    name: "Scavenge",
    faction: "saar",
    window: "After you gain control of a planet",
    windowEffect: "Gain 1 trade good.",
    source: "base",
  },
  {
    id: "unrelenting",
    name: "Unrelenting",
    faction: "sardakk",
    permanentEffect:
      "Apply +1 to the result of each of your unit's combat rolls.",
    source: "base",
    shortName: "Unre-\nlenting",
  },
  {
    id: "orbital_drop",
    name: "Orbital Drop",
    faction: "sol",
    window: "ACTION",
    windowEffect:
      "Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control.",
    source: "base",
  },
  {
    id: "versatile",
    name: "Versatile",
    faction: "sol",
    window: "When you gain command tokens during the status phase",
    windowEffect: "Gain 1 additional command token.",
    source: "base",
  },
  {
    id: "blood_ties",
    name: "Blood Ties",
    faction: "winnu",
    permanentEffect:
      "You do not have to spend influence to remove the custodians token from Mecatol Rex.",
    source: "base",
  },
  {
    id: "reclamation",
    name: "Reclamation",
    faction: "winnu",
    window:
      "After you resolve a tactical action during which you gained control of Mecatol Rex",
    windowEffect:
      "You may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.",
    source: "base",
    shortName: "Recla-\nmation",
  },
  {
    id: "peace_accords",
    name: "Peace Accords",
    faction: "xxcha",
    window:
      'After you resolve the primary or secondary ability of the "Diplomacy" strategy card',
    windowEffect:
      "You may gain control of 1 planet other than Mecatol Rex that does not contain any units and is in a system that is adjacent to a planet you control.",
    source: "base",
  },
  {
    id: "quash",
    name: "Quash",
    faction: "xxcha",
    window: "When an agenda is revealed",
    windowEffect:
      "You may spend 1 token from your strategy pool to discard that agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead.",
    source: "base",
  },
  {
    id: "devotion",
    name: "Devotion",
    faction: "yin",
    window: "After each space battle round",
    windowEffect:
      "You may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent's ships in that system.",
    source: "base",
  },
  {
    id: "indoctrination",
    name: "Indoctrination",
    faction: "yin",
    window: "At the start of a ground combat",
    windowEffect:
      "You may spend 2 influence to replace 1 of your opponent's participating infantry with 1 infantry from your reinforcements.",
    source: "base",
    shortName: "Indoctri\n-nation",
  },
  {
    id: "yin_breakthrough",
    name: "Yin Breakthrough",
    faction: "yin",
    permanentEffect:
      "When you gain this card or score a public objective, gain the alliance ability of a random, unused faction.",
    source: "thunders_edge",
  },
  {
    id: "crafty",
    name: "Crafty",
    faction: "yssaril",
    permanentEffect:
      "You can have any number of action cards in your hand. Game effects cannot prevent you from using this ability.",
    source: "base",
  },
  {
    id: "scheming",
    name: "Scheming",
    faction: "yssaril",
    window: "When you draw 1 or more action cards",
    windowEffect:
      "Draw 1 additional action card. Then, choose and discard 1 action card from your hand.",
    source: "base",
  },
  {
    id: "stall_tactics",
    name: "Stall Tactics",
    faction: "yssaril",
    window: "ACTION",
    windowEffect: "Discard 1 action card from your hand",
    source: "base",
  },
  {
    id: "liberate",
    name: "Liberate",
    faction: "bastion",
    window: "When you gain control of a planet",
    windowEffect:
      "ready that planet if it contains a number of your infantry equal to or greater than that planet's resource value; otherwise, place 1 infantry on that planet.",
    source: "thunders_edge",
  },
  {
    id: "galvanize",
    name: "Galvanize",
    faction: "bastion",
    permanentEffect:
      "Galvanized units roll 1 additional die for combat rolls and unit abilities.",
    window: "When a game effect instructs a player to galvanize a unit",
    windowEffect:
      "they place a galvanize token beneath it if it does not have one. ",
    source: "thunders_edge",
  },
  {
    id: "phoenixstandard",
    name: "Phoenix Standard",
    faction: "bastion",
    window: "At the end of combat",
    windowEffect: "you may galvanize 1 of your units that participated.",
    source: "thunders_edge",
  },
  {
    id: "survivalinstinct",
    name: "Survival Instinct",
    faction: "ralnel",
    window: "After a player activates a system that contains your ships",
    windowEffect:
      "you may move up to 2 of your ships into the active system from adjacent systems that do not contain your command tokens.",
    source: "thunders_edge",
  },
  {
    id: "researchteam",
    name: "Research Team",
    faction: "deepwrought",
    window: "When ground forces are committed",
    windowEffect:
      "if your units on that planet are not already coexisting, you may choose for your units to coexist.",
    source: "thunders_edge",
  },
  {
    id: "oceanbound",
    name: "Oceanbound",
    faction: "deepwrought",
    permanentEffect:
      "Any time you have more ocean cards than there are planets that contain your coexisting units, discard ocean cards until you do not.",
    window: "When your units begin coexisting on a planet",
    windowEffect: "gain an ocean card and ready it.",
    source: "thunders_edge",
  },
  {
    id: "sundered",
    name: "Sundered",
    faction: "crimson",
    permanentEffect:
      "You cannot use wormholes other than epsilon wormholes. Other players' units that move or are placed into your home system are destroyed.",
    source: "thunders_edge",
  },
  {
    id: "incursion",
    name: "Incursion",
    faction: "crimson",
    permanentEffect:
      "When you activate a system that contains a breach, you may flip that breach; systems that contain active breaches are adjacent. at the end of the status phase, any player with ships in a system that contain an active breach may remove that breach.",
    source: "thunders_edge",
  },
  {
    id: "miniaturization",
    name: "Miniaturization",
    faction: "ralnel",
    permanentEffect:
      "Your structures can be transported by any ship; this does not require or count against capacity. While your structures are in the space area, they cannot use their unit abilities.",
    window: "At the end of your tactical actions",
    windowEffect:
      "you may place your structures that are in space areas onto planets you control in their respective systems.",
    source: "thunders_edge",
  },
  {
    id: "sorrow",
    name: "Sorrow",
    faction: "crimson",
    permanentEffect:
      "When you create the game board, place the Sorrow (tile 94) where your home system would normally be placed, then place a inactive breach there. The Sorrow is not a home system. Then, place your home system (tile 118) in your play area.",
    source: "thunders_edge",
  },
  {
    id: "plotsplots",
    name: "Plots Within Plots",
    faction: "firmament",
    permanentEffect:
      "You can score secret objectives already scored by other players if you fulfill their requirements; this does not count against your secret objective limit or the number you can score in a round.",
    window: "When you score another player's secret objective",
    windowEffect:
      "do not gain a victory point; instead, place a facedown plot card into your play area with that player's control token on it.",
    source: "thunders_edge",
  },
  {
    id: "puppetsoftheblade",
    name: "Puppets of the Blade",
    shortName: "Puppet Soft\nHe Blade",
    faction: "firmament",
    window:
      "If you have at least 1 plot card in your play area, gain the following ability:",
    windowEffect:
      "ACTION: Purge The Firmament's faction sheet, leaders, planet cards, and promissory note. Then, gain all of the faction components for The Obsidian.",
    source: "thunders_edge",
  },
  {
    id: "nocturne",
    name: "Nocturne",
    faction: "obsidian",
    permanentEffect: "This faction cannot be chosen during setup.",
    source: "thunders_edge",
  },
  {
    id: "bladesorchestra",
    name: "The Blade's Orchestra",
    shortName: "Blade's\nOrchestra",
    faction: "obsidian",
    window: "When this faction comes into play",
    windowEffect:
      "flip your home system, double-sided faction components, and all of your in-play plot cards. Then, ready Cronos Hollow and Tallin Hollow if you control them.",
    source: "thunders_edge",
  },
  {
    id: "marionettes",
    name: "Marionettes",
    faction: "obsidian",
    permanentEffect:
      "The player or players whose control tokens are on each plot card are the puppeted players for that plot.",
    source: "thunders_edge",
  },
  {
    id: "thepraefecti",
    name: "The Praefecti",
    faction: "keleresplus",
    permanentEffect:
      "During setup, choose an unplayed faction from among 3 random Keleres-aligned factions; take that faction's home system, command tokens, and control markers. Additionally, take the Drahn hero that corresponds to that faction.",
    source: "keleresplus",
  },
  {
    id: "custodiavigilia",
    name: "The Praefecti",
    faction: "keleresplus",
    permanentEffect:
      "During setup, gain the Custodia Vigilia planet card and it's planet ability card. You cannot lose these cards and Nevermore begins the game exhausted.",
    source: "keleresplus",
  },
  {
    id: "mercenaryties",
    name: "Mercenary Ties",
    faction: "drahn",
    permanentEffect:
      "During setup, choose an unplayed faction from among 3 random Drahn-aligned factions; take that faction's home system, command tokens, and control markers. Additionally, take the Drahn hero that corresponds to that faction.",
    source: "keleresplus",
  },
  {
    id: "contractnetwork",
    name: "Contract Network",
    faction: "drahn",
    window: "When another player scores an objective you've scored",
    windowEffect:
      "You may gain 1 commodity or convert 1 of your commodities into a trade good.",
    source: "keleresplus",
  },
  {
    id: "shadowoperatives",
    name: "Shadow Operatives",
    faction: "drahn",
    permanentEffect:
      "During setup, gain the Nevermore planet card and it's planet ability card. You cannot lose these cards and Nevermore begins the game exhausted.",
    source: "keleresplus",
  },
  {
    id: "underhanded_maneuver",
    name: "Underhanded Maneuver",
    faction: "arvaxi",
    window: "At the start of the strategy phase",
    windowEffect:
      "You may choose 1 of your neighbours. That player must give you 1 action card from their hand.",
    source: "balacasi",
  },
  {
    id: "scrap_metal",
    name: "Scrap Metal",
    faction: "arvaxi",
    window: "After you discard an action card without resolving its effects",
    windowEffect:
      "Gain 1 commodity or convert 1 commodity to a trade good. Game effects cannot prevent you from playing action cards.",
    source: "balacasi",
  },
  {
    id: "ultimate_authority",
    name: "Ultimate Authority",
    faction: "arvaxi",
    permanentEffect:
      "Apply +1 to the influence value of planets that contain 3 or more of your units. After you explore a planet that contains 3 or more of your units, draw 1 action card.",
    source: "balacasi",
  },
  {
    id: "quantum_fabrication",
    name: "Quantum Fabrication",
    faction: "xan",
    permanentEffect:
      "Once per action, when you place a space dock on a planet in a non-home system using the primary or secondary ability of the Construction strategy card, you may use its PRODUCTION ability immediately.",
    source: "balacasi",
  },
  {
    id: "transformation_protocol",
    name: "Transformation Protocol",
    faction: "xan",
    permanentEffect:
      "When casting votes on an agenda, you may choose up to 2 of your ships that have SUSTAIN DAMAGE to become damaged. For each ship chosen, cast 4 additional votes.",
    source: "balacasi",
  },
  {
    id: "eusociality",
    name: "Eusociality",
    faction: "kalora",
    permanentEffect:
      "When you retreat during a space combat in a system that doesn't contain your command tokens, you do not place a command token into the target system. You may treat “Skilled Retreat” action cards as a retreat for the purpose of this ability.",
    source: "balacasi",
  },
  {
    id: "carapace_regeneration",
    name: "Carapace Regeneration",
    faction: "kalora",
    permanentEffect:
      "After you retreat during a space combat, repair all of your damaged ships that retreated.",
    source: "balacasi",
  },
  {
    id: "primordial",
    name: "Primordial",
    faction: "kalora",
    permanentEffect:
      "When you score a public objective, if you are the first to score that objective, you may gain trade goods equal to the number of other players in the game.",
    source: "balacasi",
  },
  {
    id: "initiation",
    name: "Initiation",
    faction: "lunarium",
    permanentEffect:
      "During setup, place 1 command token from your reinforcements on your faction sheet. ",
    source: "balacasi",
  },
  {
    id: "expanding_minds",
    name: "Expanding Minds",
    faction: "lunarium",
    permanentEffect:
      "You may have up to 6 command tokens on your faction sheet. Your secret objective limit is equal to the number of command tokens on your faction sheet. ",
    source: "balacasi",
  },
  {
    id: "multitasking",
    name: "Multitasking",
    faction: "lunarium",
    permanentEffect:
      "When you redistribute command tokens or draw a secret objective, you may move any number of command tokens between your fleet pool and your faction sheet.",
    source: "balacasi",
  },
  {
    id: "patience",
    name: "Patience",
    faction: "onyxxa",
    permanentEffect:
      "At the end of the strategy phase, place the Onyxxa Infinity token on your strategy card. You are last in initiative order. When you perform a strategic action, resolve your strategy card’s secondary ability instead of its primary ability.",
    source: "balacasi",
  },
  {
    id: "strategic_fluidity",
    name: "Strategic Fluidity",
    faction: "onyxxa",
    permanentEffect:
      "When you would spend a token from your strategy pool to resolve the secondary ability of a strategy card other than Politics, you may spend an additional command token from your strategy pool to resolve the primary ability of that card instead.",
    source: "balacasi",
  },
  {
    id: "increased_surveillance",
    name: "Increased Surveillance",
    faction: "onyxxa",
    permanentEffect:
      "When you resolve the primary ability of a strategy card, place a control token on your commander. At the start of the status phase, remove your control tokens from your commander.",
    source: "balacasi",
  },
  {
    id: "rewrite_destiny",
    name: "Rewrite Destiny",
    faction: "tyris",
    permanentEffect:
      "Once per status phase, when the speaker reveals a public objective, you may spend 1 command token from your strategy pool to discard that objective. The speaker then reveals a new public objective from the same deck and reshuffles it.",
    source: "balacasi",
  },
  {
    id: "arrow_of_time",
    name: "Arrow of Time",
    faction: "tyris",
    permanentEffect:
      "During each of your turns in the action phase, you may take an additional non-strategic action.",
    source: "balacasi",
  },
  {
    id: "phantom_energy",
    name: "Phantom Energy",
    faction: "tyris",
    permanentEffect:
      "After you explore a frontier token during a tactical action, you may place a control token on a unit space on your faction sheet that matches a ship in the active system. You may move ships that have a control token on your faction sheet out of systems containing your command tokens. At the end of your turn, remove control tokens from your faction sheet for any ships matching those you have in systems that contain your command tokens.",
    source: "balacasi",
  },
  {
    id: "veiled_ember_forge",
    name: "Veiled Ember Forge",
    faction: "vyserix",
    permanentEffect:
      "After you gain control of a planet with a technology specialty, you may place 1 PDS on that planet.",
    source: "balacasi",
  },
  {
    id: "scattered_legions",
    name: "Scattered Legions",
    faction: "vyserix",
    permanentEffect:
      "At the end of your turns, you may not have more ground forces on a non-home planet than the greater of its resource or influence values. Place any excess on a planet you control in your home system, or return them to your reinforcements.",
    source: "balacasi",
  },
  {
    id: "marked_prey",
    name: "Marked Prey",
    faction: "zephyrion",
    permanentEffect:
      "At the start of the strategy phase, place any number of your bounty tokens from your reinforcements on the unit space of non-fighter ships on other players’ factions sheets. You can have a maximum of 1 bounty token on each unit space.",
    source: "balacasi",
  },
  {
    id: "confirmed_kill",
    name: "Confirmed Kill",
    faction: "zephyrion",
    permanentEffect:
      "During your turn, if a ship with a bounty token on its unit space is destroyed, return the bounty token to your reinforcements and gain 3 trade goods.",
    source: "balacasi",
  },
];
