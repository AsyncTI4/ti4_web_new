import { isMobileDevice } from "./utils/isTouchDevice";
import NewMapUI from "./NewMapUI";
// @ts-ignore
import GamePage from "./GamePage";

type Props = {
  pannable?: boolean;
};

export default function MapTogglePage({ pannable }: Props) {
  const hasOldUIOverride = localStorage.getItem("showOldUI") === "true";
  if (isMobileDevice() || hasOldUIOverride) {
    return <GamePage />;
  }
  return <NewMapUI pannable={pannable} />;
}
