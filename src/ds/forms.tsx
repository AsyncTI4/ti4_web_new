import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { Select as BaseSelect } from "@base-ui/react/select";
import { NumberField } from "@base-ui/react/number-field";
import { Field } from "@base-ui/react/field";
import cx from "clsx";
import { useId, type CSSProperties, type ReactNode, type Ref } from "react";
import { Box, type BoxProps } from "./Box";
import { CheckIcon } from "./buttons";
import { getPortalRoot } from "./overlays";
import type { SizeKey } from "./styleProps";
import classes from "./ds.module.css";

/* ── Tabs ─────────────────────────────────────────────────────────────── */

type TabsRootProps = Omit<BoxProps, "onChange" | "defaultValue"> & {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  variant?: "default" | "pills";
  orientation?: "horizontal" | "vertical";
  keepMounted?: boolean;
  radius?: SizeKey;
};

function TabsRoot({ value, defaultValue, onChange, variant = "default", orientation, keepMounted: _k, radius: _r, className, children, ...props }: TabsRootProps) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onChange?.(v as string | null)}
      orientation={orientation}
      render={<Box {...props} />}
      className={cx(classes.tabs, classes[`tabs_${variant}`], className)}
      data-variant={variant}
    >
      {children}
    </BaseTabs.Root>
  );
}

function TabsList({ grow, className, children, ref, ...props }: BoxProps & { grow?: boolean; justify?: string; ref?: Ref<HTMLDivElement> }) {
  const { justify, ...rest } = props as BoxProps & { justify?: string };
  return (
    <BaseTabs.List
      ref={ref}
      render={<Box {...rest} />}
      className={cx(classes.tabsList, grow && classes.tabsListGrow, className)}
      style={{ justifyContent: justify, ...rest.style }}
    >
      {children}
    </BaseTabs.List>
  );
}

function TabsTab({
  value,
  leftSection,
  rightSection,
  className,
  children,
  disabled,
  ...props
}: Omit<BoxProps, "value"> & { value: string; leftSection?: ReactNode; rightSection?: ReactNode; disabled?: boolean }) {
  return (
    <BaseTabs.Tab
      value={value}
      disabled={disabled}
      render={<Box component="button" {...props} />}
      className={cx(classes.tab, className)}
    >
      {leftSection ? <span className={classes.tabSection}>{leftSection}</span> : null}
      {children !== undefined && children !== null ? <span className={classes.tabLabel}>{children}</span> : null}
      {rightSection ? <span className={classes.tabSection}>{rightSection}</span> : null}
    </BaseTabs.Tab>
  );
}

function TabsPanel({ value, keepMounted = true, className, children, ...props }: Omit<BoxProps, "value"> & { value: string; keepMounted?: boolean }) {
  return (
    <BaseTabs.Panel value={value} keepMounted={keepMounted} render={<Box {...props} />} className={cx(classes.tabsPanel, className)}>
      {children}
    </BaseTabs.Panel>
  );
}

export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab: TabsTab, Panel: TabsPanel });

/* ── Switch ───────────────────────────────────────────────────────────── */

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Receives an event-like object so `e.currentTarget.checked` keeps working. */
  onChange?: (event: { currentTarget: { checked: boolean }; target: { checked: boolean } }) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: SizeKey;
  color?: string;
  disabled?: boolean;
  labelPosition?: "left" | "right";
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<"root" | "track" | "thumb" | "label" | "description" | "body", string>>;
  id?: string;
  "aria-label"?: string;
};

/** An on/off toggle with an optional label and description. */
export function Switch({ checked, defaultChecked, onChange, label, description, size = "sm", disabled, labelPosition = "right", className, style, classNames = {}, id, ...aria }: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  const control = (
    <BaseSwitch.Root
      id={switchId}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onCheckedChange={(c) => onChange?.({ currentTarget: { checked: c }, target: { checked: c } })}
      className={cx(classes.switchTrack, classes[`switch_${size}`], classNames.track)}
      aria-label={aria["aria-label"]}
    >
      <BaseSwitch.Thumb className={cx(classes.switchThumb, classNames.thumb)} />
    </BaseSwitch.Root>
  );
  if (!label && !description) return <span className={cx(classes.switchRoot, className, classNames.root)} style={style}>{control}</span>;
  return (
    <div className={cx(classes.switchRoot, labelPosition === "left" && classes.switchLeft, className, classNames.root)} style={style} data-disabled={disabled || undefined}>
      {control}
      <label htmlFor={switchId} className={cx(classes.switchBody, classNames.body)}>
        {label ? <span className={cx(classes.switchLabel, classNames.label)}>{label}</span> : null}
        {description ? <span className={cx(classes.switchDescription, classNames.description)}>{description}</span> : null}
      </label>
    </div>
  );
}

/* ── SegmentedControl ─────────────────────────────────────────────────── */

type SegItem = string | { label: ReactNode; value: string; disabled?: boolean };

export type SegmentedControlProps = {
  data: SegItem[];
  value?: string;
  onChange?: (value: string) => void;
  size?: SizeKey;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  color?: string;
  radius?: SizeKey;
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
};

/** One choice from a short set, shown all at once. */
export function SegmentedControl({ data, value, onChange, size = "sm", fullWidth, disabled, className, style, orientation, ...aria }: SegmentedControlProps) {
  const items = data.map((d) => (typeof d === "string" ? { label: d, value: d } : d));
  return (
    <div
      role="radiogroup"
      aria-label={aria["aria-label"]}
      className={cx(classes.segmented, fullWidth && classes.segmentedFull, orientation === "vertical" && classes.segmentedVertical, classes[`control_${size}`], className)}
      style={style}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="radio"
          aria-checked={value === item.value}
          data-active={value === item.value || undefined}
          disabled={disabled || item.disabled}
          className={classes.segment}
          onClick={() => onChange?.(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ── Field wrapper ────────────────────────────────────────────────────── */

type FieldChrome = {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  size?: SizeKey;
  className?: string;
  style?: CSSProperties;
  w?: number | string;
  maw?: number | string;
  flex?: CSSProperties["flex"];
};

function FieldFrame({ label, description, error, required, className, style, w, maw, flex, children }: FieldChrome & { children: ReactNode }) {
  return (
    <Field.Root className={cx(classes.field, className)} style={{ width: w, maxWidth: maw, flex, ...style }} invalid={Boolean(error)}>
      {label ? (
        <Field.Label className={classes.fieldLabel}>
          {label}
          {required ? <span className={classes.fieldRequired}> *</span> : null}
        </Field.Label>
      ) : null}
      {description ? <Field.Description className={classes.fieldDescription}>{description}</Field.Description> : null}
      {children}
      {error ? <Field.Error className={classes.fieldError} match>{error}</Field.Error> : null}
    </Field.Root>
  );
}

/* ── Select / MultiSelect ─────────────────────────────────────────────── */

type Option = string | { label: string; value: string; disabled?: boolean };
function normalize(data: Option[]) {
  return data.map((d) => (typeof d === "string" ? { label: d, value: d } : d));
}

export type SelectProps = FieldChrome & {
  data: Option[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  allowDeselect?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  comboboxProps?: unknown;
  checkIconPosition?: string;
  "aria-label"?: string;
};

/** Pick one option from a list. */
export function Select({ data, value, defaultValue, onChange, placeholder = "Select", disabled, size = "sm", ...chrome }: SelectProps) {
  const items = normalize(data);
  return (
    <FieldFrame {...chrome} size={size}>
      <BaseSelect.Root items={items} value={value} defaultValue={defaultValue} onValueChange={(v) => onChange?.(v)} disabled={disabled}>
        <BaseSelect.Trigger className={cx(classes.input, classes.selectTrigger, classes[`control_${size}`])} aria-label={chrome["aria-label"]}>
          <BaseSelect.Value className={classes.selectValue} placeholder={placeholder} />
          <BaseSelect.Icon className={classes.selectIcon}>▾</BaseSelect.Icon>
        </BaseSelect.Trigger>
        <SelectPopup items={items} />
      </BaseSelect.Root>
    </FieldFrame>
  );
}

function SelectPopup({ items }: { items: { label: string; value: string; disabled?: boolean }[] }) {
  return (
    <BaseSelect.Portal container={getPortalRoot()}>
      <BaseSelect.Positioner className={classes.selectPositioner} sideOffset={4} alignItemWithTrigger={false}>
        <BaseSelect.Popup className={classes.selectPopup}>
          <BaseSelect.List>
            {items.map((item) => (
              <BaseSelect.Item key={item.value} value={item.value} disabled={item.disabled} className={classes.selectItem}>
                <BaseSelect.ItemIndicator className={classes.selectCheck}>
                  <CheckIcon size={11} />
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export type MultiSelectProps = Omit<SelectProps, "value" | "defaultValue" | "onChange"> & {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  maxValues?: number;
  hidePickedOptions?: boolean;
};

/** Pick several options; the trigger lists them as compact tags. */
export function MultiSelect({ data, value, defaultValue, onChange, placeholder = "Select", disabled, size = "sm", ...chrome }: MultiSelectProps) {
  const items = normalize(data);
  const labelOf = (v: string) => items.find((i) => i.value === v)?.label ?? v;
  return (
    <FieldFrame {...chrome} size={size}>
      <BaseSelect.Root multiple items={items} value={value} defaultValue={defaultValue} onValueChange={(v) => onChange?.((v) ?? [])} disabled={disabled}>
        <BaseSelect.Trigger className={cx(classes.input, classes.selectTrigger, classes.multiTrigger)}>
          <BaseSelect.Value className={classes.selectValue}>
            {(selected: string[] | null) =>
              selected && selected.length ? (
                <span className={classes.tags}>
                  {selected.map((v) => (
                    <span key={v} className={classes.tag}>{labelOf(v)}</span>
                  ))}
                </span>
              ) : (
                <span className={classes.placeholder}>{placeholder}</span>
              )
            }
          </BaseSelect.Value>
          <BaseSelect.Icon className={classes.selectIcon}>▾</BaseSelect.Icon>
        </BaseSelect.Trigger>
        <SelectPopup items={items} />
      </BaseSelect.Root>
    </FieldFrame>
  );
}

/* ── TextInput / NumberInput ──────────────────────────────────────────── */

export type TextInputProps = FieldChrome &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    ref?: Ref<HTMLInputElement>;
    classNames?: Partial<Record<"input" | "root" | "wrapper", string>>;
    variant?: string;
  };

export function TextInput({ label, description, error, required, size = "sm", className, style, w, maw, flex, leftSection, rightSection, classNames = {}, variant: _v, ...input }: TextInputProps) {
  return (
    <FieldFrame label={label} description={description} error={error} required={required} className={cx(className, classNames.root)} style={style} w={w} maw={maw} flex={flex}>
      <div className={cx(classes.inputWrap, classNames.wrapper)}>
        {leftSection ? <span className={classes.inputSectionL}>{leftSection}</span> : null}
        <Field.Control
          {...input}
          required={required}
          className={cx(classes.input, classes[`control_${size}`], leftSection && classes.inputHasL, rightSection && classes.inputHasR, classNames.input)}
        />
        {rightSection ? <span className={classes.inputSectionR}>{rightSection}</span> : null}
      </div>
    </FieldFrame>
  );
}

export type NumberInputProps = FieldChrome & {
  value?: number | string;
  defaultValue?: number;
  onChange?: (value: number | string) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
};

export function NumberInput({ value, defaultValue, onChange, min, max, step = 1, disabled, placeholder, size = "sm", ...chrome }: NumberInputProps) {
  return (
    <FieldFrame {...chrome} size={size}>
      <NumberField.Root
        value={typeof value === "number" ? value : value === "" || value === undefined ? null : Number(value)}
        defaultValue={defaultValue}
        onValueChange={(v) => onChange?.(v ?? "")}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      >
        <NumberField.Group className={classes.numberGroup}>
          <NumberField.Decrement className={classes.numberStep} aria-label="Decrease">−</NumberField.Decrement>
          <NumberField.Input className={cx(classes.input, classes.numberInput, classes[`control_${size}`])} placeholder={placeholder} />
          <NumberField.Increment className={classes.numberStep} aria-label="Increase">+</NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </FieldFrame>
  );
}
