import { Box, Text, Stack, Group, Divider } from "@mantine/core";
import type { SecretSection } from "@/domains/cards/model/secretObjectiveProcessor";
import styles from "./SecretModal.module.css";

type Props = {
  sections: SecretSection[];
};

type SecretItemProps = SecretSection["items"][number];

function SecretItem({ name, text, phase, phaseColor }: SecretItemProps) {
  return (
    <Box className={`${styles.secretItem} ${styles[phaseColor]}`}>
      <Stack gap="xs">
        <Group gap="xs" align="center">
          <Text className={styles.secretName}>{name}</Text>
          <Text className={`${styles.phaseText} ${styles[phaseColor]}`}>
            {phase}
          </Text>
        </Group>
        <Text className={styles.secretText}>{text}</Text>
      </Stack>
    </Box>
  );
}

function SecretSection({ title, count, items, phaseColor }: SecretSection) {
  return (
    <Stack gap="xs">
      <Text className={`${styles.sectionTitle} ${styles[phaseColor]}`}>
        {title} ({count})
      </Text>
      <Stack gap="2px">
        {items.map((item) => (
          <SecretItem key={item.name} {...item} />
        ))}
      </Stack>
    </Stack>
  );
}

export function SecretModal({ sections }: Props) {
  const visibleSections = sections.filter(
    (section) => section.items.length > 0
  );

  return (
    <Box p="sm" className={styles.container}>
      <Stack gap="sm">
        {visibleSections.map((section, index) => (
          <div key={section.title}>
            <SecretSection {...section} />
            {index < visibleSections.length - 1 && (
              <Divider c="gray.7" opacity={0.3} />
            )}
          </div>
        ))}
      </Stack>
    </Box>
  );
}
