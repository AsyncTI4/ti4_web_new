import { cdnImage } from "@/entities/data/cdnImage";

export function DecalImage({ path }: { path?: string }) {
  if (!path) return null;
  return (
    <img
      src={cdnImage(`/decals/${path}`)}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
      }}
    />
  );
}
