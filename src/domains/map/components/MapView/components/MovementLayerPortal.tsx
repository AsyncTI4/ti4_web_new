import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import type { Tile } from "@/app/providers/context/types";
import type { MovementModeState } from "../hooks/useMovementMode";
import { MovementModeBox } from "../MovementModeBox";
import { MovementModals } from "./MovementModals";
import { TryUnitDecalsSidebar } from "@/domains/map/components/try-decals/TryUnitDecalsSidebar";

type MovementLayerPortalProps = {
  gameId: string;
  tiles: Tile[];
  movementState: MovementModeState;
  tryDecalsOpened: boolean;
  setTryDecalsOpened: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
};

export function MovementLayerPortal({
  gameId,
  tiles,
  movementState,
  tryDecalsOpened,
  setTryDecalsOpened,
  children,
}: MovementLayerPortalProps) {
  const {
    draft,
    handleCancelMovement,
    handleResetMovement,
    showSuccessModal,
    showAuthModal,
    setShowAuthModal,
    setShowSuccessModal,
    originModalOpen,
    setOriginModalOpen,
    activeOrigin,
  } = movementState;

  return (
    <>
      {draft.targetPositionId && (
        <MovementModeBox
          gameId={gameId}
          onCancel={handleCancelMovement}
          onReset={handleResetMovement}
          onSuccess={() => setShowSuccessModal(true)}
        />
      )}

      <MovementModals
        showAuthModal={showAuthModal}
        onCloseAuthModal={() => setShowAuthModal(false)}
        showSuccessModal={showSuccessModal}
        onCloseSuccessModal={() => setShowSuccessModal(false)}
        originModalOpen={originModalOpen}
        onCloseOriginModal={() => setOriginModalOpen(false)}
        activeOrigin={activeOrigin}
        tiles={tiles}
      />

      {children}

      <TryUnitDecalsSidebar
        opened={tryDecalsOpened}
        onClose={() => setTryDecalsOpened(false)}
      />
    </>
  );
}
