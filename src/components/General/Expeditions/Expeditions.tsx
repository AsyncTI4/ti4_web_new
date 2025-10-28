import { PlayerData } from "@/data/types";
import { Box, Text, Stack } from "@mantine/core";
import styles from "./Expeditions.module.css";
import SingleExpedition from "./SingleExpedition";
import inf from "/public/expeditions/inf.png";
import res from "/public/expeditions/res.png";
import actions from "/public/expeditions/actions.png";
import secret from "/public/expeditions/secret.png";
import tech from "/public/expeditions/tech.png";
import tg from "/public/expeditions/tg.png";

interface ExpeditionsProps {
    playerData: PlayerData[];
}

export default function Expeditions({ playerData }: ExpeditionsProps) {

    //for each expedition, return the player who got that expedition
    const expeditionImgs = [res, inf, tg, actions, tech, secret];


    return (
        <Box>
            <Text className={styles.sectionTitle}>Expeditions</Text>
            <Stack gap="sm">
                {expeditionImgs.map((expedition, index) => {
                    return <SingleExpedition expeditionImage={expedition} factionName={playerData[index].faction}/>
                })}
            </Stack>
        </Box>
    );
}