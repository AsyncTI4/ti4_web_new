import { useCallback, useState, useEffect } from "react";
import ZoomControls from "@/components/ZoomControls";
import { useAppStore } from "@/utils/appStore";
import { useOverlayData } from "../hooks/useOverlayData";
import { abilities } from "../data/abilities";
import { publicObjectives } from "../data/publicObjectives";
import { secretObjectives } from "../data/secretObjectives";
import { promissoryNotes } from "../data/promissoryNotes";
import { relics } from "../data/relics";
import { explorations } from "../data/explorations";
import { leaders } from "../data/leaders";
import { units } from "../data/units";
import { techs as technologies } from "../data/tech";
import { cdnImage } from "../data/cdnImage";

import "./ScrollMap.css";

export function ScrollMap({ gameId, imageUrl }) {
  const [imageNaturalWidth, setImageNaturalWidth] = useState(undefined);
  const {
    filteredOverlays,

    activeTooltip,
    handleMouseEnter,
    handleMouseLeave,
  } = useOverlay(gameId);
  const zoom = useAppStore((s) => s.zoomLevel);
  const zoomFitToScreen = useAppStore((s) => s.zoomFitToScreen);

  // Compute overlay scale for fit-to-screen mode
  const [containerWidth, setContainerWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const overlayZoom =
    imageNaturalWidth && containerWidth
      ? containerWidth / imageNaturalWidth
      : 1;

  const isFirefox =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {!isTouchDevice() && <ZoomControls />}

      {imageUrl ? (
        <img
          alt="map"
          src={imageUrl}
          onLoad={(e) => setImageNaturalWidth(e.target.naturalWidth)}
          style={{
            ...(isFirefox ? {} : { zoom: zoomFitToScreen ? 1 : zoom }),
            [`-moz-transform`]: `scale(${zoomFitToScreen ? 1 : zoom})`,
            [`-moz-transform-origin`]: "top left",
            ...(zoomFitToScreen ? { width: "100%", height: "100%" } : {}),
          }}
        />
      ) : undefined}

      {Object.entries(filteredOverlays).map(([key, overlay]) => {
        const dataModel = lookupDataModel(overlay);

        const getCardContent = (dataModel, overlay) => {
          let title, text;

          switch (overlay.dataModel) {
            case "AbilityModel": {
              const permanentEffect = dataModel?.permanentEffect ?? "";
              const window = dataModel?.window ?? "";
              const windowEffect = dataModel?.windowEffect ?? "";

              title = dataModel?.name;
              text =
                (permanentEffect ? permanentEffect + "\n\n" : "") +
                (window ? `${window}:\n` : "") +
                windowEffect;
              break;
            }
            case "AgendaModel": {
              const text1 = dataModel?.text1 ?? "";
              const text2 = dataModel?.text2 ?? "";

              title = dataModel?.name + " (" + dataModel?.type + ")";
              text = (text1 ? text1 + "\n\n" : "") + (text2 || "");
              break;
            }
            case "UnitModel": {
              const faction = dataModel?.faction ?? "";
              const baseType = dataModel?.baseType ?? "";
              title =
                dataModel?.name +
                " (" +
                faction +
                (!faction ? "" : " ") +
                baseType +
                ")";
              text = dataModel?.ability ?? dataModel?.baseType;
              break;
            }
            case "StrategyCardModel": {
              const primary = dataModel?.primaryTexts?.join("\n") || "";
              const secondary = dataModel?.secondaryTexts?.join("\n") || "";

              title = dataModel?.name;
              text =
                "Primary:\n" +
                primary +
                (secondary ? `\n\nSecondary:\n${secondary}` : "");
              break;
            }
            case "LeaderModel": {
              const abilityWindow = dataModel?.abilityWindow ?? "";
              const abilityText = dataModel?.abilityText ?? "";

              title = dataModel?.name;
              text = `${abilityWindow}\n${abilityText}\n\nUnlock: ${dataModel?.unlockCondition}`;
              break;
            }
            case "FactionModel": {
              title = dataModel?.factionName;
              break;
            }
            default: {
              if (!dataModel) {
                return {
                  title: overlay.title,
                  text: overlay.text,
                };
              }
              return {
                title: dataModel?.name,
                text: dataModel?.text || "",
              };
            }
          }
          return { title, text };
        };
        const { title, text } = getCardContent(dataModel, overlay);
        if (!title && !text) return null;

        const imageURL = dataModel?.imageURL
          ? cdnImage(dataModel.imageURL)
          : undefined;

        const effectiveOverlayZoom = zoomFitToScreen ? overlayZoom : zoom;
        let style = {
          left: `${(overlay.boxXYWH[0] - 1) * effectiveOverlayZoom}px`,
          top: `${(overlay.boxXYWH[1] - 1) * effectiveOverlayZoom}px`,
          width: `${(overlay.boxXYWH[2] + 2) * effectiveOverlayZoom}px`,
          height: `${(overlay.boxXYWH[3] + 2) * effectiveOverlayZoom}px`,
          border: `${effectiveOverlayZoom * 4}px solid rgba(255, 255, 0, 0.2)`,
        };

        const deleteBorder = [
          "FactionModel",
          "StrategyCardModel",
          "UnitModel",
          "ExploreModel",
        ].includes(overlay.dataModel);
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

const useZoom = (imageNaturalWidth) => {
  const [zoomIndex, setZoomIndex] = useState(() => {
    const savedZoomIndex = localStorage.getItem("zoomIndex");
    if (savedZoomIndex !== null) {
      return parseInt(savedZoomIndex, 10);
    }
    return isTouchDevice() ? 0 : defaultZoomIndex;
  });

  const [zoomFitToScreen, setZoomFitToScreen] = useState(() => {
    const savedZoomFitToScreen = localStorage.getItem("zoomFitToScreen");
    return savedZoomFitToScreen === "true";
  });

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const overlayZoom = imageNaturalWidth ? width / imageNaturalWidth : 1;

  const handleZoomIn = () => {
    setZoomIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, zoomLevels.length - 1);
      changeZoomIndex(newIndex);
      changeZoomFitToScreen(false);
      return newIndex;
    });
  };

  const handleZoomOut = () => {
    setZoomIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      changeZoomIndex(newIndex);
      changeZoomFitToScreen(false);
      return newIndex;
    });
  };

  const handleZoomReset = () => {
    const resetIndex = isTouchDevice() ? 0 : defaultZoomIndex;
    changeZoomIndex(resetIndex);
    changeZoomFitToScreen(false);
  };

  const changeZoomIndex = (val) => {
    setZoomIndex(val);
    localStorage.setItem("zoomIndex", val.toString());
  };

  const changeZoomFitToScreen = (val) => {
    setZoomFitToScreen(val);
    localStorage.setItem("zoomFitToScreen", val.toString());
  };
  const handleZoomScreenSize = () => changeZoomFitToScreen(!zoomFitToScreen);

  const zoom = zoomLevels[zoomIndex];

  return {
    zoom: zoomFitToScreen ? 1 : zoom,
    overlayZoom: zoomFitToScreen ? overlayZoom : zoom,
    zoomFitToScreen,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomScreenSize,
  };
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

function lookupDataModel(overlay) {
  const { dataModel, dataModelID } = overlay || {};
  if (!dataModel || !dataModelID) return undefined;
  switch (dataModel) {
    case "AbilityModel":
      return abilities.find((a) => a.id === dataModelID);
    case "PublicObjectiveModel":
      return publicObjectives.find((o) => o.alias === dataModelID);
    case "SecretObjectiveModel":
      return secretObjectives.find((o) => o.alias === dataModelID);
    case "PromissoryNoteModel":
      return promissoryNotes.find((p) => p.alias === dataModelID);
    case "RelicModel":
      return relics.find((r) => r.alias === dataModelID);
    case "ExploreModel":
      return explorations.find((e) => e.alias === dataModelID);
    case "LeaderModel":
      return leaders.find((l) => l.id === dataModelID);
    case "UnitModel":
      return units.find((u) => u.id === dataModelID);
    case "TechnologyModel":
      return technologies.find((t) => t.alias === dataModelID);
    default:
      return undefined;
  }
}
