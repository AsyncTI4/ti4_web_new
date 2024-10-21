import { useState } from "react";
import { ZoomControls } from "./ZoomControls";

const defaultZoomIndex = 2;
export function ScrollMap({ imageUrl }) {
  const zoomLevels = [0.4, 0.5, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2];
  const [zoomIndex, setZoomIndex] = useState(
    isTouchDevice() ? 0 : defaultZoomIndex
  ); // Start at 0.75 (index 1)

  const isFirefox =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

  const handleZoomIn = () => {
    setZoomIndex((prevIndex) => Math.min(prevIndex + 1, zoomLevels.length - 1));
  };

  const handleZoomOut = () => {
    setZoomIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleZoomReset = () => {
    setZoomIndex(defaultZoomIndex);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {!isTouchDevice() && (
        <ZoomControls
          zoom={zoomLevels[zoomIndex]}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />
      )}

      {imageUrl ? (
        <img
          alt="map"
          src={imageUrl}
          style={{
            ...(isFirefox ? {} : { zoom: zoomLevels[zoomIndex] }),
            [`-moz-transform`]: `scale(${zoomLevels[zoomIndex]})`,
            [`-moz-transform-origin`]: "top left",
          }}
        />
      ) : undefined}
    </div>
  );
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
