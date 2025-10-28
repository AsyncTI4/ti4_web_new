import { cdnImage } from "@/data/cdnImage";
import { Box, Flex, Group, Image, Text } from "@mantine/core";
import styles from "./Expeditions.module.css";

interface SingleExpeditionProps {
  expeditionImage: string;
  factionName: string;
}

export default function SingleExpedition({
  expeditionImage,
  factionName,
}: SingleExpeditionProps) {
  return (
  <Box>
    <Flex gap={4} align="center">
      <Image w={36} h={36} src={expeditionImage} />
      <Flex flex={1} align="center" justify="center" gap={4}>
        <Text>{factionName}</Text>
        <Image
          w={36}
          h={36}
          src={cdnImage(`/factions/${factionName}.png`)}
          className={styles.factionIcon}
        />
      </Flex>
    </Flex>
  </Box>
);
}
