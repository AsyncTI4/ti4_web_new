import { cdnImage } from "@/data/cdnImage";
import { Box, Flex, Image, Text } from "@mantine/core";

interface SingleExpeditionProps {
  children: any;
  faction: string;
}

export default function SingleExpedition({
  children,
  faction,
}: SingleExpeditionProps) {
  return (
    <Box>
      <Flex gap={4} align="center">
          {children}
        <Flex flex={1} align="center" justify="center" gap={4}>
          <Text
            size="sm"
            span
            ml={4}
            opacity={0.9}
            c="white"
            ff="text"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            }}
          >
            {faction}
          </Text>
          <Image w={36} h={36} src={cdnImage(`/factions/${faction}.png`)} />
        </Flex>
      </Flex>
    </Box>
  );
}