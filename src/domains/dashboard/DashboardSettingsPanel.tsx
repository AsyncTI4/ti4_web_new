import type { ReactNode } from "react";
import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconAlertCircle, IconCheck, IconSettings } from "@tabler/icons-react";
import { colors } from "@/entities/data/colors";
import { useDashboardSettings, useSaveDashboardSettings } from "@/hooks/useDashboardSettings";
import Caption from "@/shared/ui/Caption/Caption";
import {
  META_PREFERENCE_OPTIONS,
  PERSONAL_PING_INTERVAL_OPTIONS,
  SECRET_SCORING_OPTIONS,
  SUPPORT_PREFERENCE_OPTIONS,
  TAKEBACK_PREFERENCE_OPTIONS,
  VOLTRON_STYLE_OPTIONS,
  WHISPER_PREFERENCE_OPTIONS,
  WINMAKING_PREFERENCE_OPTIONS,
  toEditableSettings,
  type DashboardSettingsUpdateRequest,
} from "./userSettings";

const colorOptions = colors.map((color) => ({
  value: color.name,
  label: color.displayName ?? color.name,
}));

const afkHourOptions = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour),
  label: `${hour}:00 UTC`,
}));

type SaveState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function DashboardSettingsPanel() {
  const settingsQuery = useDashboardSettings();
  const saveMutation = useSaveDashboardSettings();
  const [draft, setDraft] = useState<DashboardSettingsUpdateRequest | null>(null);
  const [saveState, setSaveState] = useState<SaveState>(null);

  useEffect(() => {
    if (!settingsQuery.data) return;
    setDraft(toEditableSettings(settingsQuery.data));
  }, [settingsQuery.data]);

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={16} />} title="Failed to load settings">
        Try refreshing the page and logging in again if the problem persists.
      </Alert>
    );
  }

  if (settingsQuery.isLoading || !draft) {
    return (
      <Stack align="center" gap="sm" py={120}>
        <Loader size="lg" color="teal" />
        <Caption size="sm" uppercase={false}>
          Loading your settings...
        </Caption>
      </Stack>
    );
  }

  const baseline = toEditableSettings(settingsQuery.data);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(baseline);
  const createGameLockValue = settingsQuery.data.lockedFromCreatingGames
    ? settingsQuery.data.myDateTime
      ? `Locked until ${new Date(settingsQuery.data.myDateTime).toLocaleString()}`
      : "Locked"
    : "Not locked";

  async function handleSave() {
    try {
      const saved = await saveMutation.mutateAsync(draft);
      setDraft(toEditableSettings(saved));
      setSaveState({ type: "success", message: "Settings saved. Future games and prompts will use these values." });
    } catch (error) {
      setSaveState({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save settings.",
      });
    }
  }

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="lg" bg="dark.8" style={{ backdropFilter: "blur(10px)" }}>
        <Group justify="space-between" align="flex-start" gap="md">
          <Stack gap={4}>
            <Group gap={6}>
              <IconSettings size={16} color="var(--mantine-color-teal-4)" />
              <Caption size="sm">Dashboard Settings</Caption>
            </Group>
            <Text c="gray.3" size="sm">
              These controls mirror the personal preferences that were previously only practical to manage through Discord commands and buttons.
            </Text>
          </Stack>
          <Group gap="xs">
            <Badge color={isDirty ? "yellow" : "gray"} variant="light">
              {isDirty ? "Unsaved changes" : "Saved"}
            </Badge>
            <Button
              color="teal"
              leftSection={<IconCheck size={14} />}
              loading={saveMutation.isPending}
              disabled={!isDirty}
              onClick={() => void handleSave()}
            >
              Save settings
            </Button>
          </Group>
        </Group>
        {saveState && (
          <Alert
            mt="md"
            color={saveState.type === "success" ? "teal" : "red"}
            icon={saveState.type === "success" ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
          >
            {saveState.message}
          </Alert>
        )}
      </Paper>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <SettingsSection
          title="Turn Alerts And Automation"
          description="Timing, reminders, and automatic pass behavior for common Discord prompts."
        >
          <Stack gap="md">
            <Select
              label="Personal ping interval"
              description="How long the bot waits before pinging you when it becomes your turn."
              data={PERSONAL_PING_INTERVAL_OPTIONS}
              value={String(draft.personalPingInterval)}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, personalPingInterval: Number(value) });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.pingOnNextTurn}
              label="Ping on next turn"
              description="One-shot reminder that pings you the next time any of your games reaches your turn."
              onChange={(event) => {
                setDraft({ ...draft, pingOnNextTurn: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <NumberInput
              label="Auto no-sabo median"
              description="Median hours the bot should wait before auto-reacting 'No Sabo' when you do not have relevant responses. Set 0 to turn it off."
              min={0}
              max={168}
              value={draft.autoNoSaboInterval}
              onChange={(value) => {
                if (typeof value !== "number") return;
                setDraft({ ...draft, autoNoSaboInterval: value });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.prefersPassOnWhensAfters}
              label="Auto pass on whens/afters"
              description="Lets the bot auto-pass on agenda windows when you have no valid 'when' or 'after' actions."
              onChange={(event) => {
                setDraft({ ...draft, prefersPassOnWhensAfters: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.prefersPrePassOnSC}
              label="Pre-decline strategy card prompts"
              description="Prompts you to pre-decline strategy card windows so the bot can move faster when you already know you will pass."
              onChange={(event) => {
                setDraft({ ...draft, prefersPrePassOnSC: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <Select
              label="Secret scoring assistance"
              description="Controls whether the bot may automatically answer that you cannot score a secret objective."
              data={SECRET_SCORING_OPTIONS}
              value={draft.sandbagPref}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, sandbagPref: value });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.prefersWrongButtonEphemeral}
              label="Ephemeral wrong-button warning"
              description="Keeps 'these buttons are for someone else' notices visible only to you."
              onChange={(event) => {
                setDraft({ ...draft, prefersWrongButtonEphemeral: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
          </Stack>
        </SettingsSection>

        <SettingsSection
          title="Interface And Convenience"
          description="Default presentation and transaction behaviors that shape how your games feel."
        >
          <Stack gap="md">
            <MultiSelect
              label="Preferred player colors"
              description="Ordered list of colors the bot should prefer when a game lets you pick."
              searchable
              clearable
              data={colorOptions}
              value={draft.preferredColors}
              onChange={(value) => {
                setDraft({ ...draft, preferredColors: value });
                setSaveState(null);
              }}
            />
            <Select
              label="Voltron style"
              description="Chooses the visual style for your Eidolon Maximum / Voltron presentation."
              data={VOLTRON_STYLE_OPTIONS}
              value={draft.voltronStyle}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, voltronStyle: value });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.prefersDistanceBasedTacticalActions}
              label="Distance-based tactical actions"
              description="Shows tactical action choices by distance from your current position instead of by map ring."
              onChange={(event) => {
                setDraft({ ...draft, prefersDistanceBasedTacticalActions: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.showTransactables}
              label="Show transactables at transaction start"
              description="Displays player areas automatically when a transaction begins so you can see what can be traded."
              onChange={(event) => {
                setDraft({ ...draft, showTransactables: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.prefersAutoDebtClearance}
              label="Auto debt clearance"
              description="Automatically clears debt when you send trade goods or commodities."
              onChange={(event) => {
                setDraft({ ...draft, prefersAutoDebtClearance: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.prefersPillageMsg}
              label="Show Pillage flavor text"
              description="Keeps the reminder/flavor text attached to Pillage interactions."
              onChange={(event) => {
                setDraft({ ...draft, prefersPillageMsg: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <Switch
              checked={draft.prefersSarweenMsg}
              label="Show Sarween flavor text"
              description="Keeps the reminder/flavor text attached to Sarween Tools interactions."
              onChange={(event) => {
                setDraft({ ...draft, prefersSarweenMsg: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
          </Stack>
        </SettingsSection>

        <SettingsSection
          title="Availability And Presence"
          description="Global availability settings the bot uses when deciding when to nudge you."
        >
          <Stack gap="md">
            <Switch
              checked={draft.activityTracking}
              label="Activity tracking"
              description="Allows the bot to build an hourly activity profile based on when you interact. Turning this off also clears the stored activity histogram."
              onChange={(event) => {
                setDraft({ ...draft, activityTracking: event.currentTarget.checked });
                setSaveState(null);
              }}
            />
            <MultiSelect
              label="AFK hours"
              description="UTC hours during which the bot should treat you as away across all games."
              searchable
              clearable
              data={afkHourOptions}
              value={draft.afkHours.map(String)}
              onChange={(value) => {
                setDraft({ ...draft, afkHours: value.map(Number).sort((a, b) => a - b) });
                setSaveState(null);
              }}
            />
          </Stack>
        </SettingsSection>

        <SettingsSection
          title="Table Conduct Preferences"
          description="Survey-backed social preferences that help other players understand your expected table norms."
        >
          <Stack gap="md">
            <Select
              label="Whispers"
              description="Your preference for hidden deals and secret communication."
              data={WHISPER_PREFERENCE_OPTIONS}
              value={draft.whisperPref}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, whisperPref: value });
                setSaveState(null);
              }}
            />
            <Select
              label="Support for the Throne"
              description="Your preferred table rule for Support swaps and related diplomacy."
              data={SUPPORT_PREFERENCE_OPTIONS}
              value={draft.supportPref}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, supportPref: value });
                setSaveState(null);
              }}
            />
            <Select
              label="Rollback disputes"
              description="How you would prefer takeback or rollback disagreements to be settled."
              data={TAKEBACK_PREFERENCE_OPTIONS}
              value={draft.takebackPref}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, takebackPref: value });
                setSaveState(null);
              }}
            />
            <Select
              label="Winmaking stance"
              description="Your stated view on whether winmaking is acceptable and under what conditions."
              data={WINMAKING_PREFERENCE_OPTIONS}
              value={draft.winmakingPref}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, winmakingPref: value });
                setSaveState(null);
              }}
            />
            <Select
              label="Meta preference"
              description="Signals whether you dislike early aggressive 'space risk' games or slower passive 'boat float' games more."
              data={META_PREFERENCE_OPTIONS}
              value={draft.metaPref}
              onChange={(value) => {
                if (!value) return;
                setDraft({ ...draft, metaPref: value });
                setSaveState(null);
              }}
            />
          </Stack>
        </SettingsSection>
      </SimpleGrid>

      <SettingsSection
        title="System-Managed Fields"
        description="Informational values that come from account state or moderation controls and are not editable here."
      >
        <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="md">
          <ReadOnlyItem
            label="User ID"
            description="Discord account id tied to the authenticated session."
            value={settingsQuery.data.userId}
          />
          <ReadOnlyItem
            label="Game limit"
            description="Administrative cap on how many games you may create or join. This is not editable from the dashboard."
            value={String(settingsQuery.data.gameLimit)}
          />
          <ReadOnlyItem
            label="Create-game lock"
            description="Shows whether you are currently blocked from creating games."
            value={createGameLockValue}
          />
          <ReadOnlyItem
            label="Statistics opt-in"
            description="Whether you have already answered the stats visibility questions."
            value={settingsQuery.data.hasIndicatedStatPreferences ? "Provided" : "Not provided"}
          />
          <ReadOnlyItem
            label="Survey answered"
            description="Whether you have completed the async social-preferences survey."
            value={settingsQuery.data.hasAnsweredSurvey ? "Yes" : "No"}
          />
        </SimpleGrid>
      </SettingsSection>
    </Stack>
  );
}

type SettingsSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Paper withBorder radius="md" p="lg" bg="dark.8" style={{ backdropFilter: "blur(10px)" }}>
      <Stack gap="md">
        <Stack gap={4}>
          <Caption size="sm">{title}</Caption>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}

type ReadOnlyItemProps = {
  label: string;
  description: string;
  value: string;
};

function ReadOnlyItem({ label, description, value }: ReadOnlyItemProps) {
  return (
    <Paper withBorder radius="md" p="md" bg="rgba(255, 255, 255, 0.02)">
      <Text size="xs" c="gray.5" tt="uppercase" fw={700}>
        {label}
      </Text>
      <Text size="sm" c="gray.1" fw={600} mt={4}>
        {value}
      </Text>
      <Text size="xs" c="gray.6" mt={6}>
        {description}
      </Text>
    </Paper>
  );
}
