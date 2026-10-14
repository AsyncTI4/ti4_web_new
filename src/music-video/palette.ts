/* Colours the dance numbers use for backup dancers, alongside the players' own. */

/** Drop chorus line, back to front: dreadnoughts, cruisers, destroyers. */
export const DROP_ROWS = [
  { unit: "dn", colors: ["vpw", "tqs", "pnk", "ryl", "org", "grn", "blu", "ppl", "rbw"] },
  { unit: "ca", colors: ["tea", "sns", "rby", "gcr", "ylw", "eme", "lvn", "cpr", "nvy"] },
  { unit: "dd", colors: ["rbw", "pnk", "tqs", "vpw", "red", "org", "ryl", "grn", "ylw"] },
] as const;

/** Chorus 2 destroyer choir around the hero. */
export const CHOIR = ["pnk", "tqs", "vpw", "ryl", "org", "grn", "blu", "rbw"] as const;

/** Finale fleet; the six players' colours go first. */
export const FINALE_PALETTE = ["rbw", "vpw", "tqs", "pnk", "ylw", "red", "ryl", "org", "grn", "tea", "gcr", "sns", "eme", "bld", "cpr", "lvn", "rby", "nvy", "psy", "jad", "ppl", "blu"] as const;

/** "IT'S YOUR TURN" spelled in ships, left to right. */
export const WORD_COLORS = ["red", "org", "ylw", "lme", "tqs", "tea", "azr", "vpw", "pnk"] as const;

export const DECOR_COLORS: string[] = [
  ...new Set<string>([...DROP_ROWS.flatMap((r) => r.colors), ...CHOIR, ...FINALE_PALETTE, ...WORD_COLORS]),
];
