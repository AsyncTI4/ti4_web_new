import { AppShell, Box } from "@mantine/core";
import MapImageErrorDialog from "@/image-map/components/MapImageErrorDialog";
import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "@/domains/auth/components/DiscordLogin";
import { FloatingRefreshButton } from "@/shared/ui/FloatingRefreshButton";
import { MapHeaderSwitch } from "@/shared/ui/MapHeaderSwitch";
import { MapViewportLoader } from "@/shared/ui/primitives/Loaders";
import type { MapImageError } from "@/hooks/useMapImage";
import type { Params } from "react-router-dom";

import "../styles/MapScreen.css";

type MapUIProps = {
  params: Params<"mapid">;
  imageUrl?: string;
  reconnect: () => void;
  isReconnecting: boolean;
  showRefresh?: boolean;
  isError: boolean;
  error?: MapImageError | Error | null;
  onShowNewUI?: () => void;
};

function MapUI({
  params,
  imageUrl,
  reconnect,
  isReconnecting,
  showRefresh,
  isError,
  error,
  onShowNewUI,
}: MapUIProps) {
  const gameId = params.mapid ?? "";

  return (
    <AppShell header={{ height: 60 }}>
      <MapHeaderSwitch
        gameId={gameId}
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
              <MapImageErrorDialog gameId={gameId} error={error} />
            ) : !imageUrl ? (
              <MapViewportLoader />
            ) : undefined}
            <ScrollMap gameId={gameId} imageUrl={imageUrl} />

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
