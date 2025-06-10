import { isTouchDevice } from "./utils/isTouchDevice";
import NewMapUI from "./NewMapUI";
// @ts-ignore
import GamePage from "./GamePage";

export default function MapTogglePage() {
  const hasOldUIOverride = localStorage.getItem("showOldUI") === "true";
  if (isTouchDevice() || hasOldUIOverride) {
    return <GamePage />;
  }
  return <NewMapUI />;
}
