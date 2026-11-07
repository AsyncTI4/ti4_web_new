import { cdnImage } from "@/entities/data/cdnImage";
import {
  getOneWayWormholeToken,
  getTokenImagePath,
  getTokenData,
} from "@/entities/lookup/tokens";
import { getAttachmentImagePath } from "@/entities/lookup/attachments";
import { getTokenSprite } from "@/shared/ui/Token/tokenSprites";
import { getRenderedStackFootprint } from "@/entities/geometry/renderedStackGeometry";
import { PositionedSprite } from "./PositionedSprite";
import { OneWayWormholeRing } from "./OneWayWormholeRing";

type TokenProps = {
  tokenId: string;
  faction?: string;
  x: number;
  y: number;
  zIndex: number;
};

export const Token = ({ tokenId, faction, x, y, zIndex }: TokenProps) => {
  const alt = `${faction || "token"} ${tokenId}`;
  const tokenImagePath = getTokenImagePath(tokenId);
  const imagePath = tokenImagePath || getAttachmentImagePath(tokenId);
  if (!imagePath) return null;

  /* The large DMZ token renders at its footprint size to keep it in place. */
  if (tokenId === "dmz_large") {
    const footprint = getRenderedStackFootprint({
      entityId: tokenId,
      entityType: "token",
      count: 1,
    });
    return (
      <img
        src={cdnImage(imagePath)}
        alt={alt}
        style={{
          width: `${footprint.width}px`,
          height: `${footprint.height}px`,
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
      />
    );
  }

  const scale = getTokenData(tokenId)?.scale || 1;
  const transform =
    scale !== 1
      ? `translate(-50%, -50%) scale(${scale})`
      : "translate(-50%, -50%)";

  /* One-way wormholes: the base wormhole token wrapped in the entry/exit ring. */
  const oneWay = getOneWayWormholeToken(tokenId);
  if (oneWay) {
    return (
      <div
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform,
          zIndex,
        }}
      >
        <PositionedSprite
          sprite={getTokenSprite("token", oneWay.baseId)}
          imagePath={imagePath}
          alt={alt}
          style={{ display: "block" }}
        />
        <OneWayWormholeRing direction={oneWay.direction} />
      </div>
    );
  }

  return (
    <PositionedSprite
      sprite={getTokenSprite(tokenImagePath ? "token" : "attachment", tokenId)}
      imagePath={imagePath}
      alt={alt}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform,
        zIndex,
      }}
    />
  );
};
