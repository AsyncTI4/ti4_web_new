import { Group } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { generateColorGradient } from "@/entities/lookup/colors";
import type { EnrichedTab } from "@/domains/tabs/hooks/useTabManagement";
import classes from "./HeaderMenu.module.css";

export function factionTabStyle(factionColor?: string | null) {
  if (!factionColor) return undefined;
  return {
    border: "2px solid",
    borderImage: `${generateColorGradient(factionColor, 0.3)} 1`,
    boxShadow: "inset 0 0 0 1px rgba(100, 116, 139, 0.4)",
  };
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
