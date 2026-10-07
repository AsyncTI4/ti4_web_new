import { Box, Text } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";
import type { ReactNode } from "react";

type FleetTokenStackBaseProps = {
  label: ReactNode;
  baseCount: number;
  colorAlias: string;
  faction: string;
  counterType?: "command" | "fleet";
  showBlankToken?: boolean;
  extraTokens?: ReactNode;
};

/** Horizontal step between stacked tokens. */
export const FLEET_TOKEN_STEP = 20;

export function FleetTokenStackBase({
  label,
  baseCount,
  colorAlias,
  faction,
  counterType = "fleet",
  showBlankToken = false,
  extraTokens,
}: FleetTokenStackBaseProps) {
  return (
    <Box pos="relative">
      <Text ff="heading" pos="absolute" left={0} top={0} fz={24} c="white">
        {label}
      </Text>
      <Box pos="relative" style={{ height: 65 }}>
        {showBlankToken && (
          <CommandCounter
            colorAlias="blank"
            style={{
              position: "absolute",
              left: 0,
              zIndex: 1,
            }}
          />
        )}

        {Array.from({ length: baseCount }).map((_, index) => (
          <CommandCounter
            key={`fleet-token-${index}`}
            colorAlias={colorAlias}
            faction={faction}
            style={{
              position: "absolute",
              left: index * FLEET_TOKEN_STEP,
              zIndex: index + 1,
            }}
            type={counterType}
          />
        ))}

        {extraTokens}
      </Box>
    </Box>
  );
}
