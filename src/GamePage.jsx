import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMaps } from "./hooks/useMaps";
import { useMapSocket } from "./hooks/useMapSocket";
import { useTabManagement } from "./hooks/useTabManagement";
import MapUI from "./components/MapUI";

import "dragscroll/dragscroll.js";

function GamePage() {
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    document.title = `${params.mapid} - | Async TI`;
  }, [params.mapid]);

  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => setImageUrl(null), [params.mapid]);

  const { activeTabs, changeTab, removeTab } = useTabManagement();

  const mapsQuery = useMaps();
  useMapSocket(params.mapid, setImageUrl);

  const defaultImageUrl = mapsQuery.data?.find(
    (v) => v.MapName === params.mapid
  )?.MapURL;

  const derivedImageUrl = imageUrl ?? defaultImageUrl;

  return (
    <MapUI
      activeTabs={activeTabs}
      params={params}
      changeTab={changeTab}
      removeTab={removeTab}
      imageUrl={imageUrl}
      derivedImageUrl={derivedImageUrl}
      defaultImageUrl={defaultImageUrl}
      navigate={navigate}
    />
  );
}

export default GamePage;
