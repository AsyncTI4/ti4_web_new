import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMaps } from "./hooks/useMaps";
import { useMapSocket } from "./hooks/useMapSocket";
import { useTabManagement } from "./hooks/useTabManagement";
import MapUI from "./components/MapUI";
import { ReadyState } from "react-use-websocket";

function GamePage() {
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    document.title = `${params.mapid} - | Async TI`;
  }, [params.mapid]);

  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => setImageUrl(null), [params.mapid]);

  const { activeTabs, changeTab, removeTab } = useTabManagement();
  const { readyState, reconnect, isReconnecting } = useMapSocket(
    params.mapid,
    setImageUrl
  );

  return (
    <MapUI
      activeTabs={activeTabs}
      params={params}
      changeTab={changeTab}
      removeTab={removeTab}
      imageUrl={imageUrl}
      navigate={navigate}
      showRefresh={readyState === ReadyState.CLOSED}
      reconnect={reconnect}
      isReconnecting={isReconnecting}
    />
  );
}

export default GamePage;
