import { Stack, Text, Group, Divider } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { DetailsCard } from "@/shared/ui/DetailsCard";

type Props = {
  law: LawInPlay;
};

export function LawDetailsCard({ law }: Props) {
  return (
    <DetailsCard width={320}>
      <Stack gap="md">
        <DetailsCard.Title
          title={law.name}
          subtitle={law.type}
          icon={<DetailsCard.Icon icon={<IconScale size={24} />} />}
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section
          title="Effect"
          content={
            <Stack gap={8}>
              <Text size="sm" c="gray.2" lh={1.4}>
                {law.text1}
              </Text>
              {law.text2 && law.text2.trim() && (
                <Text size="sm" c="gray.2" lh={1.4}>
                  {law.text2}
                </Text>
              )}
            </Stack>
          }
        />

        {law.mapText && law.mapText.trim() && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <DetailsCard.Section title="Ongoing Effect" content={law.mapText} />
          </>
        )}

        {law.electedFaction && (
          <>
            <Divider c="gray.7" opacity={0.8} />
            <DetailsCard.Section
              title="Elected Player"
              content={
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
              }
            />
          </>
        )}
      </Stack>
    </DetailsCard>
  );
}
