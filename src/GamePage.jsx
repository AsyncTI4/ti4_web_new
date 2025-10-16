import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useMaps } from "./hooks/useMaps";
import { useTabManagement } from "./hooks/useTabManagement";
import MapUI from "./components/MapUI";
import { useMapImage } from "./hooks/useMapImage";
import { useGameSocket } from "./hooks/useGameSocket";

export function GamePage({ onShowNewUI }) {
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    document.title = `${params.mapid} - | Async TI`;
  }, [params.mapid]);

  const gameId = params.mapid;
  const { data: imageUrl, refetch, isFetching, isError } = useMapImage(gameId);
  const { activeTabs, changeTab, removeTab } = useTabManagement();

  const queryClient = useQueryClient();

  useGameSocket(String(gameId), () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["mapImage", gameId] });
  });

  return (
    <MapUI
      activeTabs={activeTabs}
      params={params}
      changeTab={changeTab}
      removeTab={removeTab}
      imageUrl={imageUrl}
      navigate={navigate}
      showRefresh={false}
      reconnect={() => refetch()}
      isReconnecting={isFetching}
      isError={isError}
      onShowNewUI={onShowNewUI}
    />
  );
}

export default GamePage;
