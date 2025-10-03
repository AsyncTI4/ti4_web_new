import {
  Group,
  Tabs,
  Box,
  TextInput,
  useCombobox,
  Combobox,
  CheckIcon,
  Anchor,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IconPencil } from "@tabler/icons-react";
// @ts-ignore
import { DiscordLogin } from "./DiscordLogin";
import { Link } from "react-router-dom";
import classes from "./HeaderMenuNew.module.css";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { CircularFactionIcon } from "./shared/CircularFactionIcon";
import { generateColorGradient } from "@/lookup/colors";

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

  const inputRef = useRef<HTMLInputElement>(null);
  const [editingTab, setEditingTab] = useState<string | null>(null);

  const handleEditClick = (tab: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (editingTab === tab) {
      if (inputRef.current) handleTabRename(tab, inputRef.current.value);
      setEditingTab(null);
    } else {
      setEditingTab(tab);
    }
  };

  const handleTabRename = (oldTab: string, newTab: string) => {
    if (oldTab !== newTab) localStorage.setItem(oldTab, newTab);
    setEditingTab(null);
  };

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const showDropdown = showDesktopDropdown || isMobileDevice();

  return (
    <>
      {!isMobileDevice() && (
        <Anchor
          to="/games"
          size="sm"
          fw={600}
          underline="hover"
          c="orange"
          ml="sm"
          mr="sm"
          component={Link}
          className={classes.gamesLink}
        >
          All Games
        </Anchor>
      )}
      <div className={classes.tabsContainer}>
        {!showDropdown ? (
          <TabView
            mapId={mapId}
            activeTabs={activeTabs}
            changeTab={changeTab}
            tabsListRef={tabsListRef}
            editingTab={editingTab}
            inputRef={inputRef}
            handleEditClick={handleEditClick}
            handleTabRename={handleTabRename}
            removeTab={removeTab}
          />
        ) : (
          <DropdownView
            mapId={mapId}
            combobox={combobox}
            changeTab={changeTab}
            activeTabs={activeTabs}
            editingTab={editingTab}
            inputRef={inputRef}
            handleEditClick={handleEditClick}
            handleTabRename={handleTabRename}
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
  editingTab: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleEditClick: (tab: string, event: React.MouseEvent) => void;
  handleTabRename: (oldTab: string, newTab: string) => void;
  removeTab: (tab: string) => void;
};

function TabView({
  mapId,
  activeTabs,
  changeTab,
  tabsListRef,
  editingTab,
  inputRef,
  handleEditClick,
  handleTabRename,
  removeTab,
}: TabViewProps) {
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
                    handleEditClick(tab.id, event)
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
            {editingTab === tab.id ? (
              <TextInput
                ref={inputRef}
                size="xs"
                defaultValue={localStorage.getItem(tab.id) || tab.id}
                className={classes.tabInput}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTabRename(tab.id, e.currentTarget.value);
                  } else if (e.key === "Escape") {
                    handleTabRename(tab.id, tab.id); // Reset to original value
                  }
                }}
                onBlur={(e) => handleTabRename(tab.id, e.currentTarget.value)}
                autoFocus
              />
            ) : (
              <span className={classes.tabText}>
                {localStorage.getItem(tab.id) || tab.id}
              </span>
            )}
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
  editingTab: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleEditClick: (tab: string, event: React.MouseEvent) => void;
  handleTabRename: (oldTab: string, newTab: string) => void;
  removeTab: (tab: string) => void;
};

function DropdownView({
  mapId,
  combobox,
  changeTab,
  activeTabs,
  editingTab,
  inputRef,
  handleEditClick,
  handleTabRename,
  removeTab,
}: DropdownViewProps) {
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
        {editingTab === item.id ? (
          <TextInput
            ref={inputRef}
            size="xs"
            defaultValue={localStorage.getItem(item.id) || item.id}
            className={classes.tabInput}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTabRename(item.id, e.currentTarget.value);
              } else if (e.key === "Escape") {
                handleTabRename(item.id, item.id);
              }
            }}
            onBlur={(e) => handleTabRename(item.id, e.currentTarget.value)}
            autoFocus
          />
        ) : (
          <>
            <span style={{ flex: 1 }} className={classes.dropdownText}>
              {localStorage.getItem(item.id) || item.id}
            </span>
            <Group gap="xs">
              <IconPencil
                size={14}
                className={classes.editIcon}
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  handleEditClick(item.id, event);
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
                    {localStorage.getItem(mapId) || mapId}
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
