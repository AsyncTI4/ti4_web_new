import {
  AppShell,
  Button,
  Group,
  Loader,
  Tabs,
  useMantineTheme,
  Box,
  TextInput,
  Paper,
  ActionIcon,
  Image,
  Text,
  Collapse,
  Stack,
} from "@mantine/core";
import { Atom } from "react-loading-indicators";

import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "./DiscordLogin";
import ScoreBoard from "./ScoreBoard";
import "./MapScreen.css";
import "dragscroll/dragscroll.js";
import Logo from "./Logo";
import { useRef, useState, useEffect } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconPencil,
} from "@tabler/icons-react";

import PlayerCard2 from "./PlayerCard2";
import PlayerCardBack from "./PlayerCardBack";
import { pbdPlayerData } from "../data/pbd10242";

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
  const playerCardRef = useRef(null);

  // Create color to faction mapping from player data
  const colorToFaction = pbdPlayerData.reduce((acc, player) => {
    acc[player.color] = player.faction;
    return acc;
  }, {});

  useEffect(() => {
    const handleScroll = () => {
      if (playerCardRef.current) {
        const scrollLeft =
          window.scrollX || document.documentElement.scrollLeft;
        requestAnimationFrame(() => {
          if (playerCardRef.current) {
            playerCardRef.current.style.transform = `translateX(${scrollLeft}px)`;
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

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
            <ScrollMap gameId={params.mapid} imageUrl={derivedImageUrl} />

            {/* <Paper
              shadow="sm"
              style={{
                width: 350,
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 1000,
                backgroundColor: "transparent",
              }}
            >
              <Group
                justify="space-between"
                align="center"
                bg="dark.8"
                className="title-bar"
                style={{
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  borderBottom: !isPanelCollapsed
                    ? "1px solid #2C2E33"
                    : "none",
                }}
              >
                <Text m="xs" c="gray.4" fz="xs" fw={500} ff="monospace">
                  Active System
                </Text>
                <ActionIcon
                  onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                  color="gray"
                  variant="subtle"
                  size="sm"
                  mr="xs"
                >
                  {!isPanelCollapsed ? (
                    <IconChevronUp size={14} />
                  ) : (
                    <IconChevronDown size={14} />
                  )}
                </ActionIcon>
              </Group>
              <Collapse in={!isPanelCollapsed}>
                <Paper p="xs" bg="dark.7">
                  <Image
                    src="https://cdn.discordapp.com/attachments/1297368312136732673/1297368315685240925/pbd5497_2024.10.20_-_01.18.29.520.jpg?ex=6718f7a6&is=6717a626&hm=84e59ef6d63649c5d68f1fbf6a4b323e1c9afaddb814c00f026e66608f964ea7&"
                    alt="Active System Visualization"
                    radius="sm"
                    style={{ border: "1px solid #2C2E33" }}
                  />
                </Paper>
              </Collapse>
            </Paper> */}
            <Box pos="relative">
              <div
                ref={playerCardRef}
                style={{
                  transform: `translateX(0px), translateY(-1000px)`,
                  zIndex: 1000,
                  top: -2660,
                  position: "absolute",
                  background: "#171b2c",
                }}
              >
                <Stack gap="lg">
                  {/* <ScoreBoard /> */}
                  {pbdPlayerData.map((player) => (
                    <PlayerCard2
                      key={player.id}
                      playerData={player}
                      colorToFaction={colorToFaction}
                    />
                  ))}
                  {/* <PlayerCard2 />
                  <PlayerCard2 />
                  <PlayerCard2 />
                  <PlayerCard2 /> */}
                </Stack>
              </div>
            </Box>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default MapUI;
