import { useState, useEffect } from "react";
import NewMapUI from "./NewMapUI";
// @ts-ignore
import { GamePage } from "./GamePage";

type Props = {
  pannable?: boolean;
};

export default function MapTogglePage({ pannable }: Props) {
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

  if (showOldUI === "true") {
    return <GamePage onShowNewUI={handleShowNewUI} />;
  }

  return <NewMapUI pannable={pannable} onShowOldUI={handleShowOldUI} />;
}
