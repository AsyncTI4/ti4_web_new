import type { ReactNode } from "react";
import { Module } from "@/shared/ui/primitives/Module/Module";

type Props = {
  className?: string;
  brackets?: boolean;
  density?: "compact" | "flush";
  children: ReactNode;
};

/**
 * One compartment of a player card. Deliberately unlabelled: the contents of
 * each group are self-evident to a player who knows the game, and a card's
 * fixed compartment order means position already identifies the group.
 * Character comes from the plate itself — cut corner, bevel, reticle brackets.
 */
export function Compartment({
  className,
  brackets,
  density = "compact",
  children,
}: Props) {
  return (
    <Module brackets={brackets} density={density} fill className={className}>
      {children}
    </Module>
  );
}
