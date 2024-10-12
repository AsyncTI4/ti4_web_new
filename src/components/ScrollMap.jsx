import { useState } from "react";
import { ZoomControls } from "./ZoomControls";

export function ScrollMap({ imageUrl }) {
  const [zoom, setZoom] = useState(0.75);

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      if (prevZoom === undefined) return 1;
      return Math.min(prevZoom + 0.1, 2);
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      if (prevZoom === undefined) return 1;
      return Math.max(prevZoom - 0.1, 0.5);
    });
  };

  const handleZoomReset = () => {
    setZoom(0.5);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <ZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />

      {imageUrl ? (
        <img
          alt="map"
          src={imageUrl}
          style={{
            zoom,
            imageRendering: "crisp-edges",
          }}
        />
      ) : undefined}
    </div>
  );
}
