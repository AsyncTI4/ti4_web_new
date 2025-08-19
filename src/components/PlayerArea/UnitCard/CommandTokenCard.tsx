import { Image } from "@mantine/core";
import { colors } from "../../../data/colors";
import styles from "./UnitCard.module.css";
import { cdnImage } from "../../../data/cdnImage";
import { BaseCard } from "./BaseCard";

type Props = {
  color?: string;
  faction?: string;
  reinforcements: number;
  totalCapacity: number;
  compact?: boolean;
};

export function CommandTokenCard({
  color,
  faction,
  reinforcements,
  totalCapacity,
  compact,
}: Props) {
  const colorAlias = getColorAlias(color);

  return (
      <div style={{ position: "relative" }}>
        <Image
          src={cdnImage(`/command_token/command_${colorAlias}.png`)}
          alt={`${faction || "command"} command token`}
          className={compact ? styles.unitImageCompact : styles.unitImage}
        />
        {faction && (
          <Image
            src={cdnImage(`/factions/${faction.toLowerCase()}.png`)}
            alt={`${faction} faction`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -30%)",
              height: "16px",
              width: "16px",
              zIndex: 1,
            }}
          />
        )}
      </div>
  );
}

// Helper function to get color alias from color name
const getColorAlias = (color?: string) => {
  if (!color) return "pnk"; // default fallback

  const colorData = colors.find(
    (solidColor) =>
      solidColor.name === color.toLowerCase() ||
      solidColor.aliases.includes(color.toLowerCase()) ||
      solidColor.alias === color.toLowerCase()
  );

  return colorData?.alias || "pnk"; // fallback to pink if not found
};
