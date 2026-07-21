import { cdnImage } from "@/entities/data/cdnImage";
import { Box, Flex, Image, Text } from "@mantine/core";
import styles from "./SingleExpedition.module.css";

type SingleExpeditionProps = {
  children: any;
  /** null when completed by a player the viewer can't identify (FoW) - shows a generic
   * "Unidentified" placeholder instead of the faction name/icon, same as the greyed-out
   * anonymous token used for unidentified objective scorers. */
  faction: string | null;
};

export default function SingleExpedition({
  children,
  faction,
}: SingleExpeditionProps) {
  return (
    <Box>
      <Flex gap={4} align="center">
          {children}
        <Flex flex={1} align="center" justify="center" gap={4}>
          {faction ? (
            <>
              <Text
                size="sm"
                span
                ml={4}
                opacity={0.9}
                c="white"
                ff="text"
                className={styles.factionText}
              >
                {faction}
              </Text>
              <Image w={36} h={36} src={cdnImage(`/factions/${faction}.png`)} />
            </>
          ) : (
            <>
              <Text
                size="sm"
                span
                ml={4}
                opacity={0.8}
                c="gray.4"
                fs="italic"
                className={styles.unidentifiedText}
              >
                Unidentified
              </Text>
              <Box w={36} h={36} className={styles.unidentifiedToken} />
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
