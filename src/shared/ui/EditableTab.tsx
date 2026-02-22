import { Group, TextInput } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import classes from "./EditableTab.module.css";

type EditableTabProps = {
  tabId: string;
  isEditing: boolean;
  onEdit: (tab: string, event: React.MouseEvent) => void;
  onSave: (oldTab: string, newTab: string) => void;
  onRemove: (tab: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  showEditIcon?: boolean;
  showCloseButton?: boolean;
  className?: string;
};

export function EditableTab({
  tabId,
  isEditing,
  onEdit,
  onSave,
  onRemove,
  inputRef,
  showEditIcon = true,
  showCloseButton = true,
  className,
}: EditableTabProps) {
  const displayName = localStorage.getItem(tabId) || tabId;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave(tabId, e.currentTarget.value);
    } else if (e.key === "Escape") {
      onSave(tabId, tabId);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onSave(tabId, e.currentTarget.value);
  };

  const handleRemoveClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove(tabId);
  };

  const handleRemoveKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.stopPropagation();
      onRemove(tabId);
    }
  };

  if (isEditing) {
    return (
      <TextInput
        ref={inputRef}
        size="xs"
        defaultValue={displayName}
        className={classes.tabInput}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoFocus
      />
    );
  }

  return (
    <Group gap="xs" className={className}>
      <span className={classes.tabText}>{displayName}</span>
      {showEditIcon && (
        <IconPencil
          size={14}
          className={classes.editIcon}
          onClick={(event: React.MouseEvent) => onEdit(tabId, event)}
        />
      )}
      {showCloseButton && (
        <div
          className={classes.closeButton}
          onClick={handleRemoveClick}
          role="button"
          tabIndex={0}
          onKeyDown={handleRemoveKeyDown}
        >
          ×
        </div>
      )}
    </Group>
  );
}
