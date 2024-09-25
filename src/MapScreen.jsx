import {
  AppShell,
  Button,
  Group,
  Loader,
  Tabs,
  useMantineTheme,
} from "@mantine/core";
import "./MapScreen.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import logo from "./assets/banner.png";
import { useMaps } from "./useMaps";
import { useMapSocket } from "./useMapSocket";
import { ZoomControls } from "./ZoomControls";

function MapScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useMantineTheme();

  const [zoom, setZoom] = useState(1);
  const imageRef = useRef(null);
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

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      if (prevZoom === undefined) return 1;
      return Math.min(prevZoom + 0.25, 2);
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      if (prevZoom === undefined) return 1;
      return Math.max(prevZoom - 0.25, 0.5);
    });
  };

  const handleZoomReset = () => {
    setZoom(undefined);
  };

  const zoomPercent = zoom
    ? (zoom * 100).toFixed(0).toString() + "%"
    : undefined;

  const defaultImageUrl = mapsQuery.data?.find(
    (v) => v.MapName === params.mapid
  )?.MapURL;

  const derivedImageUrl = imageUrl ?? defaultImageUrl;

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group align="center" h="100%" px="sm" gap="sm">
          <img
            src={logo}
            alt="banner"
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          <div className="logo-divider" />
          <Group>
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
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <div
          className="main"
          style={{ color: "white", backgroundColor: "#222" }}
        >
          <div className="imageContainer">
            <ZoomControls
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
            />

            {derivedImageUrl ? (
              <img
                ref={imageRef}
                alt="map"
                src={derivedImageUrl}
                style={{
                  width: zoomPercent,
                  imageRendering: "crisp-edges",
                }}
              />
            ) : (
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
            )}
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default MapScreen;
