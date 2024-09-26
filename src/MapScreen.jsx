import {
  AppShell,
  Button,
  Group,
  Image as MantineImage,
  Loader,
  Tabs,
  useMantineTheme,
} from "@mantine/core";
import "./MapScreen.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import logo from "./assets/banner.png";
import { useMaps } from "./useMaps";
import { useMapSocket } from "./useMapSocket";
import PinchZoomMap from "./PinchZoomMap";
import { ScrollMap } from "./ScrollMap";
import "dragscroll/dragscroll.js";

function MapScreen(props) {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useMantineTheme();

  const [imageUrl, setImageUrl] = useState(null);
  const [activeTabs, setActiveTabs] = useState([]);

  const mapsQuery = useMaps();
  useMapSocket(params.mapid, setImageUrl);

  const changeTab = (tab) => {
    if (tab === params.mapid) return;
    setImageUrl(null);
    navigate(`/game/${tab}`);
  };

  useEffect(() => {
    const storedTabs = JSON.parse(localStorage.getItem("activeTabs")) || [];
    const currentGame = params.mapid;
    if (!storedTabs.includes(currentGame)) {
      storedTabs.push(currentGame);
    }

    setActiveTabs(storedTabs.filter((tab) => !!tab));
  }, [params.mapid]);

  useEffect(() => {
    if (activeTabs.length === 0) return;
    localStorage.setItem("activeTabs", JSON.stringify(activeTabs));
  }, [activeTabs]);

  const removeTab = (tabValue) => {
    const remaining = activeTabs.filter((tab) => tab !== tabValue);
    setActiveTabs(remaining);
    localStorage.setItem("activeTabs", JSON.stringify(remaining));
    if (remaining.length > 0) {
      changeTab(remaining[0]);
    } else {
      navigate("/");
    }
  };

  const defaultImageUrl = mapsQuery.data?.find(
    (v) => v.MapName === params.mapid
  )?.MapURL;

  const derivedImageUrl = imageUrl ?? defaultImageUrl;

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
          <MantineImage
            src={logo}
            alt="banner"
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            h={{ base: 12, sm: 25 }}
            p={{ base: 0, sm: 4 }}
            w="auto"
            fit="contain"
          />
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
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <div className="main">
          <div className="imageContainer">
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
            {isTouchDevice() ? (
              <PinchZoomMap imageUrl={derivedImageUrl} />
            ) : (
              <ScrollMap imageUrl={derivedImageUrl} />
            )}
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

export default MapScreen;
