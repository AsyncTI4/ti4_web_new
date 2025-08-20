import { Box, Text, Image, Flex } from "@mantine/core";
import { getRelicData } from "../../../lookup/relics";
import { RelicCard } from "./RelicCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useState } from "react";
import { Shimmer } from "../Shimmer";
import { getGradientClasses } from "../gradientClasses";
import styles from "./Relic.module.css";

type RelicsProps = {
  relics: string[];
};


export function Relics({ relics }: RelicsProps) {

  return ((relics.length > 0) ?
    relics.map((relicId, index) => {
      return <Relic key={index} relicId={relicId} />;
    }) :
    (
      <Flex justify={"center"} align={"center"}>
        <Text
          size="xs"
          c="gray.6"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
            opacity: 0.5,
            fontStyle: "italic"
          }}
        >
          No Relics
        </Text>
      </Flex>
    ));
}



type SingleRelicProps = {
  relicId: string;
};

export function Relic({ relicId }: SingleRelicProps) {
  const [opened, setOpened] = useState(false);3

  const relicData = getRelicData(relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return <></>;
  };


  const gradientClasses = getGradientClasses("yellow");

  return <SmoothPopover opened={opened} onChange={setOpened}>
    <SmoothPopover.Target>
      <Box className={styles.relicCard} onClick={() => setOpened((o) => !o)}>
        <Shimmer
          color="yellow"
          py={2}
          px={6}
          className={gradientClasses.border}
        >
          <Box className={styles.contentContainer}>
            <Image
              src="/relicicon.webp"
              className={`${gradientClasses.iconFilter} ${styles.icon}`}
            />
            <Text
              size="xs"
              fw={700}
              c="white"
              className={styles.textContainer}
            >
              {relicData.shortName || relicData.name}
            </Text>
          </Box>
        </Shimmer>
      </Box>
    </SmoothPopover.Target>
    <SmoothPopover.Dropdown p={0}>
      <RelicCard relicId={relicId} />
    </SmoothPopover.Dropdown>
  </SmoothPopover>;
}
