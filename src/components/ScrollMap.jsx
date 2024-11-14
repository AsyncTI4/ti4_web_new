import { useCallback, useState } from "react";
import { ZoomControls } from "./ZoomControls";
import { useOverlayContent, useOverlayData } from "../hooks/useOverlayData";

import "./ScrollMap.css";
import { keepPreviousData } from "@tanstack/react-query";

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
        const dataModel =
          overlayContent?.[`${overlay.dataModel}:${overlay.dataModelID}`];

        const getCardContent = (dataModel, overlay) => {
          let title, text;

          switch (overlay.dataModel) {
            case "AbilityModel": {
              const permanentEffect = dataModel?.permanentEffect ?? "";
              const window = dataModel?.window ?? "";
              const windowEffect = dataModel?.windowEffect ?? "";

              title = dataModel?.name
              text = (permanentEffect ? permanentEffect + "\n\n" : "") + (window ? `${window}:\n` : "") + windowEffect
              break;
            }
            case "UnitModel": {
              const faction = dataModel?.faction ?? "";
              const baseType = dataModel?.baseType ?? "";
              title = dataModel?.name + " (" + faction + (!faction ? "" : " ") + baseType + ")";
              text = dataModel?.ability ?? dataModel?.baseType;
              break;
            }
            case "StrategyCardModel": {
              const primary = dataModel?.primaryTexts?.join("\n") || "";
              const secondary = dataModel?.secondaryTexts?.join("\n") || "";

              title = dataModel?.name;
              text = "Primary:\n" + primary + (secondary ? `\n\nSecondary:\n${secondary}` : "");
              break;
            }
            default: {
              if (!dataModel) {
                return {
                  title: overlay.title,
                  text: overlay.text
                };
              };
              return {
                title: dataModel?.name,
                text: dataModel?.text ?? dataModel?.abilityText
              };
            }
          }
          return { title, text };
        };
        const { title, text } = getCardContent(dataModel, overlay);
        if (!title && !text) return null;

        const imageURL = dataModel?.imageURL ?? undefined;
        let style = {
          left: `${(overlay.boxXYWH[0] - 1) * zoom}px`,
          top: `${(overlay.boxXYWH[1] - 1) * zoom}px`,
          width: `${(overlay.boxXYWH[2] + 2) * zoom}px`,
          height: `${(overlay.boxXYWH[3] + 2) * zoom}px`,
          border: `${zoom * 4}px solid rgba(255, 255, 0, 0.2)`,
        };

        const deleteBorder = ["StrategyCardModel", "UnitModel"].includes(overlay.dataModel);
        if (!dataModel || deleteBorder) {
          delete style.border;
        }

        const overlayMaxWidth = overlayMaxWidths[overlay.dataModel] || 250;

        return (
          <div
            key={key}
            className="overlay-box"
            style={style}
            onMouseEnter={() => handleMouseEnter(key)}
            onMouseLeave={handleMouseLeave}
          >
            {imageURL !== undefined ? (
              <img
                src={imageURL}
                alt={title}
                className={`tooltip-image ${activeTooltip === key ? "active" : ""}`}
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  maxWidth: `${overlayMaxWidth}px`,
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                }}
              />
            ) : (
              <div
                className={`tooltip ${activeTooltip === key ? "active" : ""}`}
              >
                <h3 className="tooltip-title">{title}</h3>
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

const filterOverlays = (overlays) => Object.values(overlays);

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

const overlayMaxWidths = {
  TechnologyModel: 350,
  SecretObjectiveModel: 250,
  RelicModel: 250,
  PublicObjectiveModel: 250,
  LeaderModel: 250,
  UnitModel: 350,
  StrategyCardModel: 350,
};
