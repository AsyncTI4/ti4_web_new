import type { ComponentProps, ReactNode } from "react";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderCompact } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";
import type { PlayerCardLayoutFields } from "./getPlayerCardLayoutFields";

export type PlayerCardShellProps = {
  player: PlayerCardLayoutFields;
  factionImageUrl?: string | null;
  variant?: ComponentProps<typeof PlayerCardHeaderCompact>["variant"];
  headerOverrides?: Partial<ComponentProps<typeof PlayerCardHeaderCompact>>;
  boxProps?: Omit<
    ComponentProps<typeof PlayerCardBox>,
    "children" | "color" | "faction"
  >;
  children: ReactNode;
};

export function PlayerCardShell({
  player,
  factionImageUrl,
  variant = "compact",
  headerOverrides,
  boxProps,
  children,
}: PlayerCardShellProps) {
  const baseHeaderProps: ComponentProps<typeof PlayerCardHeaderCompact> = {
    userName: player.userName,
    faction: player.faction,
    color: player.color,
    factionImageUrl: factionImageUrl ?? "",
    variant,
    isSpeaker: player.isSpeaker,
    scs: player.scs,
    exhaustedSCs: player.exhaustedSCs,
    passed: player.passed,
    active: player.active,
  };

  return (
    <PlayerCardBox
      color={player.color}
      faction={player.faction}
      {...boxProps}
    >
      <PlayerCardHeaderCompact
        {...baseHeaderProps}
        {...headerOverrides}
      />
      {children}
    </PlayerCardBox>
  );
}
