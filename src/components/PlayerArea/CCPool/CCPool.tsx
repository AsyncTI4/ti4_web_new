import { Stack, Text, Box } from "@mantine/core";
import { Surface } from "../Surface";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
};

export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
}: Props) {
  return (
    
                <Stack
                  gap={2}
                  align="center"
                  justify="center"
                  pos="relative"
                  h="100%"
                  style={{ zIndex: 1 }}
                >
                {props.playerData.ccReinf !== undefined && (
                  <CommandTokenCard
                    color={color}
                    faction={faction}
                    reinforcements={props.playerData.ccReinf}
                    totalCapacity={16}
                  />
                )}
                  <Text
                    ff="mono"
                    size="sm"
                    fw={600}
                    c="white"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {tacticalCC}/{fleetCC + mahactEdict.length}
                    {mahactEdict.length > 0 ? "*" : ""}/{strategicCC}
                  </Text>
                </Stack>
  );
}
