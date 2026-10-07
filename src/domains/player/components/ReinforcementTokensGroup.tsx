import { Group, GroupProps } from "@mantine/core";
import { cdnImage } from "@/entities/data/cdnImage";
import { getTokenImagePath } from "@/entities/lookup/tokens";
import { GhostWormholeTokens } from "./GhostWormholeTokens";
import {
  StackedTokenStrip,
  type StackedTokenStripProps,
} from "./StackedTokenStrip";

type Props = {
  breachTokensReinf?: number;
  sleeperTokensReinf?: number;
  ghostWormholesReinf?: string[];
  galvanizeTokensReinf?: number;
} & GroupProps;

export function ReinforcementTokensGroup({
  breachTokensReinf = 0,
  sleeperTokensReinf = 0,
  ghostWormholesReinf = [],
  galvanizeTokensReinf = 0,
  ...groupProps
}: Props) {
  const hasTokens =
    breachTokensReinf > 0 ||
    sleeperTokensReinf > 0 ||
    ghostWormholesReinf.length > 0 ||
    galvanizeTokensReinf > 0;

  if (!hasTokens) return null;

  const sleeperPath = getTokenImagePath("sleeper");

  return (
    <Group gap={0} wrap="wrap" align="flex-start" {...groupProps}>
      <CountTokenStrip
        count={breachTokensReinf}
        src={cdnImage("/tokens/token_breachActive.webp")}
        alt="Breach Token"
      />
      {sleeperPath && (
        <CountTokenStrip
          count={sleeperTokensReinf}
          src={cdnImage(sleeperPath)}
          alt="Sleeper Token"
        />
      )}
      <GhostWormholeTokens wormholeIds={ghostWormholesReinf} />
      <CountTokenStrip
        count={galvanizeTokensReinf}
        src={cdnImage("/extra/marker_galvanize.png")}
        alt="Galvanize Token"
        horizontalSpacing={18}
        verticalOffset={10}
        tokenWidth={24}
      />
    </Group>
  );
}

type CountTokenStripProps = {
  count: number;
  src: string;
  alt: string;
} & Omit<StackedTokenStripProps, "tokens">;

function CountTokenStrip({ count, src, alt, ...stripProps }: CountTokenStripProps) {
  if (count <= 0) return null;

  const tokens = Array.from({ length: count }, (_, key) => ({ key, src, alt }));
  return <StackedTokenStrip tokens={tokens} {...stripProps} />;
}
