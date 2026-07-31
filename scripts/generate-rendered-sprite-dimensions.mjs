import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";

const tokenCssPath = new URL(
  "../src/shared/ui/Token/tokenSprites.css",
  import.meta.url,
);
const unitCssPath = new URL(
  "../src/shared/ui/Unit/unitSprites.css",
  import.meta.url,
);
const outputPath = new URL(
  "../src/entities/data/renderedSpriteDimensions.ts",
  import.meta.url,
);
const tokenCss = await readFile(tokenCssPath, "utf8");
const unitCss = await readFile(unitCssPath, "utf8");
const dimensions = { token: {}, attachment: {} };
const tokenRulePattern =
  /\.token-sprite--(token|attachment)-([a-z0-9_-]+)\s*\{([^}]*)\}/g;
const unitRulePattern = /\.unit-sprite--([a-z0-9_-]+)\s*\{([^}]*)\}/g;

for (const match of tokenCss.matchAll(tokenRulePattern)) {
  const [, kind, id, rule] = match;
  if (!rule.includes("aspect-ratio")) continue;
  const width = cssPixels(rule, "width");
  const height = cssPixels(rule, "height");
  if (!width || !height) {
    throw new Error(`Missing rendered dimensions for ${kind} sprite "${id}"`);
  }
  dimensions[kind][id] = {
    width,
    height,
  };
}

const unitDimensions = {};
for (const match of unitCss.matchAll(unitRulePattern)) {
  const [, id, rule] = match;
  if (!rule.includes("aspect-ratio")) continue;
  const width = cssPixels(rule, "width");
  const height = cssPixels(rule, "height");
  if (!width || !height) {
    throw new Error(`Missing rendered dimensions for unit sprite "${id}"`);
  }
  unitDimensions[id] = {
    width,
    height,
  };
}

function cssPixels(rule, property) {
  const value = rule.match(
    new RegExp(`(?:^|\\n)\\s+${property}:\\s*(\\d+)px;`),
  )?.[1];
  return value ? Number(value) : undefined;
}

function formatDimensions(items) {
  const entries = Object.entries(items).map(
    ([id, { width, height }]) =>
      `    ${JSON.stringify(id)}: { width: ${width}, height: ${height} },`,
  );
  return `{\n${entries.join("\n")}\n  }`;
}

const source = `// Generated from the rendered sprite CSS by scripts/generate-rendered-sprite-dimensions.mjs.
export type SpriteDimensions = {
  width: number;
  height: number;
};

const TOKEN_SPRITE_DIMENSIONS: Record<
  "token" | "attachment",
  Record<string, SpriteDimensions>
> = {
  token: ${formatDimensions(dimensions.token)},
  attachment: ${formatDimensions(dimensions.attachment)},
};

const UNIT_SPRITE_DIMENSIONS: Record<string, SpriteDimensions> = ${formatDimensions(unitDimensions)};
const UNIT_SPRITE_ALIASES: Record<string, string> = {
  lady: "fs",
  lord: "fs",
};

export function getTokenSpriteDimensions(
  kind: "token" | "attachment",
  id: string,
): SpriteDimensions | undefined {
  return TOKEN_SPRITE_DIMENSIONS[kind][id];
}

export function getUnitSpriteDimensions(
  id: string,
): SpriteDimensions | undefined {
  return UNIT_SPRITE_DIMENSIONS[UNIT_SPRITE_ALIASES[id] ?? id];
}
`;

await writeFile(outputPath, await format(source, { parser: "typescript" }));
