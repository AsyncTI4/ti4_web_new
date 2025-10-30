import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovementStore } from "@/utils/movementStore";
import { useUser } from "@/hooks/useUser";
import { useGameData } from "@/hooks/useGameContext";

export type ActiveOrigin = {
  position: string;
  systemId: string;
} | null;

export function useMovementMode() {
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const gameData = useGameData();

  const targetPositionParam =
    searchParams.get("targetPositionId") ||
    searchParams.get("targetSystem") ||
    null;
  const setTargetPositionId = useMovementStore((s) => s.setTargetPositionId);
  const draft = useMovementStore((s) => s.draft);
  const clearAll = useMovementStore((s) => s.clearAll);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [originModalOpen, setOriginModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeOrigin, setActiveOrigin] = useState<ActiveOrigin>(null);

  const targetSystemId = useMemo(() => {
    if (!gameData || !draft.targetPositionId) return null;
    const entry = (gameData.tilePositions || []).find((p: string) =>
      p.startsWith(`${draft.targetPositionId}:`)
    );
    return entry ? entry.split(":")[1] : null;
  }, [gameData, draft.targetPositionId]);

  useEffect(() => {
    if (!targetPositionParam) {
      setTargetPositionId(null);
      return;
    }
    if (!user?.authenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowAuthModal(false);
    setTargetPositionId(targetPositionParam);
  }, [targetPositionParam, setTargetPositionId, user?.authenticated]);

  const handleResetMovement = useCallback(() => {
    useMovementStore.setState((prev) => ({
      draft: { ...prev.draft, origins: {} },
    }));
  }, []);

  const handleCancelMovement = useCallback(() => {
    clearAll();
    setOriginModalOpen(false);
  }, [clearAll]);

  const createTileSelectHandler = useCallback(
    (handleNormalTileSelect: (position: string) => void) => {
      return (position: string, systemId: string) => {
        if (draft.targetPositionId) {
          setActiveOrigin({ position, systemId });
          setOriginModalOpen(true);
          return;
        }
        handleNormalTileSelect(position);
      };
    },
    [draft.targetPositionId]
  );

  return {
    draft,
    targetSystemId,
    showAuthModal,
    setShowAuthModal,
    originModalOpen,
    setOriginModalOpen,
    showSuccessModal,
    setShowSuccessModal,
    activeOrigin,
    setActiveOrigin,
    handleResetMovement,
    handleCancelMovement,
    createTileSelectHandler,
  };
}
