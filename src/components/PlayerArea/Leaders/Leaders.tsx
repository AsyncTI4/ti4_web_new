import { Group, Stack, SimpleGrid } from "@mantine/core";
import { Leader } from "../Leader";
import { CompactLeader } from "../Leader/CompactLeader";
import { Leader as LeaderType } from "@/data/types";
import { MobileLeader } from "../Leader/MobileLeader";
import { isMobileDevice } from "@/utils/isTouchDevice";

type Props = {
  leaders: LeaderType[];
  faction?: string;
  mobile?: boolean;
};

export function GridCompactLeaders({ leaders }: { leaders: LeaderType[] }) {
  return (
    <SimpleGrid cols={3} spacing={6} verticalSpacing={6} px={2}>
      {leaders.map((leader, index) => (
        <CompactLeader
          key={`compact-${leader.id}-${index}`}
          id={leader.id}
          exhausted={leader.exhausted ?? false}
          locked={leader.locked ?? false}
          active={leader.active ?? false}
        />
      ))}
    </SimpleGrid>
  );
}

export function RegularLeaders({ leaders, faction, mobile = false }: Props) {
  const isNomad = faction === "nomad";
  const nomadAgentIds = [
    "nomadagentartuno",
    "nomadagentmercer",
    "nomadagentthundarian",
  ];
  const nomadAgents = isNomad
    ? leaders.filter((l) => l.type === "agent" && nomadAgentIds.includes(l.id))
    : [];
  const otherLeaders = isNomad
    ? leaders.filter(
        (l) => !(l.type === "agent" && nomadAgentIds.includes(l.id)),
      )
    : leaders;

  const LeaderComponent = mobile ? MobileLeader : Leader;

  return (
    <Stack gap={4} style={{ overflow: "hidden" }}>
      {isNomad && nomadAgents.length > 0 && (
        <Group p={2} gap={6} wrap="nowrap" align="center">
          {nomadAgentIds
            .map((id) => nomadAgents.find((l) => l.id === id))
            .filter(Boolean)
            .map((leader, index) => (
              <CompactLeader
                key={`nomad-compact-${leader!.id}-${index}`}
                id={leader!.id}
                exhausted={leader!.exhausted ?? false}
                locked={leader!.locked ?? false}
                active={leader!.active ?? false}
              />
            ))}
        </Group>
      )}

      {otherLeaders.map((leader, index) => (
        <LeaderComponent
          key={index}
          id={leader.id}
          type={leader.type as "agent" | "commander" | "hero"}
          tgCount={leader.tgCount ?? 0}
          exhausted={leader.exhausted ?? false}
          locked={leader.locked ?? false}
          active={leader.active ?? false}
        />
      ))}
    </Stack>
  );
}

export function Leaders({ leaders, faction, mobile = false }: Props) {
  const useCompactForAll = leaders.length > 5;
  if (useCompactForAll) {
    return <GridCompactLeaders leaders={leaders} />;
  }
  return <RegularLeaders leaders={leaders} faction={faction} mobile={mobile} />;
}
