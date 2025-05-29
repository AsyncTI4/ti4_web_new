import { Stack } from "@mantine/core";
import { Leader } from "./Leader";
import { Leader as LeaderType } from "@/data/pbd10242";

type Props = {
  leaders: LeaderType[];
};

export function Leaders({ leaders }: Props) {
  return (
    <Stack gap={4} style={{ overflow: "hidden" }}>
      {leaders.map((leader, index) => (
        <Leader
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
