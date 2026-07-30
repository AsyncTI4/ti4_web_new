import { useFactionTokenImage } from "@/hooks/useFactionTokenImage";

type Props = {
  faction: string;
  x: number;
  y: number;
};

export function PlanetOwnerBadge({ faction, x, y }: Props) {
  const factionIcon = useFactionTokenImage(faction);
  if (!factionIcon) return null;

  return (
    <span
      title={`${faction} controls this planet`}
      style={{
        position: "absolute",
        left: x + 40,
        top: y + 36,
        width: 60,
        height: 60,
        transform: "translate(-50%, -50%)",
        display: "grid",
        placeItems: "center",
        border: "3px solid rgba(255, 255, 255, 0.86)",
        borderRadius: "50%",
        background: "rgba(8, 12, 20, 0.9)",
        boxShadow:
          "0 3px 10px rgba(0, 0, 0, 0.78), 0 0 0 1px rgba(0, 0, 0, 0.55)",
        pointerEvents: "none",
        zIndex: "calc(var(--z-control-token) + 20)",
      }}
    >
      <img
        src={factionIcon}
        alt={`${faction} faction`}
        style={{
          width: 44,
          height: 44,
          objectFit: "contain",
          filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.75))",
        }}
      />
    </span>
  );
}
