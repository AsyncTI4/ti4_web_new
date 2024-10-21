import {
  AppShell,
  Button,
  Group,
  Loader,
  Tabs,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { Atom } from "react-loading-indicators";

import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "./DiscordLogin";

import "./MapScreen.css";
import "dragscroll/dragscroll.js";
import Logo from "./Logo";

function MapUI({
  activeTabs,
  params,
  changeTab,
  removeTab,
  imageUrl,
  derivedImageUrl,
  defaultImageUrl,
}) {
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
              <Tabs.List
                style={{
                  flexWrap: "nowrap",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {activeTabs.map((tab) => (
                  <Tabs.Tab
                    key={tab}
                    value={tab}
                    rightSection={
                      <Group gap="xs">
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
                    {tab}
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
