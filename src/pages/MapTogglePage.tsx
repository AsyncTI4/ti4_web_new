import { useState } from "react";
import GameMapPage from "./GameMapPage";
import { GamePage } from "@/pages/image-map/GamePage";

const OLD_UI_KEY = "showOldUI";

export default function MapTogglePage() {
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

  if (showOldUI) {
    return <GamePage onShowNewUI={handleShowNewUI} />;
  }

  return <GameMapPage onShowOldUI={handleShowOldUI} />;
}
