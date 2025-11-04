// List of all available decal IDs from decals.properties
// Excludes:
// - Disabled decals (tech icons, trait icons, eye icon, Australia icon)
// - User-specific restricted decals (caballed, cb_10, cb_11, cb_52, cb_93, cb_94, cb_97)
// as per UnitDecalService restrictions
export const DECAL_IDS = [
  // "caballed", // user-specific - only eronous
  "cb_01",
  "cb_02",
  "cb_03",
  "cb_04",
  "cb_05",
  "cb_06",
  "cb_07",
  "cb_08",
  "cb_09",
  // "cb_10", // user-specific - only jazz
  // "cb_11", // user-specific - only tournament winners
  // "cb_12", // disabled - tech icon
  "cb_13",
  "cb_14",
  "cb_15",
  "cb_16",
  "cb_17",
  "cb_18",
  "cb_19",
  "cb_20",
  "cb_21",
  "cb_22",
  "cb_23",
  "cb_24",
  "cb_25",
  "cb_26",
  "cb_27",
  "cb_28",
  "cb_29",
  "cb_30",
  "cb_31",
  "cb_32",
  "cb_33",
  // "cb_34", // disabled - tech icon
  // "cb_35", // disabled - tech icon
  // "cb_36", // disabled - tech icon
  // "cb_37", // disabled - trait icon
  // "cb_38", // disabled - trait icon
  // "cb_39", // disabled - trait icon
  // "cb_40", // disabled - trait icon
  "cb_41",
  // "cb_42", // disabled - eye icon
  "cb_43",
  "cb_44",
  "cb_45",
  "cb_46",
  "cb_47",
  "cb_48",
  "cb_49",
  "cb_50",
  "cb_51",
  // "cb_52", // user-specific - only sigma
  "cb_53",
  // "cb_54", // disabled - Australia icon
  "cb_55",
  "cb_56",
  "cb_57",
  "cb_58",
  "cb_59",
  "cb_60",
  "cb_61",
  "cb_62",
  "cb_63",
  "cb_64",
  "cb_65",
  "cb_66",
  "cb_67",
  "cb_68",
  "cb_69",
  "cb_70",
  "cb_71",
  "cb_72",
  "cb_73",
  "cb_74",
  "cb_75",
  "cb_76",
  "cb_77",
  "cb_78",
  "cb_79",
  "cb_80",
  "cb_81",
  "cb_82",
  "cb_83",
  "cb_84",
  "cb_85",
  "cb_86",
  "cb_87",
  "cb_88",
  "cb_89",
  "cb_90",
  "cb_91",
  "cb_92",
  // "cb_93", // user-specific - only bambam
  // "cb_94", // user-specific - only tsp
  "cb_95",
  "cb_96",
  // "cb_97", // user-specific - only gwaer bot supporter
  "cb_98",
  "cb_99",
  "cb_100",
  "cb_101",
  "ln_bk",
  "ln_blu",
  "ln_br",
  "ln_rd",
  "ln_wt",
] as const;

export type DecalId = typeof DECAL_IDS[number];

