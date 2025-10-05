import { PlayerData } from "@/data/types";
import { Box, Text, Stack } from "@mantine/core";
import styles from "./Expeditions.module.css";
import SingleExpedition from "./SingleExpedition";

interface ExpeditionsProps {
    playerData: PlayerData[];
}

export default function Expeditions({ playerData }: ExpeditionsProps) {
    return (
        <Box>
            <Text className={styles.sectionTitle}>Expeditions</Text>
            <Stack gap="sm">
                {playerData.map((player) => {
                    return <SingleExpedition expeditionImage="" factionName={player.faction}/>
                })}
            </Stack>
        </Box>
    );
}