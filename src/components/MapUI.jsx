import { AppShell, Box } from "@mantine/core";
import MapImageErrorDialog from "@/components/MapImageErrorDialog";
import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "./DiscordLogin";
import { FloatingRefreshButton } from "./shared/FloatingRefreshButton";
import { MapHeaderSwitch } from "./shared/MapHeaderSwitch";
import { MapViewportLoader } from "./shared/primitives/Loaders";

import "./MapScreen.css";

function MapUI({
  params,
  imageUrl,
  reconnect,
  isReconnecting,
  showRefresh,
  isError,
  error,
  onShowNewUI,
}) {
  return (
    <AppShell header={{ height: 60 }}>
      <MapHeaderSwitch
        gameId={params.mapid}
        buttonLabel="NEW UI"
        onButtonClick={onShowNewUI}
      />

      <AppShell.Main>
        <div className="main">
          <div className="imageContainer">
            <Box p="xs" hiddenFrom="sm">
              <DiscordLogin />
            </Box>

            {isError ? (
              <MapImageErrorDialog gameId={params.mapid} error={error} />
            ) : !imageUrl ? (
              <MapViewportLoader />
            ) : undefined}
            <ScrollMap gameId={params.mapid} imageUrl={imageUrl} />

            {/* New refresh button */}
            {showRefresh && (
              <FloatingRefreshButton
                onClick={reconnect}
                loading={isReconnecting}
              />
            )}
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default MapUI;
