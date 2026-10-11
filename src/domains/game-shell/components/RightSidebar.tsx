import { Box } from "@/ds";
import cx from "clsx";
import { FactionTabBar } from "@/domains/game-shell/components/navigation/FactionTabBar";
import { PlayerCardDisplay } from "./PlayerCardDisplay";
import { AreaType } from "@/hooks/useTabsAndTooltips";
import { useGameData, useGameDataState } from "@/state/useGameContext";
import { PlayerDataErrorAlert } from "@/shared/ui/PlayerDataErrorAlert";
import { useSecretHandAccess } from "@/domains/game-shell/components/SecretHand/useSecretHandAccess";
import { filterPlayersWithAssignedFaction } from "@/entities/game/playerUtils";
import type { PlayerData } from "@/entities/data/types";
import styles from "./RightSidebar.module.css";

type RightSidebarProps = {
  isRightPanelCollapsed: boolean;
  sidebarWidth: number;
  embeddedWidth?: string;
  selectedArea: AreaType;
  activeArea: AreaType;
  selectedFaction: string | null;
  hasActiveUnit: boolean;
  onAreaSelect: (area: AreaType) => void;
  onAreaMouseEnter: (area: AreaType) => void;
  onAreaMouseLeave: () => void;
  gameId: string;
};

type DossierMode = "pinned" | "peek" | "active" | "yours" | "first";

/**
 * The seat the dossier shows. Hovering peeks, a click pins; with nothing pinned
 * it opens on the seat whose turn it is, so the rail is never empty.
 */
function resolveShownSeat(
  playerData: PlayerData[],
  hoveredFaction: string | null,
  selectedFaction: string | null,
  userFaction: string | null,
): { faction: string | null; mode: DossierMode } {
  if (hoveredFaction && hoveredFaction !== selectedFaction) {
    return { faction: hoveredFaction, mode: "peek" };
  }
  if (selectedFaction) return { faction: selectedFaction, mode: "pinned" };

  const seats = filterPlayersWithAssignedFaction(playerData);
  const active = seats.find((player) => player.active)?.faction;
  if (active) return { faction: active, mode: "active" };
  if (userFaction) return { faction: userFaction, mode: "yours" };
  return { faction: seats[0]?.faction ?? null, mode: "first" };
}

const MODE_LABEL: Record<DossierMode, string> = {
  pinned: "Pinned",
  peek: "Peek · click to pin",
  active: "Active seat",
  yours: "Your seat",
  first: "First seat",
};

export function RightSidebar({
  isRightPanelCollapsed,
  sidebarWidth,
  embeddedWidth,
  selectedArea,
  activeArea,
  selectedFaction,
  onAreaSelect,
  onAreaMouseEnter,
  onAreaMouseLeave,
  gameId,
}: RightSidebarProps) {
  const gameData = useGameData();
  const playerData = gameData?.playerData;
  const loadingState = useGameDataState();
  const isError = !!loadingState?.isError;

  const { userDiscordId } = useSecretHandAccess(playerData);
  const userPlayer = playerData?.find((p) => p.discordId === userDiscordId);

  const hoveredFaction =
    activeArea?.type === "faction" ? activeArea.faction : null;
  const shown = resolveShownSeat(
    playerData ?? [],
    hoveredFaction,
    selectedFaction,
    userPlayer?.faction ?? null,
  );

  return (
    <Box
      component="aside"
      aria-label="Seat dossier"
      className={cx(styles.rail, isRightPanelCollapsed && styles.collapsed)}
      style={{
        width: isRightPanelCollapsed ? "0%" : embeddedWidth || `${sidebarWidth}%`,
      }}
    >
      {playerData && (
        <FactionTabBar
          playerData={playerData}
          selectedArea={selectedArea}
          activeArea={activeArea}
          shownFaction={shown.faction}
          onAreaSelect={onAreaSelect}
          onAreaMouseEnter={onAreaMouseEnter}
          onAreaMouseLeave={onAreaMouseLeave}
        />
      )}

      {shown.faction && (
        <Box className={styles.mode} data-mode={shown.mode}>
          <span>Seat dossier</span>
          <b>{MODE_LABEL[shown.mode]}</b>
        </Box>
      )}

      <Box className={styles.scroll}>
        {playerData && (
          <PlayerCardDisplay
            playerData={playerData}
            activeFaction={shown.faction}
          />
        )}

        {isError && <PlayerDataErrorAlert gameId={gameId} mb="md" />}
      </Box>
    </Box>
  );
}
