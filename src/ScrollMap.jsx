import { useState } from "react";
import { ZoomControls } from "./ZoomControls";

export function ScrollMap({ imageUrl }) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      if (prevZoom === undefined) return 1;
      return Math.min(prevZoom + 0.25, 2);
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      if (prevZoom === undefined) return 1;
      return Math.max(prevZoom - 0.25, 0.5);
    });
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  const zoomPercent = zoom
    ? (zoom * 100).toFixed(0).toString() + "%"
    : undefined;

  return (
    <>
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
            width: zoomPercent,
            imageRendering: "crisp-edges",
          }}
        />
      ) : undefined}
    </>
  );
}
