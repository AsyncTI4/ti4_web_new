import { Box, Text, Image } from "@mantine/core";
import { relics } from "../../../data/relics";
import { RelicCard } from "./RelicCard";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { useState } from "react";
import styles from "./Relic.module.css";

type RelicData = {
  alias: string;
  name: string;
  text: string;
  imageURL: string;
  source: string;
  flavourText: string;
  shortName?: string;
  shrinkName?: boolean;
};

type Props = {
  relicId: string;
};

export function Relic({ relicId }: Props) {
  const [opened, setOpened] = useState(false);

  // Look up relic data
  const relicData = relics.find((relic: RelicData) => relic.alias === relicId);

  if (!relicData) {
    console.warn(`Relic with ID "${relicId}" not found`);
    return null;
  }

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Box
          py={4}
          px={6}
          className={styles.relicCard}
          miw={150}
          style={{ cursor: "pointer" }}
          onClick={() => setOpened((o) => !o)}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "100%",
              position: "relative",
              zIndex: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Image
              src="/relicicon.webp"
              className={styles.relicIcon}
              style={{
                width: "16px",
                height: "16px",
                flexShrink: 0,
              }}
            />
            <Text
              size="sm"
              fw={700}
              c="white"
              style={{
                fontFamily: "SLIDER, monospace",
                textShadow: "0 2px 2px rgba(0, 0, 0, 0.8)",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {relicData.shortName || relicData.name}
            </Text>
          </Box>
        </Box>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <RelicCard relicId={relicId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
