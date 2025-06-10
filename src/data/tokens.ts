export const tokens = [
  {
    id: "creussalpha",
    imagePath: "token_creussalpha.png",
    spaceOrPlanet: "space",
    aliasList: [
      "creussalpha",
      "token_creussalpha",
      "ghostalpha",
      "a",
      "alpha_wormhole",
    ],
    wormholes: ["ALPHA"],
    source: "base",
  },
  {
    id: "creussbeta",
    imagePath: "token_creussbeta.png",
    spaceOrPlanet: "space",
    aliasList: ["creussbeta", "token_creussbeta", "ghostbeta"],
    wormholes: ["BETA"],
    source: "base",
  },
  {
    id: "custodian",
    imagePath: "token_custodian.png",
    spaceOrPlanet: "planet",
    aliasList: ["custodian", "token_custodian"],
    source: "base",
  },
  {
    id: "custodianvp",
    imagePath: "token_custodianvp.png",
    spaceOrPlanet: "planet",
    aliasList: ["custodianvp", "token_custodianvp"],
    source: "base",
  },
  {
    id: "custc1",
    imagePath: "token_custc1.png",
    spaceOrPlanet: "space",
    aliasList: ["custc1"],
    source: "base",
  },
  {
    id: "custvpc1",
    imagePath: "token_custvpc1.png",
    spaceOrPlanet: "space",
    aliasList: ["custvpc1"],
    source: "base",
  },
  {
    id: "creussgamma",
    imagePath: "token_creussgamma.png",
    spaceOrPlanet: "space",
    aliasList: ["creussgamma", "token_creussgamma", "ghostgamma"],
    wormholes: ["GAMMA"],
    source: "pok",
  },
  {
    id: "dmz_large",
    imagePath: "token_dmz_large.png",
    spaceOrPlanet: "planet",
    attachmentID: "dmz",
    aliasList: ["dmz_large", "token_dmz_large", "dmz"],
    source: "pok",
  },
  {
    id: "frontier",
    imagePath: "token_frontier.png",
    spaceOrPlanet: "space",
    aliasList: ["frontier", "token_frontier"],
    source: "pok",
  },
  {
    id: "gamma",
    imagePath: "token_gamma.png",
    spaceOrPlanet: "space",
    aliasList: ["gamma", "token_gamma", "grandma"],
    wormholes: ["GAMMA"],
    source: "pok",
  },
  {
    id: "gravityrift",
    imagePath: "token_gravityrift.png",
    spaceOrPlanet: "space",
    isAnomaly: true,
    isRift: true,
    isNebula: false,
    aliasList: ["gravityrift", "token_gravityrift", "gravrift", "rift"],
    source: "pok",
  },
  {
    id: "ionalpha",
    imagePath: "token_ionalpha.png",
    spaceOrPlanet: "space",
    aliasList: ["ionalpha", "token_ionalpha", "ion"],
    wormholes: ["ALPHA"],
    source: "pok",
  },
  {
    id: "ionbeta",
    imagePath: "token_ionbeta.png",
    spaceOrPlanet: "space",
    aliasList: ["ionbeta", "token_ionbeta"],
    wormholes: ["BETA"],
    source: "pok",
  },
  {
    id: "mirage",
    imagePath: "token_mirage.png",
    spaceOrPlanet: "space",
    tokenPlanetName: "mirage",
    aliasList: ["mirage", "token_mirage"],
    source: "pok",
  },
  {
    id: "sleeper",
    imagePath: "token_sleeper.png",
    spaceOrPlanet: "planet",
    aliasList: ["sleeper", "token_sleeper"],
    source: "pok",
  },
  {
    id: "worlddestroyed",
    imagePath: "token_worlddestroyed.png",
    spaceOrPlanet: "planet",
    aliasList: [
      "worlddestroyed",
      "token_worlddestroyed",
      "stellarconverter",
      "stellar_converter",
    ],
    source: "pok",
  },
];

/**
 * Look up attachment data by ID
 */
export const getTokenData = (tokenId: string) =>
  tokens.find((token) => token.id === tokenId);

/**
 * Get the image path for an attachment by ID
 */
export const getTokenImagePath = (tokenId: string): string => {
  const tokenData = getTokenData(tokenId);
  return tokenData?.imagePath || `token_${tokenId}.png`;
};
