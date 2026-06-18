const COLORED_SPRITE_COLORS = new Set([
  "abr",
  "azr",
  "beg",
  "bld",
  "blk",
  "blt",
  "blu",
  "bwn",
  "cam",
  "chk",
  "cnb",
  "cpr",
  "cqr",
  "crm",
  "dw",
  "eme",
  "ero",
  "eth",
  "frs",
  "gcr",
  "gld",
  "grn",
  "gry",
  "hqn",
  "jad",
  "jpt",
  "lgy",
  "lme",
  "lvn",
  "mgm",
  "nea",
  "nm",
  "nvy",
  "orca",
  "org",
  "pch",
  "pld",
  "plm",
  "pnk",
  "ppl",
  "psn",
  "psy",
  "ptb",
  "ptr",
  "rbw",
  "rby",
  "red",
  "rse",
  "rst",
  "ryl",
  "sbt",
  "sns",
  "splitbld",
  "splitblu",
  "splitchk",
  "spliteme",
  "splitgld",
  "splitgrn",
  "splitlme",
  "splitnvy",
  "splitorg",
  "splitpnk",
  "splitppl",
  "splitptr",
  "splitrbw",
  "splitred",
  "splittan",
  "splittea",
  "splittqs",
  "splitylw",
  "spr",
  "tan",
  "tea",
  "tpl",
  "tqs",
  "vdg",
  "vpw",
  "wsp",
  "wtm",
  "ylw",
]);

const COLORED_SPRITE_UNITS = new Set([
  "fs",
  "dn",
  "cv",
  "ca",
  "ws",
  "monument",
  "dd",
  "dd_eyes",
  "mf",
  "gf",
  "sd",
  "pd",
  "tkn_ff",
  "tkn_gf",
  "tkn_inf",
  "ff",
]);

const SHARED_SPRITE_UNITS = new Set(["plenaryorbital", "tyrantslament"]);

export type UnitSprite = {
  color: string;
  unit: string;
};

export function getUnitSprite(
  colorAlias: string,
  unitType: string
): UnitSprite | undefined {
  if (SHARED_SPRITE_UNITS.has(unitType)) {
    return { color: "shared", unit: unitType };
  }

  if (
    COLORED_SPRITE_COLORS.has(colorAlias) &&
    COLORED_SPRITE_UNITS.has(unitType)
  ) {
    return { color: colorAlias, unit: unitType };
  }

  return undefined;
}
