import { Stack, Text, Image } from "@mantine/core";
import cx from "clsx";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { PlanetAbilityDetailsCard } from "./PlanetAbilityDetailsCard";
import styles from "./PlanetAbilityCard.module.css";
import { cdnImage } from "@/entities/data/cdnImage";

type Props = {
  planetId: string;
  abilityName: string;
  abilityText: string;
  actionCards?: string[];
  exhausted?: boolean;
  joinedRight?: boolean;
};

export function PlanetAbilityCard({
  planetId,
  abilityName,
  abilityText,
  actionCards,
  exhausted = false,
  joinedRight = false,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <Stack
          onClick={toggle}
          className={cx(
            styles.mainStack,
            styles.abilityCard,
            joinedRight && styles.joinedRight,
            exhausted && styles.exhausted
          )}
        >
          <Stack className={styles.bottomStack}>
            <Image
              src={cdnImage("/planet_cards/pc_legendary_rdy.png")}
              className={styles.legendaryIcon}
            />
            <div style={{ flex: 1 }} />
            <Text className={styles.planetName}>Ability</Text>
          </Stack>
        </Stack>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown>
        <PlanetAbilityDetailsCard
          planetId={planetId}
          abilityName={abilityName}
          abilityText={abilityText}
          actionCards={actionCards}
        />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
