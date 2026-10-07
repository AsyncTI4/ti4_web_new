import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import MapUI from "@/image-map/components/MapUI";
import { useMapImage } from "@/hooks/useMapImage";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type GamePageProps = {
  onShowNewUI?: () => void;
};

export function GamePage({ onShowNewUI }: GamePageProps) {
  const params = useParams<{ mapid: string }>();
  useDocumentTitle(
    params.mapid ? `${params.mapid} - | Async TI` : null,
    "Async TI",
  );

  const gameId = params.mapid;
  const { data: imageUrl, isError, error } = useMapImage(gameId);

  const queryClient = useQueryClient();

  useGameSocket(gameId ?? "", () => {
    void queryClient.invalidateQueries({ queryKey: ["mapImage", gameId] });
    void queryClient.invalidateQueries({ queryKey: ["overlays", gameId] });
  });

  return (
    <MapUI
      gameId={gameId ?? ""}
      imageUrl={imageUrl}
      isError={isError}
      error={error}
      onShowNewUI={onShowNewUI}
    />
  );
}
