import { Group, useCombobox, Combobox, CheckIcon } from "@mantine/core";
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
}: {
  tab: EnrichedTab;
  isCurrent: boolean;
  tabLabelEditing: TabLabelEditingApi;
  removeTab: (tab: string) => void;
}) {
  return (
    <Combobox.Option
      value={tab.id}
      active={isCurrent}
      className={classes.dropdownOption}
      style={factionTabStyle(tab.factionColor)}
    >
      <Group gap="xs" style={{ width: "100%" }}>
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
    </Combobox.Option>
  );
}

export function TabDropdownView({
  mapId,
  activeTabs,
  changeTab,
  removeTab,
  tabLabelEditing,
}: TabViewProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const currentTab = activeTabs.find((tab) => tab.id === mapId);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        combobox.closeDropdown();
        changeTab(val);
      }}
      styles={{ dropdown: { zIndex: "var(--z-header-menu)" } }}
    >
      <Combobox.Target>
        <div
          className={classes.comboboxInput}
          onClick={() => combobox.openDropdown()}
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
            <Combobox.Chevron />
          </Group>
        </div>
      </Combobox.Target>

      <Combobox.Dropdown
        className={classes.dropdown}
        style={{ minWidth: "220px" }}
      >
        <Combobox.Options>
          {activeTabs.length === 0 && (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
          {activeTabs.map((tab) => (
            <TabOption
              key={tab.id}
              tab={tab}
              isCurrent={tab.id === mapId}
              tabLabelEditing={tabLabelEditing}
              removeTab={removeTab}
            />
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
