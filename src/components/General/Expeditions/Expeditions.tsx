import { Group, Stack, Text, Image, Box } from "@mantine/core";
import { useFactionColors } from "@/hooks/useFactionColors";
import styles from "./Expeditions.module.css";
import { cdnImage } from "@/data/cdnImage";
import SingleExpedition from "./SingleExpedition";

interface ExpeditionsProps {
  expeditions: any;
}

const EXPEDITION_TYPES = [
  "tradeGoods",
  "fiveRes",
  "fiveInf",
  "techSkip",
  "secret",
  "actionCards",
];

const EXPEDITION_IMAGES = [
  <TradeGoodExpedition />,
  <ResourceExpedition />,
  <InfluenceExpedition />,
  <TechExpedition />,
  <SecretExpedition />,
  <ActionCardExpedition />,
];

export default function Expeditions({ expeditions }: ExpeditionsProps) {
  const factionColorMap = useFactionColors();

  return (
    <Stack>
      <Text className={styles.sectionTitle}>Expeditions</Text>
      {EXPEDITION_TYPES.map((expType, index) => {
        if (
          !expeditions ||
          !expeditions[expType] ||
          expeditions[expType].completedBy === null
        )
          return <></>;

        const factionName =
          factionColorMap[expeditions[expType].completedBy].faction;

        return (
          <SingleExpedition faction={factionName}>
            {EXPEDITION_IMAGES[index]}
          </SingleExpedition>
        );
      })}
    </Stack>
  );
}
          

function TechExpedition() {
  return (
    <Stack>
      <Group>
        <Image
          fit="contain"
          mah={24}
          src="/green.png"
          alt="Tech Skips"
          height={24}
        />
        <Image
          fit="contain"
          mah={24}
          src="/yellow.png"
          alt="Tech Skips"
          style={{ marginLeft: "-20px" }}
        />
      </Group>
      <Group>
        <Image
          fit="contain"
          mah={24}
          src="/red.png"
          alt="Tech Skips"
          style={{ marginTop: "-20px" }}
        />
        <Image
          fit="contain"
          mah={24}
          src="/blue.png"
          alt="Tech Skips"
          height={24}
          style={{
            marginLeft: "-18px",
            marginTop: "-20px",
          }}
        />
      </Group>
    </Stack>
  );
}
function ResourceExpedition() {
  return <Box w={36}><Image fit="contain" mah={36} src={cdnImage("/general/Ressourcesbg.png")} /></Box>;
}
function InfluenceExpedition() {
  return <Box w={36}><Image fit="contain" mah={36} src={cdnImage("/general/Influencebg.png")} /></Box>;
}
function SecretExpedition() {
  return <Box w={36}><Image fit="contain" mah={36} src={cdnImage("/general/Secret_regular.png")} /></Box>;
}
function TradeGoodExpedition() {
  return <Box w={36}><Image fit="contain" mah={36} src={cdnImage("/general/tg3.png")} /></Box>;
}
function ActionCardExpedition() {
  return <Box w={36}><Image fit="contain" mah={36} src={cdnImage("/player_area/cardback_action.jpg")} /></Box>;
}