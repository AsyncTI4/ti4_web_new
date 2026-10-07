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
import {
  useDashboardSettings,
  useSaveDashboardSettings,
} from "@/domains/dashboard/hooks/useDashboardSettings";
import Caption from "@/shared/ui/Caption/Caption";
import { toEditableSettings } from "./userSettings";
import {
  EDITABLE_SECTIONS,
  READ_ONLY_FIELDS,
  type FieldSpec,
  type Settings,
} from "./dashboardSettingsFields";

const PANEL_PROPS = {
  withBorder: true,
  radius: "md",
  p: "lg",
  bg: "dark.8",
  style: { backdropFilter: "blur(10px)" },
} as const;

type SaveState = { type: "success" | "error"; message: string } | null;

function SettingField({
  field,
  draft,
  updateDraft,
}: {
  field: FieldSpec;
  draft: Settings;
  updateDraft: (patch: Partial<Settings>) => void;
}) {
  const { label, description } = field;

  switch (field.kind) {
    case "switch":
      return (
        <Switch
          label={label}
          description={description}
          checked={draft[field.key]}
          onChange={(event) =>
            updateDraft({ [field.key]: event.currentTarget.checked })
          }
        />
      );
    case "select":
      return (
        <Select
          label={label}
          description={description}
          data={field.data}
          value={draft[field.key]}
          onChange={(value) => {
            if (value) updateDraft({ [field.key]: value });
          }}
        />
      );
    case "numberSelect":
      return (
        <Select
          label={label}
          description={description}
          data={field.data}
          value={String(draft[field.key])}
          onChange={(value) => {
            if (value) updateDraft({ [field.key]: Number(value) });
          }}
        />
      );
    case "number":
      return (
        <NumberInput
          label={label}
          description={description}
          min={field.min}
          max={field.max}
          value={draft[field.key]}
          onChange={(value) => {
            if (typeof value === "number") updateDraft({ [field.key]: value });
          }}
        />
      );
    case "multiSelect":
      return (
        <MultiSelect
          label={label}
          description={description}
          searchable
          clearable
          data={field.data}
          value={draft[field.key]}
          onChange={(value) => updateDraft({ [field.key]: value })}
        />
      );
    case "hourMultiSelect":
      return (
        <MultiSelect
          label={label}
          description={description}
          searchable
          clearable
          data={field.data}
          value={draft[field.key].map(String)}
          onChange={(value) =>
            updateDraft({
              [field.key]: value.map(Number).sort((a, b) => a - b),
            })
          }
        />
      );
  }
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Paper {...PANEL_PROPS}>
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

function ReadOnlyItem({
  label,
  description,
  value,
}: {
  label: string;
  description: string;
  value: string;
}) {
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

function SaveHeader({
  isDirty,
  isSaving,
  saveState,
  onSave,
}: {
  isDirty: boolean;
  isSaving: boolean;
  saveState: SaveState;
  onSave: () => void;
}) {
  const succeeded = saveState?.type === "success";
  return (
    <Paper {...PANEL_PROPS}>
      <Group justify="space-between" align="flex-start" gap="md">
        <Stack gap={4}>
          <Group gap={6}>
            <IconSettings size={16} color="var(--mantine-color-teal-4)" />
            <Caption size="sm">Dashboard Settings</Caption>
          </Group>
          <Text c="gray.3" size="sm">
            These controls mirror the personal preferences that were previously
            only practical to manage through Discord commands and buttons.
          </Text>
        </Stack>
        <Group gap="xs">
          <Badge color={isDirty ? "yellow" : "gray"} variant="light">
            {isDirty ? "Unsaved changes" : "Saved"}
          </Badge>
          <Button
            color="teal"
            leftSection={<IconCheck size={14} />}
            loading={isSaving}
            disabled={!isDirty}
            onClick={onSave}
          >
            Save settings
          </Button>
        </Group>
      </Group>
      {saveState && (
        <Alert
          mt="md"
          color={succeeded ? "teal" : "red"}
          icon={
            succeeded ? <IconCheck size={16} /> : <IconAlertCircle size={16} />
          }
        >
          {saveState.message}
        </Alert>
      )}
    </Paper>
  );
}

function SettingsLoader() {
  return (
    <Stack align="center" gap="sm" py={120}>
      <Loader size="lg" color="teal" />
      <Caption size="sm" uppercase={false}>
        Loading your settings...
      </Caption>
    </Stack>
  );
}

export function DashboardSettingsPanel() {
  const settingsQuery = useDashboardSettings();
  const saveMutation = useSaveDashboardSettings();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [saveState, setSaveState] = useState<SaveState>(null);

  useEffect(() => {
    if (!settingsQuery.data) return;
    setDraft(toEditableSettings(settingsQuery.data));
  }, [settingsQuery.data]);

  if (settingsQuery.isLoading) return <SettingsLoader />;

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <Alert
        color="red"
        icon={<IconAlertCircle size={16} />}
        title="Failed to load settings"
      >
        Try refreshing the page and logging in again if the problem persists.
      </Alert>
    );
  }

  if (!draft) return <SettingsLoader />;

  const data = settingsQuery.data;

  const updateDraft = (patch: Partial<Settings>) => {
    setDraft({ ...draft, ...patch });
    setSaveState(null);
  };

  const isDirty =
    JSON.stringify(draft) !== JSON.stringify(toEditableSettings(data));

  const handleSave = async () => {
    try {
      const saved = await saveMutation.mutateAsync(draft);
      setDraft(toEditableSettings(saved));
      setSaveState({
        type: "success",
        message:
          "Settings saved. Future games and prompts will use these values.",
      });
    } catch (error) {
      setSaveState({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to save settings.",
      });
    }
  };

  return (
    <Stack gap="md">
      <SaveHeader
        isDirty={isDirty}
        isSaving={saveMutation.isPending}
        saveState={saveState}
        onSave={() => void handleSave()}
      />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        {EDITABLE_SECTIONS.map((section) => (
          <SettingsSection
            key={section.title}
            title={section.title}
            description={section.description}
          >
            <Stack gap="md">
              {section.fields.map((field) => (
                <SettingField
                  key={field.key}
                  field={field}
                  draft={draft}
                  updateDraft={updateDraft}
                />
              ))}
            </Stack>
          </SettingsSection>
        ))}
      </SimpleGrid>

      <SettingsSection
        title="System-Managed Fields"
        description="Informational values that come from account state or moderation controls and are not editable here."
      >
        <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="md">
          {READ_ONLY_FIELDS.map((field) => (
            <ReadOnlyItem
              key={field.label}
              label={field.label}
              description={field.description}
              value={field.value(data)}
            />
          ))}
        </SimpleGrid>
      </SettingsSection>
    </Stack>
  );
}
