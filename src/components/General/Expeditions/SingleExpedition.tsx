import { cdnImage } from "@/data/cdnImage";
import { Box, Group, Image, Text } from "@mantine/core";
import styles from "./Expeditions.module.css";

interface SingleExpeditionProps {
    expeditionImage: string,
    factionName: string
}

export default function SingleExpedition({ expeditionImage, factionName }: SingleExpeditionProps) {
    return (
        <Box>
            <Group gap={4}>
                <Image src={cdnImage(`/factions/${expeditionImage}.png`)} />
                <Text>
                    {factionName}
                </Text>
                <Image
                    w={36}
                    h={36}
                    src={cdnImage(`/factions/${factionName}.png`)}
                    className={styles.factionIcon}
                />
            </Group>
        </Box>
    );
}