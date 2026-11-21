// Auto-generated file - Do not edit manually
// Generated from src/main/resources/data/abilities/*.json files

import { Ability } from "./types";

export const abilities: Ability[] = [
  {
    id: "mitosis",
    name: "Mitosis",
    faction: "arborec",
    permanentEffect: "Your space docks cannot produce infantry.",
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
      "The maximum number of non-fighter ships you can have in each system is equal to 2 more than the number of tokens in your fleet pool.",
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
    permanentEffect: "Your ships can move through supernovas.",
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
    window: "After each space combat round",
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
    source: "deprecated",
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
    windowEffect: "Discard 1 action card from your hand.",
    source: "base",
  },
  {
    id: "dream_nexus",
    name: "Dream Nexus",
    faction: "dream",
    permanentEffect:
      "Systems that contain a nexus token are nebulas. Your ships' movement is not affected by these nebulae.",
    source: "beans",
  },
  {
    id: "the_waking",
    name: "The Waking",
    faction: "dream",
    window: "At the end of the status phase",
    windowEffect:
      "Any player with ships in a system that contains a nexus token may remove 1 token from 1 of those systems.",
    source: "beans",
  },
  {
    id: "incomprehensible_form",
    name: "Incomprehensible Form",
    faction: "dream",
    window: "When 1 of your ships would be destroyed during space combat",
    windowEffect:
      "You may instead remove 1 nexus token from the active system.",
    source: "beans",
  },
  {
    id: "fragmentation",
    name: "Fragmentation",
    faction: "crystellum",
    window: "After one of your non-fighter ships is destroyed",
    windowEffect: "Capture 1 fighter from the supply.",
    source: "beans",
  },
  {
    id: "pieces_of_a_whole",
    name: "Pieces of a Whole",
    faction: "crystellum",
    window: "At the start of space combat",
    windowEffect:
      "You may return up to 2 captured fighters from your faction sheet and place them in the active system.",
    source: "beans",
  },
  {
    id: "phoenix_rising",
    name: "Phoenix Rising",
    faction: "ashen",
    window: "During setup",
    windowEffect:
      "Place 12 infantry from the supply on your faction sheet. These units are captured. When your infantry are removed or destroyed, capture them. Game effects cannot prevent you from using this ability.",
    source: "beans",
  },
  {
    id: "forged_in_fire",
    name: "Forged in Fire",
    faction: "ashen",
    window:
      "When you would place infantry from your reinforcements on the game board",
    windowEffect:
      "You must produce those units instead. For each infantry you produce, return 1 captured infantry instead of spending resources.",
    source: "beans",
  },
  {
    id: "salvage_collectors",
    name: "Salvage Collectors",
    faction: "iron",
    window:
      "Once per combat you are participating in, after 1 or more ships are destroyed",
    windowEffect:
      "Take a salvage card from your reinforcements of the same type as one of the destroyed units and place it face up in your play area.",
    source: "beans",
  },
  {
    id: "modifications",
    name: "Modifications",
    faction: "iron",
    window: "During setup",
    windowEffect:
      "Take the 6 salvage cards and place them in your reinforcements. While a salvage card is in your play area, the corresponding unit gains the abilities and values on that card, if they do not already have them.",
    source: "beans",
  },
  {
    id: "trade_secrets",
    name: "Trade Secrets",
    faction: "iron",
    window: "When you research a unit upgrade technology",
    windowEffect:
      "You may discard 1 salvage card of that unit's type to ignore all of that technology's prerequisites.",
    source: "beans",
  },
  {
    id: "planetary_reconfiguration",
    name: "Planetary Reconfiguration",
    faction: "ta",
    window: "After you explore a planet",
    windowEffect:
      "You may attach 1 of your designs from your reinforcements to that planet if it does not already have one. When you lose control of a planet with a design attached to it, return that card to your reinforcements. Designs do not count as attachments for the purposes of scoring objectives.",
    source: "beans",
  },
  {
    id: "perfect_architecture",
    name: "Perfect Architecture",
    faction: "ta",
    window:
      "When you explore a planet that has an attachment or contains 1 or more of your structures",
    windowEffect:
      "You may draw 1 additional card; Choose 1 to resolve and discard the rest.",
    source: "beans",
  },
  {
    id: "neural_instruments",
    name: "Neural Instruments",
    faction: "netrunners",
    window:
      "When any other player gains a technology, or exhausts a technology for its effect",
    windowEffect:
      "Place 1 of that player's control tokens on your faction sheet. You cannot have more than 1 of each other player's control token on your faction sheet at a time.",
    source: "beans",
  },
  {
    id: "proxy_network",
    name: "Proxy Network",
    faction: "netrunners",
    window: "When you would research a non-faction technology",
    windowEffect:
      "You must instead return 1 player's control token from your faction sheet to gain 1 of that player's non-faction technologies.",
    source: "beans",
  },
  {
    id: "cataclysm",
    name: "Cataclysm",
    faction: "natau",
    window: "Before gathering starting components",
    windowEffect:
      "Put The Fracture into play. Then, choose 1 non-home, non-supernova anomaly and place 1 ingress token in that system.",
    source: "beans",
  },
  {
    id: "sacred_passage",
    name: "Sacred Passage",
    faction: "natau",
    permanentEffect:
      "Apply +1 to the MOVE value of your ships that begin their movement in The Fracture or an anomaly.",
    source: "beans",
  },
  {
    id: "amaluuns_strength",
    name: "Amaluun's Strength",
    faction: "natau",
    permanentEffect:
      "Apply +1 to the result of each of your units' combat rolls in The Fracture or in a system that contains an ingress token.",
    source: "beans",
  },
  {
    id: "valholls_call",
    name: "Valhöll's Call",
    faction: "valhavn",
    window:
      "After 1 or more of your infantry are destroyed during a round of ground combat",
    windowEffect:
      "You may place 1 infantry from your reinforcements on another planet you control that contains 1 of your PDS units.",
    source: "beans",
  },
  {
    id: "reave",
    name: "Reave",
    faction: "valhavn",
    window:
      "Once per turn, when you would win a ground combat on a planet you do not control",
    windowEffect:
      "You may destroy each of your units on that planet to gain trade goods equal to that planet's resource value; that combat ends in a draw.",
    source: "beans",
  },
  {
    id: "bloodlust",
    name: "Bloodlust",
    faction: "valhavn",
    window:
      "Once per action, after you commit ground forces to a planet during a tactical action",
    windowEffect:
      "If there are no units on that planet, you may resolve ground combat.",
    source: "beans",
  },
  {
    id: "harvest",
    name: "Harvest",
    faction: "migo",
    window:
      "After you gain control of a planet that has a technology specialty",
    windowEffect:
      "Gain the corresponding harvest card and place it in your play area. Any time you control no planets that have a technology specialty that matches a harvest card in your play area, return that harvest card to your reinforcements.",
    source: "beans",
  },
  {
    id: "pseudomorphism",
    name: "Pseudomorphism",
    faction: "migo",
    window: "When you spend resources to research a technology",
    windowEffect:
      "If you exhaust a planet to use its technology specialty to ignore any prerequisites, you may reduce the spent resources by that planet’s influence value.",
    source: "beans",
  },
  {
    id: "harvest_blue",
    name: "Kinetic Morphology",
    shortName: "Kinetic\nMorphology",
    faction: "migo",
    window: "After you activate a system",
    windowEffect:
      "You may exhaust this card to apply +1 to the MOVE value of 1 of your ships during this tactical action.",
    source: "beans",
  },
  {
    id: "harvest_green",
    name: "Synaptic Grafting",
    shortName: "Synaptic\nGrafting",
    faction: "migo",
    window: "After you exhaust a planet that has a technology specialty",
    windowEffect: "You may exhaust this card to draw 1 action card.",
    source: "beans",
  },
  {
    id: "harvest_red",
    name: "Tachyonic Reversion",
    shortName: "Tachyonic\nReversion",
    faction: "migo",
    window: "After you roll 1 or more dice during a round of combat",
    windowEffect: "You may exhaust this card to reroll up to 2 of those dice.",
    source: "beans",
  },
  {
    id: "harvest_yellow",
    name: "Biomechanical Splicing",
    shortName: "Biomechanical\nSplicing",
    faction: "migo",
    window: "When 1 or more of your units use PRODUCTION",
    windowEffect:
      "You may exhaust this card to apply +1 to the total PRODUCTION value of your units and reduce the combined cost of the produced units by 1.",
    source: "beans",
  },
  {
    id: "origin_unknown",
    name: "Origin Unknown",
    faction: "deep",
    window: "When you create the game board",
    windowEffect:
      "Place the Deep Space tile where your home system would normally be placed; Deep Space is not a home system. During setup, gain and ready The Deep planet card and its unit card; you cannot lose these cards.",
    source: "beans",
  },
  {
    id: "dark_matter_link",
    name: "Dark Matter Link",
    faction: "deep",
    window: "After you explore a frontier token",
    windowEffect:
      "You may place a frontier token in a different system that contains no planets, if able.",
    source: "beans",
  },
  {
    id: "energy_siphon",
    name: "Energy Siphon",
    faction: "deep",
    window: "When you purge an exploration card for its effect",
    windowEffect: "Gain 1 command token.",
    source: "beans",
  },
  {
    id: "sporefall",
    name: "Sporefall",
    faction: "bloom",
    window:
      "Once per turn, after another player resolves the secondary ability of a strategy card",
    windowEffect:
      "You may place 1 infantry from your reinforcements into coexistence on a non-home planet they control adjacent to a system that contains 1 of your ground forces.",
    source: "beans",
  },
  {
    id: "strain_dispersal",
    name: "Strain Dispersal",
    faction: "bloom",
    window: "During setup",
    windowEffect:
      "Gain your 3 strain cards and place them in your reinforcements. While your units are coexisting on a planet with a trait, place the corresponding card in your play area dormant side up. While you are coexisting on 2 or more planets with the same trait, flip the corresponding card to its active side.",
    source: "beans",
  },
  {
    id: "neurotropic_dormant",
    name: "Neurotropic Dormant",
    shortName: "Neuro\nDormant",
    faction: "bloom",
    permanentEffect:
      "The amount of action cards you may have in your hand is increased by 1.",
    source: "beans",
  },
  {
    id: "neurotropic_active",
    name: "Neurotropic Active",
    shortName: "Neuro\nActive",
    faction: "bloom",
    permanentEffect:
      "The amount of action cards you may have in your hand is increased by 2.",
    window:
      "Once per action, when a player whose planet you are coexisting on draws 1 or more aciton cards",
    windowEffect: "You may draw 1 aciton card.",
    source: "beans",
  },
  {
    id: "rhizomatic_dormant",
    name: "Rhizomatic Dormant",
    shortName: "Rhiz\nDormant",
    faction: "bloom",
    permanentEffect: "Your commodity value is increased by 1.",
    source: "beans",
  },
  {
    id: "rhizomatic_active",
    name: "Rhizomatic Active",
    shortName: "Rhiz\nActive",
    faction: "bloom",
    permanentEffect: "Your commodity value is increased by 2.",
    window:
      "When a player whose planet you are coexisting on replenishes their commodities",
    windowEffect: "Gain 1 commodity, or convert 1 commodity to a trade good.",
    source: "beans",
  },
  {
    id: "carnivorous_dormant",
    name: "Carnivorous Dormant",
    shortName: "Carnivore\nDormant",
    faction: "bloom",
    permanentEffect:
      "Apply +1 to the combat rolls of your infantry while you are the defender.",
    source: "beans",
  },
  {
    id: "carnivorous_active",
    name: "Carnivorous Active",
    shortName: "Carnivore\nActive",
    faction: "bloom",
    permanentEffect:
      "Apply +1 to your infantry's combat rolls while you are the defender.",
    window:
      "Once per ground combat, after 1 or more of your opponents infantry are destroyed",
    windowEffect:
      "You may place 1 infantry from your reinforcements on that planet.",
    source: "beans",
  },
  {
    id: "deaths_refrain",
    name: "Death's Refrain",
    faction: "choir",
    window: 'During the "Repair Units" step of the status phase',
    windowEffect:
      "You may choose up to 2 of your damaged units on the game board; those units are not repaired.",
    source: "beans",
  },
  {
    id: "morbid_harmony",
    name: "Morbid Harmony",
    faction: "choir",
    permanentEffect:
      "At the end of your turn, if you have more damaged units with SUSTAIN DAMAGE on the board than not damaged, flip your faction technologies and mech to their requiem side, otherwise, flip them to their lament side; the other side has no effect.",
    source: "beans",
  },
  {
    id: "prescience",
    name: "Prescience",
    faction: "uydai",
    permanentEffect:
      "At the end of your turn, if you have not passed, place 1 of the plan cards on your faction sheet, face down. At the start of your turn, reveal and resolve the plan card on your faction sheet, if able",
    source: "blue_reverie",
  },
  {
    id: "the_starlit_path",
    name: "The Starlit Path",
    faction: "uydai",
    window: "At the end of your turn",
    windowEffect:
      "You may spend 5 path tokens to resolve the secondary ability of any strategy card, or 8 path tokens to do so without spending a command token.",
    source: "blue_reverie",
  },
  {
    id: "narrow_way",
    name: "Narrow Way",
    faction: "uydai",
    window: "At any time",
    windowEffect:
      "You may spend 1 path token to redistribute 1 of your command tokens and move 2 of your infantry on the game board onto a planet you control.",
    source: "blue_reverie",
  },
  {
    id: "ancient_empire",
    name: "Ancient Empire",
    faction: "pharadn",
    permanentEffect:
      "During setup, place 1 tomb token on each of up to 14 planets. When you gain control of a planet that contains a tomb token, purge that token to capture 2 infantry from the supply. ",
    source: "blue_reverie",
  },
  {
    id: "dark_purpose",
    name: "Dark Purpose",
    faction: "pharadn",
    window: "When you score an objective",
    windowEffect: "Gain 1 command token.",
    source: "blue_reverie",
  },
  {
    id: "mark_of_pharadn",
    name: "Mark Of Pharadn",
    faction: "pharadn",
    permanentEffect:
      "Abilities that would allow you to place infantry on the game board instead allow you to produce those units. When you produce infantry, you must return 1 of your captured infantry to produce each of those units, instead of spending resources.",
    source: "blue_reverie",
  },
  {
    id: "data_recovery",
    name: "Data Recovery",
    faction: "qhet",
    permanentEffect:
      "Once per action, after 1 or more of your units is destroyed, you may place 1 of the active player's control tokens on your faction sheet.",
    source: "blue_reverie",
  },
  {
    id: "tempest_squads",
    name: "Tempest Squads",
    faction: "qhet",
    permanentEffect:
      "While you are the active player, 2 infantry in the active system do not count against your ships' capacity.",
    notes: "Think of this as sort of like a mild N'orr hero.",
    source: "blue_reverie",
  },
  {
    id: "black_ops",
    name: "Black Ops",
    faction: "qhet",
    window: "After you win a combat as the attacker",
    windowEffect:
      "You may remove 3 of your opponent's control tokens from your faction sheet to gain 1 command token, draw 2 action cards, or draw 1 secret objective",
    source: "blue_reverie",
  },
  {
    id: "synthesis",
    name: "Synthesis",
    faction: "atokera",
    permanentEffect:
      "Readied planets you control have PLANETARY SHIELD and PRODUCTION 0 as if they were units. Apply +1 to the PRODUCTION value of each of your units with PRODUCTION. ",
    source: "blue_reverie",
  },
  {
    id: "living_metals",
    name: "Living Metals",
    faction: "atokera",
    permanentEffect:
      "Agenda outcomes and action cards that have component actions cannot remove or destroy your units, or place other player's units on planets you control.",
    notes: "Protects against _Ixthian Artefact_.",
    source: "blue_reverie",
  },
  {
    id: "lost_crown_of_kaltrim",
    name: "Lost Crown of Kaltrim",
    faction: "kaltrim",
    permanentEffect:
      "After setup, distribute 1 shrine attachment and token to each other player at random, including the Kaltrim Crown token. Each of those players must attach that shrine to a planet in a system adjacent to their home system or the Mecatol Rex system. ",
    source: "blue_reverie",
  },
  {
    id: "raider_coves",
    name: "Raider Coves",
    faction: "sarcosa",
    permanentEffect:
      "When you commit units to a planet another player controls, you may choose for your units to coexist; if you do, gain 2 trade goods.",
    source: "blue_reverie",
  },
  {
    id: "evasive",
    name: "Evasive",
    faction: "sarcosa",
    permanentEffect:
      "Your units do not exit coexistence unless another player ends coexistence with those units or they are removed from that planet. Other players must spend 2 influence to end coexistence with your units on a planet. ",
    notes: "You cannot end your own units coexistence.",
    source: "blue_reverie",
  },
  {
    id: "matters_of_state",
    name: "Matters of State",
    faction: "xin",
    permanentEffect:
      "After you perform an action or resolve an action card, gain 1 balance token or flip 1 balance token on your faction sheet.",
    source: "blue_reverie",
  },
  {
    id: "intrigue",
    name: "Intrigue",
    faction: "xin",
    permanentEffect:
      "At the end of a player's turn, you may spend 1 token from your strategy pool and 1 Intrigue card's listed balance token cost; resolve that card's ability. Then, you may place 1 infantry from your reinforcements into coexistence on a non-home planet the active player controls to gain 1 command token.",
    source: "blue_reverie",
  },
  {
    id: "harmony",
    name: "Harmony",
    faction: "xin",
    permanentEffect:
      "If you have more balance tokens of one type than the other, flip your faction technologies and mech to the matching side; the other side has no effect and your commodity value is 2.",
    source: "blue_reverie",
  },
  {
    id: "mutineers",
    name: "Mutineers",
    faction: "sarcosa",
    window: "ACTION",
    windowEffect:
      "Place 1 token from your strategy pool in a non-home system that contains exactly 1 of another player's ships to replace that ship with a neutral unit of the same type.",
    source: "blue_reverie",
  },
  {
    id: "questing_prince",
    name: "Questing Prince",
    faction: "kaltrim",
    permanentEffect:
      "When you gain control of a planet that has a shrine attachment, purge that attachment. When you would purge the Kaltrim Crown token, instead place it on your faction sheet and gain 1 victory point. ",
    source: "blue_reverie",
  },
  {
    id: "shrines",
    name: "Shrines",
    faction: "kaltrim",
    permanentEffect:
      "Shrine attachments do not count toward scoring objectives and their tokens can only be looked at or revealed by your abilities.",
    source: "blue_reverie",
  },
  {
    id: "classified_developments",
    name: "Classified Developments",
    faction: "belkosea",
    permanentEffect:
      "ACTION: Spend a combined total of 5 resources or influence to place 1 superweapon on a planet you control, and gain its superweapon card.",
    source: "blue_reverie",
  },
  {
    id: "superweapon_projects",
    name: "Arrogance",
    faction: "belkosea",
    permanentEffect:
      "Superweapons you control are structures and cannot be destroyed by abilities. Each planet can contain a maximum of 1 superweapon. When a superweapon is destroyed, instead purge it and its superweapon card. ",
    source: "blue_reverie",
  },
  {
    id: "honor_bound",
    name: "Honor-Bound",
    faction: "toldar",
    permanentEffect:
      "When you gain honor, place or flip 1 code token on your faction sheet face up, if able. When you gain dishonor, instead place or flip 1 code token face down, if able.",
    source: "blue_reverie",
  },
  {
    id: "pride",
    name: "Pride",
    faction: "toldar",
    permanentEffect:
      "When you win a combat as the attacker, gain 1 honor if your opponent has more victory points than you, or gain 1 dishonor if they have fewer victory points than you; otherwise, gain 1 honor or 1 dishonor and ignore this ability until the end of your turn.",
    source: "blue_reverie",
  },
  {
    id: "the_code",
    name: "The Code",
    faction: "toldar",
    permanentEffect:
      "When you gain—or lose—honor or dishonor, gain or lose the Code cards corresponding with your current honor and dishonor. This faction has the abilities on those Code cards.",
    source: "blue_reverie",
  },
  {
    id: "bestow",
    name: "Bestow (2 Honor)",
    faction: "toldar",
    permanentEffect:
      "After you replenish commodities, gain 2 commodities or convert up to 2 of your commodities to trade goods.",
    source: "blue_reverie",
  },
  {
    id: "reflect",
    name: "Reflect (5 Honor)",
    faction: "toldar",
    permanentEffect:
      "After you draw 1 or more action cards, draw 1 action card and give 1 action card from your hand to one of your neighbors.",
    source: "blue_reverie",
  },
  {
    id: "ascend",
    name: "Ascend (8 Honor)",
    faction: "toldar",
    permanentEffect:
      "When you gain this card, gain 1 victory point. When you lose this card, lose 1 victory point.",
    source: "blue_reverie",
  },
  {
    id: "thwart",
    name: "Thwart (2 Dishonor)",
    faction: "toldar",
    permanentEffect:
      "After you replenish commodities, take up to 2 commodities from any combination of your neighbors.",
    source: "blue_reverie",
  },
  {
    id: "deceive",
    name: "Deceive (5 Dishonor)",
    faction: "toldar",
    permanentEffect:
      "After you draw 1 or more action cards, take 1 action card at random from one of your neighbors.",
    source: "blue_reverie",
  },
  {
    id: "scourge",
    name: "Scourge (8 Dishonor)",
    faction: "toldar",
    permanentEffect:
      "Purge your promissory notes; you cannot gain honor. You treat scored secret objectives as public objectives, instead of public objectives.",
    notes:
      "This also purges promissory notes in other players' play areas and hands.",
    source: "blue_reverie",
  },
  {
    id: "radiance_br",
    name: "Radiance",
    faction: "edyn",
    window: "After an agenda is revealed",
    windowEffect:
      "You may predict aloud the outcome of that agenda. If your prediction is correct, place 1 command token from another player's reinforcements in a Sigil, unless that player spends 2 influence.",
    source: "blue_reverie",
    homebrewReplacesID: "radiance",
  },
  {
    id: "desperados_br",
    name: "Desperados",
    faction: "nokar",
    window: "After you produce 1 or more ships in a system",
    windowEffect:
      "Place up to 1 destroyer in that system. While you are not the active player, apply +1 to your destroyers’ move values; those ships ignore your command tokens.",
    source: "blue_reverie",
    homebrewReplacesID: "desperados",
  },
  {
    id: "plausible_deniability_br",
    name: "Plausible Deniability",
    faction: "tnelis",
    window: "At any time",
    windowEffect:
      "If another player satisfies the requirements of one of your secret objectives, you may ignore its requirements; if you score that objective, draw 1 secret objective.",
    source: "blue_reverie",
    homebrewReplacesID: "plausible_deniability",
  },
  {
    id: "stealth_insertion_br",
    name: "Stealth Corps",
    faction: "tnelis",
    permanentEffect:
      "After 1 or more of your units enter coexistence on a planet, destroy up to 1 ground force on that planet.",
    source: "blue_reverie",
    homebrewReplacesID: "stealth_insertion",
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
      "You may exhaust 1 uncontrolled planet's planet card that is on the game board to spend its resources or influence.",
    notes: "This may be used during other players actions as well as your own.",
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
      "During setup, place the Lord flagship token in your reinforcements and place the additional Ghemina Hero next to your faction sheet. The Lord flagship token is a second flagship unit with the abilities and attributes listed on the Lord flagship card. You have 2 Heroes.",
    notes:
      "In async, this ability has been changed to bestowing the Lady, with the Lord being the default flagship. This only affects Franken.",
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
      "When your units use Bombardment against a planet another player controls",
    windowEffect:
      "You may cancel any number of hits you produce to place that many infantry from your reinforcements onto that planet. Those units participate in ground combat, if able",
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
      "Once per action, during invasion on a planet that contains your units, you may resolve ground combat on that planet, even if it does not contain another player's ground forces.",
    notes:
      'Designer intent seems to be that "during invasion" should refer to immediately after the space cannon defense window (this is the same as when ground combat normally starts).',
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
      "Other players may place their control tokens on your faction sheet at any time.",
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
      "During setup, take the additional Veldyr faction promissory notes; you have 4 faction promissory notes. Branch Office attachments do not count toward scoring objectives.",
    notes:
      "They still count towards _Strengthen Bonds_ and _Betray A Friend_, as they are promissory notes.",
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
    id: "paranoia",
    name: "Paranoia",
    faction: "zelian",
    permanentEffect:
      "Game effects other than your command tokens cannot prevent you from activating, or moving ships into, your home system.",
    source: "ds",
  },
  {
    id: "industrious_populace",
    name: "Industrious Populace",
    faction: "uempire",
    permanentEffect:
      "When resolving the primary or secondary ability of Leadership, each exhausted planet you control before spending adds 1 influence.",
    source: "endlesst",
  },
  {
    id: "emperor_will",
    name: "The Emperor's Will",
    faction: "uempire",
    window: "When spending resources",
    windowEffect:
      "You may return any number of command tokens from your sheet to your reinforcements to gain 2 resources per token.",
    source: "endlesst",
  },
  {
    id: "dangerous_science",
    name: "Dangerous_Science",
    faction: "sophon",
    permanentEffect:
      "Whenever you gain a random technology, shuffle the technology deck and pick out one card at random. If you do not meet the prerequisites for the picked technology, remove a command token from your fleet pool. You may exhaust planets you control with tech specialties to help meet these requirements. Then, gain that technology.",
    source: "endlesst",
  },
  {
    id: "wild_curiosity",
    name: "Wild Curiosity",
    faction: "sophon",
    permanentEffect:
      "Whenever you gain a relic, gain a random technology as well.",
    source: "endlesst",
  },
  {
    id: "galactic_locusts",
    name: "Galactic Locusts",
    faction: "craver",
    window: "At the start of the Status Phase",
    windowEffect:
      "Choose a non-home, non-legendary planet you control in a system that contains no planets with a Locust token. Gain trade goods equal to the combined Resource and Influence value of the chosen planet, then place a Locust token on it.",
    source: "endlesst",
  },
  {
    id: "exploitation",
    name: "Exploitation",
    faction: "craver",
    permanentEffect:
      "When a planet gains one of your Locust tokens, exhaust it. Planets with Locust tokens on them cannot be readied. These tokens cannot be removed by any game effect or ability.",
    source: "endlesst",
  },
  {
    id: "craver_exodus",
    name: "Exodus of the Swarm",
    faction: "craver",
    permanentEffect:
      "You may score Public Objectives if you control all of the planets in any home system. When resolving the secondary ability of Warfare, you may produce at any one of your Space Docks.",
    source: "endlesst",
  },
  {
    id: "genetic_manipulation",
    name: "Genetic Manipulation",
    faction: "horatio",
    permanentEffect:
      "You have multiple infantry upgrades. Your infantry have all abilities of all of your researched infantry upgrades.",
    source: "endlesst",
  },
  {
    id: "technological_brilliance",
    name: "Technological Brilliance",
    faction: "horatio",
    window: "When you gain a unit upgrade technology",
    windowEffect:
      "Choose a color of technology in that upgrade's prerequisites. That upgrade technology is the chosen color for the rest of the game",
    source: "endlesst",
  },
  {
    id: "involuntary_nomads",
    name: "Involuntary Nomads",
    faction: "vaulter",
    window: "During Set-up",
    windowEffect:
      'Use a home system chosen at random from among unchosen factions as your home system. Shuffle the four "Search for Auriga" event cards into the corresponding exploration deck.',
    source: "endlesst",
  },
  {
    id: "homebound",
    name: "Involuntary Nomads",
    faction: "vaulter",
    window: "At the start of the Status Phase",
    windowEffect:
      "If you control both the Auriga planet and all the planets in your home system, gain 1 Victory Point. This ability can only be used once per game.",
    source: "endlesst",
  },
  {
    id: "argosky_ability",
    name: "The Argosky",
    faction: "vaulter",
    permanentEffect:
      "When you produce your flagship, gain the Argosky planet card and ready it. If another player captures your flagship, they gain control of the Argosky planet card and ready it. When your flagship is returned to your reinforcements, return the Argosky planet card to the supply.",
    source: "endlesst",
  },
  {
    id: "vodyani_crusade",
    name: "The Crusade",
    faction: "vodyani",
    window: "At the end of the Status Phase",
    windowEffect:
      "Choose a system tile that is adjacent to your home system. Swap those tiles and all units and components on them. Only count system tiles that are physically touching on the game board as adjacent for the purposes of this ability.",
    source: "endlesst",
  },
  {
    id: "great_armada",
    name: "The Great Armada",
    faction: "vodyani",
    permanentEffect:
      "Units you control in the space area of your home system do not count against your ships' capacity.",
    source: "endlesst",
  },
  {
    id: "shipbound",
    name: "Shipbound",
    faction: "vodyani",
    permanentEffect:
      "At the end of the Status Phase, move all of your infantry on planets into the space area of their system.",
    source: "endlesst",
  },
  {
    id: "wheelers_dealers",
    name: "Wheelers and Dealers",
    faction: "lumeris",
    permanentEffect:
      "You cannot play promissory notes or action cards that are placed on your faction sheet. During your turn, you may trade action cards, promissory notes, or captured units that are on your Faction Sheet as part of transactions.",
    source: "endlesst",
  },
  {
    id: "alternative_imports",
    name: "Alternative Imports",
    faction: "lumeris",
    window: "Whenever you draw one or more action cards",
    windowEffect:
      "Place the top card of the action card deck face-up on your faction sheet.",
    source: "endlesst",
  },
  {
    id: "ba_friends",
    name: "Back Alley Friends",
    faction: "lumeris",
    window: "During Set-up",
    windowEffect:
      "Take the two extra Lumeris Alliance promissory notes and add them to your hand.",
    source: "endlesst",
  },
  {
    id: "celestial_vines",
    name: "Celestial Vines",
    faction: "unfallen",
    permanentEffect:
      "During Set-up, place the Unfallen Vine Counter in your play area and set its initial value to 1. At the end of the Status Phase, incrememtn the Vine Counter by 1. Non-home systems that are X systems away from your home system or closer are considered Entangled, where X is the value of the Vine Counter. Your home system is always considered Entangled.",
    source: "endlesst",
  },
  {
    id: "budding_leaves",
    name: "Budding Leaves",
    faction: "unfallen",
    window: "At the start of the Status Phase",
    windowEffect:
      "Place an infantry from your reinforcements onto any planet in an Entangled System. If that planet has units owned by another player, your infantry enters coexisting.",
    source: "endlesst",
  },
  {
    id: "cautious_friends",
    name: "Cautious Friends",
    faction: "unfallen",
    permanentEffect:
      "You are neighbors with all players that have units or a planet they control in Entangled systems. You cannot be neighbors with players except through this ability.",
    source: "endlesst",
  },
  {
    id: "riftborn_strangers",
    name: "Strangers to Reality",
    faction: "riftborn",
    permanentEffect:
      "When spending influence to resolve the primary or secondary ability of Leadership, spend that many resources instead. When spending resources to research technology, spend that much influence instead.",
    source: "endlesst",
  },
  {
    id: "continuum_sculptors",
    name: "Cuntinuum Sculptors",
    faction: "riftborn",
    permanentEffect:
      "During Set-up, add the two extra Riftborn technologies to your technology deck.",
    source: "endlesst",
  },
  {
    id: "masters_tands",
    name: "Masters of Time and Space",
    faction: "riftborn",
    window: "At the start of your turn",
    windowEffect:
      "You may spend 3 influence to ready any of your technologies.",
    source: "endlesst",
  },
  {
    id: "hissho_honor",
    name: "Honor Bound",
    faction: "hissho",
    window: "During Set-up:",
    windowEffect:
      "Add the Keii tokens to the supply. Then, add the three Hissho Observance cards to your hand. You may place one of them face-up in your play area.",
    source: "endlesst",
  },
  {
    id: "behemoth_specialists",
    name: "Behemoth Specialists",
    faction: "hissho",
    window: "When you gain the War Sun unit upgrade:",
    windowEffect:
      "Choose one side of the technology to be face-up in your play area for the rest of the game.",
    source: "endlesst",
  },
  {
    id: "hissho_ritualistic",
    name: "Ritualistic",
    faction: "hissho",
    window: "At the end of the Agenda phase:",
    windowEffect:
      "gather all three Observance cards and place them near the agenda deck. Each player votes on one of the Observance cards as if it were an agenda, with you acting as Speaker for this vote. Place the Observance card with the most votes face-up in your play area.",
    source: "endlesst",
  },
  {
    id: "anomalous_existence",
    name: "Anomalous Existence",
    faction: "uchoir",
    permanentEffect:
      "Other players cannot commit ground forces to planets in your home system. During set-up, place a frontier token into your home system. Your home system is treated as a system with no planets.",
    source: "endlesst",
  },
  {
    id: "in_the_shadows",
    name: "In The Shadows",
    faction: "uchoir",
    permanentEffect:
      "At the end of the Strategy Phase, place the choir's 9 token on your Strategy card. You are last in initiative order.",
    source: "endlesst",
  },
  {
    id: "enigmatic_agenda",
    name: "Enigmatic Agenda",
    faction: "uchoir",
    window: "Whenever another player discards a secret objective:",
    windowEffect:
      "You look at that card before it is shuffled back into the deck. You may choose to keep that secret objective by discarding another unsocred secret objective from your hand.",
    source: "endlesst",
  },
  {
    id: "beliefs_breakthroughs",
    name: "Beliefs, not Breakthroughs",
    faction: "nakalim",
    permanentEffect:
      "Whenever you would research a technology, gain two command tokens instead.",
    source: "endlesst",
  },
  {
    id: "lost_lore",
    name: "Lost Lore",
    faction: "nakalim",
    window: "Whenever you score an Objective:",
    windowEffect:
      "You may gain any number of technologies, so long as the number of technologies you are gaining and their combined prerequisites are less than or equal to the number of relics you control plus the number of relic fragments you purge when you use this ability.",
    source: "endlesst",
  },
  {
    id: "primacy",
    name: "Primacy",
    faction: "mahact",
    window: "When you win a combat",
    windowEffect:
      "Place 1 owner token from your opponent on this ability if it does not already contain 1 of that player's tokens.",
    source: "franken",
  },
  {
    id: "edict_y",
    name: "Edict Y",
    faction: "mahact",
    permanentEffect:
      "Each owner token on your Primacy ability increases your fleet limit by 1.",
    source: "franken",
  },
  {
    id: "imperia_y",
    name: "Imperia Y",
    faction: "mahact",
    permanentEffect:
      "While another player's owner token is on your Primacy ability, you can use the abilities of that player's commanders, if they are unlocked.",
    source: "franken",
  },
  {
    id: "tomebound_tutelage",
    name: "Tomebound Tutelage",
    faction: "xyrix",
    permanentEffect:
      "During setup, place the Tome Cards in your hand. At the end of the strategy phase, purge each Tome Card in your play area. Then place 1 Tome Card face up in your play area and resolve its effects",
    source: "frmisc",
  },
  {
    id: "fruiting_bodies",
    name: "Fruiting Bodies - legacy",
    faction: "diaspora",
    window:
      "After you or 1 of your neighbours uses the PRODUCTION ability of 1 or more of their units",
    windowEffect: "capture 1 infantry from your reinforcements.",
    source: "gamma",
  },
  {
    id: "megaflora",
    name: "Megaflora - legacy",
    faction: "diaspora",
    window: "When you capture infantry",
    windowEffect:
      "place each captured infantry on the planet card of a planet you control.",
    permanentEffect:
      "While a planet you control has 3 or more captured infantry on its planet card, its resource value is increased by 1.",
    source: "gamma",
  },
  {
    id: "dizurga_emissaries",
    name: "Emissaries",
    faction: "diaspora",
    window: "When you cast votes",
    windowEffect:
      "you may remove any number of infantry from planets you control to cast 1 additional vote for every 2 infantry returned.",
    source: "gamma",
  },
  {
    id: "cortage",
    name: "Cortage",
    faction: "diaspora",
    window: "After a strategy card is exhausted",
    windowEffect:
      "place 2 infantry from your reinforcements onto a planet you control.",
    source: "gamma",
  },
  {
    id: "blighted",
    name: "Blighted",
    faction: "diaspora",
    window:
      "During tactical actions, when you would assign 1 or more hits to your ground forces",
    windowEffect: "assign twice as many.",
    source: "gamma",
  },
  {
    id: "cranial_modules",
    name: "Cranial Modules",
    faction: "hlr",
    window: "During your tactical actions",
    windowEffect:
      "you may treat non-fighter neutral ships that are not in the fracture as if they were your own. At the end of each turn, if neutral units are in the same space as a player's units, resolve combat. ",
    source: "gamma",
  },
  {
    id: "ghost_prototypes",
    name: "Ghost Prototypes",
    faction: "hlr",
    permanentEffect:
      "When you gain a non-fighter ship unit upgrade, you may immediately place 1 neutral ship of the same type in the space area of a non-home system that doesn't contain another player's units.",
    window:
      "At the start of your turn, you may exhaust a unit upgrade technology",
    windowEffect:
      "place a non-fighter neutral ships of the same type in the space area with your units or another neutral unit.",
    source: "gamma",
  },
  {
    id: "legacy_systems",
    name: "Legacy Systems",
    faction: "hlr",
    window: "During setup",
    windowEffect:
      "gain up to 1 technology of each color from among the other players' starting technologies.",
    source: "gamma",
  },
  {
    id: "cognitive_hazard",
    name: "Cognitive Hazard",
    faction: "clade",
    permanentEffect:
      "Hallucination tokens remain hidden until revealed. You may look at Hallucination tokens at any time, and you may reveal a Hallucination token at any time if that system contains another player's units.",
    window: "While revealed",
    windowEffect:
      "other players cannot use the corresponding unit ability in that system.",
    source: "gamma",
  },
  {
    id: "hypnotic_fugue",
    name: "Hypnotic Fugue",
    faction: "clade",
    window: "At the end of your turn",
    permanentEffect:
      "you may remove 1 of your destroyers to place a Hallucination token face-down in that system.",
    source: "gamma",
  },
  {
    id: "quarantine",
    name: "Quarantine",
    faction: "clade",
    window: "At the end of a player's turn,",
    windowEffect:
      "they may remove 1 Hallucination token in a system that contains their ships.",
    source: "gamma",
  },
  {
    id: "convocation_accords",
    name: "Xxcha Accords",
    faction: "archon",
    window: "",
    windowEffect:
      "At the start of the strategy phase, gather your decrees, then place two into your play area. When a decree is violated, you may remove it from play to place one of your command tokens from your reinforcements on the active player's faction sheet.",
    permanentEffect:
      "While 1 of your command tokens is on a player's factions sheet, that player is an outlaw",
    source: "gamma",
  },
  {
    id: "righteous_dictat",
    name: "Righteous Dictat",
    faction: "archon",
    permanentEffect:
      "During combat against outlaws, apply +1  to the result of your units' combat rolls.",
    window: "ACTION",
    windowEffect:
      "purge a decree from your play area to gain 1 of your command tokens from a player's faction sheet.",
    source: "gamma",
  },
  {
    id: "political_decree",
    name: "Political Decree",
    faction: "archon",
    window:
      "After you resolve the primary or secondary ability of the “Politics” strategy card",
    windowEffect: "you may place a decree into your play area",
    source: "gamma",
  },
  {
    id: "genetic_experimentation",
    name: "Genetic Experimentation",
    faction: "moyin",
    window: "during setup,",
    windowEffect:
      "place the Twilight Fall genome and ability decks near the game board",
    permanentEffect:
      "When you would research a technology, you may spend a strategy token in addition to its cost to gain 1 random genome as well.",
    source: "gamma",
  },
  {
    id: "biological_horrors",
    name: "Biological Horrors",
    faction: "moyin",
    window: "When you take control of a planet belonging to another player",
    windowEffect:
      "place 1 of their control tokens on your mech card if it doesn't contain one already.",
    permanentEffect:
      "Your mechs have the text abilities and unit abilities of each faction’s mech whose control token is on your mech card, in addition to its own.",
    source: "gamma",
  },
  {
    id: "prohibited_research",
    name: "Prohibited Research",
    faction: "moyin",
    permanentEffect: "You cannot produce or deploy mechs.",
    window: "At the start of a ground combat",
    windowEffect:
      "you may spend 4 resources to replace 1 of your infantry participating in the combat with a mech from your reinforcements.",
    source: "gamma",
  },
  {
    id: "propaganda_engines",
    name: "Propaganda Engines",
    faction: "veilstrike",
    window: "After you draw 1 or more action cards",
    windowEffect:
      "you may place 1 infantry on a planet you control that contains 1 or more of your ground forces.",
    source: "gamma",
  },
  {
    id: "bartering",
    name: "Bartering",
    faction: "veilstrike",
    permanentEffect:
      "Once per action, when you spend resources or influence, you may discard 1 action card to reduce the resources or influence spent by 2 .",
    source: "gamma",
  },
  {
    id: "covert_operations",
    name: "Covert Operations",
    faction: "veilstrike",
    permanentEffect: "You cannot play action cards with component actions.",
    source: "gamma",
  },
  {
    id: "guardians_of_profane_ground",
    name: "Guardians of Profane Ground",
    faction: "convocation",
    window: "After an opponent commits ground forces to a planet you control",
    windowEffect:
      "you may place 1 infantry on that planet from your reinforcements for each PDS you control on that planet.",
    source: "gamma",
  },
  {
    id: "eternal_vigilance",
    name: "Eternal Vigilance",
    faction: "convocation",
    window:
      "When another player activates a system that contains at least 1 planet and a least 1 of your ships, if you control every planet in that system",
    permanentEffect:
      " you may move 1 of your non-fighter ships from each adjacent system that does not contain 1 of your command tokens into the active system.",
    source: "gamma",
  },
  {
    id: "hyperdimensional",
    name: "Hyperdimensional",
    faction: "weaveway",
    permanentEffect:
      "When moving, you treat your home system and all other non-home systems that contain a nebula as adjacent.",
    source: "gamma",
  },
  {
    id: "threads_out_of_the_dark",
    name: "Threads out of the Dark",
    faction: "weaveway",
    window: "",
    windowEffect:
      "During setup, take the additional Weaveway faction promissory notes; you have 3 faction promissory notes.",
    source: "gamma",
  },
  {
    id: "winnaran_archive_access",
    name: "Winnaran Archive Access",
    faction: "initiative",
    window: "When you draw 1 or more secret objectives.",
    windowEffect:
      "draw 1 additional secret objective. Then, choose 1 of your unscored secret objectives, return it to the deck, and shuffle that deck.",
    source: "gamma",
  },
  {
    id: "jurisdiction",
    name: "Jurisdiction",
    faction: "initiative",
    window: "After you resolve the secondary of the 'Imperial strategy card'",
    windowEffect:
      "You do not have to have to spend a command token to resolve the secondary ability of the “Imperial” strategy card.",
    permanentEffect:
      "You can have 1 additional scored or unscored secret objective.",
    source: "gamma",
  },
  {
    id: "beholden",
    name: "Beholden",
    faction: "initiative",
    window: "during setup",
    windowEffect: "purge your “Support for the Throne” promissory note.",
    permanentEffect:
      "Other players cannot give you their “Support for the Throne” promissory notes.",
    source: "gamma",
  },
  {
    id: "bounties",
    name: "Bounties",
    faction: "company",
    permanentEffect:
      "During Setup, draw and place 3 secret objectives onto your faction sheet faceup. Those cards do not count against your total scored and unscored secret objectives and whenever they would be removed they are returned to the deck instead. ",
    window:
      "When a game effect would let you draw or discard a secret objective,",
    windowEffect:
      "you may instead place onto or discard from your faction sheet, respectively.",
    source: "gamma",
  },
  {
    id: "dogs_of_war",
    name: "Dogs of War",
    faction: "company",
    window: "When you score a secret objective on your faction sheet",
    windowEffect:
      "turn it facedown. You do not gain a victory point and it does not count against the number of secret objectives you can score during the status phase.",
    permanentEffect:
      "At the end of your turn, you may remove 1 of your facedown secret objectives to perform the secondary ability of any strategy card without spending a command token.",
    source: "gamma",
  },
  {
    id: "rapid_industrialization",
    name: "Rapid Industrialization",
    faction: "industries",
    window:
      "After you use the PRODUCTION ability of 1 of your space docks on a planet",
    windowEffect: "ready that planet.",
    source: "gamma",
  },
  {
    id: "corporate_sanctions",
    name: "Corporate Sanctions",
    faction: "industries",
    window: "When you produce fighters or infantry units",
    windowEffect: "you produce only 1 for its cost instead of 2.",
    source: "gamma",
  },
  {
    id: "thralldom",
    name: "Thralldom",
    faction: "ironhull",
    permanentEffect:
      "You capture infantry you destroy. A planet can have up to 2 Thrall tokens, increasing its resource and influence values by 1 for each of those tokens.",
    window: "When you exhaust a planet,",
    windowEffect:
      "you may return any number of captured infantry to place or move 1 Thrall token onto that planet for every 4 infantry returned. ",
    source: "gamma",
  },
  {
    id: "breakout",
    name: "Breakout",
    faction: "ironhull",
    window:
      "At the start of a ground combat on a planet with 1 or more Thrall tokens",
    windowEffect:
      "the active player may remove any number of those tokens to place 4 infantry from their reinforcements on that planet for each token removed.",
    source: "gamma",
  },
  {
    id: "titanic",
    name: "Titanic",
    faction: "project",
    window:
      "When you create the game board, place the Elysium Space tile where your home system would be placed, and place the Elysium Planet token into that system. The Elysium Space tile is not a home system.",
    source: "gamma",
  },
  {
    id: "elysium",
    name: "Elysium",
    faction: "project",
    window:
      "During setup, gain and ready the Elysium planet ability card. The system that contains the Elysium Planet token is your home system.",
    permanentEffect:
      "You can score objectives if you control Elysium, even if you do not control all the planets in your home system.",
    source: "gamma",
  },
  {
    id: "prudent",
    name: "Prudent",
    faction: "project",
    window:
      "During setup, place all of your starting ground forces in the space area of your home system.",
    source: "gamma",
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
    id: "nesting_burrows",
    name: "Nesting Burrows",
    faction: "arachnera",
    window: "After you produce 1 or more infantry:",
    windowEffect:
      "You may place up to 2 of those units on your faction sheet. Those units are captured.",
    source: "luminous",
  },
  {
    id: "necrogenesis",
    name: "Necrogenesis",
    faction: "arachnera",
    window:
      "Once per ground combat, after 1 of your opponent's units are destroyed:",
    windowEffect:
      "You may place 2 of your captured infantry from your faction sheet on that planet.",
    source: "luminous",
  },
  {
    id: "feeding_frenzy",
    name: "Feeding Frenzy",
    faction: "arachnera",
    permanentEffect:
      "Apply +1 to the result of each of your unit's combat rolls during ground combat on a planet that is in a nebula.",
    source: "luminous",
  },
  {
    id: "swarm",
    name: "Swarm",
    faction: "arachnera",
    window:
      "Once per action, during invasion on a planet that contains your units:",
    windowEffect:
      "You may resolve ground combat on that planet even if it does not contain another player's ground forces.",
    source: "luminous",
  },
  {
    id: "orbital_defense_grid",
    name: "Orbital Defense Grid",
    faction: "psm",
    permanentEffect:
      "PDS you control count as ships during space combat, and they cannot retreat.",
    source: "luminous",
  },
  {
    id: "galactic_industrial_complex",
    name: "Galactic Industrial Complex",
    faction: "psm",
    window: "ACTION:",
    windowEffect:
      "Return a promissory note to its owner. You may spend 2 resource or influence to place a PDS in a system you control.",
    source: "luminous",
  },
  {
    id: "psm_orbital_drops",
    name: "Orbital Drops",
    faction: "psm",
    permanentEffect:
      "When you would use Galactic Industrial Complex faction abiity you may place a mech from your reinforcements on a planet you control.",
    source: "luminous",
  },
  {
    id: "psm_mega_structures",
    name: "Mega Structures",
    faction: "psm",
    permanentEffect:
      "When scoring objectives you may treat each structure you control as if it is on its own separate planet for the purposes of scoring objectives.",
    source: "luminous",
  },
  {
    id: "occupational_hazard",
    name: "Occupational Hazard",
    faction: "opa",
    window: "At the start of the game:",
    windowEffect:
      "You may replace 1 anomaly system tile, that does not contain a planet, with an asteroid field anomaly system tile.",
    source: "luminous",
  },
  {
    id: "the_belter_way",
    name: "The Belter Way",
    faction: "opa",
    window: "After frontier tokens have been placed during setup:",
    windowEffect:
      "Place a station planet token in each system that is an asteroid field anomaly.",
    source: "luminous",
  },
  {
    id: "opa_one_people",
    name: "One People",
    faction: "opa",
    permanentEffect:
      "Whenever another player gains control of a station token planet, you and that player each gain 1 tg.",
    source: "luminous",
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
    id: "political_agenda",
    name: "Political Agenda",
    faction: "councilors",
    permanentEffect:
      "During setup take the 4 league Agendas and place them facedown in yoiur play area. You may look at these cards at any time. Then choose 1 of your 3 heros and place it in your hero slot. Purge the rest",
    source: "nomadfalcon",
  },
  {
    id: "ballots",
    name: "Ballots",
    faction: "councilors",
    permanentEffect:
      "Action: Spend 1 token from your strategy pool to either choose and place 1 legue agenda on your faction sheet or repair 1 unit you control or gain 2 trade goods. you may look at agenda cards on your factino sheet at any time. ",
    source: "nomadfalcon",
  },
  {
    id: "political_importance",
    name: "Political Importance",
    faction: "councilors",
    permanentEffect:
      "When the speaker would reavel to the top card of the agenda deck you may instead have the speaker reavel 1 agenda on your faction sheet. Player vote on that agenda instead as if it where drawn from the agenda deck. Cast 3 additional votes when voting for a law.",
    source: "nomadfalcon",
  },
  {
    id: "technical_exploration",
    name: "Technical Exploration",
    faction: "explanetary",
    permanentEffect:
      "Action: Spend 1 token from your strategy pool to exhuast 1 planet you control and attach 1 Technology attachment to that planet or move 1 technology attachment  from 1 planet you control to the exauhsted planet.",
    source: "nomadfalcon",
  },
  {
    id: "defense_protocols",
    name: "Defense Protocols",
    faction: "explanetary",
    permanentEffect:
      "At the start of the round place 1 infantry from you reinforcments on 1 plsanet you control in your home system. You must have at least 3 ground forces in your home system at all times.",
    source: "nomadfalcon",
  },
  {
    id: "probe_drones",
    name: "Probe Drones",
    faction: "explanetary",
    permanentEffect:
      "During setup take the 4 technology arttachment cards and tokens and place them in your reinforcments.",
    source: "nomadfalcon",
  },
  {
    id: "factorial_complexes",
    name: "Factorial Complexes",
    faction: "erock",
    permanentEffect:
      "Each planet that contains 1 or more of your mechs gains the production 1 ability as if it where a unit you control.",
    source: "nomadfalcon",
  },
  {
    id: "rocket_technologies",
    name: "Rocket Technologies",
    faction: "erock",
    permanentEffect:
      "When you move ships into a system with any planerts you may remove PDS units from adjacent systems on planets you control and place them on your faction sheet. those units are captured. At the end of a tactical action if control 1 or more planets in the active systme you place up to 2 of your captured units on those planets.",
    source: "nomadfalcon",
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
    id: "song_of_something",
    name: "Echo of Something",
    faction: "neutral",
    permanentEffect:
      "During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system.",
    imageURL:
      "/hover_images/twilights_fall/king_units_misc/echo_divergence.png",
    source: "twilights_fall",
  },
  {
    id: "echo_of_divergence",
    name: "Echo of Divergence",
    faction: "crimson",
    permanentEffect:
      "During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system.",
    imageURL:
      "/hover_images/twilights_fall/king_units_misc/echo_divergence.png",
    source: "twilights_fall",
  },
  {
    id: "echo_of_sacrifice",
    name: "Echo of Sacrifice",
    faction: "ghost",
    permanentEffect:
      "During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system.",
    imageURL: "/hover_images/twilights_fall/king_units_misc/echo_sacrifice.png",
    source: "twilights_fall",
  },
  {
    id: "predatory_ambush",
    name: "Predatory Ambush",
    faction: "arachian",
    permanentEffect:
      "At the start of each round of space combat where you are the defending player: If the system contains one of your command tokens, you may move one of your ships from an adjacent system into this system.",
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
    id: "grand_sequence",
    name: "Grand Sequence",
    faction: "zooid",
    permanentEffect:
      "When a public objective is revealed, draw one secret objective. You may have any number of scored or unscored secret objectives.",
    source: "other",
  },
  {
    id: "incomprehensible",
    name: "Incomprehensible",
    faction: "zooid",
    permanentEffect:
      "You cannot score public objectives. When you would be allowed to score a public objective, you may instead score a secret objective, if you fulfil its requirements.",
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
    name: "The Tribunii",
    faction: "keleres",
    permanentEffect:
      "During setup, choose a Keleres hero that corresponds to an unused faction; take that faction's home system, command tokens, and control tokens. The unchosen Keleres heroes are not used.",
    source: "codex3",
  },
  {
    id: "safe_harbor",
    name: "Safe Harbor",
    faction: "mentak",
    permanentEffect:
      "Pay 2 Trade Goods to a non-Mentak player to activate a non-home system that contains that player’s ships and/or ground forces. Effect: Combat is not initiated during this tactical action; instead, Mentak units enter Coexistence with that player's units. At the end of the Status Phase, any ground forces in Coexistence return to the space area",
    source: "erwans_gambit",
  },
  {
    id: "iron_price",
    name: "Iron Price",
    faction: "letnev",
    permanentEffect:
      "The Mentak player cannot use their Safe Harbor ability to activate Letnev systems. Additionally, any Letnev ship carrying a bounty rolls +1 die in combat.",
    source: "erwans_gambit",
  },
  {
    id: "hylar_fencing_operation",
    name: "Hylar Fencing Operation",
    faction: "jolnar",
    permanentEffect:
      "When Mentak uses Safe Harbor in a Jol-Nar system, the Jol-Nar player may pay 2 Trade Goods to Mentak to research 1 technology owned by the Mentak player.",
    source: "erwans_gambit",
  },
  {
    id: "outlaw_brotherhood",
    name: "Outlaw Brotherhood",
    faction: "saar",
    permanentEffect:
      "When Mentak uses Safe Harbor in a Saar system, they do not pay the 2 Trade Goods cost. The Saar player may pass through systems containing Mentak units.",
    source: "erwans_gambit",
  },
  {
    id: "contraband_auction",
    name: "Contraband Auction",
    faction: "hacan",
    permanentEffect:
      "ACTION: Draw 1 relic from the relic deck OR 1 faction technology from the reference deck. All players place a blind bid using Resources. The highest bidder gains the card. Then, gain 2 Trade Goods and exhaust this card.",
    source: "erwans_gambit",
  },
  {
    id: "asset_recovery",
    name: "Asset Recovery",
    faction: "sol",
    permanentEffect:
      "When the Sol player gains a bounty, they may resolve it at any system containing one of their Space Docks.",
    source: "erwans_gambit",
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
    id: "raid_formation",
    name: "Raid Formation",
    faction: "argent",
    window: "When 1 or more of your units use ANTI-FIGHTER BARRAGE",
    windowEffect:
      "for each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has SUSTAIN DAMAGE to become damaged.",
    source: "pok",
  },
  {
    id: "zeal",
    name: "Zeal",
    faction: "argent",
    permanentEffect: "You always vote first during the agenda phase.",
    window: "When you cast at least 1 vote",
    windowEffect:
      "cast 1 additional vote for each player in the game, including you.",
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
      "You may return 1 captured unit of that type to ignore all of that technology's prerequisites.",
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
      "Other players' tokens in your fleet pool increase your fleet limit but cannot be redistributed.",
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
      'During setup, purge your "Alliance" promissory note. Other players cannot give you their "Alliance" promissory notes.',
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
      "Either purge 2 of your relic fragments of the same type to gain 1 relic or purge 1 of your relic fragments to gain 1 command token.",
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
      'If your flagship or your AWAKEN faction ability places your units into the same space area or onto the same planet as another player\'s units, your units must participate in combat during the "Space Combat" or "Ground Combat" steps.',
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
    id: "liberate",
    name: "Liberate",
    faction: "bastion",
    window: "When you gain control of a planet",
    windowEffect:
      "Ready that planet if it contains a number of your infantry equal to or greater than that planet's resource value; otherwise, place 1 infantry on that planet.",
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
      "They place a galvanize token beneath it if it does not have one. ",
    notes: "There are only 7 galvanize tokens.",
    source: "thunders_edge",
  },
  {
    id: "phoenixstandard",
    name: "Phoenix Standard",
    faction: "bastion",
    window: "At the end of combat",
    windowEffect: "You may galvanize 1 of your units that participated.",
    source: "thunders_edge",
  },
  {
    id: "survivalinstinct",
    name: "Survival Instinct",
    faction: "ralnel",
    window: "After another player activates a system that contains your ships",
    windowEffect:
      "You may move up to 2 of your ships into the active system from adjacent systems that do not contain your command tokens.",
    notes: "These ships can transport fighters and ground forces.",
    source: "thunders_edge",
  },
  {
    id: "researchteam",
    name: "Research Team",
    faction: "deepwrought",
    window: "When ground forces are committed",
    windowEffect:
      "If your units on that planet are not already coexisting, you may choose for your units to coexist.",
    source: "thunders_edge",
  },
  {
    id: "oceanbound",
    name: "Oceanbound",
    shortName: "Ocean\nbound",
    faction: "deepwrought",
    permanentEffect:
      "Any time you have more ocean cards than there are planets that contain your coexisting units, discard ocean cards until you do not.",
    window: "When your units begin coexisting on a planet",
    windowEffect: "gain an ocean card and ready it.",
    notes: "There are only 5 ocean cards. You cannot gain more than that.",
    source: "thunders_edge",
  },
  {
    id: "sundered",
    name: "Sundered",
    faction: "crimson",
    permanentEffect:
      "You cannot use wormholes other than epsilon wormholes. Other players' units that move or are placed into your home system are destroyed.",
    notes:
      "Cannot use wormholes means that you cannot move through them. You can still fire space cannon and form neighborship through them. ",
    source: "thunders_edge",
  },
  {
    id: "incursion",
    name: "Incursion",
    faction: "crimson",
    permanentEffect:
      "When you activate a system that contains a breach, you may flip that breach; systems that contain active breaches are adjacent. At the end of the status phase, any player with ships in a system that contains an active breach may remove that breach.",
    source: "thunders_edge",
  },
  {
    id: "miniaturization",
    name: "Miniaturization",
    shortName: "Miniatur\n-ization",
    faction: "ralnel",
    permanentEffect:
      "Your structures can be transported by any ship; this does not require or count against capacity. While your structures are in the space area, they cannot use their unit abilities.",
    window: "At the end of your tactical actions",
    windowEffect:
      "You may place your structures that are in space areas onto planets you control in their respective systems.",
    source: "thunders_edge",
  },
  {
    id: "sorrow",
    name: "The Sorrow",
    faction: "crimson",
    permanentEffect:
      "When you create the game board, place The Sorrow (tile 94) where your home system would be placed, and place an inactive breach in it. The Sorrow is not a home system. Then, place your home system (tile 118) in your play area.",
    source: "thunders_edge",
  },
  {
    id: "plotsplots",
    name: "Plots Within Plots",
    shrinkName: true,
    faction: "firmament",
    permanentEffect:
      "You can score secret objectives already scored by other players if you fulfill their requirements; this does not count against your secret objective limit or the number you can score in a round.",
    window: "When you score another player's secret objective",
    windowEffect:
      "Do not gain a victory point; instead, place a facedown plot card into your play area with that player's control token on it.",
    source: "thunders_edge",
  },
  {
    id: "puppetsoftheblade",
    name: "Puppets of the Blade",
    shortName: "Puppets of\nthe Blade",
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
    shortName: "The Blade's\nOrchestra",
    faction: "obsidian",
    window: "When this faction comes into play",
    windowEffect:
      "Flip your home system, double-sided faction components, and all of your in-play plot cards. Then, ready Cronos Hollow and Tallin Hollow if you control them.",
    source: "thunders_edge",
  },
  {
    id: "marionettes",
    name: "Marionettes",
    shortName: "Mario\n-nettes",
    faction: "obsidian",
    permanentEffect:
      "The player or players whose control tokens are on each plot card are the puppeted players for that plot.",
    source: "thunders_edge",
  },
  {
    id: "borrowed_authority",
    name: "Borrowed Authority",
    faction: "ardentia",
    window: "ACTION:",
    windowEffect:
      "Return 1 player's control token from your tactic pool and perform a tactical action in a non-home, non-Mecatol Rex system with no other player's units, using a command token from that player's reinforcements.",
    source: "theodisi",
  },
  {
    id: "seize_command",
    name: "Seize Command",
    faction: "ardentia",
    window: "When you spend influence to gain 1 or more command tokens:",
    windowEffect:
      "You may place 1 other player's control token in your tactic pool instead of gaining 1 of those command tokens.",
    permanentEffect:
      "You can have only 1 of each player's control tokens in your tactic pool.",
    source: "theodisi",
  },
  {
    id: "diplomatic_immunity",
    name: "Diplomatic Immunity",
    faction: "verydith",
    permanentEffect:
      "You do not have to spend a command token to resolve the secondary ability of the Diplomacy strategy card. Other players cannot place your command tokens when resolving the primary ability of the Diplomacy strategy card.",
    source: "theodisi",
  },
  {
    id: "mandate_of_presence",
    name: "Mandate of Presence",
    faction: "verydith",
    window: "When you pass:",
    windowEffect:
      "You may spend 1 command token from your strategy pool to resolve the primary ability of the Diplomacy strategy card.",
    source: "theodisi",
  },
  {
    id: "lobbyist_dues",
    name: "Lobbyist Dues",
    faction: "veylor",
    window:
      "When an agenda is resolved, if an outcome that you voted for or predicted is not resolved:",
    windowEffect:
      "Gain commodities equal to the number of players who voted for the outcome that was resolved.",
    source: "theodisi",
  },
  {
    id: "tight_scheduling",
    name: "Tight Scheduling",
    faction: "veylor",
    window: "After the first agenda is revealed during the agenda phase:",
    windowEffect:
      "Draw 3 cards from the agenda deck and place them in your hand.\n\nWhen an agenda would be revealed:\nYou may reveal 1 agenda from your hand instead.\n\nAt the end of the agenda phase:\nPlace the remaining agendas on the bottom of the agenda deck in any order.",
    source: "theodisi",
  },
  {
    id: "echo_of_the_anvil",
    name: "Echo of the Anvil",
    faction: "myrr",
    window: "When you produce units:",
    windowEffect:
      "Gain 1 trade good if you produced 2 or more non-fighter ships of the same type.",
    source: "theodisi",
  },
  {
    id: "factory_lease",
    name: "Factory Lease",
    faction: "myrr",
    window: "During setup:",
    windowEffect:
      'Gain the "Factory Lease" promissory notes.\n\nAt the start of the agenda phase:\nYou may produce units with a cost of 4 or less, up to the number of Factory Lease attachments on the game board, in a system containing 1 of your space docks and no other players\' ships.',
    source: "theodisi",
  },
  {
    id: "shared_discoveries",
    name: "Shared Discoveries",
    faction: "kairn",
    window: "At the end of a player's tactical action in a non-home system:",
    windowEffect:
      "You may spend 1 commodity to allow that player to explore a planet in the active system as if it had any planet trait.",
    source: "theodisi",
  },
  {
    id: "expeditionary_cache",
    name: "Expeditionary Cache",
    faction: "kairn",
    window: "Legacy:",
    windowEffect: "This retired ability is retained only for existing games.",
    source: "theodisi",
  },
  {
    id: "colony_outposts",
    name: "Colony Outposts",
    faction: "kairn",
    window:
      "At the end of a tactical action during which you explored a planet:",
    windowEffect:
      "You may spend 1 command token to reveal cards from that planet's exploration deck until you reveal an attachment. Resolve that card and shuffle the other revealed cards back into the deck.",
    source: "theodisi",
  },
  {
    id: "battle_tested_designs",
    name: "Battle-Tested Designs",
    faction: "kryxos",
    window: "Legacy:",
    windowEffect: "This retired ability is retained only for existing games.",
    source: "theodisi",
  },
  {
    id: "evolved_warforms",
    name: "Evolved Warforms",
    faction: "kryxos",
    permanentEffect:
      "Your mechs are treated as both ships and ground forces and have a move value of 1. Mechs that are not being transported count against your fleet pool.",
    source: "theodisi",
  },
  {
    id: "testing_yard",
    name: "Testing Yard",
    faction: "kryxos",
    permanentEffect:
      "One ship of each type in your home system does not count against capacity.",
    source: "theodisi",
  },
  {
    id: "ritual_of_ascension",
    name: "Ritual of Ascension",
    faction: "arcanum",
    window: "ACTION:",
    windowEffect: "Purge 2 relic fragments to research 1 technology.",
    source: "theodisi",
  },
  {
    id: "primordial_secrets",
    name: "Primordial Secrets",
    faction: "arcanum",
    window: "During setup:",
    windowEffect: "Choose 1 primordial technology to use during this game.",
    permanentEffect: "You have 1 additional faction technology.",
    source: "theodisi",
  },
  {
    id: "forbidden_knowledge",
    name: "Forbidden Knowledge",
    faction: "arcanum",
    permanentEffect:
      "You cannot gain a primordial technology unless you own 4 technologies of its color, ignoring synergies. Other players cannot use the abilities of primordial technologies.",
    source: "theodisi",
  },
  {
    id: "sting_of_the_hive",
    name: "Sting of the Hive",
    faction: "xytheris",
    window: "When you produce 1 or more hits with a unit ability:",
    windowEffect:
      "You may cancel any number of those hits to place or move that many mine tokens into that system.\n\nAfter movement, if the active system contains 1 or more of your ships:\nYou may remove any number of mine tokens from that system to produce that many hits on the active player's units or gain that many commodities.",
    source: "theodisi",
  },
  {
    id: "hive_echo",
    name: "Hive Echo",
    faction: "xytheris",
    window:
      "When you would use SPACE CANNON, ANTI-FIGHTER BARRAGE, or BOMBARDMENT (except during SPACE CANNON DEFENSE) in a system containing your ships:",
    windowEffect:
      "A unit with that unit ability up to 2 systems away may use it as if it were in the active system.",
    source: "theodisi",
  },
  {
    id: "ignorant_discoveries",
    name: "Ignorant Discoveries",
    faction: "oblivion",
    window: "At the start of the status phase:",
    windowEffect:
      "You may purge 1 technology and spend 1 command token from your strategy pool to research 2 technologies.",
    source: "theodisi",
  },
  {
    id: "reflections_of_the_void",
    name: "Reflections of the Void",
    faction: "oblivion",
    window: "When you move ships into a system with no planets:",
    windowEffect:
      "You may place 1 reflection token in a system that contains a planet you control.",
    permanentEffect:
      "You may treat reflection tokens as frontier tokens for all purposes.\n\nWhen a reflection token would be removed from the game board:\nPurge it instead.",
    source: "theodisi",
  },
  {
    id: "commanding_presence",
    name: "Commanding Presence",
    faction: "revenant",
    window:
      "When you unlock a leader or purge a leader to resolve its ability:",
    windowEffect: "Gain 1 command token.",
    source: "theodisi",
  },
  {
    id: "call_of_the_haunted",
    name: "Call of the Haunted",
    faction: "revenant",
    window: "During setup:",
    windowEffect:
      "Purge your alliance promissory note and 1 Revenant Pantheon card. Then, gain each of the leaders listed on that card.",
    permanentEffect: "You have 1 additional leader of each type.",
    source: "theodisi",
  },
  {
    id: "allure_of_darkness",
    name: "Allure of Darkness",
    faction: "revenant",
    window: "At the start of the strategy phase:",
    windowEffect:
      "Choose 1 other player's commander that does not have the lich token on it and place the lich token on it.",
    source: "theodisi",
  },
  {
    id: "thrones_of_ruin",
    name: "Thrones of Ruin",
    faction: "thrones",
    window: "During setup:",
    windowEffect:
      "Choose 1 throne legendary planet and place it in your home system.",
    source: "theodisi",
  },
  {
    id: "traces_of_ruin",
    name: "Traces of Ruin",
    faction: "thrones",
    permanentEffect:
      "Systems that contain throne planets are anomalies. Players may score public objectives even if they do not control the throne planets in their home system.",
    source: "theodisi",
  },
  {
    id: "cycle_of_reclamation",
    name: "Cycle of Reclamation",
    faction: "aeterna",
    window: "During setup:",
    windowEffect:
      "Place the Moon Phase cards in your play area.\n\nOnce per action, when a unit is destroyed in a system containing or adjacent to your units:\nCapture 1 neutral destroyer.",
    source: "theodisi",
  },
  {
    id: "new_moon_phase",
    name: "New Moon",
    faction: "aeterna",
    window: "When you perform a strategic action:",
    windowEffect: "You may exhaust this card to capture 1 neutral cruiser.",
    source: "theodisi",
  },
  {
    id: "waning_moon_phase",
    name: "Waning Moon",
    faction: "aeterna",
    window: "When you pass:",
    windowEffect:
      "You may exhaust this card and return captured neutral units with a combined cost of 5 or more to their reinforcements to research 1 technology.",
    source: "theodisi",
  },
  {
    id: "full_moon_phase",
    name: "Full Moon",
    faction: "aeterna",
    window: "At the end of your turn:",
    windowEffect:
      "You may exhaust this card and return captured neutral units with a combined cost of 4 or more to their reinforcements to place 1 structure from your reinforcements on a planet you control.",
    source: "theodisi",
  },
  {
    id: "waxing_moon_phase",
    name: "Waxing Moon",
    faction: "aeterna",
    window: "At the start of your turn:",
    windowEffect:
      "You may exhaust this card and return captured neutral units with a combined cost of 2 or more to their reinforcements to draw 2 action cards, then discard 1 action card.",
    source: "theodisi",
  },
  {
    id: "half_moon_phase",
    name: "Half Moon",
    faction: "aeterna",
    window: "ACTION:",
    windowEffect:
      "Exhaust this card and place 1 or more of your captured neutral units in a non-home system that contains no player's ships.",
    source: "theodisi",
  },
  {
    id: "lunar_eclipse_phase",
    name: "Lunar Eclipse",
    faction: "aeterna",
    window: "Legacy:",
    windowEffect: "This retired ability is retained only for existing games.",
    source: "theodisi",
  },
  {
    id: "survivalists",
    name: "Survivalists",
    faction: "ponthous",
    permanentEffect:
      "You may treat your damaged ships as galvanized during combat.",
    source: "theodisi",
  },
  {
    id: "last_stand",
    name: "Last Stand",
    faction: "ponthous",
    window:
      'When your last unit would be destroyed during the "Assign Hits" step of combat:',
    windowEffect:
      "You may roll that unit's combat dice. For each result equal to or greater than that unit's combat value, produce 1 hit. If all of your opponent's remaining participating units are destroyed by this roll, your unit is not destroyed.",
    source: "theodisi",
  },
  {
    id: "rallying_cry",
    name: "Rallying Cry",
    faction: "ponthous",
    permanentEffect:
      "Systems that contain exactly 1 of your non-fighter ships gain PRODUCTION 2 as if they were units.",
    source: "theodisi",
  },
  {
    id: "interlocking_shields",
    name: "Interlocking Shields",
    faction: "vanguard",
    window: "Once per round of combat, when you cancel 1 or more hits:",
    windowEffect: "Cancel 1 additional hit.",
    source: "theodisi",
  },
  {
    id: "shielded_transports",
    name: "Shielded Transports",
    faction: "vanguard",
    permanentEffect:
      "Your non-fighter ships with SUSTAIN DAMAGE gain a capacity value of 1. If they already have a capacity value, increase that value by 1 instead.",
    source: "theodisi",
  },
  {
    id: "enhanced_fundamentals",
    name: "Enhanced Fundamentals",
    faction: "vanguard",
    window: "Once per action, when you win a ground combat:",
    windowEffect:
      "You may spend 3 trade goods to research a technology with no prerequisites.",
    source: "theodisi",
  },
  {
    id: "custom_rigs",
    name: "Custom Rigs",
    faction: "scrapyard",
    window: "During setup:",
    windowEffect: 'Choose 2 "Custom Rig" cards to gain.',
    permanentEffect:
      "A player's units of the same type as a Custom Rig card in their play area gain that card's abilities; adjust those units' printed values by the amounts indicated on that card.",
    source: "theodisi",
  },
  {
    id: "drive_decoherence",
    name: "Drive Decoherence",
    faction: "scrapyard",
    window: "When a player exhausts a Custom Rig card to resolve its ability:",
    windowEffect:
      "They must destroy 1 unit of that type at the end of that action.",
    source: "theodisi",
  },
  {
    id: "repurposed_parts",
    name: "Repurposed Parts",
    faction: "scrapyard",
    window: "Once per round of combat, when 1 of your units is destroyed:",
    windowEffect:
      "You may produce 1 unit with a lower cost at a space dock you control.",
    source: "theodisi",
  },
  {
    id: "fragmentum_unleashed",
    name: "Fragmentum Unleashed",
    faction: "stoneborn",
    window: "After you purge 1 or more relic fragments:",
    windowEffect:
      "You may place 1 Fragmentum token on your faction sheet that matches the color of 1 of those fragments.",
    source: "theodisi",
  },
  {
    id: "adaptive",
    name: "Adaptive",
    faction: "stoneborn",
    window: "During setup:",
    windowEffect:
      "Gain the Dormant version of each of your faction components.",
    notes:
      'This does not mean you gain your starting techs. Just that you start the game with the "Dormant" versions of all your components.',
    permanentEffect:
      'Components with an UNLEASH ability gain the following ability text:\n"At the start of your turn:\nYou may pay this component\'s listed UNLEASH cost and purge it to gain its corresponding Unleashed counterpart. If the purged component was exhausted, gain its Unleashed counterpart exhausted."',
    source: "theodisi",
  },
  {
    id: "trovantous",
    name: "Trovantous",
    faction: "stoneborn",
    window: "At the start of the strategy phase:",
    windowEffect: "Draw 1 random Stoneborn relic fragment.",
    source: "theodisi",
  },
  {
    id: "hydromorphic",
    name: "Hydromorphic",
    faction: "morpha",
    permanentEffect: "You cannot use the abilities of action cards.",
    window: "At the start of the strategy phase:",
    windowEffect:
      'Draw 2 action cards and 2 random "Hydromorphic" cards. Choose 1 Hydromorphic card to keep and return the other to the Hydromorphic deck.',
    source: "theodisi",
  },
  {
    id: "fluid_transfer",
    name: "Fluid Transfer",
    faction: "morpha",
    permanentEffect:
      "Hydromorphic cards may be exchanged as part of a transaction.",
    source: "theodisi",
  },
  {
    id: "hydrospheric_extraction",
    name: "Hydrospheric Extraction",
    faction: "morpha",
    window: "Once per action, when you gain control of a planet:",
    windowEffect:
      "You may destroy 1 of your units on that planet to draw 1 action card.",
    source: "theodisi",
  },
  {
    id: "radiant_grafting",
    name: "Radiant Grafting",
    faction: "thurviali",
    window: "When your units enter into coexistence on a planet:",
    windowEffect:
      "Choose 1 Radiant Grafting ability card to gain and place it face up in your play area.",
    permanentEffect:
      "At any time you have more Radiant Grafting ability cards than there are planets that have your coexisting units:\nRemove Radiant Grafting ability cards until you do not.",
    source: "theodisi",
  },
  {
    id: "celestial_envoys",
    name: "Celestial Envoys",
    faction: "thurviali",
    window:
      "Once during each of your strategic actions, when a player resolves the secondary ability of your strategy card:",
    windowEffect:
      "Place 1 infantry from your reinforcements into coexistence on a non-home planet that contains that player's ground forces.",
    source: "theodisi",
  },
  {
    id: "destroyer_customrig",
    name: "Custom Rig: Destroyer",
    faction: "scrapyard",
    window: "When you activate a system:",
    windowEffect:
      "You may exhaust this card. During this tactical action, your destroyers have no capacity, and you may count them against the capacity values of your ships with capacity.",
    permanentEffect: "Passive: -1 COMBAT value",
    source: "theodisi",
  },
  {
    id: "cruiser_customrig",
    name: "Custom Rig: Cruiser",
    faction: "scrapyard",
    window: 'During the "Commit Ground Forces" step:',
    windowEffect:
      "You may exhaust this card to commit any number of your cruisers from the space area of the active system to planets in that system. Return them to the space area at the end of the tactical action.",
    permanentEffect: "Passive: COST -1",
    notes:
      'This is exhausted at the same time as the other custom rigs, when you activate a system, but its effect is during the "Commit Ground Forces" step. The button won\'t appear unless you exhaust it beforehand.',
    source: "theodisi",
  },
  {
    id: "carrier_customrig",
    name: "Custom Rig: Carrier",
    faction: "scrapyard",
    window: "When you activate a system:",
    windowEffect:
      "You may exhaust this card and reduce each of your carriers' capacity values by any amount. For every 2 by which a carrier's capacity value is reduced, apply +1 to its move value until the end of this action.",
    permanentEffect: "Passive: SUSTAIN DAMAGE",
    source: "theodisi",
  },
  {
    id: "dreadnought_customrig",
    name: "Custom Rig: Dreadnought",
    faction: "scrapyard",
    window: "When you activate a system:",
    windowEffect:
      "You may exhaust this card. Your dreadnoughts lose SUSTAIN DAMAGE, roll 3 additional dice for BOMBARDMENT, and ignore PLANETARY SHIELD.",
    permanentEffect: "Passive: Capacity +1",
    source: "theodisi",
  },
  {
    id: "radiant_grafting_flight",
    name: "Radiant Grafting: Flight",
    shortName: "Flight",
    faction: "thurviali",
    window: "At the end of your tactical actions:",
    windowEffect:
      "You may place your structures that are in space areas on planets you control in their respective systems.",
    permanentEffect:
      "Your structures are also ships with a move value of 1 and count against your fleet pool. They cannot use unit abilities while in a space area. Blockaded structures in the space area of a system are destroyed.",
    source: "theodisi",
  },
  {
    id: "radiant_grafting_claws",
    name: "Radiant Grafting: Claws",
    shortName: "Claws",
    faction: "thurviali",
    permanentEffect:
      "Your structures are treated as ground forces and gain a combat value of 6 if they do not already have a combat value. They participate in combats where they are located. Your structures cannot be transported.",
    source: "theodisi",
  },
  {
    id: "radiant_grafting_parturition",
    name: "Radiant Grafting: Parturition",
    shortName: "Parturition",
    faction: "thurviali",
    permanentEffect:
      "Your PDS units and space docks gain a cost of 4 and may be produced by your units with PRODUCTION. Place those structures on any planets you control in the producing unit's system.",
    source: "theodisi",
  },
  {
    id: "radiant_grafting_scales",
    name: "Radiant Grafting: Scales",
    shortName: "Scales",
    faction: "thurviali",
    permanentEffect:
      "Your structures gain SUSTAIN DAMAGE if they do not have it. Your structures may use their SUSTAIN DAMAGE ability to cancel a hit that is produced against your ships in their system or ground forces on their planet.",
    source: "theodisi",
  },
  {
    id: "radiant_grafting_phalanges",
    name: "Radiant Grafting: Phalanges",
    shortName: "Phalanges",
    faction: "thurviali",
    permanentEffect:
      "Your mechs gain PRODUCTION 1 and SPACE CANNON 9 and are treated as structures for all purposes.",
    source: "theodisi",
  },
  {
    id: "planetary_stabilisation",
    name: "Planetary Stabilisation",
    faction: "neutral",
    window: "ACTION",
    windowEffect:
      "Spend 1 Command Counter from your Strategy Pool to roll 1 die. On a result of 1–4, draw a random unused red tile; on a result of 5–10, draw a random unused blue tile. Place that tile adjacent to an unactivated system containing your ships, so that it is touching a system. If the system contains no planets, place a frontier token there and either gain 2 commodities or convert up to 2 commodities to trade goods. Then you may activate the placed system with a token from your reinforcements and continue with a tactical action. If you do, spend trade goods equal to half your trade goods (rounded down), minus 1 for each system tile adjacent to the placed system (minimum 0).",
    source: "untangled_space",
  },
  {
    id: "underhanded_maneuver",
    name: "Underhanded Maneuver",
    faction: "arvaxi",
    window: "At the start of the strategy phase",
    windowEffect:
      "You may choose 1 of your neighbours. That player must give you 1 action card from their hand, if able.",
    source: "wftv",
  },
  {
    id: "scrap_metal",
    name: "Scrap Metal",
    faction: "arvaxi",
    window: "After you discard an action card without resolving its effects",
    windowEffect:
      "Gain 1 commodity or convert 1 commodity to a trade good. Game effects cannot prevent you from playing action cards.",
    source: "wftv",
  },
  {
    id: "ultimate_authority",
    name: "Ultimate Authority",
    faction: "arvaxi",
    permanentEffect:
      "Apply +1 to the influence value of planets that contain 3 or more of your units. After you explore a planet that contains 3 or more of your units, draw 1 action card.",
    source: "wftv",
  },
  {
    id: "quantum_fabrication",
    name: "Quantum Fabrication",
    faction: "xan",
    permanentEffect:
      "Once per action, when you place a space dock on a planet in a non-home system you may use its PRODUCTION ability immediately.",
    source: "wftv",
  },
  {
    id: "transformation_protocol",
    name: "Transformation Protocol",
    faction: "xan",
    permanentEffect:
      "When casting votes on an agenda, you may choose up to 2 of your ships that have SUSTAIN DAMAGE to become damaged. For each ship chosen, cast 4 additional votes.",
    source: "wftv",
  },
  {
    id: "eusociality",
    name: "Eusociality",
    faction: "kalora",
    permanentEffect:
      "When you retreat during a space combat in a system that doesn't contain your command tokens, you do not place a command token into the target system. You may treat “Skilled Retreat” action cards as a retreat for the purpose of this ability.",
    source: "wftv",
  },
  {
    id: "carapace_regeneration",
    name: "Carapace Regeneration",
    faction: "kalora",
    permanentEffect:
      "After you retreat during a space combat, repair all of your damaged ships that retreated.",
    source: "wftv",
  },
  {
    id: "primordial",
    name: "Primordial",
    faction: "kalora",
    permanentEffect:
      "When you score a public objective, if you are the first to score that objective, you may gain trade goods equal to the number of other players in the game.",
    source: "wftv",
  },
  {
    id: "initiation",
    name: "Initiation",
    faction: "lunarium",
    permanentEffect:
      "During setup, place 1 command token from your reinforcements on your faction sheet. ",
    source: "wftv",
  },
  {
    id: "expanding_minds",
    name: "Expanding Minds",
    faction: "lunarium",
    permanentEffect:
      "You may have up to 6 command tokens on your faction sheet. Your secret objective limit is equal to the number of command tokens on your faction sheet. ",
    source: "wftv",
  },
  {
    id: "multitasking",
    name: "Multitasking",
    faction: "lunarium",
    permanentEffect:
      "When you redistribute command tokens or draw a secret objective, you may move any number of command tokens between your fleet pool and your faction sheet.",
    source: "wftv",
  },
  {
    id: "patience",
    name: "Patience",
    faction: "onyxxa",
    permanentEffect:
      "At the end of the strategy phase, place the Onyxxa Infinity token on your strategy card; you are last in initiative order.",
    source: "wftv",
  },
  {
    id: "strategic_fluidity",
    name: "Strategic Fluidity",
    faction: "onyxxa",
    permanentEffect:
      "Once per action, when you would spend a token from your strategy pool to resolve the secondary ability of a strategy card other than Politics, you may spend an additional command token from your strategy pool to resolve the primary ability of that card instead.",
    source: "wftv",
  },
  {
    id: "detachment",
    name: "Detachment",
    faction: "onyxxa",
    permanentEffect:
      "During the strategy phase, you cannot choose or be given the “Politics” strategy card if there is another unchosen strategy card. When you perform a strategic action using the strategy card with the lowest initiative value in your play area, resolve your strategy card’s secondary ability instead of its primary ability.",
    source: "wftv",
  },
  {
    id: "rewrite_destiny",
    name: "Rewrite Destiny",
    faction: "tyris",
    permanentEffect:
      "Once per status phase, when the speaker reveals a public objective, you may spend 1 command token from your strategy pool to discard that objective. The speaker then reveals a new public objective from the same deck and reshuffles it.",
    source: "wftv",
  },
  {
    id: "arrow_of_time",
    name: "Arrow of Time",
    faction: "tyris",
    permanentEffect:
      "During each of your turns in the action phase, you may take an additional non-strategic action.",
    source: "wftv",
  },
  {
    id: "phantom_energy",
    name: "Phantom Energy",
    faction: "tyris",
    permanentEffect:
      "After you explore a frontier token during a tactical action, you may place a control token on a unit space on your faction sheet that matches a ship in the active system. You may move ships that have a control token on your faction sheet out of systems containing your command tokens, and transport units that started in that ship’s system. At the end of your turn, remove control tokens from your faction sheet for any ships matching those you have in systems that contain your command tokens.",
    source: "wftv",
  },
  {
    id: "veiled_ember_forge",
    name: "Veiled Ember Forge",
    faction: "vyserix",
    permanentEffect:
      "After you gain control of a planet with a technology specialty, you may place 1 PDS on that planet.",
    source: "wftv",
  },
  {
    id: "scattered_legions",
    name: "Scattered Legions",
    faction: "vyserix",
    permanentEffect:
      "At the end of your turns, you may not have more ground forces on a non-home planet than the greater of its resource or influence values. Place any excess on a planet you control in your home system, or return them to your reinforcements.",
    source: "wftv",
  },
  {
    id: "marked_prey",
    name: "Marked Prey",
    faction: "zephyrion",
    permanentEffect:
      "You have 3 bounty tokens. At the start of the strategy phase, place any number of your bounty tokens from your reinforcements on the unit space of non-fighter ships on other players’ faction sheets. You can have a maximum of 1 bounty token on each unit space.",
    source: "wftv",
  },
  {
    id: "confirmed_kill",
    name: "Confirmed Kill",
    faction: "zephyrion",
    permanentEffect:
      "During your turn, if a ship with a bounty token on its unit space is destroyed, return the bounty token to your reinforcements and gain 3 trade goods.",
    source: "wftv",
  },
];
