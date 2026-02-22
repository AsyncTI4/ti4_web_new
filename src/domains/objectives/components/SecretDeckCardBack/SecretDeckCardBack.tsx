import { Stack, Modal } from "@mantine/core";
import { useState } from "react";
import { Cardback } from "@/domains/player/components/Cardback";
import { cdnImage } from "@/entities/data/cdnImage";
import { SecretDeckDetailsCard } from "@/domains/player/components/SecretDeckDetailsCard";
import { PlayerData } from "@/entities/data/types";
import styles from "./SecretDeckCardBack.module.css";

type Props = {
  deck: string[];
  discard: string[];
  playerData: PlayerData[];
};

export function SecretDeckCardBack({ deck, discard, playerData }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Stack className={`${styles.card}`} onClick={() => setOpened(true)}>
        <Cardback
          src={cdnImage("/player_area/cardback_secret.jpg")}
          alt="secret objectives"
          count={deck?.length ?? 0}
          size="lg"
        />
      </Stack>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Not Scored Secrets"
        size="xl"
        centered
        styles={{
          content: {
            background:
              "linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)",
          },
          header: {
            background: "transparent",
            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
          },
          title: {
            color: "white",
            fontWeight: 600,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
          },
          close: {
            color: "white",
          },
        }}
      >
        <SecretDeckDetailsCard
          deck={deck}
          discard={discard}
          playerData={playerData}
        />
      </Modal>
    </>
  );
}
