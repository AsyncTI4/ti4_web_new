import { Stack } from "@mantine/core";
import { useState } from "react";
import { Cardback } from "../../PlayerArea/Cardback";
import { cdnImage } from "@/data/cdnImage";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { RelicDeckDetailsCard } from "../../PlayerArea/RelicDeckDetailsCard";
import styles from "./RelicDeckCardBack.module.css";

type Props = {
  deck: string[];
  discard: string[];
};

export function RelicDeckCardBack({ deck, discard }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          className={`${styles.card}`}
          onClick={() => setOpened((o) => !o)}
        >
          <Cardback
            src={cdnImage("/player_area/cardback_relic.jpg")}
            alt="relics"
            count={deck?.length ?? 0}
            size="lg"
          />
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
        <RelicDeckDetailsCard deck={deck} discard={discard} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
