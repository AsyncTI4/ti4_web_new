import { Box, Group, Text } from "@mantine/core";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Shimmer } from "../Shimmer/Shimmer";
import { getGradientClasses, type ColorKey } from "../gradientClasses";
import { Chip } from "@/components/shared/primitives/Chip";
import { SC_NUMBER_COLORS } from "../../../data/strategyCardColors";
import styles from "./StrategyCardBanner.module.css";
import { SmoothPopover } from "@/components/shared/SmoothPopover";
import { StrategyCardDetailsCard } from "../StrategyCardDetailsCard";
import { IconX } from "@tabler/icons-react";

interface Props {
  number: number;
  text: string;
  color: string;
  isExhausted?: boolean;
}

export function StrategyCardBanner({
  number,
  text,
  color,
  isExhausted = false,
}: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const numberColor =
    SC_NUMBER_COLORS[color as keyof typeof SC_NUMBER_COLORS] || "red.9";
  const gradientClasses = getGradientClasses(color as ColorKey);

  return (
    <SmoothPopover opened={opened} onChange={setOpened} position="bottom">
      <SmoothPopover.Target>
        <Group className={styles.container}>
          <Chip accent={color as any} onClick={toggle}>
            <Shimmer
              color={color as any}
              className={`${styles.strategyCardBanner} ${styles[color as keyof typeof styles]} ${gradientClasses.border}`}
            >
              {/* Additional subtle inner glow overlay */}
              <Box
                className={`${styles.innerGlow} ${styles[color as keyof typeof styles]}`}
              />

              <Box
                className={`${styles.iconFilter} ${styles.iconWithBorder} ${styles[color as keyof typeof styles]}`}
              >
                <Text
                  ff="heading"
                  c={numberColor}
                  className={styles.numberText}
                >
                  {number}
                </Text>
                {isExhausted && (
                  <IconX
                    size={14}
                    stroke={3}
                    color="var(--mantine-color-red-6)"
                    style={{ marginLeft: 6 }}
                  />
                )}
              </Box>
              <Text ff="heading" className={styles.cardText}>
                {text}
              </Text>
            </Shimmer>
          </Chip>
        </Group>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <StrategyCardDetailsCard initiative={number} color={color as any} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
