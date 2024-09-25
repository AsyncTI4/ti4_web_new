import {
  AppShell,
  Button,
  Group,
  Loader,
  Tabs,
  useMantineTheme,
} from "@mantine/core";
import "./MapScreen.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import logo from "./assets/banner.png";
import { useMaps } from "./useMaps";
import { useMapSocket } from "./useMapSocket";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

  const [container, setContainer] = useState(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [imageNaturalWidth, setImageNaturalWidth] = useState(0);
  const [imageNaturalHeight, setImageNaturalHeight] = useState(0);

  const scaleUp = true;
  const zoomFactor = 8;

  const imageScale = useMemo(() => {
    if (
      containerWidth === 0 ||
      containerHeight === 0 ||
      imageNaturalWidth === 0 ||
      imageNaturalHeight === 0
    )
      return 0;

    const scale = containerWidth / imageNaturalWidth;
    return scaleUp ? scale : Math.max(scale, 1);
  }, [
    scaleUp,
    containerWidth,
    containerHeight,
    imageNaturalWidth,
    imageNaturalHeight,
  ]);

  const handleResize = useCallback(() => {
    if (container !== null) {
      const rect = container.getBoundingClientRect();
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    } else {
      setContainerWidth(0);
      setContainerHeight(0);
    }
  }, [container]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleImageOnLoad = (image) => {
    setImageNaturalWidth(image.naturalWidth);
    setImageNaturalHeight(image.naturalHeight);
  };

  useEffect(() => {
    if (!derivedImageUrl) return;
    const image = new Image();
    image.onload = () => handleImageOnLoad(image);
    image.src = derivedImageUrl;
  }, [derivedImageUrl]);

  console.log("derivedImageUrl", derivedImageUrl);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group align="center" h="100%" px="sm" gap="sm" style={{ flexWrap: 'nowrap' }}>
          <img
            src={logo}
            alt="banner"
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          <div className="logo-divider" />
          <div style={{ overflow: "hidden", flexGrow: 1 }}>
            <Tabs
              variant="pills"
              onChange={(value) => changeTab(value)}
              value={params.mapid}
            >
              <Tabs.List style={{ flexWrap: 'nowrap', overflowX: 'hidden' }}>
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
        <div
          className="main"
          style={{ color: "white", backgroundColor: "#222" }}
        >
          <div className="imageContainer">
            <div
              style={{
                width: "100%",
                height: "100%",
              }}
              ref={(el) => setContainer(el)}
            >
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

              {imageScale > 0 ? (
                <TransformWrapper
                  key={`${containerWidth}x${containerHeight}`}
                  initialScale={imageScale}
                  minScale={imageScale * 0.5}
                  maxScale={imageScale * zoomFactor}
                >
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {derivedImageUrl ? (
                      <img alt="map" src={derivedImageUrl} />
                    ) : undefined}
                  </TransformComponent>
                </TransformWrapper>
              ) : undefined}
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default MapScreen;
