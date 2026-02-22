import { Box, Group, Stack, Image } from "@mantine/core";
import styles from "./Plots.module.css";
import { cdnImage } from "@/entities/data/cdnImage";
import { Chip } from "@/shared/ui/primitives/Chip";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useState } from "react";
import {  PlotCardInfo } from "@/entities/data/types";
import { getPlotCardInfo } from "@/entities/lookup/plots";
import { PlotDetails } from "@/domains/player/components/PlayerArea/PlotDetails";

const plots = [
  {
    identifier: 1,
    name: "attack",
    description: "u atack",
    factions: ["nekro"],
  },
  {
    identifier: 2,
    name: "defend",
    description: "u defend",
    factions: ["muaat", "sol"],
  },
  {
    identifier: 0,
    name: "attack",
    description: "u atack",
    factions: ["nekro"],
  },
  {
    identifier: 3,
    name: "attack",
    description: "u atack",
    factions: ["nekro"],
  },
  {
    identifier: 4,
    name: "defend",
    description: "u defend",
    factions: ["muaat", "sol"],
  },
];

interface PlotsProps {
  // plots: PlotCard[];
  horizontal?: boolean;
}

export default function Plots({  horizontal = false }: PlotsProps) {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);

  const isObsidian = true;
  const Wrapper = horizontal ? Group : Stack;

  return (
    <Wrapper gap={2}>
      {plots.map((plot, index) => {
        const plotCardInfo = getPlotCardInfo(plot.identifier);

        if (!plotCardInfo) return null;

        return (
          <Box>
            <PlotsWithPopover
              key={`plot-${index}`}
              title={isObsidian ? plotCardInfo.name : `Plot ${index + 1}`}
              isObsidian={isObsidian}
              factions={plot.factions}
              plot={plotCardInfo}
              isOpen={selectedPlot === plotCardInfo.name && isObsidian}
              onToggle={(opened) => setSelectedPlot(opened ? plotCardInfo.name : null)}
              onClick={() => setSelectedPlot(plotCardInfo.name)}
            />
          </Box>
        );
      }).sort(() => Math.random() - 0.5)}
    </Wrapper>
  );
}

type PlotsWithPopoverProps = {
  plot: PlotCardInfo;
  factions: string[];
  isObsidian: boolean;
  title: string;
  isOpen: boolean;
  onToggle: (opened: boolean) => void;
  onClick: () => void;
};

function PlotsWithPopover({
  plot,
  factions,
  isObsidian,
  title,
  isOpen,
  onToggle,
  onClick,
}: PlotsWithPopoverProps) {

  return (
    <SmoothPopover opened={isOpen} onChange={onToggle}>
      <SmoothPopover.Target>
        <div onClick={onClick}>
          <Chip
            accent={"gray"}
            leftSection={
              isObsidian ? (
                <Image src={cdnImage("/factions/obsidian.png")} />
              ) : (
                <Image src={cdnImage("/factions/firmament.png")} />
              )
            }
            ribbon
            title={title}
          >
            {factions.map((faction) => (
              <Image
                key={faction}
                w={18}
                h={18}
                src={cdnImage(`/factions/${faction}.png`)}
                className={styles.factionIcon}
              />
            ))}
          </Chip>
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <PlotDetails plot={plot} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
