import { Group, GroupProps } from "@mantine/core";
import { BreachTokens } from "./BreachTokens";
import { SleeperTokens } from "./SleeperTokens";
import { GhostWormholeTokens } from "./GhostWormholeTokens";
import { GalvanizeTokens } from "./GalvanizeTokens";

export type ReinforcementTokensGroupProps = {
  breachTokensReinf?: number;
  sleeperTokensReinf?: number;
  ghostWormholesReinf?: string[];
  galvanizeTokensReinf?: number;
} & GroupProps;

export function ReinforcementTokensGroup({
  breachTokensReinf,
  sleeperTokensReinf,
  ghostWormholesReinf,
  galvanizeTokensReinf,
  ...groupProps
}: ReinforcementTokensGroupProps) {
  const hasTokens =
    (breachTokensReinf && breachTokensReinf > 0) ||
    (sleeperTokensReinf && sleeperTokensReinf > 0) ||
    (ghostWormholesReinf && ghostWormholesReinf.length > 0) ||
    (galvanizeTokensReinf && galvanizeTokensReinf > 0);

  if (!hasTokens) return null;

  return (
    <Group gap={0} wrap="wrap" align="flex-start" {...groupProps}>
      {breachTokensReinf && breachTokensReinf > 0 && (
        <BreachTokens count={breachTokensReinf} />
      )}
      {sleeperTokensReinf && sleeperTokensReinf > 0 && (
        <SleeperTokens count={sleeperTokensReinf} />
      )}
      {ghostWormholesReinf && ghostWormholesReinf.length > 0 && (
        <GhostWormholeTokens wormholeIds={ghostWormholesReinf} />
      )}
      {galvanizeTokensReinf && galvanizeTokensReinf > 0 && (
        <GalvanizeTokens count={galvanizeTokensReinf} />
      )}
    </Group>
  );
}
