import { LeaderChip, type LeaderChipProps } from "./LeaderChip";

type Props = Omit<LeaderChipProps, "variant">;

export function Leader(props: Props) {
  return <LeaderChip {...props} />;
}
