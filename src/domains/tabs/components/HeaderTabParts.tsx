import { Group } from "@/ds";
import { IconPencil } from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { getPrimaryColorWithOpacity } from "@/entities/lookup/colors";
import type { EnrichedTab } from "@/domains/tabs/hooks/useTabManagement";
import classes from "./HeaderMenu.module.css";

export function factionTabStyle(factionColor?: string | null) {
  if (!factionColor) return undefined;
  return {
    "--tab-faction": getPrimaryColorWithOpacity(factionColor, 0.8),
  } as React.CSSProperties;
}

export function TabFactionIcon({
  tab,
  size,
}: {
  tab: EnrichedTab | undefined;
  size: number;
}) {
  if (!tab?.faction) return null;
  return (
    <CircularFactionIcon
      faction={tab.faction}
      size={size}
      factionImageOverride={tab.factionImage}
      factionImageTypeOverride={tab.factionImageType}
    />
  );
}

function CloseTabButton({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={classes.closeButton}
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        onClose();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      ×
    </div>
  );
}

/** Rename pencil, plus a close button for tabs the user opened themselves. */
export function TabActions({
  tab,
  onEdit,
  onClose,
}: {
  tab: EnrichedTab;
  onEdit: (event: React.MouseEvent) => void;
  onClose: () => void;
}) {
  return (
    <Group gap="xs">
      <IconPencil size={14} className={classes.editIcon} onClick={onEdit} />
      {!tab.isManaged && <CloseTabButton onClose={onClose} />}
    </Group>
  );
}
