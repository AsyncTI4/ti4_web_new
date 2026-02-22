import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NewMapUI from "./NewMapUI";
import { GamePage } from "./image-map/pages/GamePage";

type Props = {
  pannable?: boolean;
};

export default function MapTogglePage({ pannable }: Props) {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const isFowGame = gameId.toLowerCase().startsWith("fow");

  const [showOldUI, setShowOldUI] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("showOldUI");
    setShowOldUI(stored);
  }, []);

  const handleShowOldUI = () => {
    localStorage.setItem("showOldUI", "true");
    setShowOldUI("true");
  };

  const handleShowNewUI = () => {
    localStorage.removeItem("showOldUI");
    setShowOldUI(null);
  };

  // FoW games always use old UI (which handles auth errors properly)
  if (isFowGame || showOldUI === "true") {
    return <GamePage onShowNewUI={isFowGame ? undefined : handleShowNewUI} />;
  }

  return <NewMapUI pannable={pannable} onShowOldUI={handleShowOldUI} />;
}
