import {
  getAttachmentData,
  getAttachmentImagePath,
} from "@/entities/lookup/attachments";
import { getTokenSprite } from "@/shared/ui/Token/tokenSprites";
import { PositionedSprite } from "./PositionedSprite";

type AttachmentProps = {
  unitType: string;
  faction?: string;
  x: number;
  y: number;
  zIndex: number;
};

export const Attachment = ({
  unitType,
  faction,
  x,
  y,
  zIndex,
}: AttachmentProps) => {
  const imagePath = getAttachmentImagePath(unitType);
  if (!imagePath) return null;

  const name = getAttachmentData(unitType)?.name || unitType;

  return (
    <PositionedSprite
      sprite={getTokenSprite("attachment", unitType)}
      imagePath={imagePath}
      alt={`${faction || "attachment"} ${name}`}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        zIndex,
      }}
    />
  );
};
