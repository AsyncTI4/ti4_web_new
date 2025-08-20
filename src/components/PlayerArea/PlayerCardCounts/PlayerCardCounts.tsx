import { Group, Stack, Image, Text, Box } from "@mantine/core";
import { Cardback } from "../Cardback";
import { cdnImage } from "../../../data/cdnImage";
import { Chip } from "@/components/shared/primitives/Chip";
import { Shimmer } from "../Shimmer";
import { getGradientClasses } from "../gradientClasses";
import styles from "./PlayerCardCounts.module.css";

type Props = {
  tg: number;
  commodities: number;
  commoditiesTotal: number;
  soCount: number;
  pnCount: number;
  acCount: number;
};

export function PlayerCardCounts({
  tg,
  commodities,
  commoditiesTotal,
  soCount,
  pnCount,
  acCount,
}: Props) {
  return (
    <Group gap={6} justify="center" align="center">
      {[
        {
          src: cdnImage("/player_area/pa_cardbacks_so.png"),
          alt: "secret objectives",
          count: soCount,
        },
        {
          src: "/cardback/cardback_action.png",
          alt: "action cards",
          count: acCount,
        },
        {
          src: cdnImage("/player_area/pa_cardbacks_pn.png"),
          alt: "promissory notes",
          count: pnCount,
        },
      ].map((cardback, index) => (
        <Cardback
          key={index}
          src={cardback.src}
          alt={cardback.alt}
          count={cardback.count}
        />
      ))}

      <Stack gap={4} align="stretch" className={styles.chipStack}>
        {/* Trade Goods Chip */}
        <Chip accent="yellow" className={styles.tgChip} enableHover={false}>
          <Shimmer
            color="yellow"
            px={8}
            py={4}
            className={getGradientClasses("yellow").border}
          >
            <Box className={styles.chipContent}>
              <Image
                src="/tg.png"
                className={`${getGradientClasses("yellow").iconFilter} ${styles.icon}`}
              />
              <Text className={styles.countText}>{tg}</Text>
            </Box>
          </Shimmer>
        </Chip>

        {/* Commodities Chip */}
        <Chip accent="gray" className={styles.commsChip} enableHover={false}>
          <Shimmer
            color="gray"
            px={8}
            py={4}
            className={getGradientClasses("gray").border}
          >
            <Box className={styles.chipContent}>
              <Image
                src="/comms.png"
                className={`${getGradientClasses("gray").iconFilter} ${styles.icon}`}
              />
              <Text className={styles.countText}>
                {commodities}/{commoditiesTotal}
              </Text>
            </Box>
          </Shimmer>
        </Chip>
      </Stack>
    </Group>
  );
}
