import { AppShell, Button, Group, useMantineTheme, Box } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { Atom } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import { useRefreshMap } from "@/hooks/useRefreshMap";
import MapImageErrorDialog from "@/components/MapImageErrorDialog";

import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "./DiscordLogin";
import Logo from "./Logo";
import { HeaderMenu } from "./HeaderMenu";

import "./MapScreen.css";

function MapUI({
  activeTabs,
  params,
  changeTab,
  removeTab,
  imageUrl,
  reconnect,
  isReconnecting,
  showRefresh,
  isError,
}) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const refreshMutation = useRefreshMap(params.mapid);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group
          align="center"
          h="100%"
          px="sm"
          gap="sm"
          style={{ flexWrap: "nowrap", maxWidth: "100vw" }}
        >
          <Logo />
          <div className="logo-divider" />
          <HeaderMenu
            mapId={params.mapid}
            activeTabs={activeTabs}
            changeTab={changeTab}
            removeTab={removeTab}
          />
          {!isTouchDevice() && (
            <Button
              variant="light"
              size="xs"
              color="cyan"
              onClick={() => {
                localStorage.setItem("showOldUI", undefined);
                navigate(`/game/${params.mapid}/newui`);
              }}
            >
              GO TO NEW UI
            </Button>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <div className="main">
          <div className="imageContainer">
            <Box p="xs" hiddenFrom="sm">
              <DiscordLogin />
            </Box>

            {isError ? (
              <MapImageErrorDialog gameId={params.mapid} />
            ) : !imageUrl ? (
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

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

export default MapUI;
