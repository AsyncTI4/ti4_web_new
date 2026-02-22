import { Box, type BoxProps } from "@mantine/core";

type Props = BoxProps & {
  children: React.ReactNode;
};

export function SectionBlock({ children, className, ...boxProps }: Props) {
  return (
    <Box {...boxProps} className={className}>
      {children}
    </Box>
  );
}


