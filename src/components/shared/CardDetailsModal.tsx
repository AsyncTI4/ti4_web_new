import { Text, Stack, Divider } from "@mantine/core";
import styles from "./CardDetailsModal.module.css";
import { DetailsCard } from "@/components/shared/DetailsCard";

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
            <div className={styles.copyBadge}>{count}</div>
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

function CardSection({ title, count, items }: CardSectionData) {
  if (items.length === 0) return null;

  return (
    <DetailsCard.Section
      title={`${title} (${count})`}
      content={
        <Stack gap="2px">
          {items.map((item) => (
            <CardItem key={item.name} {...item} />
          ))}
        </Stack>
      }
    />
  );
}

export function CardDetailsModal({ sections, width = 450 }: Props) {
  const visibleSections = sections.filter(
    (section) => section.items.length > 0
  );

  return (
    <DetailsCard
      width={width}
      className={styles.container}
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      {visibleSections.map((section, index) => (
        <div key={section.title}>
          <CardSection {...section} />
          {index < visibleSections.length - 1 && (
            <Divider c="gray.7" opacity={0.3} />
          )}
        </div>
      ))}
    </DetailsCard>
  );
}
