import { useCallback, useState } from "react";
import { ZoomControls } from "./ZoomControls";
import { useOverlayContent, useOverlayData } from "../hooks/useOverlayData";

import "./ScrollMap.css";

const defaultZoomIndex = 2;
const zoomLevels = [0.4, 0.5, 0.75, 0.85, 1, 1.2, 1.4, 1.6, 1.8, 2];

export function ScrollMap({ gameId, imageUrl }) {
  const {
    filteredOverlays,
    overlayContent,
    activeTooltip,
    handleMouseEnter,
    handleMouseLeave,
  } = useOverlay(gameId);
  const { zoom, handleZoomIn, handleZoomOut, handleZoomReset } = useZoom();
  console.log("overlayContent", overlayContent);

  const isFirefox =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {!isTouchDevice() && (
        <ZoomControls
          zoom={zoom}
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
            ...(isFirefox ? {} : { zoom: zoom }),
            [`-moz-transform`]: `scale(${zoom})`,
            [`-moz-transform-origin`]: "top left",
          }}
        />
      ) : undefined}

      {Object.entries(filteredOverlays).map(([key, overlay]) => {
        const content =
          overlayContent?.[`${overlay.cardType}:${overlay.cardID}`];
        const text = content?.text ?? content?.abilityText;
        if (!text || !content) return null;
        const imageURL = content.imageURL;

        return (
          <div
            key={key}
            className="overlay-box"
            style={{
              left: `${(overlay.boxXYWH[0] - 1) * zoom}px`,
              top: `${(overlay.boxXYWH[1] - 1) * zoom}px`,
              width: `${(overlay.boxXYWH[2] + 2) * zoom}px`,
              height: `${(overlay.boxXYWH[3] + 2) * zoom}px`,
              border: `${zoom * 4}px solid rgba(255, 255, 0, 0.2)`,
            }}
            onMouseEnter={() => handleMouseEnter(key)}
            onMouseLeave={handleMouseLeave}
          >
            {imageURL !== undefined ? (
              <img
                src={imageURL}
                alt={content.name}
                className={`tooltip-image ${activeTooltip === key ? "active" : ""}`}
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  maxWidth: "250px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                }}
              />
            ) : (
              <div
                className={`tooltip ${activeTooltip === key ? "active" : ""}`}
              >
                <h3 className="tooltip-title">{content?.name}</h3>
                <p className="tooltip-text">{text}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const useOverlay = (gameId) => {
  const { data: overlays } = useOverlayData(gameId);
  const { data: overlayContent } = useOverlayContent();
  const filteredOverlays = filterOverlays(overlays ?? []);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipTimer, setTooltipTimer] = useState(null);

  const tooltipDelay = isTouchDevice() ? 0 : 600;

  const handleMouseEnter = useCallback((key) => {
    const timer = setTimeout(() => setActiveTooltip(key), tooltipDelay);
    setTooltipTimer(timer);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tooltipTimer) clearTimeout(tooltipTimer);
    setActiveTooltip(null);
  }, [tooltipTimer]);

  return {
    filteredOverlays,
    overlayContent,
    activeTooltip,
    handleMouseEnter,
    handleMouseLeave,
  };
};

const filterOverlays = (overlays) =>
  Object.fromEntries(
    Object.entries(overlays).filter(
      ([key]) =>
        key.startsWith("leader") ||
        key.startsWith("objective") ||
        key.startsWith("pn") ||
        key.startsWith("relic") ||
        key.startsWith("so") ||
        key.startsWith("tech") ||
        key.startsWith("ability")
    )
  );

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

const useZoom = () => {
  const [zoomIndex, setZoomIndex] = useState(() => {
    const savedZoomIndex = localStorage.getItem("zoomIndex");
    if (savedZoomIndex !== null) {
      return parseInt(savedZoomIndex, 10);
    }
    return isTouchDevice() ? 0 : defaultZoomIndex;
  });

  const handleZoomIn = () => {
    setZoomIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, zoomLevels.length - 1);
      localStorage.setItem("zoomIndex", newIndex.toString());
      return newIndex;
    });
  };

  const handleZoomOut = () => {
    setZoomIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      localStorage.setItem("zoomIndex", newIndex.toString());
      return newIndex;
    });
  };

  const handleZoomReset = () => {
    const resetIndex = isTouchDevice() ? 0 : defaultZoomIndex;
    setZoomIndex(resetIndex);
    localStorage.setItem("zoomIndex", resetIndex.toString());
  };

  const zoom = zoomLevels[zoomIndex];

  return { zoom, handleZoomIn, handleZoomOut, handleZoomReset };
};
