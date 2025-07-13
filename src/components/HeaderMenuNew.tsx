import {
  Group,
  Tabs,
  Box,
  TextInput,
  useCombobox,
  Combobox,
  InputBase,
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

type HeaderMenuNewProps = {
  mapId: string;
  activeTabs: string[];
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
  activeTabs: string[];
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
            key={tab}
            value={tab}
            className={classes.tab}
            rightSection={
              <Group gap="xs">
                <IconPencil
                  size={14}
                  className={classes.editIcon}
                  onClick={(event: React.MouseEvent) =>
                    handleEditClick(tab, event)
                  }
                />
                <div
                  className={classes.closeButton}
                  onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    removeTab(tab);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.stopPropagation();
                      removeTab(tab);
                    }
                  }}
                >
                  ×
                </div>
              </Group>
            }
          >
            {editingTab === tab ? (
              <TextInput
                ref={inputRef}
                size="xs"
                defaultValue={localStorage.getItem(tab) || tab}
                className={classes.tabInput}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTabRename(tab, e.currentTarget.value);
                  } else if (e.key === "Escape") {
                    handleTabRename(tab, tab); // Reset to original value
                  }
                }}
                onBlur={(e) => handleTabRename(tab, e.currentTarget.value)}
                autoFocus
              />
            ) : (
              <span className={classes.tabText}>
                {localStorage.getItem(tab) || tab}
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
  activeTabs: string[];
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
      value={item}
      key={item}
      active={item === mapId}
      className={classes.dropdownOption}
    >
      <Group gap="xs" style={{ width: "100%" }}>
        {item === mapId && <CheckIcon size={12} />}
        {editingTab === item ? (
          <TextInput
            ref={inputRef}
            size="xs"
            defaultValue={localStorage.getItem(item) || item}
            className={classes.tabInput}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTabRename(item, e.currentTarget.value);
              } else if (e.key === "Escape") {
                handleTabRename(item, item);
              }
            }}
            onBlur={(e) => handleTabRename(item, e.currentTarget.value)}
            autoFocus
          />
        ) : (
          <>
            <span style={{ flex: 1 }} className={classes.dropdownText}>
              {localStorage.getItem(item) || item}
            </span>
            <Group gap="xs">
              <IconPencil
                size={14}
                className={classes.editIcon}
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  handleEditClick(item, event);
                }}
              />
              <div
                className={classes.closeButton}
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  removeTab(item);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event: React.KeyboardEvent) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                    removeTab(item);
                  }
                }}
              >
                ×
              </div>
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
      zIndex={20000}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          value={localStorage.getItem(mapId) || mapId}
          className={classes.comboboxInput}
        />
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
