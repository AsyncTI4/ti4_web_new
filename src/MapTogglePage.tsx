import { useState } from "react";
import { useParams } from "react-router-dom";
import NewMapUI from "./NewMapUI";
import { GamePage } from "./image-map/pages/GamePage";

const OLD_UI_KEY = "showOldUI";

export default function MapTogglePage() {
  const params = useParams<{ mapid: string }>();
  const gameId = params.mapid ?? "";
  const isFowGame = gameId.toLowerCase().startsWith("fow");
  const [showOldUI, setShowOldUI] = useState(
    () => localStorage.getItem(OLD_UI_KEY) === "true"
  );

  const handleShowOldUI = () => {
    localStorage.setItem(OLD_UI_KEY, "true");
    setShowOldUI(true);
  };

  const handleShowNewUI = () => {
    localStorage.removeItem(OLD_UI_KEY);
    setShowOldUI(false);
  };

  // FoW games always use old UI (which handles auth errors properly)
  if (isFowGame || showOldUI) {
    return <GamePage onShowNewUI={isFowGame ? undefined : handleShowNewUI} />;
  }

  return <NewMapUI onShowOldUI={handleShowOldUI} />;
}
