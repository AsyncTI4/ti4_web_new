import {  Text } from "@mantine/core";

type Props = {
  tacticalCC: number;
  fleetCC: number;
  strategicCC: number;
  mahactEdict?: string[];
};

export function CCPool({
  tacticalCC,
  fleetCC,
  strategicCC,
  mahactEdict = [],
}: Props) {
  return (
        <Text
          ff="mono"
          fs={"italic"}
          visibleFrom="sm"
          size="xl"
          fw={400}
          c="gray"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
          }}
        >
          {tacticalCC}/{fleetCC + mahactEdict.length}
          {mahactEdict.length > 0 ? "*" : ""}/{strategicCC}
        </Text>);
}
