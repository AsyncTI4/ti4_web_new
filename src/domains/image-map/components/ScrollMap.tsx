import { useEffect, useRef, useState, type CSSProperties } from "react";
import ZoomControls from "@/shared/ui/map/ZoomControls";
import { useAppStore, useSettingsStore } from "@/state/appStore";
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
import { agendas } from "@/entities/data/agendas";
import { getStrategyCardById } from "@/entities/lookup/strategyCards";
import { cdnImage } from "@/entities/data/cdnImage";

import "../styles/ScrollMap.css";

type ScrollMapProps = {
  gameId: string;
  imageUrl?: string;
};

/** The fields overlays read from whichever data model an overlay points at. */
type OverlayDataModel = Partial<{
  name: string;
  text: string;
  imageURL: string;
  permanentEffect: string;
  window: string;
  windowEffect: string;
  text1: string;
  text2: string;
  type: string;
  faction: string;
  baseType: string;
  ability: string;
  primaryTexts: string[];
  secondaryTexts: string[];
  abilityWindow: string;
  abilityText: string;
  unlockCondition: string;
  factionName: string;
}>;

type OverlayCardContent = {
  title?: string;
  text?: string;
};

export function ScrollMap({ gameId, imageUrl }: ScrollMapProps) {
  const [imageNaturalWidth, setImageNaturalWidth] = useState<
    number | undefined
  >(undefined);
  const { overlays, activeTooltip, handleMouseEnter, handleMouseLeave } =
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
    imageNaturalWidth && containerWidth
      ? containerWidth / imageNaturalWidth
      : 1;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {!isMobileDevice() && <ZoomControls />}

      {imageUrl && (
        <img
          alt="map"
          src={imageUrl}
          onLoad={(event) =>
            setImageNaturalWidth(event.currentTarget.naturalWidth)
          }
          style={{
            ...imageScaleStyle,
            ...(zoomFitToScreen ? { width: "100%", height: "100%" } : {}),
          }}
        />
      )}

      {overlays.map((overlay, index) => {
        const key = String(index);
        const dataModel = lookupDataModel(overlay);
        const { title, text } = getCardContent(dataModel, overlay);
        if (!title && !text) return null;

        const imageURL = dataModel?.imageURL
          ? cdnImage(dataModel.imageURL)
          : undefined;
        const effectiveOverlayZoom = zoomFitToScreen ? overlayZoom : zoom;

        const showBorder =
          !!dataModel && !BORDERLESS_MODELS.has(overlay.dataModel ?? "");
        const style: CSSProperties = {
          left: `${(overlay.boxXYWH[0] - 1) * effectiveOverlayZoom}px`,
          top: `${(overlay.boxXYWH[1] - 1) * effectiveOverlayZoom}px`,
          width: `${(overlay.boxXYWH[2] + 2) * effectiveOverlayZoom}px`,
          height: `${(overlay.boxXYWH[3] + 2) * effectiveOverlayZoom}px`,
          border: showBorder
            ? `${effectiveOverlayZoom * 4}px solid rgba(255, 255, 0, 0.2)`
            : undefined,
        };

        const overlayMaxWidth =
          OVERLAY_MAX_WIDTHS[overlay.dataModel ?? ""] ??
          DEFAULT_OVERLAY_MAX_WIDTH;

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

const BORDERLESS_MODELS = new Set([
  "FactionModel",
  "StrategyCardModel",
  "UnitModel",
  "ExploreModel",
]);

function getCardContent(
  dataModel: OverlayDataModel | undefined,
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
      return { title: dataModel.name, text: dataModel.text || "" };
    }
  }

  return { title, text };
}

const useOverlay = (gameId: string) => {
  const { data: overlays = [] } = useOverlayData(gameId);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooltipDelay = isMobileDevice() ? 0 : 600;

  const handleMouseEnter = (key: string) => {
    tooltipTimer.current = setTimeout(
      () => setActiveTooltip(key),
      tooltipDelay,
    );
  };

  const handleMouseLeave = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setActiveTooltip(null);
  };

  return {
    overlays,
    activeTooltip,
    handleMouseEnter,
    handleMouseLeave,
  };
};

const DEFAULT_OVERLAY_MAX_WIDTH = 250;
const OVERLAY_MAX_WIDTHS: Record<string, number> = {
  TechnologyModel: 350,
  SecretObjectiveModel: 250,
  RelicModel: 250,
  PublicObjectiveModel: 250,
  LeaderModel: 250,
  UnitModel: 350,
  StrategyCardModel: 350,
};

const DATA_MODEL_LOOKUPS: Record<string, (id: string) => unknown> = {
  AbilityModel: (id) => abilities.find((a) => a.id === id),
  PublicObjectiveModel: (id) => publicObjectives.find((o) => o.alias === id),
  SecretObjectiveModel: (id) => secretObjectives.find((o) => o.alias === id),
  PromissoryNoteModel: (id) => promissoryNotes.find((p) => p.alias === id),
  RelicModel: (id) => relics.find((r) => r.alias === id),
  ExploreModel: (id) => explorations.find((e) => e.id === id),
  LeaderModel: (id) => leaders.find((l) => l.id === id),
  UnitModel: (id) => units.find((u) => u.id === id),
  TechnologyModel: (id) => technologies.find((t) => t.alias === id),
  BreakthroughModel: (id) => breakthroughs.find((b) => b.alias === id),
  StrategyCardModel: (id) => getStrategyCardById(id),
  AgendaModel: (id) => agendas.find((a) => a.alias === id),
};

function lookupDataModel({
  dataModel,
  dataModelID,
}: OverlayData): OverlayDataModel | undefined {
  if (!dataModel || !dataModelID) return undefined;
  return DATA_MODEL_LOOKUPS[dataModel]?.(dataModelID) as
    | OverlayDataModel
    | undefined;
}
