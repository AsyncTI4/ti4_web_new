import {
  Button,
  Group,
  Tabs,
  Box,
  TextInput,
  Select,
  useCombobox,
  Combobox,
  InputBase,
  CheckIcon,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IconPencil } from "@tabler/icons-react";
import { DiscordLogin } from "./DiscordLogin";

import "./MapScreen.css";

export function HeaderMenu({ mapId, activeTabs, changeTab, removeTab }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [widthThreshold, setWidthThreshold] = useState(null);

  const tabsListRef = useRef(null);

  useEffect(() => {
    const checkForOverflow = () => {
      if (widthThreshold && window.innerWidth > widthThreshold) {
        setWidthThreshold(null);
        setShowDropdown(false);
        return;
      }

      if (!tabsListRef.current) return;
      const { scrollWidth, clientWidth } = tabsListRef.current;

      // Store the threshold width when switching to dropdown
      if (scrollWidth > clientWidth && !showDropdown) {
        setWidthThreshold(window.innerWidth);
        setShowDropdown(true);
      }
    };

    checkForOverflow();
    window.addEventListener("resize", checkForOverflow);
    return () => window.removeEventListener("resize", checkForOverflow);
  }, [activeTabs, showDropdown, widthThreshold]);

  const inputRef = useRef(null);
  const [editingTab, setEditingTab] = useState(null);

  const [value, setValue] = useState(null);
  const [search, setSearch] = useState("");

  const handleEditClick = (tab, event) => {
    event.stopPropagation();
    if (editingTab === tab) {
      if (inputRef.current) handleTabRename(tab, inputRef.current.value);
      setEditingTab(null);
    } else {
      setEditingTab(tab);
    }
  };

  const handleTabRename = (oldTab, newTab) => {
    if (oldTab !== newTab) localStorage.setItem(oldTab, newTab);
    setEditingTab(null);
  };

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = activeTabs.map((item) => (
    <Combobox.Option value={item} key={item} active={item == mapId}>
      <Group gap="xs" style={{ width: "100%" }}>
        {item === mapId && <CheckIcon size={12} />}
        {editingTab === item ? (
          <TextInput
            ref={inputRef}
            size="xs"
            defaultValue={localStorage.getItem(item) || item}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTabRename(item, e.currentTarget.value);
              } else if (e.key === "Escape") {
                setEditingTab(null);
              }
            }}
            onBlur={(e) => handleTabRename(item, e.currentTarget.value)}
            autoFocus
          />
        ) : (
          <>
            <span style={{ flex: 1 }}>
              {localStorage.getItem(item) || item}
            </span>
            <Group gap="xs">
              <IconPencil
                size={14}
                style={{ cursor: "pointer" }}
                onClick={(event) => handleEditClick(item, event)}
              />
              <Button
                size="compact-xs"
                color="red"
                onClick={(event) => {
                  event.stopPropagation();
                  removeTab(item);
                }}
              >
                x
              </Button>
            </Group>
          </>
        )}
      </Group>
    </Combobox.Option>
  ));

  return (
    <>
      <div style={{ flex: 1 }}>
        {!showDropdown && (
          <Tabs
            variant="pills"
            onChange={(value) => changeTab(value)}
            value={mapId}
          >
            <Tabs.List className="tabs-scrollable" ref={tabsListRef}>
              {activeTabs.map((tab) => (
                <Tabs.Tab
                  key={tab}
                  value={tab}
                  rightSection={
                    <Group gap="xs">
                      <IconPencil
                        size={14}
                        style={{ cursor: "pointer" }}
                        onClick={(event) => handleEditClick(tab, event)}
                      />

                      <Button
                        size="compact-xs"
                        color="red"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeTab(tab);
                        }}
                      >
                        x
                      </Button>
                    </Group>
                  }
                >
                  {editingTab === tab ? (
                    <TextInput
                      ref={inputRef}
                      size="xs"
                      defaultValue={localStorage.getItem(tab) || tab}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTabRename(tab, e.currentTarget.value);
                        } else if (e.key === "Escape") {
                          setEditingTab(null);
                        }
                      }}
                      onBlur={(e) =>
                        handleTabRename(tab, e.currentTarget.value)
                      }
                      autoFocus
                    />
                  ) : (
                    localStorage.getItem(tab) || tab
                  )}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        )}

        {showDropdown && (
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              combobox.closeDropdown();
              changeTab(val);
            }}
          >
            <Combobox.Target>
              <InputBase
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => combobox.openDropdown()}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => {
                  combobox.closeDropdown();
                }}
                value={localStorage.getItem(mapId) || mapId}
                styles={{ input: { cursor: "pointer" } }}
              />
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>
                {options.length > 0 ? (
                  options
                ) : (
                  <Combobox.Empty>Nothing found</Combobox.Empty>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        )}
      </div>
      <Box visibleFrom="sm">
        <DiscordLogin />
      </Box>
    </>
  );
}
