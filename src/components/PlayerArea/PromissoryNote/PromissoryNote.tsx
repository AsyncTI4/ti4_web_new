import { Group, Text, Image } from "@mantine/core";
import { Shimmer } from "../Shimmer";

type Props = {
  name: string;
  factionIcon?: string;
  isOtherFaction?: boolean;
};

export function PromissoryNote({
  name,
  factionIcon,
  isOtherFaction = false,
}: Props) {
  const shimmerColor = isOtherFaction ? "cyan" : "blue";

  return (
    <Shimmer color={shimmerColor} py={2} px={6}>
      <Group gap="xs" align="center" wrap="nowrap" style={{ minWidth: 0 }}>
        <Image src="/pnicon.png" style={{ width: "20px", flexShrink: 0 }} />
        <Text
          size="xs"
          fw={700}
          c="white"
          flex={1}
          style={{
            fontFamily: "SLIDER, monospace",
            textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
          }}
        >
          {name}
        </Text>
        {factionIcon && (
          <Image
            src={factionIcon}
            style={{
              width: "20px",
              flexShrink: 0,
            }}
          />
        )}
      </Group>
    </Shimmer>
  );
}
