import { AppShell, Flex } from "@mantine/core";
import { MapImageErrorDialog } from "@/domains/image-map/components/MapImageErrorDialog";
import { ScrollMap } from "@/domains/image-map/components/ScrollMap";
import { DiscordLogin } from "@/domains/auth/DiscordLogin";
import { MapHeaderSwitch } from "@/layout/MapHeaderSwitch";
import { MapViewportLoader } from "@/shared/ui/primitives/MapViewportLoader";
import type { MapImageError } from "@/domains/image-map/hooks/useMapImage";
import { APP_HEADER_HEIGHT } from "@/shared/ui/AppHeader";
import { DashboardLinks } from "@/layout/DashboardLinks";
import { useUser } from "@/api/auth/useUser";
import "@/domains/image-map/styles/MapScreen.css";

type MapUIProps = {
  gameId: string;
  imageUrl?: string;
  isError: boolean;
  error?: MapImageError | Error | null;
  onShowNewUI?: () => void;
};

function MapUI({ gameId, imageUrl, isError, error, onShowNewUI }: MapUIProps) {
  const { user } = useUser();

  return (
    <AppShell header={{ height: APP_HEADER_HEIGHT }}>
      <MapHeaderSwitch
        gameId={gameId}
        buttonLabel="NEW UI"
        onButtonClick={onShowNewUI}
      />

      <AppShell.Main>
        <div className="main">
          <div className="imageContainer">
            <Flex p="xs" hiddenFrom="sm" justify="space-between">
              {user?.authenticated && <DashboardLinks />}
              <DiscordLogin />
            </Flex>

            {isError && <MapImageErrorDialog gameId={gameId} error={error} />}
            {!isError && !imageUrl && <MapViewportLoader />}
            <ScrollMap gameId={gameId} imageUrl={imageUrl} />
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default MapUI;
