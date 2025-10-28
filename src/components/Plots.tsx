import { Box, Group, Stack, Image } from "@mantine/core";
import { Cardback } from "./PlayerArea/Cardback";
import styles from "./Plots.module.css";
import { cdnImage } from "@/data/cdnImage";

interface PlotsProps {

}

export default function Plots({ }: PlotsProps) {
    const plotback = "";
    const plots = [
            {
                name: "1",
                tokens: ["nekro"]
            },
            {
                name: "1",
                tokens: ["muaat"]
            }
    ];

    return (<Box>
        <Group>
            {plots.map((plot, index) => (<Box>
                <Group>
                    <Cardback
                        key={index}
                        src={cdnImage(`/factions/${plotback}.png`)}
                        alt={plotback}
                        count={index}
                        addBorder={true}
                        size="sm"
                    />
                    {plot.tokens.map((faction) => (<Image
                        w={36}
                        h={36}
                        src={cdnImage(`/factions/${faction}.png`)}
                        className={styles.factionIcon}
                    />))}
                </Group>
            </Box>))}
        </Group>
    </Box>);
}