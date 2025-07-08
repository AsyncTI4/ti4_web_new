import { Box, Text, Stack, Group, Divider } from "@mantine/core";
import styles from "./CardDetailsModal.module.css";

type CardItemData = {
  name: string;
  count: number;
  text: string;
  percentage?: number;
};

type CardSectionData = {
  title: string;
  count: number;
  items: CardItemData[];
};

type Props = {
  sections: CardSectionData[];
  width?: number;
};

function CardItem({ name, count, text, percentage }: CardItemData) {
  return (
    <Box className={styles.cardItem}>
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <Text className={styles.cardName}>{name}</Text>
            <Box className={styles.copyBadge}>{count}</Box>
          </Group>
          {percentage !== undefined && (
            <Box className={styles.percentage}>{percentage.toFixed(2)}%</Box>
          )}
        </Group>
        <Text className={styles.cardText}>{text}</Text>
      </Stack>
    </Box>
  );
}

function CardSection({ title, count, items }: CardSectionData) {
  if (items.length === 0) return null;

  return (
    <Stack gap="xs">
      <Text className={styles.sectionTitle}>
        {title} ({count})
      </Text>
      <Stack gap="2px">
        {items.map((item) => (
          <CardItem key={item.name} {...item} />
        ))}
      </Stack>
    </Stack>
  );
}

export function CardDetailsModal({ sections, width = 450 }: Props) {
  const visibleSections = sections.filter(
    (section) => section.items.length > 0
  );

  return (
    <Box
      pos="relative"
      w={width}
      miw={width}
      p="sm"
      className={styles.container}
    >
      <Stack gap="sm">
        {visibleSections.map((section, index) => (
          <div key={section.title}>
            <CardSection {...section} />
            {index < visibleSections.length - 1 && (
              <Divider c="gray.7" opacity={0.3} />
            )}
          </div>
        ))}
      </Stack>
    </Box>
  );
}
