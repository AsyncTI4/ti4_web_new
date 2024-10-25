import {
  AppShell,
  Button,
  Group,
  Loader,
  Tabs,
  useMantineTheme,
  Box,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { Atom } from "react-loading-indicators";

import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "./DiscordLogin";

import "./MapScreen.css";
import Logo from "./Logo";
import { useRef, useState } from "react";
import { IconPencil, IconRefresh } from "@tabler/icons-react";

function MapUI({
  activeTabs,
  params,
  changeTab,
  removeTab,
  imageUrl,
  reconnect,
  isReconnecting,
  showRefresh,
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
    if (oldTab !== newTab) localStorage.setItem(oldTab, newTab);
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

            {!imageUrl ? (
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
            <ScrollMap gameId={params.mapid} imageUrl={imageUrl} />

            {/* New refresh button */}
            {showRefresh && (
              <Button
                variant="filled"
                size="md"
                radius="xl"
                leftSection={<IconRefresh size={20} />}
                style={{
                  position: "fixed",
                  top: "80px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1000,
                }}
                onClick={reconnect}
                loading={isReconnecting}
              >
                Refresh
              </Button>
            )}
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default MapUI;
