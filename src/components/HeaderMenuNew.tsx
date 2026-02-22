import {
  Group,
  Tabs,
  Box,
  useCombobox,
  Combobox,
  CheckIcon,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IconPencil } from "@tabler/icons-react";
// @ts-expect-error -- DiscordLogin is a JS module without TS defs
import { DiscordLogin } from "./DiscordLogin";
import classes from "./HeaderMenuNew.module.css";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { CircularFactionIcon } from "./shared/CircularFactionIcon";
import { generateColorGradient } from "@/lookup/colors";
import {
  useTabLabelEditing,
  type TabLabelEditingApi,
} from "@/hooks/useTabLabelEditing";
import { EditableTabLabel } from "./shared/EditableTabLabel";

type EnrichedTab = {
  id: string;
  faction: string | null;
  factionColor: string | null;
  isManaged: boolean;
};

type HeaderMenuNewProps = {
  mapId: string;
  activeTabs: EnrichedTab[];
  changeTab: (tab: string) => void;
  removeTab: (tab: string) => void;
};

export function HeaderMenuNew({
  mapId,
  activeTabs,
  changeTab,
  removeTab,
}: HeaderMenuNewProps) {
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [widthThreshold, setWidthThreshold] = useState<number | null>(null);

  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkForOverflow = () => {
      if (widthThreshold && window.innerWidth > widthThreshold) {
        setWidthThreshold(null);
        setShowDesktopDropdown(false);
        return;
      }

      if (!tabsListRef.current) return;
      const { scrollWidth, clientWidth } = tabsListRef.current;

      // Store the threshold width when switching to dropdown
      if (scrollWidth > clientWidth && !showDesktopDropdown) {
        setWidthThreshold(window.innerWidth);
        setShowDesktopDropdown(true);
      }
    };

    checkForOverflow();
    window.addEventListener("resize", checkForOverflow);
    return () => window.removeEventListener("resize", checkForOverflow);
  }, [activeTabs, showDesktopDropdown, widthThreshold]);

  const tabLabelEditing = useTabLabelEditing();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const showDropdown = showDesktopDropdown || isMobileDevice();

  return (
    <>
      <div className={classes.tabsContainer}>
        {!showDropdown ? (
          <TabView
            mapId={mapId}
            activeTabs={activeTabs}
            changeTab={changeTab}
            tabsListRef={tabsListRef}
            tabLabelEditing={tabLabelEditing}
            removeTab={removeTab}
          />
        ) : (
          <DropdownView
            mapId={mapId}
            combobox={combobox}
            changeTab={changeTab}
            activeTabs={activeTabs}
            tabLabelEditing={tabLabelEditing}
            removeTab={removeTab}
          />
        )}
      </div>
      <Box visibleFrom="sm">
        <DiscordLogin />
      </Box>
    </>
  );
}

type TabViewProps = {
  mapId: string;
  activeTabs: EnrichedTab[];
  changeTab: (tab: string) => void;
  tabsListRef: React.RefObject<HTMLDivElement | null>;
  tabLabelEditing: TabLabelEditingApi;
  removeTab: (tab: string) => void;
};

function TabView({
  mapId,
  activeTabs,
  changeTab,
  tabsListRef,
  tabLabelEditing,
  removeTab,
}: TabViewProps) {
  const { toggleEditing } = tabLabelEditing;

  return (
    <Tabs
      variant="pills"
      onChange={(value) => value && changeTab(value)}
      value={mapId}
      className={classes.tabs}
    >
      <Tabs.List className={classes.tabsList} ref={tabsListRef}>
        {activeTabs.map((tab) => (
          <Tabs.Tab
            key={tab.id}
            value={tab.id}
            className={classes.tab}
            style={
              tab.factionColor
                ? {
                    border: `2px solid`,
                    borderImage: `${generateColorGradient(tab.factionColor, 0.3)} 1`,
                    boxShadow: `inset 0 0 0 1px rgba(100, 116, 139, 0.4)`,
                  }
                : undefined
            }
            leftSection={
              tab.faction ? (
                <CircularFactionIcon faction={tab.faction} size={16} />
              ) : null
            }
            rightSection={
              <Group gap="xs">
                <IconPencil
                  size={14}
                  className={classes.editIcon}
                  onClick={(event: React.MouseEvent) =>
                    toggleEditing(tab.id, event)
                  }
                />
                {!tab.isManaged && (
                  <div
                    className={classes.closeButton}
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      removeTab(tab.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.stopPropagation();
                        removeTab(tab.id);
                      }
                    }}
                  >
                    ×
                  </div>
                )}
              </Group>
            }
          >
            <EditableTabLabel
              tabId={tab.id}
              editingApi={tabLabelEditing}
              inputProps={{
                className: classes.tabInput,
                onClick: (event) => event.stopPropagation(),
              }}
              renderDisplay={(displayName) => (
                <span className={classes.tabText}>{displayName}</span>
              )}
            />
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

type DropdownViewProps = {
  mapId: string;
  combobox: ReturnType<typeof useCombobox>;
  changeTab: (tab: string) => void;
  activeTabs: EnrichedTab[];
  tabLabelEditing: TabLabelEditingApi;
  removeTab: (tab: string) => void;
};

function DropdownView({
  mapId,
  combobox,
  changeTab,
  activeTabs,
  tabLabelEditing,
  removeTab,
}: DropdownViewProps) {
  const { toggleEditing, getDisplayName } = tabLabelEditing;

  const options = activeTabs.map((item) => (
    <Combobox.Option
      value={item.id}
      key={item.id}
      active={item.id === mapId}
      className={classes.dropdownOption}
      style={
        item.factionColor
          ? {
              border: `2px solid`,
              borderImage: `${generateColorGradient(item.factionColor, 0.3)} 1`,
              boxShadow: `inset 0 0 0 1px rgba(100, 116, 139, 0.4)`,
            }
          : undefined
      }
    >
      <Group gap="xs" style={{ width: "100%" }}>
        {item.faction && (
          <CircularFactionIcon faction={item.faction} size={12} />
        )}
        {item.id === mapId && <CheckIcon size={12} />}
        <EditableTabLabel
          tabId={item.id}
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
              <Group gap="xs">
                <IconPencil
                  size={14}
                  className={classes.editIcon}
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    toggleEditing(item.id, event);
                  }}
                />
                {!item.isManaged && (
                  <div
                    className={classes.closeButton}
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      removeTab(item.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.stopPropagation();
                        removeTab(item.id);
                      }
                    }}
                  >
                    ×
                  </div>
                )}
              </Group>
            </>
          )}
        />
      </Group>
    </Combobox.Option>
  ));

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
        {(() => {
          const currentTab = activeTabs.find((tab) => tab.id === mapId);
          return (
            <div
              className={classes.comboboxInput}
              onClick={() => combobox.openDropdown()}
              style={
                currentTab?.factionColor
                  ? {
                      border: `2px solid`,
                      borderImage: `${generateColorGradient(currentTab.factionColor, 0.3)} 1`,
                      boxShadow: `inset 0 0 0 1px rgba(100, 116, 139, 0.4)`,
                    }
                  : {
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                    }
              }
            >
              <Group
                gap="xs"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Group gap="xs">
                  {currentTab?.faction && (
                    <CircularFactionIcon
                      faction={currentTab.faction}
                      size={16}
                    />
                  )}
                  <span style={{ userSelect: "none" }}>
                    {getDisplayName(mapId)}
                  </span>
                </Group>
                <Combobox.Chevron />
              </Group>
            </div>
          );
        })()}
      </Combobox.Target>

      <Combobox.Dropdown className={classes.dropdown}>
        <Combobox.Options>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
