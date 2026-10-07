import { AppShell, Flex } from "@mantine/core";
import { MapImageErrorDialog } from "./MapImageErrorDialog";
import { ScrollMap } from "./ScrollMap";
import { DiscordLogin } from "@/domains/auth/DiscordLogin";
import { MapHeaderSwitch } from "@/shared/ui/MapHeaderSwitch";
import { MapViewportLoader } from "@/shared/ui/primitives/MapViewportLoader";
import type { MapImageError } from "@/hooks/useMapImage";
import { APP_HEADER_HEIGHT } from "@/shared/ui/AppHeader";
import { DashboardLinks } from "@/shared/ui/DashboardLinks";
import { useUser } from "@/hooks/useUser";
import "../styles/MapScreen.css";

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
