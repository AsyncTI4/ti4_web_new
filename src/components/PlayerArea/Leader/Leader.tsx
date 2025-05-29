import { Group, Stack, Text, Image, Box } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { Shimmer } from "../Shimmer";
import { leaders } from "../../../data/leaders";

type Props = {
  id: string;
  type: "agent" | "commander" | "hero";
  tgCount: number;
  exhausted: boolean;
  locked: boolean;
  active: boolean;
};

export function Leader({ id, type, exhausted, locked }: Props) {
  const leaderData = getLeaderData(id);
  if (!leaderData) return null;

  const shouldShowGreen = !exhausted && !locked;

  const LeaderContent = () => (
    <Group gap={8} pos="relative" align="center" wrap="nowrap">
      <Image src={`/leaders/${id}.webp`} style={imageStyles} />
      <Stack gap={0}>
        <Text
          size="sm"
          fw={700}
          c={shouldShowGreen ? "white" : "gray.4"}
          style={{
            ...textOverflowStyles,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
          }}
        >
          {leaderData.name}
        </Text>
        <Text
          size="xs"
          c={shouldShowGreen ? "green.3" : "gray.5"}
          fw={500}
          opacity={0.8}
          tt="capitalize"
          style={textOverflowStyles}
        >
          {type}
        </Text>
      </Stack>
      {locked && (
        <Box
          pos="absolute"
          top={-12}
          right={-12}
          bg="gray.7"
          p={4}
          display="flex"
          style={{
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconLock size={16} color="white" stroke={2.5} />
        </Box>
      )}
    </Group>
  );

  if (shouldShowGreen) {
    return (
      <Shimmer color="green" p={2} px="sm">
        <LeaderContent />
      </Shimmer>
    );
  }

  return (
    <Box
      p={2}
      px="sm"
      bg="linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(107, 114, 128, 0.05) 100%)"
      style={{
        borderRadius: "var(--mantine-radius-sm)",
        border: "1px solid #6b7280",
      }}
      opacity={exhausted ? 0.5 : 1}
    >
      <LeaderContent />
    </Box>
  );
}

const imageStyles = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  objectFit: "cover" as const,
  objectPosition: "center",
};

const textOverflowStyles = {
  overflow: "hidden",
  whiteSpace: "nowrap" as const,
  textOverflow: "clip",
};

const getLeaderData = (leaderId: string) => {
  return leaders.find((leader) => leader.id === leaderId);
};
