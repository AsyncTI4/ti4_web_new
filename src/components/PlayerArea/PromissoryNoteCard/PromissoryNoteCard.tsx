import { Stack, Box, Image, Divider, Text, Group } from "@mantine/core";
import { getPromissoryNoteData } from "../../../lookup/promissoryNotes";
import { cdnImage } from "../../../data/cdnImage";
import { useFactionColors } from "@/hooks/useFactionColors";
import { DetailsCard } from "@/components/shared/DetailsCard";
import { leaders } from "@/data/leaders";
import { FactionIcon } from "@/components/shared/FactionIcon";

type Props = {
  promissoryNoteId: string;
};

export function PromissoryNoteCard({ promissoryNoteId }: Props) {
  const factionColorMap = useFactionColors();
  const noteData = getPromissoryNoteData(promissoryNoteId, factionColorMap);

  if (!noteData) return null;

  // Use noteData directly; no intermediate displayData object
  const displayName = noteData.noteData.shortName || noteData.displayName;
  const displayText = noteData.noteData.text.replace(
    /<color>/g,
    noteData.color || ""
  );

  // Determine if this is an Alliance PN
  const isAlliance =
    noteData.noteData.alias.includes("_an") ||
    noteData.noteData.name.toLowerCase() === "alliance";

  // Find commander for the faction when Alliance
  const commander = isAlliance
    ? leaders.find(
        (l) => l.faction === noteData.faction && l.type === "commander"
      )
    : undefined;

  const renderIcon = () => (
    <Box
      pos="relative"
      w={60}
      h={60}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image src="/pnicon.png" w={40} />
      {noteData.faction && (
        <Box
          pos="absolute"
          bottom={-4}
          right={-4}
          style={{ background: "rgba(0,0,0,0.5)", borderRadius: 4, padding: 2 }}
        >
          <FactionIcon faction={noteData.faction} w={18} h={18} />
        </Box>
      )}
    </Box>
  );

  return (
    <DetailsCard width={320} color="cyan">
      <Stack gap="md">
        <DetailsCard.Title
          title={displayName}
          subtitle="Promissory Note"
          icon={<DetailsCard.Icon icon={renderIcon()} />}
        />

        <Divider c="gray.7" opacity={0.8} />

        {isAlliance && commander && (
          <>
            <DetailsCard.Section
              content={
                <Stack gap={8}>
                  <Group gap={10} align="center">
                    {(commander.source === "base" ||
                      commander.source === "pok") && (
                      <Box
                        w={36}
                        h={46}
                        style={{ overflow: "hidden", borderRadius: 8 }}
                      >
                        <Image
                          src={`/leaders/${commander.id}.webp`}
                          w={36}
                          h={46}
                        />
                      </Box>
                    )}
                    <Stack gap={0} style={{ flex: 1 }}>
                      <Text size="sm" fw={700} c="white">
                        {commander.name}
                      </Text>
                      <Text size="xs" c="gray.4" fs="italic">
                        Commander Ability
                      </Text>
                    </Stack>
                  </Group>
                  <Stack gap={4} style={{ flex: 1 }}>
                    {commander.abilityWindow && (
                      <Text size="xs" c="blue.3" fw={600} tt="uppercase">
                        {commander.abilityWindow}
                      </Text>
                    )}
                    <Text size="sm" c="gray.2" lh={1.5}>
                      {commander.abilityText}
                    </Text>
                  </Stack>
                </Stack>
              }
            />
            <Divider c="gray.7" opacity={0.8} />
          </>
        )}

        <DetailsCard.Section title="Effect" content={displayText} />
      </Stack>
    </DetailsCard>
  );
}

// Function is now imported from lookup/promissoryNotes
