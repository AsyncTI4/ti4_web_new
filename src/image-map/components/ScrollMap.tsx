import { useCallback, useState, useEffect, type CSSProperties } from "react";
import ZoomControls from "@/shared/ui/map/ZoomControls";
import { useAppStore, useSettingsStore } from "@/utils/appStore";
import { getCssScaleStyle } from "@/utils/zoom";
import { isMobileDevice } from "@/utils/isTouchDevice";
import { useOverlayData, type OverlayData } from "../hooks/useOverlayData";
import { abilities } from "@/entities/data/abilities";
import { publicObjectives } from "@/entities/data/publicObjectives";
import { secretObjectives } from "@/entities/data/secretObjectives";
import { promissoryNotes } from "@/entities/data/promissoryNotes";
import { relics } from "@/entities/data/relics";
import { explorations } from "@/entities/data/explorations";
import { leaders } from "@/entities/data/leaders";
import { units } from "@/entities/data/units";
import { techs as technologies } from "@/entities/data/tech";
import { breakthroughs } from "@/entities/data/breakthroughs";
import { cdnImage } from "@/entities/data/cdnImage";

import "../styles/ScrollMap.css";

type ScrollMapProps = {
  gameId: string;
  imageUrl?: string;
};

type DataModelType =
  | "AbilityModel"
  | "AgendaModel"
  | "UnitModel"
  | "StrategyCardModel"
  | "LeaderModel"
  | "FactionModel"
  | "PublicObjectiveModel"
  | "SecretObjectiveModel"
  | "PromissoryNoteModel"
  | "RelicModel"
  | "ExploreModel"
  | "TechnologyModel"
  | "BreakthroughModel";

type OverlayCardContent = {
  title?: string;
  text?: string;
};

type OverlayMap = Record<string, OverlayData>;

export function ScrollMap({ gameId, imageUrl }: ScrollMapProps) {
  const [imageNaturalWidth, setImageNaturalWidth] = useState<number | undefined>(
    undefined,
  );
  const { filteredOverlays, activeTooltip, handleMouseEnter, handleMouseLeave } =
    useOverlay(gameId);

  const zoom = useAppStore((s) => s.zoomLevel);
  const zoomFitToScreen = useAppStore((s) => s.zoomFitToScreen);
  const isFirefox = useSettingsStore((s) => s.settings.isFirefox);
  const imageScale = zoomFitToScreen ? 1 : zoom;
  const imageScaleStyle = getCssScaleStyle(imageScale, isFirefox);

  const [containerWidth, setContainerWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const overlayZoom =
    imageNaturalWidth && containerWidth ? containerWidth / imageNaturalWidth : 1;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {!isMobileDevice() && <ZoomControls />}

      {imageUrl ? (
        <img
          alt="map"
          src={imageUrl}
          onLoad={(event) => setImageNaturalWidth(event.currentTarget.naturalWidth)}
          style={{
            ...imageScaleStyle,
            ...(zoomFitToScreen ? { width: "100%", height: "100%" } : {}),
          }}
        />
      ) : undefined}

      {Object.entries(filteredOverlays).map(([key, overlay]) => {
        const dataModel = lookupDataModel(overlay) as Record<string, any> | undefined;
        const { title, text } = getCardContent(dataModel, overlay);
        if (!title && !text) return null;

        const imageURL = dataModel?.imageURL ? cdnImage(dataModel.imageURL) : undefined;
        const effectiveOverlayZoom = zoomFitToScreen ? overlayZoom : zoom;

        const style: CSSProperties & { border?: string } = {
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
        ].includes(overlay.dataModel ?? "");

        if (!dataModel || deleteBorder) {
          delete style.border;
        }

        const overlayMaxWidth =
          overlayMaxWidths[(overlay.dataModel as DataModelType) ?? "AbilityModel"] ??
          250;

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
              <div className={`tooltip ${activeTooltip === key ? "active" : ""}`}>
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

function getCardContent(
  dataModel: Record<string, any> | undefined,
  overlay: OverlayData,
): OverlayCardContent {
  let title: string | undefined;
  let text: string | undefined;

  switch (overlay.dataModel) {
    case "AbilityModel": {
      const permanentEffect = dataModel?.permanentEffect ?? "";
      const abilityWindow = dataModel?.window ?? "";
      const windowEffect = dataModel?.windowEffect ?? "";
      title = dataModel?.name;
      text =
        (permanentEffect ? `${permanentEffect}\n\n` : "") +
        (abilityWindow ? `${abilityWindow}:\n` : "") +
        windowEffect;
      break;
    }
    case "AgendaModel": {
      const text1 = dataModel?.text1 ?? "";
      const text2 = dataModel?.text2 ?? "";
      title = `${dataModel?.name ?? ""} (${dataModel?.type ?? ""})`;
      text = (text1 ? `${text1}\n\n` : "") + (text2 || "");
      break;
    }
    case "UnitModel": {
      const faction = dataModel?.faction ?? "";
      const baseType = dataModel?.baseType ?? "";
      title = `${dataModel?.name ?? ""} (${faction}${faction ? " " : ""}${baseType})`;
      text = dataModel?.ability ?? dataModel?.baseType;
      break;
    }
    case "StrategyCardModel": {
      const primary = dataModel?.primaryTexts?.join("\n") || "";
      const secondary = dataModel?.secondaryTexts?.join("\n") || "";
      title = dataModel?.name;
      text = `Primary:\n${primary}${secondary ? `\n\nSecondary:\n${secondary}` : ""}`;
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
        return { title: overlay.title, text: overlay.text };
      }
      return {
        title: dataModel?.name,
        text: dataModel?.text || "",
      };
    }
  }

  return { title, text };
}

const useOverlay = (gameId: string) => {
  const { data: overlays } = useOverlayData(gameId);
  const filteredOverlays = filterOverlays(overlays);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipTimer, setTooltipTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const tooltipDelay = isMobileDevice() ? 0 : 600;

  const handleMouseEnter = useCallback(
    (key: string) => {
      const timer = setTimeout(() => setActiveTooltip(key), tooltipDelay);
      setTooltipTimer(timer);
    },
    [tooltipDelay],
  );

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

const filterOverlays = (overlays?: OverlayMap): OverlayMap => overlays ?? {};

const overlayMaxWidths: Partial<Record<DataModelType, number>> = {
  TechnologyModel: 350,
  SecretObjectiveModel: 250,
  RelicModel: 250,
  PublicObjectiveModel: 250,
  LeaderModel: 250,
  UnitModel: 350,
  StrategyCardModel: 350,
};

function lookupDataModel(overlay: OverlayData) {
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
    case "BreakthroughModel":
      return breakthroughs.find((b) => b.alias === dataModelID);
    default:
      return undefined;
  }
}
