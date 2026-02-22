// Auto-generated file - Do not edit manually
// Generated from src/main/resources/data/agendas/*.json files

import { Agenda } from "./types";

export const agendas: Agenda[] = [
  {
    alias: "abolishment",
    name: "Judicial Abolishment",
    type: "Directive",
    target:
      "Elect Law (When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.)",
    text1: "Discard the elected law from play.",
    text2: "",
    source: "base",
  },
  {
    alias: "absol_abolishment",
    name: "Judicial Abolishment",
    type: "Law",
    target: "For/Against",
    text1:
      "For: At the start of the Agenda Phase, the speaker may spend 6 influence to discard any 1 law in play.",
    text2:
      'Against: Reveal cards from the bottom of the agenda deck until a law is revealed. Put that law into play.  The player that cast the most votes "Against" is considered to have cast the most votes for that law and chooses what outcome is elected, if applicable.',
    source: "absol",
  },
  {
    alias: "absol_affirmation",
    name: "Affimation of Divine Right",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Mecatol Rex is a legendary planet. At the end of each strategy phase, each other player must give the player who controls Mecatol Rex 1 promissory note from their hand, if able.",
    text2:
      "Against: Exhaust the Imperial strategy card. Place this card with the current laws, and place the custodians token on it. The player who had the custodians token loses 1 victory point. While this law is in play with the custodians token on it, players cannot gain victory points from the Imperial strategy card for controlling Mecatol Rex. If this law is discarded, the player who controls Mecatol Rex gains the custodians token and 1 victory point.",
    mapText:
      "See card for details. Whether this went For or Against will determine the effects.",
    source: "absol",
  },
  {
    alias: "absol_agreement",
    name: "Rearmament Agreement",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player places 1 mech from their reinforcements on a planet they control in their home system. The player who cast the most votes "For" places an additional mech from their reinforcements on any planet they control and adds 1 command token from their reinforcements to their fleet pool.',
    text2:
      'Against: Each player replaces each of their mechs with an infantry from their reinforcements. The player who cast the most votes "Against" places 1 command token from their reinforcements in their strategy pool for every 2 planets they control that do not contain ground forces.',
    source: "absol",
  },
  {
    alias: "absol_arbiter",
    name: "Imperial Arbiter",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and gives each other player who voted for them 1 promissory note from their hand (from most votes to least), if able.\nAt the end of the strategy phase, the owner of this card may spend 1 command token from their strategy pool and up to 8 influence to swap 1 of their strategy cards with a strategy card that has an initiative value equal to or less than the influence spent.",
    mapText:
      "Owner of this card may spend 1 command token from strategy pool and up to 8 influence to swap 1 of their strategy cards with a strategy card with an initiative value equal to the influence spent.",
    source: "absol",
  },
  {
    alias: "absol_articleswar",
    name: "Articles of War",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" places 3 of their control tokens on this card. All mechs lose their printed abilities except for SUSTAIN DAMAGE. When any player activates a system, a player whose control token is on this card may discard 1 control token to ignore the effects of this law during that tactical action.',
    text2:
      'Against: Players who voted "For" or abstained replace each of their mechs on the game board with an infantry from their reinforcements. The player who cast the most votes "Against" may place any number of mechs in their reinforcements on any planet or planets they control.',
    mapText:
      "All mechs lose their printed abilities except for SUSTAIN DAMAGE. After any player activates a system, a player whose control token is on this card may discard that control token to ignore the effects of this law during that activation.",
    source: "absol",
  },
  {
    alias: "absol_artifact",
    name: "Ixthian Artifact",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The speaker rolls 1 die.\nIf the result is 7-10, each player may research 2 technologies.\nIf the result is 1-6, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their own units in each of those systems.",
    text2:
      "Against: Attach this card to the Mecatol Rex planet card. The player who controls Mecatol Rex gains 1 victory point, and loses 1 victory point if they lose control of Mecatol Rex.",
    source: "absol",
  },
  {
    alias: "absol_censure",
    name: "Political Censure",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point. If they are speaker, the other player who cast the most votes for them takes the speaker token.\nThe owner of this card cannot play action cards and cannot take or receive the speaker token. If the elected player loses this card, they lose 1 victory point.",
    mapText:
      "Player gains 1 VP. Cannot play action cards or take or be given the speaker token. If the elected player loses this card, they lose 1 VP.",
    source: "absol",
  },
  {
    alias: "absol_checks",
    name: "Checks and Balances",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" places 1 of their control tokens on this card. When a player chooses a strategy card during the strategy phase, they give that strategy card to another player who does not have 1 (or a player who does not have 2, in a three- or four-player game), if able. If a player whose control token is on this card does not currently have a strategy card, they may discard that token to keep a chosen strategy card instead.',
    text2:
      "Against: Remove all control tokens from public objectives and shuffle all scored secret objectives back into the deck. Players do not gain or lose victory points as a result of this.",
    mapText:
      "The player that cast the most votes 'For' places a control token on this card. When a player chooses a strategy card during the strategy phase, they give that strategy card to another player who does not have 1 (or a player who does not have 2 in a three- or four-player game), if able. If they do not currently have a strategy card, a player whose control token on this card may discard that token to keep the chosen strategy card, instead.",
    source: "absol",
  },
  {
    alias: "absol_conscription",
    name: "Regulated Conscription",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" gains 1 trade good for every industrial planet they control. When a player produces units, they produce only 1 fighter or infantry for their cost, instead of 2.',
    text2:
      'Against:  The player who cast the most votes "Against" must give 1 promissory note to the other player with the most Industrial planets. At the start of the strategy phase, players who voted "Against" or abstained must exhaust all of their industrial planets.',
    mapText:
      "When a player produces units, they produce only 1 fighter and infantry for its cost, instead of 2.",
    source: "absol",
  },
  {
    alias: "absol_constitution",
    name: "New Constitution",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Discard all laws in play, if any. The player who cast the most votes "For" takes the speaker token, then reveals cards from the bottom of the agenda deck until a law is revealed. Players vote on that law as if it had just been revealed from the top of the deck. Shuffle the other revealed agendas back into the agenda deck.',
    text2:
      'Against: Every player who voted "Against" or abstained must give a player who voted "For" a promissory note from their hand, if possible.',
    source: "absol",
  },
  {
    alias: "absol_conventionswar",
    name: "Conventions of War",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" gains 1 trade good for each of their cultural planets. Players cannot use BOMBARDMENT against cultural planets.',
    text2:
      'Against: Players who voted "Against" or abstained discard all of their action cards. The player who cast the most votes "Against" must give 1 promissory note to the other player with the most cultural planets.',
    mapText: "Players cannot use BOMBARDMENT against Cultural planets.",
    source: "absol",
  },
  {
    alias: "absol_covert",
    name: "Covert Legislation",
    type: "Directive",
    target:
      "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other players. If it is Emergency Session, it is played as normal and the speaker draws the next card.",
    text1:
      "The speaker reads the eligible outcomes aloud (for, against, elect player, etc); the other players vote for these outcomes as if they were outcomes of this agenda, without knowing their effects.",
    source: "absol",
  },
  {
    alias: "absol_crisis",
    name: "Galactic Crisis Pact",
    type: "Directive",
    target: "Elect Strategy Card",
    text1:
      "Each player may resolve the secondary ability of the elected strategy card without spending a command token; command tokens placed by the ability are placed from a player's reinforcements, instead.\nThe player who cast the most votes for the elected strategy card may choose to spend a token from their strategy pool in order to resolve the primary ability, instead.",
    source: "absol",
  },
  {
    alias: "absol_defenseact",
    name: "Homeland Defense Act",
    type: "Law",
    target: "For/Against",
    text1:
      'For: When placing 1 or more PDS on a planet, players may place an additional PDS on that planet. The player who cast the most votes "For" may place a PDS on a planet they control.',
    text2:
      'Against: Each player destroys 1 of their PDS units. Each player who voted "Against" or abstained must give 1 promissory note from their hand to a player who voted "For," if able.',
    mapText:
      "When placing a PDS on a planet, players may place 2 PDS instead of 1.",
    source: "absol",
  },
  {
    alias: "absol_disarmamament",
    name: "Compensated Disarmamanet",
    type: "Directive",
    target: "Elect non-home Planet",
    text1:
      "Remove each ground force on the elected planet; the player who controls that planet gains 1 trade good for each infantry removed and 2 trade goods for each mech removed.\nThe other player who cast the most votes for the elected planet gives the owner of the elected planet 1 promissory note from their hand.",
    source: "absol",
  },
  {
    alias: "absol_emergency1",
    name: "Emergency Session",
    type: "Agenda Phase",
    target: "",
    text1:
      "When this card is revealed, place it in the common play area. This card is not an agenda, and players do not vote on this card.\nAfter all other agendas are resolved during the agenda phase, the speaker reveals and the players vote on 1 additional agenda. Then discard this card.",
    source: "absol",
  },
  {
    alias: "absol_emergency2",
    name: "Emergency Session",
    type: "Agenda Phase",
    target: "",
    text1:
      "When this card is revealed, place it in the common play area. This card is not an agenda, and players do not vote on this card.\nAfter all other agendas are resolved during the agenda phase, the speaker reveals and the players vote on 1 additional agenda. Then discard this card.",
    source: "absol",
  },
  {
    alias: "absol_emergency3",
    name: "Emergency Session",
    type: "Agenda Phase",
    target: "",
    text1:
      "When this card is revealed, place it in the common play area. This card is not an agenda, and players do not vote on this card.\nAfter all other agendas are resolved during the agenda phase, the speaker reveals and the players vote on 1 additional agenda. Then discard this card.",
    source: "absol",
  },
  {
    alias: "absol_emergency4",
    name: "Emergency Session",
    type: "Agenda Phase",
    target: "",
    text1:
      "When this card is revealed, place it in the common play area. This card is not an agenda, and players do not vote on this card.\nAfter all other agendas are resolved during the agenda phase, the speaker reveals and the players vote on 1 additional agenda. Then discard this card.",
    source: "absol",
  },
  {
    alias: "absol_equality",
    name: "Economic Equality",
    type: "Law",
    target: "For/Against",
    text1:
      'Each player returns all their trade goods to the supply. All players have a commodity value of 3.  The player that cast the most votes "For" replenishes their commodities.',
    text2:
      'Against: The player who cast the most votes "Against" gains a number of trade goods equal to their current number of trade goods. For every 3 trade goods they gain this way, all other players lose 1 trade good, if able.',
    source: "absol",
  },
  {
    alias: "absol_execution",
    name: "Public Execution",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player exhausts all of their planets, then reveals the action cards in their hand. The players that voted for the elected player (in order of most to least votes) may each take 1 action card from that player's hand, then the rest are discarded. If the elected player has the speaker token, they give it to the other player who cast the most votes for them.",
    source: "absol",
  },
  {
    alias: "absol_formation",
    name: "Committee Formation",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and gives each other player who voted for them 1 promissory note from their hand (in order of most votes to least), if able.\nBefore players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose the player to be elected. Players do not vote on that agenda. The owner of this card is considered to have cast the most votes for the resolved outcome.",
    mapText:
      "Before players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose the player to be elected. Players do not vote on that agenda. The owner of this card is considered to have cast the most votes for the resolved outcome.",
    source: "absol",
  },
  {
    alias: "absol_government",
    name: "Representative Government",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" takes the speaker token. When casting votes, players cast votes equal to the number of planets exhausted, instead of the planets\' combined influence value.  A player that exhausts Mecatol Rex casts 1 additional vote. Players cannot cast additional votes from other sources.',
    text2:
      'Against: At the start of the next strategy phase, each player who voted "Against" or abstained exhausts all of their cultural planets and cannot choose the Politics strategy card unless it is the only unchosen strategy card.',
    mapText:
      "Each planet is worth 1 vote, except Mecatol Rex is worth 2 votes. Cannot cast additional votes.",
    source: "absol",
  },
  {
    alias: "absol_grant",
    name: "Research Grant Allocation",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player researches any 1 non-faction technology. The other player who cast the most votes for the elected player may spend 2 trade goods per prerequisite on that technology to gain that technology.",
    source: "absol",
  },
  {
    alias: "absol_hyperlane",
    name: "Hyperlane Development Program",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" may research 1 propulsion technology. Non-anomaly systems that contain no planets do not cost movement for ships to move through. Players may allow other players\' ships to move through their ships in those systems.',
    text2:
      'Against:  Exhaust the Trade strategy card. All players return 3 trade goods to the supply, or all of their trade goods if they have less than 3. The player who cast the most votes "Against" may place 1 cruiser or destroyer from their reinforcements in each system that contains their ships and no planets or anomalies.',
    mapText:
      "Systems that contain no planets or anomalies do not cost movement for ships to move through. Players may allow other players' ships to move through those systems.",
    source: "absol",
  },
  {
    alias: "absol_incentive",
    name: "Incentive Program",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Draw and reveal 1 stage I public objective from the deck and place it near the public objectives. The player who cast the most votes "For" may immediately score that objective, if they meet the requirements, or draw 2 action cards if they do not.',
    text2:
      'Against: Draw and reveal 1 stage II public objective from the deck and place it near the public objectives. The player who cast the most votes "Against" may immediately score that objective, if they meet the requirements, or draw 3 action cards if they do not.',
    source: "absol",
  },
  {
    alias: "absol_leak",
    name: "Classified Document Leak",
    type: "Law",
    target: "Elect Scored Secret Objective",
    text1:
      "The elected secret objective becomes a public objective. The player who cast the most votes for that objective may immediately score it, if they meet the requirements, or draw 2 action cards if they do not.",
    mapText: "The elected secret objective becomes a public objective.",
    source: "absol",
  },
  {
    alias: "absol_limits",
    name: "Term Limits",
    type: "Law",
    target: "For/Against",
    text1:
      "For: The speaker places 1 of their control tokens on this card. When a player takes or receives the speaker token, they place 1 of their control tokens on this card. A player whose control token is on this card may not take or receive the speaker token. If a control token from every player is on this card, remove them.",
    text2:
      'Against: The player who cast the most votes "Against" draws 2 action cards. Exhaust the Politics strategy card. Players who voted "Against" or abstained must give 1 promissory note from their hand to a player who voted "For," if able.',
    mapText:
      "Players cant be made speaker again until all have been speaker. Place control tokens here to keep track of who cant be made speaker. Clear them off when all have been placed. ",
    source: "absol",
  },
  {
    alias: "absol_measures",
    name: "Unconventional Measures",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player who voted "For" draws 2 action cards. Each player who voted "Against" gains 1 command token.',
    text2:
      'Against: Each player who voted "Against" or abstained discards their action cards. The player that cast the most votes "For" chooses one strategy card to become exhausted.',
    source: "absol",
  },
  {
    alias: "absol_minsantique",
    name: "Minister of Antiquities",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may resolve the secondary ability of the Imperial strategy card without spending a command token.\nWhenever the owner of this card may score a public objective, they may choose to draw a relic instead.",
    mapText:
      "Follow Imperial without spending a command token. May draw a relic instead of scoring a public objective.",
    source: "absol",
  },
  {
    alias: "absol_minscomm",
    name: "Minister of Commerce",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may resolve the secondary ability of the Trade strategy card without spending a command token.\nWhenever the owner of this card replenishes their commodities, they gain 1 trade good per player that is their neighbor.",
    mapText:
      "Follow Trade without spending a command token. Whenever replenish commodities, gain 1 trade good per player that is your neighbor.",
    source: "absol",
  },
  {
    alias: "absol_minsexp",
    name: "Minister of Exploration",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card gains 1 additional command token when resolving the secondary ability of the Leadership strategy card.\nAfter performing a tactical action, the owner of this card may explore 1 frontier token or 1 planet that contains their units in the active system.",
    mapText:
      "When following leadership secondary, gain 1 addition command token. After tactical action, may explore one planet in the active system that contains their units.",
    source: "absol",
  },
  {
    alias: "absol_minsindus",
    name: "Minister of Industry",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may resolve the secondary ability of the Construction strategy card without spending or placing a command token.\nThe owner of this card increases the PRODUCTION value of their space docks by 4.",
    mapText:
      "Follow Construction without spending or placing a command token. Increase Space Dock PRODUCTION by 4.",
    source: "absol",
  },
  {
    alias: "absol_minspeace",
    name: "Minister of Peace",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may resolve the secondary ability of the Diplomacy strategy card without spending a command token.\nAfter a player activates a system that contains 1 or more of another player's units, the owner of this card may spend 1 command token from their strategy pool and give the active player 1 promissory note from their hand to immediately end that player's turn.",
    mapText:
      "Follow Diplomacy without spending a command token. After a player activates a system that contains 1 or more of another player's units, the owner of this card may spend a command token from your strategy pool and give the active player a promissory note from their hand to immediately end the active player's turn.",
    source: "absol",
  },
  {
    alias: "absol_minspolicy",
    name: "Minister of Policy",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may use the secondary ability of the Politics strategy card without spending a command token.\nDuring the draw action cards step of the status phase, instead of players drawing randomly, the owner of this card looks at a number of action cards from the top of the deck equal to the number of players plus 1, adds 2 to their hand, then gives one to each other player. Players that are able to draw more than 1 action card may then draw additional cards, as normal.",
    mapText:
      "Follow Politics without spending a command token. Players no longer draw action cards in the status phase. Instead, the owner of this card looks at a number of action cards from the deck equal to the number of players plus 1, adds 2 to their hand, then gives one to each other player. Players with technologies or abilities that increase the number of action cards drawn may then use those abilities to draw additional action cards, as normal.",
    source: "absol",
  },
  {
    alias: "absol_minssci",
    name: "Minister of Sciences",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may resolve the secondary ability of the Technology strategy card without spending a command token.\nThe owner of this card does not need to spend resources to research technology as part of the Technology strategy card.",
    mapText:
      "Follow Technology without spending a command token. The owner of this card does not need to spend resources to research technology as part of the Technology strategy card.",
    source: "absol",
  },
  {
    alias: "absol_minswar",
    name: "Minister of War",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may resolve the secondary ability of the Warfare strategy card without spending a command token. The owner of this card may use the following component action:\nACTION: Exhaust this card and spend 1 command token from your strategy pool to remove 1 of your command tokens from the game board.",
    mapText:
      "Follow Warfare without spending a command token. ACTION: Exhaust this card and spend 1 command token from your strategy pool to remove 1 command token from game board",
    source: "absol",
  },
  {
    alias: "absol_miscount",
    name: "Miscount Disclosed",
    type: "Directive",
    target: "Elect Law",
    text1:
      "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.\nVote on the elected law as if it had just been revealed from the top of the deck. The player who cast the most votes for the elected law casts 1 additional vote per player when voting on the elected law.",
    source: "absol",
  },
  {
    alias: "absol_mutiny",
    name: "Mutiny",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Exhaust the Politics strategy card. The player who cast the most votes "For" takes the speaker token. All players who voted "For" gain 1 victory point. If all players voted "For", the speaker gains 1 additional victory point.',
    text2:
      'Against: Each player who voted "For" loses 1 victory point and must give the speaker 1 promissory note from their hand. If all players voted "Against" or abstained, the speaker and the other player who cast the most votes "Against" gain 1 victory point.',
    source: "absol",
  },
  {
    alias: "absol_nexus",
    name: "Nexus Sovereignty",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Alpha and beta wormholes in the wormhole nexus have no effect on movement. The player who controls Mallice may spend 1 influence at any time to allow the current active player to ignore the effects of this law for the duration of their turn.",
    text2:
      'Against: Place a gamma wormhole token in the Mecatol Rex system. The player who cast the most votes "Against" destroys 1 of their non-fighter ships in each system in and adjacent to the wormhole nexus.',
    mapText:
      "Alpha/Beta wormholes in the wormhole nexus have no effect on movement. Mallice owner may spend 1 infl to ignore this law for active player.",
    source: "absol",
  },
  {
    alias: "absol_operations",
    name: "Clandestine Operations",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" gains 2 command tokens and takes the speaker token. Then, each player removes 1 command token from the command sheet of the player to their left and returns it to that player\'s reinforcements.',
    text2:
      "Against: Each player removes 1 command token from their fleet pool. Exhaust the Politics strategy card.",
    source: "absol",
  },
  {
    alias: "absol_pax",
    name: "Pax Magnifica, Bellum Gloriosum",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Exhaust the Warfare strategy card. The player who cast the most votes "For" adds 2 command tokens from their reinforcements to their strategy pool. Players reveal all Ceasefire promissory notes in their hand, then in voting order, give each Ceasefire matching their color to another player. Players may not receive Ceasefire promissory notes matching their color as part of transactions.',
    text2:
      'Against: Exhaust the Diplomacy strategy card. The player who cast the most votes "Against" adds 2 command tokens from their reinforcements to their fleet pool. Players may use the PRODUCTION ability of any number of their units.  After resolving this outcome, skip to the Ready Planets step of the agenda phase.',
    mapText:
      "Players may not receive Ceasefire promissory notes matching their color as part of transactions.",
    source: "absol",
  },
  {
    alias: "absol_prophecy",
    name: "Prophecy of Ixth",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may ignore the prerequisites on fighter unit upgrade technologies and applies +1 to the results of their fighter's combat rolls. Hits produced by their fighters must be applied to non-fighter ships, if able.  When the owner of this card uses PRODUCTION, they return this card to the common play area unless they produce 2 or more fighters.  If this card is in the common play area, a player may take it if they produce 4 or more fighters when using PRODUCTION.",
    mapText:
      "Can ignore prerequisite of Fighter 2 unit upgrade technology. Fighters get +1 combat. Hits from fighters must be applied to non-fighter ships first. When use PRODUCTION, discard this card unless produce 2 or more fighters.",
    source: "absol",
  },
  {
    alias: "absol_recon",
    name: "Wormhole Reconstruction",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" places 1 control token on this card. Players may treat alpha wormholes as beta wormholes during movement, and vice versa. A player whose control token is on this card gains 1 commodity each time another player\'s ships move through an alpha or beta wormhole.',
    text2:
      'Against: The player who cast the most votes "For" takes a command token from the reinforcements of each player who voted "Against" or abstained and places them into any number of systems that contain alpha or beta wormholes of their choice.',
    mapText:
      "Players may treat alpha wormholes as beta wormholes during movement, and vice versa. This player gains 1 commodity every time another player does so.",
    source: "absol",
  },
  {
    alias: "absol_redistribution",
    name: "Colonial Redistribution",
    type: "Directive",
    target: "Elect non-home Planet other than Mecatol Rex",
    text1:
      "Remove each unit on the elected planet. The player who controls that planet places the removed units on 1 or more planets they control in their home system, if able, then chooses one other player with the fewest victory points; that player may place 3 infantry from their reinforcements on the elected planet.",
    source: "absol",
  },
  {
    alias: "absol_reduction",
    name: "Arms Reduction",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player destroys all of their dreadnoughts and half of their cruisers (rounding up). Players gain 2 trade goods for each dreadnought and 1 trade good for each cruiser destroyed this way. The player who cast the most votes "For" adds 1 command token from their reinforcements to their strategy pool.',
    text2:
      'Against: The player who cast the most votes "Against" may research 1 unit upgrade technology, then place 1 dreadnought or 2 cruisers in a system that contains only their units.',
    source: "absol",
  },
  {
    alias: "absol_regulations",
    name: "Fleet Regulations",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" places 1 of their control tokens on this card. A player whose control token is on this card can have a maximum of 5 of their command tokens in their fleet pool. All other players can have a maximum of 4 of their command tokens in their fleet pool.',
    text2:
      'Against: The player who cast the most votes "Against" places 2 command tokens from their reinforcements in their fleet pool.',
    mapText:
      "Place a control token for the player that cast the most votes 'For' on this card. Any player who does not have a control token on this card can have a maximum of 4 of their command tokens in their fleet pool. A player whose control token is on this card can have a maximum of 5 of their command tokens in their fleet pool.",
    source: "absol",
  },
  {
    alias: "absol_revolution",
    name: "Anti-Intellectual Revolution",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Each player who voted "For" or abstained returns 1 technology they own with the most prerequisites to their technology decks. Double the prerequisites on all technologies.',
    text2:
      'Against: Exhaust the Technology strategy card. Any player who voted "Against" or abstained destroys a number of their units on the game board with a combined cost of at least 6 resources.',
    mapText: "Double the prerequisites on all technologies.",
    source: "absol",
  },
  {
    alias: "absol_sanctions",
    name: "Executive Sanctions",
    type: "Law",
    target: "For/Against",
    text1:
      "For: The player who cast the most votes “For” places 1 of their control tokens on this card.  A player whose control token is on this card can have a maximum of 5 action cards in their hand. All other players can have a maximum of 3 action cards in their hand.",
    text2:
      'Against: The player who cast the most votes "Against" draws 5 action cards.',
    mapText:
      "Place a control token for the player who cast the most votes 'For' on this card. Any player who does not have a control token on this card has an action card hand limit of 3. A player whose control token is on this card has an action card hand limit of 5.",
    source: "absol",
  },
  {
    alias: "absol_schematics",
    name: "Publicize Weapon Schematics",
    type: "Law",
    target: "Elect owned non-faction unit upgrade technology",
    text1:
      "When this agenda is revealed, if there are no eligible technologies in play, discard this card and reveal another agenda from the top of the deck.\nEach player may ignore the prerequisites on unit upgrade technologies that match the unit type of the elected technology.\nThat unit upgrade loses the SUSTAIN DAMAGE ability if it has it.\nThe player who cast the most votes for the elected technology may immediately gain a unit upgrade technology for that unit type.",
    mapText:
      "Every player may ignore the prerequisites on the elected technology. That unit upgrade loses the SUSTAIN DAMAGE ability if it has it.",
    source: "absol",
  },
  {
    alias: "absol_secret",
    name: "Archived Secret",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player draws 2 secret objectives, then gives 1 promissory note from their hand to the other player who cast the most votes for them.",
    source: "absol",
  },
  {
    alias: "absol_seeds",
    name: "Seed of an Empire",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: The player with the most victory points (speaker breaks ties) gains the speaker token and 1 victory point, then gives 1 promissory note to each other player who voted "For" (in order of most to least votes), if able.',
    text2:
      "Against: The player with the least victory points (speaker breaks ties) gains 1 victory point, draws 3 action cards, and adds 1 command token from their reinforcements to each of their tactic, fleet, and strategy pools.",
    source: "absol",
  },
  {
    alias: "absol_shared",
    name: "Shared Research",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" may explore any frontier tokens in systems that contain anomalies and their ships. During tactical actions, the active player may decide that any anomaly that does not contain a frontier token does not affect movement.',
    text2:
      'Against: The player who cast the most votes "For" takes 1 command token from the reinforcements of each player who voted "Against" or abstained and places them in any number of anomaly systems.',
    mapText:
      "During tactical actions, the active player may decide that any anomaly that does not contain a Frontier token does not affect movement.",
    source: "absol",
  },
  {
    alias: "absol_sites",
    name: "Preservation of Historical Sites",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" gains 2 trade goods for each legendary planet or planet with attachments that they control. Players must spend 1 influence to explore industrial planets and 2 influence to explore cultural planets.',
    text2:
      'Against: The player who cast the most votes "Against" may immediately explore each planet they control in 1 system.',
    mapText:
      "Players must spend 1 influence to explore industrial planets and 2 influence to explore cultural planets.",
    source: "absol",
  },
  {
    alias: "absol_spending",
    name: "Discretionary Spending",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: All players gain trade goods equal to the number of planets they control.\nThe player who cast the most votes "For" replenishes their commodities.\nIn voting order, each player may spend any number of trade goods as follows, with the given costs (they cannot choose the same system or planet more than once):\n- use the PRODUCTION ability of their units in any system (Cost)\n- research up to 2 technologies (4 each)\n- place 1 structure on a planet they control (3)\n- draw 1 action card (1)\n- explore a planet they control or a frontier token in a system that contains their ships (1) [Note: You cannot explore the same planet multiple times]',
    text2:
      'Against: All players except the player who cast the most votes "Against" lose half of their trade goods (rounded up).',
    source: "absol",
  },
  {
    alias: "absol_standardization",
    name: "Armed Forces Standardization",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player places command tokens from their reinforcements until they they have 3 tokens in their tactic pool, 3 tokens in their fleet pool, and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements, then the other player who cast the most votes for the elected player gives them 1 promissory note from their hand.",
    source: "absol",
  },
  {
    alias: "absol_swords",
    name: "Swords to Plowshares",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player removes half of their infantry on each planet they control, rounding down. Each player gains trade goods equal to the number of their infantry removed. The player who cast the most votes "For" may explore every planet from which their infantry were removed.',
    text2:
      'Against: The player who cast the most votes "Against" places 1 infantry from their reinforcements on each planet they control.',
    source: "absol",
  },
  {
    alias: "absol_travelban",
    name: "Enforced Travel Ban",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" places 3 of their control tokens on this card. Alpha and beta wormholes have no effect during movement. A player whose control token is on this card may discard 1 control token at any time to allow the current active player to ignore the effects of this law for the duration of their turn.',
    text2:
      'Against: Players who voted "Against" gain 1 trade good for each wormhole in systems that contain 1 or more of their units. Players that gained trade goods also gain 1 commodity for each of their neighbors.',
    mapText:
      "Place 3 control tokens for the player that cast the most votes 'For' on this card. Alpha and beta wormholes have no effect during movement. When activating a system, a player whose control token is on this card may discard that control token to ignore the effects of this law during that activation.",
    source: "absol",
  },
  {
    alias: "absol_warrant",
    name: "Search Warrant",
    type: "Law",
    target: "Elect Player",
    text1:
      "The non-elected player who cast the most votes for the elected player places 1 of their control tokens on this card. The elected player gains this card and draws 2 secret objectives.\nThe owner of this card plays with their secret objectives revealed.\nWhen the owner of this card would discard a secret objective, a player whose control token is on this card may take that secret objective instead.",
    mapText:
      "Place a control token for the non-elected player that cast the most votes for the elected player on this card. The owner of this card plays with their secret objectives revealed. When the owner of this card would discard a secret objective, a player whose control token is on this card may take that secret objective instead.",
    source: "absol",
  },
  {
    alias: "absol_whresearch",
    name: "Wormhole Research",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Players with ships in systems that contain 1 or more wormholes may research a technology with no more than 1 prerequisite per type of wormhole in those systems. The player who cast the most votes "For" may gain any 1 non-faction technology researched this way.',
    text2:
      'Against: In systems that contain their ships and wormholes, each player who voted "For" destroys 1 non-fighter ship for each alpha or beta wormhole. Each player who voted "Against" or abstained removes 1 command token from their command sheet and returns it to their reinforcements.',
    source: "absol",
  },
  {
    alias: "arbiter",
    name: "Imperial Arbiter",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. At the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards.",
    text2: "",
    mapText:
      "At the end of the strategy phase, you may discard this card to swap 1 of your  strategy cards with 1 of another player's strategy cards.",
    source: "base",
  },
  {
    alias: "arms_reduction",
    name: "Arms Reduction",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player destroys all but 2 of their dreadnoughts and all but 4 of their cruisers.",
    text2:
      "Against: At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty.",
    forEmoji: "💥",
    againstEmoji: "ExhaustedPlanet",
    source: "base",
  },
  {
    alias: "articles_war",
    name: "Articles of War",
    type: "Law",
    target: "For/Against",
    text1:
      "For: All mechs lose their printed abilities except for SUSTAIN DAMAGE.",
    text2: 'Against: Each player that voted "For" gains 3 trade goods.',
    forEmoji: "SadMech",
    againstEmoji: "tg",
    mapText:
      "All mechs lose their printed abilities except for SUSTAIN DAMAGE.",
    source: "pok",
  },
  {
    alias: "artifact",
    name: "Ixthian Artifact",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their own units in each of those systems.",
    text2: "Against: No effect.",
    forEmoji: "TechExplode",
    againstEmoji: "🚫",
    source: "base",
  },
  {
    alias: "baldrick_administrative_order",
    name: "Administrative Order (Federation of Sol)",
    category: "faction",
    categoryDescription: "sol",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When the Sol player uses their Orbital Drop ability, they gain 1 trade good.",
    text2:
      "Against: The Sol player may place up to 4 fighters on the board in systems that contain their units.",
    mapText:
      "When the Sol player uses their Orbital Drop ability, they gain 1 trade good.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_agency_reorganization",
    name: "Agency Reorganization",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1:
      "- If the elected player's commander is locked, unlock their commander.\n- If the elected player's commander is unlocked, purge their commander and alliance promissory note. Then, that players gains 2 command tokens.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_archived_secret",
    name: "Archived Secret",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1: "The elected player draws 1 secret objective.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_armament_retrofit",
    name: "Armament Retrofit (Embers of Muaat)",
    category: "faction",
    categoryDescription: "muaat",
    type: "Law",
    target: "For/Against",
    text1:
      "For: The Muaat flagship gains combat, capacity, and move values equivalent to the Muaat player's war suns.",
    text2:
      "Against: Each player that voted For gains 1 command token in their strategy pool.",
    mapText:
      "The Muaat flagship gains combat, capacity, and move values equivalent to the Muaat player's war suns.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_armed_forces_standardization",
    name: "Armed Forces Standardization",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player places command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool, and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_articles_of_war",
    name: "Articles of War",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: All mechs lose their printed abilities except for SUSTAIN DAMAGE.",
    text2:
      "Against: Each player must place a command token in a system that contains one of their units with SUSTAIN DAMAGE, if possible.",
    mapText:
      "All mechs lose their printed abilities except for SUSTAIN DAMAGE.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_astral_echoes",
    name: "Astral Echoes (Seers of Qulane)",
    category: "faction",
    categoryDescription: "qulane",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The Qulane player may look at the top 4 cards of the relic deck, then return them to the top of the deck in any order",
    text2:
      "Against: Each player that voted For gains 1 unknown relic fragment.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_astrolane_corridors",
    name: "Astrolane Corridors (Naalu Collective)",
    category: "faction",
    categoryDescription: "naalu",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: For each 5 fighters (round down) the Naalu player has on the board, they gain 1 trade good.",
    text2:
      "Against: Each player that did not cast at least 1 vote For must reveal 1 secret objective from their hand to the Naalu player, if possible.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_checks_and_balances",
    name: "Checks and Balances",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: During the strategy phase, begin with the player to the right of the speaker and proceed in counter-clockwise order",
    text2:
      "Against: For each Support for the Throne promissory note in a player's play area, they lose 1 victory point. Then purge all Support for the Throne promissory notes.",
    mapText:
      "During the strategy phase, begin with the player to the right of the speaker and proceed in counter-clockwise order",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_clandestine_operations",
    name: "Clandestine Operations",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player removes 2 command tokens from their command sheet and return those tokens to their reinforcements.",
    text2:
      "Against: Each player removes 1 command token from their fleet pool and returns that token to their reinforcements.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_classified_document_leaks",
    name: "Classified Document Leaks",
    category: "agenda",
    type: "Law",
    target:
      "Scored Secret Objective\n (When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "The elected secret objective becomes a public objective; place it near the other public objectives in the common play area.",
    mapText:
      "The elected secret objective becomes a public objective; place it near the other public objectives in the common play area.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_cognitive_spire",
    name: "Cognitive Spire (L1Z1X Mindnet)",
    category: "faction",
    categoryDescription: "l1z1x",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: At the start of the strategy phase, the L1Z1X player may spend 4 resources to research 1 technology or 10 resources to research 2 technologies.",
    text2:
      "Against: Each player that voted against must replace 1 technology on their player sheet with a technology of the same color that has fewer prerequisites. If they cannot do this, they cannot vote against.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_committee_formation",
    name: "Committee Formation",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nBefore players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda.",
    mapText:
      "Before players vote on an elect player agenda, you may discard this card to choose a player to be elected. Players do not vote on the agenda.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_communication_transfer_node",
    name: "Communication Transfer Node (Nomad)",
    category: "faction",
    categoryDescription: "nomad",
    type: "Directive",
    target: "For/Against",
    text1: "For: The Nomad player gains 4 trade goods.",
    text2: "Against: Each player that voted For gains 2 trade goods.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_compensated_disarmament",
    name: "Compensated Disarmament",
    category: "agenda",
    type: "Directive",
    target: "Elect Planet",
    text1:
      "Destroy each ground force on the elected planet; for each unit that was destroyed, the player who control that planet gains 1 trade good.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_cosmic_armory",
    name: "Cosmic Armory (Vuil'raith Cabal)",
    category: "faction",
    categoryDescription: "cabal",
    type: "Law",
    target: "For/Against",
    text1:
      "For: At any time, the Cabal player may return captured units to the supply and gain trade goods equivalent to half the printed cost of the unit (round down).",
    text2:
      "Against: The Cabal player may capture one unit costing 2 resources or less from the reinforcements of each player that did not cast at least 1 vote For.",
    mapText:
      "At any time, the Cabal player may return captured units to the supply and gain trade goods equivalent to half the printed cost of the unit (round down).",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_covert_legislation",
    name: "Covert Legislation",
    category: "agenda",
    type: "Directive",
    target:
      "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other Elect Players. Instead, the speaker reads the eligible outcomes aloud (for, against, elect Elect Player, etc); the other Elect Players vote for these outcomes as if they were outcomes of this agenda, without knowing their effects.",
    text1: "",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_dedevelopment",
    name: "Dedevelopment",
    category: "agenda",
    type: "Directive",
    target: "Elect Player who owns at least 2 technologies",
    text1:
      "The elected player returns 2 technologies to their reinforcements. Then, they may research 1 technology.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_economic_equality",
    name: "Economic Equality",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods.",
    text2:
      "Against: Each player returns all of their trade goods to the supply.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_excavation_crew",
    name: "Excavation Crew (Naaz-Rokha Alliance)",
    category: "faction",
    categoryDescription: "naaz",
    type: "Directive",
    target: "For/Against",
    text1: "For: The Naaz-Rokha player may explore 2 planets they control.",
    text2:
      "Against: Each player that voted For may explore 1 planet they control.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_flare_trellis",
    name: "Flare Trellis (Argent Flight)",
    category: "faction",
    categoryDescription: "argent",
    type: "Law",
    target: "For/Against",
    text1:
      "For: The Argent player gains this card\nAfter activating a system, the Argent player may purge this card to transport their PDS units as if they were ground forces.",
    text2:
      "Against: The Argent player may place 1 PDS unit from their reinforcements on any planet they control.",
    mapText:
      "After activating a system, the Argent player may purge this card to transport their PDS units as if they were ground forces.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_galactic_crisis_pact",
    name: "Galactic Crisis Pact",
    category: "agenda",
    type: "Directive",
    target: "Strategy Card",
    text1:
      "Each player may perform the secondary ability of the elected strategy card without spending a command token; command tokens placed by the ability are placed from a player's reinforcements instead.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_galactic_tribute",
    name: "Galactic Tribute (Barony of Letnev)",
    category: "faction",
    categoryDescription: "letnev",
    type: "Law",
    target: "For/Against",
    text1:
      "For: A player must give the Letnev player 1 trade good or commodity before moving ships into a system that contains or is adjacent to a system that contains a Letnev unit with BOMBARDMENT",
    text2:
      "Against: Each ship with SUSTAIN DAMAGE that belongs to a player that did not cast at least 1 vote For becomes damaged.",
    mapText:
      "You must give the Letnev player 1 trade good or commodity before moving ships into or adjacent to a system containing a Letnev unit with BOMBARDMENT",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_homeland_defense_act",
    name: "Homeland Defense Act",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players may not decline to fire SPACE CANNON or ANTI-FIGHTER BARRAGE.",
    text2:
      "Against: Each player that voted For may place 1 PDS from their reinforcements on a planet they control.",
    mapText:
      "Players may not decline to fire SPACE CANNON or ANTI-FIGHTER BARRAGE.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_imperial_arbiter",
    name: "Imperial Arbiter",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nAt the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards.",
    mapText:
      "At the end of the strategy phase, you may discard this card to swap 1 of your strategy cards with 1 of another player's strategy cards.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_incentive_program",
    name: "Incentive Program",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Draw and reveal 1 stage I public objective from the deck and place it near the public objectives.",
    text2:
      "Against: Draw and reveal 1 stage II public from the deck and place it near the public objectives.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_intergalactic_peacekeepers",
    name: "Intergalactic Peacekeepers",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: After assigning hits in the first round of ground combat, roll a die. On a result of 6 or higher, the defending player may place 3 infantry from their reinforcements on the planet.",
    text2:
      "Against: Each player that did not predict or cast at least 1 vote For must remove 4 units from the gameboard, if possible.",
    mapText:
      "After assigning hits in the first round of ground combat, roll a die. On a result of 6 or higher, the defending player may place 3 infantry from their reinforcements on the planet.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_judicial_abolishment",
    name: "Judicial Abolishment",
    category: "agenda",
    type: "Directive",
    target:
      "Elect Law\n(When this agenda is revealed, if there are 2 or fewer laws in play, discard this card and reveal another agenda from the top of the deck.)",
    text1: "Discard the elected law from play.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_mainframe_incursino",
    name: "Mainframe Incursion (Nekro Virus)",
    category: "faction",
    categoryDescription: "nekro",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The Nekro player may gain 1 technology owned by a player who voted For this agenda, or from a player who abstained.",
    text2:
      "Against: Each player that voted against must return 1 command token to their reinforcements.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_matter_expropriation",
    name: "Matter Expropriation (Clan of Saar)",
    category: "faction",
    categoryDescription: "saar",
    type: "Law",
    target: "For/Against",
    text1:
      "For: After the Saar player loses control of a planet, they gain 1 trade good.",
    text2:
      "Against: At the start of the strategy phase, each player that voted For may produce units worth up to 3 resources and place them in systems that contain 1 of their space docks.",
    mapText:
      "After the Saar player loses control of a planet, they gain 1 trade good.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_meij_restoration",
    name: "M'eij Restoration (Sardakk N'orr)",
    category: "faction",
    categoryDescription: "sardakk",
    type: "Directive",
    target: "For/Against",
    text1: "For: The Sardakk player may research a technology.",
    text2:
      "Against: At the start of the strategy phase, each player that did not cast at least 1 vote For must exhaust 1 planet for each technology that they own.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_antiquities",
    name: "Minister of Antiquities",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1: "The elected player gains 1 relic.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_commerce",
    name: "Minister of Commerce",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nAfter the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor.",
    mapText:
      "After you replenish commodities, gain 1 trade good for each player that is your neighbor.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_defense",
    name: "Minister of Defense",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nThe maximum number of non-fighter ships the owner of this card can have in each system is increased by 1.",
    mapText:
      "The maximum number of non-fighter ships you can have in each system is increased by 1.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_development",
    name: "Minister of Development",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nThe owner of this card's commodity value is increased by 1.\nAt any time, the owner of this card may replenish their commodities and convert their commodities into trade goods; if they do, purge this card.",
    mapText:
      "Your commodity value is increased by 1. At any time, you may purge this card to replenish your commodities and convert their commodities into trade goods.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_industry",
    name: "Minister of Industry",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nAt the start of the strategy phase, the owner of this card gains 1 command token.\nThe owner of this card may purge this card to gain a command token.",
    mapText:
      "At the start of the strategy phase, gain 1 command token. You may purge this card to gain a command token.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_infrastructure",
    name: "Minister of Infrastructure",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nWhen the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities.\nWhen the owner of this card uses the PRODUCTION ability of 1 or more of their units, they apply +2 to the total PRODUCTION value.",
    mapText:
      "When you place a space dock in a system, your units in that system may use their PRODUCTION abilities. When you use PRODUCTION apply +2 to the total PRODUCTION value.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_peace",
    name: "Minister of Peace",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nAfter a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card; immediately end the active player's turn.",
    mapText:
      "After a player activates a system that contains 1 or more of a different player's units, discard this card to immediately end the active player's turn.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_policy",
    name: "Minister of Policy",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and draws 3 action cards.\nThe maximum number of action cards the owner of this card can have in their hand is increased by 3. ",
    mapText:
      "The maximum number of action cards you can have in your hand is increased by 3. ",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_sciences",
    name: "Minister of Sciences",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card.\nWhen the owner of this card resolves the primary or secondary ability of the "Technology" strategy card, they do not need to spend resources to research technology.',
    mapText:
      'When you resolve the primary or secondary ability of the "Technology" strategy card, you do not need to spend resources.',
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_minister_of_war",
    name: "Minister of War",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\nThe owner of this card may discard this card after performing an action to remove 1 of their command tokens from the game board and return it to their reinforcements; then they may perform 1 additional action.",
    mapText:
      "Discard this card after performing an action to return 1 of your command tokens from the game board to your reinforcements; you may perform 1 additional action.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_miscount_disclosed",
    name: "Miscount Disclosed",
    category: "agenda",
    type: "Directive",
    target:
      "Elect Law\n(When this agenda is revealed, if there are 2 or fewer laws in play, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "Vote on the elected law as if it were just revealed from the top of the deck.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_mutiny",
    name: "Mutiny",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1: 'For: Each player that voted "For" gains 1 victory point.',
    text2: 'Against: Each player that voted "For" loses 1 victory point.',
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_network_patrols",
    name: "Network Patrols (Council Keleres)",
    category: "faction",
    categoryDescription: "keleresm",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Non-Keleres players must spend 1 influence to activate a system that contains another player's units.",
    text2: "Against: The Keleres player gains 2 trade goods.",
    mapText:
      "Non-Keleres players must spend 1 influence to activate a system that contains another player's units.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_nexus_sovereignty",
    name: "Nexus Sovereignty",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: A player must return a command token from their strategy pool to reinforcements in order to activate the wormhole nexus.",
    text2: "Against: Place a gamma wormhole token in the Mecatol Rex system.",
    mapText:
      "A player must return a command token from their strategy pool to reinforcements in order to activate the wormhole nexus.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_political_censure",
    name: "Political Censure",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point.\nThe elected player cannot play action cards.\nIf the owner of this card loses this card, they lose 1 victory point.",
    mapText:
      "You cannot play action cards. If you lose this card, lose 1 victory point.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_privateer_fleet",
    name: "Privateer Fleet (Mentak Coalition)",
    category: "faction",
    categoryDescription: "mentak",
    type: "Law",
    target: "For/Against",
    text1:
      "For: At the end of a combat in a system adjacent to 1 or more of Mentak's ships, the Mentak player gains a trade good.",
    text2:
      "Against: The Mentak player may place up to 2 cruisers from their reinforcements in any system that contains their ships.",
    mapText:
      "At the end of a combat in a system adjacent to 1 or more of Mentak's ships, the Mentak player gains a trade good.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_psychopomp",
    name: "Psychopomp (The Raven)",
    category: "faction",
    categoryDescription: "raven",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The Raven player may choose a red backed tile not currently in use. Place that tile in an empty corner and place 1 Raven ship in the system.",
    text2:
      "Against: The Raven player may use the production ability of 1 of their units. Each other player may produce 1 unit that costs 4 or less in a system that contains 1 of their units with production.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_public_execution",
    name: "Public Execution",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player discards all of their action cards. The elected player cannot vote on any agendas during this agenda phase. If they have the speaker token, roll 1 die. On a result of 1-4, pass the token 1 place to the left. On a result of 5-10, pass the token 1 space to the right.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_regulated_conscription",
    name: "Regulated Conscription",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player may have no more than 6 ground forces on a planet. Any ground forces above 6 are removed",
    text2:
      "Against: Each player that did not predict or cast at least 1 vote For must remove a command token from their player sheet. Each player that voted For may gain a command token.",
    mapText:
      "Each player may have no more than 6 ground forces on a planet. Any ground forces above 6 are removed",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_research_grant_reallocation",
    name: "Research Grant Reallocation",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology, they remove 1 token from their fleet pool and return it to their reinforcements.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_rhizomatic_inflation",
    name: "Rhizomatic Inflation (Arborec)",
    category: "faction",
    categoryDescription: "arborec",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When the Arborec player uses PRODUCTION, reduce the combined cost of the produced units by 1.",
    text2:
      "Against: For each player that voted Against, the Arborec player may may place 1 command token from that player's reinforcements in any non-home system.",
    mapText:
      "When the Arborec player uses PRODUCTION, reduce the combined cost of the produced units by 1.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_search_warrant",
    name: "Search Warrant",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and draws 2 secret objectives.\nThe owner of this card plays with their secret objectives revealed.",
    mapText: "You play with your secret objectives revealed",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_secret_provisions",
    name: "Secret Provisions (Yssaril Tribes)",
    category: "faction",
    categoryDescription: "yssaril",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When using their stall tactics ability, if the Yssaril player does not DEPLOY a mech they may instead place 2 infantry from their reinforcements on a planet they control.",
    text2: "Against: Each player that voted For may draw 1 action card.",
    mapText:
      "When using their stall tactics ability, if Yssaril does not DEPLOY a mech they can place 2 infantry from their reinforcements on a planet they control.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_seed_of_an_empire",
    name: "Seed of an Empire",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The player with the most victory points gains 1 victory point.",
    text2:
      "Against: The player with the fewest victory points gains 1 victory point.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_shadow_walkers",
    name: "Shadow Walkers (Mahact Gene-Sorcerers)",
    category: "faction",
    categoryDescription: "mahact",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The Mahact player may add 1 command token to their player sheet from a faction whose token is not already on the sheet.",
    text2:
      "Against: Each player that did not cast at least 1 vote For must give the Mahact player a random action card, if able.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_special_session",
    name: "Special Session (Xxcha Kingdom)",
    category: "faction",
    categoryDescription: "xxcha",
    type: "Law",
    target: "For/Against",
    text1:
      "For: The Xxcha player gains this card\nAt the end of the agenda phase, the Xxcha player may purge this card to begin another agenda phase.",
    text2:
      "Against: The Xxcha player gains one trade good for each player that voted Against.",
    mapText:
      "At the end of the agenda phase, the Xxcha player may purge this card to begin another agenda phase.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_stately_quadrille",
    name: "Stately Quadrille",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Return all alliance promissory notes to their owners. Then, each player gives their alliance to the player sitting to their right.",
    text2:
      "Against: Return all alliance promissory notes to their owners. Then, each player gives their alliance to the player sitting to their left.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_swords_to_plowshares",
    name: "Swords to Plowshares",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed.",
    text2:
      "Against: Each player places 1 infantry from their reinforcements on each planet they control.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_trade_harmonization",
    name: "Trade Harmonization (Emirates of Hacan)",
    category: "faction",
    categoryDescription: "hacan",
    type: "Law",
    target: "For/Against",
    text1:
      "For: - At any time, the Hacan player may discard 1 action to gain 1 trade good. \n- At any time, the Hacan player may discard 2 trade goods to gain 1 action card.",
    text2:
      "Against: At the start of the strategy phase, the Hacan player may produce 1 ship at one of their space docks.",
    mapText:
      "At any time, the Hacan player may: discard 1 action to gain 1 trade good; discard 2 trade goods to gain 1 action card.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_transitive_development",
    name: "Transitive Development (Titans of Ul)",
    category: "faction",
    categoryDescription: "titans",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The Titans player may place up to 3 sleeper tokens on planets that are in or adjacent to systems that contain a planet they control.",
    text2: "Against: Each player that voted For gains 2 trade goods.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_turnbuckle_drop",
    name: "Turnbuckle Drop (Yin Brotherhood)",
    category: "faction",
    categoryDescription: "yin",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When the Yin player uses a faction ability, they gain 1 trade good.",
    text2:
      "Against: - Each player that voted For gains 1 trade good\n- The Yin player gains a trade good for each player that voted Against.",
    mapText:
      "When the Yin player uses a faction ability, they gain 1 trade good.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_twilight_watch",
    name: "Twilight Watch (Empyrean)",
    category: "faction",
    categoryDescription: "empyrean",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The Empyrean player may place up to 2 destroyers or cruisers from their reinforcement in systems that do not contain another player's units.",
    text2:
      "Against: The Empyrean player may place a frontier token in a system that does not contain a planet and does not already have a frontier token.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_unconventional_measures",
    name: "Unconventional Measures",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1: 'For: Each player that voted "For" draws 2 action cards.',
    text2:
      'Against: Each player that voted "For" discards all of their action cards.',
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_voyager_returns",
    name: "Voyager Returns (Winnu)",
    category: "faction",
    categoryDescription: "winnu",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When the Winnu player activates the Mecatol Rex system, they may apply +1 to the move value of their ships during this tactical action.",
    text2:
      "Against: The Winnu player may draw 2 action cards.\nEach player that voted for may draw 1 action card.",
    mapText:
      "When the Winnu player activates the Mecatol Rex system, they may apply +1 to the move value of their ships during this tactical action.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_weapons_endowment",
    name: "Weapons Endowment (Universities of Jol-Nar)",
    category: "faction",
    categoryDescription: "jolnar",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Ignore Jol-Nar's fragile faction ability in systems that contain a planet with a technology specialty.",
    text2:
      "Against: Each player that voted against must exhaust 1 technology on their player sheet. If they cannot do this, they cannot vote against.",
    mapText:
      "Ignore Jol-Nar's fragile faction ability in systems that contain a planet with a technology specialty.",
    source: "ignis_aurora",
  },
  {
    alias: "baldrick_wormhole_checkpoints",
    name: "Wormhole Checkpoints (Ghosts of Creuss)",
    category: "faction",
    categoryDescription: "ghost",
    type: "Law",
    target: "For/Against",
    text1:
      "For: After a non-Creuss player moves ships through a wormhole, they must destroy 1 of the non-fighter ships that moved through a wormhole, if able.",
    text2:
      "Against: The Creuss player may place up to 2 of their IFF tokens in non-home systems.",
    mapText:
      "After a non-Creuss player moves ships through a wormhole, they must destroy 1 of the non-fighter ships that moved through a wormhole, if able.",
    source: "ignis_aurora",
  },
  {
    alias: "bvz_regulated_conscription",
    name: "Regulated Conscription",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player produces units, they may only build 1 fighter and infantry for its cost instead of 2.",
    text2:
      "Against: The player with the most infantry must destroy half of their infantry, rounded up. The player with the most fighters must destroy half of their fighters, rounded up.",
    mapText:
      "When a player produces units, they may only build 1 fighter and infantry for its cost instead of 2.",
    source: "byz_agendas",
  },
  {
    alias: "byz_archived_secret",
    name: "Archived Secret",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1: "Elected player draws 2 secret objectives and discards 1.",
    source: "byz_agendas",
  },
  {
    alias: "byz_arms_reduction",
    name: "Arms Reduction",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player must destroy all but 2 of their dreadnoughts and all but 2 of their carriers.",
    text2:
      "Against: Each player must destroy 2 PDS outside their home system, if able.",
    source: "byz_agendas",
  },
  {
    alias: "byz_clandestine_operations",
    name: "Clandestine Operations",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1: "For: Each player who voted “For” gains one command token.",
    text2:
      "Against: Each player who voted “For” removes 2 command tokens from their fleet pool and returns those tokens to their reinforcements.",
    source: "byz_agendas",
  },
  {
    alias: "byz_colonial_redistribution",
    name: "Colonial Redistribution",
    category: "agenda",
    type: "Directive",
    target: "Elect Planet",
    text1:
      "Destroy each unit on the elected planet. Then, the player who controls that planet chooses one player with the fewest victory points; that player may place 3 infantry and 1 PDS from their reinforcements on the elected planet.",
    source: "byz_agendas",
  },
  {
    alias: "byz_conventions_of_war",
    name: "Conventions of War",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players may no longer use BOMBARDMENT against planets in another player's home system.",
    text2:
      "Against: Starting with the Speaker and continuing clockwise, each player may use the PRODUCTION ability of 1 space dock they control.",
    mapText:
      "Players may no longer use BOMBARDMENT against planets in another player's home system.",
    source: "byz_agendas",
  },
  {
    alias: "byz_designated_pariah",
    name: "Designated Pariah",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "Once per combat, after 1 of the elected player's units is destroyed, the active player may gain one Trade Good from the supply.",
    mapText:
      "Once per combat, after 1 of the elected player's units is destroyed, the active player may gain one Trade Good from the supply.",
    source: "byz_agendas",
  },
  {
    alias: "byz_enforced_travel_ban",
    name: "Enforced Travel Ban",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1: "For: Alpha and beta wormholes have no effect during movement.",
    text2:
      "Against: The Speaker must place an ion storm token in the Mecatol Rex system.",
    mapText: "Alpha and beta wormholes have no effect during movement.",
    source: "byz_agendas",
  },
  {
    alias: "byz_free_trade",
    name: "Free Trade",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: All players are neighbors. The commodity value of each faction is increased by one.",
    text2:
      "Against: Each player gives one other player of their choice a Trade Agreement from their hand.",
    mapText:
      "All players are neighbors. The commodity value of each faction is increased by one.",
    source: "byz_agendas",
  },
  {
    alias: "byz_homeland_defense_act",
    name: "Homeland Defense Act",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player may add one PDS from their reinforcements to a planet in their home system. Each player can have any number of PDS units on planets they control.",
    text2:
      "Against: All players must destroy all PDS units in their home system.",
    mapText:
      "Each player can have any number of PDS units on planets they control.",
    source: "byz_agendas",
  },
  {
    alias: "byz_humanitarian_missions",
    name: "Humanitarian Missions",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When players gain control of a planet that was controlled by another player, that planet is not exhausted.",
    text2:
      "Against: At the start of the Strategy Phase, each player chooses one planet controlled by the player to their right and exhausts it.",
    mapText:
      "When players gain control of a planet that was controlled by another player, that planet is not exhausted.",
    source: "byz_agendas",
  },
  {
    alias: "byz_imperial_champion",
    name: "Imperial Champion",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point. A player gains this card and 1 victory point when they win a combat against the owner of this card. Then, the previous owner of this card loses 1 victory point.",
    mapText:
      "A player gains this card and 1 victory point when they win a combat against the owner of this card. Then, the previous owner of this card loses 1 victory point.",
    source: "byz_agendas",
  },
  {
    alias: "byz_imperium_rex",
    name: "Imperium Rex",
    category: "agenda",
    type: "Law",
    target:
      "For/Against (When this card is drawn, if it is round 1 or 2, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "For: The game no longer ends when one player reaches a number of victory points. Instead, the game ends when players would return strategy cards in the upcoming round. Whoever has the most points wins the game, with ties determined by initiative order.",
    text2: "Against: Each player loses one victory point.",
    mapText:
      "The game no longer ends when one player reaches a number of victory points. Instead, the game ends when players would return strategy cards in the upcoming round. Whoever has the most points wins the game, with ties determined by initiative order.",
    source: "byz_agendas",
  },
  {
    alias: "byz_interdict_trade",
    name: "Interdict Trade",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player’s may not receive commodities or trade goods from other players in a transaction.",
    mapText:
      "The elected player’s may not receive commodities or trade goods from other players in a transaction.",
    source: "byz_agendas",
  },
  {
    alias: "byz_judicial_abolishment",
    name: "Judicial Abolishment",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Discard the last public objective to be revealed from play. Draw a new public objective of the same stage and place it near the public objectives.",
    text2:
      "Against: Each player gives one other player of their choice a Political Secret from their hand.",
    source: "byz_agendas",
  },
  {
    alias: "byz_manifest_destiny",
    name: "Manifest Destiny",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point. A player gains this card and 1 victory point when they take a planet from the owner of this card. Then, the previous owner of this card loses one victory point.",
    mapText:
      "A player gains this card and 1 victory point when they take a planet from the owner of this card. Then, the previous owner of this card loses one victory point.",
    source: "byz_agendas",
  },
  {
    alias: "byz_minister_of_commerce",
    name: "Minister of Commerce",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "For: All players gain the War Sun technology. All War Suns lose SUSTAIN DAMAGE.",
    mapText:
      "After the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor. The owner of this card may discard this card when they replenish commodities to gain 5 trade goods.",
    source: "byz_agendas",
  },
  {
    alias: "byz_minister_of_exploration",
    name: "Minister of Exploration",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. When the owner of this card gains control of a planet, they gain 1 Trade Good. At the end of their turn, the owner of this card may discard this card to explore every planet they control.",
    mapText:
      "When the owner of this card gains control of a planet, they gain 1 Trade Good. At the end of their turn, the owner of this card may discard this card to explore every planet they control.",
    source: "byz_agendas",
  },
  {
    alias: "byz_minister_of_industry",
    name: "Minister of Industry",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. When the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities. The owner of this card may discard this card when they use one of their PRODUCTION abilities to increase their PRODUCTION capacity in that system by 8.",
    mapText:
      "When the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities. The owner of this card may discard this card when they use one of their PRODUCTION abilities to increase their PRODUCTION capacity in that system by 8.",
    source: "byz_agendas",
  },
  {
    alias: "byz_minister_of_policy",
    name: "Minister of Policy",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. At the beginning of the Strategy phase, the owner of this card draws 1 action card. As an action, the owner of this card may discard this card to draw 5 action cards.",
    mapText:
      "At the beginning of the Strategy phase, the owner of this card draws 1 action card. As an action, the owner of this card may discard this card to draw 5 action cards.",
    source: "byz_agendas",
  },
  {
    alias: "byz_miscount_disclosed",
    name: "Miscount Disclosed",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Starting with the Speaker and going clockwise, each player may score one public objective if they fulfill its requirements.",
    text2:
      "Against: Starting with the player to the left of the speaker and going counterclockwise, each player may score one secret objective if they fulfill its requirements.",
    source: "byz_agendas",
  },
  {
    alias: "byz_prophecy_of_ixth",
    name: "Prophecy of Ixth",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card applies +1 to the result of their fighter’s combat rolls. When 1 or more of their fighters make a combat roll, 1 of those units may roll one additional die. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters.",
    mapText:
      "The owner of this card applies +1 to the result of their fighter’s combat rolls. When 1 or more of their fighters make a combat roll, 1 of those units may roll one additional die. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters.",
    source: "byz_agendas",
  },
  {
    alias: "byz_publicize_weapons_schematics",
    name: "Publicize Weapons Schematics",
    category: "agenda",
    type: "Law",
    target:
      "For/Against (When this agenda is revealed, if no player owns a War Sun technology, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "For: All players gain the War Sun technology. All War Suns lose SUSTAIN DAMAGE.",
    text2:
      "Against: Each player that owns a War Sun technology may produce one War Sun from a space dock in their home system, if able.",
    mapText: "All War Suns lose SUSTAIN DAMAGE.",
    source: "byz_agendas",
  },
  {
    alias: "byz_rearmament_agreement",
    name: "Rearmament Agreement",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player places 1 mech from their reinforcements on any planet they control.",
    text2: "Against: Each player destroys all of their mechs.",
    source: "byz_agendas",
  },
  {
    alias: "byz_research_grant_allocation",
    name: "Research Grant Allocation",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology they do not meet, they remove 1 token from their fleet pool and return it to their reinforcements.",
    source: "byz_agendas",
  },
  {
    alias: "byz_research_team",
    name: "Research Team",
    category: "agenda",
    type: "Law",
    target: "Elect Technology Group",
    text1:
      "When researching technology, players may ignore all prerequisites of this group.",
    mapText:
      "When researching technology, players may ignore all prerequisites of this group.",
    source: "byz_agendas",
  },
  {
    alias: "byz_shared_research",
    name: "Shared Research",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player's units can move through nebulae. During movement, players may apply +1 movement to each of their ships that moved out of or through an anomaly.",
    text2:
      "Against: Each player places a command token from their reinforcements in their home system, if able.",
    mapText:
      "Each player's units can move through nebulae. During movement, players may apply +1 movement to each of their ships that moved out of or through an anomaly.",
    source: "byz_agendas",
  },
  {
    alias: "byz_throne_world",
    name: "Throne World",
    category: "agenda",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. The planet's owner gains 1 victory point. Units on this planet cannot use PRODUCTION. When a player gains control of this planet, they gain 1 victory point. When a player loses control of this planet, they lose 1 victory point.",
    mapText:
      "Units on this planet cannot use PRODUCTION. When a player gains control of this planet, they gain 1 victory point. When a player loses control of this planet, they lose 1 victory point.",
    source: "byz_agendas",
  },
  {
    alias: "byz_trade_war",
    name: "Trade War",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1: "For: Each player who voted “For” gains 3 Trade Goods.",
    text2:
      "Against: Each player who voted “For” loses all of their Trade Goods.",
    source: "byz_agendas",
  },
  {
    alias: "byz_war_bonds",
    name: "War Bonds",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: After a player wins a combat against another player, they may remove their command token from the active system and return it to their reinforcements.",
    text2:
      "Against: Each player gives one other player of their choice a Ceasefire from their hand.",
    mapText:
      "After a player wins a combat against another player, they may remove their command token from the active system and return it to their reinforcements.",
    source: "byz_agendas",
  },
  {
    alias: "byz_wormhole_research",
    name: "Wormhole Research",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole.",
    text2:
      "Against: Destroy each PDS in or adjacent to a system that contains a wormhole.",
    source: "byz_agendas",
  },
  {
    alias: "censure",
    name: "Political Censure",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point. The elected player cannot play action cards. If the owner of this card loses this card, they lose 1 victory point.",
    text2: "",
    mapText:
      "Gain this card and 1 victory point. You cannot play action cards. If you lose this card, you lose 1 victory point.",
    source: "pok",
  },
  {
    alias: "checks",
    name: "Checks and Balances",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player chooses a strategy card during the strategy phase, they give that strategy card to another player who does not have 1 (or a player who does not have 2 in a three- or four-player game), if able.",
    text2:
      "Against: Each player readies only 3 of their planets at the end of this agenda phase.",
    forEmoji: "🔄",
    againstEmoji: "ExhaustedPlanet",
    mapText:
      "When a player chooses a strategy card during the strategy phase, they give that strategy card to another player who does not have 1 (2 in 3p and 4p games), if able.",
    source: "pok",
  },
  {
    alias: "cladenstine",
    name: "Clandestine Operations",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player removes 2 command tokens from their command sheet and returns those tokens to their reinforcements.",
    text2:
      "Against: Each player removes 1 command token from their fleet pool and returns that token to their reinforcements.",
    source: "pok",
  },
  {
    alias: "classified",
    name: "Classified Document Leaks",
    type: "Law",
    target:
      "Elect Scored Secret Objective (When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "The elected secret objective becomes a public objective - place it near the other public objectives in the common play area.",
    text2: "",
    mapText:
      "The elected secret objective becomes a public objective. Place it near the other public objectives in the common play area.",
    source: "base",
  },
  {
    alias: "collective_ambition",
    name: "Collective Ambition",
    type: "Directive",
    target: "For/Against",
    text1: "For: Purge all Support for the Throne promissory notes.",
    text2:
      "Against: Players who voted For purge their Alliance promissory note, if able",
    source: "blue_reverie",
  },
  {
    alias: "committee",
    name: "Committee Formation",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. Before players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda.",
    text2: "",
    mapText:
      "Before players vote on an elect-player agenda, you may discard this card to choose a player to be elected. Players do not vote on that agenda.",
    source: "base",
  },
  {
    alias: "conscription",
    name: "Regulated Conscription",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.",
    text2: "Against: No effect.",
    againstEmoji: "🚫",
    mapText:
      "When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.",
    source: "base",
  },
  {
    alias: "constitution",
    name: "New Constitution",
    type: "Directive",
    target: "For/Against",
    text1:
      "(When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.) For: Discard all laws from play. At the start of the next strategy phase, each player exhausts each planet in their home system.",
    text2: "Against: No effect.",
    againstEmoji: "🚫",
    source: "base",
  },
  {
    alias: "conventions",
    name: "Conventions of War",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players cannot use BOMBARDMENT against units that are on cultural planets.",
    text2:
      'Against: Each player that voted "Against" discards all of their action cards.',
    mapText:
      "Players cannot use BOMBARDMENT against units that are on cultural planets.",
    source: "base",
  },
  {
    alias: "core_mining",
    name: "Core Mining",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. Then, destroy 1 infantry on the planet. The resource value of this planet is increased by 2.",
    text2: "",
    source: "base",
  },
  {
    alias: "council_abolishment",
    name: "Council Abolishment",
    type: "Law",
    target: "For/Against",
    text1:
      "For:During the agenda phase, instead of players voting, the speaker randomly determines all agenda outcomes.",
    text2:
      "Against:Ready all planets and reveal 1 agenda from the top of the deck. Players vote on that agenda.",
    mapText:
      "During the agenda phase, instead of players voting, the speaker randomly determines all agenda outcomes.",
    source: "blue_reverie",
  },
  {
    alias: "covert",
    name: "Covert Legislation",
    type: "Directive",
    target:
      "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other players. Instead, the speaker reads the eligible outcomes aloud (for, against, elect Elect Player, etc.). The other Players vote for these outcomes as if they were outcomes of this agenda, without knowing their effects.",
    text1: "",
    text2: "",
    source: "pok",
  },
  {
    alias: "crisis",
    name: "Galactic Crisis Pact",
    type: "Directive",
    target: "Elect Strategy Card",
    text1:
      "Each player may perform the secondary ability of the elected strategy card without spending a command token - command tokens placed by the ability are placed from a player's reinforcements instead.",
    text2: "",
    source: "pok",
  },
  {
    alias: "crown_of_emphidia",
    name: "The Crown of Emphidia",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point. A player gains this card and 1 victory point after they gain control of a planet in the home system of this card's owner. Then, the previous owner of this card loses 1 victory point.",
    text2: "",
    source: "base",
  },
  {
    alias: "crown_of_thalnos",
    name: "The Crown of Thalnos",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. During each combat round, the owner of this card may reroll any number of dice; they must destroy each of their units that did not produce a hit with its reroll.",
    text2: "",
    source: "base",
  },
  {
    alias: "cryypter_abolishment",
    name: "Judicial Abolishment",
    type: "Directive",
    target:
      "Elect Law (When this agenda is revealed, if there are 2 or fewer laws in play, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "Discard the elected law from play. Treat the runner-up as blank until the next agenda phase.",
    text2: "",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_arbiter",
    name: "Imperial Arbiter",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card, then the runner-up places a control token on this card. At the end of the strategy phase, the owner of this card may choose a player who has no control tokens on this card, then discard this card to swap 1 of their strategy cards with 1 of the chosen player's strategy cards.",
    text2: "",
    mapText:
      "At the end of the strategy phase, the owner of this card may choose a player who has no control tokens on this card, then discard this card to swap 1 of their strategy cards with 1 of the chosen player's strategy cards.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_arms_reduction",
    name: "Arms Reduction",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player destroys all but 2 of their dreadnoughts, then destroys 1 of their cruisers or destroyers for each player who cast more votes 'For'.",
    text2:
      "Against: At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty, then the player that cast the fewest votes 'Against' exhausts each of their technologies that has an exhaust ability.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_articles_war",
    name: "Articles of War",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Each player that cast 5 or more votes "For" gains 1 trade good for each of their mechs on the board. All mechs lose their printed abilities except for SUSTAIN DAMAGE.',
    text2:
      'Against: Each player that cast 5 or more votes "For" gains 1 command token or places 1 unit from their reinforcements with a cost of 3 or less with their units.',
    mapText:
      "All mechs lose their printed abilities except for SUSTAIN DAMAGE.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_artifact",
    name: "Ixthian Artifact",
    type: "Directive",
    target:
      "For/Against. When this agenda resolves, the speaker rolls 1 die. If the result is 6-10, the chosen players may research 2 technologies. If the result is 1-5, destroy all units in the chosen system, and each player with units in systems adjacent to the chosen system destroys 3 of their units in each of those systems.",
    text1: "For: Choose all players and Mecatol Rex's system.",
    text2:
      "Against: The player that cast the most votes 'For' is chosen, and choses a system that contains a planet they control.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_censure",
    name: "Political Censure",
    type: "Law",
    target:
      "Elect Player (The runner-up chooses 1 of the following to resolve, then the elected player resolves the other)",
    text1:
      "*Gain this card and 1 victory point: The owner of this card cannot play action cards. If the owner of this card loses this card, they lose 1 victory point.",
    text2:
      "*Discard half your action cards, rounded up, then draw 1 secret objective.",
    mapText:
      "Gain this card and 1 victory point. You cannot play action cards. If you lose this card, you lose 1 victory point.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_checks",
    name: "Checks and Balances",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player chooses a strategy card during the strategy phase, they give that strategy card to another player who has the lowest number of strategy cards, if able.",
    text2:
      "Against: At the end of this agenda phase, each player readies only 1 of their planets for each player that cast fewer votes For.",
    mapText:
      "When a player chooses a strategy card during the strategy phase, they give that strategy card to another player who has the lowest number of strategy cards, if able.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_clandestine",
    name: "Clandestine Operations",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player removes 2 command tokens from their command sheet and returns those tokens to their reinforcements. The player that cast the most votes 'For' draws 2 action cards.",
    text2:
      "Against: Each player removes 1 command token from their fleet pool and returns that token to their reinforcements. The player that cast the most votes 'Against' gains 2 trade goods.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_classified",
    name: "Classified Document Leaks",
    type: "Law",
    target:
      "Elect Scored Secret Objective (When this agenda is revealed, if there are 2 or fewer scored secret objectives, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "The elected secret objective becomes a public objective; place it near the other public objectives in the common play area. The player who owns the runner-up gains 1 command token.",
    text2: "",
    mapText:
      "The elected secret objective becomes a public objective. Place it near the other public objectives in the common play area.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_committee",
    name: "Committee Formation",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card, then the runner-up places a control token on this card. Before players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected, then the player whose control token is on this card chooses a 2nd player to be the runner-up. Players do not vote on that agenda.",
    text2: "",
    mapText:
      "Before players vote on an elect-player agenda, you may discard this card to choose a player to be elected, then the player whose control token is on this card chooses a 2nd player to be the runner-up. Players do not vote on that agenda.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_conscription",
    name: "Regulated Conscription",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Each player that cast 5 or more votes "For" places their control token on this card. When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2. Players with control tokens on this card apply +1 to the result of each of their fighters and infantry’s combat rolls during the first round of combat.',
    text2:
      'Against: Each player that cast 5 or more votes "Against" may ready up to 2 planets they control. Reveal 1 agenda from the top of the deck. Players vote on this agenda.',
    mapText:
      "When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2. Players with control tokens on this card apply +1 to the result of each of their fighters and infantry’s combat rolls during the first round of combat.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_constitution",
    name: "New Constitution",
    type: "Directive",
    target:
      "Elect Player or Against (If more votes are cast for players than 'Against', this agenda resolves 'For')",
    text1:
      "For: Discard all laws from play. The elected player gains the Speaker token, unless the runner-up has it. At the start of the next strategy phase, each player exhausts each planet in their home system.",
    text2:
      "Against: Reveal 1 agenda from the top of the deck. Players vote on this agenda.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_conventions",
    name: "Conventions of War",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player that cast the most votes "For" attaches this card to a planet they control with a planet trait. Players cannot use BOMBARDMENT against units that are on planets with the same trait as this planet.',
    text2:
      'Against: Each player that voted "Against" chooses 1 action card from their hand for each player that cast fewer votes Against, then discards the rest.',
    mapText:
      "Players cannot use BOMBARDMENT against units that are on planets with the same trait as this planet.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_crisis",
    name: "Galactic Crisis Pact",
    type: "Directive",
    target: "Elect Strategy Card",
    text1:
      "Each player may perform the secondary ability of the elected strategy card without spending a command token - command tokens placed by the ability are placed from a player's reinforcements instead. Place 2 trade goods on the runner-up.",
    text2: "",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_defense_act",
    name: "Homeland Defense Act",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player can have any number of PDS units on planets they control. Each player that cast 5 or more votes “For” may place 1 PDS on a planet they control.",
    text2:
      'Against: Each player destroys 1 PDS owned by a player that cast fewer votes "Against".',
    mapText:
      "Each player can have any number of PDS units on planets they control.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_disarmamament",
    name: "Compensated Disarmament",
    type: "Directive",
    target: "Elect 2 Planets controlled by different players",
    text1:
      "Destroy each ground force on the elected planets. For each unit that was destroyed, the player who controls that planet gains 1 trade good.",
    text2: "",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_economic_equality",
    name: "Economic Equality",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player returns all of their trade goods to the supply. Then, each player gains 1 trade good for every 7 votes cast 'For'.",
    text2:
      "Against: Each player loses 1 trade good for each player that did not cast 5 or more votes against.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_execution",
    name: "Public Execution",
    type: "Directive",
    target:
      "Elect Player (The runner-up resolves one of the following, then the elected player resolves the other)",
    text1:
      "*Discard all of your action cards. If you have the speaker token, give it to the player on your left. You cannot vote, play action cards, or use faction abilities during this agenda phase.",
    text2:
      "*Reveal all your action cards. You cannot vote, play action cards, or use faction abilities during this agenda phase.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_grant_reallocation",
    name: "Research Grant Reallocation",
    type: "Directive",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain a technology. Then, for each prerequisite on that technology, remove 1 token from your fleet pool and return it to your reinforcements.",
    text2:
      "*You may spend a command token from your fleet pool to gain 1 technology with no prerequisites owned by another player.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_incentive",
    name: "Incentive Program",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The player that cast the most votes 'For' draws 2 stage I public objectives from the deck, chooses 1 to reveal and place near the public objectives, and discards the other.",
    text2:
      "Against: The player with the fewest victory points draws 2 stage II public objectives from the deck, chooses 1 to reveal and place near the public objectives, and discards the other.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_antiquities",
    name: "Minister of Antiquities",
    type: "Directive",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1: "*Gain a relic",
    text2:
      "*Search an exploration deck that matches a planet you control for a relic fragment, gain it, then shuffle the deck.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_commerce",
    name: "Minister of Commerce",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "* Gain this card: After the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor.",
    text2: "* Gain 3 trade goods",
    mapText:
      "After you replenish commodities, gain 1 trade good for each player that is your neighbor.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_exploration",
    name: "Minister of Exploration",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain this card: When the owner of this card gains control of a planet, they gain 1 trade good.",
    text2: "*Explore 1 planet you control",
    mapText: "When you gain control of a planet, you gain 1 trade good.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_industry",
    name: "Minister of Industry",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain this card: When the owner of this card places a space dock in a system, his units in that system may use their PRODUCTION abilities. When the owner of this card places a PDS in a system, he may produce 1 unit in that system.",
    text2: "*Place 1 structure on a planet you control",
    mapText:
      "When you place a space dock in a system, your units in that system may use their PRODUCTION abilities. When you place a PDS in a system, you may produce 1 unit in that system.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_peace",
    name: "Minister of Peace",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain this card: After a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card - immediately end the active player's turn.",
    text2:
      "*Choose a system containing a planet you control. Each other non-elected player places a command token from their reinforcements in that system.",
    mapText:
      "After a player activates a system that contains 1 or more of a different player's units, you may discard this card - immediately end the active player's turn.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_policy",
    name: "Minister of Policy",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain this card: At the end of the status phase, the owner of this card draws 1 action card.",
    text2: "*Draw 2 action cards.",
    mapText:
      "The owner of this card can have 3 additional action cards. At the end of the status phase, you draw 1 action card.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_sciences",
    name: "Minister of Sciences",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain this card: The owner of this card does not need to spend resources or influence to research technology.",
    text2:
      "*You may spend a token from your strategy pool to research 1 technology",
    mapText:
      "You do not need to spend resources or influence to research technology.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_minister_war",
    name: "Minister of War",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain this card: The owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements - then they may perform 1 additional action.",
    text2: "*Use the PRODUCTION ability of 1 of your units.",
    mapText:
      "Discard this card after performing an action to return 1 of your command counters from the game board to your reinforcements. then you may perform 1 additional action.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_miscount",
    name: "Miscount Disclosed",
    type: "Directive",
    target:
      "Elect Law (When this agenda is revealed, if there are fewer than 2 laws in play, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "Vote on the elected law as if it were just revealed from the top of the deck.",
    text2: "",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_mutiny",
    name: "Mutiny",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player that voted "For" gains 1 victory point. The player who cast the most votes "For" gains the speaker token.',
    text2:
      'Against: Each player that voted "For" loses 1 victory point. The player who cast the most votes "For" cannot vote, play action cards, or use faction abilities during this agenda phase.',
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_nexus",
    name: "Nexus Sovereignty",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Alpha and beta wormholes in the wormhole nexus have no effect during movement. The player that cast the most votes "For" places their control token on this card. Players with control tokens on this card apply +2 to each of their units’ combat rolls in the wormhole nexus.',
    text2:
      'Against: The player that cast the most votes "Against" places a gamma wormhole token in a non-home system.',
    mapText:
      "Alpha and beta wormholes in the wormhole nexus have no effect during movement. Players with control tokens on this card apply +2 to each of their units’ combat rolls in the wormhole nexus.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_plowshares",
    name: "Swords to Plowshares",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed, plus 1 for each other player that cast fewer votes "For".',
    text2:
      'Against: Each player places 1 infantry from their reinforcements on each planet they control, then places 1 infantry from their reinforcements on a planet they control in their home system for each other player that cast fewer votes "Against".',
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_prophecy",
    name: "Prophecy of Ixth",
    type: "Law",
    target:
      "Elect Player (The elected player chooses 1 of the following to resolve, then the runner-up resolves the other)",
    text1:
      "*Gain this card: The owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters.",
    text2:
      "*Place 1 fighter from your reinforcements in any number of systems that contains 1 or more of your space docks or ships and no other player’s ships.",
    mapText:
      "Apply +1 to the result of your fighter's combat rolls. When you use PRODUCTION, discard this card unless you produce 2 or more fighters.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_rearmament",
    name: "Rearmament Agreement",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player places 1 mech from their reinforcements on a planet they control in their home system for every 5 votes cast "For" by that player.',
    text2:
      "Against: Each player chooses 1 of their mechs for each player that cast fewer votes, and replaces the rest with 1 infantry from their reinforcements.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_redistribution",
    name: "Colonial Redistribution",
    type: "Directive",
    target:
      "Elect 2 Non-Home Planets Other Than Mecatol Rex controlled by different players",
    text1:
      "Destroy each unit on the elected planets. Then, for each planet, the player who controls that planet chooses 1 player with the fewest victory points; that player gains control of that planet and may place 1 infantry from their reinforcements on that planet.",
    text2: "",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_regulations",
    name: "Fleet Regulations",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player cannot have more than 4 tokens in their fleet pool. Players that cast 5 or more votes “For” may redistribute any command tokens that would be lost when resolving this law.",
    text2:
      "Against: Each player that cast 5 or more votes “Against” places 1 command token from their reinforcements in their fleet pool.",
    mapText: "Each player cannot have more than 4 tokens in their fleet pool.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_rep_govt",
    name: "Representative Government",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Each player that cast 5 or more votes "For" places their control token on this card. Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead (if that player’s control token is on this card, this counts as casting 5 votes for game effects). Players cannot cast additional votes.',
    text2:
      'Against: At the start of the next strategy phase, each player exhausts 1 cultural planet they control for each player that cast fewer votes "Against".',
    mapText:
      "Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead (if that player’s control token is on this card, this counts as casting 5 votes for game effects). Players cannot cast additional votes.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_revolution",
    name: "Anti-Intellectual Revolution",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Each player that cast 5 or more votes "For" places a control token on this card. After a player researches a technology, that player must destroy 1 of their non-fighter ships - that ship must have a total cost at least equal to the number of tokens on this card, if able.',
    text2:
      "Against: At the start of the next strategy phase, each player exhausts 1 planet for each technology that they own, reduced by 1 for each player that cast fewer votes For.",
    mapText:
      "After a player researches a technology, that player must destroy 1 of their non-fighter ships - that ship must have a total cost at least equal to the number of tokens on this card, if able.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_sanctions",
    name: "Executive Sanctions",
    type: "Law",
    target: "For/Against",
    text1:
      'For: The player that cast the most votes "For" places their control token on this card. Each player can have a maximum of 3 action cards in their hand. When a player discards an action card, a player may remove their control token from this card to take that action card.',
    text2:
      'Against: Each player discards 1 random action card from their hand. The player that cast the most votes "Against" draws 1 action card.',
    mapText:
      "Each player can have a maximum of 3 action cards in their hand. When a player discards an action card, a player may remove their control token from this card to take that action card.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_schematics",
    name: "Publicize Weapon Schematics",
    type: "Law",
    target: "For/Against",
    text1:
      'For: If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies, and the player that cast the most votes "For" may gain their war sun technology. All war suns lose SUSTAIN DAMAGE.',
    text2:
      'Against: Each player that owns a war sun technology discards 1 action card for each player that cast fewer votes "Against".',
    mapText:
      "If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_secret",
    name: "Archived Secret",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player draws 2 secret objectives, chooses 1 to keep, and gives the other card to the runner-up.",
    text2: "",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_seed_empire",
    name: "Seed of an Empire",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The player with the most victory points gains 1 victory point. The player that cast the most votes “Against” draws 1 secret objective.",
    text2:
      "Against: The player with the fewest victory points gains 1 victory point. The player that cast the most votes “For” draws 1 secret objective.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_shared_research",
    name: "Shared Research",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Each player\'s units can move through nebulae and do not need to roll for gravity rifts. Each player that cast 5 or more votes "For" may gain their Antimass Deflectors technology.',
    text2:
      "Against: Each player places a command token from their reinforcements in their home system, if able - players that cast 5 or more votes place the token from their reinforcements instead.",
    mapText:
      "Each player's units can move through nebulae and do not need to roll for gravity rifts.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_standardization",
    name: "Armed Forces Standardization",
    type: "Directive",
    target:
      "Elect Player (The runner-up resolves one of the following, then the elected player resolves the other)",
    text1:
      "*Gain command tokens so that you have 3 tokens each in your tactic and fleet pools, and 2 tokens in your strategy pool, losing any excess tokens.",
    text2:
      "*Remove 1 command token from your pool with the most tokens and place it in your pool with the least tokens.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_travel_ban",
    name: "Enforced Travel Ban",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Alpha and beta wormholes have no effect during movement. In order of most votes cast "For", each player may place 1 cruiser from their reinforcements in a system that contains a wormhole and no other player’s ships.',
    text2:
      "Against: Each player chooses 1 of their PDS in or adjacent to a system that contains a wormhole for each player that cast fewer votes, then destroys the rest.",
    mapText: "Alpha and beta wormholes have no effect during movement.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_unconventional",
    name: "Unconventional Measures",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player that voted "For" draws 1 action card for each player that cast fewer votes For.',
    text2:
      'Against: Each player that voted "For" discards 1 action card for every 5 votes cast by that player.',
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_warrant",
    name: "Search Warrant",
    type: "Law",
    target:
      "Elect Player (The runner-up chooses 1 of the following to resolve, then the elected player resolves the other)",
    text1:
      "*Gain this card and draws 2 secret objectives. The owner of this card plays with their secret objectives revealed.",
    text2: "*Reveal your secret objectives, then draw 1 secret objective",
    mapText: "You play with your secret objectives revealed.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_wormhole_recon",
    name: "Wormhole Reconstruction",
    type: "Law",
    target: "For/Against",
    text1:
      'For: Each player that cast 5 or more votes "For" places their control token on this card. All systems that contain an alpha or beta wormhole are adjacent to each other, and if your control token is on this card, other players cannot use SPACE CANNON against your ships in these systems.',
    text2:
      "Against: Each player places a command token from their reinforcements in 1 system that contains a wormhole and 1 or more of their ships for each player that cast more votes.",
    mapText:
      "All systems that contain either an alpha or beta wormhole are adjacent to each other, and if your control token is on this card, other players cannot use SPACE CANNON against your ships in these systems.",
    source: "voices_of_the_council",
  },
  {
    alias: "cryypter_wormhole_research",
    name: "Wormhole Research",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology, ignoring 1 prerequisite for every 5 votes cast by that player. Then, destroy all ships in systems that contain an alpha or beta wormhole.",
    text2:
      'Against: Each player that voted "Against" removes 1 command token from their command sheet and returns it to their reinforcements.',
    source: "voices_of_the_council",
  },
  {
    alias: "defense_act",
    name: "Homeland Defense Act",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player can have any number of PDS units on planets they control.",
    text2: "Against: Each player destroys 1 of their PDS units.",
    forEmoji: "♾️",
    againstEmoji: "💥",
    mapText:
      "Each player can have any number of PDS units on planets they control.",
    source: "base",
  },
  {
    alias: "demilitarized_zone",
    name: "Demilitarized Zone",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. Then, destroy all units on that planet. Player's units cannot land, be produced, or be placed on this planet.",
    text2: "",
    source: "base",
  },
  {
    alias: "disarmamament",
    name: "Compensated Disarmament",
    type: "Directive",
    target: "Elect Planet",
    text1:
      "Destroy each ground force on the elected planet. For each unit that was destroyed, the player who control that planet gains 1 trade good.",
    text2: "",
    source: "base",
  },
  {
    alias: "economic_equality",
    name: "Economic Equality",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods.",
    text2:
      "Against: Each player returns all of their trade goods to the supply.",
    forEmoji: "5️⃣",
    againstEmoji: "0️⃣",
    source: "base",
  },
  {
    alias: "execution",
    name: "Public Execution",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their left. The elected player cannot vote on any agendas during this agenda phase.",
    text2: "",
    source: "base",
  },
  {
    alias: "galactic_fair",
    name: "Galactic Fair",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player may research 1 technology that has no prerequisites.",
    text2:
      'Against: Each player who voted "For" discards 1 of their technologies that has the fewest prerequisites.',
    source: "blue_reverie",
  },
  {
    alias: "galactic_sanctions",
    name: "Galactic Sanctions",
    type: "Law",
    target: "For/Against",
    text1:
      "For:Initiative Order is reversed, and begins with the player who has the highest numbered strategy card.",
    text2:
      "Against:Each player who voted For may resolve the secondary ability of 1 strategy card of their choice.",
    mapText: "Initiative Order is reversed.",
    source: "blue_reverie",
  },
  {
    alias: "grant_reallocation",
    name: "Research Grant Reallocation",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology, they remove 1 token from their fleet pool and return it to their reinforcements.",
    text2: "",
    source: "pok",
  },
  {
    alias: "holy_planet_of_ixth",
    name: "Holy Planet of Ixth",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. The planet's owner gains 1 victory point. Units on this planet cannot use PRODUCTION. When a player gains control of this planet, they gain 1 victory point. When a player loses control of this planet, they lose 1 victory point.",
    text2: "",
    source: "base",
  },
  {
    alias: "imperial_referendum",
    name: "Imperial Referendum",
    type: "Directive",
    target: "For/Against",
    text1:
      "For:Each player who has the fewest victory points gains 1 command token.",
    text2:
      "Against:Each player who does not have the most victory points loses 1 command token from their command sheet.",
    source: "blue_reverie",
  },
  {
    alias: "imperialist_edict",
    name: "Imperialist Edict",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player is eliminated, all remaining players gain 1 victory point.",
    text2:
      "Against: Each player places 1 command token from their fleet pool in the Mecatol Rex system.",
    mapText:
      "When a player is eliminated, all remaining players gain 1 victory point.",
    source: "blue_reverie",
  },
  {
    alias: "incentive",
    name: "Incentive Program",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Draw and reveal 1 stage I public objective from the deck and place it near the public objectives.",
    text2:
      "Against: Draw and reveal 1 stage II public from the deck and place it near the public objectives.",
    forEmoji: "Public1alt",
    againstEmoji: "Public2alt",
    source: "base",
  },
  {
    alias: "invalidated_patent",
    name: "Invalidated Patent",
    type: "Directive",
    target: "Elect a non-faction echnology",
    text1: "Each player gains the elected technology, if able",
    source: "blue_reverie",
  },
  {
    alias: "isolationist_movement",
    name: "Isolationist Movement",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players are not neighbors with another player unless they have units in the same system as that player.",
    text2:
      "Against: Each player who voted For may produce 1 unit in a system that contains 1 or more of their ships and a planet they control.",
    mapText:
      "Players are not neighbors with another player unless they have units in the same system as that player.",
    source: "blue_reverie",
  },
  {
    alias: "little_omega_abolishment",
    name: "Judicial Abolishment ω",
    type: "Directive",
    target:
      "Elect Law (When this agenda is revealed, if there are 1 or fewer laws in play, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "Discard the elected law from play. The player who cast the most votes for the elected law gains the speaker token; the speaker breaks ties.",
    text2: "",
    source: "little_omega",
  },
  {
    alias: "little_omega_arms_reduction",
    name: "Arms Reduction ω",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player destroys 1 of their dreadnoughts, cruisers, or destroyers in each system and gains trade goods equal to the combined cost of those ships.",
    text2:
      'Against: The player who cast the most votes "Against" may research a unit upgrade technology; the speaker breaks ties. At the start of the next strategy phase, exhaust each planet that has a technology specialty.',
    source: "little_omega",
  },
  {
    alias: "little_omega_articles_war",
    name: "Articles of War ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: All mechs lose their printed abilities except for SUSTAIN DAMAGE.",
    text2:
      "Against: Each player removes 4 of their infantry from the game board.",
    mapText:
      "All mechs lose their printed abilities except for SUSTAIN DAMAGE.",
    source: "little_omega",
  },
  {
    alias: "little_omega_artifact",
    name: "Ixthian Artifact ω",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units on Mecatol Rex; then, each player with units in systems adjacent to Mecatol Rex destroys 3 of their units in each of those systems.",
    text2: "Against: Each player draws 1 secret objective.",
    source: "little_omega",
  },
  {
    alias: "little_omega_checks",
    name: "Checks and Balances ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players choose strategy cards during the strategy phase in order from the player with the fewest victory points to the player with the most; on a tie, the order for those players starts with the speaker and proceeds clockwise.",
    text2:
      "Against: During the next strategy phase, when a player chooses a strategy card, they give that strategy card to another player who does not have one, if able.",
    mapText:
      "Players choose strategy cards in order of fewest to most victory points; on a tie, start with the speaker and proceed clockwise.",
    source: "little_omega",
  },
  {
    alias: "little_omega_cladenstine",
    name: "Clandestine Operations ω",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" gains the speaker token; the speaker breaks ties. Then, each other player returns 1 command token from their command sheet to their reinforcements.',
    text2:
      "Against: Each player destroys 1 of their space docks in a non-home system, if able; otherwise, that player destroys 2 of their non-fighter ships.",
    source: "little_omega",
  },
  {
    alias: "little_omega_classified",
    name: "Classified Document Leaks ω",
    type: "Law",
    target:
      "Elect Scored Secret Objective (When this agenda is revealed, if there are 1 or fewer scored secret objectives, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "The elected secret objective becomes a public objective; place it near the other public objectives in the common play area.",
    text2: "",
    mapText:
      "The elected secret objective becomes a public objective; place it near the other public objectives in the common play area.",
    source: "little_omega",
  },
  {
    alias: "little_omega_committee",
    name: "Committee Formation ω",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. Before players vote on an agenda, the owner of this card may discard this card to choose an outcome to be resolved, as if each player had cast 1 vote for that outcome.",
    text2: "",
    mapText:
      "Before players vote, you may discard this card to choose an outcome to be resolved, as if each player had cast 1 vote for that outcome.",
    source: "little_omega",
  },
  {
    alias: "little_omega_conscription",
    name: "Regulated Conscription ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.",
    text2:
      "Against: At the start of the next strategy phase, each player exhausts 1 planet in each system that contains a combined total of 4 or more of their fighters and infantry.",
    mapText:
      "When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.",
    source: "little_omega",
  },
  {
    alias: "little_omega_constitution",
    name: "New Constitution ω",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: The player who cast the most votes "For" gains the speaker token; the speaker breaks ties. Then, discard all laws from play.',
    text2:
      'Against: During the next strategy phase, players cannot choose the "Politics" strategy card, if they have another choice.',
    source: "little_omega",
  },
  {
    alias: "little_omega_conventions",
    name: "Conventions of War ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: At the start of an invasion, players must discard 1 random action card from their hand to use BOMBARDMENT during that invasion.",
    text2:
      'Against: Each player who voted "Against" or abstained discards 1 random action card from their hand.',
    mapText:
      "Players cannot use BOMBARDMENT against units that are on planets that have a trait.",
    source: "little_omega",
  },
  {
    alias: "little_omega_covert_legislation",
    name: "Covert Legislation ω",
    type: "Directive",
    target:
      "When this agenda is revealed, the speaker looks at the top card of the agenda deck and reads the eligible outcomes aloud (for, against, elect player, etc.), but not the effects; treat those outcomes as if they were outcomes of this agenda and discard that agenda when this agenda is discarded. The speaker votes first on this agenda and, if able, must cast at least 1 vote.",
    text1: "",
    text2: "",
    source: "little_omega",
  },
  {
    alias: "little_omega_defense_act",
    name: "Homeland Defense Act ω",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: For each planet they control in their home system, each player may place 1 PDS from their reinforcements on that planet.",
    text2:
      'Against: Each player may place 1 command token from their reinforcements in their strategy pool; they may place 1 additional token if they cast 5 or more votes "Against".',
    source: "little_omega",
  },
  {
    alias: "little_omega_economic_equality",
    name: "Economic Equality ω",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player returns all of their trade goods to the supply. Then, each player gains 4 trade goods.",
    text2:
      'Against: Each player who cast votes "Against" gains 1 trade good. Then, the player who cast the most votes "Against" gains 4 trade goods; the speaker breaks ties.',
    source: "little_omega",
  },
  {
    alias: "little_omega_execution",
    name: "Public Execution ω",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player discards 1 random action card from their hand for each other player that voted for them. If they have the speaker token, they give it to another player who cast the most votes for them. During this agenda phase, they cannot vote, play action cards, or use faction abilities.",
    text2: "",
    source: "little_omega",
  },
  {
    alias: "little_omega_grant_reallocation",
    name: "Research Grant Reallocation ω",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player researches 1 technology; they may ignore 1 prerequisite for each command token from their strategy pool they return to their reinforcements.",
    text2: "",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_antiquities",
    name: "Minister of Antiquities ω",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card. After the owner of this card resolves the primary or secondary ability of the "Imperial" strategy card, they look at the top 3 cards of the relic deck and place each card on top of the deck in any order. When the owner of this card ends their turn, they may discard this card to gain 1 relic.',
    text2: "",
    mapText:
      "After you resolve Imperial, look at the top 3 of the relic deck and place each on top in any order. When you end your turn, you may discard this card to gain 1 relic.",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_commerce",
    name: "Minister of Commerce ω",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card. After the owner of this card resolves the primary or secondary ability of the "Trade" strategy card, they gain 4 trade goods. When the owner of this card ends their turn, they may discard this card to replenish their commodities or to convert their commodities to trade goods.',
    text2: "",
    mapText:
      "After you resolve Trade, gain 4 trade goods. When you end your turn, you may discard this card to replenish or convert your commodities.",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_exploration",
    name: "Minister of Exploration ω",
    type: "Law",
    target: "Elect Player",
    text1:
      'After the owner of this card gains command tokens while resolving the primary or secondary ability of the "Leadership" strategy card, they explore 1 of their planets. When the owner of this card explores, they may discard this card to draw 3 additional cards; they choose 1 to resolve and discard the rest.',
    text2: "",
    mapText:
      "After gaining command tokens from Leadership, explore a planet. Before you draw from exploration, you may discard this to draw 3 additional cards and resolve 1.",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_industry",
    name: "Minister of Industry ω",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card. After the owner of this card resolves the primary or secondary ability of the "Construction" strategy card, they may place 1 structure on a planet they control. When the owner of this card ends their turn, they may discard this card to choose 1 system; they use the PRODUCTION abilities of each of their units in that system.',
    text2: "",
    mapText:
      "After resolving Construction, place 1 structure. At the end of your turn, you may discard this to resolve PRODUCTION in 1 system.",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_peace",
    name: "Minister of Peace ω",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. After the owner of this card resolves the primary or secondary ability of the \"Diplomacy\" strategy card, they ready 1 planet they control. After a player activates a system that contains a different player's units, the owner of this card may discard this card to end the active player's turn.",
    text2: "",
    mapText:
      "After resolving Diplomacy, ready 1 planet you control. After a player activates another player's units, discard this card to end their turn.",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_policy",
    name: "Minister of Policy ω",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card. When the owner of this card resolves the primary or secondary ability of the "Politics" strategy card, they draw 2 additional action cards. When another player plays an action card, the owner of this card may discard this card to cancel that action card.',
    text2: "",
    mapText:
      "After you resolve Politics, draw 2 additional action cards. Discard this card to cancel an action card.",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_sciences",
    name: "Minister of Sciences ω",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card. When the owner of this card resolves the primary or secondary ability of the "Technology" strategy card, they do not need to spend resources to research technology. When the owner of this card ends their turn, they may discard this card to research 1 technology.',
    text2: "",
    mapText:
      "After you resolve Technology, you do not need to spend resources. When you end your turn, you may discard this card to research 1 technology.",
    source: "little_omega",
  },
  {
    alias: "little_omega_minister_war",
    name: "Minister of War ω",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card. After the owner of this card resolves the primary or secondary ability of the "Warfare" strategy card, they gain 1 command token. The owner of this card may discard this card after they perform an action to remove 1 of their command tokens from the game board and perform a tactical action.',
    text2: "",
    mapText:
      "After you resolve Warfare, gain 1 command token. You may discard this card after performing an action to remove 1 command token from the game board and perform a tactical action.",
    source: "little_omega",
  },
  {
    alias: "little_omega_miscount",
    name: "Miscount Disclosed ω",
    type: "Directive",
    target:
      "Elect Law (When this agenda is revealed, if the speaker chooses to, or if there are no laws in play, discard this card and reveal another agenda from the top of the deck.)\n",
    text1:
      "The speaker chooses 1 law in play or in the discard pile. Then, players vote on that law as if it were just revealed from the top of the deck.",
    text2: "",
    source: "little_omega",
  },
  {
    alias: "little_omega_nexus",
    name: "Nexus Sovereignty ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Alpha and beta wormholes in the wormhole nexus have no effect during movement. The player who controls Mallice may allow a player to ignore this law.",
    text2: "Against: Place a gamma wormhole token in the Mecatol Rex system.",
    mapText:
      "Alpha and beta wormholes in the wormhole nexus have no effect during movement. The player who controls Mallice may allow a player to ignore this law.",
    source: "little_omega",
  },
  {
    alias: "little_omega_prophecy",
    name: "Prophecy of Ixth ω",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card applies +1 to the result of their fighters' combat rolls and may produce 1 additional fighter for their cost; these additional units do not count against their PRODUCTION limit.",
    text2: "",
    mapText:
      "+1 to fighter combat rolls. Produce 1 additional fighter for their cost that doesn't count against PRODUCTION limits.",
    source: "little_omega",
  },
  {
    alias: "little_omega_rearmament",
    name: "Rearmament Agreement ω",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player with the fewest victory points places 1 infantry from their reinforcements on each planet they control.",
    text2:
      'Against: Each player who cast votes "Against" or abstained gives 1 promissory note from their hand to another player with the fewest victory.',
    source: "little_omega",
  },
  {
    alias: "little_omega_redistribution",
    name: "Colonial Redistribution ω",
    type: "Directive",
    target: "Elect Non-Home Planet",
    text1:
      "Remove each unit on the elected planet. The player who controls that planet places those units on 1 or more planets they control, if able; otherwise, they return that unit to their reinforcements. Then, that player chooses another player with the fewest victory points; the chosen player gains control of the elected planet and places 3 infantry from their reinforcements on it. [Note: You always choose another player, even if you are the only one with the fewest victory points.]",
    text2: "",
    source: "little_omega",
  },
  {
    alias: "little_omega_regulations",
    name: "Fleet Regulations ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player cannot have more than 4 tokens in their fleet pool.",
    text2:
      'Against: The player that cast the most votes "Against" places 2 command tokens from their reinforcements in their fleet pool; the speaker breaks ties.',
    mapText: "Each player cannot have more than 4 tokens in their fleet pool.",
    source: "little_omega",
  },
  {
    alias: "little_omega_rep_govt",
    name: "Representative Government ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead. Players cannot cast additional votes.",
    text2:
      'Against: At the start of the next strategy phase, each player that voted "Against" or abstained exhausts all of their cultural planets.',
    mapText:
      "Players cannot exhaust planets to cast votes during the agenda phase. each player may cast 1 vote on each agenda instead. Players cannot cast additional votes.",
    source: "little_omega",
  },
  {
    alias: "little_omega_revolution",
    name: "Anti-Intellectual Revolution ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Technologies with prerequisites require 1 additional prerequisite, matching any they already have. When a player would research a technology, they may gain 3 command tokens instead.",
    text2:
      "Against: Players return 1 of their non-unit upgrade, non-faction technologies that has the most prerequisites to their technology deck.",
    mapText:
      "Technologies require 1 additional prerequisite, matching any they already have.",
    source: "little_omega",
  },
  {
    alias: "little_omega_sanctions",
    name: "Executive Sanctions ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player can have a maximum of 5 action cards in their hand.",
    text2:
      "Against: Each player with the fewest victory points draws 2 action cards. Each other player discards 1 random action card.",
    mapText: "Each player can have a maximum of 5 action cards in their hand.",
    source: "little_omega",
  },
  {
    alias: "little_omega_schematics",
    name: "Publicize Weapon Schematics ω",
    type: "Directive",
    target: "Elect Non-Flagship, Non-Mech Unit",
    text1:
      "Each player who owns a unit upgrade technology of the same type as the elected unit places 2 command tokens from their reinforcements in their strategy pool. Then, each other player gains a unit upgrade technology of the same type as the elected unit.",
    text2: "",
    source: "little_omega",
  },
  {
    alias: "little_omega_shared_research",
    name: "Shared Research ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player's ships move, they may ignore the effect of any anomaly that does not contain a frontier token.",
    text2:
      "Against: Each player who has ships in a non-home anomaly may research 1 technology. Then, destroy all ships that do not have SUSTAIN DAMAGE in each non-home anomaly.",
    mapText:
      "Players may ignore the effects of anomalies that do not contain a frontier token during movement.",
    source: "little_omega",
  },
  {
    alias: "little_omega_travel_ban",
    name: "Enforced Travel Ban ω",
    type: "Law",
    target: "For/Against",
    text1: "For: Alpha and beta wormholes have no effect during movement.",
    text2:
      "Against: Each player destroys 1 of their PDS that is in or adjacent to a system that contains an alpha or beta wormhole.",
    mapText: "Alpha and beta wormholes have no effect during movement.",
    source: "little_omega",
  },
  {
    alias: "little_omega_unconventional",
    name: "Unconventional Measures ω",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player draws 2 action cards; they draw 1 additional action card if they cast 5 or more votes "For".',
    text2:
      "Against: Each player may discard 2 action cards to gain 1 command token; they may repeat this effect any number of times.",
    source: "little_omega",
  },
  {
    alias: "little_omega_wormhole_recon",
    name: "Wormhole Reconstruction ω",
    type: "Law",
    target: "For/Against",
    text1:
      "For: All systems that contain a non-delta wormhole are adjacent to each other.",
    text2:
      "Against: Each player places 1 command token from their reinforcements in each system that contains a non-delta wormhole and their units. Then, each player may place 1 structure on 1 planet they control in each of those systems.",
    mapText:
      "All systems that contain a non-delta wormhole are adjacent to each other.",
    source: "little_omega",
  },
  {
    alias: "little_omega_wormhole_research",
    name: "Wormhole Research ω",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player who has ships in a system that contains a non-delta wormhole may research 1 technology. Then, destroy all ships that do not have SUSTAIN DAMAGE in each system that contains a non-delta wormhole.",
    text2:
      "Against: Each player may spend 1 strategy token to research 1 technology that has no prerequisites.",
    source: "little_omega",
  },
  {
    alias: "miltymod_artifact",
    name: "Ixthian Artifact",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their own units in each of those systems.",
    text2:
      "Against: Place this agenda on top of the agenda deck and shuffle the agenda deck.",
    source: "miltymod",
  },
  {
    alias: "miltymod_conscription",
    name: "Regulated Conscription",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.",
    text2:
      "Against: Each player removes 1 infantry from a planet they control.",
    mapText:
      "When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.",
    source: "miltymod",
  },
  {
    alias: "miltymod_constitution",
    name: "New Constitution",
    type: "Directive",
    target:
      "For/Against (When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.)",
    text1:
      "For: Discard all laws from play. At the start of the next strategy phase, each player exhausts each planet in their home system.",
    text2:
      "Against: Reveal another agenda from the top of the deck and vote on it.",
    source: "miltymod",
  },
  {
    alias: "miltymod_crown_of_emphidia",
    name: "The Crown of Emphidia",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point.\n \n A player gains this card and 1 victory point after he gains control of a planet in the home system of this card's owner.\n \n If the owner of this card loses this card, they lose 1 victory point.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_crown_of_thalnos",
    name: "The Crown of Thalnos",
    type: "Law",
    target: "Elect Player",
    text1:
      "The owner of this card applies +1 to the result of their combat rolls. During each combat round, the owner of this card may reroll any number of combat roll dice; any units that reroll dice but do not produce at least 1 hit are destroyed.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_execution",
    name: "Public Execution",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their right. The elected player cannot vote on any agendas during this agenda phase.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_holy_planet_of_ixth",
    name: "Holy Planet of Ixth",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet. Units on this planet cannot use PRODUCTION. When a player gains control of this card, they gain 1 victory point. When a player loses control of this card, they lose 1 victory point.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_minister_policy",
    name: "Minister of Policy",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card.\n \n When you draw 1 or more action cards, draw 1 additional action card.",
    text2: "",
    mapText:
      "When you draw 1 or more action cards, draw 1 additional action card.",
    source: "miltymod",
  },
  {
    alias: "miltymod_rt_biotic",
    name: "Research Team: Biotic",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player may immediately research a technology, ignoring any number of green prerequisites.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_rt_cybernetic",
    name: "Research Team: Cybernetic",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player may immediately research a technology, ignoring any number of yellow prerequisites.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_rt_propulsion",
    name: "Research Team: Propulsion",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player may immediately research a technology, ignoring any number of blue prerequisites.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_rt_warfare",
    name: "Research Team: Warfare",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player may immediately research a technology, ignoring any number of red prerequisites.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_shard_of_the_throne",
    name: "Shard of the Throne",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point.\n \n A player gains this card and 1 victory point when they win a combat against the owner of this card.\n \n If the owner of this card loses this card, they lose 1 victory point.",
    text2: "",
    source: "miltymod",
  },
  {
    alias: "miltymod_travel_ban",
    name: "Enforced Travel Ban",
    type: "Law",
    target: "For/Against",
    text1: "For: Non-delta wormholes have no effect during movement.",
    text2:
      "Against: Each player destroys 1 PDS in or adjacent to a system that contains a wormhole.",
    mapText: "Alpha and beta wormholes have no effect during movement.",
    source: "miltymod",
  },
  {
    alias: "miltymod_wormhole_recon",
    name: "Wormhole Reconstruction",
    type: "Law",
    target: "For/Against",
    text1:
      "For: All systems that contain a non-delta wormhole are adjacent to each other.",
    text2:
      "Against: Each player places a command token from their reinforcements in each system that contains a non-delta wormhole and 1 or more of their ships.",
    mapText:
      "All systems that contain either a non-delta wormhole are adjacent to each other.",
    source: "miltymod",
  },
  {
    alias: "miltymod_wormhole_research",
    name: "Wormhole Research",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, each player with ships in a system with a non-delta wormhole destroys 3 of their ships in each of those systems.",
    text2:
      'Against: Each player that voted "Against" removes 1 command token from their command sheet and returns it to their reinforcements.',
    source: "miltymod",
  },
  {
    alias: "minister_antiquities",
    name: "Minister of Antiquities",
    type: "Directive",
    target: "Elect Player",
    text1: "The elected player gains 1 relic.",
    text2: "",
    source: "pok",
  },
  {
    alias: "minister_commrece",
    name: "Minister of Commerce",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. After the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor.",
    text2: "",
    mapText:
      "After you replenish commodities, you gain 1 trade good for each player that is your neighbor.",
    source: "base",
  },
  {
    alias: "minister_exploration",
    name: "Minister of Exploration",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. When the owner of this card gains control of a planet, they gain 1 trade good.",
    text2: "",
    mapText: "When you gain control of a planet, you gain 1 trade good.",
    source: "base",
  },
  {
    alias: "minister_industry",
    name: "Minister of Industry",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. When the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities.",
    text2: "",
    mapText:
      "When you place a space dock in a system, your units in that system may use their PRODUCTION abilities.",
    source: "base",
  },
  {
    alias: "minister_of_justice",
    name: "Minister of Justice",
    type: "Directive",
    target: "Elect a player",
    text1:
      "For each player in the game, the elected player may gain 1 command token and allow that player to gain 1 command token.",
    source: "blue_reverie",
  },
  {
    alias: "minister_peace",
    name: "Minister of Peace",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. After a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card - immediately end the active player's turn.",
    text2: "",
    mapText:
      "After a player activates a system that contains 1 or more of a different player's units, you may discard this card - immediately end the active player's turn.",
    source: "base",
  },
  {
    alias: "minister_policy",
    name: "Minister of Policy",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. At the end of the status phase, the owner of this card draws 1 action card.",
    text2: "",
    mapText: "At the end of the status phase, you draw 1 action card.",
    source: "base",
  },
  {
    alias: "minister_sciences",
    name: "Minister of Sciences",
    type: "Law",
    target: "Elect Player",
    text1:
      'The elected player gains this card. When the owner of this card resolves the primary or secondary ability of the "Technology" strategy card, they do not need to spend resources to research technology.',
    text2: "",
    mapText:
      "When you resolve the primary or secondary ability of the 'Technology' strategy card, you do not need to spend resources to research technology.",
    source: "base",
  },
  {
    alias: "minister_war",
    name: "Minister of War",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements - then they may perform 1 additional action.",
    text2: "",
    mapText:
      "Discard this card after performing an action to return 1 of your command counters from the game board to your reinforcements. then you may perform 1 additional action.",
    source: "base",
  },
  {
    alias: "miscount",
    name: "Miscount Disclosed",
    type: "Directive",
    target: "Elect Law",
    text1:
      "(When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.) Vote on the elected law as if it were just revealed from the top of the deck.",
    text2: "",
    source: "base",
  },
  {
    alias: "mutiny",
    name: "Mutiny",
    type: "Directive",
    target: "For/Against",
    text1: 'For: Each player that voted "For" gains 1 victory point.',
    text2: 'Against: Each player that voted "For" loses 1 victory point.',
    forEmoji: "➕",
    againstEmoji: "➖",
    source: "base",
  },
  {
    alias: "nexus",
    name: "Nexus Sovereignty",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Alpha and beta wormholes in the wormhole nexus have no effect during movement.",
    text2: "Against: Place a gamma wormhole token in the Mecatol Rex system.",
    forEmoji: "⛔",
    againstEmoji: "WHgamma",
    mapText:
      "Alpha and beta wormholes in the wormhole nexus have no effect during movement.",
    source: "pok",
  },
  {
    alias: "pi_enforced_travel_ban",
    name: "Enforced Travel Ban",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1: "For: Non-delta wormholes have no effect during movement",
    text2:
      "Against: Each player destroys 1 PDS on a planet they control in or adjacent to a system that contains a wormhole",
    mapText: "Non-delta wormholes have no effect during movement",
    source: "project_pi",
  },
  {
    alias: "pi_ixthian_artifact",
    name: "Ixthian Artifact",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their own units in each of those systems.",
    text2:
      "Against: Place this agenda on the top of the agenda deck and shuffle the agenda deck.",
    source: "project_pi",
  },
  {
    alias: "pi_minister_policy",
    name: "Minister of Policy",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "Elect Player: The elected player gains this card. When you would draw 1 or more action cards, draw 1 additional action card.",
    mapText:
      "When you would draw 1 or more action cards, draw 1 additional action card.",
    source: "project_pi",
  },
  {
    alias: "pi_new_constitution",
    name: "New Constitution",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Discard all laws from play. At the start of the next strategy phase, each player exhausts each planet in their home system. ",
    text2: "Reveal another agenda from the top of the deck and vote on it",
    source: "project_pi",
  },
  {
    alias: "pi_public_execution",
    name: "Public Execution",
    category: "agenda",
    type: "Directive",
    target: "Elect Player",
    text1:
      "Elect Player: The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their right. The elected player cannot vote on any agendas in this agenda phase.",
    source: "project_pi",
  },
  {
    alias: "pi_regulated_conscription",
    name: "Regulated Conscription",
    category: "agenda",
    type: "Law",
    target: "For/Against",
    text1:
      "For: When a player produces units, they produce only 1 fighter for its cost instead of 2.",
    text2:
      "Against: Each player removes 1 infantry and 1 fighter from every system where they have units (if able).",
    mapText:
      "When a player produces units, they produce only 1 fighter for its cost instead of 2.",
    source: "project_pi",
  },
  {
    alias: "pi_wormhole_research",
    name: "Wormhole Research",
    category: "agenda",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player who has 1 or more ships in a system that contains a wormhole may research a technology. Then, each player with ships in a system with a non-delta wormhole destroys 3 of their ships in each of those systems.",
    text2:
      'Against: Each player that voted "Against" removes 1 command token from his command sheet and returns it to his reinforcements.',
    source: "project_pi",
  },
  {
    alias: "plowshares",
    name: "Swords to Plowshares",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed.",
    text2:
      "Against: Each player places 1 infantry from their reinforcements on each planet they control.",
    source: "base",
  },
  {
    alias: "political_entanglement",
    name: "Political Entanglement",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player with the most victory points gives 1 promissory note to each other player, if able.",
    text2:
      "Against: Each player with the fewest victory points may take 1 promissory note at random from each other player.",
    source: "blue_reverie",
  },
  {
    alias: "prophecy",
    name: "Prophecy of Ixth",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card. The owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters.",
    text2: "",
    mapText:
      "Apply +1 to the result of your fighter's combat rolls. When you use PRODUCTION, discard this card unless you produce 2 or more fighters.",
    source: "base",
  },
  {
    alias: "rearmament",
    name: "Rearmament Agreement",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player places 1 mech from their reinforcements on a planet they control in their home system.",
    text2:
      "Against: Each player replaces each of their mechs with 1 infantry from their reinforcements.",
    source: "pok",
  },
  {
    alias: "redistribution",
    name: "Colonial Redistribution",
    type: "Directive",
    target: "Elect Non-Home Planet Other Than Mecatol Rex",
    text1:
      "Destroy each unit on the elected planet. Then, the player who controls that planet chooses 1 player with the fewest victory points - that player may place 1 infantry from their reinforcements on that planet.",
    text2: "",
    source: "base",
  },
  {
    alias: "regulations",
    name: "Fleet Regulations",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player cannot have more than 4 tokens in their fleet pool.",
    text2:
      "Against: Each player places 1 command token from their reinforcements in their fleet pool.",
    mapText: "Each player cannot have more than 4 tokens in their fleet pool.",
    source: "base",
  },
  {
    alias: "rep_govt",
    name: "Representative Government",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players cannot exhaust planets to cast votes during the agenda phase. each player may cast 1 vote on each agenda instead. Players cannot cast additional votes.",
    text2:
      'Against: At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets.',
    forEmoji: "🗳️",
    againstEmoji: "ExhaustedPlanet",
    mapText:
      "Players cannot exhaust planets to cast votes during the agenda phase. each player may cast 1 vote on each agenda instead. Players cannot cast additional votes.",
    source: "pok",
  },
  {
    alias: "representative_government",
    name: "Representative Government (Base Game)",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Players cannot exhaust planets to cast votes during the agenda phase. Each player may cast 1 vote on each agenda instead.",
    text2:
      'Against: At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets.',
    forEmoji: "🗳️",
    againstEmoji: "ExhaustedPlanet",
    source: "base",
  },
  {
    alias: "revolution",
    name: "Anti-Intellectual Revolution",
    type: "Law",
    target: "For/Against",
    text1:
      "For: After a player researches a technology, that player must destroy 1 of their non-fighter ships.",
    text2:
      "Against: At the start of the next strategy phase, each player chooses and exhausts 1 planet for each technology that they own.",
    forEmoji: "💥",
    againstEmoji: "ExhaustedPlanet",
    mapText:
      "After a player researches a technology, that player must destroy 1 of their non-fighter ships.",
    source: "base",
  },
  {
    alias: "riftset_crucible",
    name: "Crucible Reallocation",
    type: "Directive",
    target: "Elect Player",
    text1: "The elected player gets Crucible from whoever currently has it.",
    text2: "(Only for voting - no riders/cards allowed)",
    source: "riftset",
  },
  {
    alias: "rt_biotic",
    name: "Research Team: Biotic",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 green prerequisite.",
    text2: "",
    source: "base",
  },
  {
    alias: "rt_cybernetic",
    name: "Research Team: Cybernetic",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 yellow prerequisite.",
    text2: "",
    source: "base",
  },
  {
    alias: "rt_propulsion",
    name: "Research Team: Propulsion",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 blue prerequisite.",
    text2: "",
    source: "base",
  },
  {
    alias: "rt_warfare",
    name: "Research Team: Warfare",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 red prerequisite.",
    text2: "",
    source: "base",
  },
  {
    alias: "sanctions",
    name: "Executive Sanctions",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Each player can have a maximum of 3 action cards in their hand.",
    text2:
      "Against: Each player discards 1 random action card from their hand.",
    mapText: "Each player can have a maximum of 3 action cards in their hand.",
    source: "base",
  },
  {
    alias: "schematics",
    name: "Publicize Weapon Schematics",
    type: "Law",
    target: "For/Against",
    text1:
      "For: If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE.",
    text2:
      "Against: Each player that owns a war sun technology discards all of their action cards.",
    forEmoji: "CrackedWarSun",
    mapText:
      "If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE.",
    source: "base",
  },
  {
    alias: "secret",
    name: "Archived Secret",
    type: "Directive",
    target: "Elect Player",
    text1: "The elected player draws 1 secret objective.",
    text2: "",
    source: "base",
  },
  {
    alias: "seed_empire",
    name: "Seed of an Empire",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The player with the most victory points gains 1 victory point.",
    text2:
      "Against: The player with the fewest victory points gains 1 victory point.",
    source: "base",
  },
  {
    alias: "senate_sancuary",
    name: "Senate Sanctuary",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. The influence value of this planet is increased by 2.",
    text2: "",
    source: "base",
  },
  {
    alias: "shard_of_the_throne",
    name: "Shard of the Throne",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point. A player gains this card and 1 victory point when they win a combat against the owner of this card. Then, the previous owner of this card loses 1 victory point.",
    text2: "",
    source: "base",
  },
  {
    alias: "shared_research",
    name: "Shared Research",
    type: "Law",
    target: "For/Against",
    text1: "For: Each player's units can move through nebulae.",
    text2:
      "Against: Each player places a command token from their reinforcements in their home system, if able.",
    forEmoji: "ThroughAnomaly",
    againstEmoji: "🔒",
    mapText: "Each player's units can move through nebulae.",
    source: "base",
  },
  {
    alias: "sigma_a_new_age",
    name: "A New Age",
    type: "Directive",
    target: "For/Against",
    text1: "For: Shuffle the agenda discard pile into the agenda deck.",
    text2: "Against: Shuffle all laws in play into the agenda deck.",
    source: "sigma",
  },
  {
    alias: "sigma_changing_times",
    name: "Changing Times",
    type: "Directive",
    target: "Elect Public Objective",
    text1:
      "Discard the elected objective card, return any control tokens on it to their owners' reinforcements, and replace the card with a new random objective card from the same deck.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "sigma_coalitions",
    name: "Form Coalitions",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Reveal the top card of the agenda deck. Each player that voted "For" may cast 1 vote on this agenda. Players cannot cast additional votes.',
    text2:
      'Against: Reveal the top card of the agenda deck. Each player that voted "Against" may cast 1 vote on this agenda. Players cannot cast additional votes.',
    source: "sigma",
  },
  {
    alias: "sigma_construction_resolution",
    name: "Construction Resolution",
    type: "Directive",
    target: "Elect Planet",
    text1:
      "The owner of the elected planet places 1 space dock and 1 PDS from their reinforcements on that planet.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "sigma_diplomacy_resolution",
    name: "Diplomacy Resolution",
    type: "Directive",
    target: "Elect Non-Home System Other Than the Mecatol Rex System",
    text1:
      "Each play places a command token from their reinforcements in the elected system.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "sigma_expedited_paperwork",
    name: "Expedited Paperwork",
    type: "Law",
    target: "Elect Public Objective",
    text1:
      "During the status phase, players may score the elected objective, in addition to another public objective.",
    text2: "",
    mapText:
      "During the status phase, players may score the elected objective, in addition to another public objective.",
    source: "sigma",
  },
  {
    alias: "sigma_exploit_colonies",
    name: "Exploit Colonies",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player removes ground forces on planets they control outside their home system until the number of ground forces on that planet equals the resource value of that planet.",
    text2:
      "Against: Each player places infantry on planets they control outside their home system until the number of ground forces on that planet equals the resource value of that planet.",
    source: "sigma",
  },
  {
    alias: "sigma_imperial_resolution",
    name: "Imperial Resolution",
    type: "Directive",
    target: "Elect Player",
    text1:
      "During the next strategy phase, the elected player chooses strategy cards for each player.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "sigma_ixthian",
    name: "Ixthian Artifact",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: The speaker rolls 1 die. If the result is odd, each player may research a number of technologies equal to half the die result, rounded up. If the result is even, destroy all units in the Mecatol Rex system, and each player with units in systems adjacent to Mecatol Rex destroys a number of their own units equal to half the die result in each of those systems.",
    text2:
      "Against: Shuffle this card and the top 5 cards of the agenda deck together, and place them on top of the agenda deck.",
    source: "sigma",
  },
  {
    alias: "sigma_keleres_funding",
    name: "Keleres Funding",
    type: "Law",
    target: "For/Against",
    text1: "For: All players' commodity values are reduced by 1.",
    text2:
      "Against: Each player return all of their trade goods to the supply.",
    mapText: "All players' commodity values are reduced by 1.",
    source: "sigma",
  },
  {
    alias: "sigma_leadership_resolution",
    name: "Leadership Resolution",
    type: "Directive",
    target: "Elect Command Token Pool",
    text1:
      "Each player gains 3 command tokens, and places them in the elected pool.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "sigma_marriage_treaty",
    name: "Marriage Treaty",
    type: "Directive",
    target:
      "Elect Player\nWhen this agenda is revealed, the speaker reveals the commander of a faction not in play, at random.",
    text1:
      "The elected player gains the revealed commander, unlocked. Another player with the elected player's Alliance promissory note may also use the ability of the gained commander.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "sigma_minister_of_arts",
    name: "Minister of Arts",
    type: "Law",
    target: "Elect Player",
    text1: "The elected player gains this card.",
    text2:
      "The influence value of each of this card's owner's planets is increased by 1.",
    mapText: "Increase the influence value of your planets by 1",
    source: "sigma",
  },
  {
    alias: "sigma_minister_of_energy",
    name: "Minister of Energy",
    type: "Law",
    target: "Elect Player",
    text1: "The elected player gains this card.",
    text2:
      "The influence and resource value of each of this card's owner's industrial planets is increased by 1.",
    mapText:
      "Increase the influence and resource values of your industrial planets by 1",
    source: "sigma",
  },
  {
    alias: "sigma_minister_of_health",
    name: "Minister of Health",
    type: "Law",
    target: "Elect Player",
    text1: "The elected player gains this card.",
    text2:
      "The influence and resource value of each of this card's owner's hazardous planets is increased by 1.",
    mapText:
      "Increase the influence and resource values of your hazardous planets by 1",
    source: "sigma",
  },
  {
    alias: "sigma_minister_of_industry",
    name: "Minister of Industry",
    type: "Law",
    target: "Elect Player",
    text1: "The elected player gains this card.",
    text2:
      "The resource value of each of this card's owner's planets is increased by 1.",
    mapText: "Increase the resource value of your planets by 1",
    source: "sigma",
  },
  {
    alias: "sigma_minister_of_sport",
    name: "Minister of Sport and Recreation",
    type: "Law",
    target: "Elect Player",
    text1: "The elected player gains this card.",
    text2:
      "The influence and resource value of each of this card's owner's cultural planets is increased by 1.",
    mapText:
      "Increase the influence and resource values of your cultural planets by 1",
    source: "sigma",
  },
  {
    alias: "sigma_politics_resolution",
    name: "Politics Resolution",
    type: "Directive",
    target: "For/Against",
    text1:
      'For: Each player that voted "For" draws 1 action card for each player that voted "Against".',
    text2:
      'Against: Each player that voted "Against" draws 1 action card for each player that voted "For".',
    source: "sigma",
  },
  {
    alias: "sigma_resonance_cascade",
    name: "Resonance Cascade",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Place the 3 lambda wormhole tokens in the Mecatol Rex system. At the end of a player's tactical action, that player must remove 1 lambda wormhole token from the game board, and place it in the active system.",
    text2:
      "Against: Flip the wormhole nexus to its inactive side, and destroy all units in systems that contain a gamma wormhole.",
    mapText:
      "After a tactical action, move 1 lambda wormhole token into the active system.",
    source: "sigma",
  },
  {
    alias: "sigma_strike_negotiations",
    name: "Strike Negotiations",
    type: "Law",
    target: "For/Against",
    text1: "For: The PRODUCTION value of each space dock is reduced by 2.",
    text2: "Against: Each player destroys 1 space dock.",
    mapText: "The PRODUCTION value of each space dock is reduced by 2.",
    source: "sigma",
  },
  {
    alias: "sigma_technology_resolution",
    name: "Technology Resolution",
    type: "Directive",
    target: "Elect Non-Faction Technology",
    text1:
      "Each player that owns the elected technology gains 1 command token for each player that does not own that technology. Then, each player that does not own that technology gains that technology.",
    text2:
      "(Players treat a faction unit upgrade as though it were the non-faction unit upgrade when resolving this agenda.)",
    source: "sigma",
  },
  {
    alias: "sigma_trade_resolution",
    name: "Trade Resolution",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player replenishes their commodities, then chooses any number of other players; they replenish their commodities.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "sigma_warfare_resolution",
    name: "Warfare Resolution",
    type: "Directive",
    target: "Elect Non-Structure Unit Type",
    text1:
      "Each player may use the PRODUCTION ability of 1 of their space docks; they may only produce units of the elected type.",
    text2: "",
    source: "sigma",
  },
  {
    alias: "standardization",
    name: "Armed Forces Standardization",
    type: "Directive",
    target: "Elect Player",
    text1:
      "The elected player place command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool, and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements.",
    text2: "",
    source: "pok",
  },
  {
    alias: "strategic_coordination",
    name: "Strategic Coordination",
    type: "Law",
    target: "Elect Strategy Card",
    text1:
      "Attach this card to that strategy card. Players may resolve the secondary of this strategy card without spending a command token",
    mapText:
      "May resolve the secondary of elected card without spending a command token.",
    source: "blue_reverie",
  },
  {
    alias: "terraforming_initiative",
    name: "Terraforming Initiative",
    type: "Law",
    target: "Elect Planet",
    text1:
      "Attach this card to the elected planet's card. The resource and influence values of this planet are increased by 1.",
    text2: "",
    source: "base",
  },
  {
    alias: "tf-arbitrate",
    name: "Arbitrate",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1:
      "You may discard any of your spliced cards. For each card you discard, draw 1 card of that type. Then you may allow any other players to do the same.",
    source: "twilights_fall",
  },
  {
    alias: "tf-arise",
    name: "Arise",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1:
      "Either place 1 infantry on each planet you control or place 1 fighter from your reinforcements in each system that contains your ships",
    source: "twilights_fall",
  },
  {
    alias: "tf-artifice",
    name: "Artifice",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1:
      "Draw 1 relic and 1 paradigm; for each point behind the player with the most victory points you are, you may draw an additional card from either deck. Choose one of each type to keep and shuffle the rest back into their respective decks.",
    source: "twilights_fall",
  },
  {
    alias: "tf-bless",
    name: "Bless",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1:
      "Gain each of the following, then each other player chooses 1 of the following to gain: 1 command token; 2 action cads; 3 trade goods.",
    source: "twilights_fall",
  },
  {
    alias: "tf-censure",
    name: "Censure",
    category: "agenda",
    type: "Law",
    target: "Elect Player",
    text1:
      "Place any player's control marker on this card. That player cannot perform transactions during this game round. Discard this card at the end of the game round. ",
    source: "twilights_fall",
  },
  {
    alias: "tf-convene",
    name: "Convene",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1:
      "Reveal abilities equal to the number of players. The speaker chooses 1 of them for you to gain. Then you choose 1 ability for each other player to gain.",
    source: "twilights_fall",
  },
  {
    alias: "tf-execute",
    name: "Execute",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1:
      "Choose up to 3 planets; destroy half of the infantry on each of those planets, rounded up.",
    source: "twilights_fall",
  },
  {
    alias: "tf-foretell",
    name: "Foretell",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1: "Look at up to 3 unrevealed public objectives.",
    source: "twilights_fall",
  },
  {
    alias: "tf-legacy_of_ixth",
    name: "Legacy of Ixth",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1:
      "Roll 1 die: \n10: Draw up to 2 spliced cards from any decks\n6-9: Each player draws 1 spliced card from any deck. \n1-5: Destroy each unit in the Mecatol Rex system, then each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their units in each of those systems.",
    source: "twilights_fall",
  },
  {
    alias: "tf-splice",
    name: "Splice",
    category: "agenda",
    type: "Directive",
    target: "Edict",
    text1: "Initiate a splice of any type, including all players.",
    source: "twilights_fall",
  },
  {
    alias: "transparency_accord",
    name: "Transparency Accord",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player reveals one of their unscored secret objectives, at random, if able.",
    text2: "Against: Each player who voted For draws 1 secret objective.",
    source: "blue_reverie",
  },
  {
    alias: "travel_ban",
    name: "Enforced Travel Ban",
    type: "Law",
    target: "For/Against",
    text1:
      "For: Alpha and beta wormholes have no effect during movement. [Note: this only affects normal wormhole adjacency. Creuss agent, other agenda laws, and the _Lost Star Chart_ action card will overrule this.]",
    text2:
      "Against: Destroy each PDS in or adjacent to a system that contains a wormhole.",
    forEmoji: "⛔",
    againstEmoji: "💥",
    mapText: "Alpha and beta wormholes have no effect during movement.",
    source: "base",
  },
  {
    alias: "unconventional",
    name: "Unconventional Measures",
    type: "Directive",
    target: "For/Against",
    text1: 'For: Each player that voted "For" draws 2 action cards.',
    text2:
      'Against: Each player that voted "For" discards all of their action cards.',
    source: "base",
  },
  {
    alias: "voice_of_the_council_omegaphase",
    name: "Voice of the Council",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and 1 victory point. When this law is removed or discarded, this player loses 1 victory point and this card is placed in the common play area.",
    text2: "",
    mapText:
      "Gain this card and 1 victory point. If you lose this card, you lose 1 victory point and this card is placed in the common play area.",
    source: "omega_phase",
  },
  {
    alias: "vote_of_confidence",
    name: "Vote Of Confidence",
    type: "Directive",
    target: "For/Against",
    text1: "For: The speaker gains 1 victory point.",
    text2:
      "Against: During the next strategy phase, strategy cards are chosen at random.",
    source: "blue_reverie",
  },
  {
    alias: "warrant",
    name: "Search Warrant",
    type: "Law",
    target: "Elect Player",
    text1:
      "The elected player gains this card and draws 2 secret objectives. The owner of this card plays with their secret objectives revealed.",
    text2: "",
    mapText: "You play with your secret objectives revealed.",
    source: "pok",
  },
  {
    alias: "wormhole_recon",
    name: "Wormhole Reconstruction",
    type: "Law",
    target: "For/Against",
    text1:
      "For: All systems that contain either an alpha or beta wormhole are adjacent to each other. [Note that this will essentially overrule any effect of the Enforced Travel Ban agenda]",
    text2:
      "Against: Each player places a command token from their reinforcements in each system that contains a wormhole and 1 or more of their ships.",
    forEmoji: "MixedWormhole",
    againstEmoji: "🔒",
    mapText:
      "All systems that contain either an alpha or beta wormhole are adjacent to each other.",
    source: "base",
  },
  {
    alias: "wormhole_research",
    name: "Wormhole Research",
    type: "Directive",
    target: "For/Against",
    text1:
      "For: Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole.",
    text2:
      'Against: Each player that voted "Against" removes 1 command token from their command sheet and returns it to their reinforcements.',
    source: "base",
  },
];
