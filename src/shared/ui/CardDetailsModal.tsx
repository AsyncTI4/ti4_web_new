import { Box, Text, Stack, Divider } from "@mantine/core";
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
  showCounts?: boolean;
};

function CardItem({
  name,
  count,
  text,
  percentage,
  showCount,
}: CardItemData & { showCount: boolean }) {
  return (
    <div className={styles.cardItem}>
      <Stack gap="xs">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <Text className={styles.cardName}>{name}</Text>
            {showCount && <div className={styles.copyBadge}>{count}</div>}
          </div>
          {percentage !== undefined && (
            <div className={styles.percentage}>{percentage?.toFixed(2)}%</div>
          )}
        </div>
        <Text className={styles.cardText}>{text}</Text>
      </Stack>
    </div>
  );
}

function CardSection({
  title,
  count,
  items,
  showCounts,
}: CardSectionData & { showCounts: boolean }) {
  if (items.length === 0) return null;

  return (
    <Box>
      <Text className={styles.sectionTitle}>{title} ({count})</Text>
      <Box className={styles.cardGrid}>
        {items.map((item) => (
          <CardItem key={item.name} {...item} showCount={showCounts} />
        ))}
      </Box>
    </Box>
  );
}

export function CardDetailsModal({ sections, showCounts = true }: Props) {
  const visibleSections = sections.filter(
    (section) => section.items.length > 0
  );

  return (
    <Stack className={styles.container} gap="sm">
      {visibleSections.map((section, index) => (
        <div key={section.title}>
          <CardSection {...section} showCounts={showCounts} />
          {index < visibleSections.length - 1 && (
            <Divider c="gray.7" opacity={0.3} />
          )}
        </div>
      ))}
    </Stack>
  );
}
