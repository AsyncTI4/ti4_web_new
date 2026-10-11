import { PhantomSlot } from "@/domains/player/components/PhantomSlot/PhantomSlot";

type Props = {
  /** Accepted for API parity; empty capacity belongs to no tree. */
  techType?: string;
};

/** An empty tech seat: the shared socket. */
export function PhantomTech(props: Props) {
  return <PhantomSlot key={props.techType} />;
}
