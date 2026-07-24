import { Group, Stack, Text } from "@mantine/core";
import classes from "./DetailsCard.module.css";

type Props = {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  caption?: string;
  captionColor?: "blue" | "yellow" | "red" | "orange";
};

function DetailsCardTitle({
  title,
  subtitle,
  icon,
  caption,
  captionColor = "blue",
}: Props) {
  return (
    <Group gap="md" align="center">
      {icon && icon}
      <Stack gap={4} flex={1}>
        <Text size="lg" fw={700} c="white" lh={1.2} className={classes.cardTitle}>
          {title}
        </Text>
        <Text span className={classes.cardSubtitle}>
          {subtitle}
        </Text>
        {caption && (
          <Text size="xs" c={`${captionColor}.3`} fw={600} tt="uppercase">
            {caption}
          </Text>
        )}
      </Stack>
    </Group>
  );
}

export default DetailsCardTitle;
