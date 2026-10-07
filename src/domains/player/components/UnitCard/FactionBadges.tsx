import { Box, Image } from "@mantine/core";
import { getFactionImage } from "@/entities/lookup/factions";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";

const factionIconSrc = (faction: string) =>
  getFactionImage(faction.toLowerCase());

type FactionBadgeProps = {
  faction: string;
  className: string;
  iconClassName: string;
};

export function FactionBadge({
  faction,
  className,
  iconClassName,
}: FactionBadgeProps) {
  return (
    <Box className={className}>
      <Image
        {...lowPriorityImageProps}
        src={factionIconSrc(faction)}
        className={iconClassName}
      />
    </Box>
  );
}

type UpgradeFactionBadgesProps = {
  factions?: string[];
  /** Horizontal step between overlapping badges, in px. */
  step: number;
  classNames: { container: string; badge: string; icon: string };
};

export function UpgradeFactionBadges({
  factions,
  step,
  classNames,
}: UpgradeFactionBadgesProps) {
  if (!factions || factions.length === 0) return null;

  return (
    <Box className={classNames.container}>
      {factions.map((faction, index) => (
        <Box
          key={faction}
          className={classNames.badge}
          style={{ right: index * step }}
        >
          <Image
            {...lowPriorityImageProps}
            src={factionIconSrc(faction)}
            className={classNames.icon}
          />
        </Box>
      ))}
    </Box>
  );
}
