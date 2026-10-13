// Sprite-sheet layout matching TI4_map_generator_bot's generate-token-sprites.mjs
// and generate-unit-sprites.mjs output. Frames are [x, y, width, height] in px.
type Frame = readonly [x: number, y: number, width: number, height: number];

type SpriteSheet = {
  width: number;
  height: number;
  frames: Record<string, Frame>;
};

export type SpriteDimensions = {
  width: number;
  height: number;
};

export type SpriteFrame = SpriteDimensions & {
  sheet: string;
  sheetWidth: number;
  sheetHeight: number;
  x: number;
  y: number;
};

const TOKEN_SPRITE_SHEETS: Record<
  "token" | "attachment",
  Record<string, SpriteSheet>
> = {
  token: {
    "tokens-official": {
      width: 993,
      height: 504,
      frames: {
        asteroids: [607, 207, 95, 95],
        avernus: [371, 0, 174, 157],
        breachactive: [374, 207, 66, 106],
        breachinactive: [442, 207, 66, 106],
        creussalpha: [659, 327, 80, 80],
        creussbeta: [741, 327, 80, 80],
        creussgamma: [823, 327, 80, 80],
        custc1: [577, 327, 80, 82],
        custodian: [0, 0, 200, 205],
        custodianvp: [547, 0, 142, 142],
        custvpc1: [905, 327, 80, 80],
        egress: [485, 327, 90, 90],
        entropicscar: [704, 207, 95, 95],
        frontier: [0, 424, 80, 80],
        gamma: [82, 424, 80, 80],
        gravityrift: [801, 207, 95, 95],
        ingress: [510, 207, 95, 96],
        ionalpha: [898, 207, 95, 95],
        ionbeta: [0, 327, 95, 95],
        mirage: [691, 0, 154, 137],
        nebula: [97, 327, 95, 95],
        relictoken: [246, 424, 48, 48],
        severed: [164, 424, 80, 80],
        sleeper: [194, 327, 95, 95],
        speaker: [0, 207, 185, 118],
        supernova: [291, 327, 95, 95],
        thundersedge: [202, 0, 167, 159],
        tyrant: [187, 207, 185, 116],
        worlddestroyed: [388, 327, 95, 95],
      },
    },
    "tokens-homebrew": {
      width: 994,
      height: 415,
      frames: {
        anomaly: [993, 335, 1, 1],
        beansnexus: [194, 238, 90, 90],
        big_obelisk: [636, 0, 100, 100],
        blight: [0, 141, 95, 95],
        compromised: [941, 335, 50, 50],
        consulate: [701, 238, 80, 80],
        cradle: [318, 0, 160, 136],
        creussepsilon: [783, 238, 80, 80],
        custom_eronous_whepsilon: [865, 238, 80, 80],
        custom_eronous_wheta: [0, 335, 80, 80],
        custom_eronous_whiota: [82, 335, 80, 80],
        custom_eronous_whtheta: [246, 335, 80, 80],
        custom_eronous_whzeta: [328, 335, 80, 80],
        customempyrean: [97, 238, 95, 95],
        customkollecc: [97, 141, 95, 95],
        customnivyn: [194, 141, 95, 95],
        customnokar: [291, 141, 95, 95],
        customtnelis: [388, 141, 95, 95],
        customwinnu: [840, 0, 95, 98],
        freepeople: [286, 238, 81, 84],
        freesystems_raccoon: [574, 335, 97, 77],
        gledge_core: [485, 141, 95, 95],
        glory: [582, 141, 95, 95],
        glory2: [679, 141, 95, 95],
        glory3: [776, 141, 95, 95],
        illusion: [480, 0, 154, 136],
        installation: [738, 0, 100, 100],
        oasis: [0, 0, 160, 139],
        phantasm: [162, 0, 154, 137],
        sigil: [873, 141, 95, 95],
        vortex: [410, 335, 80, 80],
        whall: [492, 335, 80, 80],
        whalpha: [673, 335, 65, 65],
        whbeta: [740, 335, 65, 65],
        whchampion: [369, 238, 81, 81],
        whdelta: [807, 335, 65, 65],
        whepsilon: [865, 238, 80, 80],
        wheta: [0, 335, 80, 80],
        whgamma: [874, 335, 65, 65],
        whkappa: [164, 335, 80, 80],
        whnarrows: [452, 238, 81, 81],
        whprobability: [535, 238, 81, 81],
        whvoyage: [618, 238, 81, 81],
        whzeta: [328, 335, 80, 80],
        wound: [0, 238, 95, 95],
      },
    },
  },
  attachment: {
    "attachment-tokens-official": {
      width: 1019,
      height: 111,
      frames: {
        biotic: [427, 0, 64, 34],
        bioticstat: [493, 0, 64, 34],
        custodiavigilia1: [0, 0, 75, 75],
        custodiavigilia2: [77, 0, 75, 75],
        cybernetic: [559, 0, 64, 34],
        cyberneticstat: [625, 0, 64, 34],
        dmz: [691, 0, 64, 34],
        dysonsphere: [757, 0, 64, 34],
        helios1: [823, 0, 64, 34],
        helios2: [889, 0, 64, 34],
        lazaxsurvivors: [955, 0, 64, 34],
        miningworld: [0, 77, 64, 34],
        nanoforge: [154, 0, 89, 34],
        paradiseworld: [66, 77, 64, 34],
        propulsion: [132, 77, 64, 34],
        propulsionstat: [198, 77, 64, 34],
        richworld: [264, 77, 64, 34],
        titanshero: [245, 0, 89, 34],
        titanspn: [336, 0, 89, 34],
        tombofemphidia: [330, 77, 64, 34],
        warfare: [396, 77, 64, 34],
        warfarestat: [462, 77, 64, 34],
      },
    },
    "attachment-tokens-homebrew": {
      width: 1017,
      height: 275,
      frames: {
        arcane_citadel: [227, 66, 64, 34],
        arcane_shield: [161, 66, 64, 34],
        automatons: [293, 66, 64, 34],
        council_preserve: [359, 66, 64, 34],
        cultural: [425, 66, 64, 34],
        designabundance: [557, 66, 64, 34],
        designgrand: [623, 66, 64, 34],
        designprestige: [689, 66, 64, 34],
        designtranspose: [755, 66, 64, 34],
        designunify: [821, 66, 64, 34],
        encryptionkey: [887, 66, 64, 34],
        facilitycolony: [118, 0, 45, 64],
        facilitycorefactory: [66, 246, 65, 25],
        facilityembassy1: [386, 0, 64, 37],
        facilityembassy2: [452, 0, 64, 37],
        facilityembassy3: [518, 0, 64, 37],
        facilityembassy4: [584, 0, 64, 37],
        facilityembassy5: [650, 0, 64, 37],
        facilityembassy6: [716, 0, 64, 37],
        facilityembassy7: [782, 0, 64, 37],
        facilitylogisticshub: [61, 0, 55, 64],
        facilitynavalbase: [0, 246, 64, 29],
        facilityrefinery: [0, 0, 59, 64],
        facilityresearchlab: [165, 0, 64, 62],
        facilitytransitnode: [320, 0, 64, 52],
        galacticheritagesite: [953, 66, 64, 34],
        garden_worlds: [0, 102, 64, 34],
        gledgebase: [132, 102, 64, 34],
        hazardous: [198, 102, 64, 34],
        imperialinstitute: [264, 102, 64, 34],
        industrial: [330, 102, 64, 34],
        ixthduel: [231, 0, 87, 53],
        legendary: [396, 102, 64, 34],
        lizhotrap: [462, 102, 64, 34],
        lizhotrap1: [528, 102, 64, 34],
        lizhotrap2: [594, 102, 64, 34],
        lizhotrap3: [660, 102, 64, 34],
        lizhotrap4: [726, 102, 64, 34],
        lizhotrap5: [792, 102, 64, 34],
        lizhotrap6: [858, 102, 64, 34],
        lloyd_culturalboom: [491, 66, 64, 34],
        lloyd_galacticfinancialcenter: [886, 210, 38, 34],
        lloyd_geothermal: [66, 102, 64, 34],
        lloyd_industrialboom: [91, 66, 68, 34],
        lloyd_interplanetaryhub: [722, 210, 39, 34],
        lloyd_orbitalslingshot: [763, 210, 39, 34],
        lloyd_planetaryarcologies: [926, 210, 37, 34],
        lloyd_populationgrowth: [660, 138, 64, 34],
        lloyd_selfdefense: [804, 210, 39, 34],
        lloyd_terraformingmilestone: [660, 210, 60, 34],
        lloyd_traderoute: [845, 210, 39, 34],
        manufactorum: [924, 102, 64, 34],
        negativeinf: [0, 138, 64, 34],
        negativeinf2: [66, 138, 64, 34],
        negativeinf3: [132, 138, 64, 34],
        negativeres: [198, 138, 64, 34],
        negativeres2: [264, 138, 64, 34],
        negativeres3: [330, 138, 64, 34],
        obelisk: [396, 138, 64, 34],
        olradin_mech_inf: [462, 138, 64, 34],
        olradin_mech_res: [528, 138, 64, 34],
        orbital_foundries: [594, 138, 64, 34],
        positiveinf: [726, 138, 64, 34],
        positiveinf2: [792, 138, 64, 34],
        positiveinf3: [858, 138, 64, 34],
        positiveres: [924, 138, 64, 34],
        positiveres2: [0, 174, 64, 34],
        positiveres3: [66, 174, 64, 34],
        sigma_ancient_hall: [132, 174, 64, 34],
        sigma_cyber: [848, 0, 89, 34],
        sigma_deserted_factories: [198, 174, 64, 34],
        sigma_palace_admirals: [264, 174, 64, 34],
        sigma_palace_architects: [330, 174, 64, 34],
        sigma_palace_diplomats: [396, 174, 64, 34],
        sigma_palace_merchants: [462, 174, 64, 34],
        sigma_palace_politicians: [528, 174, 64, 34],
        sigma_palace_scientists: [594, 174, 64, 34],
        sigma_senate_sanctuary: [660, 174, 64, 34],
        sigma_unwelcoming: [726, 174, 64, 34],
        sigma_weirdway: [0, 66, 89, 34],
        superweapon_availyn: [792, 174, 64, 34],
        superweapon_caled: [858, 174, 64, 34],
        superweapon_glatison: [924, 174, 64, 34],
        superweapon_grom: [0, 210, 64, 34],
        superweapon_mors: [66, 210, 64, 34],
        threetraits: [132, 210, 64, 34],
        veldyrbroadcasthub: [198, 210, 64, 34],
        veldyrorbitalshipyard: [264, 210, 64, 34],
        veldyrreservebank: [330, 210, 64, 34],
        veldyrtaxhaven: [396, 210, 64, 34],
        weapon: [462, 210, 64, 34],
        weaponstat: [528, 210, 64, 34],
        worldshapernegative: [594, 210, 64, 34],
      },
    },
  },
};

const UNIT_SPRITE_SHEETS: Record<"colored" | "shared", SpriteSheet> = {
  colored: {
    width: 948,
    height: 82,
    frames: {
      fs: [0, 0, 80, 82],
      dn: [82, 0, 77, 77],
      cv: [161, 0, 71, 70],
      ca: [234, 0, 67, 67],
      ws: [303, 0, 56, 65],
      monument: [361, 0, 64, 64],
      dd: [427, 0, 51, 50],
      dd_eyes: [480, 0, 51, 50],
      mf: [533, 0, 45, 45],
      gf: [580, 0, 39, 44],
      sd: [621, 0, 42, 43],
      pd: [665, 0, 33, 38],
      tkn_ff: [700, 0, 70, 35],
      tkn_gf: [772, 0, 70, 35],
      tkn_inf: [844, 0, 70, 35],
      ff: [916, 0, 32, 32],
    },
  },
  shared: {
    width: 135,
    height: 90,
    frames: {
      tyrantslament: [0, 0, 89, 90],
      plenaryorbital: [91, 0, 44, 47],
    },
  },
};

const UNIT_SPRITE_ALIASES: Record<string, string> = {
  lady: "fs",
  lord: "fs",
};

function findFrame(
  sheets: Record<string, SpriteSheet>,
  id: string,
): SpriteFrame | undefined {
  for (const [sheet, { width, height, frames }] of Object.entries(sheets)) {
    const frame = frames[id];
    if (frame) {
      const [x, y, frameWidth, frameHeight] = frame;
      return {
        sheet,
        sheetWidth: width,
        sheetHeight: height,
        x,
        y,
        width: frameWidth,
        height: frameHeight,
      };
    }
  }
  return undefined;
}

export function getTokenSpriteFrame(
  kind: "token" | "attachment",
  id: string,
): SpriteFrame | undefined {
  return findFrame(TOKEN_SPRITE_SHEETS[kind], id);
}

export function getUnitSpriteFrame(id: string): SpriteFrame | undefined {
  return findFrame(UNIT_SPRITE_SHEETS, UNIT_SPRITE_ALIASES[id] ?? id);
}

export function getTokenSpriteDimensions(
  kind: "token" | "attachment",
  id: string,
): SpriteDimensions | undefined {
  return getTokenSpriteFrame(kind, id);
}

export function getUnitSpriteDimensions(
  id: string,
): SpriteDimensions | undefined {
  return getUnitSpriteFrame(id);
}
