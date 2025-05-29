import { Box, Image } from "@mantine/core";

type Props = {
  factionIcon: string;
  amount?: number;
};

export function DebtToken({ factionIcon }: Props) {
  return (
    <Box
      pos="relative"
      style={{
        width: 10,
      }}
    >
      <Image
        src="/control/control_gld.png"
        style={{
          width: 32,
          transform: "rotate(90deg)",
        }}
      />
      <Image
        src={factionIcon}
        style={{
          width: 16,
          position: "absolute",
          top: 2,
          left: 6,
        }}
      />
    </Box>
  );
}
