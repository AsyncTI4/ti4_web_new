import { Group, Stack, SimpleGrid } from "@mantine/core";
import { Leader } from "./Leader";
import { CompactLeader } from "./Leader/CompactLeader";
import compactStyles from "./Leader/CompactLeader.module.css";
import { PhantomLeader } from "./Leader/PhantomLeader";
import { showLeader } from "./Leader/showLeader";
import { getLeaderById } from "@/entities/lookup/leaders";
import { Leader as LeaderType } from "@/entities/data/types";
import { isMobileDevice } from "@/utils/isTouchDevice";

/** Every faction fields exactly one of each, so all three slots always exist. */
const LEADER_SLOTS = ["agent", "commander", "hero"] as const;

type LeaderSlot = (typeof LEADER_SLOTS)[number];

type Props = {
  leaders: LeaderType[];
  faction?: string;
};

export function GridCompactLeaders({ leaders }: { leaders: LeaderType[] }) {
  return (
    <SimpleGrid
      className={compactStyles.grid}
      cols={3}
      spacing={6}
      verticalSpacing={6}
      px={2}
    >
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

export function RegularLeaders({ leaders, faction }: Props) {
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
        (l) => !(l.type === "agent" && nomadAgentIds.includes(l.id))
      )
    : leaders;
  /* A dossier with a portrait is half again as tall as one without, so the empty
     slot has to know which kind of row it is joining. */
  const hasPortraits = otherLeaders.some((leader) => {
    const data = getLeaderById(leader.id);
    return data ? showLeader(data.source) : false;
  });

  return (
    <Stack gap={4} style={{ overflow: "visible" }}>
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

      {/*
        Grouped by slot rather than rendered in data order, which is already
        agent → commander → hero, so a missing leader leaves its gap in the
        right place instead of pushing a phantom to the bottom of the stack.
      */}
      {LEADER_SLOTS.flatMap((slot) => {
        const filled = otherLeaders.filter((leader) => leader.type === slot);
        if (filled.length > 0) {
          return filled.map((leader, index) => (
            <Leader
              key={`${slot}-${leader.id}-${index}`}
              id={leader.id}
              type={slot}
              tgCount={leader.tgCount ?? 0}
              exhausted={leader.exhausted ?? false}
              locked={leader.locked ?? false}
              active={leader.active ?? false}
            />
          ));
        }

        // Nomad's three agents are drawn compactly in the row above, so the
        // agent slot is filled even though no agent is left in otherLeaders.
        if (slot === "agent" && nomadAgents.length > 0) return [];

        // Empty slots steady the desktop band; on a phone they'd be elements
        // paying for nothing.
        if (isMobileDevice()) return [];

        return [
          <PhantomLeader
            key={`phantom-${slot}`}
            type={slot}
            withPortrait={hasPortraits}
          />,
        ];
      })}

      {/* Anything the data reports that isn't one of the three canonical slots
          still gets drawn, after them. */}
      {otherLeaders
        .filter((leader) => !isLeaderSlot(leader.type))
        .map((leader, index) => (
          <Leader
            key={`other-${leader.id}-${index}`}
            id={leader.id}
            type={leader.type as LeaderSlot}
            tgCount={leader.tgCount ?? 0}
            exhausted={leader.exhausted ?? false}
            locked={leader.locked ?? false}
            active={leader.active ?? false}
          />
        ))}
    </Stack>
  );
}

function isLeaderSlot(type: string | undefined): type is LeaderSlot {
  return LEADER_SLOTS.includes(type as LeaderSlot);
}

export function Leaders({ leaders, faction }: Props) {
  const useCompactForAll = leaders.length > 5;
  if (useCompactForAll) {
    return <GridCompactLeaders leaders={leaders} />;
  }
  return <RegularLeaders leaders={leaders} faction={faction} />;
}
