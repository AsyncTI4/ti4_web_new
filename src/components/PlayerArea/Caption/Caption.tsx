import { Text } from "@mantine/core";

type Props = {
  children: React.ReactNode;
  color?: string;
};

export function Caption({ children, color = "gray.3" }: Props) {
  return (
    <Text
      size="xs"
      c={color}
      opacity={0.6}
      fw={700}
      style={{
        textTransform: "uppercase",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
        alignSelf: "flex-start",
        fontSize: "10px",
        lineHeight: 1,
      }}
    >
      {children}
    </Text>
  );
}
