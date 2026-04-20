export type DashboardSettingsResponse = {
  userId: string;
  activeHours: string | null;
  activityTracking: boolean;
  afkHours: string | null;
  autoNoSaboInterval: number;
  gameLimit: number;
  hasAnsweredSurvey: boolean;
  hasIndicatedStatPreferences: boolean;
  lockedFromCreatingGames: boolean;
  metaPref: string;
  myDateTime: string | null;
  personalPingInterval: number;
  pingOnNextTurn: boolean;
  preferredColors: string[];
  prefersAutoDebtClearance: boolean;
  prefersDistanceBasedTacticalActions: boolean;
  prefersPassOnWhensAfters: boolean;
  prefersPillageMsg: boolean;
  prefersPrePassOnSC: boolean;
  prefersSarweenMsg: boolean;
  prefersWrongButtonEphemeral: boolean | null;
  sandbagPref: string;
  showTransactables: boolean;
  supportPref: string;
  takebackPref: string;
  voltronStyle: string;
  whisperPref: string;
  winmakingPref: string;
};

export type DashboardSettingsUpdateRequest = {
  preferredColors: string[];
  personalPingInterval: number;
  prefersDistanceBasedTacticalActions: boolean;
  afkHours: number[];
  pingOnNextTurn: boolean;
  showTransactables: boolean;
  prefersSarweenMsg: boolean;
  prefersPillageMsg: boolean;
  voltronStyle: string;
  prefersAutoDebtClearance: boolean;
  activityTracking: boolean;
  prefersPassOnWhensAfters: boolean;
  prefersPrePassOnSC: boolean;
  prefersWrongButtonEphemeral: boolean;
  autoNoSaboInterval: number;
  whisperPref: string;
  supportPref: string;
  sandbagPref: string;
  winmakingPref: string;
  takebackPref: string;
  metaPref: string;
};

export const PERSONAL_PING_INTERVAL_OPTIONS = [
  { value: "0", label: "Off" },
  ...Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: `${index + 1} hour${index === 0 ? "" : "s"}`,
  })),
  { value: "24", label: "24 hours" },
  { value: "48", label: "48 hours" },
];

export const VOLTRON_STYLE_OPTIONS = [
  "eyes",
  "arms",
  "link",
  "saiyan",
  "at_field",
  "nyan",
  "fancy",
  "royal",
  "baba",
  "minis",
  "lightning",
  "panther",
].map((value) => ({
  value,
  label: value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()),
}));

export const SECRET_SCORING_OPTIONS = [
  { value: "bot", label: "Bot can auto-decline" },
  { value: "manual", label: "Always ask me manually" },
  { value: "No Preference", label: "No preference" },
];

export const WHISPER_PREFERENCE_OPTIONS = [
  { value: "No Whispers", label: "No Whispers" },
  { value: "Limited Whispers", label: "Limited Whispers" },
  { value: "Unlimited Whispers", label: "Unlimited Whispers" },
  { value: "No Preference", label: "Prefer not to answer" },
];

export const SUPPORT_PREFERENCE_OPTIONS = [
  { value: "Purge Supports", label: "Purge Supports" },
  { value: "Ban Support Swaps", label: "Ban Support Swaps" },
  { value: "Keep Default Rules", label: "Keep Default Rules" },
  { value: "No Preference", label: "Prefer not to answer" },
];

export const TAKEBACK_PREFERENCE_OPTIONS = [
  { value: "Unanimous Agreement", label: "Unanimous Agreement" },
  { value: "Majority Agreement", label: "Majority Agreement" },
  { value: "3rd Party Arbitration", label: "3rd Party Arbitration" },
  { value: "No Preference", label: "Prefer not to answer" },
];

export const WINMAKING_PREFERENCE_OPTIONS = [
  { value: "Might Win Make In Any Position", label: "Might Win Make In Any Position" },
  { value: "May Winmake If Cannot Win", label: "May Winmake If I Cannot Win" },
  { value: "Will Not Winmake", label: "Will Not Winmake" },
  { value: "No Preference", label: "Prefer not to answer" },
];

export const META_PREFERENCE_OPTIONS = [
  { value: "Dislike Space Risk More", label: "Dislike Space Risk More" },
  { value: "Dislike Boat Float More", label: "Dislike Passive Boat Float More" },
  { value: "No Strong Feelings", label: "No Strong Feelings" },
  { value: "No Preference", label: "Prefer not to answer" },
];

export function parseSemicolonNumbers(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(";")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item));
}

export function toEditableSettings(data: DashboardSettingsResponse): DashboardSettingsUpdateRequest {
  return {
    preferredColors: data.preferredColors,
    personalPingInterval: data.personalPingInterval,
    prefersDistanceBasedTacticalActions: data.prefersDistanceBasedTacticalActions,
    afkHours: parseSemicolonNumbers(data.afkHours),
    pingOnNextTurn: data.pingOnNextTurn,
    showTransactables: data.showTransactables,
    prefersSarweenMsg: data.prefersSarweenMsg,
    prefersPillageMsg: data.prefersPillageMsg,
    voltronStyle: data.voltronStyle,
    prefersAutoDebtClearance: data.prefersAutoDebtClearance,
    activityTracking: data.activityTracking,
    prefersPassOnWhensAfters: data.prefersPassOnWhensAfters,
    prefersPrePassOnSC: data.prefersPrePassOnSC,
    prefersWrongButtonEphemeral: data.prefersWrongButtonEphemeral ?? true,
    autoNoSaboInterval: data.autoNoSaboInterval,
    whisperPref: normalizePreference(data.whisperPref),
    supportPref: normalizePreference(data.supportPref),
    sandbagPref: normalizeSandbagPreference(data.sandbagPref),
    winmakingPref: normalizePreference(data.winmakingPref),
    takebackPref: normalizePreference(data.takebackPref),
    metaPref: normalizePreference(data.metaPref),
  };
}

function normalizePreference(value: string): string {
  if (value === "No Prefeference") return "No Preference";
  return value;
}

function normalizeSandbagPreference(value: string): string {
  if (value === "manual" || value === "bot" || value === "No Preference") {
    return value;
  }
  return "No Preference";
}
