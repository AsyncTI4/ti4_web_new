import React from "react";
import { SceneProps } from "./types";

import { V1Activate, V1Afk, V1Cruiser, V1Destroyer } from "./Verse1";
import { V2Carrier, V2Dread, V2EndTurn, V2WarSun, V2_CUTS } from "./Verse2";
import { V3Fleet, V3NoSabo, V3Phone, V3WhensAfters, V3_CUTS } from "./Verse3";
import { Breakdown, BREAK_AT, DropParty, TENDER_AT, Tender } from "./Drop";
import { FINALE_END, FINALE_FROM, Finale } from "./Finale";
import { EndCard } from "./EndCard";
import { AUDIO_SECONDS, TOTAL_SECONDS } from "../lib/timing";
import { C1Board, C1Bot, C1Turn, C1Wait, C2Board, C2Bot, C2Turn, C2Wait, chorusWindows } from "./Chorus";

const c1 = chorusWindows(1);
const c2 = chorusWindows(2);

export type SceneDef = { id: string; from: number; to: number; z?: number; C: React.FC<SceneProps> };

export const SCENES: SceneDef[] = [
  { id: "v1-destroyer", from: 0, to: 4.46, C: V1Destroyer },
  { id: "v1-afk", from: 4.26, to: 8.32, z: 1, C: V1Afk },
  { id: "v1-cruiser", from: 8.12, to: 12.45, z: 2, C: V1Cruiser },
  { id: "v1-activate", from: 12.45, to: c1.board[0], z: 3, C: V1Activate },
  { id: "c1-board", from: c1.board[0], to: c1.board[1], z: 4, C: C1Board },
  { id: "c1-bot", from: c1.bot[0], to: c1.bot[1], z: 5, C: C1Bot },
  { id: "c1-wait", from: c1.wait[0], to: c1.wait[1] + 0.2, z: 6, C: C1Wait },
  { id: "c1-turn", from: c1.turn[0], to: c1.turn[1], z: 7, C: C1Turn },
  { id: "v2-carrier", from: V2_CUTS[0], to: V2_CUTS[1], z: 8, C: V2Carrier },
  { id: "v2-dread", from: V2_CUTS[1], to: V2_CUTS[2], z: 9, C: V2Dread },
  { id: "v2-warsun", from: V2_CUTS[2], to: V2_CUTS[3], z: 10, C: V2WarSun },
  { id: "v2-endturn", from: V2_CUTS[3], to: V3_CUTS[0] + 0.2, z: 11, C: V2EndTurn },
  { id: "v3-fleet", from: V3_CUTS[0], to: V3_CUTS[1], z: 12, C: V3Fleet },
  { id: "v3-nosabo", from: V3_CUTS[1], to: V3_CUTS[2], z: 12, C: V3NoSabo },
  { id: "v3-phone", from: V3_CUTS[2], to: V3_CUTS[3], z: 12, C: V3Phone },
  { id: "v3-whens", from: V3_CUTS[3], to: c2.board[0], z: 13, C: V3WhensAfters },
  { id: "c2-board", from: c2.board[0], to: c2.board[1], z: 14, C: C2Board },
  { id: "c2-bot", from: c2.bot[0], to: c2.bot[1], z: 15, C: C2Bot },
  { id: "c2-wait", from: c2.wait[0], to: c2.wait[1] + 0.2, z: 16, C: C2Wait },
  { id: "c2-turn", from: c2.turn[0], to: c2.turn[1], z: 17, C: C2Turn },
  { id: "drop", from: c2.turn[1], to: TENDER_AT + 0.02, z: 18, C: DropParty },
  { id: "tender", from: TENDER_AT, to: BREAK_AT + 0.25, z: 19, C: Tender },
  { id: "breakdown", from: BREAK_AT, to: FINALE_FROM, z: 18, C: Breakdown },
  { id: "finale", from: FINALE_FROM, to: Math.max(FINALE_END, AUDIO_SECONDS), z: 20, C: Finale },
  { id: "endcard", from: AUDIO_SECONDS, to: TOTAL_SECONDS + 1, z: 21, C: EndCard },
];
