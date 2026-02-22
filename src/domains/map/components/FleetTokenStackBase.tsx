import { Box, Text } from "@mantine/core";
import { CommandCounter } from "./CommandCounter";
import { ReactNode } from "react";

type FleetTokenStackBaseProps = {
  label: ReactNode;
  baseCount: number;
  colorAlias: string;
  faction: string;
  counterType?: "command" | "fleet";
  showBlankToken?: boolean;
  blankTokenColorAlias?: string;
  renderExtraTokens?: (context: { baseCount: number }) => ReactNode;
};

export function FleetTokenStackBase({
  label,
  baseCount,
  colorAlias,
  faction,
  counterType = "fleet",
  showBlankToken = false,
  blankTokenColorAlias = "blank",
  renderExtraTokens,
}: FleetTokenStackBaseProps) {
  return (
    <Box pos="relative">
      <Text ff="heading" pos="absolute" left={0} top={0} fz={24} c="white">
        {label}
      </Text>
      <Box pos="relative" style={{ height: 65 }}>
        {showBlankToken && (
          <CommandCounter
            colorAlias={blankTokenColorAlias}
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
              left: index * 20,
              zIndex: index + 1,
            }}
            type={counterType}
          />
        ))}

        {renderExtraTokens?.({ baseCount })}
      </Box>
    </Box>
  );
}
