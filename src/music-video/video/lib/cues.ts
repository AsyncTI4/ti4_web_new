import { LINES, bt } from "./timing";

type Flash = { t: number; a: number; tau: number; color?: string };
const w = (line: number, word: number) => LINES[line].words[word].s;

/** Global flash cues (white unless noted). */
const flashes: Flash[] = [
  { t: bt(0), a: 0.8, tau: 0.1 },
  { t: w(4, 0), a: 0.5, tau: 0.08, color: "255,60,90" },
  { t: w(4, 1), a: 0.6, tau: 0.08, color: "255,60,90" },
  { t: bt(32), a: 0.9, tau: 0.11 },
  { t: w(7, 0), a: 0.5, tau: 0.1 },
  { t: w(7, 3), a: 0.5, tau: 0.1 },
  { t: bt(64), a: 0.8, tau: 0.09 },
  { t: bt(68), a: 0.45, tau: 0.08 },
  { t: bt(72), a: 0.45, tau: 0.08 },
  { t: bt(76), a: 0.45, tau: 0.08 },
  { t: bt(80), a: 0.8, tau: 0.09 },
  { t: w(16, 0), a: 0.5, tau: 0.08, color: "255,60,90" },
  { t: w(16, 1), a: 0.6, tau: 0.08, color: "255,60,90" },
  { t: bt(96), a: 0.9, tau: 0.11 },
  { t: w(19, 0), a: 0.5, tau: 0.1 },
  { t: w(19, 3), a: 0.5, tau: 0.1 },
  { t: bt(128), a: 0.9, tau: 0.12 },
  { t: bt(152), a: 0.9, tau: 0.13 },
  { t: bt(175.6), a: 1, tau: 0.2 },
];
for (let k = 156; k < 175; k += 4) flashes.push({ t: bt(k), a: 0.35, tau: 0.1 });
for (let k = 132; k < 140; k += 4) flashes.push({ t: bt(k), a: 0.3, tau: 0.08 });

export const CUES = { flashes };
