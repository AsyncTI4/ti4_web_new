import { colors } from "@/entities/data/colors";
import {
  META_PREFERENCE_OPTIONS,
  PERSONAL_PING_INTERVAL_OPTIONS,
  SECRET_SCORING_OPTIONS,
  SUPPORT_PREFERENCE_OPTIONS,
  TAKEBACK_PREFERENCE_OPTIONS,
  VOLTRON_STYLE_OPTIONS,
  WHISPER_PREFERENCE_OPTIONS,
  WINMAKING_PREFERENCE_OPTIONS,
  type DashboardSettingsResponse,
  type DashboardSettingsUpdateRequest,
} from "./userSettings";

export type Settings = DashboardSettingsUpdateRequest;
type KeysOfType<V> = {
  [K in keyof Settings]: Settings[K] extends V ? K : never;
}[keyof Settings];
type Option = { value: string; label: string };

export type FieldSpec = { label: string; description: string } & (
  | { kind: "switch"; key: KeysOfType<boolean> }
  | { kind: "select"; key: KeysOfType<string>; data: Option[] }
  | { kind: "numberSelect"; key: KeysOfType<number>; data: Option[] }
  | { kind: "number"; key: KeysOfType<number>; min: number; max: number }
  | { kind: "multiSelect"; key: KeysOfType<string[]>; data: Option[] }
  | { kind: "hourMultiSelect"; key: KeysOfType<number[]>; data: Option[] }
);

export type SectionSpec = {
  title: string;
  description: string;
  fields: FieldSpec[];
};

const COLOR_OPTIONS = colors.map((color) => ({
  value: color.name,
  label: color.displayName ?? color.name,
}));

const AFK_HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour),
  label: `${hour}:00 UTC`,
}));

export const EDITABLE_SECTIONS: SectionSpec[] = [
  {
    title: "Turn Alerts And Automation",
    description:
      "Timing, reminders, and automatic pass behavior for common Discord prompts.",
    fields: [
      {
        kind: "numberSelect",
        key: "personalPingInterval",
        label: "Personal ping interval",
        description:
          "How long the bot waits before pinging you when it becomes your turn.",
        data: PERSONAL_PING_INTERVAL_OPTIONS,
      },
      {
        kind: "switch",
        key: "pingOnNextTurn",
        label: "Ping on next turn",
        description:
          "One-shot reminder that pings you the next time any of your games reaches your turn.",
      },
      {
        kind: "number",
        key: "autoNoSaboInterval",
        label: "Auto no-sabo median",
        description:
          "Median hours the bot should wait before auto-reacting 'No Sabo' when you do not have relevant responses. Set 0 to turn it off.",
        min: 0,
        max: 168,
      },
      {
        kind: "switch",
        key: "prefersPassOnWhensAfters",
        label: "Auto pass on whens/afters",
        description:
          "Lets the bot auto-pass on agenda windows when you have no valid 'when' or 'after' actions.",
      },
      {
        kind: "switch",
        key: "prefersPrePassOnSC",
        label: "Pre-decline strategy card prompts",
        description:
          "Prompts you to pre-decline strategy card windows so the bot can move faster when you already know you will pass.",
      },
      {
        kind: "select",
        key: "sandbagPref",
        label: "Secret scoring assistance",
        description:
          "Controls whether the bot may automatically answer that you cannot score a secret objective.",
        data: SECRET_SCORING_OPTIONS,
      },
      {
        kind: "switch",
        key: "prefersWrongButtonEphemeral",
        label: "Ephemeral wrong-button warning",
        description:
          "Keeps 'these buttons are for someone else' notices visible only to you.",
      },
    ],
  },
  {
    title: "Interface And Convenience",
    description:
      "Default presentation and transaction behaviors that shape how your games feel.",
    fields: [
      {
        kind: "multiSelect",
        key: "preferredColors",
        label: "Preferred player colors",
        description:
          "Ordered list of colors the bot should prefer when a game lets you pick.",
        data: COLOR_OPTIONS,
      },
      {
        kind: "select",
        key: "voltronStyle",
        label: "Voltron style",
        description:
          "Chooses the visual style for your Eidolon Maximum / Voltron presentation.",
        data: VOLTRON_STYLE_OPTIONS,
      },
      {
        kind: "switch",
        key: "prefersDistanceBasedTacticalActions",
        label: "Distance-based tactical actions",
        description:
          "Shows tactical action choices by distance from your current position instead of by map ring.",
      },
      {
        kind: "switch",
        key: "showTransactables",
        label: "Show transactables at transaction start",
        description:
          "Displays player areas automatically when a transaction begins so you can see what can be traded.",
      },
      {
        kind: "switch",
        key: "prefersAutoDebtClearance",
        label: "Auto debt clearance",
        description:
          "Automatically clears debt when you send trade goods or commodities.",
      },
      {
        kind: "switch",
        key: "prefersPillageMsg",
        label: "Show Pillage flavor text",
        description:
          "Keeps the reminder/flavor text attached to Pillage interactions.",
      },
      {
        kind: "switch",
        key: "prefersSarweenMsg",
        label: "Show Sarween flavor text",
        description:
          "Keeps the reminder/flavor text attached to Sarween Tools interactions.",
      },
    ],
  },
  {
    title: "Availability And Presence",
    description:
      "Global availability settings the bot uses when deciding when to nudge you.",
    fields: [
      {
        kind: "switch",
        key: "activityTracking",
        label: "Activity tracking",
        description:
          "Allows the bot to build an hourly activity profile based on when you interact. Turning this off also clears the stored activity histogram.",
      },
      {
        kind: "hourMultiSelect",
        key: "afkHours",
        label: "AFK hours",
        description:
          "UTC hours during which the bot should treat you as away across all games.",
        data: AFK_HOUR_OPTIONS,
      },
    ],
  },
  {
    title: "Table Conduct Preferences",
    description:
      "Survey-backed social preferences that help other players understand your expected table norms.",
    fields: [
      {
        kind: "select",
        key: "whisperPref",
        label: "Whispers",
        description:
          "Your preference for hidden deals and secret communication.",
        data: WHISPER_PREFERENCE_OPTIONS,
      },
      {
        kind: "select",
        key: "supportPref",
        label: "Support for the Throne",
        description:
          "Your preferred table rule for Support swaps and related diplomacy.",
        data: SUPPORT_PREFERENCE_OPTIONS,
      },
      {
        kind: "select",
        key: "takebackPref",
        label: "Rollback disputes",
        description:
          "How you would prefer takeback or rollback disagreements to be settled.",
        data: TAKEBACK_PREFERENCE_OPTIONS,
      },
      {
        kind: "select",
        key: "winmakingPref",
        label: "Winmaking stance",
        description:
          "Your stated view on whether winmaking is acceptable and under what conditions.",
        data: WINMAKING_PREFERENCE_OPTIONS,
      },
      {
        kind: "select",
        key: "metaPref",
        label: "Meta preference",
        description:
          "Signals whether you dislike early aggressive 'space risk' games or slower passive 'boat float' games more.",
        data: META_PREFERENCE_OPTIONS,
      },
    ],
  },
];

function createGameLockLabel({
  lockedFromCreatingGames,
  myDateTime,
}: DashboardSettingsResponse) {
  if (!lockedFromCreatingGames) return "Not locked";
  if (!myDateTime) return "Locked";
  return `Locked until ${new Date(myDateTime).toLocaleString()}`;
}

export const READ_ONLY_FIELDS: {
  label: string;
  description: string;
  value: (data: DashboardSettingsResponse) => string;
}[] = [
  {
    label: "User ID",
    description: "Discord account id tied to the authenticated session.",
    value: (data) => data.userId,
  },
  {
    label: "Game limit",
    description:
      "Administrative cap on how many games you may create or join. This is not editable from the dashboard.",
    value: (data) => String(data.gameLimit),
  },
  {
    label: "Create-game lock",
    description: "Shows whether you are currently blocked from creating games.",
    value: createGameLockLabel,
  },
  {
    label: "Statistics opt-in",
    description:
      "Whether you have already answered the stats visibility questions.",
    value: (data) =>
      data.hasIndicatedStatPreferences ? "Provided" : "Not provided",
  },
  {
    label: "Survey answered",
    description:
      "Whether you have completed the async social-preferences survey.",
    value: (data) => (data.hasAnsweredSurvey ? "Yes" : "No"),
  },
];
