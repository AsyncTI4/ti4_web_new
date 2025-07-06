import { Stack } from "@mantine/core";
import { useState } from "react";
import { Cardback } from "../../PlayerArea/Cardback";
import { cdnImage } from "@/data/cdnImage";
import { SmoothPopover } from "../../shared/SmoothPopover";
import { ExplorationDetailsCard } from "../ExplorationDetailsCard";
import styles from "./ExplorationCardBack.module.css";

type Props = {
  type: string;
  deck: string[];
  discard: string[];
};

export function ExplorationCardBack({ type, deck, discard }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          className={`${styles.card}`}
          onClick={() => setOpened((o) => !o)}
        >
          <Cardback key={type} src={cdnImage(`/player_area/cardback_${type.toLowerCase()}.jpg`)} alt={`${type} explore`} count={deck?.length ?? 0} size="lg"/>
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown className={styles.popoverDropdown}>
        <ExplorationDetailsCard type={type} deck={deck} discard={discard} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
