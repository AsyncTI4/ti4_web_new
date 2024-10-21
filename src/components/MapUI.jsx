import {
  AppShell,
  Button,
  Group,
  Loader,
  Tabs,
  useMantineTheme,
  Box,
  TextInput,
} from "@mantine/core";
import { Atom } from "react-loading-indicators";

import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "./DiscordLogin";

import "./MapScreen.css";
import "dragscroll/dragscroll.js";
import Logo from "./Logo";
import { useRef, useState } from "react";
import { IconPencil } from "@tabler/icons-react";

function MapUI({
  activeTabs,
  params,
  changeTab,
  removeTab,
  imageUrl,
  derivedImageUrl,
  defaultImageUrl,
}) {
  const inputRef = useRef(null);
  const [editingTab, setEditingTab] = useState(null);

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
    if (oldTab !== newTab) {
      localStorage.setItem(oldTab, newTab);
      // You might want to update the activeTabs state here as well
      // and propagate the change to the parent component
    }
    setEditingTab(null);
  };

  const theme = useMantineTheme();

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group
          align="center"
          h="100%"
          px="sm"
          gap="sm"
          style={{ flexWrap: "nowrap" }}
        >
          <Logo />
          <div className="logo-divider" />
          <div style={{ overflow: "hidden", flexGrow: 1 }}>
            <Tabs
              variant="pills"
              onChange={(value) => changeTab(value)}
              value={params.mapid}
            >
              <Tabs.List>
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
                        {tab === params.mapid &&
                        !imageUrl &&
                        defaultImageUrl ? (
                          <Loader size="xs" color={theme.colors.blue[1]} />
                        ) : (
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
                        )}
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
          </div>
          <Box visibleFrom="sm">
            <DiscordLogin />
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <div className="main">
          <div className="imageContainer">
            <Box p="xs" hiddenFrom="sm">
              <DiscordLogin />
            </Box>

            {!derivedImageUrl ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100vh - 110px)",
                  width: "100%",
                }}
              >
                <Atom
                  color={theme.colors.blue[5]}
                  size="large"
                  text="Loading"
                />
              </div>
            ) : undefined}

            <ScrollMap imageUrl={derivedImageUrl} />
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default MapUI;
