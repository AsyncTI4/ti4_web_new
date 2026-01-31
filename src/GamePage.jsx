import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import MapUI from "./components/MapUI";
import { useMapImage } from "./hooks/useMapImage";
import { useGameSocket } from "./hooks/useGameSocket";

export function GamePage({ onShowNewUI }) {
  const params = useParams();
  useEffect(() => {
    document.title = `${params.mapid} - | Async TI`;
  }, [params.mapid]);

  const gameId = params.mapid;
  const { data: imageUrl, refetch, isFetching, isError, error } = useMapImage(gameId);

  const queryClient = useQueryClient();

  useGameSocket(String(gameId), () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["mapImage", gameId] });
  });

  return (
    <MapUI
      params={params}
      imageUrl={imageUrl}
      showRefresh={false}
      reconnect={() => refetch()}
      isReconnecting={isFetching}
      isError={isError}
      error={error}
      onShowNewUI={onShowNewUI}
    />
  );
}

export default GamePage;
