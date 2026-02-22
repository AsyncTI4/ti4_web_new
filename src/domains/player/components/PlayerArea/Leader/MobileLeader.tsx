import { LeaderChip, type LeaderChipProps } from "./LeaderChip";

type Props = Omit<LeaderChipProps, "variant">;

export function MobileLeader(props: Props) {
  return <LeaderChip {...props} variant="mobile" />;
}
