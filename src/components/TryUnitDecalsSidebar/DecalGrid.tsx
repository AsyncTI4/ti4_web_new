import React from "react";
import { Box, SimpleGrid } from "@mantine/core";
import { cdnImage } from "@/data/cdnImage";
import { DECAL_IDS } from "@/data/decalIds";
import classes from "../TryUnitDecalsSidebar.module.css";

type Props = {
  selectedFaction: string;
  decalOverrides: Record<string, string>;
  playerDecalId: string | undefined;
  onDecalClick: (decalId: string) => void;
};

const PREVIEW_UNIT_TYPE = "dn"; // destroyer
const PREVIEW_COLOR_SUFFIX = "_wht"; // white text

export function DecalGrid({
  selectedFaction,
  decalOverrides,
  playerDecalId,
  onDecalClick,
}: Props) {
  const overrideDecalId = decalOverrides[selectedFaction];

  return (
    <SimpleGrid cols={4} spacing="xs">
      {DECAL_IDS.map((decalId) => {
        const isSelected =
          (overrideDecalId !== undefined && overrideDecalId === decalId) ||
          (overrideDecalId === undefined && playerDecalId === decalId);

        return (
          <Box
            key={decalId}
            className={`${classes.decalItem} ${
              isSelected ? classes.selected : ""
            }`}
            onClick={() => onDecalClick(decalId)}
          >
            <img
              src={cdnImage(
                `/decals/${decalId}_${PREVIEW_UNIT_TYPE}${PREVIEW_COLOR_SUFFIX}.png`
              )}
              className={classes.decalImage}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </Box>
        );
      })}
    </SimpleGrid>
  );
}

