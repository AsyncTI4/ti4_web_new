import type { ReactNode } from "react";
import {
  Button,
  Loader,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
} from "@/ds";
import { useEffect, useState } from "react";
import { IconBell, IconCheck, IconPalette, IconUsers } from "@tabler/icons-react";
import {
  useDashboardSettings,
  useSaveDashboardSettings,
} from "@/domains/dashboard/hooks/useDashboardSettings";
import { AuthPrompt } from "@/domains/auth/AuthPrompt";
import { toEditableSettings } from "./userSettings";
import {
  EDITABLE_SECTIONS,
  READ_ONLY_FIELDS,
  type FieldSpec,
  type Settings,
} from "./dashboardSettingsFields";

import classes from "./DashboardSettingsPanel.module.css";

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
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className ? `${classes.section} ${className}` : classes.section}>
      <header className={classes.sectionHead}>
        <h2 className={classes.sectionTitle}>{title}</h2>
        <p className={classes.sectionLede}>{description}</p>
      </header>
      {children}
    </section>
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
    <div className={classes.readOnlyItem}>
      <span className={classes.label}>{label}</span>
      <span className={classes.readOnlyValue}>{value}</span>
      <span className={classes.readOnlyNote}>{description}</span>
    </div>
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
  return (
    <header className={classes.head}>
      <div className={classes.headText}>
        <span className={classes.label}>Dashboard settings</span>
        <h1 className={classes.title}>Your bot preferences</h1>
        <p className={classes.lede}>
          The same preferences you can set with Discord commands and buttons.
          They apply to every game you play.
        </p>
      </div>
      <div className={classes.actions}>
        <span className={classes.state} data-dirty={isDirty || undefined}>
          {isDirty ? "Unsaved changes" : "Saved"}
        </span>
        <Button
          variant="filled"
          leftSection={<IconCheck size={14} />}
          loading={isSaving}
          disabled={!isDirty}
          onClick={onSave}
        >
          Save settings
        </Button>
      </div>
      {saveState && (
        <div
          className={classes.result}
          role="status"
          data-error={saveState.type === "error" || undefined}
        >
          {saveState.message}
        </div>
      )}
    </header>
  );
}

function SettingsLoader() {
  return (
    <div className={classes.loading}>
      <Loader size="md" />
      Loading your settings…
    </div>
  );
}

const LOGGED_OUT_ITEMS = [
  { icon: <IconBell size={14} />, label: "Turn pings and auto-pass timing" },
  { icon: <IconPalette size={14} />, label: "Preferred colours and display options" },
  { icon: <IconUsers size={14} />, label: "Table-talk and deal preferences" },
];

function isUnauthorized(error: unknown) {
  return (error as { status?: number } | null)?.status === 401;
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
    if (isUnauthorized(settingsQuery.error)) {
      return (
        <AuthPrompt
          kicker="Dashboard settings"
          title="Log in to change your settings"
          body="These are the preferences the bot uses in your games. Log in with Discord to read and change them."
          items={LOGGED_OUT_ITEMS}
        />
      );
    }
    return (
      <AuthPrompt
        kicker="Dashboard settings"
        title="Your settings didn't load"
        body="The game server didn't answer. Refresh the page, or log in again if it keeps failing."
        buttonLabel="Log in again"
      />
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
    <div className={classes.panel}>
      <SaveHeader
        isDirty={isDirty}
        isSaving={saveMutation.isPending}
        saveState={saveState}
        onSave={() => void handleSave()}
      />

      <div className={classes.grid}>
        {EDITABLE_SECTIONS.map((section) => (
          <SettingsSection
            key={section.title}
            title={section.title}
            description={section.description}
          >
            <div className={classes.fields}>
              {section.fields.map((field) => (
                <SettingField
                  key={field.key}
                  field={field}
                  draft={draft}
                  updateDraft={updateDraft}
                />
              ))}
            </div>
          </SettingsSection>
        ))}
      </div>

      <SettingsSection
        title="Set by the server"
        description="Values that come from your account state or moderation. You can't change them here."
      >
        <div className={classes.readOnly}>
          {READ_ONLY_FIELDS.map((field) => (
            <ReadOnlyItem
              key={field.label}
              label={field.label}
              description={field.description}
              value={field.value(data)}
            />
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
