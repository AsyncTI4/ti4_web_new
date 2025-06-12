import { Stack, Box, Text, Group, Divider, Badge } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "../../../data/types";
import { CircularFactionIcon } from "../../shared/CircularFactionIcon";
import classes from "./LawDetailsCard.module.css";

type Props = {
  law: LawInPlay;
};

export function LawDetailsCard({ law }: Props) {
  return (
    <Box w={320} p="md" className={classes.card}>
      <Stack gap="md">
        {/* Header with law icon and name */}
        <Group gap="md" align="flex-start">
          <Box className={classes.iconContainer}>
            <IconScale size={24} className={classes.icon} />
          </Box>
          <Stack gap={4} flex={1}>
            <Text size="lg" fw={700} c="white" className={classes.title}>
              {law.name}
            </Text>
            <Badge color="gray" size="sm" variant="light">
              {law.type}
            </Badge>
          </Stack>
        </Group>

        <Divider c="gray.7" opacity={0.8} />

        {/* Law Text */}
        <Box>
          <Text size="sm" c="gray.4" mb={4} fw={600}>
            Effect
          </Text>
          <Text size="sm" c="gray.2" className={classes.effectText}>
            {law.text1}
          </Text>
          {law.text2 && law.text2.trim() && (
            <Text size="sm" c="gray.2" className={classes.effectText} mt={8}>
              {law.text2}
            </Text>
          )}
        </Box>

        {/* Map Text */}
        {law.mapText && law.mapText.trim() && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Box>
              <Text size="sm" c="gray.4" mb={4} fw={600}>
                Ongoing Effect
              </Text>
              <Text size="sm" c="gray.2" className={classes.mapText}>
                {law.mapText}
              </Text>
            </Box>
          </>
        )}

        {/* Elected Player */}
        {law.electedFaction && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <Box>
              <Text size="sm" c="gray.4" mb={8} fw={600}>
                Elected Player
              </Text>
              <Group gap="sm" align="center">
                <CircularFactionIcon faction={law.electedFaction} size={24} />
                <Text
                  size="xs"
                  c="gray.4"
                  fw={600}
                  tt="uppercase"
                  style={{ minWidth: 60, letterSpacing: "0.5px" }}
                >
                  {law.electedFaction}
                </Text>
              </Group>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
