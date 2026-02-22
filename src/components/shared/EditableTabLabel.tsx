import { TextInput, type TextInputProps } from "@mantine/core";
import type { ReactNode, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import type { TabLabelEditingApi } from "@/hooks/useTabLabelEditing";

type EditableTabLabelProps = {
  tabId: string;
  editingApi: Pick<
    TabLabelEditingApi,
    "editingTabId" | "inputRef" | "getDisplayName" | "handleInputKeyDown" | "handleInputBlur"
  >;
  renderDisplay: (displayName: string) => ReactNode;
  inputProps?: EditableTabLabelInputProps;
};

type EditableTabLabelInputProps = Omit<TextInputProps, "ref" | "defaultValue"> & {
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
};

export function EditableTabLabel({
  tabId,
  editingApi,
  renderDisplay,
  inputProps,
}: EditableTabLabelProps) {
  const {
    editingTabId,
    inputRef,
    getDisplayName,
    handleInputKeyDown,
    handleInputBlur,
  } = editingApi;

  const {
    onClick,
    onKeyDown,
    onBlur,
    autoFocus = true,
    size,
    ...restInputProps
  } = inputProps ?? {};

  if (editingTabId === tabId) {
    return (
      <TextInput
        ref={inputRef}
        size={size ?? "xs"}
        defaultValue={getDisplayName(tabId)}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        onKeyDown={(event) => {
          handleInputKeyDown(tabId, event);
          onKeyDown?.(event);
        }}
        onBlur={(event) => {
          handleInputBlur(tabId, event);
          onBlur?.(event);
        }}
        autoFocus={autoFocus}
        {...restInputProps}
      />
    );
  }

  return <>{renderDisplay(getDisplayName(tabId))}</>;
}
