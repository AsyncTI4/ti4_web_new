import { Box, Text } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";
import { cdnImage } from "../../data/cdnImage";

type LetnevFleetTokenStackProps = {
  count: number;
  colorAlias: string;
  faction: string;
};

export function LetnevFleetTokenStack({
  count,
  colorAlias,
  faction,
}: LetnevFleetTokenStackProps) {
  const totalCount = count + 2; // Always add 2 for Letnev

  return (
    <Box pos="relative">
      <Text ff="heading" pos="absolute" left={0} top={0} fz={24} c="white">
        {totalCount}*
      </Text>
      <Box pos="relative" style={{ height: 65 }}>
        {/* Render blank token when regular count is 0 */}
        {count === 0 && (
          <CommandCounter
            colorAlias="blank"
            style={{
              position: "absolute",
              left: 0,
              zIndex: 1,
            }}
          />
        )}
        {/* Render regular fleet tokens */}
        {Array.from({ length: count }).map((_, index) => (
          <CommandCounter
            key={`letnev-fleet-${index}`}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: index * 20,
              zIndex: index + 1,
            }}
            type="fleet"
          />
        ))}
        {/* Render 2 additional armada tokens */}
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`letnev-armada-${index}`}
            style={{
              position: "absolute",
              left: count * 20 + 20 + index * 20,
              zIndex: count + index + 1,
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={cdnImage(`/command_token/fleet_${colorAlias}.png`)}
                alt={`${faction} armada fleet token`}
              />
              <img
                src={cdnImage("/command_token/fleet_armada.png")}
                alt="armada"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -30%)",
                  height: "45px",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        ))}
      </Box>
    </Box>
  );
}
