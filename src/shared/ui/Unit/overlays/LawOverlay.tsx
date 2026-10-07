import { cdnImage } from "@/entities/data/cdnImage";

type LawOverlayProps = {
  tokenPath: string;
  alt: string;
};

export function LawOverlay({ tokenPath, alt }: LawOverlayProps) {
  return (
    <img
      src={cdnImage(tokenPath)}
      alt={alt}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
      }}
    />
  );
}
