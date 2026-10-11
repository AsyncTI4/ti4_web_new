import { useState } from "react";
import { CheckIcon, Group, Popover, UnstyledButton } from "@/ds";
import type { EnrichedTab } from "@/domains/tabs/hooks/useTabManagement";
import type { TabLabelEditingApi } from "@/domains/tabs/hooks/useTabLabelEditing";
import { EditableTabLabel } from "@/domains/tabs/components/EditableTabLabel";
import { factionTabStyle, TabActions, TabFactionIcon } from "./HeaderTabParts";
import classes from "./HeaderMenu.module.css";

type TabViewProps = {
  mapId: string;
  activeTabs: EnrichedTab[];
  changeTab: (tab: string) => void;
  removeTab: (tab: string) => void;
  tabLabelEditing: TabLabelEditingApi;
};

function TabOption({
  tab,
  isCurrent,
  tabLabelEditing,
  removeTab,
  onSelect,
}: {
  tab: EnrichedTab;
  isCurrent: boolean;
  tabLabelEditing: TabLabelEditingApi;
  removeTab: (tab: string) => void;
  onSelect: (tab: string) => void;
}) {
  return (
    <div
      role="option"
      aria-selected={isCurrent}
      tabIndex={0}
      data-combobox-selected={isCurrent || undefined}
      className={classes.dropdownOption}
      style={factionTabStyle(tab.factionColor)}
      onClick={() => onSelect(tab.id)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onSelect(tab.id);
      }}
    >
      <Group gap="xs" wrap="nowrap" style={{ width: "100%" }}>
        <TabFactionIcon tab={tab} size={12} />
        {isCurrent && <CheckIcon size={12} />}
        <EditableTabLabel
          tabId={tab.id}
          editingApi={tabLabelEditing}
          inputProps={{
            className: classes.tabInput,
            style: { flex: 1 },
            onClick: (event) => event.stopPropagation(),
          }}
          renderDisplay={(displayName) => (
            <>
              <span style={{ flex: 1 }} className={classes.dropdownText}>
                {displayName}
              </span>
              <TabActions
                tab={tab}
                onEdit={(event) => {
                  event.preventDefault();
                  tabLabelEditing.toggleEditing(tab.id, event);
                }}
                onClose={() => removeTab(tab.id)}
              />
            </>
          )}
        />
      </Group>
    </div>
  );
}

/** The narrow-screen tab picker: the current game, with every open game below. */
export function TabDropdownView({
  mapId,
  activeTabs,
  changeTab,
  removeTab,
  tabLabelEditing,
}: TabViewProps) {
  const [opened, setOpened] = useState(false);
  const currentTab = activeTabs.find((tab) => tab.id === mapId);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      offset={4}
      zIndex="var(--z-header-menu)"
    >
      <Popover.Target>
        <UnstyledButton
          aria-haspopup="listbox"
          aria-expanded={opened}
          className={classes.comboboxInput}
          onClick={() => setOpened((o) => !o)}
          style={
            factionTabStyle(currentTab?.factionColor) ?? {
              border: "1px solid rgba(59, 130, 246, 0.3)",
            }
          }
        >
          <Group gap="xs" w="100%" justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <TabFactionIcon tab={currentTab} size={16} />
              <span style={{ userSelect: "none" }}>
                {tabLabelEditing.getDisplayName(mapId)}
              </span>
            </Group>
            <span aria-hidden style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
          </Group>
        </UnstyledButton>
      </Popover.Target>

      <Popover.Dropdown className={classes.dropdown} style={{ minWidth: 220 }} p={4}>
        <div role="listbox" aria-label="Open games">
          {activeTabs.length === 0 && (
            <div className={classes.dropdownText} style={{ padding: 8 }}>
              No games open
            </div>
          )}
          {activeTabs.map((tab) => (
            <TabOption
              key={tab.id}
              tab={tab}
              isCurrent={tab.id === mapId}
              tabLabelEditing={tabLabelEditing}
              removeTab={removeTab}
              onSelect={(id) => {
                setOpened(false);
                changeTab(id);
              }}
            />
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
